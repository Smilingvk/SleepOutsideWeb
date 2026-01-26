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
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Load header and footer
export async function loadHeaderFooter() {
  // Determine the correct path based on current location
  const path = window.location.pathname;
  let headerPath = "/partials/header.html";
  let footerPath = "/partials/footer.html";
  
  // Adjust paths for subdirectories
  if (path.includes("/cart/")) {
    headerPath = "../partials/header.html";
    footerPath = "../partials/footer.html";
  } else if (path.includes("/product_pages/")) {
    headerPath = "../partials/header.html";
    footerPath = "../partials/footer.html";
  } else if (path.includes("/checkout/")) {
    headerPath = "../partials/header.html";
    footerPath = "../partials/footer.html";
  }
  
  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);
  
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}