import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { PropertyService } from '../services/property.service';
import { Queue, Job } from 'bull';
import { InjectQueue, Process } from '@nestjs/bull';

@Injectable()
export class PropertyIndexingJob {
    constructor(
        private elasticsearchService: ElasticsearchService,
        private propertyService: PropertyService,
        @InjectQueue('property-indexing') private indexingQueue: Queue,
        // private notificationService: NotificationService // Assuming this service exists or will be added
    ) { }

    // Index new properties immediately when created
    async indexNewProperty(propertyId: string) {
        const property = await this.propertyService.findOneWithRelations(propertyId);

        if (!property) {
            console.error(`Property not found: ${propertyId}`);
            return;
        }

        await this.elasticsearchService.indexProperty(property);
        console.log(`Indexed new property: ${propertyId}`);
    }

    // Update index when property is modified
    async updatePropertyIndex(propertyId: string) {
        const property = await this.propertyService.findOneWithRelations(propertyId);

        if (!property) {
            // Property was deleted
            await this.elasticsearchService.deleteProperty(propertyId);
            console.log(`Deleted property from index: ${propertyId}`);
            return;
        }

        await this.elasticsearchService.indexProperty(property);
        console.log(`Updated property index: ${propertyId}`);
    }

    // Full reindex job (runs weekly)
    @Cron(CronExpression.EVERY_WEEK)
    async fullReindex() {
        console.log('Starting full reindex...');
        const startTime = Date.now();

        try {
            // Get all active properties in batches
            const batchSize = 1000;
            let offset = 0;
            let totalIndexed = 0;

            while (true) {
                const properties = await this.propertyService.findAllWithRelations({
                    skip: offset,
                    take: batchSize
                });

                if (properties.length === 0) break;

                // Bulk index batch
                await this.elasticsearchService.bulkIndexProperties(properties);

                totalIndexed += properties.length;
                offset += batchSize;

                console.log(`Indexed ${totalIndexed} properties...`);

                // Small delay to avoid overwhelming Elasticsearch
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const duration = Date.now() - startTime;
            console.log(`Full reindex complete. Indexed ${totalIndexed} properties in ${duration}ms`);

            // Send notification
            await this.sendReindexNotification(totalIndexed, duration);

        } catch (error) {
            console.error('Full reindex failed:', error);
            await this.sendReindexErrorNotification(error);
        }
    }

    // Incremental reindex (runs hourly)
    @Cron(CronExpression.EVERY_HOUR)
    async incrementalReindex() {
        console.log('Starting incremental reindex...');

        // Get properties modified in last 2 hours (1 hour + buffer)
        const since = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const modifiedProperties = await this.propertyService.findModifiedSince(since);

        if (modifiedProperties.length === 0) {
            console.log('No properties modified since last run');
            return;
        }

        console.log(`Found ${modifiedProperties.length} modified properties`);

        // Batch index
        await this.elasticsearchService.bulkIndexProperties(modifiedProperties);

        console.log(`Incremental reindex complete. Updated ${modifiedProperties.length} properties`);
    }

    // Reindex properties with new Vastu analyses
    @Cron('*/30 * * * *') // Every 30 minutes
    async reindexVastuUpdates() {
        // Find properties with Vastu analyses completed in last hour
        const since = new Date(Date.now() - 60 * 60 * 1000);
        const properties = await this.propertyService.findWithRecentVastuAnalysis(since);

        if (properties.length === 0) return;

        console.log(`Reindexing ${properties.length} properties with new Vastu analyses`);
        await this.elasticsearchService.bulkIndexProperties(properties);
    }

    // Reindex properties with new climate reports
    @Cron('0 2 * * *') // Daily at 2 AM
    async reindexClimateUpdates() {
        // Climate reports expire after 30 days
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const properties = await this.propertyService.findWithRecentClimateReport(yesterday);

        if (properties.length === 0) return;

        console.log(`Reindexing ${properties.length} properties with new climate reports`);
        await this.elasticsearchService.bulkIndexProperties(properties);
    }

    // Sync view counts and favorites
    @Cron('*/5 * * * *') // Every 5 minutes
    async syncEngagementMetrics() {
        // Get properties with significant engagement changes
        const changedProperties = await this.propertyService.findPropertiesWithEngagementChanges();

        if (changedProperties.length === 0) return;

        // Update only the engagement metrics in Elasticsearch (partial update)
        for (const property of changedProperties) {
            await this.elasticsearchService.client.update({
                index: 'properties',
                id: property.property_id,
                body: {
                    doc: {
                        view_count: property.view_count,
                        favorite_count: property.favorite_count,
                        updated_at: new Date()
                    }
                },
                retry_on_conflict: 3
            });
        }

        console.log(`Updated engagement metrics for ${changedProperties.length} properties`);
    }

    // Queue-based indexing processor
    @Process('index-property')
    async processIndexJob(job: Job) {
        const { propertyId, action } = job.data;

        try {
            if (action === 'index') {
                await this.indexNewProperty(propertyId);
            } else if (action === 'update') {
                await this.updatePropertyIndex(propertyId);
            } else if (action === 'delete') {
                await this.elasticsearchService.deleteProperty(propertyId);
            }

            return { success: true, propertyId };
        } catch (error) {
            console.error(`Indexing job failed for property ${propertyId}:`, error);
            throw error; // Will trigger retry
        }
    }

    private async sendReindexNotification(count: number, duration: number) {
        // Send to monitoring system (Slack, PagerDuty, etc.)
        /*
        await this.notificationService.send({
          channel: 'engineering',
          message: `✅ Full Elasticsearch reindex completed\nProperties: ${count}\nDuration: ${Math.round(duration / 1000)}s`,
          severity: 'info'
        });
        */
    }

    private async sendReindexErrorNotification(error: any) {
        /*
        await this.notificationService.send({
          channel: 'engineering-alerts',
          message: `🚨 Full Elasticsearch reindex FAILED\nError: ${error.message}`,
          severity: 'error'
        });
        */
    }
}
