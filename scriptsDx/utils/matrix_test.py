"""
ULTIMATE DEV VAULT TESTING - TRUE N x M MATRIX
Runs EVERY script against EVERY Dev Vault file individually
Complete matrix: All scripts  All files
"""
import os
import subprocess
import time

SCRIPTS_DIR = "scripts"
DEV_VAULT = "Doxs/Dev Vault (ETERNAL MANUAL)"

def find_all_scripts(scripts_dir):
    """Find all Python scripts recursively"""
    scripts = []
    for root, dirs, files in os.walk(scripts_dir):
        for file in files:
            if file.endswith('.py'):
                scripts.append(os.path.join(root, file))
    return sorted(scripts)

def find_all_md_files(vault_dir):
    """Find all markdown files recursively"""
    md_files = []
    for root, dirs, files in os.walk(vault_dir):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return sorted(md_files)

def run_script_on_file(script_path, file_path):
    """Run a single script on a single file"""
    cmd = ["python", script_path, file_path]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        return {
            'status': 'PASS' if result.returncode == 0 else 'FAIL',
            'stdout': result.stdout[:200],  # First 200 chars
            'stderr': result.stderr[:200] if result.stderr else None
        }
    except subprocess.TimeoutExpired:
        return {'status': 'TIMEOUT', 'stdout': None, 'stderr': 'Timeout'}
    except Exception as e:
        return {'status': 'ERROR', 'stdout': None, 'stderr': str(e)[:200]}

def main():
    print("=" * 100)
    print("ULTIMATE DEV VAULT TESTING - TRUE N x M MATRIX")
    print("=" * 100)
    
    # Find all scripts and files
    all_scripts = find_all_scripts(SCRIPTS_DIR)
    all_files = find_all_md_files(DEV_VAULT)
    
    print(f"\nScripts found: {len(all_scripts)}")
    print(f"Dev Vault files: {len(all_files)}")
    print(f"Total iterations: {len(all_scripts)}  {len(all_files)} = {len(all_scripts) * len(all_files)}")
    print("\n" + "=" * 100)
    
    # Matrix results
    matrix_results = []
    total_start = time.time()
    
    iteration = 0
    total_iterations = len(all_scripts) * len(all_files)
    
    # Run each script against each file
    for script in all_scripts:
        script_name = os.path.relpath(script, SCRIPTS_DIR)
        
        for md_file in all_files:
            iteration += 1
            file_name = os.path.relpath(md_file, DEV_VAULT)
            
            # Progress indicator
            if iteration % 50 == 0 or iteration == 1:
                print(f"\nProgress: {iteration}/{total_iterations} ({iteration*100//total_iterations}%)")
                print(f"Testing: {script_name}  {file_name}")
            
            result = run_script_on_file(script, md_file)
            matrix_results.append({
                'script': script_name,
                'file': file_name,
                'status': result['status']
            })
    
    total_elapsed = time.time() - total_start
    
    # Analyze results
    print("\n" + "=" * 100)
    print("MATRIX TEST RESULTS")
    print("=" * 100)
    
    passed = sum(1 for r in matrix_results if r['status'] == 'PASS')
    failed = sum(1 for r in matrix_results if r['status'] == 'FAIL')
    timeout = sum(1 for r in matrix_results if r['status'] == 'TIMEOUT')
    errors = sum(1 for r in matrix_results if r['status'] == 'ERROR')
    
    print(f"\nTotal Iterations: {len(matrix_results)}")
    print(f"Scripts Tested: {len(all_scripts)}")
    print(f"Files Tested: {len(all_files)}")
    print(f"Total Time: {total_elapsed:.2f} seconds")
    print(f"Average Time per Test: {total_elapsed/len(matrix_results):.3f} seconds")
    
    print(f"\nResults Breakdown:")
    print(f"  [OK] PASSED: {passed} ({passed*100//len(matrix_results)}%)")
    print(f"  [FAIL] FAILED: {failed} ({failed*100//len(matrix_results) if len(matrix_results) > 0 else 0}%)")
    print(f"    TIMEOUT: {timeout}")
    print(f"  [WARN]  ERRORS: {errors}")
    
    # Show failures if any
    if failed > 0:
        print(f"\nFailed Tests (first 10):")
        failures = [r for r in matrix_results if r['status'] == 'FAIL'][:10]
        for f in failures:
            print(f"  - {f['script']}  {f['file']}")
    
    # Summary by script
    print(f"\nResults by Script:")
    for script in all_scripts:
        script_name = os.path.relpath(script, SCRIPTS_DIR)
        script_results = [r for r in matrix_results if r['script'] == script_name]
        script_passed = sum(1 for r in script_results if r['status'] == 'PASS')
        print(f"  {script_name}: {script_passed}/{len(script_results)} passed")
    
    print("\n" + "=" * 100)
    if failed == 0 and errors == 0 and timeout == 0:
        print(" ALL MATRIX TESTS PASSED - PERFECT SCORE!")
    else:
        print(f"[WARN]  ISSUES FOUND - {failed + errors + timeout} tests had problems")
    print("=" * 100)
    
    # Save detailed results
    with open('matrix_test_results.txt', 'w') as f:
        f.write(f"Matrix Test Results\n")
        f.write(f"Total: {len(matrix_results)} tests\n")
        f.write(f"Passed: {passed}\n")
        f.write(f"Failed: {failed}\n\n")
        for r in matrix_results:
            f.write(f"{r['status']}: {r['script']}  {r['file']}\n")
    
    print(f"\nDetailed results saved to: matrix_test_results.txt")

if __name__ == "__main__":
    main()
