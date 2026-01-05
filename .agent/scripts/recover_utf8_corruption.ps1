# UTF-8 Corruption Recovery Script
# Attempts to decode multi-layer UTF-8 encoding corruption

param(
    [string]$InputFile,
    [string]$OutputFile
)

$ErrorActionPreference = "Stop"

Write-Host "Starting UTF-8 corruption recovery..." -ForegroundColor Cyan

# Read the corrupted file as raw bytes
$bytes = [System.IO.File]::ReadAllBytes($InputFile)
Write-Host "File size: $($bytes.Length) bytes" -ForegroundColor Yellow

# Try different decoding strategies
$strategies = @(
    @{Name = "Latin1->UTF8"; Decode = { param($b) [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::GetEncoding("ISO-8859-1").GetBytes([System.Text.Encoding]::UTF8.GetString($b))) } },
    @{Name = "Double UTF8"; Decode = { param($b) 
            $first = [System.Text.Encoding]::UTF8.GetString($b)
            $bytes2 = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetBytes($first)
            [System.Text.Encoding]::UTF8.GetString($bytes2)
        }
    },
    @{Name = "Triple UTF8"; Decode = { param($b)
            $first = [System.Text.Encoding]::UTF8.GetString($b)
            $bytes2 = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetBytes($first)
            $second = [System.Text.Encoding]::UTF8.GetString($bytes2)
            $bytes3 = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetBytes($second)
            [System.Text.Encoding]::UTF8.GetString($bytes3)
        }
    }
)

# Test on first 10000 bytes
$testBytes = $bytes[0..9999]
$bestStrategy = $null
$bestScore = 0

foreach ($strategy in $strategies) {
    try {
        Write-Host "`nTesting strategy: $($strategy.Name)" -ForegroundColor Cyan
        $decoded = & $strategy.Decode $testBytes
        
        # Score based on readable ASCII characters and lack of corruption markers
        $asciiCount = ($decoded.ToCharArray() | Where-Object { $_ -match '[a-zA-Z0-9\s\.\,\;\:\-\#]' }).Count
        $corruptionCount = ($decoded -split "Ãƒ|â€™|Â¢|Ã†|Ã‚").Count - 1
        
        $score = $asciiCount - ($corruptionCount * 100)
        
        Write-Host "  ASCII chars: $asciiCount" -ForegroundColor Gray
        Write-Host "  Corruption markers: $corruptionCount" -ForegroundColor Gray
        Write-Host "  Score: $score" -ForegroundColor $(if ($score -gt $bestScore) { "Green" }else { "Gray" })
        
        if ($score -gt $bestScore) {
            $bestScore = $score
            $bestStrategy = $strategy
        }
        
        # Show sample
        $sample = $decoded.Substring(0, [Math]::Min(200, $decoded.Length))
        Write-Host "  Sample: $($sample.Substring(0, [Math]::Min(100, $sample.Length)))..." -ForegroundColor DarkGray
        
    }
    catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
    }
}

if ($bestStrategy) {
    Write-Host "`n✅ Best strategy: $($bestStrategy.Name) (Score: $bestScore)" -ForegroundColor Green
    Write-Host "Decoding full file..." -ForegroundColor Cyan
    
    try {
        $recovered = & $bestStrategy.Decode $bytes
        
        # Write recovered content
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($OutputFile, $recovered, $utf8NoBom)
        
        $outputSize = (Get-Item $OutputFile).Length
        Write-Host "✅ Recovery complete!" -ForegroundColor Green
        Write-Host "   Input:  $($bytes.Length) bytes" -ForegroundColor Gray
        Write-Host "   Output: $outputSize bytes" -ForegroundColor Gray
        Write-Host "   Saved to: $OutputFile" -ForegroundColor Gray
        
        # Show first few lines
        $lines = $recovered -split "`n" | Select-Object -First 20
        Write-Host "`nFirst 20 lines of recovered content:" -ForegroundColor Cyan
        $lines | ForEach-Object { Write-Host $_ -ForegroundColor DarkGray }
        
    }
    catch {
        Write-Error "Failed to decode full file: $_"
    }
}
else {
    Write-Error "No successful decoding strategy found"
}
