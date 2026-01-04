import os
import re

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

FIXES = {
    "09_Mobile.md": [
        (r"\[Runtime& rt, const Value& thisVal, const Value\* args, size_t count\]", "`Runtime& rt, const Value& thisVal, const Value* args, size_t count`"),
        # Fallback for partial matches if the above is too specific due to whitespace
        (r"\[Runtime& rt", "`Runtime& rt") 
    ],
    "14_Blockchain.md": [
        (r"\[2\]", "`[2]`"), 
        (r"\[users.length\]", "`users.length`")
    ],
    "15_IoT.md": [
        (r"\[TimerHandle_t\]", "`TimerHandle_t`")
    ]
}

def fix_links():
    print("Fixing False Positive Links...")
    
    for filename, replacements in FIXES.items():
        filepath = os.path.join(VAULT_DIR, filename)
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        original_content = content
        for pattern, replacement in replacements:
            # Use regex substitution
            content = re.sub(pattern, replacement, content)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed links in {filename}")
        else:
            print(f"No changes needed for {filename}")

if __name__ == "__main__":
    fix_links()
