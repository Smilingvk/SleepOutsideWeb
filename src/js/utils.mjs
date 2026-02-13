// UTILS.MJS - GITHUB PAGES VERSION CON ANIMACIÓN DEL CARRITO

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
      // Fix header links después de cargar
      fixHeaderLinks();
    }
    
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

function fixHeaderLinks() {
  const currentPath = window.location.pathname;
  
  // Fix logo link
  const logoLink = document.querySelector('.logo a');
  if (logoLink) {
    if (currentPath.includes('/cart/') || 
        currentPath.includes('/checkout/') || 
        currentPath.includes('/product_pages/') || 
        currentPath.includes('/product_listing/')) {
      logoLink.href = '../index.html';
    } else {
      logoLink.href = 'index.html';
    }
  }
  
  // Fix logo image
  const logoImg = document.querySelector('.logo img');
  if (logoImg) {
    if (currentPath.includes('/cart/') || 
        currentPath.includes('/checkout/') || 
        currentPath.includes('/product_pages/') || 
        currentPath.includes('/product_listing/')) {
      logoImg.src = '../images/noun_Tent_2517.svg';
    } else {
      logoImg.src = 'images/noun_Tent_2517.svg';
    }
  }
  
  // Fix cart link (esto lo hace el script en header.html, pero por si acaso)
  const cartLink = document.getElementById('cart-link');
  if (cartLink && !cartLink.href.includes('index.html')) {
    let cartUrl = '';
    
    if (currentPath.includes('/cart/')) {
      cartUrl = 'index.html';
    } else if (currentPath.includes('/checkout/') || 
               currentPath.includes('/product_pages/') || 
               currentPath.includes('/product_listing/')) {
      cartUrl = '../cart/index.html';
    } else {
      cartUrl = 'cart/index.html';
    }
    
    cartLink.href = cartUrl;
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
  // Create element to hold the alert
  const alert = document.createElement('div');
  alert.classList.add('alert');
  
  // Set the contents with message and close button
  alert.innerHTML = `<p>${message}</p><span class="close-alert">X</span>`;
  
  // Add a listener to the alert to see if they clicked on the X
  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-alert')) {
      this.remove();
    }
  });
  
  // Add the alert to the top of main
  const main = document.querySelector('main');
  main.prepend(alert);
  
  // Make sure they see the alert by scrolling to the top of the window
  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => alert.remove());
}