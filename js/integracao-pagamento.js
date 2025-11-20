/* ===== Integração PIX (QR) e Cartão -> nota-fiscal.html ===== */

// Usa QRCode lib (ver nota abaixo sobre incluir script CDN no HTML do carrinho)
function generateInvoiceNumber() {
  const ano = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `NF-${ano}-${rand}`;
}

function createOrderFromCart() {
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch(e){ cart = []; }

  if (!cart || cart.length === 0) return null;

  const valor_total = cart.reduce((s, it) => s + (it.preco * (it.qty || 1)), 0);
  const orderId = 'ORD' + Date.now();
  const nfNumero = generateInvoiceNumber();

  const order = {
    id: orderId,
    nf: nfNumero,
    itens: cart,
    valor_total,
    data: new Date().toISOString(),
    status: 'pending'
  };

  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('orders') || '[]'); } catch(e){ orders = []; }
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  return order;
}

// Gera QR e mostra na tela
function showPixQRCode(order) {
  let wrapper = document.getElementById('pix-qrcode-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'pix-qrcode-wrapper';
    wrapper.style.position = 'fixed';
    wrapper.style.right = '20px';
    wrapper.style.bottom = '20px';
    wrapper.style.background = '#fff';
    wrapper.style.padding = '12px';
    wrapper.style.border = '1px solid #ddd';
    wrapper.style.borderRadius = '8px';
    wrapper.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    wrapper.style.zIndex = 99999;
    document.body.appendChild(wrapper);
  }
  wrapper.innerHTML = '';

  const title = document.createElement('div');
  title.innerHTML = `<strong>PIX - Escaneie o QR</strong>`;
  title.style.marginBottom = '8px';
  wrapper.appendChild(title);

  const qrDiv = document.createElement('div');
  qrDiv.id = 'pix-qrcode';
  wrapper.appendChild(qrDiv);

  // URL da nota
  const invoiceUrl = `${location.origin}${location.pathname.replace(/[^/]*$/,'')}nota-fiscal.html?orderId=${encodeURIComponent(order.id)}&method=pix`;

  new QRCode(qrDiv, {
    text: invoiceUrl,
    width: 200,
    height: 200
  });

  const info = document.createElement('div');
  info.style.marginTop = '8px';
  info.innerHTML = `
    <small>PIX QR CODE.<br>
    Após pagamento, abrir a nota fiscal no PC: <a id="openInvoiceTest" href="${invoiceUrl}" target="_blank">Abrir nota em nova aba</a></small>
  `;
  wrapper.appendChild(info);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Fechar';
  closeBtn.style.marginTop = '8px';
  closeBtn.onclick = () => wrapper.remove();
  wrapper.appendChild(closeBtn);
}

// Intercepta submit PIX
const pixForm = document.getElementById('pixForm');
if (pixForm) {
  pixForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const order = createOrderFromCart();
    if (!order) {
      alert('Carrinho vazio. Adicione itens antes de pagar.');
      return false;
    }

    showPixQRCode(order);
    return false;
  });
}

// Intercepta submit Cartão
const cartaoForm = document.getElementById('cartaoForm');
if (cartaoForm) {
  cartaoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const order = createOrderFromCart();
    if (!order) {
      alert('Carrinho vazio. Adicione itens antes de pagar.');
      return false;
    }

    // abre nota-fiscal.html
    const invoiceUrl = `nota-fiscal.html?orderId=${encodeURIComponent(order.id)}&method=card`;
    window.open(invoiceUrl, '_blank');

    return false;
  });
}
