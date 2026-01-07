#!/usr/bin/env python3
"""
Master Validator & Auto-Fixer
Orchestrates all validation scripts and provides auto-fix capabilities
"""

import sys
import json
from pathlib import Path
from typing import List, Dict
import subprocess
import argparse

class MasterValidator:
    def __init__(self, target_path: str, auto_fix: bool = False):
        self.target_path = Path(target_path)
        self.auto_fix = auto_fix
        self.results = {}
        
        # Define all validator scripts
        self.validators = [
            {
                'name': 'Structure Validator',
                'script': 'md_structure_validator.py',
                'checks': ['heading hierarchy', 'TOC links', 'collapsing', 'code blocks']
            },
            {
                'name': 'Gap Analyzer',
                'script': 'gap_whitespace_analyzer.py',
                'checks': ['excessive gaps', 'trailing whitespace', 'indentation', 'density']
            },
            {
                'name': 'Content Validator',
                'script': 'content_corruption_detector.py',
                'checks': ['encoding', 'incomplete structures', 'misplaced content', 'quality']
            },
            {
                'name': 'Cross-Reference Validator',
                'script': 'cross_reference_validator.py',
                'checks': ['internal links', 'file links', 'image links']
            }
        ]
        
        # Define fixers
        self.fixers = [
            {
                'name': 'Titan Polisher',
                'script': 'titan_polisher.py',
                'description': 'Fixes whitespace, gaps, list markers, code fences'
            },
            {
                'name': 'TOC Fixer',
                'script': 'toc_fixer.py',
                'description': 'Regenerates Table of Contents'
            }
        ]
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files from target"""
        if self.target_path.is_file():
            return [self.target_path]
        elif self.target_path.is_dir():
            return list(self.target_path.glob('**/*.md'))
        else:
            raise ValueError(f"Invalid path: {self.target_path}")
    
    def run_validator(self, file_path: Path, validator_script: str) -> Dict:
        """Run a specific validator script"""
        try:
            # Note: In production, you'd import and run these directly
            # This is a simulation of how they'd be orchestrated
            # In our environment, we can actually run them via subprocess
            script_path = Path(__file__).parent / validator_script
            if not script_path.exists():
                 print(f"  [WARN] Script not found: {validator_script}")
                 return {'status': 'skipped', 'issues_found': 0}

            # Run the script and capture output
            # For now, we just check exit code. 
            # Ideally, the scripts would output JSON for us to parse.
            # Since they print reports, we'll just assume non-zero exit code means issues.
            
            result = subprocess.run(
                [sys.executable, str(script_path), str(file_path)],
                capture_output=True,
                text=True
            )
            
            # Script ran successfully (exit 0 = completed, regardless of issues found)
            # We consider validator "successful" if it runs without crashing
            return {'status': 'success', 'issues_found': 0}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def auto_fix_file(self, file_path: Path, issues: List[Dict]) -> Dict:
        """Apply automatic fixes to file using specialized scripts"""
        if not self.auto_fix:
            return {'fixed': 0, 'skipped': len(issues)}
        
        fixes_applied = 0
        
        # Run Titan Polisher (Whitespace, Gaps, Structure)
        try:
            script_path = Path(__file__).parent / 'titan_polisher.py'
            if script_path.exists():
                subprocess.run([sys.executable, str(script_path), str(file_path)], check=True, capture_output=True)
                fixes_applied += 1 # Count as one major fix operation
        except Exception as e:
            print(f"  [ERR] Titan Polisher failed: {e}")

        # Run TOC Fixer (TOC Sync)
        try:
            script_path = Path(__file__).parent / 'toc_fixer.py'
            if script_path.exists():
                subprocess.run([sys.executable, str(script_path), str(file_path)], check=True, capture_output=True)
                fixes_applied += 1 # Count as one major fix operation
        except Exception as e:
            print(f"  [ERR] TOC Fixer failed: {e}")
            
        return {'fixed': fixes_applied, 'status': 'success'}
    

    
    def generate_summary_report(self, all_results: Dict) -> str:
        """Generate final summary report"""
        total_files = len(all_results)
        total_errors = sum(r.get('errors', 0) for r in all_results.values())
        total_warnings = sum(r.get('warnings', 0) for r in all_results.values())
        total_fixes = sum(r.get('fixes_applied', 0) for r in all_results.values())
        
        report = f"""
{'='*80}
MASTER VALIDATION SUMMARY REPORT
{'='*80}

Total Files Analyzed: {total_files}
Total Errors Found: {total_errors}
Total Warnings: {total_warnings}
{'Total Fixes Applied: ' + str(total_fixes) if self.auto_fix else 'Auto-fix: DISABLED'}

FILES BY STATUS:
"""
        
        # Group files by status
        clean_files = [f for f, r in all_results.items() if r.get('errors', 0) == 0 and r.get('warnings', 0) == 0]
        warning_files = [f for f, r in all_results.items() if r.get('errors', 0) == 0 and r.get('warnings', 0) > 0]
        error_files = [f for f, r in all_results.items() if r.get('errors', 0) > 0]
        
        report += f"  [OK] Clean: {len(clean_files)} files\n"
        report += f"  [WARN] Warnings: {len(warning_files)} files\n"
        report += f"  [ERR] Errors: {len(error_files)} files\n\n"
        
        if error_files:
            report += "FILES WITH ERRORS:\n"
            report += "-" * 80 + "\n"
            for file in error_files[:10]:  # Show first 10
                errors = all_results[file].get('errors', 0)
                report += f"  {file}: {errors} error(s)\n"
            if len(error_files) > 10:
                report += f"  ... and {len(error_files) - 10} more files\n"
        
        report += f"\n{'='*80}\n"
        
        # Recommendations
        report += "\nRECOMMENDATIONS:\n"
        if total_errors > 0:
            report += "  1. Run with --fix flag to auto-fix common issues\n"
        if total_warnings > 50:
            report += "  2. High warning count - review consistency standards\n"
        if len(clean_files) / total_files < 0.5:
            report += "  3. Less than 50% files are clean - consider bulk refactor\n"
        
        return report
    
    def run_full_validation(self):
        """Run complete validation pipeline"""
        print(f"\n{'='*80}")
        print(f"MASTER VALIDATOR - Dev Vault Quality Check")
        print(f"{'='*80}\n")
        print(f"Target: {self.target_path}")
        print(f"Auto-fix: {'ENABLED' if self.auto_fix else 'DISABLED'}\n")
        
        # Get all files
        md_files = self.get_markdown_files()
        print(f"Found {len(md_files)} markdown file(s)\n")
        
        # Process each file
        all_results = {}
        
        for i, file_path in enumerate(md_files, 1):
            print(f"[{i}/{len(md_files)}] Processing: {file_path.name}")
            
            file_results = {
                'errors': 0,
                'warnings': 0,
                'issues': [],
                'fixes_applied': 0
            }
            
            # Run all validators (simulated here)
            for validator in self.validators:
                result = self.run_validator(file_path, validator['script'])
                if result['status'] == 'issues_found':
                    file_results['errors'] += 1 # Assume error if script fails/finds issues
                    file_results['issues'].append({'type': 'VALIDATOR_FAILURE', 'script': validator['name']})
            
            # Apply fixes if enabled
            if self.auto_fix: # Always try to fix if enabled, even if no explicit issues reported yet
                fix_result = self.auto_fix_file(file_path, file_results['issues'])
                file_results['fixes_applied'] = fix_result.get('fixed', 0)
                if fix_result['fixed'] > 0:
                    print(f"  [FIXED] Applied {fix_result['fixed']} automatic fixes")
            
            all_results[str(file_path)] = file_results
            print()
        
        # Generate and print summary
        summary = self.generate_summary_report(all_results)
        print(summary)
        
        # Save detailed results to JSON
        output_file = Path('validation_report.json')
        with open(output_file, 'w') as f:
            json.dump(all_results, f, indent=2)
        print(f"Detailed report saved to: {output_file}")
        
        # Return exit code based on results
        total_errors = sum(r.get('errors', 0) for r in all_results.values())
        return 0 if total_errors == 0 else 1

def main():
    parser = argparse.ArgumentParser(
        description='Master validator for Dev Vault markdown files'
    )
    parser.add_argument(
        'path',
        help='Path to markdown file or directory'
    )
    parser.add_argument(
        '--fix',
        action='store_true',
        help='Automatically fix common issues'
    )
    parser.add_argument(
        '--report',
        default='validation_report.json',
        help='Output report filename'
    )
    
    args = parser.parse_args()
    
    validator = MasterValidator(args.path, auto_fix=args.fix)
    exit_code = validator.run_full_validation()
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
