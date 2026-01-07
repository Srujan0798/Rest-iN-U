"""
BRAIN Files Comparison Tool
Compares Jules' DevVault BRAIN files with our current BRAIN files
Reusable script for ongoing file comparison and analysis
"""
import os
import difflib
from pathlib import Path

# Paths
JULES_BRAIN = "jules_devvault/DevVault/BRAIN"
OUR_BRAIN = "Doxs/Dev Vault (ETERNAL MANUAL)/BRAIN"
OUTPUT_REPORT = "brain_comparison_report.txt"

def compare_files(jules_file, our_file, filename):
    """Compare two files and return detailed analysis"""
    result = {
        'filename': filename,
        'status': 'UNKNOWN',
        'jules_lines': 0,
        'our_lines': 0,
        'line_diff': 0,
        'differences': []
    }
    
    # Check if files exist
    if not os.path.exists(jules_file):
        result['status'] = 'JULES_MISSING'
        return result
    if not os.path.exists(our_file):
        result['status'] = 'OUR_MISSING'
        return result
    
    # Read files
    try:
        with open(jules_file, 'r', encoding='utf-8', errors='replace') as f:
            jules_content = f.readlines()
        with open(our_file, 'r', encoding='utf-8', errors='replace') as f:
            our_content = f.readlines()
    except Exception as e:
        result['status'] = f'ERROR: {e}'
        return result
    
    # Count lines
    result['jules_lines'] = len(jules_content)
    result['our_lines'] = len(our_content)
    result['line_diff'] = result['our_lines'] - result['jules_lines']
    
    # Check if identical
    if jules_content == our_content:
        result['status'] = 'IDENTICAL'
        return result
    
    # Generate diff
    diff = list(difflib.unified_diff(
        jules_content,
        our_content,
        fromfile=f"Jules: {filename}",
        tofile=f"Ours: {filename}",
        lineterm=''
    ))
    
    # Analyze differences
    if diff:
        result['differences'] = diff
        # Check if only encoding differences (emojis, box-drawing)
        content_changes = [line for line in diff if line.startswith('+') or line.startswith('-')]
        if len(content_changes) < 50:  # Small number of changes likely encoding
            result['status'] = 'ENCODING_ONLY'
        else:
            result['status'] = 'CONTENT_DIFFERENT'
    else:
        result['status'] = 'IDENTICAL'
    
    return result

def generate_report(results):
    """Generate comprehensive comparison report"""
    report_lines = []
    report_lines.append("=" * 80)
    report_lines.append("BRAIN FILES COMPARISON REPORT")
    report_lines.append("=" * 80)
    report_lines.append(f"Jules BRAIN: {JULES_BRAIN}")
    report_lines.append(f"Our BRAIN: {OUR_BRAIN}")
    report_lines.append("")
    
    # Summary
    identical = sum(1 for r in results if r['status'] == 'IDENTICAL')
    encoding_only = sum(1 for r in results if r['status'] == 'ENCODING_ONLY')
    content_diff = sum(1 for r in results if r['status'] == 'CONTENT_DIFFERENT')
    missing = sum(1 for r in results if 'MISSING' in r['status'])
    
    report_lines.append("SUMMARY:")
    report_lines.append(f"  Identical: {identical}")
    report_lines.append(f"  Encoding Only: {encoding_only}")
    report_lines.append(f"  Content Different: {content_diff}")
    report_lines.append(f"  Missing Files: {missing}")
    report_lines.append("")
    report_lines.append("=" * 80)
    report_lines.append("DETAILED ANALYSIS")
    report_lines.append("=" * 80)
    
    # Detailed results
    for result in results:
        report_lines.append("")
        report_lines.append(f"FILE: {result['filename']}")
        report_lines.append(f"Status: {result['status']}")
        report_lines.append(f"Jules lines: {result['jules_lines']}")
        report_lines.append(f"Our lines: {result['our_lines']}")
        report_lines.append(f"Difference: {result['line_diff']} lines")
        
        if result['status'] == 'CONTENT_DIFFERENT':
            report_lines.append(f"Total changes: {len(result['differences'])} diff lines")
            report_lines.append("First 20 differences:")
            for line in result['differences'][:20]:
                report_lines.append(f"  {line}")
        
        report_lines.append("-" * 80)
    
    return '\n'.join(report_lines)

def main():
    print("=" * 80)
    print("BRAIN FILES COMPARISON TOOL")
    print("=" * 80)
    
    # Find all BRAIN files
    brain_files = []
    if os.path.exists(JULES_BRAIN):
        for file in os.listdir(JULES_BRAIN):
            if file.endswith('.md'):
                brain_files.append(file)
    
    if not brain_files:
        print(f"[ERROR] No files found in {JULES_BRAIN}")
        return
    
    print(f"Found {len(brain_files)} BRAIN files to compare\n")
    
    # Compare each file
    results = []
    for filename in sorted(brain_files):
        jules_file = os.path.join(JULES_BRAIN, filename)
        our_file = os.path.join(OUR_BRAIN, filename)
        
        print(f"Comparing: {filename}...", end=" ")
        result = compare_files(jules_file, our_file, filename)
        results.append(result)
        print(f"[{result['status']}]")
    
    # Generate report
    print(f"\nGenerating report: {OUTPUT_REPORT}")
    report = generate_report(results)
    
    with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print("=" * 80)
    identical = sum(1 for r in results if r['status'] == 'IDENTICAL')
    encoding_only = sum(1 for r in results if r['status'] == 'ENCODING_ONLY')
    content_diff = sum(1 for r in results if r['status'] == 'CONTENT_DIFFERENT')
    
    print(f"Identical: {identical}")
    print(f"Encoding Only: {encoding_only}")
    print(f"Content Different: {content_diff}")
    print(f"\nDetailed report saved to: {OUTPUT_REPORT}")

if __name__ == "__main__":
    main()
