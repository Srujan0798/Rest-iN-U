"""
REST-iN-U Project Cleanup and Validation Script
Comprehensive automated cleanup for university presentation
"""

import os
import json
from pathlib import Path
from datetime import datetime, timedelta
import subprocess

class ProjectCleaner:
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.report = {
            'timestamp': datetime.now().isoformat(),
            'outdated_files': [],
            'unnecessary_files': [],
            'missing_docs': [],
            'code_issues': [],
            'recommendations': []
        }
    
    def find_outdated_files(self):
        """Find files not modified in last 6 months"""
        six_months_ago = datetime.now() - timedelta(days=180)
        outdated = []
        
        for file in self.project_root.rglob('*'):
            if file.is_file() and not self.is_excluded(file):
                mtime = datetime.fromtimestamp(file.stat().st_mtime)
                if mtime < six_months_ago:
                    outdated.append({
                        'path': str(file.relative_to(self.project_root)),
                        'last_modified': mtime.isoformat(),
                        'size': file.stat().st_size
                    })
        
        self.report['outdated_files'] = outdated
        return outdated
    
    def find_unnecessary_files(self):
        """Find unnecessary files (temp, cache, duplicates)"""
        unnecessary_patterns = [
            '*.log', '*.tmp', '*.cache', '*.bak', '*.swp',
            '__pycache__', 'node_modules', '.DS_Store',
            'Thumbs.db', '*.pyc', '*.pyo', '.pytest_cache'
        ]
        
        unnecessary = []
        for pattern in unnecessary_patterns:
            for file in self.project_root.rglob(pattern):
                unnecessary.append(str(file.relative_to(self.project_root)))
        
        self.report['unnecessary_files'] = unnecessary
        return unnecessary
    
    def validate_documentation(self):
        """Validate all documentation files"""
        required_docs = [
            'README.md', 'API.md', 'CONTRIBUTING.md',
            'DEPLOYMENT.md', 'SECURITY.md'
        ]
        
        missing = []
        for doc in required_docs:
            doc_path = self.project_root / doc
            if not doc_path.exists():
                missing.append(doc)
            else:
                # Validate content
                content = doc_path.read_text()
                if len(content) < 100:
                    self.report['code_issues'].append(
                        f"{doc} is too short (< 100 chars)"
                    )
        
        self.report['missing_docs'] = missing
        return missing
    
    def check_code_quality(self):
        """Check code quality issues"""
        issues = []
        
        # Check Python files
        for py_file in self.project_root.rglob('*.py'):
            if self.is_excluded(py_file):
                continue
            
            content = py_file.read_text()
            
            # Check for TODOs
            if 'TODO' in content:
                issues.append(f"{py_file.name}: Contains TODO comments")
            
            # Check for print statements (should use logging)
            if 'print(' in content and 'test' not in str(py_file):
                issues.append(f"{py_file.name}: Contains print statements")
        
        # Check TypeScript files
        for ts_file in self.project_root.rglob('*.ts*'):
            if self.is_excluded(ts_file):
                continue
            
            content = ts_file.read_text()
            
            # Check for console.log
            if 'console.log' in content:
                issues.append(f"{ts_file.name}: Contains console.log")
            
            # Check for any type
            if ': any' in content:
                issues.append(f"{ts_file.name}: Uses 'any' type")
        
        self.report['code_issues'] = issues
        return issues
    
    def organize_files(self):
        """Organize files into proper structure"""
        recommendations = []
        
        # Check for misplaced files
        for file in self.project_root.glob('*'):
            if file.is_file() and file.suffix in ['.ts', '.tsx', '.py']:
                recommendations.append(
                    f"Move {file.name} to appropriate directory"
                )
        
        self.report['recommendations'] = recommendations
        return recommendations
    
    def is_excluded(self, path):
        """Check if path should be excluded"""
        excluded = [
            'node_modules', '.git', '__pycache__', 'dist',
            'build', '.next', 'venv', 'env'
        ]
        return any(ex in str(path) for ex in excluded)
    
    def generate_report(self):
        """Generate comprehensive cleanup report"""
        report_path = self.project_root / 'CLEANUP_REPORT.md'
        
        content = f"""# Project Cleanup Report
**Generated**: {self.report['timestamp']}

## Summary
- Outdated files: {len(self.report['outdated_files'])}
- Unnecessary files: {len(self.report['unnecessary_files'])}
- Missing docs: {len(self.report['missing_docs'])}
- Code issues: {len(self.report['code_issues'])}

## Outdated Files ({len(self.report['outdated_files'])})
"""
        for file in self.report['outdated_files'][:10]:
            content += f"- {file['path']} (Last modified: {file['last_modified']})\n"
        
        content += f"\n## Unnecessary Files ({len(self.report['unnecessary_files'])})\n"
        for file in self.report['unnecessary_files'][:20]:
            content += f"- {file}\n"
        
        content += f"\n## Missing Documentation\n"
        for doc in self.report['missing_docs']:
            content += f"- ❌ {doc}\n"
        
        content += f"\n## Code Quality Issues ({len(self.report['code_issues'])})\n"
        for issue in self.report['code_issues'][:20]:
            content += f"- {issue}\n"
        
        content += f"\n## Recommendations\n"
        for rec in self.report['recommendations']:
            content += f"- {rec}\n"
        
        report_path.write_text(content)
        return str(report_path)
    
    def run_full_cleanup(self):
        """Run full cleanup process"""
        print("🔍 Finding outdated files...")
        self.find_outdated_files()
        
        print("🗑️  Finding unnecessary files...")
        self.find_unnecessary_files()
        
        print("📚 Validating documentation...")
        self.validate_documentation()
        
        print("✨ Checking code quality...")
        self.check_code_quality()
        
        print("📁 Organizing files...")
        self.organize_files()
        
        print("📄 Generating report...")
        report_path = self.generate_report()
        
        print(f"\n✅ Cleanup report generated: {report_path}")
        return self.report


if __name__ == '__main__':
    cleaner = ProjectCleaner('.')
    report = cleaner.run_full_cleanup()
    
    print(f"\n📊 Summary:")
    print(f"  - Outdated files: {len(report['outdated_files'])}")
    print(f"  - Unnecessary files: {len(report['unnecessary_files'])}")
    print(f"  - Missing docs: {len(report['missing_docs'])}")
    print(f"  - Code issues: {len(report['code_issues'])}")
