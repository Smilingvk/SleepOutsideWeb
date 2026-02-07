import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Detectar si estamos en product_listing o en raíz
  const currentPath = window.location.pathname;
  const productPagePath = currentPath.includes('product_listing') 
    ? '../product_pages/?product=' 
    : 'product_pages/?product=';
  
  return `<li class="product-card">
    <a href="${productPagePath}${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
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
    this.products = await this.dataSource.getData(this.category);
    this.renderList(this.products);
  }

  renderList(list) {
    const noResultsDiv = document.getElementById('no-results');
    
    if (!list || list.length === 0) {
      // Show no results message
      this.listElement.innerHTML = '';
      if (noResultsDiv) {
        noResultsDiv.style.display = 'block';
      }
    } else {
      // Hide no results and show products
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