// =====================
// CARRINHO
// =====================
function safeGetCart() {
    try {
        const raw = localStorage.getItem('cart');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('Carrinho no localStorage inválido. Limpando...', e);
        localStorage.removeItem('cart');
        return [];
    }
}

let cart = safeGetCart();

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
function addToCart(nome, preco, imagem = "img/default.jpg", tamanho = "M") {
    let cart = safeGetCart();
    const itemExistente = cart.find(item => item.nome === nome && item.tamanho === tamanho);

    if (itemExistente) {
        itemExistente.qty = (itemExistente.qty || 1) + 1;
    } else {
        cart.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            tamanho: tamanho,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Mostra a mensagem estilizada
    const mensagem = document.getElementById('mensagem-adicionado');
    if (mensagem) {
        mensagem.textContent = `${nome} adicionado ao carrinho!`;
        mensagem.classList.add('show');
        
        setTimeout(() => {
            mensagem.classList.remove('show');
        }, 3000);
    }
}

// Atualizar tamanho do item
function updateSize(index, newSize) {
    cart[index].tamanho = newSize;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(); // Re-renderiza para mostrar o novo total se o preço mudar por tamanho
}

// Remove item do carrinho
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Mostrar seção de pagamento com verificação
function showPaymentOptions() {
    const messageElement = document.getElementById('cart-message');
    const pagamento = document.getElementById('pagamento');

    // Garante que usamos o estado mais recente do carrinho
    const currentCart = JSON.parse(localStorage.getItem('cart')) || cart || [];

    // Esconde a mensagem e as opções de pagamento antes de qualquer verificação
    if (messageElement) messageElement.style.display = 'none';
    if (pagamento) pagamento.style.display = 'none';

    // Verifica se o carrinho está vazio
    if (currentCart.length === 0) {
        // Se estiver vazio, define o texto da mensagem e a exibe (se existir)
        if (messageElement) {
            messageElement.textContent = "Você precisa adicionar algum produto no carrinho para finalizar compra";
            messageElement.style.display = 'block';
        } else {
            alert('Você precisa adicionar algum produto no carrinho para finalizar a compra.');
        }
    } else {
        // Caso contrário (se tiver itens), mostra as opções de pagamento
        if (pagamento) {
            pagamento.style.display = 'block';
            // Traz a seção de pagamento para a visão do usuário
            pagamento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
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

// Submissão de formulários e outras lógicas
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

    // Renderiza o carrinho ao carregar a página
    renderCart();

    // Fallback: garantir que o botão finalize chame a função mesmo sem atributo inline
    const finalizarBtn = document.getElementById('finalizarCompraBtn');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPaymentOptions();
        });
    }
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