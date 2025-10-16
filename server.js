const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Validação de email permitido (mesma regra do front)
const allowedEmailRegex = /^[^\s@]+@((gmail\.com(\.br)?)|(hotmail\.com)|(outlook\.com(\.br)?)|(yahoo\.com(\.br)?))$/i;
function isAllowedEmail(email) {
    return allowedEmailRegex.test(String(email || '').trim());
}


app.post('/cadastro', (req, res) => {
    // Coleta todos os dados do corpo da requisição
    const { nome, email, senha, cep, estado, bairro, quadra, complemento } = req.body;

    // Validação básica para os campos essenciais
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    // Validação de domínio permitido
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
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

    // Validação de domínio permitido
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    }
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

// Redefinir senha (Esqueci): define nova senha se o email existir
app.post('/redefinir-senha', (req, res) => {
    const { email, novaSenha } = req.body;
    console.log('[POST /redefinir-senha]', { email });
    if (!email || !novaSenha) return res.status(400).json({ error: 'Email e nova senha são obrigatórios.' });
    if (!isAllowedEmail(email)) return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    const sql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
    db.run(sql, [novaSenha, email], function(err) {
        if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
        if (this.changes === 0) return res.status(404).json({ error: 'Email não encontrado.' });
        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    });
});

// Alterar senha (no perfil): exige senha atual correta
app.post('/alterar-senha', (req, res) => {
    const { email, senhaAtual, novaSenha } = req.body;
    if (!email || !senhaAtual || !novaSenha) return res.status(400).json({ error: 'Email, senha atual e nova senha são obrigatórios.' });
    const sql = 'SELECT senha FROM usuarios WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
        if (!row) return res.status(404).json({ error: 'Usuário não encontrado.' });
        if (row.senha !== senhaAtual) return res.status(401).json({ error: 'Senha atual incorreta.' });
        const updateSql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
        db.run(updateSql, [novaSenha, email], function(updateErr) {
            if (updateErr) { console.error('Erro no banco:', updateErr.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
            res.status(200).json({ message: 'Senha alterada com sucesso.' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Endpoint de saúde para diagnóstico rápido
app.get('/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});