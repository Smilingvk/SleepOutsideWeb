import { getLocalStorage, setLocalStorage, updateCartCount, alertMessage } from "./utils.mjs";
import productPlaceholder from "../images/product-placeholder.svg";

function productDetailsTemplate(product) {
  return `
    <p class="eyebrow">${product.Brand?.Name || "Outdoor gear"}</p>
    <h2>${product.NameWithoutBrand || product.Name}</h2>
    <img src="${product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image || productPlaceholder}" data-fallback="${productPlaceholder}" alt="${product.NameWithoutBrand || product.Name}" id="productImage" class="divider" />
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
    
    // ✨ ANIMAR EL CARRITO - Esta es la parte nueva!
    updateCartCount(true); // El true activa la animación
    
    // Show success alert
    alertMessage(`${this.product.Name} has been added to your cart!`, false);
    
    // Optional: Still change button text temporarily
    const button = document.getElementById("addToCart");
    const originalText = button.textContent;
    button.textContent = "Added!";
    button.classList.add("is-added");
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("is-added");
    }, 1500);
  }

  renderProductDetails() {
    const detailSection = document.querySelector(".product-detail");
    if (detailSection) {
      detailSection.innerHTML = productDetailsTemplate(this.product);
      const image = detailSection.querySelector("#productImage");
      image?.addEventListener("error", () => {
        image.src = image.dataset.fallback;
        image.removeAttribute("data-fallback");
      }, { once: true });
    }
  }
}
