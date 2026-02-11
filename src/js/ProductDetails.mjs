import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function productDetailsTemplate(product) {
  return `
    <h2>${product.Brand.Name}</h2>
    <h3 class="divider">${product.NameWithoutBrand}</h3>
    <img src="${product.Images.PrimaryLarge}" alt="${product.NameWithoutBrand}" id="productImage" class="divider" />
    <p id="productPrice" class="product-card__price">$${product.FinalPrice}</p>
    <p id="productColor" class="product__color">${product.Colors?.[0]?.ColorName || "N/A"}</p>
    <div id="productDesc" class="product__description">${product.DescriptionHtmlSimple}</div>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    
    // Update cart count badge
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
    
    // Show feedback to user
    const button = document.getElementById("addToCart");
    const originalText = button.textContent;
    button.textContent = "Added!";
    button.style.backgroundColor = "#4CAF50";
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1500);
  }

  renderProductDetails() {
    const detailSection = document.querySelector(".product-detail");
    if (detailSection) {
      detailSection.innerHTML = productDetailsTemplate(this.product);
    }
  }
}