// UTILS.MJS - VERSIÓN SIMPLE Y PROBADA

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
  console.log("📄 Cargando template:", path);
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Template not found: ${path}`);
  }
  return await res.text();
}

export async function loadHeaderFooter() {
  console.log("📄 Loading header and footer...");
  
  try {
    // Intentar cargar header
    let headerTemplate;
    try {
      headerTemplate = await loadTemplate("../public/partials/header.html");
    } catch {
      try {
        headerTemplate = await loadTemplate("public/partials/header.html");
      } catch {
        headerTemplate = await loadTemplate("partials/header.html");
      }
    }
    
    // Intentar cargar footer
    let footerTemplate;
    try {
      footerTemplate = await loadTemplate("../public/partials/footer.html");
    } catch {
      try {
        footerTemplate = await loadTemplate("public/partials/footer.html");
      } catch {
        footerTemplate = await loadTemplate("partials/footer.html");
      }
    }
    
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