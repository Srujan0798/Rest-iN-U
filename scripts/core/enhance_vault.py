import os

# Titan Content Dictionary
TITAN_CONTENT = {
    "15_IoT.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS (WHY WE DO THIS)
*   **The 'Zombie Botnet'**: Default passwords on 1M cameras caused a DDoS. Lesson: Unique keys per device.
*   **The 'Brick' Update**: OTA update failed mid-write. 50k devices dead. Lesson: A/B partition updates.

## 2. THE FOUNDATION
*   **MQTT vs HTTP**: MQTT for low bandwidth/battery. Pub/Sub model.
*   **Edge Computing**: Process data on device (TensorFlow Lite) to save bandwidth.

## 3. TITAN PATTERNS
*   **Shadow Device**: Cloud state matches device state. Sync when online (AWS IoT Shadow).
*   **Cert Rotation**: Automated mTLS certificate rotation for security.
""",
    "16_RealTime_Video.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Black Screen'**: Firewall blocked UDP. Lesson: TURN servers are mandatory.
*   **The 'Echo' Chamber**: No acoustic echo cancellation (AEC). Unusable audio.

## 2. THE FOUNDATION
*   **WebRTC**: P2P for low latency (<500ms). UDP based.
*   **HLS/DASH**: CDN delivery for high scale (>10s latency). TCP based.

## 3. TITAN PATTERNS
*   **SFU (Selective Forwarding Unit)**: Server routes streams. Essential for group calls > 3 people.
*   **Adaptive Bitrate (ABR)**: Switch quality based on bandwidth (Simulcast).
""",
    "18_Investment.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Fat Finger'**: $100M loss due to wrong decimal. Lesson: UI confirmation & backend limits.
*   **The 'Race Condition'**: Double spend on withdrawal. Lesson: Database locks / Serialized isolation.

## 2. THE FOUNDATION
*   **FIX Protocol**: The standard for financial information exchange.
*   **Order Book**: Matching engine logic (FIFO, Pro-Rata).

## 3. TITAN PATTERNS
*   **Event Sourcing**: Replay every transaction to rebuild state. Audit trail is free.
*   **Decimal Handling**: NEVER use floats. Use `Decimal` or integer cents.
""",
    "19_Climate.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Coordinate' Mixup**: Lat/Long swapped. Data plotted in Antarctica. Lesson: GeoJSON standard.

## 2. THE FOUNDATION
*   **H3 Indexing**: Uber's hexagonal grid system for spatial indexing.
*   **Raster vs Vector**: Satellite images (Raster) vs Shapes (Vector).

## 3. TITAN PATTERNS
*   **Tile Server**: Serve map data in XYZ tiles for performance.
*   **PostGIS**: The gold standard for SQL spatial queries.
""",
    "21_Localization.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Turkish I'**: String upper-casing bug caused crash. Lesson: Locale-aware string functions.
*   **The 'Layout Break'**: German text is 30% longer than English. UI overflow.

## 2. THE FOUNDATION
*   **i18n vs l10n**: Internationalization (Code) vs Localization (Content).
*   **RTL Support**: Right-to-Left for Arabic/Hebrew. CSS `direction: rtl`.

## 3. TITAN PATTERNS
*   **ICU Message Format**: Handling plurals and gender in translations.
*   **Pseudo-Localization**: Test with "L?r?m ?ps?m" to spot hardcoded strings.
""",
    "11_Search.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Slow Query'**: `LIKE '%term%'` on 10M rows. 30s timeout. Lesson: Inverted Index.

## 2. THE FOUNDATION
*   **Inverted Index**: Map words to document IDs.
*   **TF-IDF**: Term Frequency - Inverse Document Frequency. Relevance scoring.

## 3. TITAN PATTERNS
*   **Vector Search**: Embeddings (OpenAI/BERT) for semantic search ("King - Man + Woman = Queen").
*   **Fuzzy Matching**: Levenshtein distance for typos.
""",
    "13_ML_AI.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'Hallucination'**: Chatbot promised a refund it couldn't give. Lesson: RAG (Retrieval Augmented Generation).

## 2. THE FOUNDATION
*   **RAG**: Retrieve context -> Inject into Prompt -> LLM Answer.
*   **Embeddings**: Converting text to numbers.

## 3. TITAN PATTERNS
*   **Vector Database**: Pinecone/Weaviate for storing embeddings.
*   **Prompt Engineering**: Chain of Thought, Few-Shot.
""",
    "14_Blockchain.md": """
# VOLUME 2: TITAN UPGRADE (APPENDED)

## 1. THE SCARS
*   **The 'DAO Hack'**: Reentrancy attack drained $60M. Lesson: Checks-Effects-Interactions pattern.

## 2. THE FOUNDATION
*   **Smart Contracts**: Immutable code on chain.
*   **Gas**: Cost of computation. Optimization is money.

## 3. TITAN PATTERNS
*   **Merkle Tree**: Efficient verification of large data sets (Allowlists).
*   **Oracle**: Getting off-chain data (Price feeds) on-chain (Chainlink).
"""
}

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def enhance_files():
    print("Starting Titan Enhancement (Append Mode)...")
    for filename, content in TITAN_CONTENT.items():
        filepath = os.path.join(TARGET_DIR, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, "a", encoding="utf-8") as f:
                    f.write("\n" + content)
                print(f"SUCCESS: Enhanced {filename}")
            except Exception as e:
                print(f"ERROR: Could not enhance {filename}: {e}")
        else:
            print(f"WARNING: File not found {filename}")

if __name__ == "__main__":
    enhance_files()
