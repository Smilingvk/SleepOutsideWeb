import { loadHeaderFooter } from "./utils.mjs";
import { searchProducts } from "./search.js";
import productPlaceholder from "../images/product-placeholder.svg";

await loadHeaderFooter();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

const query = new URLSearchParams(window.location.search).get("search")?.trim();
const title = document.getElementById("search-title");
const info = document.getElementById("search-info");
const productList = document.querySelector(".product-list");
const noResults = document.getElementById("no-results");

if (!query) {
  window.location.replace("../index.html");
} else {
  title.textContent = `Results for “${query}”`;
  info.textContent = "Searching the collection…";
  try {
    const results = await searchProducts(query);
    info.textContent = `${results.length} product${results.length === 1 ? "" : "s"} found`;
    if (!results.length) {
      noResults.hidden = false;
    } else {
      productList.innerHTML = results.map((product) => `<li class="product-card">
        <a href="../product_pages/?product=${encodeURIComponent(product.Id)}">
          <img src="${escapeHTML(product.Images?.PrimaryLarge || product.Images?.PrimaryMedium || product.Image || productPlaceholder)}" data-fallback="${productPlaceholder}" alt="${escapeHTML(product.Name)}" loading="lazy">
          <div class="product-card__body">
            <p class="card__brand">${escapeHTML(product.Brand?.Name || "Outdoor gear")}</p>
            <h3 class="card__name">${escapeHTML(product.NameWithoutBrand || product.Name)}</h3>
            <p class="product-card__price">$${Number(product.FinalPrice || 0).toFixed(2)}</p>
          </div>
        </a>
      </li>`).join("");
      productList.querySelectorAll("img[data-fallback]").forEach((image) => {
        image.addEventListener("error", () => {
          image.src = image.dataset.fallback;
          image.removeAttribute("data-fallback");
        }, { once: true });
      });
    }
  } catch (error) {
    console.error("Search failed:", error);
    info.textContent = "Search is unavailable right now. Please try again.";
  }
}
