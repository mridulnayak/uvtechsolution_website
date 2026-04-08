# UV Tech Solutions - Multi-Product "Sidekick" Heartbeat Script
# This script monitors Hoteleo, Restpro, and Retail software and reports status to the Command Center.

$API_URL = "https://uvtechsolution-website.vercel.app/api/heartbeat" # Update after dev survey
$CLIENT_ID = $env:COMPUTERNAME # Use Computer Name as default Client ID
$SOFTWARE_LIST = @("Hoteleo", "Restpro", "Retail")
$VERSION = "2.0.1"

Function Get-SystemStats {
    Param($ProductName)
    
    # 1. RAM Usage of the process
    $process = Get-Process $ProductName -ErrorAction SilentlyContinue
    $ramUsage = if ($process) { [math]::Round($process.WorkingSet64 / 1MB, 2) } else { 0 }

    # 2. Database Status (Example check for SQL Server or Local DB)
    # For now, let's pretend we check if a local process like 'mysqld' or 'sqlservr' is running
    # In production, this would be a proper connection heartbeat
    $dbProcess = Get-Process "sqlservr" -ErrorAction SilentlyContinue
    $dbStatus = if ($dbProcess) { "Online" } else { "Online (Local)" } # Mocking for now

    # 3. Printer Status
    # Simple check if any printer is offline
    $offlinePrinters = Get-Printer | Where-Object { $_.PrinterStatus -ne 'Normal' }
    $printerStatus = if ($offlinePrinters.Count -eq 0) { "Ready" } else { "Warning: Offline" }

    # 4. Product Specific Extra Data (Mocking)
    $extraData = switch ($ProductName) {
        "Hoteleo" { "12 Rooms" } # Random or pulled from DB
        "Restpro" { "5 Active Tables" }
        "Retail"  { "42 Sales Today" }
        Default   { "Idle" }
    }

    return @{
        ram_usage = $ramUsage
        db_status = $dbStatus
        printer_status = $printerStatus
        extra_data = $extraData
    }
}

Function Send-Heartbeat {
    Param($ProductName, $Status = "Healthy", $ErrorCode = $null)
    
    $stats = Get-SystemStats -ProductName $ProductName
    
    $body = @{
        client_id         = $CLIENT_ID
        product_type      = $ProductName
        status            = $Status
        software_version  = $VERSION
        error_code        = $ErrorCode
        last_sync_details = $stats
    } | ConvertTo-Json

    Try {
        $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
        Write-Host "[$ProductName] Heartbeat Sent Successfully! Status: $($response.timestamp)" -ForegroundColor Green
    } Catch {
        Write-Host "[$ProductName] Heartbeat Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "--- UV Tech Sidekick v$VERSION Starting ---" -ForegroundColor Cyan
Write-Host "Targeting endpoint: $API_URL" -ForegroundColor Gray

# Main Loop: Check every 5 minutes
While($true) {
    $foundAny = $false
    
    ForEach ($Product in $SOFTWARE_LIST) {
        $proc = Get-Process $Product -ErrorAction SilentlyContinue
        If ($proc) {
            $foundAny = $true
            Send-Heartbeat -ProductName $Product
        }
    }

    If (-not $foundAny) {
        # Optional: Send a generic ping or stay silent
        Write-Host "No registered products (Hoteleo/Restpro/Retail) running. Sleeping..." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds 300 # 5 Minute Interval
}
