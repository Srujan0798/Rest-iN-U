#!/bin/bash
# REST-iN-U Documentation Reorganization Script

BASE=".claude"

echo "🚀 Starting documentation reorganization..."

# Create agent index copy
cp "$BASE/agents/AGENT_INDEX.md" "$BASE/3-agents/00-AGENT_INDEX.md"

# AGENTS - Dharma (THE MOAT!)
cp "$BASE/agents/D1-VastuEngine.md" "$BASE/3-agents/05-dharma/VastuVidya.md"
cp "$BASE/agents/D3-AyurvedaJyotish.md" "$BASE/3-agents/05-dharma/JyotishMatcher.md"
cp "$BASE/agents/D2-ClimateRisk.md" "$BASE/3-agents/04-risk/ClimateRisk.md"

# DEVELOPMENT - Backend
cp "$BASE/agents/B1-API.md" "$BASE/4-development/backend/"
cp "$BASE/agents/B2-Database.md" "$BASE/4-development/backend/"
cp "$BASE/agents/B3-Microservices.md" "$BASE/4-development/backend/"
cp "$BASE/agents/B4-Integrations.md" "$BASE/4-development/backend/"
cp "$BASE/agents/DOC2-APIDocumentation.md" "$BASE/4-development/backend/"

# DEVELOPMENT - Frontend  
cp "$BASE/agents/F1-Web.md" "$BASE/4-development/frontend/"
cp "$BASE/agents/F2-Mobile.md" "$BASE/4-development/frontend/"
cp "$BASE/agents/F3-UIUX.md" "$BASE/4-development/frontend/"

# DEVELOPMENT - Blockchain
cp "$BASE/agents/BC1-SmartContracts.md" "$BASE/4-development/blockchain/"
cp "$BASE/agents/BC2-Web3Integration.md" "$BASE/4-development/blockchain/"

# DEVELOPMENT - Quality
cp "$BASE/agents/Q1-TestAutomation.md" "$BASE/4-development/quality/"
cp "$BASE/agents/Q2-Performance.md" "$BASE/4-development/quality/"
cp "$BASE/agents/Q3-Security.md" "$BASE/4-development/quality/"
cp "$BASE/agents/CQ1-CodeReview.md" "$BASE/4-development/quality/"
cp "$BASE/agents/CQ2-Refactoring.md" "$BASE/4-development/quality/"
cp "$BASE/agents/BUG1-BugFixer.md" "$BASE/4-development/quality/"
cp "$BASE/agents/PR1-PRReview.md" "$BASE/4-development/quality/"
cp "$BASE/agents/DOC1-TechnicalWriter.md" "$BASE/4-development/quality/"

# OPERATIONS
cp "$BASE/agents/O1-Infrastructure.md" "$BASE/5-operations/"
cp "$BASE/agents/O2-CICD.md" "$BASE/5-operations/"
cp "$BASE/agents/O3-Monitoring.md" "$BASE/5-operations/"

# LEADERSHIP
cp "$BASE/agents/C0-CPO.md" "$BASE/6-leadership/"
cp "$BASE/agents/C1-CTO.md" "$BASE/6-leadership/"
cp "$BASE/agents/C2-ProductManager.md" "$BASE/6-leadership/"

# RESEARCH
cp "$BASE/agents/LLM-Options-Research.md" "$BASE/7-research/"
cp "$BASE/agents/Embedding-Models-Research.md" "$BASE/7-research/"
cp "$BASE/agents/Vector-Database-Research.md" "$BASE/7-research/"
cp "$BASE/agents/R1-Research.md" "$BASE/7-research/"

# GUIDES
cp "$BASE/agents/ANTIGRAVITY_GUIDE.md" "$BASE/8-guides/"
cp "$BASE/agents/FREE_SETUP_GUIDE.md" "$BASE/8-guides/"
cp "$BASE/agents/MULTI_TOOL_GUIDE.md" "$BASE/8-guides/"
cp "$BASE/agents/ORCHESTRATION_GUIDE.md" "$BASE/8-guides/"
cp "$BASE/agents/STANDALONE_GUIDE.md" "$BASE/8-guides/"
cp "$BASE/agents/TERMINAL_SETUP.md" "$BASE/8-guides/"

# Move phasesAgents.md
cp "$BASE/phasesAgents.md" "$BASE/1-planning/phases-agents.md"

echo "✅ All files organized!"
echo "📊 Counting files..."
echo "Planning: $(ls -1 $BASE/1-planning/ | wc -l) files"
echo "Deployment: $(ls -1 $BASE/2-deployment/ | wc -l) files"
echo "Agents: $(find $BASE/3-agents/ -type f | wc -l) files"
echo "Development: $(find $BASE/4-development/ -type f | wc -l) files"
echo "Operations: $(ls -1 $BASE/5-operations/ | wc -l) files"
echo "Leadership: $(ls -1 $BASE/6-leadership/ | wc -l) files"
echo "Research: $(ls -1 $BASE/7-research/ | wc -l) files"
echo "Guides: $(ls -1 $BASE/8-guides/ | wc -l) files"
