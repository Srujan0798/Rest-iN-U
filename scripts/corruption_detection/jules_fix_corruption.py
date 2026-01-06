import os
from ftfy import fix_text

TARGET_DIR = "DevVault"

def fix_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
        
        # Decode as utf-8 (ignoring errors initially to get a string)
        # or use ftfy's fix_text which handles this gracefully usually.
        # But since we know it's utf-8 file with mojibake inside, we decode as utf-8 first.
        
        try:
            content = raw_data.decode('utf-8')
        except UnicodeDecodeError:
            # If it fails, try to decode as latin-1, then fix
            content = raw_data.decode('latin-1')

        fixed_content = fix_text(content)
        
        # Check if it actually changed
        if content != fixed_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            return True, "Fixed encoding"
        
        return False, "No changes needed"

    except Exception as e:
        return False, f"Error: {e}"

def main():
    count_fixed = 0
    count_error = 0
    count_clean = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                filepath = os.path.join(root, file)
                print(f"Processing {filepath}...", end=" ")
                changed, msg = fix_file(filepath)
                print(f"[{'FIXED' if changed else 'OK'}] {msg}")
                
                if changed:
                    count_fixed += 1
                elif "Error" in msg:
                    count_error += 1
                else:
                    count_clean += 1

    print(f"\nSummary: {count_fixed} fixed, {count_clean} clean, {count_error} errors.")

if __name__ == "__main__":
    main()
