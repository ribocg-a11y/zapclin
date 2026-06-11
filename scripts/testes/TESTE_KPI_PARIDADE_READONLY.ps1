# Paridade KPI readonly — listar (estilo Home) vs buscarKpisAdmin (Admin)
# Detecta truncamento linha 600 e divergencia QTD/contagem.
# Uso: .\scripts\testes\TESTE_KPI_PARIDADE_READONLY.ps1

$ErrorActionPreference = "Stop"

$WEB_APP = "https://script.google.com/macros/s/AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg/exec"

function Get-GasJson {
  param([string]$Action)
  $url = "${WEB_APP}?action=$Action"
  Write-Host "GET $url"
  return Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 45
}

function Format-HojeBR {
  param([string]$Timezone)
  $tzInfo = [TimeZoneInfo]::FindSystemTimeZoneById($Timezone)
  if (-not $tzInfo) {
    $now = Get-Date
  } else {
    $now = [TimeZoneInfo]::ConvertTimeFromUtc((Get-Date).ToUniversalTime(), $tzInfo)
  }
  return $now.ToString("dd/MM/yyyy")
}

function Parse-Qtd {
  param($val)
  $n = 0
  if ($null -eq $val) { return 1 }
  if ([int]::TryParse([string]$val, [ref]$n) -and $n -gt 0) { return $n }
  return 1
}

function Parse-Valor {
  param($val)
  $s = [string]$val
  if ([string]::IsNullOrWhiteSpace($s)) { return 0.0 }
  $s = $s -replace 'R\$|\s', '' -replace '\.', '' -replace ',', '.'
  $d = 0.0
  if ([double]::TryParse($s, [ref]$d)) { return $d }
  return [double]$val
}

Write-Host "ZapClin TESTE_KPI_PARIDADE_READONLY" -ForegroundColor Cyan

try {
  $ping = Get-GasJson "ping"
  if (-not $ping.ok) { throw "ping falhou" }
  $gasVer = [string]$ping.version
  $tz = [string]$ping.timezone
  if ([string]::IsNullOrWhiteSpace($tz)) { $tz = "America/Sao_Paulo" }

  $listar = Get-GasJson "listar"
  if (-not $listar.ok) { throw "listar falhou: $($listar.error)" }

  $admin = Get-GasJson "buscarKpisAdmin"
  if (-not $admin.ok) { throw "buscarKpisAdmin falhou: $($admin.error)" }

  $hoje = Format-HojeBR $tz
  Write-Host "Data hoje ($tz): $hoje" -ForegroundColor DarkGray
  Write-Host "GAS version: $gasVer | fonte admin: $($admin.fonte)" -ForegroundColor DarkGray

  $items = @($listar.items)
  $maxRow = ($items | ForEach-Object { [int]$_.row } | Measure-Object -Maximum).Maximum
  Write-Host "listar items=$($items.Count) maxRow=$maxRow" -ForegroundColor DarkGray

  $recHome = 0.0
  $atHome = 0
  foreach ($l in $items) {
    $data = [string]$l.data
    $svc = [string]$l.svc
    if ($data -ne $hoje) { continue }
    if ($l.cancelado -eq $true) { continue }
    if ($svc -match '^CANCELADO\b') { continue }
    $recHome += Parse-Valor $l.val
    $atHome += Parse-Qtd $l.qtd
  }

  $recAdmin = [double]$admin.recHoje
  $atAdmin = [int]$admin.atHoje

  Write-Host ""
  Write-Host ("Home-style (listar): recHoje=R$ {0:N2} atHoje={1}" -f $recHome, $atHome)
  Write-Host ("Admin (buscarKpisAdmin): recHoje=R$ {0:N2} atHoje={1}" -f $recAdmin, $atAdmin)

  $status = "ok"
  $diffRec = [Math]::Abs($recHome - $recAdmin)
  $diffAt = [Math]::Abs($atHome - $atAdmin)

  if ($diffRec -gt 0.01 -or $diffAt -gt 0) {
    $status = "fail"
    Write-Host ""
    Write-Host "FAIL: divergencia Home vs Admin" -ForegroundColor Red
    Write-Host "  delta recHoje=R$ $($diffRec.ToString('N2')) delta atHoje=$diffAt"
    if ($maxRow -ge 600 -and $gasVer -lt "3.45") {
      Write-Host "  provavel causa: truncamento listar linha 600 (deploy v3.45)" -ForegroundColor Yellow
    }
    if ($gasVer -ge "3.45" -and $diffAt -gt 0) {
      Write-Host "  verificar soma QTD no backend buscarKpisAdmin_" -ForegroundColor Yellow
    }
    exit 1
  }

  if ($maxRow -ge 590 -and $gasVer -lt "3.45") {
    Write-Host ""
    Write-Host "WARN: planilha proxima do limite 600 — deploy v3.45 recomendado" -ForegroundColor Yellow
    exit 2
  }

  Write-Host ""
  Write-Host "OK paridade KPI hoje" -ForegroundColor Green
  exit 0

} catch {
  Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
