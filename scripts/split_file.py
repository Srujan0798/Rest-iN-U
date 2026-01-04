import os

source_file = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\02_Backend.md"
part1_file = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\02_Backend_Part1.md"
part2_file = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\02_Backend_Part2.md"

def split_file():
    if not os.path.exists(source_file):
        print(f"Error: Source file not found: {source_file}")
        return

    file_size = os.path.getsize(source_file)
    print(f"Original File Size: {file_size / (1024*1024):.2f} MB")

    # Target split point: roughly half way, but at a clean header
    target_split_byte = file_size // 2
    
    with open(source_file, 'rb') as f:
        content = f.read()
    
    # Find a good split point (e.g., a header "## " or "### ") near the middle
    # We search forward from the middle
    split_index = -1
    
    # Look for a Level 2 header "## " to split cleanly
    search_start = target_split_byte
    # Try to find "\n## "
    split_index = content.find(b'\n## ', search_start)
    
    if split_index == -1:
        print("Could not find a clean '## ' header to split at. Trying '### '...")
        split_index = content.find(b'\n### ', search_start)
        
    if split_index == -1:
        print("Could not find a clean header. Splitting at nearest newline.")
        split_index = content.find(b'\n', search_start)

    if split_index == -1:
        print("Error: Could not find a newline to split at.")
        return

    # The split index is at the newline character before the header.
    # Part 1 goes up to split_index (inclusive of newline)
    # Part 2 starts after split_index
    
    part1_content = content[:split_index+1]
    part2_content = content[split_index+1:]
    
    # Add a note to the end of Part 1 and start of Part 2
    part1_content += b"\n\n> **CONTINUED IN PART 2...**\n"
    part2_content = b"# 02_BACKEND.MD (PART 2)\n\n> **CONTINUED FROM PART 1...**\n\n" + part2_content

    with open(part1_file, 'wb') as f1:
        f1.write(part1_content)
        
    with open(part2_file, 'wb') as f2:
        f2.write(part2_content)
        
    print(f"Successfully split file.")
    print(f"Part 1: {os.path.getsize(part1_file) / (1024*1024):.2f} MB")
    print(f"Part 2: {os.path.getsize(part2_file) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    split_file()
