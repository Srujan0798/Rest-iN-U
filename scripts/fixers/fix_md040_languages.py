import os
import re

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

# Heuristics for language detection
PATTERNS = {
    "typescript": [r"interface ", r"type ", r"const .*? = .*?;", r"import .*? from", r"export "],
    "javascript": [r"const ", r"let ", r"var ", r"function ", r"console\.log"],
    "python": [r"def ", r"import ", r"print\(", r"class .*?:"],
    "solidity": [r"pragma solidity", r"contract ", r"mapping\(", r"uint256"],
    "bash": [r"npm install", r"pip install", r"git ", r"docker ", r"kubectl "],
    "yaml": [r"version:", r"services:", r"apiVersion:"],
    "json": [r"\{", r"\}", r"\[", r"\]", r"\"key\":"],
    "sql": [r"SELECT ", r"INSERT ", r"CREATE TABLE"],
    "rust": [r"fn ", r"let mut ", r"impl ", r"struct "],
    "go": [r"func ", r"package ", r"import \("],
    "cpp": [r"#include", r"std::", r"int main"],
    "java": [r"public class", r"System.out.println"],
    "kotlin": [r"fun ", r"val ", r"var ", r"package "],
    "swift": [r"func ", r"var ", r"let ", r"import Foundation"],
    "dart": [r"void main", r"import 'package:"],
}

def detect_language(block_content):
    # Count matches for each language
    scores = {lang: 0 for lang in PATTERNS}
    for line in block_content:
        for lang, regexes in PATTERNS.items():
            for regex in regexes:
                if re.search(regex, line):
                    scores[lang] += 1
    
    # Get highest score
    best_lang = max(scores, key=scores.get)
    if scores[best_lang] > 0:
        return best_lang
    return "text" # Default

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    in_block = False
    block_content = []
    block_start_index = -1
    modified = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        if stripped.startswith("```"):
            if not in_block:
                # Start of block
                lang = stripped.replace("```", "").strip()
                if not lang:
                    # Missing language! Start capturing content to detect it
                    in_block = True
                    block_start_index = len(new_lines)
                    new_lines.append(line) # Placeholder, will replace later
                    block_content = []
                else:
                    # Has language, ignore
                    new_lines.append(line)
                    in_block = True # Still track block to know when it ends
                    block_start_index = -1 # Don't need to replace
            else:
                # End of block
                if block_start_index != -1:
                    # We were capturing a missing-lang block
                    detected = detect_language(block_content)
                    new_lines[block_start_index] = f"```{detected}\n"
                    modified = True
                    block_start_index = -1
                
                in_block = False
                new_lines.append(line)
        else:
            if in_block and block_start_index != -1:
                block_content.append(line)
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD040 Fixer (Missing Language)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD040 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
