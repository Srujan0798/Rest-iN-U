#!/usr/bin/env python3
import sys
import re

def restructure_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Define the blocks to move (Start Line, End Line, Target Header Regex)
    # Note: Line numbers are 0-indexed
    
    # We need to find the dynamic line numbers because edits might shift them
    # But since we are reading the file once, we can find them now.
    
    # 1. Find the start/end of blocks
    vol_7_1_start = -1
    vol_7_2_start = -1
    vol_8_1_start = -1
    vol_5_4_start = -1
    
    # Find targets
    vol_5_target = -1
    vol_7_target = -1
    vol_8_target = -1
    
    for i, line in enumerate(lines):
        if "## VOLUME 7: .1:" in line: vol_7_1_start = i
        if "## VOLUME 7: .2:" in line: vol_7_2_start = i
        if "## VOLUME 8: .1:" in line: vol_8_1_start = i
        if "## VOLUME 5.4:" in line: vol_5_4_start = i
        
        if "## VOLUME 5: THE TITAN" in line: vol_5_target = i
        if "## VOLUME 7: PRODUCTION INCIDENT" in line: vol_7_target = i
        if "## VOLUME 8: ADVANCED API" in line: vol_8_target = i

    # Define End lines
    # Vol 7.1 ends at Vol 7.2 start
    vol_7_1_end = vol_7_2_start
    # Vol 7.2 ends at Vol 15 marker (which is before Vol 8.1)
    # Let's find "END OF VOLUME 15"
    vol_15_end_marker = -1
    for i, line in enumerate(lines):
        if "## END OF VOLUME 15" in line: vol_15_end_marker = i
    vol_7_2_end = vol_15_end_marker if vol_15_end_marker != -1 else vol_8_1_start
    
    # Vol 8.1 ends at Vol 5.4 start (roughly)
    # Actually there is "END OF VOLUME 7.3" and "END OF VOLUME 5.1" in between
    # Let's assume Vol 8.1 ends at Vol 5.4 start for simplicity, or find the next marker
    vol_8_1_end = vol_5_4_start
    
    # Vol 5.4 goes to end of file
    vol_5_4_end = len(lines)

    print(f"Blocks found:")
    print(f"Vol 7.1: {vol_7_1_start}-{vol_7_1_end}")
    print(f"Vol 7.2: {vol_7_2_start}-{vol_7_2_end}")
    print(f"Vol 8.1: {vol_8_1_start}-{vol_8_1_end}")
    print(f"Vol 5.4: {vol_5_4_start}-{vol_5_4_end}")
    print(f"Targets: V5={vol_5_target}, V7={vol_7_target}, V8={vol_8_target}")

    if any(x == -1 for x in [vol_7_1_start, vol_7_2_start, vol_8_1_start, vol_5_4_start, vol_5_target, vol_7_target, vol_8_target]):
        print("Error: Could not find all blocks or targets.")
        return

    # Extract content
    # We extract in reverse order of position in file to avoid index shifting issues when cutting?
    # No, we just slice the list.
    
    block_7_1 = lines[vol_7_1_start:vol_7_1_end]
    block_7_2 = lines[vol_7_2_start:vol_7_2_end]
    block_8_1 = lines[vol_8_1_start:vol_8_1_end]
    block_5_4 = lines[vol_5_4_start:vol_5_4_end]
    
    # Modify headers in blocks (Demote H2 to H3, remove "VOLUME X.Y")
    def clean_block(block, new_title):
        new_block = []
        # First line is the header
        header = block[0]
        # Replace header with new title
        new_block.append(f"### {new_title}\n")
        # Add the rest
        new_block.extend(block[1:])
        return new_block

    block_7_1 = clean_block(block_7_1, "Production Incidents (Extended)")
    block_7_2 = clean_block(block_7_2, "Backend Production Disasters (Real Incidents)")
    block_8_1 = clean_block(block_8_1, "Advanced Backend Patterns (Stack Overflow)")
    block_5_4 = clean_block(block_5_4, "Titan Catalog - 50 Backend Failure Scenarios")

    # Construct new file content
    # We need to be careful about overlapping ranges if we just cut.
    # The blocks are at the end, targets are at the top.
    # So we can construct the top part with insertions, and ignore the bottom part.
    
    # The "Bottom Part" starts at vol_7_1_start.
    # Everything before that is "Top Part".
    # But wait, Vol 5.4 is after Vol 8.1.
    # So the "Cut Point" is vol_7_1_start.
    
    # Let's build the new lines list
    new_lines = []
    
    # 0 to Vol 5 Target
    # We want to insert AFTER the Volume 5 section.
    # Volume 5 starts at vol_5_target.
    # Where does it end? At Vol 6 start.
    vol_6_start = -1
    for i, line in enumerate(lines):
        if "## VOLUME 6: THE INFINITE" in line: vol_6_start = i
    
    # Insert Vol 5.4 before Vol 6
    new_lines.extend(lines[:vol_6_start])
    new_lines.extend(["\n"])
    new_lines.extend(block_5_4)
    new_lines.extend(["\n"])
    
    # Continue from Vol 6 to Vol 7 Target
    # Vol 7 ends at Vol 8 start
    # Insert Vol 7.1 and 7.2 before Vol 8
    new_lines.extend(lines[vol_6_start:vol_8_target])
    new_lines.extend(["\n"])
    new_lines.extend(block_7_1)
    new_lines.extend(["\n"])
    new_lines.extend(block_7_2)
    new_lines.extend(["\n"])
    
    # Continue from Vol 8 to Vol 9 start
    vol_9_start = -1
    for i, line in enumerate(lines):
        if "## VOLUME 9: EVENT-DRIVEN" in line: vol_9_start = i
        
    new_lines.extend(lines[vol_8_target:vol_9_start])
    new_lines.extend(["\n"])
    new_lines.extend(block_8_1)
    new_lines.extend(["\n"])
    
    # Continue from Vol 9 to the Cut Point (vol_7_1_start)
    new_lines.extend(lines[vol_9_start:vol_7_1_start])
    
    # The rest of the file (after vol_7_1_start) contained the blocks we moved.
    # We should ignore them.
    # But wait, are there gaps between the blocks?
    # 7.1 to 7.2: Continuous
    # 7.2 to 8.1: There is "END OF VOLUME 15" marker. We skip it.
    # 8.1 to 5.4: There are "END OF VOLUME 7.3" etc. We skip them.
    # 5.4 to End: We moved 5.4.
    
    # So we are done?
    # What about content *between* 8.1 and 5.4?
    # 12148 to 12325.
    # 12148: END OF VOLUME 7.3
    # 12233: END OF VOLUME 5.1
    # 12245: ? TRAP: Synchronous in async def
    # This looks like content!
    # "TRAP: Synchronous in async def" seems to belong to "Titan Python Backend Traps" (Vol 5.2?)
    
    # If we skip this, we lose content.
    # We should append any "Orphaned" content to the end of the file or a "Lost & Found" section.
    
    # Let's check what's between 8.1 end and 5.4 start.
    orphan_start = vol_8_1_end
    orphan_end = vol_5_4_start
    orphan_block = lines[orphan_start:orphan_end]
    
    # If it has content, append it to Volume 13 (Additional Patterns) or Volume 5?
    # "Titan Python Backend Traps" sounds like Volume 5.
    # Let's append it to Volume 5 as well.
    
    if len(orphan_block) > 10: # If significant content
         new_lines.extend(["\n### Additional Titan Internals\n"])
         new_lines.extend(orphan_block)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Restructuring complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python restructure_backend.py <file>")
        sys.exit(1)
    restructure_file(sys.argv[1])
