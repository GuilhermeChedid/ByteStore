// Função para alternar as abas de Login e Cadastro
function openTab(evt, tabName) {
    // Esconde todos os conteúdos
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(tab => tab.style.display = "none");

    // Remove a classe 'active' de todos os botões
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => btn.classList.remove("active"));

    // Mostra o conteúdo da aba selecionada e ativa o botão
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// Lógica dos formulários
document.addEventListener("DOMContentLoaded", () => {
    // --- Formulário de Cadastro ---
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const nome = document.getElementById("cadastroNome").value;
            const email = document.getElementById("cadastroEmail").value;
            const senha = document.getElementById("cadastroSenha").value;

            try {
                const response = await fetch('http://localhost:3000/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Cadastro realizado com sucesso! Agora você pode fazer o login.');
                    cadastroForm.reset();
                    document.querySelector('.tab-btn').click(); // Simula clique na aba de Login
                } else {
                    alert(`Erro: ${result.error}`);
                }
            } catch (error) {
                alert('Falha na comunicação com o servidor.');
            }
        });
    }

    // --- Formulário de Login ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const senha = document.getElementById("loginSenha").value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(result.user));
                    window.location.href = 'perfil.html';
                } else {
                    alert(`Erro: ${result.error}`);
                }
            } catch (error) {
                alert('Falha na comunicação com o servidor.');
            }
        });
    }
});