# Ping readonly do GAS ZapClin — valida ok + versao em producao
# Uso: .\scripts\testes\TESTE_PING_READONLY.ps1

$ErrorActionPreference = "Stop"

$WEB_APP = "https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec"
$pingUrl = "${WEB_APP}?action=ping"

Write-Host "ZapClin TESTE_PING_READONLY" -ForegroundColor Cyan
Write-Host "GET $pingUrl"

try {
  $resp = Invoke-RestMethod -Uri $pingUrl -Method Get -TimeoutSec 30
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

if (-not $resp.ok) {
  Write-Host "FAIL: resposta ok=false — $($resp | ConvertTo-Json -Compress)" -ForegroundColor Red
  exit 1
}

$ver = [string]$resp.version
$tz = [string]$resp.timezone
Write-Host "OK ping version=$ver timezone=$tz" -ForegroundColor Green

if ($ver -lt "3.45") {
  Write-Host "WARN: producao em $ver — alvo 3.45 apos deploy PR #1" -ForegroundColor Yellow
  exit 2
}

exit 0
