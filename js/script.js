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
        li.classList.add("cart-item");

        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="miniatura">
            <span>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.qty || 1}</span>
            
            <select onchange="updateSize(${index}, this.value)" class="size-select">
                <option value="P" ${item.tamanho === "P" ? "selected" : ""}>P</option>
                <option value="M" ${item.tamanho === "M" ? "selected" : ""}>M</option>
                <option value="G" ${item.tamanho === "G" ? "selected" : ""}>G</option>
                <option value="GG" ${item.tamanho === "GG" ? "selected" : ""}>GG</option>
            </select>

            <button onclick="removeItem(${index})" class="remove-btn">Remover</button>
        `;
        cartItems.appendChild(li);
    });

    totalPrice.textContent = total.toFixed(2);
}

// Adiciona produto ao carrinho
// Adiciona produto ao carrinho
function addToCart(nome, preco, imagem = "img/default.jpg", tamanho = "M") {
    let cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = cart.find(item => item.nome === nome && item.tamanho === tamanho);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        cart.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            tamanho: tamanho,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(cart));
    
    // Mostra a mensagem estilizada
    const mensagem = document.getElementById('mensagem-adicionado');
    mensagem.textContent = `${nome} adicionado ao carrinho!`;
    mensagem.classList.add('show');
    
    // Oculta a mensagem depois de 3 segundos
    setTimeout(() => {
        mensagem.classList.remove('show');
    }, 3000);

}// Adiciona produto ao carrinho

function addToCart(nome, preco, imagem = "img/default.jpg", tamanho = "M") {
    let cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = cart.find(item => item.nome === nome && item.tamanho === tamanho);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        cart.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            tamanho: tamanho,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(cart));
    
    // Mostra a mensagem estilizada
    const mensagem = document.getElementById('mensagem-adicionado');
    mensagem.textContent = `${nome} adicionado ao carrinho!`;
    mensagem.classList.add('show');
    
    // Oculta a mensagem depois de 3 segundos
    setTimeout(() => {
        mensagem.classList.remove('show');
    }, 3000);
}

// Atualizar tamanho do item
function updateSize(index, newSize) {
    cart[index].tamanho = newSize;
    localStorage.setItem("cart", JSON.stringify(cart));
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
