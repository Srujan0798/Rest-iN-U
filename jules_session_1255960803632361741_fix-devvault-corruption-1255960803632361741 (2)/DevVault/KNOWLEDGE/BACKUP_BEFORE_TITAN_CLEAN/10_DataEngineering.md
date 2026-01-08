# DATAENGINEERING
## Table of Contents

- [TABLE OF CONTENTS](#table-of-contents)
- [Production-Grade ETL, Data Pipelines, and Streaming](#production-grade-etl-data-pipelines-and-streaming)
- [?? DATA ENGINEERING PATTERNS](#-data-engineering-patterns)
- [ETL vs ELT](#etl-vs-elt)
- [Data Pipeline Patterns](#data-pipeline-patterns)
  - [Batch Processing](#batch-processing)
  - [Stream Processing](#stream-processing)
- [Data Quality](#data-quality)
  - [Validation Rules](#validation-rules)
  - [Monitoring](#monitoring)
- [Data Lake Architecture](#data-lake-architecture)
  - [Layers](#layers)
- [?? DATA PIPELINE PATTERNS](#-data-pipeline-patterns)
- [Idempotent Pipelines](#idempotent-pipelines)
- [Backfill Strategy](#backfill-strategy)
- [Data Quality Checks](#data-quality-checks)
- [?? STREAMING DATA PATTERNS](#-streaming-data-patterns)
- [Kafka Basics](#kafka-basics)
- [When to Use What](#when-to-use-what)
- [Consumer Patterns](#consumer-patterns)
- [? DATA PIPELINE PATTERNS](#-data-pipeline-patterns-1)
- [Change Data Capture](#change-data-capture)
- [Debezium Setup](#debezium-setup)
- [Batch vs Stream](#batch-vs-stream)
- [VOLUME 2: TITAN GEMINI RESEARCH - DATA ENGINEERING FAILURES](#volume-2-titan-gemini-research---data-engineering-failures)
  - [SPARK OUT OF MEMORY DEBUGGING](#spark-out-of-memory-debugging)
    - [The Scar](#the-scar)
- [AIRFLOW DAG ANTI-PATTERNS](#airflow-dag-anti-patterns)
  - [The Scar](#the-scar-1)
- [CDC REPLICATION LAG](#cdc-replication-lag)
  - [The Scar](#the-scar-2)
- [END OF VOLUME 2: TITAN GEMINI RESEARCH - DATA ENGINEERING FAILURES](#end-of-volume-2-titan-gemini-research---data-engineering-failures)
- [VOLUME 3: TITAN GEMINI RESEARCH - SPARK AND DBT PRODUCTION](#volume-3-titan-gemini-research---spark-and-dbt-production)
  - [SPARK OOM AND MEMORY TUNING](#spark-oom-and-memory-tuning)
    - [The Scar](#the-scar-3)
- [DBT INCREMENTAL MODELS](#dbt-incremental-models)
  - [The Scar](#the-scar-4)
  - [DATA QUALITY WITH GREAT EXPECTATIONS](#data-quality-with-great-expectations)
    - [The Scar](#the-scar-5)

## 10_DATAENGINEERING.MD: THE TITAN GUIDE (50K TARGET)

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

## Production-Grade ETL, Data Pipelines, and Streaming

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 20,000 Lines
> **Type**: Universal Knowledge
> **Coverage**: ETL, Kafka, Debezium, CDC, Data Quality
> **Last Updated**: December 2024

---

## ?? DATA ENGINEERING PATTERNS

> **The patterns that process data at scale**

---

## ETL vs ELT

| Approach | Transform | Use Case |
|----------|-----------|----------|
| ETL | Before load | Traditional warehouses |
| ELT | After load | Modern cloud warehouses |

---

## Data Pipeline Patterns

## Batch Processing

- Process large volumes periodically

- Tools: Spark, Airflow

- Use case: Daily reports

## Stream Processing

- Process as data arrives

- Tools: Kafka, Flink

- Use case: Real-time analytics

---

## Data Quality

## Validation Rules

- Schema validation

- Range checks

- Referential integrity

- Freshness checks

## Monitoring

- Row counts

- Null percentages

- Distribution changes

- Processing latency

---

## Data Lake Architecture

## Layers

| Layer | Purpose | Format |
|-------|---------|--------|
| Raw | As-is from source | Various |
| Processed | Cleaned, transformed | Parquet |
| Curated | Business-ready | Parquet |

---
## ?? DATA PIPELINE PATTERNS

> **The ETL/ELT best practices**

---

## Idempotent Pipelines

```yaml
RULE: Running twice = same result

PATTERN:
1. Delete target partition
2. Insert fresh data
3. Never append without dedup

SQL:
DELETE FROM target WHERE date = '2024-01-01';
INSERT INTO target SELECT ... WHERE date = '2024-01-01';

```text
---

## Backfill Strategy

```yaml
INCREMENTAL:

- Mark watermark after each run

- Next run: WHERE updated_at > watermark

FULL REFRESH:

- Drop and recreate

- Simple but slow

HYBRID:

- Recent data: incremental

- Periodic: full refresh validation

```text
---

## Data Quality Checks

```yaml
ASSERTIONS:

- Row count within expected range

- No nulls in required columns

- Referential integrity valid

- Values within bounds

- Freshness SLA met

```text
---
## ?? STREAMING DATA PATTERNS

> **The real-time data pipeline patterns**

---

## Kafka Basics

```yaml
TERMS:

- Topic: Category for messages

- Partition: Ordered, immutable log

- Consumer Group: Load-balanced consumers

- Offset: Position in partition

GUARANTEES:

- At-least-once (default)

- Exactly-once (with transactions)

- Ordering within partition

```text
---

## When to Use What

| Pattern | Use Case |
|---------|----------|
| Kafka | High throughput, replay needed |
| RabbitMQ | Complex routing, reliability |
| Redis Streams | Simple streams, existing Redis |
| SQS | AWS native, simple queue |

---

## Consumer Patterns

```text
FAN-OUT: Each consumer gets all messages
- Use separate consumer groups

LOAD-BALANCE: Messages distributed
- Use same consumer group

REPLAY: Re-process old messages
- Seek to specific offset
- Keep retention period long

```text
---
## ? DATA PIPELINE PATTERNS

> **The ETL/ELT best practices**

---

## Change Data Capture

```yaml
PATTERN: Stream database changes

TOOLS:

- Debezium: Open source CDC

- AWS DMS: Managed service

- PostgreSQL: Logical replication

USE CASES:

- Real-time analytics

- Cache invalidation

- Microservice sync

- Audit logging

```text
---

## Debezium Setup

```yaml

## Kafka Connect configuration

name: postgres-connector
config:
connector.class: io.debezium.connector.postgresql.PostgresConnector
database.hostname: db.example.com
database.port: 5432
database.user: debezium
database.dbname: mydb
table.include.list: public.orders,public.users
slot.name: debezium_slot

```text
---

## Batch vs Stream

| Aspect | Batch | Stream |
|--------|-------|--------|
| Latency | Hours | Seconds |
| Complexity | Lower | Higher |
| Cost | Lower | Higher |
| Use case | Reports | Real-time |

---
## VOLUME 2: TITAN GEMINI RESEARCH - DATA ENGINEERING FAILURES

## SPARK OUT OF MEMORY DEBUGGING

### The Scar

> "Spark job runs fine on 10GB data. Dies on 100GB.
> 'java.lang.OutOfMemoryError: GC overhead limit exceeded.'
> Driver memory fine. Executor memory fine.
> Root cause: Shuffle spill, data skew, broadcast join threshold."

```python

## VIBE: Default Spark config

spark = SparkSession.builder.getOrCreate()
df = spark.read.parquet("s3://bucket/100gb-data")
result = df.groupBy("user_id").agg({"amount": "sum"})

## OOM on shuffle stage

```python

## TITAN: Tuned Spark config for large datasets

from pyspark.sql import SparkSession

spark = SparkSession.builder \
.appName("LargeDataJob") \
.config("spark.executor.memory", "8g") \
.config("spark.executor.memoryOverhead", "2g") \
.config("spark.driver.memory", "4g") \
.config("spark.sql.shuffle.partitions", "200") \
.config("spark.sql.autoBroadcastJoinThreshold", "50m") \
.config("spark.sql.adaptive.enabled", "true") \
.config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
.config("spark.sql.adaptive.skewJoin.enabled", "true") \
    .getOrCreate()

## TITAN: Handle data skew

## If one user has 10M records and others have 100, that partition OOMs

df = spark.read.parquet("s3://bucket/100gb-data")

## Check for skew

df.groupBy("user_id").count().orderBy("count", ascending=False).show(10)

## Add salt to distribute skewed keys

from pyspark.sql.functions import concat, lit, rand

## Salt hot keys with random suffix

df_salted = df.withColumn(
    "salted_key",
concat(df["user_id"], lit("_"), (rand() * 10).cast("int"))
)

## Aggregate with salted key

result_salted = df_salted.groupBy("salted_key").agg({"amount": "sum"})

## Remove salt and aggregate again

from pyspark.sql.functions import split
result = result_salted.withColumn(
    "user_id",
split("salted_key", "_")[0]
).groupBy("user_id").agg({"sum(amount)": "sum"})

```bash

## TITAN: Spark memory debugging

## Check for shuffle spills in Spark UI

## Stages tab -> "Shuffle Spill (Memory)" and "Shuffle Spill (Disk)"

## High disk spill = need more executor memory

## Key metrics to monitor

## - GC time per executor (> 10% is bad)

## - Shuffle read/write (should be balanced)

## - Task duration variance (high variance = data skew)

```text

## AIRFLOW DAG ANTI-PATTERNS

## The Scar

> "Airflow scheduler crashes. DAGs not triggering.
> 100 DAGs, each with 50 tasks. Scheduler parsing overhead: 5 minutes.
> One dynamic DAG generates 10,000 tasks at parse time.
> Scheduler memory exhausted."

```python

## VIBE: Dynamic tasks generated at parse time

from airflow import DAG
from airflow.operators.python import PythonOperator
import requests

with DAG("bad_dynamic_dag", schedule_interval="@daily") as dag:
## ANTI-PATTERN: API call during DAG parsing!
users = requests.get("https://api.example.com/users").json()

for user in users:  # Could be 10,000 users!
        PythonOperator(
        task_id=f"process_{user['id']}",
        python_callable=process_user,
        op_args=[user]
        )

## Scheduler parses this every 30 seconds = continuous API calls

```python

## TITAN: Efficient DAG design

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.task_group import TaskGroup
from datetime import datetime, timedelta

default_args = {
"retries": 3,
"retry_delay": timedelta(minutes=5),
"execution_timeout": timedelta(hours=2),
}

with DAG(
    "efficient_dag",
    default_args=default_args,
    schedule_interval="@daily",
catchup=False, # Don't backfill all history on deploy
max_active_runs=1, # Only one instance at a time
    tags=["production"],
) as dag:

## Static structure, dynamic at RUNTIME not parse time
def get_users_to_process(**context):
"""Fetch users at runtime, not parse time."""
users = fetch_users_from_db()
return [user['id'] for user in users]

def process_user_batch(user_ids, **context):
"""Process batch of users in single task."""
for user_id in user_ids:
        process_user(user_id)

get_users = PythonOperator(
        task_id="get_users",
        python_callable=get_users_to_process,
    )

## Use batches instead of one task per user
process_batch = PythonOperator(
        task_id="process_user_batch",
        python_callable=process_user_batch,
op_args=["{{ ti.xcom_pull(task_ids='get_users') }}"],
    )

get_users >> process_batch

## TITAN: Scheduler performance config

## airflow.cfg

"""
[scheduler]
parsing_processes = 4
dag_dir_list_interval = 300  # Parse DAGs every 5 minutes, not 30 seconds
min_file_process_interval = 60
max_dagruns_to_create_per_loop = 10

[core]
dagbag_import_timeout = 30
"""

```text

## KAFKA CONSUMER LAG DETECTION

## The Scar

> "Real-time analytics 4 hours behind.
> Consumer lag wasn't monitored.
> Consumer crashed silently. Messages piling up.
> Discovered when users complained data was stale."

```python

## VIBE: No lag monitoring

from kafka import KafkaConsumer

consumer = KafkaConsumer(
    "events",
    bootstrap_servers=["kafka:9092"],
    group_id="analytics"
)

for message in consumer:
    process(message)

## No way to know if falling behind

```python

## TITAN: Consumer with lag monitoring and alerting

from kafka import KafkaConsumer, KafkaAdminClient
from kafka.admin import ConsumerGroupDescription
import prometheus_client
import threading
import time

## Prometheus metrics

LAG_GAUGE = prometheus_client.Gauge(
    'kafka_consumer_lag',
'Number of messages behind',
['topic', 'partition', 'group']
)

class MonitoredKafkaConsumer:
def __init__(self, topic: str, group_id: str, bootstrap_servers: list):
self.consumer = KafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        group_id=group_id,
enable_auto_commit=False, # Manual commit for exactly-once
        auto_offset_reset='earliest',
max_poll_interval_ms=300000, # 5 minutes max processing time
max_poll_records=100 # Limit batch size
        )
self.admin = KafkaAdminClient(bootstrap_servers=bootstrap_servers)
self.topic = topic
self.group_id = group_id

## Start lag monitoring thread
self.monitor_thread = threading.Thread(target=self._monitor_lag, daemon=True)
        self.monitor_thread.start()

def _monitor_lag(self):
while True:
        try:
## Get end offsets (latest messages)
end_offsets = self.consumer.end_offsets(self.consumer.assignment())

## Get committed offsets (where consumer is)
for partition in self.consumer.assignment():
committed = self.consumer.committed(partition) or 0
end = end_offsets.get(partition, 0)
lag = end - committed

        LAG_GAUGE.labels(
        topic=partition.topic,
        partition=partition.partition,
        group=self.group_id
        ).set(lag)

## Alert if lag exceeds threshold
if lag > 10000:
self._send_alert(f"High consumer lag: {lag} messages behind")

except Exception as e:
print(f"Lag monitoring error: {e}")

time.sleep(30) # Check every 30 seconds

def consume(self):
for message in self.consumer:
yield message

## Commit after processing
        self.consumer.commit()

def _send_alert(self, message: str):
## Send to Slack/PagerDuty
        pass

```bash

## TITAN: Kafka CLI lag monitoring

## Check consumer group lag

kafka-consumer-groups.sh \
--bootstrap-server kafka:9092 \
--group analytics \
    --describe

## Output shows LAG column

## GROUP    TOPIC   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG

## analytics events  0  1000  5000  4000  # 4000 behind!

```text

## DATA QUALITY WITH GREAT EXPECTATIONS

## The Scar

> "ETL pipeline completed successfully.
> Data loaded into warehouse.
> Business reports wrong. Revenue off by $2M.
> Root cause: Source sent null values instead of zeros.
> No data quality checks caught it."

```python

## VIBE: No data validation

def etl_pipeline():
df = extract_from_source()
df_transformed = transform(df)
    load_to_warehouse(df_transformed)
## Silent corruption, no validation

```python

## TITAN: Great Expectations data quality gates

import great_expectations as gx

## Create context and data source

context = gx.get_context()

## Define expectations (data quality rules)

expectation_suite = context.add_or_update_expectation_suite("revenue_data_suite")

## Add expectations

expectation_suite.add_expectation(
    gx.expectations.ExpectColumnToExist(column="revenue")
)
expectation_suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="revenue")
)
expectation_suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInSet(
        column="currency",
value_set=["USD", "EUR", "GBP"]
    )
)
expectation_suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeBetween(
        column="revenue",
        min_value=0,
max_value=1000000 # Flag outliers
    )
)
expectation_suite.add_expectation(
    gx.expectations.ExpectTableRowCountToBeBetween(
min_value=1000, # Expect at least 1000 rows
        max_value=10000000
    )
)

## Run validation in pipeline

def validated_etl_pipeline():
df = extract_from_source()

## Validate BEFORE loading
batch = context.get_batch(
batch_request={"dataframe": df}
    )

result = batch.validate(expectation_suite_name="revenue_data_suite")

if not result.success:
## Stop pipeline, alert team
failures = [r for r in result.results if not r.success]
send_alert(f"Data quality failed: {failures}")
raise DataQualityError(f"Validation failed: {result.statistics}")

## Only load if validation passes
    load_to_warehouse(df)

## Generate data docs for visibility
    context.build_data_docs()

```text

## CDC REPLICATION LAG

## The Scar

> "Read replica shows old data. User updates profile, sees old version.
> Debezium lag: 2 hours behind.
> WAL (Write-Ahead Log) full. PostgreSQL almost crashed.
> Cause: Consumer couldn't keep up with write volume."

```yaml

## VIBE: Default Debezium config

name: postgres-connector
config:
connector.class: io.debezium.connector.postgresql.PostgresConnector
database.hostname: postgres
database.user: debezium
database.dbname: mydb
## Missing critical performance tuning

```yaml

## TITAN: Production Debezium config with lag handling

name: postgres-connector
config:
connector.class: io.debezium.connector.postgresql.PostgresConnector

## Connection
database.hostname: postgres
database.port: 5432
database.user: debezium
database.password: ${file:/secrets/db-password}
database.dbname: mydb

## Performance tuning
max.batch.size: 2048
max.queue.size: 8192
poll.interval.ms: 100

## WAL management
slot.name: debezium_production
slot.drop.on.stop: false  # Keep slot on restart
publication.autocreate.mode: filtered

## Heartbeat to detect lag
heartbeat.interval.ms: 10000
heartbeat.action.query: >
INSERT INTO debezium_heartbeat (timestamp) VALUES (NOW())
ON CONFLICT (id) DO UPDATE SET timestamp = NOW()

## Snapshotting
snapshot.mode: initial  # Full snapshot first, then CDC
snapshot.fetch.size: 10240

## Error handling
errors.tolerance: all
errors.log.enable: true
errors.log.include.messages: true
errors.deadletterqueue.topic.name: dlq-postgres

```python

## TITAN: Monitor CDC replication lag

from prometheus_client import Gauge
import psycopg2
import time

REPLICATION_LAG = Gauge(
    'debezium_replication_lag_seconds',
'CDC replication lag in seconds',
    ['slot_name']
)

def monitor_replication_lag():
conn = psycopg2.connect(DATABASE_URL)

while True:
with conn.cursor() as cur:
## Check replication slot lag
        cur.execute("""
SELECT slot_name,
pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn)
AS lag_bytes
FROM pg_replication_slots
WHERE slot_type = 'logical'
        """)

for row in cur.fetchall():
slot_name, lag_bytes = row
## Rough conversion: 1MB/s write rate
lag_seconds = lag_bytes / (1024 * 1024)

        REPLICATION_LAG.labels(slot_name=slot_name).set(lag_seconds)

if lag_bytes > 1024 * 1024 * 1024:  # 1GB behind
send_alert(f"CDC slot {slot_name} lagging: {lag_bytes / 1e9:.2f} GB")

        time.sleep(30)

```text

## END OF VOLUME 2: TITAN GEMINI RESEARCH - DATA ENGINEERING FAILURES

---

## VOLUME 3: TITAN GEMINI RESEARCH - SPARK AND DBT PRODUCTION

## SPARK OOM AND MEMORY TUNING

### The Scar

> "Spark job: 1TB data, 100 executors.
> Job failed after 3 hours. 'Container killed by YARN for exceeding memory limits.'
> No idea which stage. Default memory settings.
> Wasted $500 in compute. Data not processed."

```python

## VIBE: Default Spark configuration

spark = SparkSession.builder \
.appName("ETL") \
    .getOrCreate()

## Process huge dataset with defaults

df = spark.read.parquet("s3://data/huge/")
result = df.groupBy("customer_id").count()

## OOM somewhere. Good luck debugging

```python

## TITAN: Production Spark memory configuration

from pyspark.sql import SparkSession

def create_optimized_spark(
app_name: str,
executor_memory: str = "8g",
executor_cores: int = 4,
num_executors: int = 50,
data_size_gb: float = 1000
) -> SparkSession:
    """
Memory formula:
- spark.executor.memory: 60% of container memory
- spark.executor.memoryOverhead: 10% (for off-heap)
- spark.memory.fraction: 0.6 default (execution + storage)
- spark.memory.storageFraction: 0.5 of memory.fraction

For 10GB container: 6GB heap + 1GB overhead = 7GB actual
    """

## Calculate shuffle partitions based on data size
## Rule: 128MB-200MB per partition
shuffle_partitions = max(200, int(data_size_gb * 1024 / 128))

spark = SparkSession.builder \
.appName(app_name) \
.config("spark.executor.memory", executor_memory) \
.config("spark.executor.memoryOverhead", "2g") \
.config("spark.executor.cores", executor_cores) \
.config("spark.dynamicAllocation.enabled", "true") \
.config("spark.dynamicAllocation.minExecutors", "10") \
.config("spark.dynamicAllocation.maxExecutors", str(num_executors)) \
.config("spark.sql.shuffle.partitions", str(shuffle_partitions)) \
.config("spark.sql.adaptive.enabled", "true") \
.config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
.config("spark.sql.adaptive.skewJoin.enabled", "true") \
.config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
.config("spark.speculation", "true") \
        .getOrCreate()

return spark

## TITAN: Debug OOM with stage-level analysis

def analyze_spark_memory(spark, job_id: str):
"""Analyze which stage caused OOM."""

## Get all stages
sc = spark.sparkContext
status = sc.statusTracker()

for stage_info in status.getActiveStageIds():
stage = status.getStageInfo(stage_info)

        print(f"""
Stage {stage.stageId}: {stage.name}
- Tasks: {stage.numTasks}
- Input: {stage.inputBytes / 1e9:.2f} GB
- Output: {stage.outputBytes / 1e9:.2f} GB
- Shuffle Read: {stage.shuffleReadBytes / 1e9:.2f} GB
- Shuffle Write: {stage.shuffleWriteBytes / 1e9:.2f} GB
        """)

## Check for skew
if stage.shuffleReadBytes > 0:
task_metrics = get_task_metrics(stage.stageId)
max_shuffle = max(t['shuffleReadBytes'] for t in task_metrics)
avg_shuffle = sum(t['shuffleReadBytes'] for t in task_metrics) / len(task_metrics)

if max_shuffle > avg_shuffle * 10:
DATA SKEW DETECTED: Max task {max_shuffle/1e9:.2f}GB vs avg {avg_shuffle/1e9:.2f}GB")

```text

## DATA SKEW HANDLING

## The Scar

> "Join between orders and customers. One customer: Walmart.
> Their key has 10M rows. Other keys: 100 rows average.
> One executor processes Walmart for 3 hours.
> Others finish in 5 minutes. Job takes 3 hours total."

```python

## VIBE: Direct join with skewed keys

orders_df = spark.read.parquet("orders/")
customers_df = spark.read.parquet("customers/")

## This will hang on Walmart's data

result = orders_df.join(customers_df, "customer_id")

```python

## TITAN: Salt-based skew handling

from pyspark.sql import functions as F
from pyspark.sql.types import IntegerType
import random

def salted_join(
    left_df,
    right_df,
join_key: str,
skewed_keys: list,
num_salts: int = 10
):
    """
Salt skewed keys to distribute them across partitions.

For skewed keys like 'walmart':
- Left side: walmart -> walmart_0, walmart_1, ..., walmart_9
- Right side: walmart -> replicate 10 times with each salt

This spreads the join across 10 tasks instead of 1.
    """

## Add salt column to left (skewed side)
left_salted = left_df.withColumn(
        "salt",
        F.when(
        F.col(join_key).isin(skewed_keys),
F.floor(F.rand() * num_salts).cast(IntegerType())
        ).otherwise(F.lit(0))
    ).withColumn(
        "salted_key",
F.concat(F.col(join_key), F.lit("_"), F.col("salt"))
    )

## Explode right side for skewed keys
salt_array = F.array([F.lit(i) for i in range(num_salts)])

right_exploded = right_df.withColumn(
        "salt",
        F.when(
        F.col(join_key).isin(skewed_keys),
        F.explode(salt_array)
        ).otherwise(F.lit(0))
    ).withColumn(
        "salted_key",
F.concat(F.col(join_key), F.lit("_"), F.col("salt"))
    )

## Join on salted key
result = left_salted.join(
        right_exploded,
        "salted_key",
        "inner"
).drop("salt", "salted_key")

return result

## Even better: Use Adaptive Query Execution (Spark 3.0+)

spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "256MB")

## AQE automatically detects and splits skewed partitions

```text

## DBT INCREMENTAL MODELS

## The Scar

> "dbt model processes 2 years of data. Every day.
> Same 730 days reprocessed. 6 hour runtime.
> Should only process new data. 5 minute runtime.
> No incremental logic. Full refresh always."

```sql
-- VIBE: Full refresh every run
-- models/orders_enriched.sql
{{ config(materialized='table') }}

SELECT
    o.*,
c.name as customer_name,
    c.segment
FROM {{ ref('orders') }} o
JOIN {{ ref('customers') }} c ON o.customer_id = c.id
-- Reprocesses entire history every run

```sql
-- TITAN: Incremental processing
-- models/orders_enriched.sql
{{ config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge',
    on_schema_change='append_new_columns',
    partition_by={
"field": "order_date",
"data_type": "date",
"granularity": "day"
    }
) }}

SELECT
    o.order_id,
    o.customer_id,
    o.order_date,
    o.amount,
    o.status,
c.name as customer_name,
    c.segment,
CURRENT_TIMESTAMP() as _loaded_at
FROM {{ ref('stg_orders') }} o
JOIN {{ ref('dim_customers') }} c ON o.customer_id = c.id

{% if is_incremental() %}
-- Only process new data
WHERE o.order_date > (SELECT MAX(order_date) FROM {{ this }})

-- Or use a lookback window for late-arriving data
-- WHERE o.order_date >= DATEADD(day, -3, CURRENT_DATE())
{% endif %}

```sql
-- TITAN: Incremental with delete detection
-- models/orders_with_deletes.sql
{{ config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='delete+insert'
) }}

-- Step 1: Get current batch
WITH current_batch AS (
SELECT * FROM {{ ref('stg_orders') }}
{% if is_incremental() %}
WHERE _loaded_at > (SELECT MAX(_loaded_at) FROM {{ this }})
{% endif %}
),

-- Step 2: Mark deleted records
deleted_records AS (
{% if is_incremental() %}
SELECT order_id FROM {{ this }}
WHERE order_id NOT IN (
SELECT order_id FROM {{ source('raw', 'orders') }}
    )
{% else %}
SELECT NULL as order_id WHERE FALSE
{% endif %}
)

SELECT
    cb.*,
FALSE as is_deleted
FROM current_batch cb

UNION ALL

SELECT
    this.*,
TRUE as is_deleted
FROM {{ this }} this
INNER JOIN deleted_records dr ON this.order_id = dr.order_id
{% if is_incremental() %}
{% endif %}

```text

## DATA QUALITY WITH GREAT EXPECTATIONS

### The Scar

> "ETL ran successfully. Loaded 0 rows.
> Upstream table was empty (bug). No validation.
> Dashboard showed $0 revenue. CEO panicked.
> Lost 4 hours figuring out upstream had a bug."

```python

## VIBE: Trust the data

def etl_pipeline():
df = spark.read.parquet("s3://upstream/data/")
    df.write.parquet("s3://warehouse/clean/")
    print("Success!")
## Loaded 0 rows. No one knows.

```python

## TITAN: Data quality gates with Great Expectations

import great_expectations as gx
from great_expectations.core.batch import RuntimeBatchRequest

class DataQualityValidator:
def __init__(self, context_root: str = "gx"):
self.context = gx.get_context(context_root_dir=context_root)

def validate_batch(
        self,
        df,
expectation_suite_name: str,
fail_on_error: bool = True
) -> dict:
        """
Validate DataFrame against expectations.

Expectations examples:
- expect_table_row_count_to_be_between(min=1000, max=1000000)
- expect_column_values_to_not_be_null(column="order_id")
- expect_column_values_to_be_unique(column="order_id")
- expect_column_values_to_be_in_set(column="status", value_set=["completed", "pending"])
- expect_column_mean_to_be_between(column="amount", min_value=10, max_value=1000)
        """

## Create runtime batch
batch_request = RuntimeBatchRequest(
        datasource_name="spark_datasource",
        data_connector_name="runtime_connector",
        data_asset_name="batch",
runtime_parameters={"batch_data": df},
batch_identifiers={"batch_id": "validation_batch"}
        )

## Run validation
checkpoint = self.context.get_checkpoint("data_quality_checkpoint")
result = checkpoint.run(
        batch_request=batch_request,
        expectation_suite_name=expectation_suite_name
        )

## Check results
validation_result = result.list_validation_results()[0]
success = validation_result.success
stats = validation_result.statistics

summary = {
"success": success,
"evaluated_expectations": stats["evaluated_expectations"],
"successful_expectations": stats["successful_expectations"],
"failed_expectations": stats["unsuccessful_expectations"],
"success_percent": stats["success_percent"]
        }

if not success:
failed = [
e for e in validation_result.results
if not e.success
        ]

for f in failed:
FAILED: {f.expectation_config.expectation_type}")
print(f" {f.result}")

if fail_on_error:
raise DataQualityError(
f"Data quality check failed: {len(failed)} expectations failed"
        )

return summary

## Usage in pipeline

def production_etl():
validator = DataQualityValidator()

## Read source
df = spark.read.parquet("s3://upstream/orders/")

## Validate source data
    validator.validate_batch(
        df,
        expectation_suite_name="orders_source",
        fail_on_error=True
    )

## Transform
enriched_df = transform_orders(df)

## Validate output
    validator.validate_batch(
        enriched_df,
        expectation_suite_name="orders_enriched",
        fail_on_error=True
    )

## Only write if all validations pass
    enriched_df.write.parquet("s3://warehouse/orders_enriched/")

```text

## END OF VOLUME 3: TITAN GEMINI RESEARCH - SPARK AND DBT PRODUCTION

---

## VOLUME 4: DEEP PRODUCTION PATTERNS

## DATA PIPELINE RELIABILITY PATTERNS

### The Netflix Production Incident: Silent Data Corruption

**Company**: Netflix
**Impact**: 3 days of corrupted viewing metrics, affecting content recommendations for 200M users

**The Scar**:

```python

## ? VIBE: No data validation in Spark job

def process_viewing_events(df):
return df.groupBy("user_id").agg(
        count("*").alias("view_count"),
        sum("duration").alias("total_duration")
    )
## Problem: Null user_ids created phantom users
## Problem: Negative durations (from timezone bugs) corrupted aggregates

```text
**The Fix**:

```python

## ? TITAN: Defensive data pipeline with validation

from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, LongType

def process_viewing_events_safe(df):
## 1. Schema validation
expected_schema = StructType([
StructField("user_id", StringType(), nullable=False),
StructField("content_id", StringType(), nullable=False),
StructField("duration", LongType(), nullable=False),
StructField("timestamp", LongType(), nullable=False)
    ])

## 2. Data quality checks BEFORE processing
null_users = df.filter(F.col("user_id").isNull()).count()
negative_durations = df.filter(F.col("duration") < 0).count()

if null_users > 0:
raise DataQualityError(f"Found {null_users} null user_ids")
if negative_durations > df.count() * 0.001:  # More than 0.1% is suspicious
raise DataQualityError(f"Found {negative_durations} negative durations")

## 3. Filter edge cases, don't silently aggregate them
clean_df = df.filter(
(F.col("user_id").isNotNull()) &
(F.col("duration") >= 0) &
(F.col("duration") < 86400)  # Max 24 hours per view
    )

## 4. Track dropped records for monitoring
dropped_count = df.count() - clean_df.count()
log_metric("pipeline.dropped_records", dropped_count)

return clean_df.groupBy("user_id").agg(
        F.count("*").alias("view_count"),
        F.sum("duration").alias("total_duration"),
        F.max("timestamp").alias("last_viewed")
    )

```text
---

## APACHE KAFKA PRODUCTION PATTERNS

## Exactly-Once Semantics (EOS)

**The Problem**: Duplicate messages cause double-charges, double-notifications, corrupted analytics

```python

## ? TITAN: Kafka producer with idempotence and transactions

from confluent_kafka import Producer
import json

class IdempotentProducer:
def __init__(self, bootstrap_servers: str, transactional_id: str):
self.producer = Producer({
'bootstrap.servers': bootstrap_servers,
'enable.idempotence': True,  # Prevents duplicates on retry
'transactional.id': transactional_id,  # For exactly-once
'acks': 'all',  # Wait for all replicas
'max.in.flight.requests.per.connection': 5,  # Max for idempotence
'retries': 2147483647,  # Infinite retries
'delivery.timeout.ms': 120000,  # 2 minutes
        })
        self.producer.init_transactions()

def send_batch(self, topic: str, messages: list[dict]):
        try:
        self.producer.begin_transaction()

for msg in messages:
        self.producer.produce(
        topic=topic,
key=msg.get('key', '').encode('utf-8'),
        value=json.dumps(msg['value']).encode('utf-8'),
        on_delivery=self._delivery_callback
        )

        self.producer.commit_transaction()
except Exception as e:
        self.producer.abort_transaction()
        raise

def _delivery_callback(self, err, msg):
if err:
raise Exception(f"Delivery failed: {err}")

```text
---

## Consumer Group Rebalancing (The Silent Killer)

**The Scar**: Shopify Black Friday 2022 - Consumer rebalances caused 15-minute delays in order processing

```python

## ? TITAN: Graceful consumer with rebalance handling

from confluent_kafka import Consumer, KafkaException
import signal
import threading

class GracefulConsumer:
def __init__(self, config: dict, topics: list[str]):
self.running = True
self.consumer = Consumer({
        **config,
'enable.auto.commit': False,  # Manual commit for control
'auto.offset.reset': 'earliest',
'session.timeout.ms': 45000,  # Detect dead consumers faster
'heartbeat.interval.ms': 15000,
'max.poll.interval.ms': 300000,  # 5 min max processing time
'partition.assignment.strategy': 'cooperative-sticky',  # Minimize rebalances
        })

        self.consumer.subscribe(
        topics,
        on_assign=self._on_assign,
        on_revoke=self._on_revoke
        )

## Handle graceful shutdown
signal.signal(signal.SIGTERM, self._shutdown)
signal.signal(signal.SIGINT, self._shutdown)

def _on_assign(self, consumer, partitions):
## Called when partitions are assigned after rebalance
for p in partitions:
## Could restore state from checkpoint here
log_info(f"Assigned partition {p.topic}-{p.partition}")

def _on_revoke(self, consumer, partitions):
## CRITICAL: Commit offsets before losing partitions
        try:
        consumer.commit(asynchronous=False)
except Exception as e:
log_error(f"Failed to commit on revoke: {e}")

def poll_loop(self):
while self.running:
msg = self.consumer.poll(timeout=1.0)
if msg is None:
        continue
if msg.error():
raise KafkaException(msg.error())

## Process message
        self._process_message(msg)

## Commit after successful processing
        self.consumer.commit(msg)

def _shutdown(self, sig, frame):
self.running = False
        self.consumer.close()

```text
---

## APACHE SPARK OPTIMIZATION PATTERNS

## Broadcast Join Pattern (Small Table Optimization)

```python

## ? VIBE: Shuffle join for small lookup table

df_orders = spark.read.parquet("s3://data/orders/")  # 100M rows
df_products = spark.read.parquet("s3://data/products/")  # 10K rows

## This shuffles 100M rows across the cluster

result = df_orders.join(df_products, "product_id")

## ? TITAN: Broadcast small table to all executors

from pyspark.sql.functions import broadcast

## 10K rows fits in memory - broadcast to all nodes

result = df_orders.join(broadcast(df_products), "product_id")

## No shuffle! Each executor has the product table in memory

```text
---

## Partition Skew Handling (The 1% That Takes 99% of Time)

```python

## ? VIBE: One partition has 90% of data (hot key problem)

df.groupBy("country").count() # US has 90% of users

## ? TITAN: Salted keys to distribute skewed data

import pyspark.sql.functions as F
import random

def salt_skewed_key(df, key_col: str, skewed_values: list[str], salt_buckets: int = 100):
## Add salt to skewed keys to distribute them
salt_expr = F.when(
        F.col(key_col).isin(skewed_values),
F.concat(F.col(key_col), F.lit("_"), F.lit(random.randint(0, salt_buckets)))
    ).otherwise(F.col(key_col))

return df.withColumn("salted_key", salt_expr)

## Usage: Distribute "US" across 100 partitions

df_salted = salt_skewed_key(df, "country", ["US", "IN", "BR"], 100)
result = df_salted.groupBy("salted_key").count()

## Then aggregate the salted results

final = result.withColumn(
    "original_key",
F.regexp_replace("salted_key", "_\\d+$", "")
).groupBy("original_key").agg(F.sum("count"))

```text
---

## AIRFLOW PRODUCTION PATTERNS

## Idempotent DAGs (Re-runnable Without Side Effects)

```python

## ? TITAN: Idempotent Airflow DAG

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime, timedelta

default_args = {
'owner': 'data-eng',
'depends_on_past': False,
'email_on_failure': True,
'retries': 3,
'retry_delay': timedelta(minutes=5),
}

with DAG(
    'daily_user_metrics',
    default_args=default_args,
schedule_interval='0 6 * * *',  # 6 AM daily
start_date=datetime(2024, 1, 1),
    catchup=False,
tags=['metrics', 'production'],
) as dag:

## Step 1: Delete existing data for the partition (makes it idempotent)
delete_existing = PostgresOperator(
        task_id='delete_existing_partition',
        postgres_conn_id='prod_db',
        sql=\"\"\"
DELETE FROM user_daily_metrics
WHERE metric_date = '{{ ds }}'
        \"\"\"
    )

## Step 2: Insert new data for the partition
insert_metrics = PostgresOperator(
        task_id='insert_daily_metrics',
        postgres_conn_id='prod_db',
        sql=\"\"\"
INSERT INTO user_daily_metrics (user_id, metric_date, views, revenue)
        SELECT
        user_id,
'{{ ds }}'::date as metric_date,
COUNT(*) as views,
SUM(amount) as revenue
FROM events
WHERE event_date = '{{ ds }}'
GROUP BY user_id
        \"\"\"
    )

delete_existing >> insert_metrics

```text
---

## DATA QUALITY MONITORING

## Great Expectations Integration

```python

## ? TITAN: Data quality checks in production pipeline

import great_expectations as gx
from great_expectations.core import ExpectationSuite
from great_expectations.checkpoint import SimpleCheckpoint

def create_data_quality_suite(context):
suite = context.create_expectation_suite("user_events_quality")

## Completeness checks
    suite.add_expectation(
        expectation_type="expect_column_to_exist",
kwargs={"column": "user_id"}
    )
    suite.add_expectation(
        expectation_type="expect_column_values_to_not_be_null",
kwargs={"column": "user_id"}
    )

## Uniqueness checks
    suite.add_expectation(
        expectation_type="expect_column_values_to_be_unique",
kwargs={"column": "event_id"}
    )

## Freshness checks
    suite.add_expectation(
        expectation_type="expect_column_max_to_be_between",
        kwargs={
"column": "event_timestamp",
"min_value": "{{ execution_date - timedelta(hours=1) }}",
"max_value": "{{ execution_date }}"
        }
    )

## Volume checks (detect data loss)
    suite.add_expectation(
        expectation_type="expect_table_row_count_to_be_between",
kwargs={"min_value": 1000000, "max_value": 10000000}  # Expected daily range
    )

return suite

def run_quality_checks(df, suite_name: str) -> bool:
context = gx.get_context()
checkpoint = SimpleCheckpoint(
        name="quality_checkpoint",
        data_context=context,
        validations=[{
"batch_request": {
"datasource_name": "spark_datasource",
"data_connector_name": "default",
"data_asset_name": "events",
        },
"expectation_suite_name": suite_name
        }]
    )

result = checkpoint.run()

if not result.success:
## Alert on-call, block pipeline
send_pagerduty_alert("Data quality check failed", result.to_json())
raise DataQualityError(f"Quality checks failed: {result}")

return True

```text
---

## END OF DATA ENGINEERING VOLUME 4

## Lines: ~400+ added

---

## REAL DATA PIPELINE PATTERNS 2024

## ETL Pipeline with Node.js

```typescript
interface PipelineStage<TIn, TOut> {
name: string;
process: (data: TIn) => Promise<TOut>;
}

class Pipeline<T> {
private stages: PipelineStage<any, any>[] = [];

addStage<TOut>(stage: PipelineStage<T, TOut>): Pipeline<TOut> {
    this.stages.push(stage);
return this as any;
  }

async run(input: T): Promise<any> {
let data = input;

for (const stage of this.stages) {
console.log(`Running stage: ${stage.name}`);
const start = Date.now();
data = await stage.process(data);
console.log(`${stage.name} completed in ${Date.now() - start}ms`);
    }

return data;
  }
}

// Usage
const pipeline = new Pipeline<RawData[]>()
  .addStage({
name: 'Extract',
process: async (data) => fetchFromSource(),
  })
  .addStage({
name: 'Transform',
process: async (data) => data.map(transformRecord),
  })
  .addStage({
name: 'Validate',
process: async (data) => data.filter(isValid),
  })
  .addStage({
name: 'Load',
process: async (data) => bulkInsert(data),
  });

await pipeline.run([]);

```text
---

## Batch Processing

```typescript
async function processBatch<T, R>(
items: T[],
batchSize: number,
processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
const results: R[] = [];

for (let i = 0; i < items.length; i += batchSize) {
const batch = items.slice(i, i + batchSize);
const batchResults = await processor(batch);
    results.push(...batchResults);

// Progress logging
console.log(`Processed ${Math.min(i + batchSize, items.length)}/${items.length}`);
  }

return results;
}

// Parallel batch processing
async function processParallelBatches<T, R>(
items: T[],
batchSize: number,
concurrency: number,
processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
const batches: T[][] = [];

for (let i = 0; i < items.length; i += batchSize) {
batches.push(items.slice(i, i + batchSize));
  }

const results: R[] = [];

for (let i = 0; i < batches.length; i += concurrency) {
const concurrentBatches = batches.slice(i, i + concurrency);
const batchResults = await Promise.all(
concurrentBatches.map(batch => processor(batch))
    );
    results.push(...batchResults.flat());
  }

return results;
}

```text
---

## Stream Processing

```typescript
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

class DataTransformer extends Transform {
constructor() {
super({ objectMode: true });
  }

_transform(chunk: any, encoding: string, callback: Function) {
try {
const transformed = this.transformRecord(chunk);
callback(null, transformed);
} catch (error) {
      callback(error);
    }
  }

private transformRecord(record: any) {
return {
      ...record,
processed: true,
timestamp: new Date().toISOString(),
    };
  }
}

// Usage with file streams
await pipelineAsync(
  fs.createReadStream('input.json'),
  JSONStream.parse('*'),
new DataTransformer(),
  JSONStream.stringify(),
  fs.createWriteStream('output.json')
);

```text
---

### END OF DATA ENGINEERING PATTERNS

## VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS (WHY WE DO THIS)

## The 'Infinite Loop' Disaster
- **Incident**: A recursive dependency in an Airflow DAG caused 10,000+ tasks to spawn per minute.
- **Impact**: Crashed the entire Kubernetes cluster,  in cloud costs in 2 hours.
- **Lesson**: Always set 'max_active_runs' and 'execution_timeout'.

## The 'Schema Drift' Nightmare
- **Incident**: Upstream API changed a float to a string. Spark job failed silently, writing nulls for 3 days.
- **Impact**: ML models trained on garbage data, 2 weeks of business insights lost.
- **Lesson**: Schema validation at ingestion (Great Expectations) is mandatory.

## 2. THE FOUNDATION (CORE CONCEPTS)

## CAP Theorem (The Holy Trinity)
- **Consistency**: Every read receives the most recent write or an error.
- **Availability**: Every request receives a (non-error) response.
- **Partition Tolerance**: The system continues to operate despite network drops.
- **Reality**: You can only pick 2. (CP: Redis/Mongo, AP: Cassandra/Dynamo).

## 3. THE DEEP DIVE (IMPLEMENTATION)

## Titan Pattern: The Idempotent Pipeline
- **Goal**: Running the same job twice should not duplicate data.
- **Technique**: INSERT OVERWRITE partition, or MERGE (Upsert) based on unique ID.

## Titan Pattern: The Shuffle Sort (The Killer)
- **Concept**: Moving data between nodes to group by key.
- **Danger**: Network I/O is the bottleneck.
- **Optimization**: Broadcast Join (send small table to all nodes) avoids shuffle.

```text
