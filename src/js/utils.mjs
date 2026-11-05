import { searchProducts } from "./search.js";
import productPlaceholder from "../images/product-placeholder.svg";

// UTILS.MJS - GITHUB PAGES VERSION CON ANIMACIÓN DEL CARRITO

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? null;
  } catch (error) {
    console.warn(`Could not read saved data for ${key}.`, error);
    return null;
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

export function renderWithTemplate(template, parentElement) {
  parentElement.innerHTML = template;
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Template not found: ${path}`);
  }
  return await res.text();
}

export async function loadHeaderFooter() {
  const inSection = /\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname);
  const base = inSection ? "../" : "";
  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  try {
    const [headerTemplate, footerTemplate] = await Promise.all([
      loadTemplate(`${base}partials/header.html`),
      loadTemplate(`${base}partials/footer.html`),
    ]);
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
      const homeLink = headerElement.querySelector(".logo");
      const logoImage = headerElement.querySelector(".logo img");
      const cartLink = headerElement.querySelector("#cart-link");
      const prefix = inSection ? "../" : "";
      if (homeLink) homeLink.href = `${prefix}index.html`;
      if (logoImage) logoImage.src = `${prefix}images/brand-icon.webp`;
      if (cartLink) cartLink.href = window.location.pathname.includes("/cart/")
        ? "index.html"
        : `${prefix}cart/index.html`;
      initializeHeaderFeatures();
    }
    if (footerElement) renderWithTemplate(footerTemplate, footerElement);
  } catch (error) {
    console.error("Could not load shared page chrome:", error);
  }
}

function initializeHeaderFeatures() {
  updateCartCount();
  const searchForm = qs("#search-form");
  const searchInput = qs("#search-input");
  const suggestions = qs("#search-suggestions");
  if (!searchForm || !searchInput) return;

  let debounceTimer;
  const closeSuggestions = () => {
    if (suggestions) suggestions.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
  };
  const showSuggestions = (content) => {
    if (!suggestions) return;
    suggestions.innerHTML = content;
    suggestions.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  };

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    window.clearTimeout(debounceTimer);
    if (!query) {
      closeSuggestions();
      return;
    }

    showSuggestions('<p class="search-suggestion-message">Searching products…</p>');
    debounceTimer = window.setTimeout(async () => {
      try {
        const products = await searchProducts(query);
        if (searchInput.value.trim() !== query) return;
        if (!products.length) {
          showSuggestions('<p class="search-suggestion-message">No matching products found.</p>');
          return;
        }

        const inSection = /\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname);
        const productBase = `${inSection ? "../" : ""}product_pages/?product=`;
        showSuggestions(products.slice(0, 6).map((product) => {
          const image = product.Images?.PrimarySmall || product.Images?.PrimaryMedium || productPlaceholder;
          return `<a class="search-suggestion" role="option" href="${productBase}${encodeURIComponent(product.Id)}">
            <img src="${escapeHTML(image)}" alt="" data-fallback="${productPlaceholder}" />
            <span class="search-suggestion__copy"><strong>${escapeHTML(product.Name)}</strong><small>${escapeHTML(product.Brand?.Name || "Outdoor gear")}</small></span>
            <span class="search-suggestion__price">$${Number(product.FinalPrice || 0).toFixed(2)}</span>
          </a>`;
        }).join(""));

        suggestions.querySelectorAll("img[data-fallback]").forEach((image) => {
          image.addEventListener("error", () => {
            image.src = image.dataset.fallback;
            image.removeAttribute("data-fallback");
          }, { once: true });
        });
      } catch (error) {
        if (searchInput.value.trim() === query) {
          showSuggestions('<p class="search-suggestion-message">Search is unavailable right now.</p>');
        }
      }
    }, 220);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSuggestions();
    if (event.key === "ArrowDown" && suggestions && !suggestions.hidden) {
      event.preventDefault();
      suggestions.querySelector("a")?.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-container")) closeSuggestions();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    closeSuggestions();
    const inSection = /\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname);
    const target = window.location.pathname.includes("/product_listing/")
      ? "index.html"
      : `${inSection ? "../" : ""}product_listing/index.html`;
    window.location.href = `${target}?search=${encodeURIComponent(query)}`;
  });
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

/**
 * Anima el ícono del carrito cuando se agrega un producto
 * @param {string} animationType - Tipo de animación: 'bounce', 'shake', 'bounce-shake', 'flash'
 */
export function animateCart(animationType = 'bounce-shake') {
  const cartElement = document.querySelector('.cart');
  const cartBadge = document.querySelector('.cart-count');
  
  if (!cartElement) return;
  
  // Remover cualquier animación anterior
  cartElement.classList.remove('animate-bounce', 'animate-shake', 'animate-bounce-shake', 'flash');
  
  // Forzar reflow para que la animación se pueda repetir
  void cartElement.offsetWidth;
  
  // Agregar la clase de animación
  switch(animationType) {
    case 'bounce':
      cartElement.classList.add('animate-bounce');
      break;
    case 'shake':
      cartElement.classList.add('animate-shake');
      break;
    case 'flash':
      cartElement.classList.add('flash');
      break;
    case 'bounce-shake':
    default:
      cartElement.classList.add('animate-bounce-shake');
      break;
  }
  
  // Animar el badge si existe
  if (cartBadge) {
    cartBadge.classList.remove('pulse');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('pulse');
    
    // Remover la clase después de la animación
    setTimeout(() => {
      cartBadge.classList.remove('pulse');
    }, 400);
  }
  
  // Remover la clase de animación después de que termine
  setTimeout(() => {
    cartElement.classList.remove('animate-bounce', 'animate-shake', 'animate-bounce-shake', 'flash');
  }, 700);
}

/**
 * Actualiza el contador del carrito
 * @param {boolean} animate - Si debe animar o no
 */
export function updateCartCount(animate = false) {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = cartItems.length;
  
  let badge = document.querySelector('.cart-count');
  
  if (cartCount > 0) {
    if (!badge) {
      const cartDiv = document.querySelector('.cart');
      if (cartDiv) {
        badge = document.createElement('span');
        badge.className = 'cart-count';
        cartDiv.appendChild(badge);
      }
    }
    if (badge) {
      const oldCount = parseInt(badge.textContent) || 0;
      badge.textContent = cartCount;
      badge.style.display = 'flex';
      
      // Animar solo si el número cambió y se solicitó animación
      if (animate && oldCount !== cartCount) {
        animateCart('bounce-shake');
      }
    }
  } else if (badge) {
    badge.style.display = 'none';
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.setAttribute("role", "alert");
  const text = document.createElement("p");
  text.textContent = String(message).replace(/<br\s*\/?\s*>/gi, " ");
  const close = document.createElement("button");
  close.className = "close-alert";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss message");
  close.textContent = "×";
  alert.append(text, close);
  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-alert')) {
      this.remove();
    }
  });
  const main = document.querySelector('main');
  if (!main) return;
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => alert.remove());
}
