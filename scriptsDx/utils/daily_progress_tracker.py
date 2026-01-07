#!/usr/bin/env python3
"""
Daily Progress Tracker
Logs daily work, generates reports, tracks completion across sessions.
Merged functionality: progress tracking + issue logging + completion dashboard
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List

class DailyProgressTracker:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        self.reports_dir = Path(__file__).parent.parent / "reports"
        self.progress_file = self.reports_dir / "DAILY_PROGRESS.json"
        self.load_or_create_progress()
    
    def load_or_create_progress(self):
        """Load existing progress or create new tracking file"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                self.progress = json.load(f)
        else:
            self.progress = {
                "project_start": datetime.now().isoformat(),
                "total_sessions": 0,
                "files_verified": {},
                "issues_found": [],
                "issues_fixed": [],
                "daily_logs": []
            }
    
    def save_progress(self):
        """Save progress to file"""
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(self.progress, f, indent=2)
    
    def get_vault_files(self) -> List[Path]:
        """Get all markdown files in vault"""
        return list(self.vault_dir.rglob("*.md"))
    
    def calculate_completion(self) -> Dict:
        """Calculate overall completion percentage"""
        all_files = self.get_vault_files()
        verified = len(self.progress["files_verified"])
        total = len(all_files)
        
        return {
            "total_files": total,
            "verified_files": verified,
            "completion_percent": round((verified / total * 100) if total > 0 else 0, 2),
            "issues_found": len(self.progress["issues_found"]),
            "issues_fixed": len(self.progress["issues_fixed"]),
            "sessions_completed": self.progress["total_sessions"]
        }
    
    def log_session(self, files_worked: List[str], issues_found: List[str], issues_fixed: List[str], notes: str = ""):
        """Log a work session"""
        session = {
            "date": datetime.now().isoformat(),
            "session_number": self.progress["total_sessions"] + 1,
            "files_worked": files_worked,
            "issues_found_count": len(issues_found),
            "issues_fixed_count": len(issues_fixed),
            "notes": notes
        }
        
        self.progress["daily_logs"].append(session)
        self.progress["total_sessions"] += 1
        self.progress["issues_found"].extend(issues_found)
        self.progress["issues_fixed"].extend(issues_fixed)
        
        for f in files_worked:
            self.progress["files_verified"][f] = datetime.now().isoformat()
        
        self.save_progress()
        return session
    
    def generate_report(self) -> str:
        """Generate current status report"""
        stats = self.calculate_completion()
        
        report = f"""
================================================================================
DEV VAULT PROGRESS REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M')}
================================================================================

COMPLETION STATUS:
  Total Files: {stats['total_files']}
  Verified: {stats['verified_files']}
  Completion: {stats['completion_percent']}%

WORK SUMMARY:
  Sessions Completed: {stats['sessions_completed']}
  Total Issues Found: {stats['issues_found']}
  Total Issues Fixed: {stats['issues_fixed']}

PROJECT TIMELINE:
  Started: {self.progress.get('project_start', 'Unknown')}
  Last Session: {self.progress['daily_logs'][-1]['date'] if self.progress['daily_logs'] else 'None'}

================================================================================
"""
        return report
    
    def print_dashboard(self):
        """Print progress dashboard"""
        print(self.generate_report())
        
        # Recent sessions
        if self.progress["daily_logs"]:
            print("RECENT SESSIONS:")
            for log in self.progress["daily_logs"][-5:]:
                print(f"  Session {log['session_number']}: {log['date'][:10]} - {len(log['files_worked'])} files, {log['issues_found_count']} issues")
            print()

def main():
    if len(sys.argv) < 2:
        print("Usage: python daily_progress_tracker.py <vault_directory> [--log|--report]")
        sys.exit(1)
    
    tracker = DailyProgressTracker(sys.argv[1])
    
    if len(sys.argv) > 2 and sys.argv[2] == "--report":
        tracker.print_dashboard()
    else:
        # Default: show current status
        tracker.print_dashboard()
        
        # Save initial progress
        tracker.save_progress()
        print(f"[OK] Progress saved to: {tracker.progress_file}")

if __name__ == "__main__":
    main()
