import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';
import { searchProducts } from './search.js';


await loadHeaderFooter();

const category = getParam('category');
const searchQuery = getParam('search');


const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');


const pageTitle = document.querySelector('.products h1');

if (searchQuery) {
  pageTitle.textContent = `Results for “${searchQuery}”`;
  listElement.setAttribute("aria-busy", "true");
  searchProducts(searchQuery)
    .then((products) => new ProductList(searchQuery, dataSource, listElement).renderList(products))
    .catch((error) => {
      console.error("Could not search products:", error);
      listElement.innerHTML = '<li class="empty-state"><p>Search is unavailable right now. Please try again.</p></li>';
    })
    .finally(() => listElement.removeAttribute("aria-busy"));
} else if (category) {
  pageTitle.textContent = category.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
} else {
  pageTitle.textContent = 'Products';
  const myList = new ProductList('tents', dataSource, listElement);
  myList.init();
}
