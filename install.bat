@echo off
echo =========================
echo Instalacao do ByteStore
echo =========================
echo.

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version

REM Verificar se o npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)

echo [OK] npm encontrado
npm --version
echo.

REM Instalar dependências
echo Instalando dependencias...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo [OK] Dependencias instaladas com sucesso
echo.

REM Configurar banco de dados
echo Configurando banco de dados...
call npm run setup-db

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Instalacao concluida com sucesso!
    echo ========================================
    echo.
    echo Para iniciar o servidor, execute:
    echo   npm start
    echo.
    echo O servidor estara disponivel em: http://localhost:3000
    echo.
) else (
    echo.
    echo [AVISO] Nao foi possivel configurar o banco de dados automaticamente.
    echo Por favor, configure manualmente:
    echo   1. Inicie o MySQL (XAMPP)
    echo   2. Execute: npm run setup-db
    echo   3. Ou importe o arquivo bytestore.sql no phpMyAdmin
    echo.
)

pause
