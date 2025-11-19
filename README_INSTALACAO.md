# 🚀 Guia de Instalação - ByteStore

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MySQL](https://www.mysql.com/) (versão 5.7 ou superior)
- [XAMPP](https://www.apachefriends.org/) ou outro servidor MySQL (opcional)

## 🎯 Instalação Rápida

### Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

### Windows
```cmd
install.bat
```

## 📋 Instalação Manual

### 1. Configurar o Banco de Dados MySQL

#### Opção A: Usando o Script Automático

```bash
# Instalar dependências primeiro
npm install

# Configurar banco de dados
npm run setup-db
```

#### Opção B: Usando XAMPP

1. Inicie o XAMPP
2. Inicie os serviços Apache e MySQL
3. Acesse http://localhost/phpmyadmin
4. Clique em "Importar"
5. Selecione o arquivo `bytestore.sql`
6. Clique em "Executar"

#### Opção C: Usando MySQL via Terminal

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o arquivo SQL
source /caminho/completo/para/bytestore.sql

# ou copie e cole o conteúdo do arquivo SQL
```

### 2. Instalar Dependências do Node.js

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso irá instalar:
- express (servidor web)
- cors (permitir requisições cross-origin)
- mysql2 (driver MySQL para Node.js)
- bcrypt (criptografia de senhas)

### 3. Configurar a Conexão com o Banco de Dados

Edite o arquivo `js/database.js` e ajuste as credenciais:

```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // SEU usuário MySQL
    password: '',           // SUA senha MySQL (vazio por padrão no XAMPP)
    database: 'bytestore'
});
```

### 4. Iniciar o Servidor

```bash
# Modo normal
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

O servidor estará rodando em: http://localhost:3000

### 5. Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000/home.html
```

## 📡 Estrutura das Rotas da API

### Autenticação
- `POST /cadastro` - Cadastrar novo usuário
  ```json
  {
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "senha": "senha123",
    "cep": "12345-678",
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro",
    "quadra": "Rua A",
    "complemento": "Apto 101"
  }
  ```

- `POST /login` - Fazer login
  ```json
  {
    "email": "joao@gmail.com",
    "senha": "senha123"
  }
  ```

### Gerenciamento de Senha
- `POST /redefinir-senha` - Redefinir senha (esqueci minha senha)
  ```json
  {
    "email": "joao@gmail.com",
    "novaSenha": "novaSenha123"
  }
  ```

- `POST /alterar-senha` - Alterar senha (no perfil)
  ```json
  {
    "email": "joao@gmail.com",
    "senhaAtual": "senha123",
    "novaSenha": "novaSenha456"
  }
  ```

### Perfil do Usuário
- `POST /atualizar-endereco` - Atualizar endereço do usuário
  ```json
  {
    "email": "joao@gmail.com",
    "cep": "12345-678",
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro",
    "quadra": "Rua B",
    "complemento": "Casa"
  }
  ```

- `POST /solicitar-exclusao` - Excluir conta
  ```json
  {
    "email": "joao@gmail.com"
  }
  ```

### Saúde do Servidor
- `GET /health` - Verificar status do servidor

## ✅ Testando a Conexão

### 1. Testar o Servidor
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{"ok": true, "time": "2025-11-19T..."}
```

### 2. Testar Cadastro (usando curl)
```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@gmail.com",
    "senha": "teste123"
  }'
```

### 3. Testar Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@gmail.com",
    "senha": "teste123"
  }'
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

1. **usuarios** - Armazena dados dos usuários
   - id (INT, PK, AUTO_INCREMENT)
   - nome (VARCHAR)
   - email (VARCHAR, UNIQUE)
   - senha (VARCHAR) - Criptografada com bcrypt
   - cep, estado, cidade, bairro, quadra, complemento
   - created_at, updated_at (TIMESTAMP)

2. **produtos** - Catálogo de produtos
   - id, nome, descricao, preco, categoria, estoque, imagem

3. **carrinho** - Itens no carrinho do usuário
   - id, usuario_id (FK), produto_id (FK), quantidade

4. **pedidos** - Histórico de pedidos
   - id, usuario_id (FK), total, status, endereco_entrega

5. **itens_pedido** - Itens de cada pedido
   - id, pedido_id (FK), produto_id (FK), quantidade, preco_unitario

## 🔧 Solução de Problemas

### Erro: "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### Erro: "Cannot find module 'bcrypt'"
```bash
npm install bcrypt

# Se falhar no Windows, tente:
npm install bcrypt --force
```

### Erro: "ECONNREFUSED" ao conectar ao MySQL
1. Verifique se o MySQL está rodando
   - Windows (XAMPP): Inicie o serviço MySQL no painel do XAMPP
   - Linux: `sudo service mysql start`
2. Verifique as credenciais em `js/database.js`
3. Verifique se o banco de dados 'bytestore' foi criado
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### Erro: "Port 3000 already in use"
Opção 1: Finalize o processo na porta 3000
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Opção 2: Altere a porta no `js/server.js`
```javascript
const port = 3001; // ou outra porta disponível
```

### Erro ao importar o banco de dados
```bash
# Verifique se o MySQL está acessível
mysql -u root -p

# Se der erro de autenticação, redefina a senha
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

### XAMPP - MySQL não inicia
1. Verifique se a porta 3306 não está em uso
2. Verifique os logs em: `xampp/mysql/data/mysql_error.log`
3. Tente reiniciar o XAMPP como administrador

## 🎨 Scripts Disponíveis

```bash
npm start       # Inicia o servidor
npm run dev     # Inicia com nodemon (auto-reload)
npm run setup-db # Configura o banco de dados
```

## 🔐 Segurança

- ✅ Senhas criptografadas usando bcrypt (salt rounds: 10)
- ✅ Validação de email (domínios permitidos: gmail, hotmail, outlook, yahoo)
- ✅ Proteção contra SQL injection (prepared statements)
- ✅ CORS configurado
- ✅ Validação de dados no backend

## 📁 Estrutura de Arquivos

```
ByteStore/
├── bytestore-frontend/    # Arquivos do frontend
│   ├── *.html            # Páginas HTML
│   ├── css/              # Estilos
│   ├── imagens/          # Imagens
│   └── js/               # Scripts do frontend (não confundir com /js)
├── js/                   # Backend Node.js
│   ├── server.js         # Servidor Express
│   ├── database.js       # Conexão MySQL
│   ├── setup-database.js # Script de configuração do BD
│   └── minha_conta.js    # Lógica da conta
├── bytestore.sql         # Script SQL
├── package.json          # Dependências
├── install.sh            # Instalador Linux/Mac
└── install.bat           # Instalador Windows
```

## 📞 Contato e Suporte

Para problemas ou dúvidas:
1. Verifique a seção de "Solução de Problemas"
2. Consulte os logs do servidor no terminal
3. Verifique os logs do MySQL
4. Entre em contato com a equipe de desenvolvimento

## 🎓 Desenvolvimento

Este projeto foi desenvolvido como parte do curso de desenvolvimento web.

**Tecnologias Utilizadas:**
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Banco de Dados: MySQL
- Segurança: bcrypt para hash de senhas
- API: RESTful
