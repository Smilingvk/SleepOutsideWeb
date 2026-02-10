import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    console.log("🏗️ ProductList creado para:", category);
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    console.log("▶️ Iniciando ProductList...");
    try {
      this.products = await this.dataSource.getData(this.category);
      console.log("📦 Productos cargados:", this.products);
      this.renderList(this.products);
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
    }
  }

  renderList(list) {
    console.log("🎨 Renderizando lista con", list?.length, "productos");
    const noResultsDiv = document.getElementById('no-results');
    
    if (!list || list.length === 0) {
      console.log("⚠️ No hay productos para mostrar");
      this.listElement.innerHTML = '';
      if (noResultsDiv) {
        noResultsDiv.style.display = 'block';
      }
    } else {
      console.log("✅ Mostrando productos");
      if (noResultsDiv) {
        noResultsDiv.style.display = 'none';
      }
      renderListWithTemplate(
        productCardTemplate,
        this.listElement,
        list,
        "afterbegin",
        true
      );
    }
  }
}