let cart = [];
let isCartLoaded = false;

function loadCart() {
  if (isCartLoaded) return;
  try {
    const saved = localStorage.getItem('annasun_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = [];
  }
  isCartLoaded = true;
  updateCartCount();
}

function saveCart() {
  localStorage.setItem('annasun_cart', JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

function addToCart(productId, quantity = 1) {
  loadCart();
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart();
  updateCartCount();
  showNotification('Товар добавлен в корзину');
}

function removeFromCart(productId) {
  loadCart();
  cart = cart.filter(item => item.productId !== productId);
  saveCart();
  updateCartCount();
  if (typeof renderCart === 'function') renderCart();
}

function updateCartQuantity(productId, quantity) {
  loadCart();
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = Math.max(1, parseInt(quantity) || 1);
  }
  saveCart();
  updateCartCount();
}

function getCartTotal() {
  loadCart();
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #7c9a5e; color: white; padding: 15px 25px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2); animation: slideIn 0.3s ease;';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function toggleMenu() {
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.classList.toggle('active');
  }
}

function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

function formatPrice(price) {
  return price + ' ₽';
}

function renderProductCard(product) {
  const tagsHtml = product.features.slice(0, 3).map(f => `<span class="tag">${f}</span>`).join('');
  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-card-body">
        <div class="product-card-title">${product.name}</div>
        <div class="product-card-price">${formatPrice(product.price)}</div>
        <div class="product-card-desc">${product.shortdesc}</div>
        <div class="product-card-tags">${tagsHtml}</div>
        <div class="product-card-actions" onclick="event.stopPropagation()">
          <button class="btn btn-primary" onclick="addToCart(${product.id})">В корзину</button>
          <button class="btn btn-outline" onclick="window.location.href='reviews.html?id=${product.id}'">Отзывы</button>
        </div>
      </div>
    </div>
  `;
}

function renderPopularProducts() {
  const container = document.getElementById('popular-products');
  if (!container) return;
  const popular = products.slice(0, 6);
  container.innerHTML = popular.map(renderProductCard).join('');
}

function renderCatalog(productsToRender = products) {
  const container = document.getElementById('catalog-products');
  if (!container) return;
  container.innerHTML = productsToRender.map(renderProductCard).join('');
}

function applyFilters() {
  const categoryChecks = document.querySelectorAll('.filter-checkbox:checked');
  const zodiacChecks = document.querySelectorAll('.zodiac-filter:checked');
  const minPrice = parseInt(document.getElementById('price-min').value) || 0;
  const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;

  const selectedCategories = Array.from(categoryChecks).map(cb => cb.value);
  const selectedZodiacs = Array.from(zodiacChecks).map(cb => cb.value);

  let filtered = products;

  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }

  if (selectedZodiacs.length > 0) {
    filtered = filtered.filter(p => {
      const zodiacs = p.zodiac.split(',').map(z => z.trim());
      return selectedZodiacs.some(z => zodiacs.includes(z));
    });
  }

  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  renderCatalog(filtered);
}

function resetFilters() {
  document.querySelectorAll('.filter-checkbox, .zodiac-filter').forEach(cb => cb.checked = false);
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  renderCatalog();
}

function initPage() {
  loadCart();
  renderPopularProducts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
