# Gate local antes de git push — versões FE/SW + ping GAS opcional
# Uso:
#   .\scripts\pre-push-check.ps1
#   .\scripts\pre-push-check.ps1 -SkipNetworkTests
#
# Hook opcional (uma vez no repo):
#   git config core.hooksPath githooks

param(
  [switch]$SkipNetworkTests
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$result = [ordered]@{
  startedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  checks = @()
  status = "ok"
}

function Add-Check {
  param([string]$Name, [string]$Status, [string]$Detail = "")
  $script:result.checks += [ordered]@{ name = $Name; status = $Status; detail = $Detail }
  if ($Status -eq "fail") { $script:result.status = "fail" }
  elseif ($Status -eq "warn" -and $script:result.status -eq "ok") { $script:result.status = "warn" }
}

function Read-AppVersion {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $m = Select-String -Path $Path -Pattern "APP_VERSION\s*=\s*'([^']+)'" | Select-Object -First 1
  if (-not $m) { return $null }
  return $m.Matches.Groups[1].Value
}

function Read-ZcCacheBust {
  param([string]$Html, [string]$ExpectedVer)
  $scriptTags = [regex]::Matches($Html, 'zc-[a-z]+\.js\?v=([^"''&]+)')
  $bad = @($scriptTags | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -ne $ExpectedVer } | Select-Object -Unique)
  return $bad
}

function Read-SwVersion {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $m = Select-String -Path $Path -Pattern "ZAPCLIN_SW_VERSION\s*=\s*'([^']+)'" | Select-Object -First 1
  if (-not $m) { return $null }
  return $m.Matches.Groups[1].Value
}

function Read-GasVersion {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  $m = Select-String -Path $Path -Pattern "var VERSION\s*=\s*'([^']+)'" | Select-Object -First 1
  if (-not $m) { return $null }
  return $m.Matches.Groups[1].Value
}

Write-Host "ZapClin pre-push-check" -ForegroundColor Cyan

try {
  $appVer = Read-AppVersion (Join-Path $root "zc-version.js")
  if (-not $appVer) { $appVer = Read-AppVersion (Join-Path $root "index.html") }
  $swVer = Read-SwVersion (Join-Path $root "sw.js")
  if (-not $appVer) { throw "zc-version.js sem APP_VERSION" }
  if (-not $swVer) { throw "sw.js sem ZAPCLIN_SW_VERSION" }

  if ($appVer -ne $swVer) {
    Add-Check "versao.app-vs-sw" "fail" "APP_VERSION=$appVer SW=$swVer"
  } else {
    Add-Check "versao.app-vs-sw" "ok" $appVer
  }

  $swRaw = Get-Content -Path (Join-Path $root "sw.js") -Raw -Encoding UTF8
  if ($swRaw -notmatch [regex]::Escape($appVer)) {
    Add-Check "versao.sw-cache-names" "warn" "cache keys podem nao incluir $appVer"
  } else {
    Add-Check "versao.sw-cache-names" "ok" "cache alinhado"
  }

  $gsFiles = @(Get-ChildItem -Path $root -Filter "AppsScript_v*.gs" -File | Sort-Object Name -Descending)
  if ($gsFiles.Count -eq 0) {
    Add-Check "gas.arquivo" "fail" "AppsScript_v*.gs ausente"
  } else {
    $canonical = $gsFiles[0].FullName
    $gasVer = Read-GasVersion $canonical
    Add-Check "gas.arquivo" "ok" ("{0} v{1}" -f $gsFiles[0].Name, $gasVer)
  }

  $indexRaw = Get-Content -Path (Join-Path $root "index.html") -Raw -Encoding UTF8
  $badTags = Read-ZcCacheBust $indexRaw $appVer
  if ($badTags.Count -gt 0) {
    Add-Check "versao.index-cache-bust" "fail" ("zc-*.js desalinhado: " + ($badTags -join ", "))
  } else {
    Add-Check "versao.index-cache-bust" "ok" ("zc-* ?v=" + $appVer)
  }

  if ($indexRaw -notmatch 'AKfycbx1MKIovW80bcjwRcqoGG88Oyh24N6UQdO9BjTcowMkq2iDLUiqhokUPQ2Hf_d5w_8yLg') {
    Add-Check "gas.deploy-id" "fail" "WEB_APP Deploy ID ausente ou alterado"
  } else {
    Add-Check "gas.deploy-id" "ok" "Deploy ID canonico"
  }

  if ($indexRaw -notmatch 'function apiGet\(' -and -not (Test-Path (Join-Path $root "zc-api.js"))) {
    Add-Check "api.get-pattern" "warn" "apiGet nao encontrado"
  } else {
    Add-Check "api.get-pattern" "ok" "apiGet presente (zc-api.js ou inline)"
  }

  foreach ($doc in @("AGENTS.md", "docs/ativos/HANDOFF_NOVO_CHAT.md", "docs/ativos/ESTADO_ATUAL.md")) {
    $p = Join-Path $root $doc
    if (-not (Test-Path $p)) {
      Add-Check ("docs." + ($doc -replace '[/\\]', '.')) "fail" "ausente: $doc"
    }
  }
  $docFails = @($result.checks | Where-Object { $_.name -like 'docs.*' -and $_.status -eq 'fail' })
  if ($docFails.Count -eq 0) {
    Add-Check "docs.governanca" "ok" "AGENTS + HANDOFF + ESTADO"
  }

  if (-not $SkipNetworkTests) {
    $pingScript = Join-Path $root "scripts/testes/TESTE_PING_READONLY.ps1"
    if (Test-Path $pingScript) {
      $pingOut = & $pingScript 2>&1 | Out-String
      if ($LASTEXITCODE -ne 0) {
        Add-Check "network.ping" "fail" "exit=$LASTEXITCODE"
      } else {
        Add-Check "network.ping" "ok" (($pingOut -split "`n" | Select-Object -Last 3) -join " | ")
      }
    } else {
      Add-Check "network.ping" "warn" "TESTE_PING_READONLY.ps1 ausente"
    }
  } else {
    Add-Check "network.ping" "ok" "skipped"
  }

} catch {
  Add-Check "exception" "fail" $_.Exception.Message
}

Write-Host ""
foreach ($c in $result.checks) {
  $color = switch ($c.status) { "ok" { "Green" } "warn" { "Yellow" } default { "Red" } }
  Write-Host ("[{0}] {1} — {2}" -f $c.status.ToUpper(), $c.name, $c.detail) -ForegroundColor $color
}

Write-Host ""
Write-Host ("STATUS: {0}" -f $result.status.ToUpper()) -ForegroundColor $(if ($result.status -eq "ok") { "Green" } elseif ($result.status -eq "warn") { "Yellow" } else { "Red" })

if ($result.status -eq "fail") { exit 1 }
exit 0
