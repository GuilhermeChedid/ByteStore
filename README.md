(PROJETO)

# 🛍️ ByteStore - Loja Online de Roupas

Bem-vindo ao **ByteStore**, uma moderna loja online de roupas desenvolvida com Node.js, Express e MySQL.

## 📋 Sobre o Projeto

ByteStore é uma plataforma completa de e-commerce para venda de roupas, com sistema de autenticação, carrinho de compras e gerenciamento de pedidos.

### ✨ Funcionalidades

- 🔐 **Autenticação de Usuários**
  - Cadastro com validação de email
  - Login seguro com senha criptografada (bcrypt)
  - Recuperação de senha
  - Alteração de senha no perfil

- 👤 **Perfil do Usuário**
  - Gerenciamento de dados pessoais
  - Atualização de endereço
  - Exclusão de conta

- 🛒 **E-commerce**
  - Catálogo de produtos (Masculino/Feminino)
  - Carrinho de compras
  - Sistema de pedidos
  - Nota fiscal

- 📍 **Integração com API ViaCEP**
  - Preenchimento automático de endereço por CEP

## 🚀 Início Rápido

### Instalação Automática

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
install.bat
```

### Instalação Manual

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar banco de dados:**
```bash
npm run setup-db
```

3. **Iniciar servidor:**
```bash
npm start
```

4. **Acessar aplicação:**
```
http://localhost:3000/home.html
```

## 📖 Documentação Completa

Para instruções detalhadas de instalação e configuração, consulte:
- [README_INSTALACAO.md](README_INSTALACAO.md) - Guia completo de instalação

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver MySQL para Node.js
- **bcrypt** - Criptografia de senhas
- **CORS** - Middleware para permitir requisições cross-origin

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização
- **JavaScript** - Interatividade
- **Fetch API** - Comunicação com backend

### Banco de Dados
- **MySQL** - Sistema de gerenciamento de banco de dados

## 📁 Estrutura do Projeto

```
ByteStore/
├── bytestore-frontend/       # Frontend da aplicação
│   ├── home.html            # Página inicial
│   ├── minha_conta.html     # Login/Cadastro
│   ├── perfil.html          # Perfil do usuário
│   ├── masculina.html       # Produtos masculinos
│   ├── feminina.html        # Produtos femininos
│   ├── carrinho.html        # Carrinho de compras
│   ├── sobre.html           # Sobre a loja
│   ├── css/                 # Arquivos de estilo
│   ├── imagens/             # Imagens do site
│   └── js/                  # Scripts frontend (não confundir com /js)
├── js/                      # Backend Node.js
│   ├── server.js           # Servidor Express + Rotas API
│   ├── database.js         # Conexão com MySQL
│   ├── setup-database.js   # Script de configuração do BD
│   ├── minha_conta.js      # Lógica da conta de usuário
│   └── script.js           # Scripts gerais
├── bytestore.sql           # Script SQL do banco de dados
├── package.json            # Dependências do projeto
├── install.sh              # Instalador Linux/Mac
├── install.bat             # Instalador Windows
├── README.md               # Este arquivo
└── README_INSTALACAO.md    # Guia detalhado de instalação
```

## 🔌 API Endpoints

### Autenticação
- `POST /cadastro` - Registrar novo usuário
- `POST /login` - Fazer login

### Gerenciamento de Senha
- `POST /redefinir-senha` - Redefinir senha (esqueci)
- `POST /alterar-senha` - Alterar senha (perfil)

### Perfil
- `POST /atualizar-endereco` - Atualizar endereço
- `POST /solicitar-exclusao` - Excluir conta

### Utilidades
- `GET /health` - Status do servidor

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Validação de email (domínios permitidos)
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Validação de dados no frontend e backend

## 📊 Banco de Dados

### Tabelas

1. **usuarios** - Dados dos usuários cadastrados
2. **produtos** - Catálogo de produtos
3. **carrinho** - Itens no carrinho de cada usuário
4. **pedidos** - Histórico de pedidos
5. **itens_pedido** - Detalhes dos itens de cada pedido

Veja o schema completo em [bytestore.sql](bytestore.sql)

## 🧪 Testes

### Testar o servidor
```bash
curl http://localhost:3000/health
```

### Testar cadastro
```bash
curl -X POST http://localhost:3000/cadastro 
  -H "Content-Type: application/json" 
  -d '{"nome":"Teste","email":"teste@gmail.com","senha":"123456"}'
```

## 📝 Scripts NPM

```bash
npm start        # Inicia o servidor
npm run dev      # Inicia com nodemon (auto-reload)
npm run setup-db # Configura o banco de dados
```

## 🐛 Solução de Problemas

Consulte a seção de solução de problemas em [README_INSTALACAO.md](README_INSTALACAO.md#-solução-de-problemas)

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido pela equipe ByteStore.

## 📄 Licença

ISC License

## 📞 Suporte

Para dúvidas e suporte:
1. Verifique a documentação completa em [README_INSTALACAO.md](README_INSTALACAO.md)
2. Consulte os logs do servidor
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ pela equipe ByteStore**

O ByteStore é um projeto de e-commerce de moda desenvolvido para o ambiente acadêmico, com foco 
em uma experiência de compra online fluida e moderna. A plataforma foi concebida para ser mais 
do que apenas uma loja virtual, mas sim um espaço que combina tecnologia de ponta com um design 
intuitivo, permitindo que os usuários naveguem e comprem roupas de forma fácil e segura.

//Principais Características

Gestão de Produtos: A plataforma conta com um sistema robusto para a administração de produtos. 
Os administradores podem adicionar, editar ou remover itens, gerenciar estoques, definir preços 
e incluir descrições detalhadas e fotos de alta qualidade.

Carrinho de Compras: O processo de compra é direto e seguro. O carrinho de compras permite que os 
usuários adicionem e removam produtos facilmente. O checkout é simplificado, com um formulário de 
dados enxuto e suporte para diferentes métodos de pagamento.

//Tecnologias Utilizadas

O projeto foi construído usando uma stack de tecnologias moderna, que reflete as melhores práticas 
do mercado de desenvolvimento web:

Frontend: A estilização foi feita com CSS e frameworks para garantir um design coeso e atraente. 
A estrutura do site foi feita com HTML.

Backend: Construído com .js, oferecendo para a comunicação entre o 
frontend e o banco de dados.

Banco de Dados: Em estudo.

---------------------------------------------------------------------------------------------------------------------------------------------

MEMBROS DO GRUPO:

//Aquiles Leandro Alves Rocha: Gerente de Projeto / GP

Responsável por planejar, executar e monitorar o projeto. Ele define prazos e atua como a principal 
ponte de comunicação entre a equipe e as partes interessadas. É o líder que garante que o projeto 
seja entregue no prazo e dentro do escopo. 

//Danilo Pereira Braga: Analista de Requisitos / Testador

Como Analista de Requisitos, ele pode ser responsável por coletar e documentar as necessidades dos 
clientes e do projeto. Como Testador, ele garante a qualidade do produto final, identificando bugs 
e validando se o sistema atende aos requisitos definidos. Ele trabalha em estreita colaboração com 
os desenvolvedores para garantir que o produto esteja livre de falhas antes do lançamento.

// Hanniel Santos de Alencar e Guilherme Santos Chedid: Desenvolvedores / DEVS

Responsáveis por escrever o código, construir as funcionalidades do sistema e integrar as diferentes
partes do projeto. Eles trabalham em conjunto para resolver problemas técnicos, implementar as 
funcionalidades planejadas e garantir a qualidade e o bom funcionamento do software.

