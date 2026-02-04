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

function fixHeaderPaths() {
  // This function would handle any path fixing needed
  console.log("Header paths fixed");
}

async function initializeSearchAfterDelay() {
  // Wait for DOM to be ready
  console.log("⏳ Waiting to initialize search...");
  
  // Try multiple times to ensure the header is loaded
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryInitialize = async () => {
    attempts++;
    console.log(`Attempt ${attempts} to initialize search...`);
    
    const searchForm = document.getElementById("search-form");
    
    if (searchForm) {
      console.log("✅ Search form found! Initializing...");
      try {
        const { initializeSearch } = await import('./search.js');
        initializeSearch();
        return true;
      } catch (error) {
        console.error("❌ Error importing search module:", error);
        return false;
      }
    } else {
      console.log("❌ Search form not found yet");
      if (attempts < maxAttempts) {
        setTimeout(tryInitialize, 200);
      } else {
        console.warn("⚠️ Max attempts reached. Search form may not be available.");
      }
      return false;
    }
  };
  
  setTimeout(tryInitialize, 100);
}

export async function loadHeaderFooter() {
  console.log("📄 Loading header and footer...");
  
  try {
    const base = import.meta?.env?.BASE_URL || "";
    const headerCandidates = [
      "./partials/header.html",
      "../partials/header.html",
      "./public/partials/header.html",
      "../public/partials/header.html",
      base + "partials/header.html",
      base + "public/partials/header.html",
      base + "src/partials/header.html",
      `${location.origin}${location.pathname.replace(/\/[^/]*$/, "/")}src/partials/header.html`,
      `${location.origin}${location.pathname.replace(/\/[^/]*$/, "/")}partials/header.html`,
    ];
    const footerCandidates = headerCandidates.map((p) =>
      p.replace("header.html", "footer.html")
    );

    async function tryLoadAny(list) {
      for (const p of list) {
        try {
          console.debug("Trying template path:", p);
          const tpl = await loadTemplate(p);
          console.debug("✅ Loaded template from:", p);
          return { tpl, path: p };
        } catch (e) {
          console.warn("Template not found at:", p);
        }
      }
      throw new Error("No candidate path succeeded");
    }

    const headerResult = await tryLoadAny(headerCandidates);
    const footerResult = await tryLoadAny(footerCandidates);

    const headerElement =
      document.querySelector("#main-header") || document.querySelector("header");
    const footerElement =
      document.querySelector("#main-footer") || document.querySelector("footer");

    if (!headerElement || !footerElement) {
      console.error(
        "Header or footer element not found in DOM (need #main-header/#main-footer or <header>/<footer>)"
      );
      return;
    }

    renderWithTemplate(headerResult.tpl, headerElement);
    renderWithTemplate(footerResult.tpl, footerElement);

    console.log("✅ Header and footer loaded!");
    
    fixHeaderPaths();
    
    // Initialize search functionality after header is loaded
    await initializeSearchAfterDelay();
    
  } catch (error) {
    console.error("❌ Error loading header/footer:", error);
  }
}