// =====================
// CARRINHO
// =====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Renderiza o carrinho
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.preco * (item.qty || 1);
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.qty || 1} 
            <button onclick="removeItem(${index})" class="remove-btn">Remover</button>
        `;
        cartItems.appendChild(li);
    });

    totalPrice.textContent = total.toFixed(2);
}

// Adiciona produto ao carrinho
function addToCart(nome, preco) {
    const existing = cart.find(item => item.nome === nome);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ nome, preco, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    alert(`${nome} adicionado ao carrinho!`);
}

// Remove item do carrinho
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Mostrar seção de pagamento
function showPaymentOptions() {
    const pagamento = document.getElementById('pagamento');
    if (pagamento) pagamento.style.display = 'block';
}

// Mostrar formulário de pagamento específico
function showForm(method) {
    const cartaoForm = document.getElementById('cartaoForm');
    const pixForm = document.getElementById('pixForm');

    if (!cartaoForm || !pixForm) return;

    cartaoForm.style.display = method === 'cartao' ? 'flex' : 'none';
    pixForm.style.display = method === 'pix' ? 'flex' : 'none';
}

// Fechar formulários de pagamento
function closeForms() {
    const cartaoForm = document.getElementById('cartaoForm');
    const pixForm = document.getElementById('pixForm');
    if (cartaoForm) cartaoForm.style.display = 'none';
    if (pixForm) pixForm.style.display = 'none';
}

// Submissão de formulários
document.addEventListener("DOMContentLoaded", () => {
    // Cartão
    const cartaoForm = document.getElementById('cartaoForm');
    if (cartaoForm) {
        cartaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) { alert('Carrinho vazio!'); return; }
            alert('Compra finalizada com Cartão!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            cartaoForm.reset();
            closeForms();
        });
    }

    // PIX
    const pixForm = document.getElementById('pixForm');
    if (pixForm) {
        pixForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) { alert('Carrinho vazio!'); return; }
            alert('Compra finalizada via PIX!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            pixForm.reset();
            closeForms();
        });
    }

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            alert(`Login realizado com: ${email}`);
        });
    }

    // Cadastro
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nome = document.getElementById("cadastroNome").value;
            alert(`Cadastro realizado com sucesso!\nBem-vindo(a), ${nome}`);
        });
    }

    // Renderiza o carrinho ao carregar
    renderCart();
});

// Alternar entre abas Login e Cadastro
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}
