#!/usr/bin/env python3
"""
CORRUPTION HUNTER - Finds ALL types of corruption in files
"""
import re
import sys
from pathlib import Path

def hunt_corruption(file_path: Path) -> dict:
    """Find all types of corruption."""
    issues = {
        'bom': [],
        'invalid_unicode': [],
        'null_bytes': [],
        'replacement_chars': [],
        'control_chars': [],
        'mixed_encodings': []
    }
    
    try:
        with open(file_path, 'rb') as f:
            raw_bytes = f.read()
        
        # Check for BOM
        if raw_bytes.startswith(b'\xef\xbb\xbf'):
            issues['bom'].append('UTF-8 BOM at start')
        
        # Try to decode
        try:
            text = raw_bytes.decode('utf-8')
        except UnicodeDecodeError as e:
            issues['mixed_encodings'].append(f'Decode error at byte {e.start}')
            text = raw_bytes.decode('utf-8', errors='replace')
        
        # Check each line
        lines = text.split('\n')
        for i, line in enumerate(lines, 1):
            # BOM in middle
            if '\ufeff' in line:
                issues['bom'].append(f'Line {i}: BOM character')
            
            # Replacement character
            if '�' in line:
                issues['replacement_chars'].append(f'Line {i}: Replacement character')
            
            # Null bytes
            if '\x00' in line:
                issues['null_bytes'].append(f'Line {i}: Null byte')
            
            # Control characters (except common ones)
            for char in line:
                if ord(char) < 32 and char not in '\t\r\n':
                    issues['control_chars'].append(f'Line {i}: Control char {ord(char)}')
                    break
    
    except Exception as e:
        issues['mixed_encodings'].append(f'Error reading file: {e}')
    
    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: python corruption_hunter.py <file_or_directory>")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        files = [path]
    else:
        files = list(path.rglob('*.md'))
    
    print(f"CORRUPTION HUNTER")
    print(f"{'='*80}\n")
    
    total_issues = 0
    
    for file_path in files:
        issues = hunt_corruption(file_path)
        
        file_total = sum(len(v) for v in issues.values())
        
        if file_total > 0:
            print(f"\n[CORRUPTION] {file_path.name}")
            for issue_type, issue_list in issues.items():
                if issue_list:
                    print(f"  {issue_type.upper()}:")
                    for issue in issue_list[:5]:  # Show first 5
                        print(f"    - {issue}")
                    if len(issue_list) > 5:
                        print(f"    ... and {len(issue_list) - 5} more")
            total_issues += file_total
    
    print(f"\n{'='*80}")
    print(f"Total corruption issues: {total_issues}")
    
    if total_issues > 0:
        sys.exit(1)
    else:
        print("[SUCCESS] No corruption found!")
        sys.exit(0)

if __name__ == '__main__':
    main()
