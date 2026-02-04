// Search functionality for the header
const baseURL = "https://wdd330-backend.onrender.com/";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export async function searchProducts(query) {
  try {
    // Search across all categories
    const response = await fetch(`${baseURL}products/search/${query}`);
    const data = await convertToJson(response);
    return data.Result;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export function initializeSearch() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if (!searchForm || !searchInput) {
    console.warn("Search form elements not found");
    return;
  }

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
      return;
    }

    // Store the search query in sessionStorage
    sessionStorage.setItem("searchQuery", query);
    
    // Redirect to search results page
    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    let searchPath = "";
    
    if (currentPath.includes("/product_pages/") || 
        currentPath.includes("/cart/") || 
        currentPath.includes("/checkout/")) {
      searchPath = "../search/index.html";
    } else if (currentPath.includes("/product_listing/")) {
      searchPath = "../search/index.html";
    } else {
      searchPath = "search/index.html";
    }
    
    window.location.href = searchPath;
  });
}