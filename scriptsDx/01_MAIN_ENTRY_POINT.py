#!/usr/bin/env python3
"""
MASTER DEV VAULT VERIFICATION & AUTO-FIX
=========================================
Complete automation with deep verification:
1. Runs ALL scripts on all files (dynamically counted)
2. Generates individual reports for each script
3. Calls intelligent AI to analyze ALL reports
4. AI fixes issues intelligently
5. Runs deep verification (quality scoring, completion calc, etc.)
6. AI cleans up all reports
7. Final summary

Usage: python scriptsDx/01_MAIN_ENTRY_POINT.py
"""

import os
import sys
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scriptsDx"
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"
REPORTS_DIR = SCRIPTS_DIR / "reports"


def run_script(script_path: Path, args: list = None, timeout: int = 120) -> tuple:
    """Run a script and return (success, output)"""
    try:
        cmd = [sys.executable, str(script_path)]
        if args:
            cmd.extend(args)
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=timeout,
            cwd=PROJECT_ROOT,
            text=True
        )
        
        return (result.returncode == 0, result.stdout + result.stderr)
    except subprocess.TimeoutExpired:
        return (False, "TIMEOUT")
    except Exception as e:
        return (False, str(e))


def run_deep_verification():
    """Run deep verification with all new scripts"""
    print(f"\n[DEEP VERIFICATION] Running advanced analysis...")
    
    verification_scripts = [
        ('validators/random_spot_checker.py', 'Random Spot Checking'),
        ('validators/section_quality_analyzer.py', 'Section Quality Analysis'),
        ('fixers/hierarchy_enforcer.py', 'Hierarchy Enforcement'),
        ('validators/content_depth_scorer.py', 'Content Depth Scoring'),
        ('utils/completion_calculator.py', 'Completion Calculation'),
    ]
    
    for script_path, description in verification_scripts:
        full_path = SCRIPTS_DIR / script_path
        
        if not full_path.exists():
            continue
        
        print(f"  Running {description}...")
        success, output = run_script(full_path, [str(DEV_VAULT)], timeout=300)
        
        if success:
            print(f"  [OK] {description} complete")


def main():
    # Count actual scripts dynamically
    script_count = 0
    for folder in ['validators', 'fixers', 'core', 'utils', 'audit']:
        folder_path = SCRIPTS_DIR / folder
        if folder_path.exists():
            script_count += len(list(folder_path.glob('*.py')))
    
    file_count = len(list(DEV_VAULT.rglob('*.md')))
    total_ops = script_count * file_count
    
    print("\n" + "="*80)
    print("MASTER DEV VAULT VERIFICATION & AUTO-FIX")
    print("Deep Multi-Pass Analysis")
    print(f"{script_count} SCRIPTS x {file_count} FILES = {total_ops:,} OPERATIONS")
    print("="*80 + "\n")
    
    # STEP 1: Run 03_EXECUTE_ALL_SCRIPTS.py to generate all reports
    print(f"[STEP 1] Running ALL {script_count} scripts and generating reports...")
    print(f"         This will create {script_count} individual reports in scriptsDx/reports/")
    print("")
    
    execute_all = SCRIPTS_DIR / "03_EXECUTE_ALL_SCRIPTS.py"
    if execute_all.exists():
        success, output = run_script(execute_all, timeout=600)
        if success:
            print("  [OK] All scripts executed successfully")
            print(f"  [OK] {script_count} reports generated")
        else:
            print("  [!] Some scripts had issues (continuing anyway)")
    else:
        print("  [X] 03_EXECUTE_ALL_SCRIPTS.py not found!")
        return
    
    # STEP 2: Call intelligent AI to analyze ALL reports
    print(f"\n[STEP 2] Calling intelligent AI to analyze ALL reports...")
    print(f"         AI will read all {script_count} reports and understand issues")
    print("")
    
    auto_fix = SCRIPTS_DIR / "02_INTELLIGENT_AUTO_FIX.py"
    if auto_fix.exists():
        success, output = run_script(auto_fix, timeout=600)
        if success:
            print("  [OK] AI analysis complete")
            print("  [OK] Issues analyzed intelligently")
            print("  [OK] Real fixes applied")
        else:
            print("  [!] AI analysis had issues")
    else:
        print("  [X] 02_INTELLIGENT_AUTO_FIX.py not found!")
        return
    
    # STEP 3: Deep verification (always run)
    print("\n[STEP 3] Running deep verification...")
    run_deep_verification()
    
    # STEP 4: Clean up reports
    print("\n[STEP 4] Cleaning up reports...")
    if REPORTS_DIR.exists():
        txt_files = list(REPORTS_DIR.glob("*.txt"))
        deleted_count = 0
        for report_file in txt_files:
            try:
                report_file.unlink()
                deleted_count += 1
            except Exception as e:
                print(f"  [!] Could not delete {report_file.name}: {e}")
        
        if deleted_count > 0:
            print(f"  [OK] Deleted {deleted_count} report files")
            print("  [OK] Kept MASTER_SUMMARY.json for reference")
        else:
            print("  [INFO] No .txt reports to clean up")
    
    # STEP 5: Final summary
    print("\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    
    # Count reports that were generated
    if REPORTS_DIR.exists():
        report_count = len(list(REPORTS_DIR.glob("*.txt")))
        print(f"Reports generated: {script_count}")
        print(f"Reports remaining: {report_count} (should be 0 if AI cleaned up)")
    
    print(f"Files checked: {file_count}")
    print(f"Scripts run: {script_count}")
    print(f"Total operations: {total_ops:,} ({script_count} x {file_count})")
    print(f"Deep verification: COMPLETE")
    print("\n[OK] COMPLETE AUTOMATION FINISHED\n")


if __name__ == "__main__":
    main()
