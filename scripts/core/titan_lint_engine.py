import os
import re
import json

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

# Error Codes
MD001 = "MD001 (Header Increment)"
MD012 = "MD012 (Multiple Blanks)"
MD025 = "MD025 (Multiple H1)"
MD040 = "MD040 (Missing Language)"
MD060 = "MD060 (Table Formatting)"

def check_file(filepath):
    errors = []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    # State tracking
    h1_count = 0
    last_header_level = 0
    in_code_block = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        stripped = line.strip()
        
        # MD012: Multiple consecutive blank lines
        if i > 0 and not stripped and not lines[i-1].strip():
            # Check if it's the 3rd blank line (allow 1 blank line, so 2 consecutive is empty, empty. 
            # Actually MD012 usually means NO consecutive blank lines (max 1).
            # So if current is empty and prev is empty -> Error.
            errors.append({"line": line_num, "code": MD012, "msg": "Multiple consecutive blank lines"})

        # Headers (Ignore inside code blocks)
        if stripped.startswith("#") and not in_code_block:
            level = len(stripped.split()[0])
            
            # MD025: Multiple H1
            if level == 1:
                h1_count += 1
                if h1_count > 1:
                    errors.append({"line": line_num, "code": MD025, "msg": "Multiple top-level H1 headers"})
            
            # MD001: Heading increment (e.g. H2 -> H4)
            if level > last_header_level + 1 and last_header_level > 0:
                 errors.append({"line": line_num, "code": MD001, "msg": f"Heading level jump: H{last_header_level} -> H{level}"})
            
            last_header_level = level

        # Code Blocks
        if stripped.startswith("```"):
            if not in_code_block:
                # Start of block
                in_code_block = True
                lang = stripped.replace("```", "").strip()
                # MD040: Missing language
                if not lang:
                    errors.append({"line": line_num, "code": MD040, "msg": "Fenced code block missing language"})
            else:
                # End of block
                in_code_block = False

        # MD009: Trailing spaces
        if line.endswith(" \n") or line.endswith("\t\n"):
             errors.append({"line": line_num, "code": "MD009 (Trailing Spaces)", "msg": "Line has trailing spaces"})

        # MD004: List style (Standardize to dash -)
        if stripped.startswith("* "):
            errors.append({"line": line_num, "code": "MD004 (List Style)", "msg": "Unordered list uses asterisk (*), expected dash (-)"})

        # Tables (Simple check for pipe alignment)
        # If line contains | and is not code, check for spacing
        if "|" in line and not in_code_block and len(line) > 5:
            # Heuristic: if it looks like a table row
            if re.match(r"^\s*\|.*\|\s*$", line):
                # Check for missing spaces around pipes (MD060 style)
                # This is complex to regex perfectly, but we can check for `|text` or `text|` without space
                # We'll just flag it for review if it looks "tight"
                # Exclude newlines from the "tight" check to avoid flagging end-of-line pipes
                if re.search(r"\|[^ \-\|\r\n]", line) or re.search(r"[^ \-\|]\|", line):
                     errors.append({"line": line_num, "code": MD060, "msg": "Table pipe missing spacing"})

    return errors

def main():
    print("Starting Titan Lint Engine...")
    report = {}
    total_errors = 0
    
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            path = os.path.join(VAULT_DIR, f)
            file_errors = check_file(path)
            if file_errors:
                report[f] = file_errors
                total_errors += len(file_errors)
                print(f"Found {len(file_errors)} errors in {f}")

    # Save detailed JSON report
    with open("TITAN_LINT_REPORT.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    # Save human readable summary
    with open("TITAN_LINT_SUMMARY.txt", "w", encoding="utf-8") as f:
        f.write(f"TITAN LINT REPORT\n")
        f.write(f"Total Errors: {total_errors}\n")
        f.write("="*50 + "\n")
        for filename, errs in report.items():
            f.write(f"\nFILE: {filename} ({len(errs)} errors)\n")
            for e in errs[:10]: # Show first 10 per file
                f.write(f"  Line {e['line']}: [{e['code']}] {e['msg']}\n")
            if len(errs) > 10:
                f.write(f"  ... and {len(errs)-10} more\n")

    print(f"Linting Complete. Total Errors: {total_errors}")
    print("Reports saved to TITAN_LINT_REPORT.json and TITAN_LINT_SUMMARY.txt")

if __name__ == "__main__":
    main()
