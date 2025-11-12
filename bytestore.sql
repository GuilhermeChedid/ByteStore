CREATE TABLE Usuario (
  username_id VARCHAR(30) PRIMARY KEY,
  senha_id VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  carrinho_id VARCHAR(30)
);
