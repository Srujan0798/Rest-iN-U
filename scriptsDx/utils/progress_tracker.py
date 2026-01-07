#!/usr/bin/env python3
"""
Progress Tracker
Tracks daily work, completion percentages, and generates progress reports
Prevents false completion claims with honest metrics
"""

import sys
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List

class ProgressTracker:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        self.project_root = self.vault_dir.parent
        self.progress_file = self.project_root / "scriptsDx" / "reports" / "progress_tracking.json"
        self.progress_file.parent.mkdir(parents=True, exist_ok=True)
        
        self.load_progress()
    
    def load_progress(self):
        """Load existing progress data"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self.data = {
                'project_start_date': datetime.now().isoformat(),
                'total_files': 0,
                'files_completed': 0,
                'daily_logs': [],
                'file_status': {},
                'total_issues_found': 0,
                'total_issues_fixed': 0
            }
    
    def save_progress(self):
        """Save progress data"""
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2)
    
    def log_daily_work(self, session_data: Dict):
        """Log a day's work"""
        log_entry = {
            'date': datetime.now().isoformat(),
            'files_worked_on': session_data.get('files_worked_on', []),
            'lines_verified': session_data.get('lines_verified', 0),
            'issues_found': session_data.get('issues_found', 0),
            'issues_fixed': session_data.get('issues_fixed', 0),
            'scripts_run': session_data.get('scripts_run', []),
            'notes': session_data.get('notes', '')
        }
        
        self.data['daily_logs'].append(log_entry)
        self.data['total_issues_found'] += log_entry['issues_found']
        self.data['total_issues_fixed'] += log_entry['issues_fixed']
        
        self.save_progress()
        
        print(f"\n[OK] Daily work logged for {datetime.now().strftime('%Y-%m-%d')}")
        print(f"     Files worked on: {len(log_entry['files_worked_on'])}")
        print(f"     Lines verified: {log_entry['lines_verified']}")
        print(f"     Issues found: {log_entry['issues_found']}")
        print(f"     Issues fixed: {log_entry['issues_fixed']}")
    
    def update_file_status(self, file_name: str, status: Dict):
        """Update status of a specific file"""
        self.data['file_status'][file_name] = {
            'last_updated': datetime.now().isoformat(),
            'completion_percentage': status.get('completion_percentage', 0),
            'quality_score': status.get('quality_score', 0),
            'issues_remaining': status.get('issues_remaining', 0),
            'verified_sections': status.get('verified_sections', [])
        }
        
        self.save_progress()
    
    def calculate_overall_completion(self) -> float:
        """Calculate honest overall completion percentage"""
        if not self.data['file_status']:
            return 0.0
        
        total_completion = sum(
            status['completion_percentage'] 
            for status in self.data['file_status'].values()
        )
        
        avg_completion = total_completion / len(self.data['file_status'])
        return round(avg_completion, 2)
    
    def generate_daily_report(self) -> str:
        """Generate daily progress report"""
        if not self.data['daily_logs']:
            return "No daily logs available"
        
        latest_log = self.data['daily_logs'][-1]
        total_days = len(self.data['daily_logs'])
        overall_completion = self.calculate_overall_completion()
        
        report = f"""
{'='*80}
DAILY PROGRESS REPORT
{'='*80}

Date: {datetime.fromisoformat(latest_log['date']).strftime('%Y-%m-%d %H:%M')}
Day: {total_days}

TODAY'S WORK:
  Files Worked On: {len(latest_log['files_worked_on'])}
  Lines Verified: {latest_log['lines_verified']:,}
  Issues Found: {latest_log['issues_found']}
  Issues Fixed: {latest_log['issues_fixed']}
  Scripts Run: {len(latest_log['scripts_run'])}

FILES WORKED ON TODAY:
"""
        for file_name in latest_log['files_worked_on']:
            report += f"  - {file_name}\n"
        
        report += f"""
OVERALL PROJECT STATUS:
  Total Days Worked: {total_days}
  Total Files: {len(self.data['file_status'])}
  Overall Completion: {overall_completion}%
  Total Issues Found: {self.data['total_issues_found']}
  Total Issues Fixed: {self.data['total_issues_fixed']}
  Issues Remaining: {self.data['total_issues_found'] - self.data['total_issues_fixed']}

COMPLETION BY FILE:
"""
        
        for file_name, status in sorted(self.data['file_status'].items(), 
                                       key=lambda x: x[1]['completion_percentage'], 
                                       reverse=True):
            report += f"  {file_name}: {status['completion_percentage']}% "
            report += f"(Quality: {status['quality_score']}/10, "
            report += f"Issues: {status['issues_remaining']})\n"
        
        if latest_log['notes']:
            report += f"\nNOTES:\n{latest_log['notes']}\n"
        
        report += f"\n{'='*80}\n"
        
        return report
    
    def generate_summary_report(self) -> str:
        """Generate overall summary report"""
        overall_completion = self.calculate_overall_completion()
        total_days = len(self.data['daily_logs'])
        
        # Calculate statistics
        total_lines_verified = sum(log['lines_verified'] for log in self.data['daily_logs'])
        avg_lines_per_day = total_lines_verified / total_days if total_days > 0 else 0
        
        report = f"""
{'='*80}
PROJECT SUMMARY REPORT
{'='*80}

PROJECT TIMELINE:
  Start Date: {datetime.fromisoformat(self.data['project_start_date']).strftime('%Y-%m-%d')}
  Days Worked: {total_days}
  Overall Completion: {overall_completion}%

WORK STATISTICS:
  Total Lines Verified: {total_lines_verified:,}
  Average Lines/Day: {int(avg_lines_per_day):,}
  Total Issues Found: {self.data['total_issues_found']}
  Total Issues Fixed: {self.data['total_issues_fixed']}
  Fix Rate: {round(self.data['total_issues_fixed'] / self.data['total_issues_found'] * 100, 1) if self.data['total_issues_found'] > 0 else 0}%

FILE STATUS:
  Total Files: {len(self.data['file_status'])}
  Completed (100%): {sum(1 for s in self.data['file_status'].values() if s['completion_percentage'] == 100)}
  In Progress (1-99%): {sum(1 for s in self.data['file_status'].values() if 0 < s['completion_percentage'] < 100)}
  Not Started (0%): {sum(1 for s in self.data['file_status'].values() if s['completion_percentage'] == 0)}

QUALITY METRICS:
  Average Quality Score: {round(sum(s['quality_score'] for s in self.data['file_status'].values()) / len(self.data['file_status']), 2) if self.data['file_status'] else 0}/10
  Files Above 8/10: {sum(1 for s in self.data['file_status'].values() if s['quality_score'] >= 8)}
  Files Below 5/10: {sum(1 for s in self.data['file_status'].values() if s['quality_score'] < 5)}

REALISTIC ASSESSMENT:
"""
        
        if overall_completion < 10:
            report += "  Status: JUST STARTED - Long way to go\n"
        elif overall_completion < 30:
            report += "  Status: EARLY STAGE - Significant work remaining\n"
        elif overall_completion < 60:
            report += "  Status: PROGRESSING - About halfway there\n"
        elif overall_completion < 90:
            report += "  Status: ADVANCED - Final stretch\n"
        elif overall_completion < 100:
            report += "  Status: NEARLY COMPLETE - Final verification needed\n"
        else:
            report += "  Status: COMPLETE - All files verified\n"
        
        # Estimate remaining work
        if overall_completion < 100:
            remaining_percentage = 100 - overall_completion
            if total_days > 0:
                estimated_days_remaining = int((remaining_percentage / overall_completion) * total_days)
                report += f"  Estimated Days Remaining: {estimated_days_remaining}\n"
        
        report += f"\n{'='*80}\n"
        
        return report
    
    def run_interactive_log(self):
        """Interactive session for logging daily work"""
        print(f"\n{'='*80}")
        print("DAILY WORK LOGGER")
        print(f"{'='*80}\n")
        
        # Collect session data
        session_data = {}
        
        print("Files worked on today (comma-separated):")
        files_input = input("> ")
        session_data['files_worked_on'] = [f.strip() for f in files_input.split(',') if f.strip()]
        
        print("\nApproximate lines verified today:")
        try:
            session_data['lines_verified'] = int(input("> "))
        except:
            session_data['lines_verified'] = 0
        
        print("\nIssues found today:")
        try:
            session_data['issues_found'] = int(input("> "))
        except:
            session_data['issues_found'] = 0
        
        print("\nIssues fixed today:")
        try:
            session_data['issues_fixed'] = int(input("> "))
        except:
            session_data['issues_fixed'] = 0
        
        print("\nScripts run today (comma-separated):")
        scripts_input = input("> ")
        session_data['scripts_run'] = [s.strip() for s in scripts_input.split(',') if s.strip()]
        
        print("\nNotes (optional):")
        session_data['notes'] = input("> ")
        
        # Log the work
        self.log_daily_work(session_data)
        
        # Show report
        print(self.generate_daily_report())

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python progress_tracker.py <vault_directory> [--log|--report|--summary]")
        sys.exit(1)
    
    tracker = ProgressTracker(sys.argv[1])
    
    if '--log' in sys.argv:
        tracker.run_interactive_log()
    elif '--report' in sys.argv:
        print(tracker.generate_daily_report())
    elif '--summary' in sys.argv:
        print(tracker.generate_summary_report())
    else:
        print("Specify --log to log work, --report for daily report, or --summary for overall summary")
