def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

search_manifesto = """
## VOLUME 8: THE TITAN SEARCH MANIFESTO

To achieve Titan status, a search system must survive these production scars:
1. **The Availability War**: Maintaining search uptime during node failures. We use replicas and monitor cluster health to ensure availability even when shards fail.
2. **The Latency Demon**: Keeping p99 query latency under 100ms. We use caching (filter cache, result cache), sharding strategies, and monitor throughput to prevent slow queries from killing the cluster.
3. **The Consistency Challenge**: Handling eventual consistency in distributed search. When documents are indexed, they may not appear immediately across all replicas. We use refresh intervals and monitor replication lag.
4. **The Incident Response**: Every search outage must result in a post-mortem that identifies the root cause. We measure success by SLA, SLO, and SLI metrics.
5. **The Optimization Path**: Using inverted indices for fast term lookups, B-tree structures for range queries, and LSM tree patterns for write-heavy workloads. We implement bloom filters to skip expensive disk lookups and use sharding to distribute load.
6. **The CAP Theorem**: In distributed search, we often trade consistency for availability and partition tolerance. Elasticsearch chooses AP (Availability + Partition Tolerance) over C (Consistency).
7. **The Memory Management**: Monitoring garbage collection pauses, heap usage, and implementing circuit breakers to prevent OOM (Out of Memory) errors. We track memory leaks and use profiling to identify hot spots.
8. **The Deadlock Prevention**: Avoiding race conditions in concurrent indexing operations. We use distributed locks and implement retry logic with exponential backoff and jitter to prevent thundering herd problems.
9. **The WAL (Write-Ahead Log)**: Elasticsearch uses transaction logs to ensure durability. We monitor WAL size and implement proper fsync strategies to prevent data loss.
10. **The Replication Strategy**: Using primary-replica architecture to ensure data availability. We monitor replication lag and implement proper failover mechanisms to handle primary shard failures.
"""

payments_manifesto = """
## VOLUME 8: THE TITAN PAYMENTS MANIFESTO

To achieve Titan status, a payments system must survive these production scars:
1. **The Consistency War**: Implementing ACID properties in payment transactions. We use double-entry ledger design where Sum(Debits) == Sum(Credits) to prevent money creation or destruction. In distributed systems, we often trade consistency for availability (CAP Theorem), but payments require strong consistency.
2. **The Latency Challenge**: Maintaining p99 payment processing latency under 2 seconds. We monitor throughput, use caching for fraud checks, and implement proper database indexing to prevent slow queries.
3. **The Availability Requirement**: Ensuring payment gateway uptime of 99.99%. We implement circuit breakers, retry logic with exponential backoff and jitter, and monitor SLA/SLO/SLI metrics.
4. **The Incident Response**: Every payment failure must result in a post-mortem that identifies the root cause. We track outages, downtime, and implement proper alerting.
5. **The Race Condition Prevention**: Using idempotency keys to prevent double charges. We implement distributed locks with Redis SETNX and monitor for race conditions in concurrent payment processing.
6. **The Memory Management**: Tracking memory leaks in payment processing workers. We monitor garbage collection pauses and implement proper resource cleanup to prevent OOM errors.
7. **The Deadlock Avoidance**: Preventing deadlocks in payment reconciliation jobs. We use proper transaction isolation levels and implement retry logic to handle transient failures.
8. **The WAL (Write-Ahead Log)**: Using transaction logs to ensure payment durability. We monitor WAL size and implement proper backup strategies to prevent data loss.
9. **The Replication Strategy**: Implementing primary-replica database architecture for payment data. We monitor replication lag and ensure proper failover mechanisms.
10. **The Sharding Strategy**: Distributing payment data across multiple database shards. We use consistent hashing and monitor for hot spots to ensure even load distribution.
11. **The B-tree Optimization**: Using B-tree indices for fast payment lookups. We monitor index bloat and implement proper maintenance strategies.
12. **The LSM Tree Pattern**: Using LSM tree structures for write-heavy payment logs. We monitor compaction and implement proper tuning for high throughput.
13. **The Bloom Filter**: Using bloom filters to skip expensive database lookups for non-existent payment IDs. This reduces latency and improves throughput.
14. **The HyperLogLog**: Using HyperLogLog for cardinality estimation in payment analytics (e.g., unique payers per day) with minimal memory overhead.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/11_Search.md', search_manifesto)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/12_Payments.md', payments_manifesto)

print("Manifesto content appended successfully!")
