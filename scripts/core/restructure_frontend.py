#!/usr/bin/env python3
import sys

def restructure_frontend(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find markers
    vol_11_start = -1
    vol_1_8_end = -1
    hidden_content_start = -1
    end_of_file_marker = -1
    
    for i, line in enumerate(lines):
        if "## VOLUME 11: TITAN CATALOG" in line: vol_11_start = i
        if "#### END OF VOLUME 1.8:" in line: vol_1_8_end = i
        if "## END OF 01_FRONTEND.MD" in line: end_of_file_marker = i
        if "## Source: Headless UI" in line: hidden_content_start = i

    print(f"Markers found: V11={vol_11_start}, V1.8_End={vol_1_8_end}, EOF={end_of_file_marker}, Hidden={hidden_content_start}")
    
    if any(x == -1 for x in [vol_11_start, vol_1_8_end, end_of_file_marker, hidden_content_start]):
        print("Error: Could not find all markers.")
        return

    # Define Blocks
    
    # Block 1: Titan Catalog + Internals (Volume 9 & 10)
    # From Vol 11 start to Vol 1.8 end (inclusive of the end line? No, we remove the end line)
    # Actually, let's take up to the line AFTER Vol 1.8 end to be safe, or just cut at the marker.
    # The marker is "#### END OF VOLUME 1.8...". We want to remove it.
    block_catalog = lines[vol_11_start:vol_1_8_end]
    
    # Block 2: Hidden Content (Volume 8)
    # From Hidden Start to the actual end of file
    block_hidden = lines[hidden_content_start:]
    
    # Clean Blocks
    def clean_block(block, new_title):
        new_block = []
        new_block.append(f"## {new_title}\n")
        # Skip the first line if it was the old header
        new_block.extend(block[1:])
        return new_block

    # We need to split Block 1 into Catalog (Vol 9) and Internals (Vol 10)
    # Where does Internals start?
    # It seems "Titan Deep Internals" starts somewhere inside.
    # Let's look for "TITAN DEEP INTERNALS" or similar.
    # If we can't find it easily, we can keep them together as Volume 9 for now, or just append them.
    # But the plan said Vol 9 and 10.
    
    # Let's just append the whole Catalog block as Volume 9 for now, and the Hidden block as Volume 8.
    # Wait, Volume 8 should come BEFORE Volume 9?
    # Plan:
    # Vol 8: UI Patterns (Hidden Content)
    # Vol 9: Titan Catalog (The moved block)
    
    block_hidden = clean_block(block_hidden, "VOLUME 8: UI PATTERNS & COMPONENT LIBRARY")
    block_catalog = clean_block(block_catalog, "VOLUME 9: TITAN CATALOG & INTERNALS")

    # Construct New File
    new_lines = []
    
    # 1. Start to Vol 11 Start
    new_lines.extend(lines[:vol_11_start])
    
    # 2. Skip the Catalog Block (Vol 11 start to Vol 1.8 end)
    # We also need to skip the "END OF VOLUME 1.8" line itself.
    # And maybe some lines after it until the next section?
    # The next section after 1.8 end is "#### The Scar" (Line 23628).
    # Wait, "The Scar" is part of what?
    # It seems the file continues after 1.8 end.
    # Let's assume we cut from Vol 11 Start to Vol 1.8 End.
    # And we append the rest of the file until the EOF marker.
    
    # 3. From Vol 1.8 End (plus 1) to EOF Marker
    new_lines.extend(lines[vol_1_8_end+1:end_of_file_marker])
    
    # 4. Append Volume 8 (Hidden Content)
    new_lines.extend(["\n"])
    new_lines.extend(block_hidden)
    
    # 5. Append Volume 9 (Catalog)
    new_lines.extend(["\n"])
    new_lines.extend(block_catalog)
    
    # Filter out "END OF..." lines from the whole file
    final_lines = []
    for line in new_lines:
        if "END OF VOLUME" not in line and "END OF 01_FRONTEND" not in line and "END OF MODAL" not in line:
            final_lines.append(line)
            
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)

    print("Restructuring complete.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python restructure_frontend.py <file>")
        sys.exit(1)
    restructure_frontend(sys.argv[1])
