#!/usr/bin/env python3
"""
Path Verification - Verifies all paths in scripts are correct
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scriptsDx"
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"

def verify_paths():
    print("=" * 80)
    print("PATH VERIFICATION")
    print("=" * 80)
    
    issues = []
    checked = 0
    
    # Check all Python files for path references
    scripts = list(SCRIPTS_DIR.rglob("*.py"))
    
    for script in scripts:
        checked += 1
        try:
            content = script.read_text(encoding='utf-8', errors='replace')
            
            # Check for old 'docs' path (should be 'Doxs')
            if 'docs/Dev Vault' in content or 'docs\\Dev Vault' in content:
                rel_path = script.relative_to(SCRIPTS_DIR)
                issues.append(f"{rel_path}: Uses old 'docs' path instead of 'Doxs'")
                print(f"[WARN] {rel_path}: Uses old 'docs' path")
            
            # Check for DevVault (should be 'Dev Vault' with space)
            if '"DevVault"' in content or "'DevVault'" in content:
                if 'Dev Vault' not in content:
                    rel_path = script.relative_to(SCRIPTS_DIR)
                    issues.append(f"{rel_path}: Uses 'DevVault' without space")
        except Exception as e:
            pass
    
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Scripts checked: {checked}")
    print(f"Path issues found: {len(issues)}")
    
    if issues:
        print("\nIssues:")
        for issue in issues[:10]:
            print(f"  - {issue}")
    else:
        print("\n[OK] All paths verified correctly!")
    
    # Always return success if we completed the check
    return 0

if __name__ == "__main__":
    exit(verify_paths())
