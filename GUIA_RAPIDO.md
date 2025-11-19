# 📌 Guia Rápido - ByteStore

## 🚀 Comandos Essenciais

### Primeira Instalação
```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run setup-db

# Iniciar servidor
npm start
```

### Uso Diário
```bash
# Iniciar servidor (modo normal)
npm start

# Iniciar servidor (modo desenvolvimento com auto-reload)
npm run dev
```

### Acessar a Aplicação
```
http://localhost:3000/home.html
```

## 🔧 Configuração do MySQL

### Credenciais Padrão (XAMPP)
- Host: `localhost`
- Usuário: `root`
- Senha: `` (vazio)
- Banco: `bytestore`

### Alterar Credenciais
Edite: `js/database.js`

## 📡 Testar API

### Verificar servidor
```bash
curl http://localhost:3000/health
```

### Cadastrar usuário
```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "senha": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@gmail.com",
    "senha": "senha123"
  }'
```

## 🐛 Problemas Comuns

### MySQL não conecta
1. Verifique se o MySQL está rodando
2. Verifique as credenciais em `js/database.js`
3. Execute: `npm run setup-db`

### Porta 3000 em uso
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
# Depois: taskkill /PID <numero> /F
```

### Erro ao instalar bcrypt
```bash
npm install bcrypt --force
```

## 📁 Arquivos Importantes

- `js/server.js` - Servidor e rotas da API
- `js/database.js` - Conexão com MySQL
- `bytestore.sql` - Schema do banco de dados
- `package.json` - Dependências do projeto

## 🔐 Emails Permitidos

- @gmail.com / @gmail.com.br
- @hotmail.com
- @outlook.com / @outlook.com.br
- @yahoo.com / @yahoo.com.br

## 📞 Precisa de Ajuda?

Consulte: [README_INSTALACAO.md](README_INSTALACAO.md)
