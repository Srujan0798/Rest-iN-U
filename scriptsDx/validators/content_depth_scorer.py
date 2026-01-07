#!/usr/bin/env python3
"""
Content Depth Scorer
Measures content complexity and depth to ensure "24k-30k gold" quality
Flags generic AI-generated content and surface-level information
"""

import sys
import re
from pathlib import Path
from typing import List, Dict

class ContentDepthScorer:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        
        # Indicators of deep, quality content
        self.depth_indicators = {
            'technical_terms': [
                'implementation', 'architecture', 'optimization', 'performance',
                'scalability', 'concurrency', 'asynchronous', 'synchronous',
                'middleware', 'dependency injection', 'design pattern',
                'algorithm', 'complexity', 'trade-off', 'edge case'
            ],
            'real_world': [
                'production', 'deployment', 'incident', 'debugging',
                'troubleshooting', 'root cause', 'workaround', 'gotcha',
                'pitfall', 'best practice', 'anti-pattern', 'real-world'
            ],
            'advanced_concepts': [
                'distributed', 'microservice', 'event-driven', 'reactive',
                'functional programming', 'immutable', 'pure function',
                'side effect', 'race condition', 'deadlock', 'memory leak'
            ],
            'code_quality': [
                'refactor', 'technical debt', 'code smell', 'clean code',
                'solid principles', 'dry principle', 'separation of concerns',
                'single responsibility', 'dependency inversion'
            ]
        }
        
        # Indicators of shallow, generic content
        self.shallow_indicators = [
            'simply', 'just', 'easy', 'basic', 'simple',
            'hello world', 'getting started', 'introduction to',
            'what is', 'how to', 'tutorial', 'beginner',
            'lorem ipsum', 'example', 'sample', 'demo'
        ]
        
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def score_content_depth(self, content: str) -> Dict:
        """Score content depth based on multiple factors"""
        lines = content.split('\n')
        content_lower = content.lower()
        
        scores = {
            'technical_depth': 0,
            'real_world_relevance': 0,
            'advanced_concepts': 0,
            'code_quality_focus': 0,
            'shallow_content_penalty': 0,
            'code_example_quality': 0,
            'explanation_depth': 0
        }
        
        # Score 1: Technical depth (0-25 points)
        for term in self.depth_indicators['technical_terms']:
            count = content_lower.count(term)
            scores['technical_depth'] += min(count * 0.5, 5)
        scores['technical_depth'] = min(scores['technical_depth'], 25)
        
        # Score 2: Real-world relevance (0-25 points)
        for term in self.depth_indicators['real_world']:
            count = content_lower.count(term)
            scores['real_world_relevance'] += min(count * 0.7, 5)
        scores['real_world_relevance'] = min(scores['real_world_relevance'], 25)
        
        # Score 3: Advanced concepts (0-20 points)
        for term in self.depth_indicators['advanced_concepts']:
            count = content_lower.count(term)
            scores['advanced_concepts'] += min(count * 1.0, 5)
        scores['advanced_concepts'] = min(scores['advanced_concepts'], 20)
        
        # Score 4: Code quality focus (0-15 points)
        for term in self.depth_indicators['code_quality']:
            count = content_lower.count(term)
            scores['code_quality_focus'] += min(count * 0.8, 4)
        scores['code_quality_focus'] = min(scores['code_quality_focus'], 15)
        
        # Penalty: Shallow content (-20 points max)
        for term in self.shallow_indicators:
            count = content_lower.count(term)
            scores['shallow_content_penalty'] -= min(count * 0.3, 3)
        scores['shallow_content_penalty'] = max(scores['shallow_content_penalty'], -20)
        
        # Score 5: Code example quality (0-10 points)
        code_blocks = content.count('```')
        if code_blocks > 0:
            # Check for meaningful code (not just "console.log('hello')")
            code_block_pattern = re.compile(r'```[\w]*\n(.*?)\n```', re.DOTALL)
            code_examples = code_block_pattern.findall(content)
            
            meaningful_examples = 0
            for example in code_examples:
                # Check if code is substantial (>3 lines, >100 chars)
                if len(example.split('\n')) > 3 and len(example) > 100:
                    meaningful_examples += 1
            
            scores['code_example_quality'] = min(meaningful_examples * 2, 10)
        
        # Score 6: Explanation depth (0-5 points)
        # Check for detailed explanations (paragraphs >200 chars)
        paragraphs = [p for p in content.split('\n\n') if len(p) > 200]
        scores['explanation_depth'] = min(len(paragraphs) * 0.5, 5)
        
        # Calculate total score (0-100)
        total_score = sum(scores.values())
        total_score = max(0, min(100, total_score))
        
        # Convert to quality rating
        quality_rating = self.get_quality_rating(total_score)
        gold_standard = self.get_gold_standard(total_score)
        
        return {
            'total_score': round(total_score, 2),
            'quality_rating': quality_rating,
            'gold_standard': gold_standard,
            'breakdown': {k: round(v, 2) for k, v in scores.items()}
        }
    
    def get_quality_rating(self, score: float) -> str:
        """Convert score to quality rating"""
        if score >= 80:
            return "EXCELLENT"
        elif score >= 60:
            return "GOOD"
        elif score >= 40:
            return "FAIR"
        elif score >= 20:
            return "POOR"
        else:
            return "CRITICAL"
    
    def get_gold_standard(self, score: float) -> str:
        """Convert score to gold standard"""
        if score >= 85:
            return "30k GOLD"
        elif score >= 70:
            return "27k GOLD"
        elif score >= 55:
            return "24k GOLD"
        elif score >= 40:
            return "21k GOLD"
        elif score >= 25:
            return "18k GOLD"
        else:
            return "BELOW STANDARD"
    
    def analyze_file(self, file_path: Path) -> Dict:
        """Analyze content depth of a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            depth_score = self.score_content_depth(content)
            
            return {
                'file': file_path.name,
                'file_size': len(content),
                'line_count': len(content.split('\n')),
                **depth_score
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def run_analysis(self):
        """Run analysis on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"CONTENT DEPTH SCORER - Quality & Complexity Analysis")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.analyze_file(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            print(f"\n{result['file']}")
            print(f"  Score: {result['total_score']}/100")
            print(f"  Rating: {result['quality_rating']}")
            print(f"  Standard: {result['gold_standard']}")
            print(f"  Lines: {result['line_count']}")
            
            # Show breakdown
            print(f"  Breakdown:")
            for metric, value in result['breakdown'].items():
                if value != 0:
                    metric_name = metric.replace('_', ' ').title()
                    print(f"    - {metric_name}: {value}")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of analysis"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            print("No valid results to summarize")
            return
        
        total_files = len(valid_results)
        avg_score = sum(r['total_score'] for r in valid_results) / total_files
        
        print(f"Files analyzed: {total_files}")
        print(f"Average score: {round(avg_score, 2)}/100\n")
        
        # Gold standard distribution
        print("Gold Standard Distribution:")
        standards = {}
        for result in valid_results:
            std = result['gold_standard']
            standards[std] = standards.get(std, 0) + 1
        
        for std in ["30k GOLD", "27k GOLD", "24k GOLD", "21k GOLD", "18k GOLD", "BELOW STANDARD"]:
            count = standards.get(std, 0)
            if count > 0:
                print(f"  {std}: {count} files")
        
        # Files needing improvement
        print("\nFiles Below 24k Gold Standard:")
        below_standard = [r for r in valid_results if r['total_score'] < 55]
        
        if below_standard:
            for result in sorted(below_standard, key=lambda x: x['total_score'])[:10]:
                print(f"  - {result['file']}: {result['total_score']}/100 ({result['gold_standard']})")
            if len(below_standard) > 10:
                print(f"  ... and {len(below_standard) - 10} more files")
        else:
            print("  None - All files meet or exceed 24k gold standard!")
        
        # Top performers
        print("\nTop 5 Highest Quality Files:")
        top_files = sorted(valid_results, key=lambda x: x['total_score'], reverse=True)[:5]
        for result in top_files:
            print(f"  - {result['file']}: {result['total_score']}/100 ({result['gold_standard']})")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python content_depth_scorer.py <vault_directory>")
        sys.exit(1)
    
    scorer = ContentDepthScorer(sys.argv[1])
    scorer.run_analysis()
