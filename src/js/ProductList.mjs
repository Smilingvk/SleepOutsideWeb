import { renderListWithTemplate } from "./utils.mjs";
import productPlaceholder from "../images/product-placeholder.svg";

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function productCardTemplate(product) {
  const inSection = /\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname);
  const productPath = `${inSection ? "../" : ""}product_pages/?product=`;
  const imageSource = product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image || productPlaceholder;
  const image = String(imageSource).replace(/^\.\.\/images\//, `${inSection ? "../" : ""}images/`);
  return `<li class="product-card">
    <a href="${productPath}${encodeURIComponent(product.Id)}">
      <img src="${escapeHTML(image)}" data-fallback="${productPlaceholder}" alt="${escapeHTML(product.Name)}" loading="lazy">
      <div class="product-card__body">
        <p class="card__brand">${escapeHTML(product.Brand?.Name || "Outdoor gear")}</p>
        <h3 class="card__name">${escapeHTML(product.NameWithoutBrand || product.Name)}</h3>
        <p class="product-card__price">$${Number(product.FinalPrice || 0).toFixed(2)}</p>
      </div>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    if (!this.listElement) return;
    this.listElement.setAttribute("aria-busy", "true");
    try {
      this.products = await this.dataSource.getData(this.category);
      this.renderList(this.products);
    } catch (error) {
      console.error("Could not load products:", error);
      const home = /\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname) ? "../index.html" : "index.html";
      this.listElement.innerHTML = `<li class="empty-state"><p>We couldn't load these products right now.</p><a class="text-link" href="${home}">Return home</a></li>`;
    } finally {
      this.listElement.removeAttribute("aria-busy");
    }
  }

  renderList(products) {
    const noResults = document.getElementById("no-results");
    this.listElement.innerHTML = "";
    if (!products?.length) {
      if (noResults) noResults.hidden = false;
      return;
    }
    if (noResults) noResults.hidden = true;
    renderListWithTemplate(productCardTemplate, this.listElement, products);
    this.listElement.querySelectorAll("img[data-fallback]").forEach((image) => {
      image.addEventListener("error", () => {
        image.src = image.dataset.fallback;
        image.removeAttribute("data-fallback");
      }, { once: true });
    });
  }
}
