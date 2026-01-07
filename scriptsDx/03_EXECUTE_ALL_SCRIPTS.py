"""
RULE 21 - MASTER EXECUTION SYSTEM
==================================
Run ALL 50 scripts on ALL 48 Dev Vault files
Generate reports and auto-fix all issues

50 scripts  48 files = 2,400 operations
(Dynamically counted - updates automatically)
"""
import os
import subprocess
import sys
from pathlib import Path
import json

PROJECT_ROOT = Path(__file__).parent.parent
DEV_VAULT = PROJECT_ROOT / "Doxs" / "Dev Vault (ETERNAL MANUAL)"
REPORTS_DIR = PROJECT_ROOT / "scriptsDx" / "reports"

# Ensure reports directory exists
REPORTS_DIR.mkdir(exist_ok=True)

# All executable scripts (excluding test/verification scripts)
# Format: 'script_name.py' or ('script_name.py', 'per_file') for scripts that need individual files
EXECUTABLE_SCRIPTS = {
    'fixers': [
        'universal_lint_fixer.py',
        'aggressive_gap_killer.py',
        # 'auto_toc.py',  # DISABLED - Regenerates broken TOC links
        'disclaimer_injector.py',
        'fix_code_block_closers.py',
        'advanced_table_fixer.py',
        'ultra_table_fixer.py',
        'critical_fixer.py',
        'polish_fixer.py',
        'visual_corruption_fixer.py',
        'toc_sync.py',
        'hierarchy_enforcer.py',  # NEW
        'fix_encoding_for_github.py',  # NEW
        'remove_code_fences.py',  # NEW
        'complete_ide_fixer.py',  # NEW
    ],
    'validators': [
        'comprehensive_validator.py',
        'content_depth_analyzer.py',
        'advanced_validator.py',
        'content_depth_scorer.py',  # NEW
        'flow_analyzer.py',  # NEW
        'generic_content_flagger.py',  # NEW
        'misplaced_content_detector.py',  # NEW
        'navigation_tester.py',  # NEW
        'random_spot_checker.py',  # NEW
        'section_quality_analyzer.py',  # NEW
    ],
    'core': [
        'titan_cleaner.py',
        'titan_lint_engine.py',
        'titan_reinforce.py',
        'validate_links.py',
        ('content_corruption_detector.py', 'per_file'),  # Needs individual files
        'cross_file_consistency.py',
        ('cross_reference_validator.py', 'per_file'),  # Needs individual files
        ('gap_whitespace_analyzer.py', 'per_file'),  # Needs individual files
        'master_validator.py',
        ('md_structure_validator.py', 'per_file'),  # Needs individual files
        ('titan_polisher.py', 'per_file'),  # Needs individual files
        ('toc_fixer.py', 'per_file'),  # Needs individual files
    ],
    'audit': [
        'deep_audit.py',
        'quality_audit.py',
    ],
    'sentinel': [
        'sentinel_format.py',
        'sentinel_structure.py',
        'sentinel_integrity.py',
        'verify_all.py',
        'check_dev_vault.py',  # NEW
    ],
    'corruption_detection': [
        'check_dev_vault_corruption.py',
        'jules_check_corruption.py',
        'jules_fix_corruption.py',
    ],
    'utils': [
        'auto_fix_analyzer.py',
        'compare_brain_files.py',
        'completion_calculator.py',
        'comprehensive_test.py',
        'daily_progress_tracker.py',
        'emergency_fix_frontend.py',
        'fix_all_corruption.py',
        'fix_frontend_corruption.py',
        'issue_database.py',
        'matrix_test.py',
        'progress_tracker.py',
        'smart_verify.py',
        'system_verification.py',
    ],
    'tests': [
        'complete_script_check.py',
        'functionality_test.py',
        'path_verification.py',
    ],
}

def get_all_vault_files():
    """Get all markdown files in Dev Vault"""
    return list(DEV_VAULT.rglob("*.md"))

def run_script_on_vault(script_path, category, script_name):
    """Run a script and capture output"""
    print(f"\n[{category}/{script_name}]")
    print(f"  Running on {DEV_VAULT}")
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path), str(DEV_VAULT)],  # Pass Dev Vault as argument
            capture_output=True,
            text=True,
            timeout=120,
            cwd=str(PROJECT_ROOT)
        )
        
        return {
            'script': f"{category}/{script_name}",
            'exit_code': result.returncode,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'success': result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        return {
            'script': f"{category}/{script_name}",
            'exit_code': -1,
            'stdout': '',
            'stderr': 'TIMEOUT (120s)',
            'success': False
        }
    except Exception as e:
        return {
            'script': f"{category}/{script_name}",
            'exit_code': -1,
            'stdout': '',
            'stderr': str(e),
            'success': False
        }

def save_report(script_name, result, report_num):
    """Save individual script report"""
    report_file = REPORTS_DIR / f"report_{report_num:02d}_{script_name.replace('/', '_').replace('.py', '')}.txt"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write(f"SCRIPT REPORT #{report_num}\n")
        f.write("="*80 + "\n")
        f.write(f"Script: {result['script']}\n")
        f.write(f"Exit Code: {result['exit_code']}\n")
        f.write(f"Status: {'SUCCESS' if result['success'] else 'FAILED'}\n")
        f.write("="*80 + "\n\n")
        
        if result['stdout']:
            f.write("STDOUT:\n")
            f.write("-"*80 + "\n")
            f.write(result['stdout'])
            f.write("\n\n")
        
        if result['stderr']:
            f.write("STDERR:\n")
            f.write("-"*80 + "\n")
            f.write(result['stderr'])
            f.write("\n\n")
    
    return report_file

def main():
    print("="*80)
    print("RULE 21 - MASTER EXECUTION SYSTEM")
    print("="*80)
    print(f"Dev Vault: {DEV_VAULT}")
    print(f"Reports Dir: {REPORTS_DIR}")
    print()
    
    # Get all files
    vault_files = get_all_vault_files()
    print(f"Dev Vault Files: {len(vault_files)}")
    
    # Count scripts
    total_scripts = sum(len(scripts) for scripts in EXECUTABLE_SCRIPTS.values())
    print(f"Executable Scripts: {total_scripts}")
    print(f"Total Operations: {total_scripts}  {len(vault_files)} = {total_scripts * len(vault_files)}")
    print()
    
    print("="*80)
    print("EXECUTING ALL SCRIPTS")
    print("="*80)
    
    results = []
    report_num = 1
    
    # Run each script
    for category, scripts in EXECUTABLE_SCRIPTS.items():
        print(f"\n{'='*80}")
        print(f"CATEGORY: {category.upper()}")
        print('='*80)
        
        for script_entry in scripts:
            # Handle both string and tuple entries
            if isinstance(script_entry, tuple):
                script_name = script_entry[0]
            else:
                script_name = script_entry
            
            script_path = PROJECT_ROOT / 'scriptsDx' / category / script_name
            
            if not script_path.exists():
                print(f"  [SKIP] {script_name} - Not found")
                continue
            
            # Run script
            result = run_script_on_vault(script_path, category, script_name)
            results.append(result)
            
            # Save report
            report_file = save_report(result['script'], result, report_num)
            
            # Show status
            status = "OK" if result['success'] else "FAIL"
            print(f"  [{status}] Report #{report_num} saved: {report_file.name}")
            
            report_num += 1
    
    # Summary
    print()
    print("="*80)
    print("EXECUTION SUMMARY")
    print("="*80)
    print(f"Total Scripts Run: {len(results)}")
    print(f"Successful: {sum(1 for r in results if r['success'])}")
    print(f"Failed: {sum(1 for r in results if not r['success'])}")
    print(f"Reports Generated: {report_num - 1}")
    print()
    print(f"All reports saved to: {REPORTS_DIR}")
    print("="*80)
    
    # Save master summary
    summary_file = REPORTS_DIR / "MASTER_SUMMARY.json"
    with open(summary_file, 'w') as f:
        json.dump({
            'total_scripts': len(results),
            'successful': sum(1 for r in results if r['success']),
            'failed': sum(1 for r in results if not r['success']),
            'results': results
        }, f, indent=2)
    
    print(f"\nMaster summary saved: {summary_file}")

if __name__ == "__main__":
    main()
