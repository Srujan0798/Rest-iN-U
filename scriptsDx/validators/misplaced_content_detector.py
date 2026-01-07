#!/usr/bin/env python3
"""
Misplaced Content Detector
Identifies content that doesn't belong in current file
Suggests correct file location based on domain analysis
"""

import sys
import re
from pathlib import Path
from typing import List, Dict, Set

# Fix encoding for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

class MisplacedContentDetector:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        
        # Domain keywords mapping
        self.domain_keywords = {
            'Frontend': ['react', 'vue', 'angular', 'component', 'jsx', 'tsx', 'css', 'html', 
                        'dom', 'browser', 'ui', 'ux', 'tailwind', 'styled-components'],
            'Backend': ['api', 'endpoint', 'server', 'middleware', 'route', 'controller',
                       'express', 'fastify', 'nest', 'django', 'flask', 'rest', 'graphql'],
            'Database': ['sql', 'query', 'table', 'index', 'migration', 'schema', 'orm',
                        'prisma', 'sequelize', 'typeorm', 'mongodb', 'postgres', 'mysql'],
            'Testing': ['test', 'jest', 'vitest', 'cypress', 'playwright', 'unit', 
                       'integration', 'e2e', 'mock', 'spy', 'stub', 'expect', 'assert'],
            'Security': ['auth', 'authentication', 'authorization', 'jwt', 'oauth', 'token',
                        'encryption', 'hash', 'csrf', 'xss', 'cors', 'ssl', 'tls'],
            'DevOps': ['docker', 'kubernetes', 'ci', 'cd', 'deploy', 'aws', 'gcp', 'azure',
                      'container', 'orchestration', 'pipeline', 'jenkins', 'github actions'],
            'Mobile': ['ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin',
                      'mobile', 'app', 'native'],
            'Performance': ['optimization', 'caching', 'cdn', 'lazy loading', 'code splitting',
                           'bundle', 'minification', 'compression', 'performance']
        }
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def detect_file_domain(self, file_path: Path) -> str:
        """Detect expected domain from filename"""
        filename = file_path.stem.lower()
        
        for domain, keywords in self.domain_keywords.items():
            if any(keyword in filename for keyword in keywords):
                return domain
        
        return "Unknown"
    
    def analyze_section_domain(self, section_text: str) -> Dict[str, int]:
        """Analyze which domains a section belongs to"""
        section_lower = section_text.lower()
        domain_scores = {}
        
        for domain, keywords in self.domain_keywords.items():
            score = sum(section_lower.count(keyword) for keyword in keywords)
            if score > 0:
                domain_scores[domain] = score
        
        return domain_scores
    
    def extract_sections(self, content: str) -> List[Dict]:
        """Extract sections with their headings"""
        lines = content.split('\n')
        sections = []
        current_section = {'heading': '', 'content': '', 'start_line': 0}
        
        for i, line in enumerate(lines):
            if line.startswith('##'):
                # Save previous section
                if current_section['heading']:
                    sections.append(current_section)
                
                # Start new section
                current_section = {
                    'heading': line.strip(),
                    'content': line + '\n',
                    'start_line': i + 1
                }
            else:
                current_section['content'] += line + '\n'
        
        # Add last section
        if current_section['heading']:
            sections.append(current_section)
        
        return sections
    
    def detect_misplaced_content(self, file_path: Path) -> Dict:
        """Detect misplaced content in a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            file_domain = self.detect_file_domain(file_path)
            sections = self.extract_sections(content)
            
            misplaced_sections = []
            
            for section in sections:
                domain_scores = self.analyze_section_domain(section['content'])
                
                if not domain_scores:
                    continue  # No clear domain
                
                # Get dominant domain
                dominant_domain = max(domain_scores.items(), key=lambda x: x[1])[0]
                dominant_score = domain_scores[dominant_domain]
                
                # Check if section belongs to different domain
                if dominant_domain != file_domain and dominant_score >= 3:
                    # Check if it's acceptable cross-domain content
                    if not self.is_acceptable_crossdomain(file_domain, dominant_domain):
                        misplaced_sections.append({
                            'heading': section['heading'],
                            'line': section['start_line'],
                            'current_file_domain': file_domain,
                            'suggested_domain': dominant_domain,
                            'confidence': dominant_score,
                            'all_domains': domain_scores
                        })
            
            return {
                'file': file_path.name,
                'file_domain': file_domain,
                'misplaced_sections': misplaced_sections,
                'total_misplaced': len(misplaced_sections)
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def is_acceptable_crossdomain(self, file_domain: str, content_domain: str) -> bool:
        """Check if cross-domain content is acceptable"""
        acceptable = {
            'Frontend': ['Backend', 'Security', 'Performance'],  # Frontend can mention APIs
            'Backend': ['Database', 'Security', 'Performance'],
            'Mobile': ['Frontend', 'Backend', 'Performance'],
            'Testing': ['Frontend', 'Backend', 'Database'],  # Testing can mention all
        }
        
        return content_domain in acceptable.get(file_domain, [])
    
    def run_detection(self):
        """Run detection on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"MISPLACED CONTENT DETECTOR - Domain Analysis")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.detect_misplaced_content(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            if result['total_misplaced'] > 0:
                print(f"[!] {result['file']} ({result['file_domain']}): "
                      f"{result['total_misplaced']} misplaced sections")
                
                for section in result['misplaced_sections'][:3]:
                    print(f"    Line {section['line']}: {section['heading']}")
                    print(f"      Should be in: {section['suggested_domain']} "
                          f"(confidence: {section['confidence']})")
                
                if result['total_misplaced'] > 3:
                    print(f"    ... and {result['total_misplaced'] - 3} more sections")
            else:
                print(f"[OK] {result['file']} ({result['file_domain']}): All content in correct domain")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of detection"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        total_files = len(valid_results)
        total_misplaced = sum(r['total_misplaced'] for r in valid_results)
        files_with_issues = [r for r in valid_results if r['total_misplaced'] > 0]
        
        print(f"Files analyzed: {total_files}")
        print(f"Files with misplaced content: {len(files_with_issues)}")
        print(f"Total misplaced sections: {total_misplaced}\n")
        
        if files_with_issues:
            print("Files needing reorganization:")
            for result in sorted(files_with_issues, key=lambda x: x['total_misplaced'], reverse=True)[:10]:
                print(f"  - {result['file']}: {result['total_misplaced']} sections")
            
            # Suggest moves
            print("\nSuggested moves:")
            for result in files_with_issues:
                for section in result['misplaced_sections'][:2]:
                    print(f"  - Move '{section['heading']}' from {result['file']} "
                          f"to {section['suggested_domain']} file")
        else:
            print("All content is in correct files!")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python misplaced_content_detector.py <vault_directory>")
        sys.exit(1)
    
    detector = MisplacedContentDetector(sys.argv[1])
    detector.run_detection()
