import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// Get category from URL or search query
const category = getParam('category');
const searchQuery = getParam('search');

// Create instance of ProductData
const dataSource = new ProductData();
// Get the element for product list
const listElement = document.querySelector('.product-list');

// Update page title based on search or category
const pageTitle = document.querySelector('.products h2');

if (searchQuery) {
  // Handle search
  pageTitle.textContent = `Search Results for "${searchQuery}"`;
  
  // Create a custom product list for search
  const searchList = new ProductList(searchQuery, dataSource, listElement);
  searchList.init();
  
} else if (category) {
  // Handle category browsing
  pageTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
  
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
  
} else {
  // Fallback to tents if no category or search
  pageTitle.textContent = 'Products';
  
  const myList = new ProductList('tents', dataSource, listElement);
  myList.init();
}