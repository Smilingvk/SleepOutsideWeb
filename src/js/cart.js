import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productListElement = document.querySelector(".product-list");
  
  // Check if cart is empty
  if (cartItems.length === 0) {
    productListElement.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--dark-grey);">
        <p style="font-size: 1.2em; margin-bottom: 1rem;">Your cart is empty</p>
        <a href="../index.html" style="color: var(--secondary-color); text-decoration: underline;">
          Continue Shopping
        </a>
      </div>
    `;
    // Hide cart total section if it exists
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
      cartFooter.style.display = 'none';
    }
    return;
  }
  
  // Render cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productListElement.innerHTML = htmlItems.join("");
  
  // Calculate and display total
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function renderCartTotal(cartItems) {
  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  const itemCount = cartItems.length;
  
  // Check if cart footer already exists
  let cartFooter = document.querySelector('.cart-footer');
  
  if (!cartFooter) {
    // Create cart footer section
    cartFooter = document.createElement('div');
    cartFooter.className = 'cart-footer';
    cartFooter.style.cssText = `
      margin-top: 2rem;
      padding: 1rem;
      border-top: 2px solid var(--primary-color);
      text-align: right;
    `;
    
    // Insert after product list
    const productSection = document.querySelector('.products');
    productSection.appendChild(cartFooter);
  }
  
  // Update cart footer content
  cartFooter.innerHTML = `
    <p style="font-size: 1.1em; margin-bottom: 0.5rem;">
      <strong>Items in Cart:</strong> ${itemCount}
    </p>
    <p style="font-size: 1.3em; color: var(--tertiary-color); font-weight: bold;">
      <strong>Total:</strong> $${total.toFixed(2)}
    </p>
  `;
  
  cartFooter.style.display = 'block';
}

renderCartContents();