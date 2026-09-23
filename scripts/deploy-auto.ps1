param(
  [string]$ProjectName = "",
  [string]$SiteUrl = "",
  [switch]$FreshDatabase
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$Text) {
  Write-Host "`n==> $Text" -ForegroundColor Cyan
}

function Fail([string]$Text) {
  Write-Host "`nERRO: $Text" -ForegroundColor Red
  exit 1
}

function Run-Vercel {
  param(
    [Parameter(Mandatory=$true)][string[]]$Arguments,
    [switch]$AllowFailure,
    [switch]$Capture
  )
  if ($Capture) {
    $out = & $script:Npx --yes vercel@latest @Arguments 2>&1 | Out-String
    $code = $LASTEXITCODE
    if (-not $AllowFailure -and $code -ne 0) { throw $out }
    return [PSCustomObject]@{ Code = $code; Output = $out }
  }
  & $script:Npx --yes vercel@latest @Arguments
  $code = $LASTEXITCODE
  if (-not $AllowFailure -and $code -ne 0) { throw "Vercel CLI falhou: $($Arguments -join ' ')" }
  return $code
}

$originalPath = (Get-Location).Path

# Keep npx temporary packages out of the Windows user profile.
# This also avoids failures when USERPROFILE contains characters such as "&".
$cleanCache = "C:\VercelDeployCache\npm"
New-Item -ItemType Directory -Force -Path $cleanCache | Out-Null
$env:npm_config_cache = $cleanCache
$configPath = Join-Path $originalPath "deploy.config.json"
if (-not (Test-Path $configPath)) { Fail "deploy.config.json nao encontrado. Rode este script na raiz do projeto." }

$config = Get-Content $configPath -Raw | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($ProjectName)) { $ProjectName = [string]$config.projectName }
if ([string]::IsNullOrWhiteSpace($SiteUrl)) { $SiteUrl = [string]$config.siteUrl }
$neonName = [string]$config.neon.resourceName
$neonPlan = [string]$config.neon.plan
$neonRegion = [string]$config.neon.region
$environments = @($config.vercel.environments)

if ([string]::IsNullOrWhiteSpace($ProjectName)) { Fail "projectName vazio em deploy.config.json" }
if ([string]::IsNullOrWhiteSpace($SiteUrl)) { Fail "siteUrl vazio em deploy.config.json" }

# npm/npx has known problems on some Windows setups when the user profile path contains '&'.
# Map the project to V: so all CLI commands run from a clean path without copying files.
$substCreated = $false
if ($originalPath -match '&') {
  Step "Criando caminho temporario V:\ para evitar o caractere & do Windows"
  cmd /c "subst V: `"$originalPath`"" | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail "Nao foi possivel criar V:. Mova o projeto para C:\Projetos e rode novamente." }
  Set-Location "V:\"
  $substCreated = $true
}

try {
  $script:Npx = (Get-Command npx.cmd -ErrorAction Stop).Source
} catch {
  Fail "Node.js/npm nao encontrado. Instale Node.js LTS uma unica vez e rode novamente."
}

try {
  Step "Validando login da Vercel"
  $who = Run-Vercel -Arguments @("whoami") -AllowFailure -Capture
  if ($who.Code -ne 0) {
    Write-Host "Primeiro uso: a Vercel vai abrir o login do GitHub. Isso acontece uma unica vez." -ForegroundColor Yellow
    Run-Vercel -Arguments @("login", "--github") | Out-Null
  }

  Step "Criando ou vinculando projeto Vercel: $ProjectName"
  Run-Vercel -Arguments @("link", "--yes", "--project", $ProjectName) | Out-Null

  if (Test-Path ".git") {
    Step "Conectando o repositorio GitHub ao projeto Vercel"
    Run-Vercel -Arguments @("git", "connect", "--yes") -AllowFailure | Out-Null
  }

  Step "Verificando banco Neon conectado"
  $prodEnv = Run-Vercel -Arguments @("env", "ls", "production") -AllowFailure -Capture
  $hasDatabaseUrl = $prodEnv.Output -match "(?m)^.*DATABASE_URL.*$"
  $hasUnpooled = $prodEnv.Output -match "(?m)^.*DATABASE_URL_UNPOOLED.*$"

  if ($FreshDatabase -or -not ($hasDatabaseUrl -and $hasUnpooled)) {
    if ($hasDatabaseUrl -and -not $hasUnpooled) {
      Write-Host "Foi encontrada uma DATABASE_URL incompleta para Prisma/Neon. O script vai substituir por um Neon gerenciado pela Vercel." -ForegroundColor Yellow
      foreach ($envName in @("production", "preview", "development")) {
        Run-Vercel -Arguments @("env", "rm", "DATABASE_URL", $envName, "--yes") -AllowFailure | Out-Null
        Run-Vercel -Arguments @("env", "rm", "DATABASE_URL_UNPOOLED", $envName, "--yes") -AllowFailure | Out-Null
      }
    }

    Step "Provisionando Neon automaticamente e conectando ao projeto"
    $args = @(
      "integration", "add", "neon",
      "--name", $neonName,
      "--plan", $neonPlan,
      "--metadata", "region=$neonRegion",
      "--environment", "production",
      "--environment", "preview",
      "--environment", "development"
    )
    Run-Vercel -Arguments $args | Out-Null
  } else {
    Write-Host "Neon ja configurado. Nao sera criado outro banco." -ForegroundColor Green
  }

  Step "Configurando URL publica do site"
  foreach ($envName in $environments) {
    $SiteUrl | & $script:Npx --yes vercel@latest env add NEXT_PUBLIC_SITE_URL $envName --force
    if ($LASTEXITCODE -ne 0) { throw "Falha ao configurar NEXT_PUBLIC_SITE_URL em $envName" }
  }

  Step "Confirmando variaveis obrigatorias"
  $prodEnv2 = Run-Vercel -Arguments @("env", "ls", "production") -Capture
  if ($prodEnv2.Output -notmatch "DATABASE_URL") { throw "DATABASE_URL nao foi criada." }
  if ($prodEnv2.Output -notmatch "DATABASE_URL_UNPOOLED") { throw "DATABASE_URL_UNPOOLED nao foi criada." }

  Step "Fazendo deploy de producao"
  $deployment = Run-Vercel -Arguments @("deploy", "--prod", "--yes") -Capture
  if ($deployment.Code -ne 0) { throw $deployment.Output }
  Write-Host $deployment.Output

  # Attach the canonical domain. DNS at an external registrar may still need one-time configuration.
  try {
    $uri = [Uri]$SiteUrl
    $domain = $uri.Host
    if (-not [string]::IsNullOrWhiteSpace($domain) -and $domain -notlike "*.vercel.app") {
      Step "Vinculando dominio $domain ao projeto"
      Run-Vercel -Arguments @("domains", "add", $domain, $ProjectName) -AllowFailure | Out-Null
    }
  } catch {
    Write-Host "Dominio nao foi vinculado automaticamente. O deploy principal foi concluido." -ForegroundColor Yellow
  }

  Write-Host "`nDEPLOY AUTOMATICO CONCLUIDO." -ForegroundColor Green
  Write-Host "Projeto: $ProjectName"
  Write-Host "Site:    $SiteUrl"
  Write-Host "GitHub:  conectado quando o repositorio local possui remote origin"
  Write-Host "Neon:    conectado e variaveis criadas automaticamente"
}
catch {
  Write-Host "`nFalha no deploy automatico:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}
finally {
  if ($substCreated) {
    Set-Location "C:\"
    cmd /c "subst V: /d" | Out-Null
  }
}
