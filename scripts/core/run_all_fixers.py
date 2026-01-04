import os
import subprocess

SCRIPTS = [
    "scripts/fixers/fix_md004_list_style.py",
    "scripts/fixers/fix_md012_blanks.py",
    "scripts/fixers/fix_md025_headers.py",
    "scripts/fixers/fix_md001_headers.py",
    "scripts/fixers/fix_md040_languages.py",
    "scripts/fixers/fix_md060_tables.py",
    "scripts/fixers/fix_code_block_closers.py",
    "scripts/fixers/fix_final_md040.py",
    "scripts/fixers/fix_md009_trailing_spaces.py"
]

def main():
    print("STARTING TITAN PERFECTION LOOP...")
    for script in SCRIPTS:
        print(f"\n>>> Executing {script}...")
        subprocess.run(["python", script], check=True)
    print("\nALL FIXERS EXECUTED.")

if __name__ == "__main__":
    main()
