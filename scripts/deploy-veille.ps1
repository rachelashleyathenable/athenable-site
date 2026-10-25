# Met en ligne la veille financement automatique (connecteur Claude + cron).
# A lancer depuis le dossier du site :  powershell -ExecutionPolicy Bypass -File scripts\deploy-veille.ps1
# Les secrets sont lus dans .env.local : ils ne s'affichent jamais a l'ecran.

$ErrorActionPreference = "Continue"
Set-Location (Split-Path $PSScriptRoot -Parent)

$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$') { $envVars[$Matches[1]] = $Matches[2].Trim('"') }
}
$names = "CRON_SECRET", "VEILLE_MCP_TOKEN_MINOVA", "VEILLE_MODEL"
foreach ($n in $names) { if (-not $envVars[$n]) { Write-Host "$n manque dans .env.local" -ForegroundColor Yellow; exit 1 } }

Write-Host "1/3  Variables d'environnement sur Vercel..." -ForegroundColor Cyan
foreach ($n in $names) {
  # Supprime l'ancienne valeur si elle existe (une erreur ici est normale la premiere fois)
  cmd /c "vercel env rm $n production -y >nul 2>&1"
  # On passe par un fichier temporaire + redirection cmd plutot que le pipeline PowerShell :
  # ce dernier ajoute un \r\n en fin de chaine sur stdin, et vercel ne retire que le \n,
  # laissant un \r traine dans la valeur stockee (rejete par Vercel pour CRON_SECRET).
  $tmp = [System.IO.Path]::GetTempFileName()
  [System.IO.File]::WriteAllText($tmp, $envVars[$n])
  cmd /c "vercel env add $n production < `"$tmp`""
  $addExit = $LASTEXITCODE
  Remove-Item $tmp -Force
  if ($addExit -ne 0) { Write-Host "     $n : echec (voir le message ci-dessus)" -ForegroundColor Yellow; exit 1 }
  Write-Host "     $n ok"
}

Write-Host "2/3  Deploiement en production..." -ForegroundColor Cyan
vercel --prod --yes
if ($LASTEXITCODE -ne 0) { Write-Host "Le deploiement a echoue (voir le message ci-dessus)." -ForegroundColor Yellow; exit 1 }

Write-Host "3/3  Premiere veille (1 a 3 minutes)..." -ForegroundColor Cyan
$site = "https://athenable.app"
try {
  $r = Invoke-RestMethod -Uri "$site/api/cron/veille" -Headers @{ Authorization = "Bearer $($envVars['CRON_SECRET'])" } -TimeoutSec 300
  $r.results | Format-Table -AutoSize
} catch {
  Write-Host "La premiere veille a echoue : $($_.Exception.Message)" -ForegroundColor Yellow
}

$url = "$site/api/mcp/$($envVars['VEILLE_MCP_TOKEN_MINOVA'])"
Set-Clipboard -Value $url
Write-Host ""
Write-Host "Termine. L'adresse du connecteur est copiee dans ton presse-papiers." -ForegroundColor Green
Write-Host "Dans Claude > Customize > Connectors > ajouter un connecteur personnalise : nom 'Athenable', colle l'adresse."
