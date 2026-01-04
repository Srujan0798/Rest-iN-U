def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

ml_ai_content = """
## VOLUME 7: TITAN ML/AI SCARS (Incidents & Post-Mortems)

### Incident #13.1: The GPU OOM (Out of Memory) Disaster
- **Root Cause**: Training a large language model with batch size 32 on a 24GB GPU. Gradient accumulation not configured.
- **Impact**: Training job crashed after 6 hours. All progress lost. $500 in wasted GPU time.
- **Titan Mitigation**:
    - Implemented gradient checkpointing to save 60% memory.
    - Used mixed precision training (FP16) to halve memory usage.
    - Monitored GPU memory with `torch.cuda.memory_summary()`.
    - Implemented automatic batch size finder.

### Incident #13.2: The Model Drift Catastrophe
- **Root Cause**: Deployed ML model in January. By June, accuracy dropped from 95% to 65%. No retraining pipeline.
- **Impact**: Customer churn increased 40%. Revenue loss of $2M.
- **Titan Mitigation**:
    - Implemented data drift detection (KS test, PSI).
    - Set up automated retraining pipeline (weekly).
    - Monitored prediction distribution shifts.
    - Implemented A/B testing for model updates.

### Incident #13.3: The Memory Leak in Inference
- **Root Cause**: PyTorch model loaded on every request. Gradients not disabled. Memory grew linearly.
- **Impact**: Server OOM after 1000 requests. 30-minute downtime every 2 hours.
- **Titan Mitigation**:
    - Loaded model once at startup, reused for all requests.
    - Used `torch.no_grad()` and `model.eval()` for inference.
    - Implemented periodic `torch.cuda.empty_cache()`.
    - Monitored memory usage with Prometheus.

### Incident #13.4: The Race Condition in Batch Inference
- **Root Cause**: Multiple workers writing predictions to same file simultaneously without locks.
- **Impact**: Corrupted output file. Had to rerun 10-hour batch job.
- **Titan Mitigation**:
    - Implemented file-based locking with `fcntl`.
    - Used separate output files per worker, merged at end.
    - Switched to database with ACID guarantees.

### Incident #13.5: The Deadlock in Distributed Training
- **Root Cause**: Two GPUs waiting for each other's gradient synchronization. Improper barrier placement.
- **Impact**: Training hung indefinitely. Required manual intervention.
- **Titan Mitigation**:
    - Used PyTorch DDP (DistributedDataParallel) properly.
    - Implemented timeout for gradient synchronization.
    - Added health checks and automatic restart.

### TITAN ML/AI Checklist
- [ ] **Memory Leak**: Verified with `torch.cuda.memory_summary()`?
- [ ] **Model Drift**: Monitoring prediction distribution?
- [ ] **Throughput**: Batch inference optimized?
- [ ] **Latency**: p99 inference time < 100ms?
- [ ] **Availability**: Model serving has health checks?
- [ ] **Race Condition**: Concurrent writes handled?
- [ ] **Deadlock**: Distributed training tested?
"""

blockchain_content = """
## VOLUME 8: TITAN BLOCKCHAIN SCARS (Additional Incidents)

### Incident #14.1: The Reentrancy Attack (The DAO)
- **Root Cause**: External call before state update. Classic CEI (Checks-Effects-Interactions) violation.
- **Impact**: $60M drained. Ethereum hard fork.
- **Titan Mitigation**:
    - Always update state before external calls.
    - Use OpenZeppelin's `ReentrancyGuard`.
    - Implement pull payment pattern.

### Incident #14.2: The Integer Overflow (BEC Token)
- **Root Cause**: Multiplication overflow in token transfer. No SafeMath library.
- **Impact**: Attacker minted unlimited tokens. Token value crashed to zero.
- **Titan Mitigation**:
    - Use Solidity 0.8+ (built-in overflow protection).
    - Use SafeMath for older versions.
    - Implement proper testing with Echidna fuzzing.

### TITAN Blockchain Checklist
- [ ] **Reentrancy**: CEI pattern followed?
- [ ] **Access Control**: onlyOwner on critical functions?
- [ ] **Integer Overflow**: Using Solidity 0.8+?
- [ ] **Gas Optimization**: Storage packing implemented?
- [ ] **Availability**: Contract has emergency pause?
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/13_ML_AI.md', ml_ai_content)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/14_Blockchain.md', blockchain_content)

print("Expert content appended successfully!")
