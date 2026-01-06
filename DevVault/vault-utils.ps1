# DEV VAULT ANALYSIS UTILITY
# Use this script to scan and analyze large Dev Vault files efficiently

param(
    [string]$Action = "stats",  # stats, headers, search, gaps
    [string]$SearchTerm = "",
    [string]$VaultPath = "c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"
)

function Get-VaultStats {
    Write-Host "`n===========================================" -ForegroundColor Cyan
    Write-Host "  DEV VAULT STATISTICS" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    
    $brainTotal = 0
    $knowledgeTotal = 0
    
    # BRAIN stats
    Write-Host "`n📧 BRAIN FILES:" -ForegroundColor Yellow
    Get-ChildItem "$VaultPath\BRAIN" -Filter "*.md" -ErrorAction SilentlyContinue | ForEach-Object {
        $lines = (Get-Content $_.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
        $brainTotal += $lines
        Write-Host "  $($_.Name): $lines lines"
    }    
    # KNOWLEDGE stats
    Write-Host "`n📚 KNOWLEDGE FILES:" -ForegroundColor Yellow
    Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
        $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
        $knowledgeTotal += $lines
        Write-Host "  $($_.Name): $lines lines"
    }
    
    $total = $brainTotal + $knowledgeTotal
    $session = $total - 35117  # Baseline from session start
    
    Write-Host "`n-------------------------------------------" -ForegroundColor Gray
    Write-Host "  BRAIN: $brainTotal [$([math]::Round($brainTotal/100000*100, 2))%]" -ForegroundColor Green
    Write-Host "  KNOWLEDGE: $knowledgeTotal [$([math]::Round($knowledgeTotal/570000*100, 2))%]" -ForegroundColor Green
    Write-Host "  TOTAL: $total" -ForegroundColor Cyan
    Write-Host "  SESSION: +$session lines" -ForegroundColor Magenta
    Write-Host "===========================================" -ForegroundColor Cyan
}

function Get-HeaderCheck {
    Write-Host "`n===========================================" -ForegroundColor Cyan
    Write-Host "  HEADER CONSISTENCY CHECK" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    
    Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
        $first = (Get-Content $_.FullName -Head 1)
        $match = [regex]::Match($first, "(\d+)_")
        $fileNum = [regex]::Match($_.Name, "^(\d+)_").Groups[1].Value
        
        if ($match.Success) {
            $headerNum = $match.Groups[1].Value
            if ($headerNum -ne $fileNum) {
                Write-Host "  ❌ MISMATCH: $($_.Name) header has $headerNum" -ForegroundColor Red
            }
            else {
                Write-Host "  ✅ OK: $($_.Name)" -ForegroundColor Green
            }
        }
        else {
            Write-Host "  ✅ OK: $($_.Name) (no number expected)" -ForegroundColor Green
        }
    }
}

function Search-Vault {
    param([string]$Term)
    
    Write-Host "`n===========================================" -ForegroundColor Cyan
    Write-Host "  SEARCHING: $Term" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    
    Get-ChildItem "$VaultPath" -Recurse -Filter "*.md" | ForEach-Object {
        $searchResults = Select-String -Path $_.FullName -Pattern $Term -AllMatches
        if ($searchResults.Count -gt 0) {
            Write-Host "`n  📄 $($_.Name): $($searchResults.Count) matches" -ForegroundColor Yellow
            $searchResults | Select-Object -First 3 | ForEach-Object {
                Write-Host "     Line $($_.LineNumber): $($_.Line.Trim().Substring(0, [Math]::Min(60, $_.Line.Length)))..." -ForegroundColor Gray
            }
        }
    }
}

function Get-GapAnalysis {
    Write-Host "`n===========================================" -ForegroundColor Cyan
    Write-Host "  GAP ANALYSIS" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    
    $targets = @{
        "01_Frontend.md"      = 100000
        "02_Backend.md"       = 80000
        "03_Database.md"      = 50000
        "04_Testing.md"       = 40000
        "05_Security.md"      = 40000
        "06_DevOps.md"        = 30000
        "07_Cloud.md"         = 30000
        "08_System_Design.md" = 30000
        "09_Mobile.md"        = 25000
    }
    
    Write-Host "`n  Top Priority Files (by gap):" -ForegroundColor Yellow
    
    $gaps = @()
    Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
        $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
        $target = $targets[$_.Name]
        if (-not $target) { $target = 10000 }
        $gap = $target - $lines
        $percent = [math]::Round($lines / $target * 100, 1)
        $gaps += [PSCustomObject]@{
            Name    = $_.Name
            Lines   = $lines
            Target  = $target
            Gap     = $gap
            Percent = $percent
        }
    }
    
    $gaps | Sort-Object -Property Gap -Descending | Select-Object -First 10 | ForEach-Object {
        $bar = "█" * [math]::Min(10, [math]::Floor($_.Percent / 10))
        Write-Host "  $($_.Name): $($_.Lines)/$($_.Target) [$bar] $($_.Percent)% (Gap: $($_.Gap))" -ForegroundColor $(if ($_.Percent -lt 10) { "Red" } elseif ($_.Percent -lt 30) { "Yellow" } else { "Green" })
    }
}

# Execute based on action
switch ($Action) {
    "stats" { Get-VaultStats }
    "headers" { Get-HeaderCheck }
    "search" { Search-Vault -Term $SearchTerm }
    "gaps" { Get-GapAnalysis }
    default { Get-VaultStats }
}
