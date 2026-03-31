console.log("cart.js running");

// ================= DATA =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= NAVBAR COUNT =================
function updateCartCount() {
  const countElement = document.getElementById("cartCount");

  if (countElement) {
    let totalQty = 0;

    cart.forEach(item => {
      totalQty += item.qty;
    });

    countElement.innerText = totalQty;
  }
}

// ================= ADD TO CART =================
function addToCart(name, price, img) {

  let existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1, img });
  }

  saveCart();

  animateCart(img);
  showToast("Added to cart 🛒");

  updateCartCount();
}

// ================= CART UI =================
function updateCartUI() {

  let container = document.getElementById("cartItems");
  let totalElement = document.getElementById("total");

  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<h2 style='text-align:center;'>Cart is empty 🛒</h2>";
    totalElement.innerText = "";
    return;
  }

  cart.forEach((item, index) => {

    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">

        <div style="display:flex; align-items:center; gap:15px;">
          <img src="${item.img}" style="width:70px; height:70px; object-fit:contain;">
          
          <div>
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
          </div>
        </div>

        <div>
          <button onclick="decrease(${index})">➖</button>
          <span>${item.qty}</span>
          <button onclick="increase(${index})">➕</button>
        </div>

        <button onclick="removeItem(${index})">❌</button>

      </div>
    `;
  });

  totalElement.innerText = "Total: ₹" + total;
}

// ================= INCREASE =================
function increaseQty(index) {
  cart[index].qty++;
  saveCart();
  updateCartUI();
  updateCartCount();
}

// ================= DECREASE =================
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  }
  saveCart();
  updateCartUI();
  updateCartCount();
}

// ================= REMOVE =================
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  updateCartCount();
}

// ================= ANIMATION =================
function animateCart(imgSrc) {

  if (!imgSrc) return;

  const img = document.createElement("img");
  img.src = imgSrc;

  img.style.position = "fixed";
  img.style.width = "60px";
  img.style.height = "60px";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.zIndex = "9999";
  img.style.transition = "all 0.8s ease";

  document.body.appendChild(img);

  setTimeout(() => {
    img.style.top = "20px";
    img.style.left = "90%";
    img.style.opacity = "0";
  }, 50);

  setTimeout(() => img.remove(), 800);
}

// ================= TOAST =================
function showToast(message) {
  let toast = document.createElement("div");
  toast.innerText = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#ff7e5f";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

// ================= CHECKOUT (FIXED) =================
function checkout() {

  if (cart.length === 0) {
    showToast("Cart is empty ❌");
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
  });

  let options = {
    key: "rzp_test_SXvTQYfUS79k0Z",
    amount: total * 100,
    currency: "INR",
    name: "Ayan's Store",
    description: "Order Payment",

    // 
    prefill: {
      name: "Test User",
      email: "test@example.com",
      contact: "9999999999"
    },

    theme: {
      color: "#ff7e5f"
    },

    handler: function () {

      let orders = JSON.parse(localStorage.getItem("orders")) || [];

      orders.push({
        items: cart,
        total: total,
        date: new Date().toLocaleString()
      });

      localStorage.setItem("orders", JSON.stringify(orders));

      localStorage.removeItem("cart");

      showToast("Payment Successful 🎉");

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 1500);
    },

    modal: {
      ondismiss: function () {
        showToast("Payment Cancelled ❌");
      }
    }
  };

  let rzp = new Razorpay(options);
  rzp.open();
}

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  updateCartCount();
});

// ================= GLOBAL =================
window.addToCart = addToCart;
window.increase = increaseQty;
window.decrease = decreaseQty;
window.removeItem = removeItem;
window.checkout = checkout;