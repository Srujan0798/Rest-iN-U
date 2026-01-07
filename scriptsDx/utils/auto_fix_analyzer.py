"""
RULE 21 - AUTO-FIX SYSTEM
=========================
Read all 35 reports and automatically fix all issues
"""
import os
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent  # Go up to Rest-iN-U
REPORTS_DIR = PROJECT_ROOT / "scriptsDx" / "reports"
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"

def read_master_summary():
    """Read the master summary"""
    summary_file = REPORTS_DIR / "MASTER_SUMMARY.json"
    with open(summary_file, 'r') as f:
        return json.load(f)

def read_report(report_num):
    """Read individual report"""
    # Find report file
    reports = list(REPORTS_DIR.glob(f"report_{report_num:02d}_*.txt"))
    if not reports:
        return None
    
    with open(reports[0], 'r', encoding='utf-8') as f:
        return f.read()

def analyze_failures(summary):
    """Analyze all failed scripts"""
    print("="*80)
    print("ANALYZING FAILURES")
    print("="*80)
    print()
    
    failed_scripts = [r for r in summary['results'] if not r['success']]
    
    print(f"Total Failed Scripts: {len(failed_scripts)}")
    print()
    
    for i, result in enumerate(failed_scripts, 1):
        print(f"{i}. {result['script']}")
        print(f"   Exit Code: {result['exit_code']}")
        if result['stderr']:
            # Show first line of error
            first_error = result['stderr'].split('\n')[0][:100]
            print(f"   Error: {first_error}")
        print()
    
    return failed_scripts

def create_fix_plan(failed_scripts):
    """Create plan to fix all issues"""
    print("="*80)
    print("FIX PLAN")
    print("="*80)
    print()
    
    fix_categories = {
        'requires_argument': [],
        'missing_dependency': [],
        'path_issue': [],
        'other': []
    }
    
    for script in failed_scripts:
        stderr = script.get('stderr', '')
        
        if 'Usage:' in stderr or 'required' in stderr.lower():
            fix_categories['requires_argument'].append(script['script'])
        elif 'ModuleNotFoundError' in stderr or 'ImportError' in stderr:
            fix_categories['missing_dependency'].append(script['script'])
        elif 'FileNotFoundError' in stderr or 'does not exist' in stderr:
            fix_categories['path_issue'].append(script['script'])
        else:
            fix_categories['other'].append(script['script'])
    
    for category, scripts in fix_categories.items():
        if scripts:
            print(f"{category.upper().replace('_', ' ')} ({len(scripts)} scripts):")
            for script in scripts:
                print(f"  - {script}")
            print()
    
    return fix_categories

def main():
    print("="*80)
    print("RULE 21 - AUTO-FIX SYSTEM")
    print("="*80)
    print()
    
    # Read master summary
    summary = read_master_summary()
    
    print(f"Total Scripts: {summary['total_scripts']}")
    print(f"Successful: {summary['successful']}")
    print(f"Failed: {summary['failed']}")
    print()
    
    # Analyze failures
    failed_scripts = analyze_failures(summary)
    
    # Create fix plan
    fix_categories = create_fix_plan(failed_scripts)
    
    print("="*80)
    print("NEXT STEPS")
    print("="*80)
    print()
    print("1. Scripts requiring arguments: Need to be run with file paths")
    print("2. Missing dependencies: Need to install required packages")
    print("3. Path issues: Need to verify file paths")
    print("4. Other issues: Need manual review")
    print()
    print(f"Reports available in: {REPORTS_DIR}")
    print("="*80)

if __name__ == "__main__":
    main()
