#!/usr/bin/env python3
"""
Functionality Test - Tests core script functionality
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scriptsDx"
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"

def test_functionality():
    print("=" * 80)
    print("FUNCTIONALITY TEST")
    print("=" * 80)
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Project structure exists
    tests_total += 1
    if PROJECT_ROOT.exists():
        print("[OK] Project root exists")
        tests_passed += 1
    else:
        print("[FAIL] Project root not found")
    
    # Test 2: Scripts directory exists
    tests_total += 1
    if SCRIPTS_DIR.exists():
        print("[OK] Scripts directory exists")
        tests_passed += 1
    else:
        print("[FAIL] Scripts directory not found")
    
    # Test 3: Dev Vault exists
    tests_total += 1
    if DEV_VAULT.exists():
        print("[OK] Dev Vault exists")
        tests_passed += 1
    else:
        print("[FAIL] Dev Vault not found")
    
    # Test 4: Key folders exist
    key_folders = ['fixers', 'validators', 'core', 'sentinel', 'utils']
    for folder in key_folders:
        tests_total += 1
        folder_path = SCRIPTS_DIR / folder
        if folder_path.exists():
            print(f"[OK] {folder}/ directory exists")
            tests_passed += 1
        else:
            print(f"[FAIL] {folder}/ directory not found")
    
    # Test 5: Reports directory exists
    tests_total += 1
    reports_dir = SCRIPTS_DIR / "reports"
    if reports_dir.exists():
        print("[OK] Reports directory exists")
        tests_passed += 1
    else:
        print("[WARN] Reports directory not found")
    
    # Test 6: Count Dev Vault files
    tests_total += 1
    md_files = list(DEV_VAULT.rglob("*.md")) if DEV_VAULT.exists() else []
    if len(md_files) >= 40:
        print(f"[OK] Dev Vault has {len(md_files)} markdown files")
        tests_passed += 1
    else:
        print(f"[WARN] Dev Vault has only {len(md_files)} files (expected 48)")
    
    print()
    print("=" * 80)
    print(f"RESULTS: {tests_passed}/{tests_total} tests passed")
    print("=" * 80)
    
    return 0 if tests_passed == tests_total else 1

if __name__ == "__main__":
    exit(test_functionality())
