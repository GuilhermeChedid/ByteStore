# 📊 Documentação da API - ByteStore

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1️⃣ Autenticação

#### Cadastro de Usuário
**POST** `/cadastro`

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@gmail.com",
  "senha": "senha123",
  "cep": "12345-678",
  "estado": "SP",
  "cidade": "São Paulo",
  "bairro": "Centro",
  "quadra": "Rua Principal",
  "complemento": "Apto 101"
}
```

**Campos obrigatórios:** `nome`, `email`, `senha`

**Response (201 - Sucesso):**
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "userId": 1
}
```

**Response (400 - Erro):**
```json
{
  "error": "Não foi possível realizar o cadastro. O e-mail pode já estar em uso."
}
```

---

#### Login
**POST** `/login`

**Request Body:**
```json
{
  "email": "joao@gmail.com",
  "senha": "senha123"
}
```

**Response (200 - Sucesso):**
```json
{
  "message": "Login bem-sucedido!",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "cep": "12345-678",
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro",
    "quadra": "Rua Principal",
    "complemento": "Apto 101",
    "created_at": "2025-11-19T...",
    "updated_at": "2025-11-19T..."
  }
}
```

**Response (401 - Erro):**
```json
{
  "error": "Email ou senha inválidos."
}
```

---

### 2️⃣ Gerenciamento de Senha

#### Redefinir Senha (Esqueci minha senha)
**POST** `/redefinir-senha`

**Request Body:**
```json
{
  "email": "joao@gmail.com",
  "novaSenha": "novaSenha456"
}
```

**Response (200 - Sucesso):**
```json
{
  "message": "Senha redefinida com sucesso."
}
```

**Response (404 - Erro):**
```json
{
  "error": "Email não encontrado."
}
```

---

#### Alterar Senha (No Perfil)
**POST** `/alterar-senha`

**Request Body:**
```json
{
  "email": "joao@gmail.com",
  "senhaAtual": "senha123",
  "novaSenha": "novaSenha789"
}
```

**Response (200 - Sucesso):**
```json
{
  "message": "Senha alterada com sucesso."
}
```

**Response (401 - Erro):**
```json
{
  "error": "Senha atual incorreta."
}
```

---

### 3️⃣ Perfil do Usuário

#### Atualizar Endereço
**POST** `/atualizar-endereco`

**Request Body:**
```json
{
  "email": "joao@gmail.com",
  "cep": "98765-432",
  "estado": "RJ",
  "cidade": "Rio de Janeiro",
  "bairro": "Copacabana",
  "quadra": "Av. Atlântica",
  "complemento": "Casa 2"
}
```

**Response (200 - Sucesso):**
```json
{
  "message": "Endereço atualizado com sucesso."
}
```

**Response (404 - Erro):**
```json
{
  "error": "Usuário não encontrado."
}
```

---

#### Solicitar Exclusão de Conta
**POST** `/solicitar-exclusao`

**Request Body:**
```json
{
  "email": "joao@gmail.com"
}
```

**Response (200 - Sucesso):**
```json
{
  "message": "Usuário excluído com sucesso."
}
```

**Response (404 - Erro):**
```json
{
  "error": "Usuário não encontrado."
}
```

---

### 4️⃣ Utilidades

#### Health Check
**GET** `/health`

**Response (200):**
```json
{
  "ok": true,
  "time": "2025-11-19T10:30:00.000Z"
}
```

---

## 🔒 Validações

### Email
- **Domínios permitidos:**
  - @gmail.com
  - @gmail.com.br
  - @hotmail.com
  - @outlook.com
  - @outlook.com.br
  - @yahoo.com
  - @yahoo.com.br

### Senha
- Criptografada com bcrypt (10 salt rounds)
- Nunca é retornada nas respostas (exceto durante login, comparação é feita internamente)

### CEP
- Formato: `12345-678` ou `12345678`
- Validação no frontend

### Estado
- Código UF com 2 caracteres (ex: SP, RJ, MG)

---

## 🧪 Exemplos com cURL

### Cadastro
```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@gmail.com",
    "senha": "maria123",
    "cep": "01310-100",
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro",
    "quadra": "Av. Paulista",
    "complemento": "Sala 500"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com",
    "senha": "maria123"
  }'
```

### Redefinir Senha
```bash
curl -X POST http://localhost:3000/redefinir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com",
    "novaSenha": "novaSenha123"
  }'
```

### Alterar Senha
```bash
curl -X POST http://localhost:3000/alterar-senha \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com",
    "senhaAtual": "maria123",
    "novaSenha": "novaSenha456"
  }'
```

### Atualizar Endereço
```bash
curl -X POST http://localhost:3000/atualizar-endereco \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com",
    "cep": "22070-002",
    "estado": "RJ",
    "cidade": "Rio de Janeiro",
    "bairro": "Copacabana",
    "quadra": "Av. Nossa Senhora de Copacabana",
    "complemento": "Apto 302"
  }'
```

### Excluir Conta
```bash
curl -X POST http://localhost:3000/solicitar-exclusao \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com"
  }'
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## 📝 Códigos de Status HTTP

- **200** - OK (Requisição bem-sucedida)
- **201** - Created (Recurso criado com sucesso)
- **400** - Bad Request (Dados inválidos)
- **401** - Unauthorized (Credenciais inválidas)
- **404** - Not Found (Recurso não encontrado)
- **500** - Internal Server Error (Erro no servidor)

---

## 🔐 Segurança

- Todas as senhas são criptografadas com bcrypt antes de serem salvas
- Prepared statements são usados para prevenir SQL Injection
- CORS habilitado para permitir requisições do frontend
- Validação de email no backend e frontend
- Senhas nunca são retornadas nas respostas da API (exceto para comparação interna)

---

## 📞 Suporte

Para mais informações, consulte:
- [README.md](README.md) - Visão geral do projeto
- [README_INSTALACAO.md](README_INSTALACAO.md) - Guia de instalação
- [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Comandos rápidos
