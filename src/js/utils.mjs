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
    
    console.log('🔍 Current path:', path);
    
    // Para GitHub Pages - detectar si estamos en subdirectorio
    if (path.includes('/cart/') || 
        path.includes('/checkout/') || 
        path.includes('/product_pages/') || 
        path.includes('/product_listing/')) {
      base = '../';
      console.log('📁 In subdirectory, base:', base);
    } else {
      console.log('📁 In root directory');
    }
    
    const headerTemplate = await loadTemplate(base + 'public/partials/header.html');
    const footerTemplate = await loadTemplate(base + 'public/partials/footer.html');
    
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
      console.log('✅ Header loaded');
      // Inicializar funcionalidades del header después de cargarlo
      initializeHeaderFeatures(base);
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
      console.log('✅ Footer loaded');
    }
    
  } catch (error) {
    console.error("❌ Error loading header/footer:", error);
  }
}

function initializeHeaderFeatures(base = '') {
  console.log('🚀 Initializing header features with base:', base || '(root)');
  
  // Configurar rutas dinámicas del header
  setupHeaderLinks(base);
  
  // Actualizar contador del carrito
  updateCartCount();
  
  // Inicializar búsqueda
  setupSearch(base);
}

function setupHeaderLinks(base) {
  console.log('🔗 Setting up header links...');
  
  // Configurar link del carrito
  const cartLink = document.querySelector('.cart a');
  if (cartLink) {
    const cartUrl = base + 'cart/index.html';
    cartLink.href = cartUrl;
    console.log('🛒 Cart link set to:', cartUrl);
  } else {
    console.warn('⚠️ Cart link not found');
  }
  
  // Configurar link del logo (home)
  const homeLink = document.querySelector('.logo a');
  if (homeLink) {
    const homeUrl = base + 'index.html';
    homeLink.href = homeUrl;
    console.log('🏠 Home link set to:', homeUrl);
  } else {
    console.warn('⚠️ Home link not found');
  }
  
  // Configurar imagen del logo
  const logoImg = document.querySelector('.logo img');
  if (logoImg) {
    const logoUrl = base + 'images/noun_Tent_2517.svg';
    logoImg.src = logoUrl;
    console.log('🖼️ Logo image set to:', logoUrl);
  } else {
    console.warn('⚠️ Logo image not found');
  }
}

function setupSearch(base) {
  console.log('🔎 Setting up search...');
  
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      
      console.log('🔍 Search submitted:', query);
      
      if (query.length > 0) {
        let redirectUrl = "";
        
        // Si ya tenemos base (estamos en subdirectorio), ajustar
        if (base) {
          redirectUrl = `${base}product_listing/index.html?search=${encodeURIComponent(query)}`;
        } else {
          redirectUrl = `product_listing/index.html?search=${encodeURIComponent(query)}`;
        }
        
        console.log('➡️ Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      }
    });
    console.log('✅ Search initialized');
  } else {
    console.warn('⚠️ Search form not found');
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = cartItems.length;
  
  console.log('🛒 Updating cart count:', cartCount);
  
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