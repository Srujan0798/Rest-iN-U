"""
SMART DEV VAULT TESTING
Runs each script properly on the entire Dev Vault directory
Tests each script individually and reports results
"""
import os
import subprocess
import time

DEV_VAULT = "Doxs/Dev Vault (ETERNAL MANUAL)"

# All verification scripts
VERIFICATION_SCRIPTS = [
    ("Sentinel - Master Verification", "scriptsDx/sentinel/verify_all.py", [DEV_VAULT]),
    ("Sentinel - Format Check", "scriptsDx/sentinel/sentinel_format.py", [DEV_VAULT]),
    ("Sentinel - Structure Check", "scriptsDx/sentinel/sentinel_structure.py", [DEV_VAULT]),
    ("Sentinel - Integrity Check", "scriptsDx/sentinel/sentinel_integrity.py", [DEV_VAULT]),
    ("Corruption Detection", "scriptsDx/corruption_detection/check_dev_vault_corruption.py", []),
]

def run_script(name, script_path, args):
    """Run a single verification script"""
    print(f"\n{'=' * 80}")
    print(f"RUNNING: {name}")
    print(f"Script: {script_path}")
    print(f"{'=' * 80}")
    
    if not os.path.exists(script_path):
        print(f"[SKIP] Script not found")
        return {'status': 'SKIP', 'time': 0, 'output': 'Script not found'}
    
    cmd = ["python", script_path] + args
    start_time = time.time()
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        elapsed = time.time() - start_time
        
        print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        
        status = 'PASS' if result.returncode == 0 else 'FAIL'
        print(f"\n[{status}] Completed in {elapsed:.2f}s")
        
        return {
            'status': status,
            'time': elapsed,
            'output': result.stdout,
            'stderr': result.stderr
        }
    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] Script exceeded 30 seconds")
        return {'status': 'TIMEOUT', 'time': 30, 'output': 'Timeout'}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'status': 'ERROR', 'time': 0, 'output': str(e)}

def main():
    print("=" * 80)
    print("COMPREHENSIVE DEV VAULT VERIFICATION")
    print("=" * 80)
    print(f"Target: {DEV_VAULT}")
    print(f"Scripts to run: {len(VERIFICATION_SCRIPTS)}")
    print("=" * 80)
    
    results = []
    total_start = time.time()
    
    # Run each script
    for name, script_path, args in VERIFICATION_SCRIPTS:
        result = run_script(name, script_path, args)
        results.append({
            'name': name,
            'script': script_path,
            'status': result['status'],
            'time': result['time']
        })
    
    total_elapsed = time.time() - total_start
    
    # Summary
    print("\n" + "=" * 80)
    print("VERIFICATION SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    skipped = sum(1 for r in results if r['status'] == 'SKIP')
    errors = sum(1 for r in results if r['status'] == 'ERROR')
    timeout = sum(1 for r in results if r['status'] == 'TIMEOUT')
    
    print(f"\nTotal Scripts: {len(results)}")
    print(f"Total Time: {total_elapsed:.2f} seconds")
    print(f"\nResults:")
    print(f"  [PASS] PASSED: {passed}")
    print(f"  [FAIL] FAILED: {failed}")
    print(f"  [SKIP] SKIPPED: {skipped}")
    print(f"  [ERR] ERRORS: {errors}")
    print(f"  [TIME] TIMEOUT: {timeout}")
    
    print(f"\nDetailed Results:")
    for r in results:
        print(f"  [{r['status']}] {r['name']} - {r['time']:.2f}s")
    
    print("\n" + "=" * 80)
    if failed == 0 and errors == 0 and timeout == 0:
        print("[SUCCESS] ALL VERIFICATIONS PASSED - DEV VAULT IS PERFECT!")
    else:
        print(f"[WARNING] ISSUES FOUND - {failed + errors + timeout} scripts reported problems")
    print("=" * 80)

if __name__ == "__main__":
    main()
