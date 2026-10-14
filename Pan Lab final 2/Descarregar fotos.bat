@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist imagens mkdir imagens
echo A descarregar as fotos das receitas (Unsplash)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Encoding UTF8 'fotos-lista.txt' | ForEach-Object { if ($_ -match '\|') { $p = $_.Split('|'); try { Invoke-WebRequest -Uri $p[1] -OutFile $p[0] -UseBasicParsing; Write-Host ('OK      ' + $p[0]) } catch { Write-Host ('FALHOU  ' + $p[0]) } } }"
echo.
echo Concluido. Abre o index.html.
pause
