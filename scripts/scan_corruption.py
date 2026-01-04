import os

filepath = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\01_Frontend.md"

def scan_file():
    if not os.path.exists(filepath):
        print("File not found.")
        return

    print(f"Scanning {filepath} for non-ascii bytes...")
    with open(filepath, 'rb') as f:
        content = f.read()
        
    found_count = 0
    for i, byte in enumerate(content):
        if byte > 127: # Non-ASCII
            # Check if it's a common UTF-8 start byte
            # \xc3 is common for Latin-1 chars in UTF-8 (Ã)
            if byte == 0xc3:
                # Print context
                start = max(0, i - 20)
                end = min(len(content), i + 20)
                context = content[start:end]
                print(f"Offset {i}: Found byte {hex(byte)}")
                print(f"Context: {context}")
                found_count += 1
                if found_count > 10:
                    print("... (stopping after 10 matches)")
                    break
    
    if found_count == 0:
        print("No suspicious \\xc3 bytes found.")

if __name__ == "__main__":
    scan_file()
