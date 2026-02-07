import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

console.log("🚀 product-listing.js cargado");

loadHeaderFooter();

const category = getParam('category');
const searchQuery = getParam('search');

console.log("📦 Category:", category);
console.log("🔍 Search:", searchQuery);

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');

console.log("📋 List element:", listElement);

const pageTitle = document.querySelector('.products h2');

if (searchQuery) {
  console.log("Modo: BÚSQUEDA");
  pageTitle.textContent = `Search Results for "${searchQuery}"`;
  const searchList = new ProductList(searchQuery, dataSource, listElement);
  searchList.init();
} else if (category) {
  console.log("Modo: CATEGORÍA");
  pageTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
} else {
  console.log("Modo: DEFAULT");
  pageTitle.textContent = 'Products';
  const myList = new ProductList('tents', dataSource, listElement);
  myList.init();
}