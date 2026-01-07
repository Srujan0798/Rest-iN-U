# 📚 DEV VAULT UTILITY
param(
    [Parameter(Position = 0)]
    [ValidateSet("stats", "gaps", "headers", "search")]
    [string]$Action = "stats",
    
    [Parameter(Position = 1)]
    [string]$Term = ""
)

$VaultPath = Join-Path (Split-Path -Parent $PSScriptRoot) "Doxs\Dev Vault (ETERNAL MANUAL)"

switch ($Action) {
    "stats" {
        Write-Host "`n📚 DEV VAULT STATISTICS" -ForegroundColor Cyan
        Write-Host "=" * 50 -ForegroundColor Gray
        
        $brainTotal = 0
        $knowledgeTotal = 0
        
        Write-Host "`n🧠 BRAIN:" -ForegroundColor Yellow
        Get-ChildItem "$VaultPath\BRAIN" -Filter "*.md" | ForEach-Object {
            $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
            $brainTotal += $lines
            Write-Host "   $($_.Name): $lines" -ForegroundColor Gray
        }
        
        Write-Host "`n📚 KNOWLEDGE:" -ForegroundColor Yellow
        Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
            $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
            $knowledgeTotal += $lines
            Write-Host "   $($_.Name): $lines" -ForegroundColor Gray
        }
        
        $total = $brainTotal + $knowledgeTotal
        
        Write-Host "`n" + "-" * 50 -ForegroundColor Gray
        Write-Host "   BRAIN: $brainTotal [$([math]::Round($brainTotal/100000*100, 1))%]" -ForegroundColor Green
        Write-Host "   KNOWLEDGE: $knowledgeTotal [$([math]::Round($knowledgeTotal/570000*100, 1))%]" -ForegroundColor Green
        Write-Host "   TOTAL: $total" -ForegroundColor Cyan
    }
    
    "gaps" {
        Write-Host "`n📊 PRIORITY GAPS" -ForegroundColor Cyan
        Write-Host "=" * 50 -ForegroundColor Gray
        
        $targets = @{
            "01_Frontend.md" = 100000; "02_Backend.md" = 80000; "03_Database.md" = 50000
            "04_Testing.md" = 40000; "05_Security.md" = 40000; "06_DevOps.md" = 30000
            "07_Cloud.md" = 30000; "08_System_Design.md" = 30000; "09_Mobile.md" = 25000
        }
        
        $gaps = @()
        Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
            $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
            $target = $targets[$_.Name]
            if (-not $target) { $target = 10000 }
            $gap = $target - $lines
            $percent = [math]::Round($lines / $target * 100, 1)
            $gaps += [PSCustomObject]@{Name = $_.Name; Lines = $lines; Target = $target; Gap = $gap; Percent = $percent }
        }
        
        Write-Host "`nTop Priority (by gap):" -ForegroundColor Yellow
        $gaps | Sort-Object Gap -Descending | Select-Object -First 10 | ForEach-Object {
            $color = if ($_.Percent -lt 10) { "Red" } elseif ($_.Percent -lt 30) { "Yellow" } else { "Green" }
            Write-Host "   $($_.Name): $($_.Lines)/$($_.Target) [$($_.Percent)%]" -ForegroundColor $color
        }
    }
    
    "headers" {
        Write-Host "`n📋 HEADER CONSISTENCY" -ForegroundColor Cyan
        Write-Host "=" * 50 -ForegroundColor Gray
        
        Get-ChildItem "$VaultPath\KNOWLEDGE" -Filter "*.md" | ForEach-Object {
            $first = (Get-Content $_.FullName -Head 1)
            $fileNum = [regex]::Match($_.Name, "^(\d+)_").Groups[1].Value
            $headerNum = [regex]::Match($first, "(\d+)_").Groups[1].Value
            
            if ($headerNum -and $fileNum -and $headerNum -ne $fileNum) {
                Write-Host "   ❌ $($_.Name) (header: $headerNum)" -ForegroundColor Red
            }
            else {
                Write-Host "   ✅ $($_.Name)" -ForegroundColor Green
            }
        }
    }
    
    "search" {
        if (-not $Term) {
            Write-Host "Usage: vault.ps1 search ""term""" -ForegroundColor Yellow
            exit 1
        }        
        Write-Host "`n🔍 SEARCHING: $Term" -ForegroundColor Cyan
        Write-Host "=" * 50 -ForegroundColor Gray
        
        Get-ChildItem $VaultPath -Recurse -Filter "*.md" | ForEach-Object {
            $searchResults = Select-String -Path $_.FullName -Pattern $Term -AllMatches
            if ($searchResults.Count -gt 0) {
                Write-Host "`n   📄 $($_.Name): $($searchResults.Count) matches" -ForegroundColor Yellow
                $searchResults | Select-Object -First 3 | ForEach-Object {
                    $line = $_.Line.Trim()
                    if ($line.Length -gt 60) { $line = $line.Substring(0, 60) + "..." }
                    Write-Host "      L$($_.LineNumber): $line" -ForegroundColor Gray
                }
            }
        }
    }
}
