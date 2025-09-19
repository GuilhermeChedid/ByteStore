const express = require('express');
const cors = require('cors');
const db = require('./database.js'); // Garante que você está usando o database.js com as colunas de endereço

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// --- Rota de Cadastro CORRIGIDA ---
app.post('/cadastro', (req, res) => {
    // Coleta todos os dados do corpo da requisição
    const { nome, email, senha, cep, estado, bairro, quadra, complemento } = req.body;

    // Validação básica para os campos essenciais
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const sql = `INSERT INTO usuarios (nome, email, senha, cep, estado, bairro, quadra, complemento)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Parâmetros na ordem correta das colunas
    const params = [nome, email, senha, cep || null, estado || null, bairro || null, quadra || null, complemento || null];

    db.run(sql, params, function(err) {
        if (err) {
            // Se o e-mail já existir, o erro de "UNIQUE constraint" será capturado aqui
            console.error("Erro no banco de dados:", err.message);
            return res.status(400).json({ "error": "Não foi possível realizar o cadastro. O e-mail pode já estar em uso." });
        }
        // Se a inserção for bem-sucedida
        res.status(201).json({ "message": "Usuário cadastrado com sucesso!", "userId": this.lastID });
    });
});


// --- Rota de Login (Revisada para consistência) ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error("Erro no banco de dados:", err.message);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        if (!row || row.senha !== senha) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        // Retorna todos os dados do usuário, incluindo o endereço
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: row
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});