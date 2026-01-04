import os

TARGET_FILE = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\01_Frontend.md"

def analyze_duplicates():
    with open(TARGET_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    headers = {}
    
    current_header = None
    current_content = []
    
    for line in lines:
        if line.startswith("#"):
            if current_header:
                if current_header not in headers:
                    headers[current_header] = []
                headers[current_header].append("".join(current_content))
            
            current_header = line.strip()
            current_content = []
        else:
            current_content.append(line)
            
    # Capture last section
    if current_header:
        if current_header not in headers:
            headers[current_header] = []
        headers[current_header].append("".join(current_content))

    # Report
    with open("DUPLICATE_CONTENT_REPORT.txt", "w", encoding="utf-8") as f:
        for h, contents in headers.items():
            if len(contents) > 1:
                f.write(f"HEADER: {h}\n")
                f.write(f"COUNT: {len(contents)}\n")
                
                # Compare contents
                unique_contents = set(contents)
                if len(unique_contents) == 1:
                    f.write("STATUS: IDENTICAL CONTENT (Safe to delete duplicates)\n")
                else:
                    f.write("STATUS: DIFFERENT CONTENT (Manual review needed)\n")
                    for i, c in enumerate(contents):
                        f.write(f"--- VARIANT {i+1} ---\n")
                        f.write(c[:200].replace("\n", " ") + "...\n")
                f.write("="*50 + "\n")

if __name__ == "__main__":
    analyze_duplicates()
