const params = new URLSearchParams(location.search);
const productId = params.get('id');

fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    document.getElementById('product-title').textContent = product.name;

    document.getElementById('product-detail').innerHTML = `
      <div class="product">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <form onsubmit="sendOrder(event)">
          <label>الاسم الكامل:</label>
          <input type="text" id="name" required>

          <label>رقم الهاتف:</label>
          <input type="tel" id="phone" required>

          <label>العنوان:</label>
          <textarea id="address" required></textarea>

          <label>ملاحظات:</label>
          <textarea id="notes"></textarea>

          <label>رقم التحويل:</label>
          <input type="text" id="transfer" required>

          <label>صورة التحويل:</label>
          <input type="file" id="proof" accept="image/*" required>

          <button type="submit" class="btn">إرسال الطلب عبر واتساب</button>
        </form>
      </div>
    `;
  });

async function sendOrder(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const notes = document.getElementById("notes").value;
  const transfer = document.getElementById("transfer").value;
  const image = document.getElementById("proof").files[0];

  if (!image) return alert("من فضلك ارفع صورة التحويل");

  const formData = new FormData();
  formData.append("image", image);
  const apiKey = "17d9f00d7882056a08ad3e7e68c6b921";

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const result = await res.json();
  if (!result.success) return alert("خطأ في رفع الصورة");

  const imageUrl = result.data.url;
  const productName = document.querySelector("h3").textContent;
  const message =
    `📦 *طلب جديد من Bariq Store* 📦\n\n` +
    `👤 الاسم: ${name}\n` +
    `📞 الهاتف: ${phone}\n` +
    `📍 العنوان: ${address}\n` +
    `🛍️ المنتج: ${productName}\n` +
    `📝 ملاحظات: ${notes || "لا توجد"}\n` +
    `💳 رقم التحويل: ${transfer}\n` +
    `💵 صورة التحويل:\n${imageUrl}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/201091212686?text=${encoded}`, "_blank");
}
