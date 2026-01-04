def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

iot_boost = """
### TITAN: Advanced IoT Production Patterns
- **MQTT Broker Scaling**: Using clustered EMQX brokers with shared subscriptions. Monitoring connection count, message throughput, and implementing rate limiting to prevent thundering herd.
- **Edge Processing**: Implementing local anomaly detection to reduce cloud bandwidth. Using TinyML for on-device inference. Monitoring CPU usage and battery drain.
- **OTA Update Strategy**: Using staged rollouts with A/B partitioning. Implementing rollback on boot failure. Monitoring update success rate and device availability.
- **Power Optimization**: Using deep sleep modes with wake-on-interrupt. Monitoring battery voltage and implementing low-power alerts. Optimizing radio usage to extend battery life to years.
- **Security Hardening**: Implementing TLS 1.3 for MQTT connections. Using secure boot and hardware security modules. Rotating certificates and monitoring for security incidents.
- **FreeRTOS Task Management**: Proper task prioritization to prevent priority inversion. Using mutexes and semaphores correctly to avoid deadlocks. Monitoring task stack usage and implementing watchdog timers.
- **Memory Management**: Tracking heap fragmentation and implementing periodic reboots. Using memory pools to prevent fragmentation. Monitoring for memory leaks with heap tracking.
- **Network Resilience**: Implementing exponential backoff with jitter for reconnections. Using QoS 1 for critical messages. Monitoring network latency and packet loss.
- **Time Synchronization**: Using NTP for accurate timestamps. Implementing drift correction. Monitoring clock skew across device fleet.
- **Distributed Coordination**: Using MQTT retained messages for device state. Implementing eventual consistency patterns. Monitoring for split-brain scenarios.
- **Garbage Collection**: Minimizing GC pauses in gateway software. Using object pooling. Monitoring GC frequency and pause times.
- **Event Loop**: Keeping event loop responsive in gateway applications. Using non-blocking I/O. Monitoring event loop lag.
- **Replication**: Using redundant MQTT brokers for high availability. Implementing automatic failover. Monitoring replication lag.
- **Sharding**: Distributing devices across multiple broker instances. Using consistent hashing for routing. Monitoring load distribution.
- **WAL (Write-Ahead Log)**: Using persistent queues for offline buffering. Implementing proper fsync strategies. Monitoring queue depth.
- **Circuit Breaker**: Implementing automatic retry limits. Detecting unhealthy backends. Monitoring error rates and implementing automatic recovery.
- **Backpressure**: Handling sensor data spikes gracefully. Implementing queue-based buffering. Monitoring queue depth and dropping old data when necessary.
- **Cold Start**: Optimizing device boot time. Pre-loading configuration. Monitoring time-to-first-message.
- **Partition Tolerance**: Designing for network partitions. Implementing offline-first architecture. Monitoring connectivity status.
- **Consistency**: Ensuring data consistency across distributed sensors. Using vector clocks for conflict resolution. Monitoring for data conflicts.
"""

video_boost = """
### TITAN: Advanced RealTime Video Production Patterns
- **SFU Architecture**: Implementing selective forwarding units for scalable WebRTC. Using simulcast for multiple quality tiers. Monitoring bandwidth usage and connection quality.
- **Adaptive Bitrate**: Implementing bandwidth estimation algorithms. Using TWCC (Transport-Wide Congestion Control). Monitoring packet loss and adjusting bitrate dynamically.
- **Jitter Buffer Management**: Implementing adaptive jitter buffers (50ms-500ms). Using packet loss concealment. Monitoring jitter metrics and audio-video sync.
- **Codec Optimization**: Using hardware acceleration (NVENC, QuickSync) for encoding. Implementing AV1 for better compression. Monitoring encoding latency and CPU usage.
- **Connection Management**: Implementing ICE with STUN/TURN fallback. Using exponential backoff for reconnections. Monitoring connection success rate and latency.
- **Quality Monitoring**: Tracking VMAF scores for perceptual quality. Monitoring MOS (Mean Opinion Score). Implementing automatic quality degradation.
- **Memory Management**: Properly releasing VideoFrame objects. Implementing object pooling. Monitoring heap usage and detecting memory leaks.
- **Garbage Collection**: Minimizing GC pauses in JavaScript video processing. Using Web Workers for CPU-intensive tasks. Monitoring GC frequency.
- **Event Loop**: Keeping browser event loop responsive. Offloading video processing to WASM. Monitoring frame drops and event loop lag.
- **Race Condition Prevention**: Using distributed locks for stream routing. Implementing idempotent operations. Monitoring for duplicate streams.
- **Deadlock Avoidance**: Proper state machine design in media pipelines. Using timeout mechanisms. Monitoring for hung connections.
- **Throughput Optimization**: Using simulcast and SVC for bandwidth efficiency. Implementing FEC (Forward Error Correction). Monitoring bitrate and packet loss.
- **Latency Optimization**: Minimizing glass-to-glass delay. Using WebRTC instead of HLS for real-time. Monitoring end-to-end latency.
- **Availability**: Implementing SFU cascading for high availability. Using health checks and automatic failover. Monitoring uptime and connection success rate.
- **Consistency**: Maintaining audio-video synchronization. Using RTP timestamps. Implementing drift correction.
- **Partition Tolerance**: Handling network partitions gracefully. Implementing automatic reconnection. Monitoring connectivity status.
- **Backpressure**: Managing video frame queues during congestion. Dropping frames intelligently. Signaling sender to reduce bitrate.
- **Circuit Breaker**: Detecting problematic streams and stopping them. Implementing automatic recovery. Monitoring error rates.
- **Segfault Prevention**: Proper memory management in WASM video filters. Using bounds checking. Monitoring for crashes.
- **Replication**: Using multiple TURN servers for redundancy. Implementing geographic distribution. Monitoring server health.
- **Sharding**: Distributing users across multiple SFU instances. Using consistent hashing. Monitoring load distribution.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/15_IoT.md', iot_boost)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/16_RealTime_Video.md', video_boost)

print("Boost content appended successfully!")
