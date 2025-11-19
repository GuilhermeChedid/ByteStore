const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta bytestore-frontend
app.use(express.static('../bytestore-frontend'));

// Validação de email permitido (mesma regra do front)
const allowedEmailRegex = /^[^\s@]+@((gmail\.com(\.br)?)|(hotmail\.com)|(outlook\.com(\.br)?)|(yahoo\.com(\.br)?))$/i;
function isAllowedEmail(email) {
    return allowedEmailRegex.test(String(email || '').trim());
}


app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, cep, estado, cidade, bairro, quadra, complemento } = req.body;

    // Validação básica para os campos essenciais
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    // Validação de domínio permitido
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const sql = `INSERT INTO usuarios (nome, email, senha, cep, estado, cidade, bairro, quadra, complemento)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [nome, email, senhaCriptografada, cep || null, estado || null, cidade || null, bairro || null, quadra || null, complemento || null];

        db.query(sql, params, function(err, result) {
            if (err) {
                console.error("Erro no banco de dados:", err.message);
                return res.status(400).json({ "error": "Não foi possível realizar o cadastro. O e-mail pode já estar em uso." });
            }
            res.status(201).json({ "message": "Usuário cadastrado com sucesso!", "userId": result.insertId });
        });
    } catch (err) {
        console.error('Erro ao criptografar senha:', err.message);
        return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
    }
});


// --- Rota de Login (Revisada para consistência) ---
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    // Validação de domínio permitido
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    }
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Erro no banco de dados:", err.message);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        
        const user = results[0];
        
        // Comparar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        
        // Retorna todos os dados do usuário, incluindo o endereço (mas sem a senha)
        delete user.senha;
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: user
        });
    });
});

// Redefinir senha (Esqueci): define nova senha se o email existir
app.post('/redefinir-senha', async (req, res) => {
    const { email, novaSenha } = req.body;
    console.log('[POST /redefinir-senha]', { email });
    if (!email || !novaSenha) return res.status(400).json({ error: 'Email e nova senha são obrigatórios.' });
    if (!isAllowedEmail(email)) return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    
    try {
        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
        const sql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
        db.query(sql, [senhaCriptografada, email], function(err, result) {
            if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Email não encontrado.' });
            res.status(200).json({ message: 'Senha redefinida com sucesso.' });
        });
    } catch (err) {
        console.error('Erro ao criptografar senha:', err.message);
        return res.status(500).json({ error: 'Erro interno ao redefinir senha.' });
    }
});

// Alterar senha (no perfil): exige senha atual correta
app.post('/alterar-senha', async (req, res) => {
    const { email, senhaAtual, novaSenha } = req.body;
    if (!email || !senhaAtual || !novaSenha) return res.status(400).json({ error: 'Email, senha atual e nova senha são obrigatórios.' });
    const sql = 'SELECT senha FROM usuarios WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
        if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        
        const user = results[0];
        const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta.' });
        
        try {
            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
            const updateSql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
            db.query(updateSql, [senhaCriptografada, email], function(updateErr, result) {
                if (updateErr) { console.error('Erro no banco:', updateErr.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
                res.status(200).json({ message: 'Senha alterada com sucesso.' });
            });
        } catch (err) {
            console.error('Erro ao criptografar senha:', err.message);
            return res.status(500).json({ error: 'Erro interno ao alterar senha.' });
        }
    });
});

// Atualizar endereço do usuário
app.post('/atualizar-endereco', (req, res) => {
    const { email, cep, estado, cidade, bairro, quadra, complemento } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório para atualizar endereço.' });
    }
    const sql = `UPDATE usuarios SET cep = ?, estado = ?, cidade = ?, bairro = ?, quadra = ?, complemento = ? WHERE email = ?`;
    db.query(sql, [cep, estado, cidade, bairro, quadra, complemento, email], function(err, result) {
        if (err) {
            console.error('Erro ao atualizar endereço:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar endereço.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
    });
});

// Solicitar exclusão de usuário
app.post('/solicitar-exclusao', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });
    const sql = 'DELETE FROM usuarios WHERE email = ?';
    db.query(sql, [email], function(err, result) {
        if (err) {
            console.error('Erro ao excluir usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso.' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Endpoint de saúde para diagnóstico rápido
app.get('/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});