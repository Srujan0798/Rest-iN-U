import os
import re
import urllib.parse

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def validate_links():
    print("Starting Link Validation...")
    broken_links = []
    checked_count = 0
    
    # Walk through all files
    for root, dirs, files in os.walk(VAULT_DIR):
        for file in files:
            if not file.endswith(".md"):
                continue
                
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Remove code blocks to avoid false positives
            # Remove ```...``` blocks (dotall)
            content_no_code = re.sub(r"```.*?```", "", content, flags=re.DOTALL)
            # Remove inline code `...`
            content_no_code = re.sub(r"`.*?`", "", content_no_code)
            
            # Find all markdown links: [text](url)
            links = re.findall(r"\[.*?\]\((.*?)\)", content_no_code)
            
            for link in links:
                # Skip external links, anchors, and absolute paths
                if link.startswith("http") or link.startswith("#") or link.startswith("mailto:"):
                    continue
                
                # Ignore common code patterns mistaken for links
                # e.g. new address[](2) -> link url is "2"
                if link.isdigit(): 
                    continue
                if "length" in link or "address" in link or "uint" in link:
                    continue
                
                # Handle relative paths
                # Remove anchors from link (e.g. ./file.md#section)
                link_path = link.split("#")[0]
                
                if not link_path:
                    continue
                    
                # Resolve path
                # If it starts with /, it's relative to root (rare in MD, usually relative to file)
                # We assume relative to current file
                
                target_path = os.path.normpath(os.path.join(root, link_path))
                
                if not os.path.exists(target_path):
                    broken_links.append({
                        "source": os.path.relpath(filepath, VAULT_DIR),
                        "target": link,
                        "resolved": target_path
                    })
                
                checked_count += 1

    # Report
    if broken_links:
        print(f"Found {len(broken_links)} broken links!")
        with open("BROKEN_LINKS_REPORT.txt", "w", encoding="utf-8") as f:
            for error in broken_links:
                f.write(f"SOURCE: {error['source']}\n")
                f.write(f"  LINK: {error['target']}\n")
                f.write(f"  MISSING: {error['resolved']}\n")
                f.write("-" * 40 + "\n")
        print("Report written to BROKEN_LINKS_REPORT.txt")
    else:
        print(f"Success! Checked {checked_count} links. No broken links found.")

if __name__ == "__main__":
    validate_links()
