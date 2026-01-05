def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

iot_content = """
## VOLUME 7: TITAN IOT SCARS (Incidents & Post-Mortems)

### Incident #15.1: The MQTT Broker Meltdown
- **Root Cause**: 10,000 IoT devices reconnecting simultaneously after network outage. No exponential backoff, no jitter.
- **Impact**: MQTT broker overwhelmed. Thundering herd problem. 2-hour outage.
- **Titan Mitigation**:
    - Implemented exponential backoff with jitter for reconnections.
    - Used QoS 1 for at-least-once delivery with proper acknowledgment.
    - Monitored connection rate and implemented rate limiting.
    - Added circuit breakers to prevent cascade failures.

### Incident #15.2: The Memory Leak in Edge Devices
- **Root Cause**: ESP32 devices running for months without reboot. Memory fragmentation in heap. No proper cleanup of MQTT buffers.
- **Impact**: Devices crashed after 30 days. Required manual power cycling of 1000+ devices.
- **Titan Mitigation**:
    - Implemented periodic memory monitoring with `esp_get_free_heap_size()`.
    - Added automatic reboot every 7 days during low-traffic hours.
    - Fixed memory leaks by properly freeing MQTT message buffers.
    - Used FreeRTOS task watchdogs to detect hung tasks.

### Incident #15.3: The Race Condition in OTA Updates
- **Root Cause**: Multiple devices downloading firmware simultaneously. Server couldn't handle concurrent connections. Some devices got corrupted firmware.
- **Impact**: 500 bricked devices. Required truck rolls for manual recovery.
- **Titan Mitigation**:
    - Implemented staged rollout (10% -> 50% -> 100%).
    - Used A/B partitioning with automatic rollback on boot failure.
    - Added firmware signature verification before flashing.
    - Implemented distributed locks to prevent concurrent updates.

### Incident #15.4: The Deadlock in Sensor Reading
- **Root Cause**: Two FreeRTOS tasks competing for I2C bus access. Improper mutex usage caused deadlock.
- **Impact**: Devices hung indefinitely. Required remote reboot.
- **Titan Mitigation**:
    - Implemented proper mutex acquisition order.
    - Added timeout for I2C operations.
    - Used task priorities correctly to prevent priority inversion.
    - Monitored task states with watchdog timers.

### Incident #15.5: The Throughput Collapse
- **Root Cause**: Devices sending full JSON payloads (200 bytes) every second over LTE. Exceeded data plan limits.
- **Impact**: $50,000 overage charges in one month.
- **Titan Mitigation**:
    - Switched to Protobuf binary format (20 bytes).
    - Implemented edge processing to send only anomalies.
    - Used MQTT QoS 0 for non-critical telemetry.
    - Added local buffering and batch uploads.

## VOLUME 8: THE TITAN IOT MANIFESTO

To achieve Titan status, an IoT system must survive these production scars:
1. **The Availability War**: Maintaining device uptime of 99.9%. We use health checks, watchdog timers, and implement retry logic with exponential backoff and jitter.
2. **The Latency Challenge**: Keeping end-to-end latency under 1 second for critical commands. We use MQTT QoS levels appropriately and monitor network round-trip time.
3. **The Consistency Challenge**: Handling eventual consistency in distributed sensor networks. We use proper time synchronization (NTP) and implement conflict resolution strategies.
4. **The Memory Management**: Monitoring heap fragmentation, detecting memory leaks, and implementing proper cleanup. We use FreeRTOS heap tracking and periodic reboots.
5. **The Race Condition Prevention**: Avoiding race conditions in multi-task embedded systems. We use proper mutex/semaphore patterns and implement atomic operations.
6. **The Deadlock Avoidance**: Preventing deadlocks in resource-constrained devices. We use timeout mechanisms and proper lock ordering.
7. **The Throughput Optimization**: Maximizing data throughput while minimizing bandwidth costs. We use compression, batching, and edge processing.
8. **The Power Management**: Extending battery life to years. We use deep sleep modes, wake-on-interrupt, and optimize radio usage.
9. **The Security**: Implementing end-to-end encryption, secure boot, and OTA update verification. We use TLS 1.3, hardware security modules, and certificate rotation.
10. **The Partition Tolerance**: Designing systems to handle network partitions gracefully. We implement offline-first architecture with local storage and sync queues.
"""

video_content = """
## VOLUME 7: TITAN REALTIME VIDEO SCARS (Incidents & Post-Mortems)

### Incident #16.1: The WebRTC Connection Storm
- **Root Cause**: 1000 users joining video call simultaneously. ICE candidate gathering overwhelmed TURN servers.
- **Impact**: 60% connection failure rate. Users saw black screens.
- **Titan Mitigation**:
    - Implemented connection rate limiting on TURN servers.
    - Used STUN servers for 80% of users, TURN only as fallback.
    - Added exponential backoff with jitter for ICE retries.
    - Monitored connection success rate and latency.

### Incident #16.2: The Jitter Buffer Overflow
- **Root Cause**: Network jitter exceeded 200ms. Jitter buffer overflowed. Audio/video desynchronization.
- **Impact**: Users experienced choppy video and audio drift.
- **Titan Mitigation**:
    - Implemented adaptive jitter buffer sizing (50ms-500ms).
    - Used packet loss concealment (PLC) for missing frames.
    - Monitored jitter metrics and implemented quality degradation alerts.
    - Added forward error correction (FEC) for critical streams.

### Incident #16.3: The Memory Leak in Video Processing
- **Root Cause**: WebAssembly background blur filter not releasing video frames. Memory grew linearly.
- **Impact**: Browser tab crashed after 30 minutes of video call.
- **Titan Mitigation**:
    - Properly released VideoFrame objects after processing.
    - Implemented periodic garbage collection triggers.
    - Monitored memory usage with Performance API.
    - Added memory leak detection in development.

### Incident #16.4: The Race Condition in SFU Routing
- **Root Cause**: Two subscribers requesting same stream simultaneously. SFU created duplicate forwarding paths.
- **Impact**: Wasted bandwidth. Some users received duplicate streams.
- **Titan Mitigation**:
    - Implemented distributed locks for stream routing decisions.
    - Used idempotent stream subscription requests.
    - Added deduplication logic in SFU routing layer.
    - Monitored for duplicate stream IDs.

### Incident #16.5: The Latency Spike During Peak Hours
- **Root Cause**: Transcoding servers at 100% CPU. Queue backlog grew to 30 seconds.
- **Impact**: Live stream latency increased from 2s to 35s.
- **Titan Mitigation**:
    - Implemented auto-scaling for transcoding workers.
    - Used GPU acceleration (NVENC) instead of CPU encoding.
    - Added backpressure mechanisms to reject new streams when overloaded.
    - Monitored queue depth and p99 latency.

## VOLUME 8: THE TITAN REALTIME VIDEO MANIFESTO

To achieve Titan status, a real-time video system must survive these production scars:
1. **The Availability War**: Maintaining video service uptime of 99.99%. We use SFU cascading, health checks, and implement automatic failover.
2. **The Latency Demon**: Keeping glass-to-glass latency under 500ms. We use WebRTC, optimize jitter buffers, and monitor end-to-end delay.
3. **The Jitter Challenge**: Handling network jitter gracefully. We use adaptive jitter buffers, FEC, and packet loss concealment.
4. **The Memory Management**: Preventing memory leaks in video processing pipelines. We properly release VideoFrame objects and monitor heap usage.
5. **The Race Condition Prevention**: Avoiding race conditions in concurrent stream routing. We use distributed locks and idempotent operations.
6. **The Throughput Optimization**: Maximizing video quality while minimizing bandwidth. We use simulcast, SVC, and adaptive bitrate algorithms.
7. **The Consistency Challenge**: Maintaining audio-video synchronization. We use RTP timestamps and implement drift correction.
8. **The Deadlock Avoidance**: Preventing deadlocks in media pipeline state machines. We use timeout mechanisms and proper state transitions.
9. **The Garbage Collection**: Minimizing GC pauses in JavaScript video processing. We use object pooling and avoid allocations in hot paths.
10. **The Event Loop**: Keeping the event loop responsive during video processing. We use Web Workers and offload CPU-intensive tasks.
11. **The Segfault Prevention**: Proper memory management in native video codecs (WASM). We use bounds checking and safe memory access patterns.
12. **The Partition Tolerance**: Handling network partitions in distributed SFU architecture. We implement automatic reconnection and state recovery.
13. **The Backpressure Handling**: Managing video frame queues during congestion. We drop frames intelligently and signal sender to reduce bitrate.
14. **The Circuit Breaker Pattern**: Automatically stopping problematic streams. We detect quality degradation and implement automatic recovery.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/15_IoT.md', iot_content)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/16_RealTime_Video.md', video_content)

print("Expert content appended successfully!")
