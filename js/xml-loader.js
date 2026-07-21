async function loadProductsFromXML() {
  try {
    const response = await fetch('data/products.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const productElements = xmlDoc.querySelectorAll('product');
    
    products = Array.from(productElements).map(el => {
      const id = parseInt(el.getAttribute('id'));
      const category = el.getAttribute('category');
      const price = parseInt(el.getAttribute('price'));
      const image = el.getAttribute('image');
      const name = el.querySelector('name')?.textContent || '';
      const shortdesc = el.querySelector('shortdesc')?.textContent || '';
      const description = el.querySelector('description')?.textContent || '';
      const ingredients = el.querySelector('ingredients')?.textContent || '';
      const weight = el.querySelector('weight')?.textContent || '';
      const zodiac = el.querySelector('zodiac')?.textContent || '';
      const lifestyle = el.querySelector('lifestyle')?.textContent || '';
      
      const features = [];
      el.querySelectorAll('features feature').forEach(f => {
        features.push(f.textContent);
      });
      
      return {
        id, category, price, image, name, shortdesc, description,
        ingredients, weight, features, zodiac, lifestyle
      };
    });
    
    if (typeof initPage === 'function') {
      initPage();
    }
    if (typeof renderCatalog === 'function') {
      renderCatalog();
    }
  } catch (error) {
    console.log('XML загружен из fallback (products-data.js)');
    if (typeof initPage === 'function') {
      initPage();
    }
  }
}

document.addEventListener('DOMContentLoaded', loadProductsFromXML);
