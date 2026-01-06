import os
import subprocess
import sys

# Path to the Dev Vault
DEV_VAULT_PATH = r"c:\Users\Student\Documents\Rest-iN-U\docs\Dev Vault (ETERNAL MANUAL)"
VERIFY_SCRIPT = "scriptsDx/sentinel/verify_all.py"

def check_dev_vault():
    print(f"[CHECK] CHECKING DEV VAULT: {DEV_VAULT_PATH}")
    print("-" * 60)
    
    if not os.path.exists(DEV_VAULT_PATH):
        print(f"[ERROR] Dev Vault path not found: {DEV_VAULT_PATH}")
        return

    if not os.path.exists(VERIFY_SCRIPT):
        print(f"[ERROR] Verification script not found: {VERIFY_SCRIPT}")
        return

    # Run verify_all.py targeting the Dev Vault
    cmd = ["python", VERIFY_SCRIPT, DEV_VAULT_PATH]
    
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError:
        print("\n[FAIL] Verification failed.")
    except Exception as e:
        print(f"\n[ERROR] Error running verification: {e}")

if __name__ == "__main__":
    check_dev_vault()
    input("\nPress Enter to exit...")
