import { app } from "./firebase.js";
import { getFirestore, collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const db = getFirestore(app);

let allProducts = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));

  allProducts = [];

  querySnapshot.forEach((doc) => {
    const p = doc.data();
    allProducts.push(p);
  });

  displayProducts(allProducts);
}

// ❤️ TOGGLE WISHLIST
function toggleWishlist(name) {
  if (wishlist.includes(name)) {
    wishlist = wishlist.filter(item => item !== name);
  } else {
    wishlist.push(name);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayProducts(allProducts);
}

// 🔥 DISPLAY PRODUCTS
function displayProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((product) => {

    const isWishlisted = wishlist.includes(product.name);

    const div = document.createElement("div");
    div.classList.add("product-card");

    div.innerHTML = `
      <div class="wishlist" onclick="toggleWishlist('${product.name}')">
        ${isWishlisted ? "❤️" : "🤍"}
      </div>

      <img src="${product.image}">
      <h3>${product.name}</h3>

      <div class="rating">⭐⭐⭐⭐☆</div>

      <p>₹${product.price}</p>

      <!-- ✅ UPDATED BUTTON -->
      <button class="cart-btn" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
        Add to Cart 🛒
      </button>
    `;

    container.appendChild(div);
  });
}

// 🔍 SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});

// GLOBAL
window.toggleWishlist = toggleWishlist;

// INIT
loadProducts();