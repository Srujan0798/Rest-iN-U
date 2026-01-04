import sys
import os

def remove_bom(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
        
        if content.startswith(b'\xef\xbb\xbf'):
            print(f"BOM found in {file_path}. Removing...")
            content = content[3:]
            with open(file_path, 'wb') as f:
                f.write(content)
            print("BOM removed successfully.")
        else:
            print(f"No BOM found in {file_path}.")
            
    except Exception as e:
        print(f"Error removing BOM: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python remove_bom.py <file_path>")
        sys.exit(1)
    
    remove_bom(sys.argv[1])
