
def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

mobile_scars = """
## VOLUME 7: TITAN MOBILE SCARS (Incidents & Post-Mortems)

### Incident #9.1: The 'Battery Vampire' WakeLock Leak
- **Root Cause**: A background sync task failed to release a `WakeLock` in the `catch` block.
- **Impact**: 10,000 users reported 50% battery drain in 2 hours. App store rating plummeted.
- **Titan Mitigation**:
    - Enforced `finally` block release patterns.
    - Integrated `Sentry` battery drain monitoring.
    - Switched to `WorkManager` which handles lock lifecycle automatically.

### Incident #9.2: The 'Main Thread' JNI Segfault
- **Root Cause**: A C++ JSI module attempted to access a deleted JS object (Race Condition).
- **Impact**: Immediate `segfault` and app crash on startup for 5% of users.
- **Titan Mitigation**:
    - Implemented `WeakReference` patterns for all host objects.
    - Added `Thread Sanitizer (TSan)` to the CI pipeline to catch race conditions.

### Incident #9.3: The 'SSL Pinning' Lockout
- **Root Cause**: Server certificate rotated, but the app had hardcoded pins.
- **Impact**: 100% of users locked out of the app.
- **Titan Mitigation**:
    - Implemented `Backup Pins` (Intermediate CA).
    - Added a 'Emergency Bypass' flag controlled by a remote config (Firebase).

### Titan Mobile Checklist
- [ ] **Memory Leak**: Verified with LeakCanary/Instruments?
- [ ] **Race Condition**: Async state updates handled?
- [ ] **Throughput**: List rendering optimized with FlashList/RecyclerView?
- [ ] **Latency**: TTI (Time to Interactive) < 2s?
- [ ] **Availability**: Offline-first mode implemented?
"""

de_scars = """
## VOLUME 7: TITAN PRODUCTION SCARS (Incidents & Post-Mortems)

### Incident #10.1: The 'Thundering Herd' Kafka Rebalance
- **Root Cause**: A consumer group with 100 members experienced a `session.timeout.ms` expiration due to a long-running GC (Garbage Collection) pause.
- **Impact**: Triggered a massive rebalance. Every consumer stopped processing. The 'Thundering Herd' of consumers re-joining the group caused a Kafka metadata timeout.
- **Titan Mitigation**:
    - Increased `max.poll.interval.ms` to exceed the p99 processing time.
    - Tuned JVM `G1GC` to minimize pause latency.
    - Implemented `Incremental Cooperative Rebalancing` to prevent 'stop-the-world' rebalances.

### Incident #10.2: The 'Silent Corruption' WAL Overflow
- **Root Cause**: A downstream consumer crashed. The Debezium replication slot kept the WAL (Write-Ahead Log) open.
- **Impact**: Disk space on the primary DB hit 100%. Database outage for 4 hours.
- **Titan Mitigation**:
    - Implemented `SLO/SLI` monitoring for replication lag.
    - Automated 'Circuit Breaker' to drop the replication slot if WAL exceeds a safe threshold (preventing downtime at the cost of a full re-snapshot).

### Incident #10.3: The 'Data Skew' OOM
- **Root Cause**: A Spark join on `customer_id` where one ID (a large enterprise) had 100M records.
- **Impact**: One executor hit a `segfault` due to memory exhaustion while others were idle.
- **Titan Mitigation**:
    - Implemented `Salting` for hot keys.
    - Enabled `Adaptive Query Execution (AQE)` to handle skew at runtime.

### Titan Data Engineering Checklist (The 'Gold Standard')
- [ ] **Idempotency**: Can the pipeline be re-run safely?
- [ ] **Backpressure**: Does the consumer handle spikes without crashing?
- [ ] **Consistency**: Are there data quality gates (Great Expectations)?
- [ ] **Availability**: Is there a failover strategy for the broker?
- [ ] **Latency**: Is the p99 end-to-end latency within the SLA?
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/09_Mobile.md', mobile_scars)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/10_DataEngineering.md', de_scars)
