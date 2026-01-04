def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

vr_ar_content = """
## VOLUME 7: TITAN VR/AR SCARS (Incidents & Post-Mortems)

### Incident #17.1: The Frame Rate Collapse
- **Root Cause**: WebXR scene with 500k triangles and real-time shadows. No occlusion culling. Browser rendering at 15fps instead of 90fps.
- **Impact**: Motion sickness for 80% of users. Tracking lost. App unusable.
- **Titan Mitigation**:
    - Implemented aggressive LOD (Level of Detail) system with 3 quality tiers.
    - Used baked lightmaps instead of real-time shadows.
    - Implemented occlusion culling and frustum culling.
    - Monitored frame time and implemented dynamic quality degradation.
    - Kept scene under 100k triangles for mobile VR.

### Incident #17.2: The Memory Leak in 3D Asset Loading
- **Root Cause**: Three.js scene loading new GLTF models without disposing old ones. Memory grew linearly.
- **Impact**: Browser tab crashed after 10 minutes. Lost user progress.
- **Titan Mitigation**:
    - Properly disposed geometries, materials, and textures using `.dispose()`.
    - Implemented object pooling for frequently used assets.
    - Monitored memory usage with Performance API.
    - Added periodic garbage collection triggers.

### Incident #17.3: The Race Condition in Multiplayer Sync
- **Root Cause**: Two players grabbing same object simultaneously. No distributed locking. State desynchronization.
- **Impact**: Object duplicated. Physics glitches. Game state corrupted.
- **Titan Mitigation**:
    - Implemented server-authoritative physics with client prediction.
    - Used optimistic locking with version numbers.
    - Added conflict resolution with "last write wins" strategy.
    - Monitored sync errors and implemented automatic state recovery.

### Incident #17.4: The Latency Spike in Cloud Rendering
- **Root Cause**: Pixel streaming server at 100% CPU. Queue backlog grew to 5 seconds.
- **Impact**: Input lag made VR experience unusable. Users experienced severe motion sickness.
- **Titan Mitigation**:
    - Implemented auto-scaling for rendering workers.
    - Used GPU acceleration instead of CPU rendering.
    - Added backpressure mechanisms to reject new connections when overloaded.
    - Monitored queue depth and p99 latency.

### Incident #17.5: The Deadlock in Asset Pipeline
- **Root Cause**: Two workers trying to compress same texture simultaneously. Improper file locking caused deadlock.
- **Impact**: Build pipeline hung. Deployment blocked for 2 hours.
- **Titan Mitigation**:
    - Implemented distributed locks with timeout.
    - Used task queue with idempotent operations.
    - Added deadlock detection and automatic recovery.
    - Monitored build pipeline health.

## VOLUME 8: THE TITAN VR/AR MANIFESTO

To achieve Titan status, a VR/AR system must survive these production scars:
1. **The Availability War**: Maintaining VR service uptime of 99.9%. We use health checks, automatic failover, and implement retry logic with exponential backoff.
2. **The Latency Demon**: Keeping motion-to-photon latency under 20ms. We use asynchronous reprojection, predictive tracking, and monitor frame time religiously.
3. **The Memory Management**: Preventing memory leaks in 3D asset loading. We properly dispose geometries/materials/textures and implement object pooling.
4. **The Race Condition Prevention**: Avoiding race conditions in multiplayer state sync. We use server-authoritative physics and optimistic locking.
5. **The Throughput Optimization**: Maximizing rendering throughput while maintaining 90fps. We use LOD, occlusion culling, and GPU instancing.
6. **The Consistency Challenge**: Maintaining synchronized state across multiplayer clients. We use client prediction with server reconciliation.
7. **The Deadlock Avoidance**: Preventing deadlocks in asset pipeline. We use timeout mechanisms and proper lock ordering.
8. **The Garbage Collection**: Minimizing GC pauses in WebXR applications. We use object pooling and avoid allocations in render loop.
9. **The Event Loop**: Keeping browser event loop responsive during 3D rendering. We use Web Workers for CPU-intensive tasks.
10. **The Segfault Prevention**: Proper memory management in WASM-based physics engines. We use bounds checking and safe memory access.
11. **The Partition Tolerance**: Handling network partitions in multiplayer VR. We implement offline mode with state buffering.
12. **The Backpressure Handling**: Managing render queue during performance spikes. We drop frames intelligently and degrade quality.
13. **The Circuit Breaker Pattern**: Automatically stopping problematic rendering tasks. We detect performance degradation and implement recovery.
14. **The Jitter Management**: Handling network jitter in multiplayer VR. We use adaptive jitter buffers and interpolation.
15. **The Cold Start Optimization**: Minimizing VR app load time. We pre-load critical assets and use progressive loading.
"""

investment_content = """
## VOLUME 7: TITAN INVESTMENT SCARS (Incidents & Post-Mortems)

### Incident #18.1: The High-Frequency Trading Meltdown
- **Root Cause**: Python trading system with garbage collection pauses of 50ms. In HFT, 50ms = eternity.
- **Impact**: Missed profitable trades. Lost $100k in one day due to execution delays.
- **Titan Mitigation**:
    - Rewrote critical path in C++ with zero-copy message parsing.
    - Implemented lock-free queues for order routing.
    - Used memory pools to eliminate GC pauses.
    - Monitored latency with microsecond precision.
    - Achieved sub-millisecond order execution.

### Incident #18.2: The Survivorship Bias Disaster
- **Root Cause**: Backtested strategy on current S&P 500 constituents. Ignored bankruptcies and delistings.
- **Impact**: Strategy showed 20% annual return in backtest. Lost 15% in live trading.
- **Titan Mitigation**:
    - Used point-in-time universe with historical constituents.
    - Included delisted stocks and bankruptcies in backtest.
    - Implemented proper transaction costs and slippage modeling.
    - Monitored live vs backtest performance divergence.

### Incident #18.3: The Race Condition in Order Execution
- **Root Cause**: Two threads submitting orders for same symbol simultaneously. No distributed locking.
- **Impact**: Duplicate orders executed. Position size doubled. Risk limits breached.
- **Titan Mitigation**:
    - Implemented distributed locks with Redis for order submission.
    - Used idempotent order IDs to prevent duplicates.
    - Added position reconciliation checks.
    - Monitored for duplicate executions.

### Incident #18.4: The Memory Leak in Market Data Feed
- **Root Cause**: Market data handler not releasing tick data buffers. Memory grew to 16GB over 24 hours.
- **Impact**: Process crashed during market hours. Lost connection to exchange.
- **Titan Mitigation**:
    - Implemented circular buffers with fixed size.
    - Added periodic memory cleanup.
    - Monitored memory usage with alerts.
    - Used memory profiling to detect leaks.

### Incident #18.5: The Deadlock in Portfolio Rebalancing
- **Root Cause**: Two rebalancing jobs trying to update same positions simultaneously. Improper lock acquisition order.
- **Impact**: System hung for 30 minutes. Unable to respond to market moves.
- **Titan Mitigation**:
    - Standardized lock acquisition order (always acquire locks in symbol order).
    - Implemented deadlock detection with timeout.
    - Added automatic retry with exponential backoff.
    - Monitored for hung transactions.

## VOLUME 8: THE TITAN INVESTMENT MANIFESTO

To achieve Titan status, an investment system must survive these production scars:
1. **The Availability War**: Maintaining trading system uptime of 99.99%. We use redundant order routers, health checks, and automatic failover.
2. **The Latency Demon**: Keeping order execution latency under 1ms for HFT. We use C++ for critical path, lock-free data structures, and co-location.
3. **The Consistency Challenge**: Maintaining accurate position tracking across distributed systems. We use event sourcing and ACID transactions.
4. **The Memory Management**: Preventing memory leaks in long-running trading processes. We use memory pools and monitor heap usage.
5. **The Race Condition Prevention**: Avoiding race conditions in order submission. We use distributed locks and idempotent operations.
6. **The Deadlock Avoidance**: Preventing deadlocks in portfolio management. We use proper lock ordering and timeout mechanisms.
7. **The Throughput Optimization**: Maximizing market data processing throughput. We use zero-copy parsing and batch processing.
8. **The Garbage Collection**: Eliminating GC pauses in latency-sensitive code. We use manual memory management in C++.
9. **The Event Loop**: Keeping event loop responsive during market data spikes. We use dedicated threads for I/O.
10. **The Segfault Prevention**: Proper memory management in native code. We use bounds checking and RAII patterns.
11. **The Partition Tolerance**: Handling network partitions to exchanges. We implement automatic reconnection and state recovery.
12. **The Backpressure Handling**: Managing order queue during volatility spikes. We implement rate limiting and queue monitoring.
13. **The Circuit Breaker Pattern**: Automatically stopping trading when risk limits breached. We monitor P&L and implement kill switches.
14. **The WAL (Write-Ahead Log)**: Using transaction logs for audit trail and recovery. We implement proper fsync strategies.
15. **The Replication**: Using redundant systems for high availability. We implement active-active replication with conflict resolution.
16. **The Sharding**: Distributing symbols across multiple trading engines. We use consistent hashing for routing.
17. **The Cold Start**: Optimizing system startup time. We pre-load reference data and warm up connections.
18. **The Jitter Management**: Handling timing jitter in order execution. We use high-resolution timers and timestamp synchronization.
19. **The SLA/SLO/SLI**: Monitoring service level objectives. We track execution latency, fill rates, and system uptime.
20. **The Incident Response**: Having runbooks for every failure scenario. We practice disaster recovery and maintain on-call rotation.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/17_VR_AR.md', vr_ar_content)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/18_Investment.md', investment_content)

print("Expert content appended successfully!")
