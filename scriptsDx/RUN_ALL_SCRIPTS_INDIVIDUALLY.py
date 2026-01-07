#!/usr/bin/env python3
"""
RUN ALL SCRIPTS INDIVIDUALLY
=============================
Runs every single script in scriptsDx on all 48 Dev Vault files
Shows progress for each script execution
"""

import subprocess
import sys
from pathlib import Path
import time

PROJECT_ROOT = Path(__file__).parent.parent
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"
SCRIPTS_DIR = PROJECT_ROOT / "scriptsDx"

# All scripts organized by folder
ALL_SCRIPTS = {
    'fixers': [
        'universal_lint_fixer.py',
        'aggressive_gap_killer.py',
        'auto_toc.py',
        'disclaimer_injector.py',
        'fix_code_block_closers.py',
        'advanced_table_fixer.py',
        'ultra_table_fixer.py',
        'critical_fixer.py',
        'polish_fixer.py',
        'visual_corruption_fixer.py',
        'toc_sync.py',
        'hierarchy_enforcer.py',
        'fix_encoding_for_github.py',
        'remove_code_fences.py',
    ],
    'validators': [
        'comprehensive_validator.py',
        'content_depth_analyzer.py',
        'advanced_validator.py',
        'content_depth_scorer.py',
        'flow_analyzer.py',
        'generic_content_flagger.py',
        'misplaced_content_detector.py',
        'navigation_tester.py',
        'random_spot_checker.py',
        'section_quality_analyzer.py',
    ],
    'core': [
        'titan_cleaner.py',
        'titan_lint_engine.py',
        'titan_reinforce.py',
        'validate_links.py',
        'content_corruption_detector.py',
        'cross_file_consistency.py',
        'cross_reference_validator.py',
        'gap_whitespace_analyzer.py',
        'master_validator.py',
        'md_structure_validator.py',
        'titan_polisher.py',
        'toc_fixer.py',
    ],
    'audit': [
        'deep_audit.py',
        'quality_audit.py',
    ],
    'utils': [
        'auto_fix_analyzer.py',
        'compare_brain_files.py',
        'completion_calculator.py',
        'comprehensive_test.py',
        'issue_database.py',
        'matrix_test.py',
        'progress_tracker.py',
        'smart_verify.py',
        'system_verification.py',
    ],
}

def run_script(folder, script_name, script_num, total_scripts):
    """Run a single script and show progress"""
    script_path = SCRIPTS_DIR / folder / script_name
    
    if not script_path.exists():
        print(f"[{script_num}/{total_scripts}] SKIP: {folder}/{script_name} (not found)")
        return False
    
    print(f"\n{'='*80}")
    print(f"[{script_num}/{total_scripts}] Running: {folder}/{script_name}")
    print(f"{'='*80}")
    
    start_time = time.time()
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path), str(DEV_VAULT)],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=PROJECT_ROOT
        )
        
        elapsed = time.time() - start_time
        
        if result.returncode == 0:
            print(f"[OK] SUCCESS ({elapsed:.1f}s)")
            # Show last 10 lines of output
            output_lines = result.stdout.strip().split('\n')
            if len(output_lines) > 10:
                print("\nLast 10 lines of output:")
                for line in output_lines[-10:]:
                    print(f"  {line}")
            else:
                print(result.stdout)
            return True
        else:
            print(f"[FAIL] FAILED ({elapsed:.1f}s)")
            print(f"Error: {result.stderr[:500]}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] TIMEOUT (>300s)")
        return False
    except Exception as e:
        print(f"[ERROR] ERROR: {e}")
        return False

def main():
    print("\n" + "="*80)
    print("RUNNING ALL SCRIPTS INDIVIDUALLY")
    print("="*80)
    
    # Count total scripts
    total_scripts = sum(len(scripts) for scripts in ALL_SCRIPTS.values())
    
    print(f"\nTotal scripts to run: {total_scripts}")
    print(f"Dev Vault location: {DEV_VAULT}")
    print(f"Total operations: {total_scripts} scripts  48 files = {total_scripts * 48} operations")
    print("\n" + "="*80 + "\n")
    
    script_num = 0
    success_count = 0
    fail_count = 0
    
    for folder, scripts in ALL_SCRIPTS.items():
        print(f"\n{'#'*80}")
        print(f"# FOLDER: {folder.upper()} ({len(scripts)} scripts)")
        print(f"{'#'*80}")
        
        for script_name in scripts:
            script_num += 1
            success = run_script(folder, script_name, script_num, total_scripts)
            
            if success:
                success_count += 1
            else:
                fail_count += 1
    
    # Final summary
    print("\n\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    print(f"Total scripts run: {script_num}")
    print(f"[OK] Successful: {success_count}")
    print(f"[FAIL] Failed: {fail_count}")
    print(f"Success rate: {(success_count/script_num*100):.1f}%")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
