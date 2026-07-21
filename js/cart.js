document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  renderCart();
});

function renderCart() {
  const container = document.getElementById('cart-content');
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <svg><use href="assets/svg/sprite.svg#icon-empty-cart"/></svg>
        <h2>Корзина пуста</h2>
        <p style="color: var(--color-text-light); margin-bottom: 20px;">Добавьте товары из каталога, чтобы оформить заказ.</p>
        <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
      </div>
    `;
    return;
  }

  let tableRows = '';
  let subtotal = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    tableRows += `
      <tr>
        <td data-label="Товар">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div>
              <div style="font-weight: 600;">${product.name}</div>
              <div style="font-size: 0.9rem; color: var(--color-text-light);">${formatPrice(product.price)}</div>
            </div>
          </div>
        </td>
        <td data-label="Количество">
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity(${product.id}, this.value)">
        </td>
        <td data-label="Сумма" style="font-weight: 600;">${formatPrice(itemTotal)}</td>
        <td data-label="Действие">
          <button class="remove-btn" onclick="removeFromCart(${product.id})">Удалить</button>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Количество</th>
          <th>Сумма</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="cart-summary">
      <div class="total">Итого: ${formatPrice(subtotal)}</div>
      <button class="btn btn-primary" onclick="alert('Спасибо за заказ! Мы свяжемся с вами для подтверждения.')">Оформить заказ</button>
      <a href="catalog.html" class="btn btn-outline" style="margin-left: 10px;">Продолжить покупки</a>
    </div>
  `;
}
