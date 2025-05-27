# ===============================================
# VALIDATION MCP CONFIGURATION - WINDOWS 11
# Version ASCII pure - Sans emojis
# ===============================================

param(
    [switch]$TestToken
)

Write-Host "TEST CONFIGURATION MCP WINDOWS 11" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Variables de resultats
$results = @{}
$allGood = $true

# Test 1: Fichiers configuration
Write-Host ""
Write-Host "Test 1: Fichiers configuration..." -ForegroundColor Yellow

$requiredFiles = @{
    "config.local.json" = ".mcp\config.local.json"
    "mcp-config.json" = ".mcp\mcp-config.json"
    "start-server.bat" = ".mcp\start-server.bat"
}

foreach ($file in $requiredFiles.GetEnumerator()) {
    if (Test-Path $file.Value) {
        Write-Host "  OK: $($file.Key)" -ForegroundColor Green
        $results[$file.Key] = $true
    } else {
        Write-Host "  MANQUANT: $($file.Key)" -ForegroundColor Red
        $results[$file.Key] = $false
        $allGood = $false
    }
}

# Test 2: GitHub Token
Write-Host ""
Write-Host "Test 2: GitHub Token..." -ForegroundColor Yellow

if (Test-Path ".mcp\config.local.json") {
    try {
        $configContent = Get-Content ".mcp\config.local.json" -Raw
        $config = $configContent | ConvertFrom-Json
        
        if ($config.github.token -match "^github_pat_") {
            Write-Host "  OK: Token GitHub configure correctement" -ForegroundColor Green
            $results["GitHubToken"] = $true
            $tokenValid = $true
        } elseif ($config.github.token -eq "REMPLACER_PAR_VOTRE_GITHUB_TOKEN") {
            Write-Host "  ERREUR: Token GitHub non remplace" -ForegroundColor Red
            $results["GitHubToken"] = $false
            $tokenValid = $false
            $allGood = $false
        } else {
            Write-Host "  ERREUR: Format token GitHub incorrect" -ForegroundColor Red
            $results["GitHubToken"] = $false
            $tokenValid = $false
            $allGood = $false
        }
    } catch {
        Write-Host "  ERREUR: Impossible de lire config.local.json" -ForegroundColor Red
        Write-Host "    Details: $($_.Exception.Message)" -ForegroundColor Gray
        $results["GitHubToken"] = $false
        $tokenValid = $false
        $allGood = $false
    }
} else {
    Write-Host "  ERREUR: Fichier config.local.json manquant" -ForegroundColor Red
    $results["GitHubToken"] = $false
    $tokenValid = $false
    $allGood = $false
}

# Test 3: MCP Server accessible
Write-Host ""
Write-Host "Test 3: MCP Server..." -ForegroundColor Yellow

try {
    $mcpOutput = & npx @modelcontextprotocol/server-github --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: MCP Server accessible" -ForegroundColor Green
        $results["MCPServer"] = $true
    } else {
        Write-Host "  ERREUR: MCP Server inaccessible" -ForegroundColor Red
        Write-Host "    Code sortie: $LASTEXITCODE" -ForegroundColor Gray
        $results["MCPServer"] = $false
        $allGood = $false
    }
} catch {
    Write-Host "  ERREUR: Impossible de tester MCP Server" -ForegroundColor Red
    Write-Host "    Details: $($_.Exception.Message)" -ForegroundColor Gray
    $results["MCPServer"] = $false
    $allGood = $false
}

# Test 4: GitHub API (optionnel avec -TestToken)
if ($TestToken -and $tokenValid) {
    Write-Host ""
    Write-Host "Test 4: GitHub API..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            'Authorization' = "token $($config.github.token)"
            'Accept' = 'application/vnd.github.v3+json'
            'User-Agent' = 'MCP-LemondesCurieux/1.0'
        }
        
        $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/sirensnake/lemondedescurieux" -Headers $headers -TimeoutSec 15
        
        Write-Host "  OK: Repository GitHub accessible" -ForegroundColor Green
        Write-Host "    Nom: $($repoInfo.name)" -ForegroundColor Gray
        Write-Host "    Derniere mise a jour: $($repoInfo.updated_at)" -ForegroundColor Gray
        Write-Host "    Prive: $($repoInfo.private)" -ForegroundColor Gray
        $results["GitHubAPI"] = $true
        
    } catch {
        Write-Host "  ERREUR: GitHub API inaccessible" -ForegroundColor Red
        Write-Host "    Details: $($_.Exception.Message)" -ForegroundColor Gray
        $results["GitHubAPI"] = $false
        $allGood = $false
    }
}

# Rapport final
Write-Host ""
Write-Host "RAPPORT FINAL" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "=============" -ForegroundColor White -BackgroundColor DarkBlue

Write-Host ""
$passedTests = ($results.Values | Where-Object { $_ -eq $true }).Count
$totalTests = $results.Count
Write-Host "Tests reussis: $passedTests/$totalTests" -ForegroundColor Green

Write-Host ""
if ($allGood) {
    Write-Host "CONFIGURATION MCP OPERATIONNELLE !" -ForegroundColor Green -BackgroundColor Black
    Write-Host ""
    Write-Host "Prochaines etapes:" -ForegroundColor Cyan
    Write-Host "  1. Demarrer MCP Server: .mcp\start-server.bat" -ForegroundColor White
    Write-Host "  2. Tester avec Claude une fois le serveur demarre" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "CONFIGURATION INCOMPLETE" -ForegroundColor Yellow -BackgroundColor Black
    Write-Host ""
    Write-Host "Actions requises:" -ForegroundColor Yellow
    
    foreach ($test in $results.GetEnumerator()) {
        if (-not $test.Value) {
            switch ($test.Key) {
                "config.local.json" { Write-Host "  - Creer le fichier .mcp\config.local.json" -ForegroundColor Red }
                "mcp-config.json" { Write-Host "  - Creer le fichier .mcp\mcp-config.json" -ForegroundColor Red }
                "start-server.bat" { Write-Host "  - Creer le fichier .mcp\start-server.bat" -ForegroundColor Red }
                "GitHubToken" { Write-Host "  - Configurer le token GitHub dans config.local.json" -ForegroundColor Red }
                "MCPServer" { Write-Host "  - Verifier installation MCP: npm install -g @modelcontextprotocol/server-github" -ForegroundColor Red }
                "GitHubAPI" { Write-Host "  - Verifier permissions du token GitHub" -ForegroundColor Red }
            }
        }
    }
}

Write-Host ""
Write-Host "Commandes utiles:" -ForegroundColor Magenta
Write-Host "  Test complet: .\.mcp\validate-config.ps1 -TestToken" -ForegroundColor Gray
Write-Host "  Demarrage MCP: .\.mcp\start-server.bat" -ForegroundColor Gray

Write-Host ""