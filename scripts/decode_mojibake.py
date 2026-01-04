
garbage = b'\xc3\x83\xc6\x92\xc3\x86\xe2\x80\x99\xc3\x83\xe2\x80\xa0\xc3\xa2\xe2\x82\xac\xe2\x84\xa2'

def try_decode(data, depth=0):
    if depth > 5: return
    
    print(f"Depth {depth}: {data}")
    
    # Try interpreting as utf-8 bytes that were decoded as latin-1
    # So we encode back to latin-1 to get the original bytes
    try:
        # If data is bytes, decode to string first (assuming it's the garbage string)
        if isinstance(data, bytes):
            s = data.decode('utf-8')
        else:
            s = data
            
        # Reverse: encode('latin-1') -> decode('utf-8')
        # or encode('windows-1252')
        
        raw = s.encode('windows-1252')
        decoded = raw.decode('utf-8')
        print(f"  -> Reversed (win1252): {decoded}")
        try_decode(decoded, depth+1)
    except Exception as e:
        pass

    try:
        if isinstance(data, bytes):
            s = data.decode('utf-8')
        else:
            s = data
        raw = s.encode('latin-1')
        decoded = raw.decode('utf-8')
        print(f"  -> Reversed (latin-1): {decoded}")
        try_decode(decoded, depth+1)
    except Exception as e:
        pass

print("Analyzing garbage bytes...")
try:
    # The bytes we found in the file are likely the UTF-8 representation of the garbage
    # So first we decode them to get the "garbage string"
    garbage_str = garbage.decode('utf-8')
    try_decode(garbage_str)
except Exception as e:
    print(f"Initial decode failed: {e}")
