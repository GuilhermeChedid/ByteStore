const mysql = require('mysql2');

// Configuração para criar o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        process.exit(1);
    }
    
    console.log('✓ Conectado ao MySQL');
    
    // Criar banco de dados
    connection.query('CREATE DATABASE IF NOT EXISTS bytestore', (err) => {
        if (err) {
            console.error('Erro ao criar banco de dados:', err.message);
            process.exit(1);
        }
        
        console.log('✓ Banco de dados "bytestore" criado/verificado');
        
        // Usar o banco de dados
        connection.query('USE bytestore', (err) => {
            if (err) {
                console.error('Erro ao selecionar banco de dados:', err.message);
                process.exit(1);
            }
            
            // Criar tabela de usuários
            const createUsuariosTable = `
                CREATE TABLE IF NOT EXISTS usuarios (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  nome VARCHAR(100) NOT NULL,
                  email VARCHAR(100) UNIQUE NOT NULL,
                  senha VARCHAR(255) NOT NULL,
                  cep VARCHAR(9),
                  estado VARCHAR(2),
                  cidade VARCHAR(40),
                  bairro VARCHAR(100),
                  quadra VARCHAR(100),
                  complemento VARCHAR(200),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;
            
            connection.query(createUsuariosTable, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela usuarios:', err.message);
                    process.exit(1);
                }
                console.log('✓ Tabela "usuarios" criada/verificada');
                
                // Criar tabela de produtos
                const createProdutosTable = `
                    CREATE TABLE IF NOT EXISTS produtos (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      nome VARCHAR(100) NOT NULL,
                      descricao TEXT,
                      preco DECIMAL(10, 2) NOT NULL,
                      categoria VARCHAR(50),
                      estoque INT DEFAULT 0,
                      imagem VARCHAR(255),
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                
                connection.query(createProdutosTable, (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela produtos:', err.message);
                        process.exit(1);
                    }
                    console.log('✓ Tabela "produtos" criada/verificada');
                    
                    // Criar tabela de carrinho
                    const createCarrinhoTable = `
                        CREATE TABLE IF NOT EXISTS carrinho (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          usuario_id INT NOT NULL,
                          produto_id INT NOT NULL,
                          quantidade INT DEFAULT 1,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                          FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
                        )
                    `;
                    
                    connection.query(createCarrinhoTable, (err) => {
                        if (err) {
                            console.error('Erro ao criar tabela carrinho:', err.message);
                            process.exit(1);
                        }
                        console.log('✓ Tabela "carrinho" criada/verificada');
                        
                        // Criar tabela de pedidos
                        const createPedidosTable = `
                            CREATE TABLE IF NOT EXISTS pedidos (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              usuario_id INT NOT NULL,
                              total DECIMAL(10, 2) NOT NULL,
                              status VARCHAR(50) DEFAULT 'pendente',
                              endereco_entrega TEXT,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
                            )
                        `;
                        
                        connection.query(createPedidosTable, (err) => {
                            if (err) {
                                console.error('Erro ao criar tabela pedidos:', err.message);
                                process.exit(1);
                            }
                            console.log('✓ Tabela "pedidos" criada/verificada');
                            
                            // Criar tabela de itens do pedido
                            const createItensPedidoTable = `
                                CREATE TABLE IF NOT EXISTS itens_pedido (
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  pedido_id INT NOT NULL,
                                  produto_id INT NOT NULL,
                                  quantidade INT NOT NULL,
                                  preco_unitario DECIMAL(10, 2) NOT NULL,
                                  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                                  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
                                )
                            `;
                            
                            connection.query(createItensPedidoTable, (err) => {
                                if (err) {
                                    console.error('Erro ao criar tabela itens_pedido:', err.message);
                                    process.exit(1);
                                }
                                console.log('✓ Tabela "itens_pedido" criada/verificada');
                                console.log('\n✅ Banco de dados configurado com sucesso!');
                                console.log('Você pode agora executar: npm start\n');
                                
                                connection.end();
                            });
                        });
                    });
                });
            });
        });
    });
});
