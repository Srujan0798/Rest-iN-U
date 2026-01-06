import os
import sys
import subprocess
import time

def run_sentinel(script_name, target_dir, fix=False):
    print(f"\n>>> RUNNING {script_name}...")
    cmd = ["python", script_name, target_dir]
    if fix:
        cmd.append("--fix")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(f"STDERR: {result.stderr}")
        return result.returncode
    except Exception as e:
        print(f"Failed to run {script_name}: {e}")
        return 1

def master_verify(target_dir, fix=False):
    print("=" * 60)
    print(f"THE LOCK: MASTER VERIFICATION PROTOCOL")
    print(f"Target: {target_dir}")
    print(f"Mode: {'FIX & LOCK' if fix else 'VERIFY ONLY'}")
    print("=" * 60)
    
    start_time = time.time()
    fix_mode = "--fix" in sys.argv
    target_dir = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else r"c:\Users\Student\Documents\Rest-iN-U\docs"
    master_verify(target_dir, fix_mode)
