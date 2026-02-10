// UTILS.MJS - FIXED VERSION

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
  console.log("📄 Loading template:", path);
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Template not found: ${path}`);
  }
  return await res.text();
}

export async function loadHeaderFooter() {
  console.log("📄 Loading header and footer...");
  
  try {
    // Determinar la ruta base según la ubicación actual
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Si estamos en un subdirectorio, necesitamos subir un nivel
    if (currentPath.includes('/cart/') || 
        currentPath.includes('/checkout/') || 
        currentPath.includes('/product_pages/') || 
        currentPath.includes('/product_listing/')) {
      basePath = '../';
    }
    
    // Cargar templates
    const headerTemplate = await loadTemplate(`${basePath}public/partials/header.html`);
    const footerTemplate = await loadTemplate(`${basePath}public/partials/footer.html`);
    
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
      console.log("✅ Header loaded");
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
      console.log("✅ Footer loaded");
    }
    
  } catch (error) {
    console.error("❌ Error loading header/footer:", error);
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = cartItems.length;
  
  // Try to find or create the cart count badge
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