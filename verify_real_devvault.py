"""
Verify that our REAL Dev Vault has Jules' encoding fixes
Check for clean emojis vs mojibake
"""
import os

DEV_VAULT = "docs/Dev Vault (ETERNAL MANUAL)"

def check_file_encoding(filepath):
    """Check if file has clean emojis or mojibake"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for mojibake patterns
        mojibake_patterns = ['Ã', 'â€', 'ðŸ', 'Â']
        has_mojibake = any(pattern in content for pattern in mojibake_patterns)
        
        # Check for clean emojis
        clean_emojis = ['📚', '🧠', '🎯', '💡', '🔬', '📊', '🌟', '📝']
        has_clean_emojis = any(emoji in content for emoji in clean_emojis)
        
        return {
            'has_mojibake': has_mojibake,
            'has_clean_emojis': has_clean_emojis,
            'status': 'CLEAN' if (has_clean_emojis and not has_mojibake) else ('MOJIBAKE' if has_mojibake else 'NO_EMOJIS')
        }
    except Exception as e:
        return {'status': f'ERROR: {e}'}

def main():
    print("=" * 80)
    print("VERIFYING OUR REAL DEV VAULT HAS JULES' FIXES")
    print("=" * 80)
    print(f"Location: {DEV_VAULT}\n")
    
    # Check key files that should have emojis
    key_files = [
        "README.md",
        "GAP_ANALYSIS.md",
        "BRAIN/README.md",
        "BRAIN/00_BRAIN_INDEX.md",
        "KNOWLEDGE/00_MASTER_INDEX.md"
    ]
    
    clean_count = 0
    mojibake_count = 0
    
    for rel_path in key_files:
        filepath = os.path.join(DEV_VAULT, rel_path)
        if os.path.exists(filepath):
            result = check_file_encoding(filepath)
            status = result['status']
            
            if status == 'CLEAN':
                clean_count += 1
                print(f"[OK] {rel_path} - Has clean emojis ✅")
            elif status == 'MOJIBAKE':
                mojibake_count += 1
                print(f"[BAD] {rel_path} - Has mojibake ❌")
            else:
                print(f"[INFO] {rel_path} - {status}")
        else:
            print(f"[MISSING] {rel_path}")
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print("=" * 80)
    print(f"Files with clean emojis: {clean_count}")
    print(f"Files with mojibake: {mojibake_count}")
    
    if mojibake_count > 0:
        print("\n❌ PROBLEM: Our Dev Vault still has mojibake!")
        print("Jules' fixes were NOT applied to our real Dev Vault!")
    else:
        print("\n✅ SUCCESS: Our Dev Vault has Jules' clean encoding fixes!")

if __name__ == "__main__":
    main()
