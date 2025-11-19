const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Altere para seu usuário MySQL
    password: '',           // Altere para sua senha MySQL
    database: 'bytestore'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

// Exportar a conexão para uso em outros arquivos
module.exports = connection;
