const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bytestore.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            cep TEXT,
            estado TEXT,
            cidade TEXT,
            bairro TEXT,
            quadra TEXT,
            numero TEXT, 
            complemento TEXT
        )`);
    }
});

module.exports = db;