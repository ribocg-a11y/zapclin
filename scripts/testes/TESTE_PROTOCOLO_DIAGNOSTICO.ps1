# Orquestrador protocolo ZapClin Z0+Z1 (readonly)
# Doc: docs/ativos/PROTOCOLO_DIAGNOSTICO_E_TESTES.md
#
# Uso:
#   .\scripts\testes\TESTE_PROTOCOLO_DIAGNOSTICO.ps1
#   .\scripts\testes\TESTE_PROTOCOLO_DIAGNOSTICO.ps1 -SkipNetworkTests

param(
  [switch]$SkipNetworkTests
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$testDir = $PSScriptRoot

$result = [ordered]@{
  protocolo = "TESTE_PROTOCOLO_DIAGNOSTICO"
  doc = "docs/ativos/PROTOCOLO_DIAGNOSTICO_E_TESTES.md"
  startedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  fases = @()
  status = "ok"
}

function Add-Fase {
  param([string]$Id, [string]$Nome, [string]$Status, [string]$Detail = "")
  $script:result.fases += [ordered]@{
    fluxo = $Id
    nome = $Nome
    status = $Status
    detail = $Detail
  }
  if ($Status -eq "fail") { $script:result.status = "fail" }
  elseif ($Status -eq "warn" -and $script:result.status -eq "ok") { $script:result.status = "warn" }
}

function Run-Test {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    return @{ exit = 1; output = "ausente: $Path" }
  }
  & $Path 2>&1 | Out-String | ForEach-Object { @{ exit = $LASTEXITCODE; output = $_ } } | Select-Object -Last 1
}

Write-Host "ZapClin - Protocolo diagnostico" -ForegroundColor Cyan

# Z0 — infra
$preScript = Join-Path $root "scripts/pre-push-check.ps1"
if ($SkipNetworkTests) {
  & $preScript -SkipNetworkTests 2>&1 | Out-Null
} else {
  & $preScript 2>&1 | Out-Null
}
Add-Fase "Z0" "pre-push-check" $(if ($LASTEXITCODE -eq 0) { "ok" } else { "fail" }) "exit=$LASTEXITCODE"

if (-not $SkipNetworkTests) {
  foreach ($pair in @(
    @("Z0", "TESTE_PING_READONLY.ps1", "ping GAS"),
    @("Z0", "TESTE_DIAGNOSTICO_READONLY.ps1", "diagnosticoSistema"),
    @("Z1", "TESTE_KPI_PARIDADE_READONLY.ps1", "paridade KPI")
  )) {
    $id = $pair[0]
    $script = Join-Path $testDir $pair[1]
    $label = $pair[2]
    if (-not (Test-Path $script)) {
      Add-Fase $id $label "fail" "script ausente"
      continue
    }
    & $script 2>&1 | Out-Null
    $ex = $LASTEXITCODE
    $st = if ($ex -eq 0) { "ok" } elseif ($ex -eq 2) { "warn" } else { "fail" }
    Add-Fase $id $label $st "exit=$ex"
  }
} else {
  Add-Fase "Z0" "testes rede" "ok" "skipped"
}

Write-Host ""
foreach ($f in $result.fases) {
  $color = switch ($f.status) { "ok" { "Green" } "warn" { "Yellow" } default { "Red" } }
  Write-Host ("[{0}] {1} — {2} ({3})" -f $f.status.ToUpper(), $f.fluxo, $f.nome, $f.detail) -ForegroundColor $color
}

Write-Host ""
Write-Host ("STATUS PROTOCOLO: {0}" -f $result.status.ToUpper()) -ForegroundColor $(if ($result.status -eq "ok") { "Green" } elseif ($result.status -eq "warn") { "Yellow" } else { "Red" })
Write-Host "Z2-Z6 (loja): checklist manual — ver PROTOCOLO_DIAGNOSTICO_E_TESTES.md"

if ($result.status -eq "fail") { exit 1 }
if ($result.status -eq "warn") { exit 2 }
exit 0
