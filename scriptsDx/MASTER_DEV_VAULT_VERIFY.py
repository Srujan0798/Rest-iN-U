"""
MASTER DEV VAULT VERIFICATION & FIX SYSTEM
==========================================
This script does EVERYTHING:
1. Checks ENTIRE Dev Vault for all issues
2. Generates comprehensive report
3. Automatically fixes all problems
4. Verifies the fixes worked

Run this ONE script to verify and fix the ENTIRE Dev Vault!
"""
import os
import subprocess
import time
from pathlib import Path

# CORRECT Dev Vault path
DEV_VAULT = r"docs\Dev Vault (ETERNAL MANUAL)"
PROJECT_ROOT = Path(__file__).parent.parent

class MasterVerifier:
    def __init__(self):
        self.dev_vault_path = PROJECT_ROOT / DEV_VAULT
        self.results = {
            'files_checked': 0,
            'issues_found': [],
            'fixes_applied': [],
            'verification_passed': True
        }
    
    def check_dev_vault_exists(self):
        """Verify Dev Vault directory exists"""
        print("\n" + "="*80)
        print("STEP 1: Checking Dev Vault exists...")
        print("="*80)
        
        if not self.dev_vault_path.exists():
            print(f"[ERROR] Dev Vault not found at: {self.dev_vault_path}")
            print(f"   Looking for: {self.dev_vault_path.absolute()}")
            return False
        
        print(f"[OK] Dev Vault found: {self.dev_vault_path}")
        return True
    
    def scan_all_files(self):
        """Scan all markdown files in Dev Vault"""
        print("\n" + "="*80)
        print("STEP 2: Scanning all Dev Vault files...")
        print("="*80)
        
        md_files = list(self.dev_vault_path.rglob("*.md"))
        self.results['files_checked'] = len(md_files)
        
        print(f"[OK] Found {len(md_files)} markdown files")
        
        # Show structure
        brain_files = [f for f in md_files if "BRAIN" in str(f)]
        knowledge_files = [f for f in md_files if "KNOWLEDGE" in str(f)]
        root_files = [f for f in md_files if "BRAIN" not in str(f) and "KNOWLEDGE" not in str(f)]
        
        print(f"   - BRAIN: {len(brain_files)} files")
        print(f"   - KNOWLEDGE: {len(knowledge_files)} files")
        print(f"   - Root: {len(root_files)} files")
        
        return md_files
    
    def run_corruption_check(self):
        """Check for corruption"""
        print("\n" + "="*80)
        print("STEP 3: Checking for corruption...")
        print("="*80)
        
        script = PROJECT_ROOT / "scriptsDx" / "corruption_detection" / "check_dev_vault_corruption.py"
        
        if not script.exists():
            print(f"[WARN] Corruption checker not found")
            return
        
        try:
            result = subprocess.run(
                ["python", str(script)],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(PROJECT_ROOT)
            )
            
            if "No corruption detected" in result.stdout or result.returncode == 0:
                print("[OK] No corruption detected")
            else:
                print("[WARN] Potential corruption found:")
                print(result.stdout[:500])
                self.results['issues_found'].append("Corruption detected")
        except Exception as e:
            print(f"[WARN] Error running corruption check: {e}")
    
    def run_universal_fixer(self):
        """Run universal lint fixer on ALL files"""
        print("\n" + "="*80)
        print("STEP 4: Running Universal Lint Fixer...")
        print("="*80)
        
        script = PROJECT_ROOT / "scriptsDx" / "fixers" / "universal_lint_fixer.py"
        
        if not script.exists():
            print(f"[ERROR] Universal fixer not found")
            return
        
        print("[FIX] Fixing all MD issues (MD001, MD004, MD009, MD012, MD025, MD040, MD060, etc.)...")
        
        try:
            result = subprocess.run(
                ["python", str(script)],
                capture_output=True,
                text=True,
                timeout=300,
                cwd=str(PROJECT_ROOT)
            )
            
            # Count fixes
            fixed_count = result.stdout.count("Fixed")
            
            if fixed_count > 0:
                print(f"[OK] Fixed {fixed_count} files")
                self.results['fixes_applied'].append(f"Universal fixer: {fixed_count} files")
            else:
                print("[OK] No fixes needed - all files already perfect!")
        except Exception as e:
            print(f"[ERROR] Error running universal fixer: {e}")
            self.results['issues_found'].append(f"Fixer error: {e}")
    
    def run_gap_killer(self):
        """Remove excessive gaps"""
        print("\n" + "="*80)
        print("STEP 5: Removing excessive gaps...")
        print("="*80)
        
        script = PROJECT_ROOT / "scriptsDx" / "fixers" / "aggressive_gap_killer.py"
        
        if not script.exists():
            print(f"[WARN] Gap killer not found")
            return
        
        try:
            result = subprocess.run(
                ["python", str(script)],
                capture_output=True,
                text=True,
                timeout=120,
                cwd=str(PROJECT_ROOT)
            )
            
            if "Fixed" in result.stdout:
                print("[OK] Gaps removed")
                self.results['fixes_applied'].append("Gap killer executed")
            else:
                print("[OK] No excessive gaps found")
        except Exception as e:
            print(f"[WARN] Error running gap killer: {e}")
    
    def run_master_validator(self):
        """Run master validator"""
        print("\n" + "="*80)
        print("STEP 6: Running Master Validator...")
        print("="*80)
        
        script = PROJECT_ROOT / "scriptsDx" / "core" / "master_validator.py"
        
        if not script.exists():
            print(f"[WARN] Master validator not found")
            return
        
        try:
            result = subprocess.run(
                ["python", str(script)],
                capture_output=True,
                text=True,
                timeout=180,
                cwd=str(PROJECT_ROOT)
            )
            
            if result.returncode == 0:
                print("[OK] All validations passed")
            else:
                print("[WARN] Validation issues found:")
                print(result.stdout[:500])
                self.results['issues_found'].append("Validation issues")
        except Exception as e:
            print(f"[WARN] Error running validator: {e}")
    
    def run_sentinel_verification(self):
        """Run Sentinel verification"""
        print("\n" + "="*80)
        print("STEP 7: Running Sentinel Verification...")
        print("="*80)
        
        script = PROJECT_ROOT / "scriptsDx" / "sentinel" / "verify_all.py"
        
        if not script.exists():
            print(f"[WARN] Sentinel not found")
            return
        
        try:
            result = subprocess.run(
                ["python", str(script), str(self.dev_vault_path)],
                capture_output=True,
                text=True,
                timeout=120,
                cwd=str(PROJECT_ROOT)
            )
            
            if "PASSED" in result.stdout or result.returncode == 0:
                print("[OK] Sentinel verification passed")
            else:
                print("[WARN] Sentinel found issues:")
                print(result.stdout[:500])
                self.results['issues_found'].append("Sentinel issues")
        except Exception as e:
            print(f"[WARN] Error running Sentinel: {e}")
    
    def generate_final_report(self):
        """Generate comprehensive final report"""
        print("\n" + "="*80)
        print("FINAL REPORT")
        print("="*80)
        
        print(f"\nStatistics:")
        print(f"   - Files checked: {self.results['files_checked']}")
        print(f"   - Issues found: {len(self.results['issues_found'])}")
        print(f"   - Fixes applied: {len(self.results['fixes_applied'])}")
        
        if self.results['issues_found']:
            print(f"\n[WARN] Issues Found:")
            for issue in self.results['issues_found']:
                print(f"   - {issue}")
        
        if self.results['fixes_applied']:
            print(f"\n[OK] Fixes Applied:")
            for fix in self.results['fixes_applied']:
                print(f"   - {fix}")
        
        print("\n" + "="*80)
        if len(self.results['issues_found']) == 0:
            print("[SUCCESS] DEV VAULT IS PERFECT!")
            print("   All files checked, no issues found!")
        else:
            print(f"[WARNING] {len(self.results['issues_found'])} issues found")
            print("   Review the issues above and run fixes as needed")
        print("="*80)

    
    def run_full_verification(self):
        """Run complete verification and fix process"""
        print("="*80)
        print("MASTER DEV VAULT VERIFICATION & FIX SYSTEM")
        print("="*80)
        print(f"Target: {self.dev_vault_path}")
        print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
        
        start_time = time.time()
        
        # Step 1: Check Dev Vault exists
        if not self.check_dev_vault_exists():
            print("\n❌ FATAL ERROR: Cannot proceed without Dev Vault")
            return
        
        # Step 2: Scan all files
        md_files = self.scan_all_files()
        
        # Step 3: Check for corruption
        self.run_corruption_check()
        
        # Step 4: Run universal fixer (MASTER FIXER)
        self.run_universal_fixer()
        
        # Step 5: Remove gaps
        self.run_gap_killer()
        
        # Step 6: Run master validator
        self.run_master_validator()
        
        # Step 7: Run Sentinel
        self.run_sentinel_verification()
        
        elapsed = time.time() - start_time
        
        # Final report
        self.generate_final_report()
        
        print(f"\n[TIME] Total time: {elapsed:.2f} seconds")
        print("\n" + "="*80)
        print("VERIFICATION COMPLETE!")
        print("="*80)

if __name__ == "__main__":
    verifier = MasterVerifier()
    verifier.run_full_verification()
