import { loadHeaderFooter } from './utils.mjs';
import { searchProducts } from './search.js';

loadHeaderFooter();

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

async function displaySearchResults() {
  const query = sessionStorage.getItem("searchQuery");
  
  if (!query) {
    window.location.href = "../index.html";
    return;
  }

  // Update page title
  const searchTitle = document.getElementById("search-title");
  const searchInfo = document.getElementById("search-info");
  searchTitle.textContent = `Search Results for "${query}"`;
  searchInfo.innerHTML = `<p style="margin: 1rem 0;">Searching...</p>`;

  try {
    const results = await searchProducts(query);
    
    const productListElement = document.querySelector(".product-list");
    const noResultsElement = document.getElementById("no-results");

    if (results && results.length > 0) {
      // Display results count
      searchInfo.innerHTML = `<p style="margin: 1rem 0;">Found ${results.length} product${results.length !== 1 ? 's' : ''}</p>`;
      
      // Render products
      const htmlItems = results.map(productCardTemplate).join("");
      productListElement.innerHTML = htmlItems;
      noResultsElement.style.display = "none";
    } else {
      // No results found
      searchInfo.innerHTML = "";
      productListElement.innerHTML = "";
      noResultsElement.style.display = "block";
    }
  } catch (error) {
    console.error("Error displaying search results:", error);
    const searchInfo = document.getElementById("search-info");
    searchInfo.innerHTML = `<p style="color: var(--tertiary-color); margin: 1rem 0;">
      An error occurred while searching. Please try again.
    </p>`;
  }
}

// Initialize search results display
displaySearchResults();