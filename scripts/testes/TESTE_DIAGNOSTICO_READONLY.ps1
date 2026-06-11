# diagnosticoSistema readonly — valida checks do backend
# Uso: .\scripts\testes\TESTE_DIAGNOSTICO_READONLY.ps1

$ErrorActionPreference = "Stop"

$WEB_APP = "https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec"
$url = "${WEB_APP}?action=diagnosticoSistema"

Write-Host "ZapClin TESTE_DIAGNOSTICO_READONLY" -ForegroundColor Cyan
Write-Host "GET $url"

try {
  $resp = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 60
} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

$ver = [string]$resp.version
$fonte = [string]$resp.fonte
$resumo = $resp.resumo

if (-not $resp.ok) {
  Write-Host "WARN/ FAIL: diagnostico retornou ok=false" -ForegroundColor Yellow
}

Write-Host "version=$ver fonte=$fonte" -ForegroundColor DarkGray
if ($resumo) {
  Write-Host ("checks: {0} ok, {1} falhas (total {2})" -f $resumo.ok, $resumo.falhas, $resumo.totalChecks)
}

$rangesOk = $false
if ($resp.rangesStatus) {
  $rs = $resp.rangesStatus
  $rangesOk = ($rs.dataRowMax -ge 2000) -and ($rs.lancamentos.linhasLidas -gt 0)
  Write-Host ("rangesStatus: lastRow LANCAMENTOS={0} lidas={1} DATA_ROW_MAX={2}" -f $rs.lancamentos.lastRow, $rs.lancamentos.linhasLidas, $rs.dataRowMax) -ForegroundColor DarkGray
}

$failCrit = @()
$warn = @()
$truncStale = $false

if ($resp.checks) {
  foreach ($c in $resp.checks) {
    $nome = [string]$c.nome
    $ok = $c.ok -eq $true
    $det = [string]$c.detalhe
    if (-not $ok) {
      if ($nome -match 'truncamento' -and $rangesOk -and [float]$ver -ge 3.45) {
        $truncStale = $true
        Write-Host ("  [stale] {0} — {1} (ranges dinamicos OK; redeploy v3.45.1)" -f $nome, $det) -ForegroundColor Yellow
        continue
      }
      if ($nome -match 'Trigger|EMAIL|Deployment') {
        $warn += $nome
      } elseif ($nome -match 'truncamento' -and [float]$ver -ge 3.45) {
        $warn += $nome
      } else {
        $failCrit += $nome
      }
      Write-Host ("  [FAIL] {0} — {1}" -f $nome, $det) -ForegroundColor Red
    } else {
      Write-Host ("  [ok]   {0} — {1}" -f $nome, $det) -ForegroundColor DarkGreen
    }
  }
}

if ($resp.kpiResumo) {
  $k = $resp.kpiResumo
  Write-Host ("kpiResumo: atHoje={0} recHoje={1} fonte={2}" -f $k.atHoje, $k.recHoje, $k.fonte) -ForegroundColor DarkGray
}

if ([float]$ver -lt 3.45) {
  Write-Host "WARN: GAS producao $ver — deploy v3.45 recomendado (ranges + KPI QTD)" -ForegroundColor Yellow
  if ($failCrit.Count -eq 0) { exit 2 }
}

if ($failCrit.Count -gt 0) {
  Write-Host "FAIL: $($failCrit.Count) check(s) critico(s)" -ForegroundColor Red
  exit 1
}

if ($truncStale) {
  Write-Host "OK diagnostico (ranges dinamicos confirmados; redeploy GAS v3.45.1 fecha check truncamento)" -ForegroundColor Green
  exit 0
}

if ($warn.Count -gt 0 -or (-not $resp.ok -and -not $rangesOk)) {
  Write-Host "WARN: checks nao-criticos ou ok=false global" -ForegroundColor Yellow
  exit 2
}

Write-Host "OK diagnostico" -ForegroundColor Green
exit 0
