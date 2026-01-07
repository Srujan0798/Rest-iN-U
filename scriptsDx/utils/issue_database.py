#!/usr/bin/env python3
"""
Issue Database
Tracks all found issues, their status, and generates issue reports
Prevents issues from being forgotten or lost
"""

import sys
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List

class IssueDatabase:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        self.project_root = self.vault_dir.parent
        self.db_file = self.project_root / "scriptsDx" / "reports" / "issue_database.json"
        self.db_file.parent.mkdir(parents=True, exist_ok=True)
        
        self.load_database()
    
    def load_database(self):
        """Load existing issue database"""
        if self.db_file.exists():
            with open(self.db_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self.data = {
                'issues': [],
                'next_id': 1,
                'statistics': {
                    'total_issues': 0,
                    'open_issues': 0,
                    'fixed_issues': 0,
                    'ignored_issues': 0
                }
            }
    
    def save_database(self):
        """Save issue database"""
        with open(self.db_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2)
    
    def add_issue(self, issue_data: Dict) -> int:
        """Add a new issue to database"""
        issue_id = self.data['next_id']
        
        issue = {
            'id': issue_id,
            'file': issue_data.get('file', 'unknown'),
            'line': issue_data.get('line', 0),
            'type': issue_data.get('type', 'UNKNOWN'),
            'severity': issue_data.get('severity', 'INFO'),
            'message': issue_data.get('message', ''),
            'status': 'OPEN',
            'created_date': datetime.now().isoformat(),
            'fixed_date': None,
            'notes': issue_data.get('notes', '')
        }
        
        self.data['issues'].append(issue)
        self.data['next_id'] += 1
        self.data['statistics']['total_issues'] += 1
        self.data['statistics']['open_issues'] += 1
        
        self.save_database()
        return issue_id
    
    def mark_fixed(self, issue_id: int, notes: str = ''):
        """Mark an issue as fixed"""
        for issue in self.data['issues']:
            if issue['id'] == issue_id and issue['status'] == 'OPEN':
                issue['status'] = 'FIXED'
                issue['fixed_date'] = datetime.now().isoformat()
                if notes:
                    issue['notes'] += f"\nFixed: {notes}"
                
                self.data['statistics']['open_issues'] -= 1
                self.data['statistics']['fixed_issues'] += 1
                
                self.save_database()
                return True
        return False
    
    def mark_ignored(self, issue_id: int, reason: str = ''):
        """Mark an issue as ignored (false positive, intentional, etc.)"""
        for issue in self.data['issues']:
            if issue['id'] == issue_id and issue['status'] == 'OPEN':
                issue['status'] = 'IGNORED'
                issue['notes'] += f"\nIgnored: {reason}"
                
                self.data['statistics']['open_issues'] -= 1
                self.data['statistics']['ignored_issues'] += 1
                
                self.save_database()
                return True
        return False
    
    def get_issues_by_file(self, file_name: str) -> List[Dict]:
        """Get all issues for a specific file"""
        return [issue for issue in self.data['issues'] if issue['file'] == file_name]
    
    def get_issues_by_status(self, status: str) -> List[Dict]:
        """Get all issues with specific status"""
        return [issue for issue in self.data['issues'] if issue['status'] == status]
    
    def get_issues_by_severity(self, severity: str) -> List[Dict]:
        """Get all issues with specific severity"""
        return [issue for issue in self.data['issues'] if issue['severity'] == severity]
    
    def generate_report(self, filter_type: str = 'all') -> str:
        """Generate issue report"""
        report = f"""
{'='*80}
ISSUE DATABASE REPORT
{'='*80}

STATISTICS:
  Total Issues: {self.data['statistics']['total_issues']}
  Open Issues: {self.data['statistics']['open_issues']}
  Fixed Issues: {self.data['statistics']['fixed_issues']}
  Ignored Issues: {self.data['statistics']['ignored_issues']}

"""
        
        # Filter issues
        if filter_type == 'open':
            issues = self.get_issues_by_status('OPEN')
            report += "OPEN ISSUES:\n"
        elif filter_type == 'fixed':
            issues = self.get_issues_by_status('FIXED')
            report += "FIXED ISSUES:\n"
        elif filter_type == 'critical':
            issues = self.get_issues_by_severity('ERROR')
            report += "CRITICAL ISSUES:\n"
        else:
            issues = self.data['issues']
            report += "ALL ISSUES:\n"
        
        if not issues:
            report += "  None\n"
        else:
            # Group by file
            by_file = {}
            for issue in issues:
                file_name = issue['file']
                if file_name not in by_file:
                    by_file[file_name] = []
                by_file[file_name].append(issue)
            
            for file_name, file_issues in sorted(by_file.items()):
                report += f"\n{file_name} ({len(file_issues)} issues):\n"
                
                for issue in sorted(file_issues, key=lambda x: x['line']):
                    status_symbol = {
                        'OPEN': '[OPEN]',
                        'FIXED': '[FIXED]',
                        'IGNORED': '[IGNORED]'
                    }.get(issue['status'], '[?]')
                    
                    severity_symbol = {
                        'ERROR': '',
                        'WARNING': '',
                        'INFO': ''
                    }.get(issue['severity'], '')
                    
                    report += f"  #{issue['id']} {status_symbol} {severity_symbol} "
                    report += f"Line {issue['line']}: {issue['type']}\n"
                    report += f"      {issue['message']}\n"
        
        report += f"\n{'='*80}\n"
        return report
    
    def import_from_script_output(self, script_output: Dict):
        """Import issues from script output"""
        if 'issues' not in script_output:
            return 0
        
        count = 0
        for issue in script_output['issues']:
            self.add_issue({
                'file': script_output.get('file', 'unknown'),
                'line': issue.get('line', 0),
                'type': issue.get('type', 'UNKNOWN'),
                'severity': issue.get('severity', 'INFO'),
                'message': issue.get('message', ''),
                'notes': f"From script: {script_output.get('script_name', 'unknown')}"
            })
            count += 1
        
        return count

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python issue_database.py <vault_directory> [--report|--open|--fixed|--critical]")
        sys.exit(1)
    
    db = IssueDatabase(sys.argv[1])
    
    if '--report' in sys.argv or '--open' in sys.argv or '--fixed' in sys.argv or '--critical' in sys.argv:
        filter_type = 'all'
        if '--open' in sys.argv:
            filter_type = 'open'
        elif '--fixed' in sys.argv:
            filter_type = 'fixed'
        elif '--critical' in sys.argv:
            filter_type = 'critical'
        
        print(db.generate_report(filter_type))
    else:
        print("Specify --report, --open, --fixed, or --critical to view issues")
