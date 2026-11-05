import { loadHeaderFooter, getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import productPlaceholder from "../images/product-placeholder.svg";

await loadHeaderFooter();

const list = document.querySelector(".cart-list");
const productsSection = document.querySelector(".products");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function productImage(item) {
  return item.Images?.PrimaryMedium || item.Images?.PrimarySmall || item.Image || productPlaceholder;
}

function groupCartItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    const key = String(item.Id || item.Name);
    if (!groups.has(key)) groups.set(key, { item, quantity: 0 });
    groups.get(key).quantity += 1;
  });
  return [...groups.entries()].map(([id, group]) => ({ id, ...group }));
}

function renderCartContents() {
  const items = getLocalStorage("so-cart") || [];
  const groups = groupCartItems(items);
  const previousSummary = productsSection.querySelector(".cart-footer");
  previousSummary?.remove();

  if (!groups.length) {
    list.innerHTML = `<li class="empty-state">
      <h2>Your cart is waiting for an adventure.</h2>
      <p>Explore the collection and find the gear for your next night outside.</p>
      <a class="button" href="../product_listing/index.html?category=tents">Explore gear</a>
    </li>`;
    return;
  }

  list.innerHTML = groups.map(({ id, item, quantity }) => `<li class="cart-card">
    <a href="../product_pages/?product=${encodeURIComponent(item.Id)}" class="cart-card__image" aria-label="View ${escapeHTML(item.Name)}">
      <img src="${escapeHTML(productImage(item))}" data-fallback="${productPlaceholder}" alt="${escapeHTML(item.Name)}" loading="lazy" />
    </a>
    <div class="cart-card__details">
      <h2><a href="../product_pages/?product=${encodeURIComponent(item.Id)}">${escapeHTML(item.Name)}</a></h2>
      <p>${escapeHTML(item.Colors?.[0]?.ColorName || "")}</p>
      <div class="quantity-control" aria-label="Quantity for ${escapeHTML(item.Name)}">
        <button type="button" class="quantity-button" data-action="decrease" data-id="${escapeHTML(id)}" aria-label="Decrease quantity" title="Decrease quantity">−</button>
        <output class="quantity-value" aria-live="polite">${quantity}</output>
        <button type="button" class="quantity-button" data-action="increase" data-id="${escapeHTML(id)}" aria-label="Increase quantity" title="Increase quantity">+</button>
      </div>
      <button type="button" class="remove-item" data-action="remove" data-id="${escapeHTML(id)}">Remove item</button>
    </div>
    <p class="cart-card__price">$${Number(item.FinalPrice || 0).toFixed(2)} <span>each</span></p>
  </li>`).join("");

  list.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = image.dataset.fallback;
      image.removeAttribute("data-fallback");
    }, { once: true });
  });

  const total = items.reduce((sum, item) => sum + Number(item.FinalPrice || 0), 0);
  const itemCount = items.length;
  const summary = document.createElement("div");
  summary.className = "cart-footer";
  summary.innerHTML = `<p>${itemCount} item${itemCount === 1 ? "" : "s"}</p>
    <p class="cart-total">Total: $${total.toFixed(2)}</p>
    <a class="button" href="../checkout/index.html">Continue to checkout</a>`;
  productsSection.append(summary);
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const items = getLocalStorage("so-cart") || [];
  const id = button.dataset.id;
  const matchingIndexes = items.reduce((indexes, item, index) => {
    if (String(item.Id || item.Name) === id) indexes.push(index);
    return indexes;
  }, []);
  if (!matchingIndexes.length) return;

  if (button.dataset.action === "remove") {
    setLocalStorage("so-cart", items.filter((item) => String(item.Id || item.Name) !== id));
  } else if (button.dataset.action === "increase") {
    items.push(items[matchingIndexes[0]]);
    setLocalStorage("so-cart", items);
  } else if (button.dataset.action === "decrease") {
    items.splice(matchingIndexes[matchingIndexes.length - 1], 1);
    setLocalStorage("so-cart", items);
  }

  renderCartContents();
  updateCartCount();
});

renderCartContents();
