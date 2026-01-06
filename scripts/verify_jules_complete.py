"""
Complete Jules DevVault Verification Tool
Compares ALL files in Jules' DevVault with our current Dev Vault
"""
import os
import difflib

# Paths
JULES_ROOT = "jules_devvault/DevVault"
OUR_ROOT = "docs/Dev Vault (ETERNAL MANUAL)"
OUTPUT_REPORT = "jules_complete_verification.txt"

def find_all_md_files(root_dir):
    """Find all markdown files in directory"""
    md_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                rel_path = os.path.relpath(os.path.join(root, file), root_dir)
                md_files.append(rel_path)
    return sorted(md_files)

def compare_files(jules_file, our_file, rel_path):
    """Compare two files"""
    result = {
        'path': rel_path,
        'status': 'UNKNOWN',
        'jules_exists': os.path.exists(jules_file),
        'our_exists': os.path.exists(our_file),
        'jules_lines': 0,
        'our_lines': 0,
        'identical': False
    }
    
    if not result['jules_exists']:
        result['status'] = 'JULES_MISSING'
        return result
    
    if not result['our_exists']:
        result['status'] = 'OUR_MISSING'
        return result
    
    # Read and compare
    try:
        with open(jules_file, 'r', encoding='utf-8', errors='replace') as f:
            jules_content = f.readlines()
        with open(our_file, 'r', encoding='utf-8', errors='replace') as f:
            our_content = f.readlines()
        
        result['jules_lines'] = len(jules_content)
        result['our_lines'] = len(our_content)
        
        if jules_content == our_content:
            result['status'] = 'IDENTICAL'
            result['identical'] = True
        else:
            result['status'] = 'DIFFERENT'
            
    except Exception as e:
        result['status'] = f'ERROR: {e}'
    
    return result

def main():
    print("=" * 80)
    print("COMPLETE JULES DEVVAULT VERIFICATION")
    print("=" * 80)
    
    # Find all files in Jules' DevVault
    jules_files = find_all_md_files(JULES_ROOT)
    print(f"Found {len(jules_files)} files in Jules DevVault\n")
    
    # Compare each file
    results = []
    identical_count = 0
    different_count = 0
    our_missing_count = 0
    
    for rel_path in jules_files:
        jules_file = os.path.join(JULES_ROOT, rel_path)
        our_file = os.path.join(OUR_ROOT, rel_path)
        
        result = compare_files(jules_file, our_file, rel_path)
        results.append(result)
        
        if result['status'] == 'IDENTICAL':
            identical_count += 1
            print(f"[OK] {rel_path}")
        elif result['status'] == 'OUR_MISSING':
            our_missing_count += 1
            print(f"[MISSING] {rel_path} - We don't have this file")
        elif result['status'] == 'DIFFERENT':
            different_count += 1
            print(f"[DIFF] {rel_path} - Lines: Jules={result['jules_lines']}, Ours={result['our_lines']}")
        else:
            print(f"[{result['status']}] {rel_path}")
    
    # Generate report
    print(f"\nGenerating report: {OUTPUT_REPORT}")
    
    with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("COMPLETE JULES DEVVAULT VERIFICATION REPORT\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("SUMMARY:\n")
        f.write(f"  Total files checked: {len(results)}\n")
        f.write(f"  Identical (can be removed): {identical_count}\n")
        f.write(f"  Different (need review): {different_count}\n")
        f.write(f"  Missing in our vault: {our_missing_count}\n\n")
        
        f.write("=" * 80 + "\n")
        f.write("FILES TO REMOVE (Identical - Already Integrated)\n")
        f.write("=" * 80 + "\n")
        for r in results:
            if r['status'] == 'IDENTICAL':
                f.write(f"  {r['path']}\n")
        
        f.write("\n" + "=" * 80 + "\n")
        f.write("FILES TO REVIEW (Different Content)\n")
        f.write("=" * 80 + "\n")
        for r in results:
            if r['status'] == 'DIFFERENT':
                f.write(f"  {r['path']} - Jules: {r['jules_lines']} lines, Ours: {r['our_lines']} lines\n")
        
        f.write("\n" + "=" * 80 + "\n")
        f.write("FILES MISSING IN OUR VAULT\n")
        f.write("=" * 80 + "\n")
        for r in results:
            if r['status'] == 'OUR_MISSING':
                f.write(f"  {r['path']}\n")
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print("=" * 80)
    print(f"Identical (can be removed): {identical_count}")
    print(f"Different (need review): {different_count}")
    print(f"Missing in our vault: {our_missing_count}")
    print(f"\nDetailed report: {OUTPUT_REPORT}")
    
    return results

if __name__ == "__main__":
    results = main()
