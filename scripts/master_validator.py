#!/usr/bin/env python3
"""
MASTER VALIDATOR - Runs ALL validation scripts on all files
"""
import subprocess
import sys
from pathlib import Path

def run_all_validators(target_dir):
    """Run all validator scripts."""
    
    validators = [
        "scripts/validators/corruption_hunter.py",
        "scripts/validators/visual_corruption_detector.py",
        "scripts/validators/line_by_line_validator.py",
        "scripts/validators/advanced_validator.py",
        "scripts/validators/comprehensive_validator.py",
        "scripts/validators/gap_detector.py",
        "scripts/validators/content_depth_analyzer.py",
    ]
    
    print(f"MASTER VALIDATOR - Running ALL Scripts")
    print(f"{'='*80}\n")
    print(f"Target: {target_dir}\n")
    
    results = {}
    
    for validator in validators:
        validator_path = Path(validator)
        if not validator_path.exists():
            print(f"[SKIP] {validator_path.name} - Not found")
            continue
        
        print(f"[RUNNING] {validator_path.name}...")
        
        try:
            result = subprocess.run(
                [sys.executable, str(validator_path), target_dir],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            # Check for issues in output
            output = result.stdout + result.stderr
            
            if "0 issues" in output or "No issues found" in output or "No corruption found" in output:
                print(f"  [OK] PASS - No issues")
                results[validator_path.name] = "PASS"
            elif result.returncode != 0:
                print(f"  [!] ISSUES FOUND")
                results[validator_path.name] = "ISSUES"
            else:
                print(f"  [OK] PASS")
                results[validator_path.name] = "PASS"
                
        except Exception as e:
            print(f"  [ERROR] {e}")
            results[validator_path.name] = "ERROR"
    
    print(f"\n{'='*80}")
    print(f"SUMMARY:")
    print(f"{'='*80}\n")
    
    pass_count = sum(1 for v in results.values() if v == "PASS")
    issue_count = sum(1 for v in results.values() if v == "ISSUES")
    error_count = sum(1 for v in results.values() if v == "ERROR")
    
    print(f"Total validators run: {len(results)}")
    print(f"Passed: {pass_count}")
    print(f"Issues found: {issue_count}")
    print(f"Errors: {error_count}")
    
    if issue_count == 0 and error_count == 0:
        print(f"\n[SUCCESS] ALL VALIDATORS PASSED!")
        return 0
    else:
        print(f"\n[WARNING] Some validators found issues")
        return 1

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python master_validator.py <directory>")
        sys.exit(1)
    
    exit_code = run_all_validators(sys.argv[1])
    sys.exit(exit_code)
