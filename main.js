fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products-container');
    products.forEach(p => {
      container.innerHTML += `
        <div class="product">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">${p.price}</p>
          <a href="product.html?id=${p.id}">عرض التفاصيل</a>
        </div>
      `;
    });
  });
