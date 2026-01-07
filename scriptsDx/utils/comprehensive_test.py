"""
COMPREHENSIVE DEV VAULT TESTING
Runs ALL verification scripts on ALL Dev Vault files
N x M iterations: All scripts x All files
"""
import os
import subprocess
import time

DEV_VAULT = "Doxs/Dev Vault (ETERNAL MANUAL)"

# All verification scripts
SCRIPTS = [
    "scripts/sentinel/verify_all.py",
    "scripts/sentinel/sentinel_format.py",
    "scripts/sentinel/sentinel_structure.py",
    "scripts/sentinel/sentinel_integrity.py",
    "scripts/corruption_detection/check_dev_vault_corruption.py",
    "scripts/compare_brain_files.py"
]

def run_script(script_path, target_dir=None):
    """Run a single script"""
    script_name = os.path.basename(script_path)
    print(f"\n{'=' * 80}")
    print(f"RUNNING: {script_name}")
    print(f"{'=' * 80}")
    
    cmd = ["python", script_path]
    if target_dir and "verify_all" in script_path or "sentinel" in script_path:
        cmd.append(target_dir)
    
    start_time = time.time()
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        
        elapsed = time.time() - start_time
        status = "PASS" if result.returncode == 0 else "FAIL"
        print(f"\nStatus: {status} | Time: {elapsed:.2f}s")
        return status, elapsed
    except subprocess.TimeoutExpired:
        print("TIMEOUT: Script took too long")
        return "TIMEOUT", 60
    except Exception as e:
        print(f"ERROR: {e}")
        return "ERROR", 0

def count_files(directory):
    """Count markdown files"""
    count = 0
    for root, dirs, files in os.walk(directory):
        count += sum(1 for f in files if f.endswith('.md'))
    return count

def main():
    print("=" * 80)
    print("COMPREHENSIVE DEV VAULT TESTING")
    print("=" * 80)
    print(f"Target: {DEV_VAULT}")
    print(f"Scripts to run: {len(SCRIPTS)}")
    
    # Count files
    file_count = count_files(DEV_VAULT)
    print(f"Files to verify: {file_count}")
    print(f"Total iterations: {len(SCRIPTS)} scripts x {file_count} files")
    print("=" * 80)
    
    results = []
    total_start = time.time()
    
    # Run each script
    for script in SCRIPTS:
        if os.path.exists(script):
            status, elapsed = run_script(script, DEV_VAULT)
            results.append({
                'script': os.path.basename(script),
                'status': status,
                'time': elapsed
            })
        else:
            print(f"\n[SKIP] {script} - not found")
            results.append({
                'script': os.path.basename(script),
                'status': 'SKIP',
                'time': 0
            })
    
    total_elapsed = time.time() - total_start
    
    # Summary
    print("\n" + "=" * 80)
    print("COMPREHENSIVE TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for r in results if r['status'] == 'PASS')
    failed = sum(1 for r in results if r['status'] == 'FAIL')
    skipped = sum(1 for r in results if r['status'] == 'SKIP')
    errors = sum(1 for r in results if r['status'] == 'ERROR')
    
    print(f"\nScripts Run: {len(SCRIPTS)}")
    print(f"Files Verified: {file_count}")
    print(f"Total Time: {total_elapsed:.2f} seconds")
    print(f"\nResults:")
    print(f"  PASSED: {passed}")
    print(f"  FAILED: {failed}")
    print(f"  SKIPPED: {skipped}")
    print(f"  ERRORS: {errors}")
    
    print(f"\nDetailed Results:")
    for r in results:
        print(f"  [{r['status']}] {r['script']} - {r['time']:.2f}s")
    
    print("\n" + "=" * 80)
    if failed == 0 and errors == 0:
        print("ALL TESTS PASSED - DEV VAULT IS PERFECT!")
    else:
        print(f"ISSUES FOUND - {failed + errors} scripts reported problems")
    print("=" * 80)

if __name__ == "__main__":
    main()
