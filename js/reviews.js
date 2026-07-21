document.addEventListener('DOMContentLoaded', function() {
  loadReviewsPage();
});

function loadReviewsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const container = document.getElementById('reviews-content');
  
  if (productId) {
    const product = getProductById(productId);
    if (!product) {
      container.innerHTML = '<p>Товар не найден</p>';
      return;
    }
    renderProductReviews(product, container);
  } else {
    renderAllReviews(container);
  }
}

function renderProductReviews(product, container) {
  const reviews = JSON.parse(localStorage.getItem('annasun_reviews') || '{}');
  const productReviews = reviews[product.id] || [];
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '0.0';

  container.innerHTML = `
    <div style="background: var(--color-white); padding: 30px; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
      <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
        <img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px; object-fit: cover; border-radius: var(--radius);">
        <div>
          <h2 style="color: var(--color-primary-dark); margin-bottom: 10px;">${product.name}</h2>
          <div style="font-size: 1.2rem; margin-bottom: 10px;">
            <span style="color: var(--color-accent); font-size: 1.5rem;">${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}</span>
            <span style="color: var(--color-text-light); margin-left: 10px;">${avgRating} / 5.0</span>
          </div>
          <p style="color: var(--color-text-light);">Всего отзывов: ${productReviews.length}</p>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 40px;">
      <div style="background: var(--color-white); padding: 20px; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
        <h3 style="color: var(--color-primary-dark); margin-bottom: 15px;">Фото товара</h3>
        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--radius-sm); margin-bottom: 10px;">
        <p style="color: var(--color-text-light); font-size: 0.9rem;">${product.name} — натуральное мыло ручной работы</p>
      </div>
      <div style="background: var(--color-white); padding: 20px; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
        <h3 style="color: var(--color-primary-dark); margin-bottom: 15px;">Видео</h3>
        <div style="background: var(--color-border); border-radius: var(--radius-sm); height: 200px; display: flex; align-items: center; justify-content: center; color: var(--color-text-light);">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#7c9a5e"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <p style="color: var(--color-text-light); font-size: 0.9rem; margin-top: 10px;">Обзор мыла ${product.name}</p>
      </div>
    </div>

    <div style="background: var(--color-white); padding: 30px; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
      <h2 style="color: var(--color-primary-dark); margin-bottom: 20px;">Отзывы</h2>
      <div id="product-reviews-list"></div>
    </div>

    <div style="background: var(--color-white); padding: 30px; border-radius: var(--radius); box-shadow: var(--shadow-sm);">
      <h2 style="color: var(--color-primary-dark); margin-bottom: 20px;">Оставить отзыв</h2>
      <form onsubmit="event.preventDefault(); addReview(${product.id});">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <input type="text" id="review-name" placeholder="Ваше имя" required 
                 style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
          <select id="review-rating" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
            <option value="">Оценка</option>
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>
        </div>
        <textarea id="review-text" placeholder="Ваш отзыв..." rows="4" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-bottom: 20px; resize: vertical;"></textarea>
        <button type="submit" class="btn btn-primary">Отправить отзыв</button>
      </form>
    </div>
  `;

  const listContainer = container.querySelector('#product-reviews-list');
  renderReviewsList(productReviews, listContainer, product.id);
}

function renderAllReviews(container) {
  const reviews = JSON.parse(localStorage.getItem('annasun_reviews') || '{}');
  let allReviews = [];
  
  Object.keys(reviews).forEach(productId => {
    const product = getProductById(productId);
    if (!product) return;
    reviews[productId].forEach(review => {
      allReviews.push({ ...review, productId, productName: product.name, productImage: product.image });
    });
  });

  allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allReviews.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <svg><use href="assets/svg/sprite.svg#icon-search"/></svg>
        <h2>Пока нет отзывов</h2>
        <p style="color: var(--color-text-light); margin-bottom: 20px;">Будьте первым, кто оставит отзыв о наших товарах!</p>
        <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="background: var(--color-white); padding: 30px; border-radius: var(--radius); box-shadow: var(--shadow-sm); margin-bottom: 30px;">
      <h2 style="color: var(--color-primary-dark); margin-bottom: 20px;">Все отзывы (${allReviews.length})</h2>
      <div id="all-reviews-list"></div>
    </div>
  `;

  const listContainer = container.querySelector('#all-reviews-list');
  renderReviewsList(allReviews, listContainer);
}

function renderReviewsList(reviews, container, productId) {
  if (reviews.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-light);">Пока нет отзывов. Будьте первым!</p>';
    return;
  }

  container.innerHTML = reviews.map(review => `
    <div style="border-bottom: 1px solid var(--color-border); padding: 20px 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
        <div>
          <strong>${review.name}</strong>
          ${review.productName ? `<span style="color: var(--color-text-light); font-size: 0.9rem;"> о товаре <a href="product.html?id=${review.productId}" style="color: var(--color-primary);">${review.productName}</a></span>` : ''}
        </div>
        <span style="color: var(--color-accent);">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p style="color: var(--color-text-light); margin-bottom: 10px; line-height: 1.6;">${review.text}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <small style="color: #999;">${review.date}</small>
        ${review.sellerReply ? `
          <div style="background: var(--color-secondary); padding: 10px 15px; border-radius: var(--radius-sm); width: 100%; margin-top: 10px;">
            <strong style="color: var(--color-primary-dark);">Ответ продавца:</strong>
            <p style="color: var(--color-text-light); margin: 5px 0 0;">${review.sellerReply}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function addReview(productId) {
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
    date: new Date().toLocaleDateString('ru-RU'),
    sellerReply: 'Спасибо за ваш отзыв! Мы очень ценим ваше мнение и рады, что вам понравилось наше мыло.'
  });
  
  localStorage.setItem('annasun_reviews', JSON.stringify(reviews));
  
  document.getElementById('review-name').value = '';
  document.getElementById('review-rating').value = '';
  document.getElementById('review-text').value = '';
  
  loadReviewsPage();
  showNotification('Спасибо за отзыв! Продавец ответит вам в ближайшее время.');
}
