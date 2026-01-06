"""
EMERGENCY FIX: Apply Jules' encoding fixes to our REAL Dev Vault
Copy Jules' fixed files to docs/Dev Vault (ETERNAL MANUAL)/
"""
import os
import shutil

JULES_SOURCE = "jules_temp/DevVault"
OUR_DEVVAULT = "docs/Dev Vault (ETERNAL MANUAL)"

# Files that need Jules' encoding fixes (the 11 files with mojibake)
FILES_TO_FIX = [
    "GAP_ANALYSIS.md",
    "README.md",
    "BRAIN/00_BRAIN_INDEX.md",
    "BRAIN/05_BRAIN_ACTIVATION_SYSTEM.md",
    "BRAIN/BRAIN_ACTIVATION_SYSTEM.md",
    "BRAIN/CHECKLISTS.md",
    "BRAIN/DECISION_TREES.md",
    "BRAIN/DEPENDENCY_MAPS.md",
    "BRAIN/README.md",
    "KNOWLEDGE/00_MASTER_INDEX.md",
    "KNOWLEDGE/ADAPTATION_GUIDE.md"
]

def main():
    print("=" * 80)
    print("EMERGENCY: APPLYING JULES' FIXES TO OUR REAL DEV VAULT")
    print("=" * 80)
    
    fixed_count = 0
    error_count = 0
    
    for rel_path in FILES_TO_FIX:
        jules_file = os.path.join(JULES_SOURCE, rel_path)
        our_file = os.path.join(OUR_DEVVAULT, rel_path)
        
        if os.path.exists(jules_file):
            try:
                # Create directory if needed
                os.makedirs(os.path.dirname(our_file), exist_ok=True)
                
                # Copy Jules' fixed version to our Dev Vault
                shutil.copy2(jules_file, our_file)
                print(f"[FIXED] {rel_path}")
                fixed_count += 1
            except Exception as e:
                print(f"[ERROR] {rel_path}: {e}")
                error_count += 1
        else:
            print(f"[MISSING] {rel_path} - not in Jules directory")
            error_count += 1
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print("=" * 80)
    print(f"Files fixed: {fixed_count}")
    print(f"Errors: {error_count}")
    
    if fixed_count == 11:
        print("\n[SUCCESS] All 11 files fixed with Jules' clean encoding!")
    else:
        print(f"\n[WARNING] Expected 11 files, only fixed {fixed_count}")

if __name__ == "__main__":
    main()
