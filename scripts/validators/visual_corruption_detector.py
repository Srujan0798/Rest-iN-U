#!/usr/bin/env python3
"""
VISUAL CORRUPTION DETECTOR - Finds visually corrupted content
"""
import re
import sys
from pathlib import Path

def detect_visual_corruption(file_path: Path) -> list:
    """Detect visual corruption issues."""
    issues = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines, 1):
        # Check for weird spacing/indentation issues
        if line.startswith(' ' * 10):  # Excessive indentation
            issues.append(f"Line {i}: Excessive indentation ({len(line) - len(line.lstrip())} spaces)")
        
        # Check for mixed tabs and spaces
        if '\t' in line and ' ' in line:
            issues.append(f"Line {i}: Mixed tabs and spaces")
        
        # Check for unusual whitespace patterns
        if re.search(r'  {5,}', line):  # 5+ consecutive spaces
            issues.append(f"Line {i}: Unusual spacing pattern")
        
        # Check for broken formatting
        if re.search(r'[A-Z]{20,}', line):  # 20+ consecutive caps
            issues.append(f"Line {i}: Unusual all-caps text")
        
        # Check for malformed lists
        if re.match(r'^\s*[-*+]\s*$', line):  # Empty list item
            issues.append(f"Line {i}: Empty list item")
        
        # Check for broken headers
        if re.match(r'^#{7,}', line):  # More than 6 #
            issues.append(f"Line {i}: Invalid header level")
        
        # Check for orphaned formatting
        if line.count('**') % 2 != 0:
            issues.append(f"Line {i}: Unclosed bold formatting")
        if line.count('*') % 2 != 0 and '**' not in line:
            issues.append(f"Line {i}: Unclosed italic formatting")
    
    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: python visual_corruption_detector.py <file>")
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    
    print(f"VISUAL CORRUPTION DETECTOR")
    print(f"{'='*80}\n")
    print(f"Checking: {file_path.name}\n")
    
    issues = detect_visual_corruption(file_path)
    
    if issues:
        print(f"Found {len(issues)} visual issues:\n")
        for issue in issues[:20]:  # Show first 20
            print(f"  - {issue}")
        if len(issues) > 20:
            print(f"\n  ... and {len(issues) - 20} more")
    else:
        print("[SUCCESS] No visual corruption found!")
    
    print(f"\n{'='*80}")

if __name__ == '__main__':
    main()
