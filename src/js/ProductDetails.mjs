import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      if (!this.product) {
        throw new Error("Product not found");
      }
      this.renderProductDetails();
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    } catch (error) {
      console.error("Error loading product:", error);
      this.renderError();
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    
    // Optional: provide user feedback
    alert("Product added to cart!");
  }

  renderProductDetails() {
    const brandElement = document.querySelector("h3");
    const nameElement = document.querySelector("h2");
    const imageElement = document.querySelector(".product-detail img");
    const priceElement = document.querySelector(".product-card__price");
    const colorElement = document.querySelector(".product__color");
    const descElement = document.querySelector(".product__description");
    const buttonElement = document.getElementById("addToCart");

    if (brandElement) brandElement.textContent = this.product.Brand.Name;
    if (nameElement) nameElement.textContent = this.product.NameWithoutBrand;
    
    if (imageElement) {
      imageElement.src = this.product.Image;
      imageElement.alt = this.product.NameWithoutBrand;
    }
    
    if (priceElement) priceElement.textContent = `$${this.product.FinalPrice}`;
    if (colorElement) {
      colorElement.textContent = this.product.Colors?.[0]?.ColorName || "N/A";
    }
    if (descElement) {
      descElement.innerHTML = this.product.DescriptionHtmlSimple;
    }
    
    if (buttonElement) {
      buttonElement.dataset.id = this.product.Id;
    }
  }

  renderError() {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.innerHTML = `
        <section class="product-detail">
          <h2>Product Not Found</h2>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <a href="/index.html">Return to Home</a>
        </section>
      `;
    }
  }
}