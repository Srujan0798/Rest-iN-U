def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

iot_final = """
### TITAN: IoT System Architecture Deep Dive
- **MQTT Cluster Architecture**: Implementing EMQX clustering with shared subscriptions for horizontal scaling. Using sticky sessions for QoS 2 messages. Monitoring cluster split-brain scenarios and implementing automatic healing.
- **Edge Gateway Design**: Building resilient gateways with offline buffering and sync queues. Implementing WAL (Write-Ahead Log) for message persistence. Monitoring queue depth and implementing backpressure when cloud is unavailable.
- **Device Provisioning**: Implementing zero-touch provisioning with unique device certificates. Using TPM for hardware root of trust. Monitoring provisioning success rate and detecting rogue devices.
- **Firmware Management**: Implementing delta updates to minimize bandwidth. Using binary diff algorithms. Monitoring update progress and implementing automatic retry with exponential backoff.
- **Sensor Fusion**: Combining data from multiple sensors for accuracy. Implementing Kalman filters. Monitoring sensor drift and implementing automatic calibration.
- **Protocol Optimization**: Using MQTT-SN for constrained networks. Implementing CoAP for battery-powered devices. Monitoring protocol overhead and optimizing message size.
- **Data Pipeline**: Implementing stream processing with Apache Kafka. Using time-series databases (InfluxDB, TimescaleDB). Monitoring data ingestion rate and implementing downsampling for long-term storage.
- **Anomaly Detection**: Using statistical methods and ML models at the edge. Implementing threshold-based alerts. Monitoring false positive rate and tuning detection parameters.
- **Device Lifecycle**: Tracking device inventory, health status, and decommissioning. Implementing secure wipe on retirement. Monitoring device fleet health and predicting failures.
- **Network Topology**: Designing mesh networks with LoRaWAN. Implementing multi-hop routing. Monitoring network coverage and optimizing gateway placement.
"""

video_final = """
### TITAN: RealTime Video System Architecture Deep Dive
- **SFU Cascading**: Implementing distributed SFU architecture for global scale. Using geographic routing for latency optimization. Monitoring inter-SFU bandwidth and implementing intelligent routing.
- **Bandwidth Estimation**: Implementing TWCC (Transport-Wide Congestion Control) for accurate BWE. Using REMB (Receiver Estimated Maximum Bitrate). Monitoring packet loss and RTT for congestion detection.
- **Simulcast Management**: Implementing automatic layer switching based on receiver bandwidth. Using temporal and spatial scalability. Monitoring layer distribution and optimizing encoder settings.
- **Audio Processing**: Implementing echo cancellation (AEC), noise suppression, and automatic gain control (AGC). Using WebAudio API for advanced processing. Monitoring audio quality metrics.
- **Video Quality Adaptation**: Implementing dynamic resolution and framerate adjustment. Using VMAF for perceptual quality measurement. Monitoring user-reported quality issues.
- **Recording Pipeline**: Implementing server-side recording with synchronized audio/video tracks. Using FFmpeg for muxing and transcoding. Monitoring recording failures and storage usage.
- **CDN Integration**: Using multi-CDN strategy for HLS/DASH delivery. Implementing origin shield for cache efficiency. Monitoring cache hit rates and edge performance.
- **DRM Implementation**: Implementing Widevine, FairPlay, and PlayReady for content protection. Using CENC (Common Encryption). Monitoring license delivery and detecting piracy.
- **Live Streaming**: Implementing LL-HLS (Low-Latency HLS) for sub-3-second latency. Using chunked transfer encoding. Monitoring segment delivery and player buffer health.
- **Transcoding Optimization**: Using GPU acceleration for real-time transcoding. Implementing per-title encoding for optimal quality. Monitoring transcoding queue depth and resource utilization.
- **Network Resilience**: Implementing automatic reconnection with state recovery. Using packet retransmission (RTX) and forward error correction (FEC). Monitoring connection stability.
- **Quality of Service**: Implementing priority queuing for video packets. Using DSCP marking for network QoS. Monitoring packet loss and jitter across the network path.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/15_IoT.md', iot_final)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/16_RealTime_Video.md', video_final)

print("Final content appended successfully!")
