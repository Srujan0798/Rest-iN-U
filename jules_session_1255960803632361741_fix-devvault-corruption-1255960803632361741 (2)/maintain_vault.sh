#!/bin/bash

# maintain_vault.sh
# Automates the setup and maintenance of DevVault files.

echo "--- DevVault Maintenance Protocol ---"

# 1. Check Python availability
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 could not be found."
    exit 1
fi

# 2. Install Dependencies
echo "[1/4] Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Warning: Failed to install dependencies. Trying to run anyway..."
fi

# 3. Check for Corruption & Generate Report
echo "[2/4] Checking for file corruption..."
python3 check_corruption.py
if [ $? -ne 0 ]; then
    echo "⚠️  Corruption detected! Attempting repair..."
    
    # 4. Attempt Repair
    echo "[3/4] Running repair protocol..."
    python3 fix_corruption.py
    
    # Re-check
    python3 check_corruption.py
    if [ $? -ne 0 ]; then
        echo "❌ Repair failed to fix all issues. Check vault_health.json"
        exit 1
    fi
else
    echo "✅ Vault is clean. Skipping repair."
fi

# 5. Generate Manifest
echo "[4/4] Updating Vault Manifest..."
python3 generate_manifest.py

echo "--- Maintenance Complete ---"
