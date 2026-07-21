document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = 'catalog.html';
    return;
  }

  const product = getProductById(productId);
  if (!product) {
    window.location.href = 'catalog.html';
    return;
  }

  document.getElementById('product-image').src = product.image;
  document.getElementById('product-image').alt = product.name;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = formatPrice(product.price);
  document.getElementById('product-description').innerHTML = product.description;
  document.getElementById('product-ingredients').textContent = product.ingredients;
  document.getElementById('product-weight').textContent = product.weight;
  document.getElementById('product-zodiac').textContent = product.zodiac;
  document.getElementById('product-lifestyle').textContent = product.lifestyle;
  document.getElementById('product-breadcrumb-name').textContent = product.name;

  const featuresContainer = document.getElementById('product-features');
  featuresContainer.innerHTML = product.features.map(f => `<span class="tag">${f}</span>`).join('');

  document.getElementById('add-to-cart-btn').onclick = function() {
    const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
    addToCart(product.id, quantity);
  };

  const reviewsLink = document.getElementById('reviews-link');
  if (reviewsLink) {
    reviewsLink.href = `reviews.html?id=${product.id}`;
  }

  loadReviews(productId);
});

function loadReviews(productId) {
  const reviews = JSON.parse(localStorage.getItem('annasun_reviews') || '{}');
  const productReviews = reviews[productId] || [];
  const container = document.getElementById('reviews-list');
  
  if (productReviews.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-light);">Пока нет отзывов. Будьте первым!</p>';
    return;
  }
  
  container.innerHTML = productReviews.map(review => `
    <div style="border-bottom: 1px solid var(--color-border); padding: 20px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <strong>${review.name}</strong>
        <span style="color: var(--color-accent);">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p style="color: var(--color-text-light);">${review.text}</p>
      <small style="color: #999;">${review.date}</small>
    </div>
  `).join('');
}

function addReview() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const name = document.getElementById('review-name').value.trim();
  const rating = parseInt(document.getElementById('review-rating').value);
  const text = document.getElementById('review-text').value.trim();
  
  if (!name || !rating || !text) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  
  const reviews = JSON.parse(localStorage.getItem('annasun_reviews') || '{}');
  if (!reviews[productId]) {
    reviews[productId] = [];
  }
  
  reviews[productId].push({
    name,
    rating,
    text,
    date: new Date().toLocaleDateString('ru-RU')
  });
  
  localStorage.setItem('annasun_reviews', JSON.stringify(reviews));
  
  document.getElementById('review-name').value = '';
  document.getElementById('review-rating').value = '';
  document.getElementById('review-text').value = '';
  
  loadReviews(productId);
  showNotification('Спасибо за отзыв!');
}
