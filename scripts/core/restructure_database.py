#!/usr/bin/env python3
import sys

def restructure_database(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Define blocks based on analysis
    # Vol 1.4 starts at "END OF VOLUME 1.4" line? No, that header IS the start of the section.
    # Wait, the header says "END OF VOLUME 1.4: TITAN GEMINI RESEARCH..."
    # This is confusing naming. It seems to mean "Here is the content for Volume 1.4".
    # Let's assume the content starts AT that line.
    
    vol_1_4_start = -1
    vol_2_start = -1
    vol_3_start = -1
    vol_5_start = -1
    
    for i, line in enumerate(lines):
        if "## END OF VOLUME 1.4:" in line: vol_1_4_start = i
        if "## END OF VOLUME 2:" in line: vol_2_start = i
        if "## END OF VOLUME 3:" in line: vol_3_start = i
        if "## VOLUME 5: THE TITAN" in line: vol_5_start = i

    print(f"Found markers: V1.4={vol_1_4_start}, V2={vol_2_start}, V3={vol_3_start}, V5={vol_5_start}")
    
    if any(x == -1 for x in [vol_1_4_start, vol_2_start, vol_3_start, vol_5_start]):
        print("Error: Could not find all markers.")
        return

    # Define ranges
    # Vol 1.4 is from start to Vol 2 start
    block_1_4 = lines[vol_1_4_start:vol_2_start]
    
    # Vol 2 is from start to Vol 3 start
    block_2 = lines[vol_2_start:vol_3_start]
    
    # Vol 3 is from start to Vol 5 start
    # Wait, Vol 5 is at 8806. Vol 3 starts at 7102.
    # Is there anything between Vol 3 end and Vol 5 start?
    # Let's check the end of Vol 3.
    # It seems Vol 3 goes all the way to Vol 5.
    block_3 = lines[vol_3_start:vol_5_start]
    
    # Clean headers
    def clean_block(block, new_title):
        new_block = []
        new_block.append(f"## {new_title}\n")
        new_block.extend(block[1:])
        return new_block

    block_1_4 = clean_block(block_1_4, "VOLUME 6: DATABASE PRODUCTION FAILURES")
    block_2 = clean_block(block_2, "VOLUME 7: PRODUCTION DATABASE OPERATIONS")
    block_3 = clean_block(block_3, "VOLUME 8: DATABASE REPLICATION PATTERNS")

    # Construct new file
    new_lines = []
    
    # 1. Everything before Vol 1.4
    new_lines.extend(lines[:vol_1_4_start])
    
    # 2. Volume 5 and onwards (The end of the file)
    # Wait, Vol 5 is AFTER Vol 3.
    # So the file looks like: [Start ... V1.4 ... V2 ... V3 ... V5 ... End]
    # We want: [Start ... V5 ... End ... V6 ... V7 ... V8]
    
    # So we take [Start ... V1.4_start]
    # Then we skip [V1.4 ... V5_start]
    # Then we take [V5_start ... End]
    # Then we append [V6, V7, V8]
    
    new_lines.extend(lines[vol_5_start:])
    new_lines.extend(["\n"])
    new_lines.extend(block_1_4)
    new_lines.extend(["\n"])
    new_lines.extend(block_2)
    new_lines.extend(["\n"])
    new_lines.extend(block_3)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print("Restructuring complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python restructure_database.py <file>")
        sys.exit(1)
    restructure_database(sys.argv[1])
