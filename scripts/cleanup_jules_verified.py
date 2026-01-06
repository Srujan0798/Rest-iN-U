"""
Remove Verified Files from Jules DevVault
Removes files that are identical to our current Dev Vault
"""
import os
import shutil

# Files to remove (verified as identical)
IDENTICAL_FILES = [
    "01_DEV_VAULT_MISSION.md",
    "02_GAP_ANALYSIS.md",
    "03_DEV_VAULT_STATUS_REPORT.md",
    "04_DEV_VAULT_TARGETS_TRACKING.md",
    "05_DEV_VAULT_ENHANCEMENT_PLAN.md",
    "06_COMPLETE_STRUCTURE.md",
    "BRAIN/00_BRAIN_INDEX.md",
    "BRAIN/01_ROOT_CAUSE_DATABASE.md",
    "BRAIN/02_DECISION_TREES.md",
    "BRAIN/03_DEPENDENCY_MAPS.md",
    "BRAIN/04_CHECKLISTS.md",
    "BRAIN/05_BRAIN_ACTIVATION_SYSTEM.md",
    "BRAIN/BRAIN_ACTIVATION_SYSTEM.md",
    "BRAIN/CHECKLISTS.md",
    "BRAIN/DECISION_TREES.md",
    "BRAIN/DEPENDENCY_MAPS.md",
    "BRAIN/README.md",
    "GAP_ANALYSIS.md",
    "KNOWLEDGE/00_MASTER_INDEX.md",
    "KNOWLEDGE/ADAPTATION_GUIDE.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/14_Blockchain.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/15_IoT.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/16_RealTime_Video.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/17_VR_AR.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/18_Investment.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/19_Climate.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/20_Legal_Docs.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/21_Localization.md",
    "KNOWLEDGE/SPECIALIZED_DOMAINS/22_Ancient_Wisdom.md",
    "KNOWLEDGE/TIER_STRUCTURE.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/01_Frontend.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/02_Backend.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/03_Database.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/04_Testing.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/05_Security.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/06_DevOps.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/07_Cloud.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/08_System_Design.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/09_Mobile.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/10_DataEngineering.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/11_Search.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/12_Payments.md",
    "KNOWLEDGE/UNIVERSAL_DOMAINS/13_ML_AI.md",
    "README.md"
]

JULES_ROOT = "jules_devvault/DevVault"

def main():
    print("=" * 80)
    print("REMOVING VERIFIED FILES FROM JULES DEVVAULT")
    print("=" * 80)
    print(f"Files to remove: {len(IDENTICAL_FILES)}\n")
    
    removed_count = 0
    error_count = 0
    
    for rel_path in IDENTICAL_FILES:
        file_path = os.path.join(JULES_ROOT, rel_path)
        
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[REMOVED] {rel_path}")
                removed_count += 1
            except Exception as e:
                print(f"[ERROR] {rel_path}: {e}")
                error_count += 1
        else:
            print(f"[SKIP] {rel_path} - not found")
    
    # Remove empty directories
    print("\nRemoving empty directories...")
    for root, dirs, files in os.walk(JULES_ROOT, topdown=False):
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            try:
                if not os.listdir(dir_path):  # Empty directory
                    os.rmdir(dir_path)
                    print(f"[REMOVED DIR] {os.path.relpath(dir_path, JULES_ROOT)}")
            except:
                pass
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print("=" * 80)
    print(f"Files removed: {removed_count}")
    print(f"Errors: {error_count}")
    
    # Check what's left
    remaining = []
    for root, dirs, files in os.walk(JULES_ROOT):
        for file in files:
            if file.endswith('.md'):
                rel_path = os.path.relpath(os.path.join(root, file), JULES_ROOT)
                remaining.append(rel_path)
    
    print(f"\nRemaining files in Jules DevVault: {len(remaining)}")
    if remaining:
        print("\nRemaining files (old backups):")
        for f in remaining:
            print(f"  - {f}")

if __name__ == "__main__":
    main()
