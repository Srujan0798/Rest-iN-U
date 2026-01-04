import sys

def purge_lines(file_path, start_line, end_line):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Convert to 0-indexed
    start_idx = int(start_line) - 1
    end_idx = int(end_line)

    # Keep lines before start and after end
    new_lines = lines[:start_idx] + lines[end_idx:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Purged lines {start_line} to {end_line} in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 3:
        purge_lines(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        print("Usage: python purge_lines.py <file_path> <start_line> <end_line>")
