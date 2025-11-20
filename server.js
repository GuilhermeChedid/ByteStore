const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Validação de email permitido (mesma regra do front)
const allowedEmailRegex = /^[^\s@]+@((gmail\.com(\.br)?)|(hotmail\.com)|(outlook\.com(\.br)?)|(yahoo\.com(\.br)?))$/i;
function isAllowedEmail(email) {
    return allowedEmailRegex.test(String(email || '').trim());
}


app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, cep, estado, bairro, quadra, complemento } = req.body;

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
        const sql = `INSERT INTO usuarios (nome, email, senha, cep, estado, bairro, quadra, complemento)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [nome, email, senhaCriptografada, cep || null, estado || null, bairro || null, quadra || null, complemento || null];

        db.run(sql, params, function(err) {
            if (err) {
                console.error("Erro no banco de dados:", err.message);
                return res.status(400).json({ "error": "Não foi possível realizar o cadastro. O e-mail pode já estar em uso." });
            }
            res.status(201).json({ "message": "Usuário cadastrado com sucesso!", "userId": this.lastID });
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

    db.get(sql, [email], async (err, row) => {
        if (err) {
            console.error("Erro no banco de dados:", err.message);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        if (!row) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        
        // Comparar senha criptografada
        try {
            const senhaValida = await bcrypt.compare(senha, row.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Email ou senha inválidos.' });
            }
            
            // Retorna todos os dados do usuário, incluindo o endereço
            res.status(200).json({
                message: 'Login bem-sucedido!',
                user: row
            });
        } catch (compareError) {
            console.error('Erro ao comparar senha:', compareError.message);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    });
});

// Redefinir senha (Esqueci): define nova senha se o email existir
app.post('/redefinir-senha', async (req, res) => {
    const { email, novaSenha } = req.body;
    console.log('[POST /redefinir-senha]', { email });
    if (!email || !novaSenha) return res.status(400).json({ error: 'Email e nova senha são obrigatórios.' });
    if (!isAllowedEmail(email)) return res.status(400).json({ error: 'Email inválido. Permitidos: @gmail.com, @gmail.com.br, @hotmail.com, @outlook.com, @outlook.com.br, @yahoo.com, @yahoo.com.br' });
    
    try {
        const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
        const sql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
        db.run(sql, [novaSenhaCriptografada, email], function(err) {
            if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
            if (this.changes === 0) return res.status(404).json({ error: 'Email não encontrado.' });
            res.status(200).json({ message: 'Senha redefinida com sucesso.' });
        });
    } catch (hashError) {
        console.error('Erro ao criptografar senha:', hashError.message);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Alterar senha (no perfil): exige senha atual correta
app.post('/alterar-senha', async (req, res) => {
    const { email, senhaAtual, novaSenha } = req.body;
    if (!email || !senhaAtual || !novaSenha) return res.status(400).json({ error: 'Email, senha atual e nova senha são obrigatórios.' });
    const sql = 'SELECT senha FROM usuarios WHERE email = ?';
    db.get(sql, [email], async (err, row) => {
        if (err) { console.error('Erro no banco:', err.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
        if (!row) return res.status(404).json({ error: 'Usuário não encontrado.' });
        
        try {
            const senhaValida = await bcrypt.compare(senhaAtual, row.senha);
            if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta.' });
            
            const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
            const updateSql = 'UPDATE usuarios SET senha = ? WHERE email = ?';
            db.run(updateSql, [novaSenhaCriptografada, email], function(updateErr) {
                if (updateErr) { console.error('Erro no banco:', updateErr.message); return res.status(500).json({ error: 'Erro interno do servidor.' }); }
                res.status(200).json({ message: 'Senha alterada com sucesso.' });
            });
        } catch (compareError) {
            console.error('Erro ao processar senha:', compareError.message);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
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
    db.run(sql, [cep, estado, cidade, bairro, quadra, complemento, email], function(err) {
        if (err) {
            console.error('Erro ao atualizar endereço:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar endereço.' });
        }
        if (this.changes === 0) {
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
    db.run(sql, [email], function(err) {
        if (err) {
            console.error('Erro ao excluir usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
        if (this.changes === 0) {
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