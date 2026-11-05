import { loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

// Load shared page chrome before initializing home page features
await loadHeaderFooter();

// Load featured products on home page
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');

if (listElement) {
  // Load tents as featured products on home page
  const productList = new ProductList('tents', dataSource, listElement);
  productList.init();
}