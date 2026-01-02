---
description: How to add knowledge to Dev Vault files (dictionary/index approach)
---

# DEV VAULT KNOWLEDGE INTEGRATION WORKFLOW

## Step 1: Extract Existing Headings (Dictionary Keys)
Use PowerShell to get all `#` headings from the target file:

```powershell
// turbo
Select-String -Path "path\to\file.md" -Pattern "^#{1,3}\s" | ForEach-Object { $_.Line }
```

This gives you the "dictionary index" of all existing topics.

## Step 2: Compare User's Dump Topics
Look at the main `#` topics in the user's dump:
- If a topic heading exists in dictionary → SKIP IT
- If a topic heading is NEW → ADD IT

## Step 3: Add Only NEW Topics
Add only the content for topics that DON'T exist in the file.

## Example Comparison

**User Dump Topics:**
- Docker Container Size (`.dockerignore`)
- OOM Kills
- Disaster Recovery
- Graceful Shutdown

**Existing Dictionary (from grep):**
- `### 6. DOCKER CONTAINERIZATION` → EXISTS, but check if `.dockerignore` is covered
- `## 🔄 DISASTER RECOVERY` → EXISTS (keyword atlas, may need expansion)

**Decision:**
- `.dockerignore` details → NEW, ADD IT
- OOM Kills → NEW, ADD IT
- Disaster Recovery RUNBOOK → EXPAND existing
- Graceful Shutdown → NEW, ADD IT

## File Locations

| Domain | File |
|--------|------|
| Frontend/React | `01_Frontend.md` |
| Backend/API | `02_Backend.md` |
| Database | `03_Database.md` |
| Testing | `04_Testing.md` |
| Security | `05_Security.md` |
| **DevOps/CI-CD** | **`06_DevOps.md`** |
| Cloud/AWS/K8s | `07_Cloud.md` |
| System Design | `08_System_Design.md` |
| Blockchain | `14_Blockchain.md` |

## Quick Reference Commands

```powershell
// turbo
# Get all headings from a file
Select-String -Path "KNOWLEDGE\06_DevOps.md" -Pattern "^#{1,3}\s" | ForEach-Object { $_.Line }

# Search for specific topic
Select-String -Path "KNOWLEDGE\06_DevOps.md" -Pattern "dockerignore|OOM|graceful" -CaseSensitive:$false
```
