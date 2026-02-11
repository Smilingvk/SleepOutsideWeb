// UTILS.MJS - GITHUB PAGES VERSION

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
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
  try {
    const path = window.location.pathname;
    let base = '';
    
    // Para GitHub Pages - detectar si estamos en subdirectorio
    if (path.includes('/cart/') || 
        path.includes('/checkout/') || 
        path.includes('/product_pages/') || 
        path.includes('/product_listing/')) {
      base = '../';
    }
    
    const headerTemplate = await loadTemplate(base + 'public/partials/header.html');
    const footerTemplate = await loadTemplate(base + 'public/partials/footer.html');
    
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
      // Inicializar funcionalidades del header después de cargarlo
      initializeHeaderFeatures();
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

function initializeHeaderFeatures() {
  // Actualizar contador del carrito
  updateCartCount();
  
  // Inicializar búsqueda
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      
      if (query.length > 0) {
        const currentPath = window.location.pathname;
        let redirectUrl = "";
        
        // Detectar la ubicación actual y redirigir apropiadamente
        if (currentPath.includes("index.html") || currentPath.endsWith("/") || !currentPath.includes("/")) {
          redirectUrl = `product_listing/index.html?search=${encodeURIComponent(query)}`;
        } else if (currentPath.includes("product_listing")) {
          redirectUrl = `index.html?search=${encodeURIComponent(query)}`;
        } else {
          redirectUrl = `../product_listing/index.html?search=${encodeURIComponent(query)}`;
        }
        
        window.location.href = redirectUrl;
      }
    });
  }
}

export function updateCartCount() {
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
      badge.textContent = cartCount;
      badge.style.display = 'flex';
    }
  } else if (badge) {
    badge.style.display = 'none';
  }
}