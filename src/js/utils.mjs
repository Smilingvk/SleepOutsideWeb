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

// ...existing code...
// Load template from a file
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template: ${path} (${res.status})`);
  }
  const template = await res.text();
  return template;
}

// Load header and footer
export async function loadHeaderFooter() {
  // Construct partials path relative to this module so it works on GH Pages
  const partialsBase = new URL("../partials/", import.meta.url);
  const headerPath = new URL("header.html", partialsBase).href;
  const footerPath = new URL("footer.html", partialsBase).href;

  try {
    const [headerTemplate, footerTemplate] = await Promise.all([
      loadTemplate(headerPath),
      loadTemplate(footerPath),
    ]);

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (headerElement) renderWithTemplate(headerTemplate, headerElement);
    if (footerElement) renderWithTemplate(footerTemplate, footerElement);
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}
// ...existing code...