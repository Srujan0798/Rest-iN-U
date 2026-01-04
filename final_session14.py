def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

vr_ar_final = """
### TITAN: VR/AR System Architecture Deep Dive
- **WebXR Session Management**: Implementing proper session lifecycle with error handling. Using XRSession for immersive-vr and immersive-ar modes. Monitoring session state and implementing graceful degradation when VR unavailable.
- **Rendering Pipeline**: Implementing efficient render loop with requestAnimationFrame. Using WebGL2 for advanced features. Monitoring GPU utilization and implementing dynamic quality scaling. Using deferred rendering for complex scenes.
- **Asset Loading**: Implementing progressive loading with priority queues. Using Draco compression for geometry. Implementing texture streaming with mipmaps. Monitoring load time and bandwidth usage.
- **Collision Detection**: Using spatial partitioning (octree, BVH) for efficient collision queries. Implementing continuous collision detection for fast-moving objects. Monitoring collision checks per frame.
- **Network Architecture**: Implementing authoritative server for multiplayer. Using WebRTC data channels for low-latency communication. Monitoring packet loss and implementing jitter buffers. Using delta compression for state updates.
- **State Management**: Implementing entity-component-system (ECS) architecture. Using immutable state for predictability. Monitoring state size and implementing state pruning.
- **Performance Profiling**: Using Chrome DevTools for WebGL profiling. Implementing custom performance markers. Monitoring frame budget (11ms for 90fps). Using GPU queries for precise timing.
- **Quality Settings**: Implementing presets (Low/Medium/High/Ultra). Using adaptive quality based on frame rate. Monitoring user preferences and hardware capabilities.
- **Accessibility**: Implementing comfort settings (teleport vs smooth locomotion). Using vignette during movement. Monitoring motion sickness reports and implementing configurable options.
- **Cross-Platform**: Supporting Quest, PCVR, and mobile AR. Implementing feature detection and polyfills. Monitoring platform-specific issues and implementing workarounds.
- **Testing**: Implementing automated testing with headless WebXR. Using visual regression testing. Monitoring test coverage and implementing CI/CD pipelines.
- **Analytics**: Tracking user behavior in VR (gaze heatmaps, interaction patterns). Monitoring session duration and drop-off points. Implementing privacy-preserving analytics.
- **Security**: Implementing CSP (Content Security Policy) for WebXR. Using HTTPS for all assets. Monitoring for XSS vulnerabilities and implementing input sanitization.
- **Deployment**: Using CDN for global asset distribution. Implementing cache strategies. Monitoring cache hit rates and implementing versioning.
- **Documentation**: Maintaining comprehensive API documentation. Using TypeScript for type safety. Monitoring developer experience and implementing examples.
"""

investment_final = """
### TITAN: Investment System Architecture Deep Dive
- **Order Management System**: Implementing FIX protocol for exchange connectivity. Using state machines for order lifecycle. Monitoring order states and implementing reconciliation. Using idempotent order IDs to prevent duplicates.
- **Market Data Infrastructure**: Implementing multicast UDP for market data. Using kernel bypass (DPDK) for ultra-low latency. Monitoring packet loss and implementing gap fill requests. Using normalized data model across venues.
- **Execution Algorithms**: Implementing TWAP (Time-Weighted Average Price) and VWAP (Volume-Weighted Average Price). Using adaptive algorithms based on market conditions. Monitoring execution quality and slippage.
- **Risk Engine**: Implementing real-time position tracking across all accounts. Using pre-trade risk checks (position limits, concentration limits). Monitoring risk metrics (VaR, Greeks) and implementing automatic hedging.
- **Backtesting Framework**: Using event-driven architecture for realistic simulation. Implementing proper handling of corporate actions (splits, dividends). Monitoring backtest performance and implementing walk-forward analysis.
- **Data Pipeline**: Using Apache Kafka for real-time data streaming. Implementing exactly-once semantics. Monitoring lag and implementing backpressure. Using schema registry for data validation.
- **Storage Layer**: Using TimescaleDB for time-series data. Implementing partitioning by time and symbol. Monitoring query performance and implementing materialized views. Using compression for historical data.
- **Caching Strategy**: Using Redis for hot data (positions, orders). Implementing cache invalidation strategies. Monitoring cache hit rates and implementing read-through caching.
- **API Layer**: Implementing REST API for portfolio queries. Using GraphQL for flexible data fetching. Monitoring API latency and implementing rate limiting. Using API versioning for backward compatibility.
- **Authentication**: Implementing OAuth2 for API access. Using JWT tokens with short expiration. Monitoring authentication failures and implementing MFA. Using role-based access control (RBAC).
- **Monitoring Stack**: Using Prometheus for metrics collection. Implementing Grafana dashboards for visualization. Monitoring SLA/SLO/SLI and implementing alerting with PagerDuty.
- **Logging**: Using structured logging (JSON format). Implementing distributed tracing with Jaeger. Monitoring log volume and implementing log aggregation with ELK stack.
- **Disaster Recovery**: Implementing automated backups with point-in-time recovery. Using geographic replication for high availability. Monitoring replication lag and implementing automatic failover.
- **Compliance**: Implementing audit trails for all trades. Using immutable event sourcing. Monitoring regulatory requirements (MiFID II, Reg NMS) and implementing reporting.
- **Testing**: Implementing unit tests, integration tests, and end-to-end tests. Using property-based testing for edge cases. Monitoring test coverage and implementing mutation testing.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/17_VR_AR.md', vr_ar_final)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/18_Investment.md', investment_final)

print("Final content appended successfully!")
