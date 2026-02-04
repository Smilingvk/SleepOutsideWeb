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
  console.log("🔍 Initializing search...");
  
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  console.log("Search form:", searchForm);
  console.log("Search input:", searchInput);

  if (!searchForm || !searchInput) {
    console.warn("⚠️ Search form elements not found");
    return;
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("🔎 Search form submitted!");
    
    const query = searchInput.value.trim();
    console.log("Search query:", query);
    
    if (query.length === 0) {
      console.warn("Empty search query");
      return;
    }

    // Get current path to determine redirect location
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);
    
    let redirectUrl = "";
    
    // If we're on the home page (index.html or root)
    if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
      redirectUrl = `product_listing/index.html?search=${encodeURIComponent(query)}`;
    } 
    // If we're already in product_listing
    else if (currentPath.includes("product_listing")) {
      redirectUrl = `index.html?search=${encodeURIComponent(query)}`;
    }
    // If we're in other directories (cart, product_pages, etc)
    else {
      redirectUrl = `../product_listing/index.html?search=${encodeURIComponent(query)}`;
    }
    
    console.log("Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  });
  
  console.log("✅ Search initialized successfully!");
}