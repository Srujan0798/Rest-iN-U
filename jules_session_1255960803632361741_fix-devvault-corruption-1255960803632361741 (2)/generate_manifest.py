import os
import json
import hashlib
import time

TARGET_DIR = "DevVault"
MANIFEST_FILE = "vault_manifest.json"

def calculate_checksum(filepath):
    try:
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def main():
    manifest = {
        "generated_at": time.time(),
        "root": TARGET_DIR,
        "files": {}
    }

    print(f"Generating manifest for {TARGET_DIR}...")

    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                filepath = os.path.join(root, file)
                # Store relative path for portability
                rel_path = os.path.relpath(filepath, start=".")
                
                manifest["files"][rel_path] = {
                    "checksum": calculate_checksum(filepath),
                    "size": os.path.getsize(filepath)
                }

    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"Manifest saved to {MANIFEST_FILE}")
    print(f"Indexed {len(manifest['files'])} files.")

if __name__ == "__main__":
    main()
