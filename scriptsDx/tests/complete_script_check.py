#!/usr/bin/env python3
"""
Complete Script Check - Verifies all scripts exist and have valid syntax
"""
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent  # Go to Rest-iN-U
SCRIPTS_DIR = PROJECT_ROOT / "scriptsDx"

def check_all_scripts():
    print("=" * 80)
    print("COMPLETE SCRIPT CHECK")
    print("=" * 80)
    
    results = {'total': 0, 'exists': 0, 'syntax_ok': 0, 'issues': []}
    
    # Find all Python scripts
    scripts = list(SCRIPTS_DIR.rglob("*.py"))
    
    print(f"Found {len(scripts)} Python scripts in {SCRIPTS_DIR}")
    print()
    
    for script in scripts:
        results['total'] += 1
        rel_path = script.relative_to(SCRIPTS_DIR)
        
        # Check exists
        if script.exists():
            results['exists'] += 1
            
            # Check syntax
            try:
                with open(script, 'r', encoding='utf-8') as f:
                    compile(f.read(), str(script), 'exec')
                results['syntax_ok'] += 1
                print(f"[OK] {rel_path}")
            except SyntaxError as e:
                results['issues'].append(f"{rel_path}: Syntax error - {e}")
                print(f"[FAIL] {rel_path}: Syntax error")
            except Exception as e:
                results['issues'].append(f"{rel_path}: {e}")
                print(f"[WARN] {rel_path}: {e}")
        else:
            results['issues'].append(f"{rel_path}: File not found")
            print(f"[FAIL] {rel_path}: Not found")
    
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total Scripts: {results['total']}")
    print(f"Files Exist: {results['exists']}/{results['total']}")
    print(f"Syntax Valid: {results['syntax_ok']}/{results['total']}")
    
    if results['issues']:
        print(f"\nIssues: {len(results['issues'])}")
        for issue in results['issues'][:5]:
            print(f"  - {issue}")
    else:
        print("\n[OK] All scripts passed!")
    
    return 0 if not results['issues'] else 1

if __name__ == "__main__":
    exit(check_all_scripts())
