import os
import re
import shutil
import hashlib

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"
BACKUP_DIR = os.path.join(VAULT_DIR, "BACKUP_BEFORE_TITAN_CLEAN")

# Rules for moving content between domains
# Using regex patterns for safer matching
MIGRATION_RULES = {
    "01_Frontend.md": {
        "targets": {
            "09_Mobile.md": [r"\bReact Native\b", r"\bMobile Development\b", r"\biOS\b", r"\bAndroid\b", r"\bFlutter\b"],
            "02_Backend.md": [r"\bDocker\b", r"\bKubernetes\b", r"\bSQL\b", r"\bDatabase\b"]
        }
    },
    "02_Backend.md": {
        "targets": {
            "01_Frontend.md": [r"\bReact\b", r"\bTailwind\b", r"\bFrontend\b", r"\bWindow Object\b", r"\bCSS\b"],
            "06_DevOps.md": [r"\bCI/CD\b", r"\bJenkins\b", r"\bTerraform\b"]
        }
    }
}

def backup_vault():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            shutil.copy2(os.path.join(VAULT_DIR, f), os.path.join(BACKUP_DIR, f))
    print(f"Backup created at {BACKUP_DIR}")

def parse_file(filepath):
    """Parses MD file into a list of sections: {'header': '...', 'content': '...', 'level': int}"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    sections = []
    current_section = {"header": "PREAMBLE", "content": [], "level": 0}
    
    for line in lines:
        match = re.match(r"^(#+)\s+(.*)", line)
        if match:
            # Save previous section
            sections.append(current_section)
            # Start new section
            level = len(match.group(1))
            header = match.group(2).strip()
            current_section = {"header": header, "content": [], "level": level}
        else:
            current_section["content"].append(line)
            
    sections.append(current_section) # Append last section
    return sections

def write_file(filepath, sections):
    with open(filepath, 'w', encoding='utf-8') as f:
        for sec in sections:
            if sec["header"] != "PREAMBLE":
                f.write(f"\n\n{'#' * sec['level']} {sec['header']}\n\n")
            f.write("".join(sec["content"]).strip() + "\n")

def clean_and_deduplicate(sections):
    """Merges duplicate headers and cleans content."""
    cleaned = []
    seen_headers = {} # header_text -> index in cleaned
    
    for sec in sections:
        header = sec["header"].lower().strip()
        
        # Skip empty sections or placeholders
        content_str = "".join(sec["content"]).strip()
        if not content_str or "expandable pattern" in content_str:
            continue
            
        if header in seen_headers:
            # Duplicate found! Merge content.
            existing_idx = seen_headers[header]
            existing_sec = cleaned[existing_idx]
            
            # Only append if content is significantly different (simple heuristic)
            if content_str not in "".join(existing_sec["content"]):
                existing_sec["content"].append("\n\n" + content_str)
        else:
            cleaned.append(sec)
            seen_headers[header] = len(cleaned) - 1
            
    return cleaned

def migrate_content():
    """Moves sections between files based on rules."""
    # Load all files into memory
    file_data = {}
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            file_data[f] = parse_file(os.path.join(VAULT_DIR, f))
            
    # Execute Migration
    for source_file, rules in MIGRATION_RULES.items():
        if source_file not in file_data: continue
        
        source_sections = file_data[source_file]
        kept_sections = []
        
        for sec in source_sections:
            moved = False
            for target_file, patterns in rules["targets"].items():
                # Check if header matches regex patterns
                if any(re.search(p, sec["header"], re.IGNORECASE) for p in patterns):
                    if target_file in file_data:
                        print(f"Moving '{sec['header']}' from {source_file} to {target_file}")
                        file_data[target_file].append(sec)
                        moved = True
                        break
            
            if not moved:
                kept_sections.append(sec)
                
        file_data[source_file] = kept_sections

    # Write back all files after cleaning
    for f, sections in file_data.items():
        cleaned_sections = clean_and_deduplicate(sections)
        write_file(os.path.join(VAULT_DIR, f), cleaned_sections)
        print(f"Processed {f}")

def main():
    print("Starting Titan Clean...")
    backup_vault()
    migrate_content()
    print("Titan Clean Complete.")

if __name__ == "__main__":
    main()
