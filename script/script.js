"use strict";

let cartBasket = JSON.parse(localStorage.getItem("cartItem")) || [];

const renderProducts = () => {
  const productSection = document.getElementById("products-section");
  productSection.innerHTML += items
    .map((item) => {
      const { id, name, category, price, image } = item;
      return `
      <section class="product-container">
        <div class="image-container">
          <picture>
            <source srcset="${image.desktop}" media="min-width(1000px)">
            <source srcset="${image.tablet}" media="min-width(700px)">
            <img src="${image.mobile}" alt="${name}">
          </picture>
          <button onclick="addToCart(${id})" id="button-${id}">
            <img src="assets/images/icon-add-to-cart.svg">
            <span class="cart-text">Add to Cart</span>
          </button>
        </div>
        <div class="about-product-container">
          <small>${category}</small>
          <p>${name}</p>
          <p class="price">$${price.toFixed(2)}</p>
        </div>
      </section>
    `;
    })
    .join("");
};

renderProducts();

const addToCart = (itemId) => {
  const cartButton = document.getElementById(`button-${itemId}`);
  const products = items.find((item) => item.id === itemId);
  const cartItem = cartBasket.find((product) => product.id === itemId);
  if (cartItem) {
    cartBasket.quantity++;
  } else {
    cartBasket.push({ ...products, quantity: 1 });
    cartButton.style.color = "white";
    cartButton.style.backgroundColor = "hsl(14, 86%, 42%)";
  }
  localStorage.setItem("cartItem", JSON.stringify(cartBasket));
  updateButton(itemId);
  updateCart();
};

const updateButton = (itemId) => {
  const cartButton = document.getElementById(`button-${itemId}`);
  const items = cartBasket.find((item) => item.id === itemId);
  cartButton.innerHTML = `
  <div class="decrement-icon-wrapper" onclick="event.stopPropagation(); decrease(${itemId})">
    <img src="assets/images/icon-decrement-quantity.svg" alt="decrease-quantity">
  </div>
  <span class="product-amount">${items.quantity}</span>
  <div class="increment-icon-wrapper" onclick="event.stopPropagation(); increase(${itemId})">
    <img src="assets/images/icon-increment-quantity.svg" alt="increase-quantity">
  </div>
  `;
};

//Increase product amount
const increase = (itemId) => {
  const items = cartBasket.find((item) => item.id === itemId);
  items.quantity++;

  localStorage.setItem("cartItem", JSON.stringify(cartBasket));

  updateButton(itemId);
  updateCart(itemId);
};
//Decrease product amount
const decrease = (itemId) => {
  const items = cartBasket.find((item) => item.id === itemId);
  if (items.quantity > 1) {
    items.quantity--;
    updateButton(itemId);
    updateCart(itemId);
  } else {
    removeItem(itemId);
  }
  localStorage.setItem("cartItem", JSON.stringify(cartBasket));
};

const updateCart = () => {
  const cartQuantity = document.getElementById("quantity");
  const summaryDetails = document.getElementById("order-summary-details");
  const cartDiv = document.querySelector("#empty-cart");
  let total1 = 0;
  let total = 0;
  let itemQuantity = 0;
  cartDiv.innerHTML = "";
  cartBasket.forEach((item) => {
    total1 = item.price * item.quantity;
    total += item.price * item.quantity;
    itemQuantity += item.quantity;
    cartDiv.innerHTML += `            
      <section class="cart-row">
        <div class="order-details">
          <div>
            <h4>${item.name}</h4>
            <span class="order-price-info">
              <span class="order-item-quantity">${item.quantity}x</span>
              <p>@${item.price.toFixed(2)}</p>
              <p><b>$${total1.toFixed(2)}</b></p>
            </span>
          </div>
        </div>
        <div class="remove-icon-wrapper" onclick="removeItem(${item.id})">
          <img src="assets/images/icon-remove-item.svg" alt="remove-item">
        </div>
      </section>
      `;
    summaryDetails.innerHTML = `
      <div class="cart-total">
        <h4>Order Total</h4>
        <strong>$${total.toFixed(2)}</strong>
      </div>
      <div id="carbon-neutral">
        <img src="assets/images/icon-carbon-neutral.svg"> <p>This is a <b>carbon-neutral</b> delivery</p>
      </div>
      <button id="confirm-order-button" onclick="showModal()">Confirm Order</button>
        `;
    cartQuantity.textContent = itemQuantity;
  });
};

const removeItem = (itemId) => {
  const cartDiv = document.querySelector("#empty-cart");
  const summaryDetails = document.getElementById("order-summary-details");
  const cartQuantity = document.getElementById("quantity");
  cartBasket = cartBasket.filter((item) => item.id !== itemId);
  //Reset button for removed products
  const cartButton = document.getElementById(`button-${itemId}`);
  cartButton.innerHTML = `
    <img src="assets/images/icon-add-to-cart.svg">
    <span  class="cart-text">Add to Cart</span>
    `;
  cartButton.style.backgroundColor = "white";
  cartButton.style.color = "black";

  if (cartBasket.length === 0) {
    cartDiv.innerHTML = "";
    cartDiv.innerHTML = `  
      <img
        src="assets/images/illustration-empty-cart.svg"
        alt="cart is empty illustration"
      />
      <p>Your added items will appear here</p>
    `;
    summaryDetails.innerHTML = "";
    cartQuantity.textContent = 0;
  } else {
    //Reset order-summary section
    updateCart();
  }
  localStorage.setItem("cartItem", JSON.stringify(cartBasket));
};

const showModal = () => {
  const orderTotal = document.querySelector(".modal-total");
  const orderDetails = document.getElementById("order-confirmation-details");
  const orderModal = document.querySelector("#orderModal");
  let total1 = 0;
  let total = 0;
  let itemQuantity = 0;
  orderModal.style.display = "flex";
  cartBasket.forEach((item) => {
    total1 = item.price * item.quantity;
    total += item.price * item.quantity;
    itemQuantity += item.quantity;
    orderDetails.innerHTML += `
    <article class="order-product-details">
      <div class="order-details-wrapper">
        <span class="thumbnail-wrapper">
          <img src="${item.image.thumbnail}" alt="${item.category}">
        </span>
        <div class="modal-details">
          <h4>${item.name}</h4>
          <span class="order-item-quantity">${item.quantity}x</span>
          <span>@${item.price.toFixed(2)}</span>
        </div>
      </div>
      <strong>$${total1.toFixed(2)}</strong>
    </article>
    `;
    orderTotal.innerHTML = `
      <span>Order Total</span>
      <strong>$${total.toFixed(2)}</strong>
    `;
  });
};

const newOrder = () => {
  //Reset cart
  cartBasket = [];
  orderModal.style.display = "none";
  //Reset cart div
  const cartDiv = document.querySelector("#empty-cart");
  cartDiv.innerHTML = `
  <img
    src="assets/images/illustration-empty-cart.svg"
    alt="cart is empty illustration"
  />
  <p>Your added items will appear here</p>
  `;

  //Reset cart total
  const summaryDetails = document.getElementById("order-summary-details");
  summaryDetails.innerHTML = "";

  //Reset cart quantity
  const cartQuantity = document.getElementById("quantity");
  cartQuantity.textContent = 0;

  //Reset buttons
  items.forEach((item) => {
    const cartButton = document.getElementById(`button-${item.id}`);
    cartButton.innerHTML = `
    <img src="assets/images/icon-add-to-cart.svg">
    <span class="cart-text">Add to Cart</span>
    `;
    cartButton.style.backgroundColor = "white";
    cartButton.style.color = "black";
  });

  //Reset modal-details
  const orderDetails = document.getElementById("order-confirmation-details");
  orderDetails.innerHTML = "";

  //Reset local storage
  localStorage.clear();
};
