# Markdown File Protection Script
# Prevents encoding corruption in Dev Vault files

param(
    [string]$FilePath,
    [string]$Action = "check"
)

$ErrorActionPreference = "Stop"

# Configuration
$MAX_SAFE_SIZE = 10MB
$CORRUPTION_PATTERNS = @("Ãƒ", "â€™", "Â¢", "Ã†", "Ã‚")
$BACKUP_ROOT = "c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\BACKUPS"

function Test-FileCorruption {
    param([string]$Path)
    
    $file = Get-Item $Path
    $issues = @()
    
    # Check file size
    if ($file.Length -gt $MAX_SAFE_SIZE) {
        $issues += "File size ($($file.Length) bytes) exceeds safe limit ($MAX_SAFE_SIZE bytes)"
    }
    
    # Check for encoding corruption
    $content = Get-Content $Path -Raw -Encoding UTF8
    foreach ($pattern in $CORRUPTION_PATTERNS) {
        if ($content -match [regex]::Escape($pattern)) {
            $issues += "Encoding corruption detected: pattern '$pattern' found"
            break
        }
    }
    
    return $issues
}

function New-FileBackup {
    param([string]$Path)
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = Join-Path $BACKUP_ROOT $timestamp
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    
    $fileName = Split-Path $Path -Leaf
    $backupPath = Join-Path $backupDir $fileName
    
    Copy-Item $Path $backupPath -Force
    Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green
    
    return $backupPath
}

function Invoke-SafeEdit {
    param(
        [string]$Path,
        [scriptblock]$EditScript
    )
    
    # Create backup
    $backup = New-FileBackup -Path $Path
    
    try {
        # Read with explicit UTF-8
        $content = Get-Content $Path -Raw -Encoding UTF8
        
        # Apply edits
        $newContent = & $EditScript $content
        
        # Write with explicit UTF-8, no BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($Path, $newContent, $utf8NoBom)
        
        # Verify
        $issues = Test-FileCorruption -Path $Path
        if ($issues.Count -gt 0) {
            throw "Corruption detected after edit: $($issues -join '; ')"
        }
        
        Write-Host "✅ File edited successfully and verified" -ForegroundColor Green
        
    }
    catch {
        Write-Error "Edit failed: $_"
        Write-Host "🔄 Restoring from backup..." -ForegroundColor Yellow
        Copy-Item $backup $Path -Force
        throw
    }
}

function Invoke-HealthCheck {
    $knowledgeDir = "c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"
    $files = Get-ChildItem "$knowledgeDir\*.md" -Exclude "BACKUP*"
    
    $corrupted = @()
    
    foreach ($file in $files) {
        $issues = Test-FileCorruption -Path $file.FullName
        if ($issues.Count -gt 0) {
            $corrupted += [PSCustomObject]@{
                File   = $file.Name
                Size   = $file.Length
                Issues = $issues -join "; "
            }
        }
    }
    
    if ($corrupted.Count -eq 0) {
        Write-Host "✅ All files healthy!" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  CORRUPTED FILES DETECTED:" -ForegroundColor Red
        $corrupted | Format-Table -AutoSize
    }
    
    return $corrupted
}

# Main execution
switch ($Action) {
    "check" {
        if ($FilePath) {
            $issues = Test-FileCorruption -Path $FilePath
            if ($issues.Count -eq 0) {
                Write-Host "✅ File is healthy" -ForegroundColor Green
            }
            else {
                Write-Host "⚠️  Issues found:" -ForegroundColor Red
                $issues | ForEach-Object { Write-Host "  - $_" }
            }
        }
        else {
            Invoke-HealthCheck
        }
    }
    
    "backup" {
        New-FileBackup -Path $FilePath
    }
    
    "monitor" {
        Write-Host "🔍 Starting continuous monitoring..." -ForegroundColor Cyan
        while ($true) {
            Clear-Host
            Write-Host "=== Dev Vault Health Monitor ===" -ForegroundColor Cyan
            Write-Host "Time: $(Get-Date)" -ForegroundColor Gray
            Write-Host ""
            
            Invoke-HealthCheck
            
            Start-Sleep -Seconds 300  # Check every 5 minutes
        }
    }
}
