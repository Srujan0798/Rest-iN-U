#!/usr/bin/env python3
"""
Sentinel - Check Dev Vault
Runs verify_all.py on the Dev Vault directory
"""
import os
import subprocess
import sys
from pathlib import Path

# Get project root and paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
DEV_VAULT_PATH = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"
VERIFY_SCRIPT = Path(__file__).parent / "verify_all.py"

def check_dev_vault():
    # Accept command line argument or use default
    target = sys.argv[1] if len(sys.argv) > 1 else str(DEV_VAULT_PATH)
    
    print(f"[CHECK] CHECKING DEV VAULT: {target}")
    print("-" * 60)
    
    if not os.path.exists(target):
        print(f"[ERROR] Dev Vault path not found: {target}")
        return 1

    if not VERIFY_SCRIPT.exists():
        print(f"[ERROR] Verification script not found: {VERIFY_SCRIPT}")
        return 1

    # Run verify_all.py targeting the Dev Vault
    cmd = [sys.executable, str(VERIFY_SCRIPT), target]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        print("[OK] Verification complete")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\n[FAIL] Verification failed: {e}")
        return 1
    except Exception as e:
        print(f"\n[ERROR] Error running verification: {e}")
        return 1

if __name__ == "__main__":
    exit(check_dev_vault())
