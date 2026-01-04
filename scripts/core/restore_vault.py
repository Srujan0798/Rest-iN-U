import os
import shutil

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"
BACKUP_DIR = os.path.join(VAULT_DIR, "BACKUP_BEFORE_TITAN_CLEAN")

def restore_backup():
    if not os.path.exists(BACKUP_DIR):
        print("Backup directory not found!")
        return

    print(f"Restoring from {BACKUP_DIR}...")
    for f in os.listdir(BACKUP_DIR):
        if f.endswith(".md"):
            src = os.path.join(BACKUP_DIR, f)
            dst = os.path.join(VAULT_DIR, f)
            shutil.copy2(src, dst)
            print(f"Restored {f}")
    print("Restore complete.")

if __name__ == "__main__":
    restore_backup()
