const baseURL = "https://wdd330-backend.onrender.com/";
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
let catalogRequest;

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

async function getCatalog() {
  if (!catalogRequest) {
    catalogRequest = Promise.all(categories.map(async (category) => {
      const response = await fetch(`${baseURL}products/search/${category}`);
      if (!response.ok) throw new Error(`Could not load ${category}.`);
      const data = await response.json();
      return data.Result || [];
    }))
      .then((groups) => groups.flat())
      .catch((error) => {
        catalogRequest = null;
        throw error;
      });
  }
  return catalogRequest;
}

export async function searchProducts(query) {
  const term = normalize(query);
  if (!term) return [];

  const items = await getCatalog();
  const aliases = {
    bag: ["backpacks", "sleeping-bags"],
    bags: ["backpacks", "sleeping-bags"],
    backpack: ["backpacks"],
    backpacks: ["backpacks"],
    sleeping: ["sleeping-bags"],
    "sleeping bag": ["sleeping-bags"],
    "sleeping bags": ["sleeping-bags"],
    tent: ["tents"],
    tents: ["tents"],
    hammock: ["hammocks"],
    hammocks: ["hammocks"],
  };
  const categoryMatches = aliases[term] || [];

  return items
    .map((product) => {
      const category = normalize(product.Category).replace(/\s+/g, "-");
      const name = normalize(`${product.Name || ""} ${product.NameWithoutBrand || ""}`);
      const brand = normalize(product.Brand?.Name || "");
      const description = normalize(String(product.DescriptionHtmlSimple || "").replace(/<[^>]*>/g, " "));
      const searchableText = `${name} ${brand} ${category.replace(/-/g, " ")} ${description}`;
      const allWordsMatch = term.split(/\s+/).every((word) => searchableText.includes(word));
      if (!searchableText.includes(term) && !allWordsMatch && !categoryMatches.includes(category)) return null;

      let score = 0;
      if (name === term) score += 100;
      else if (name.startsWith(term)) score += 50;
      else if (name.includes(term)) score += 30;
      if (brand.includes(term)) score += 15;
      if (categoryMatches.includes(category)) score += 10;
      return { product, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.product.Name.localeCompare(b.product.Name))
    .map(({ product }) => product);
}
