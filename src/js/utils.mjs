// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get URL query parameter by name
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

// New function for rendering a single template
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Load template from a file
export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${path} (${res.status})`);
    }
    const template = await res.text();
    return template;
  } catch (error) {
    console.error("Error loading template:", error);
    throw error;
  }
}

// Load header and footer
export async function loadHeaderFooter() {
  try {
    // Get current path to determine location
    const currentPath = window.location.pathname;
    
    // Determine relative path to partials based on current directory
    let partialsPath = './partials';
    
    // If we're in a subdirectory, go up one level
    if (currentPath.includes('/cart/') || 
        currentPath.includes('/product_pages/') || 
        currentPath.includes('/checkout/')) {
      partialsPath = '../partials';
    }
    
    console.log('Loading partials from:', partialsPath);
    
    const headerTemplate = await loadTemplate(`${partialsPath}/header.html`);
    const footerTemplate = await loadTemplate(`${partialsPath}/footer.html`);
    
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    
    if (!headerElement || !footerElement) {
      console.error('Header or footer element not found in DOM');
      return;
    }
    
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
    
    // Fix paths for root pages
    fixHeaderPaths();
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

// Fix header paths after loading based on current location
function fixHeaderPaths() {
  const currentPath = window.location.pathname;
  const isRootPage = currentPath === '/' || 
                     currentPath.endsWith('/index.html') || 
                     currentPath.match(/\/[^\/]*\.html$/) === null ||
                     (!currentPath.includes('/cart') && 
                      !currentPath.includes('/product_pages') && 
                      !currentPath.includes('/checkout'));
  
  if (isRootPage) {
    // Fix logo link and image for root page
    const logoLink = document.querySelector('.logo a');
    const logoImg = document.querySelector('.logo img');
    const cartLink = document.querySelector('.cart a');
    
    if (logoLink) logoLink.href = './index.html';
    if (logoImg) logoImg.src = './images/noun_Tent_2517.svg';
    if (cartLink) cartLink.href = './cart/index.html';
  }
}