const baseURL = "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    console.log("🔍 Buscando productos para:", category);
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    console.log("✅ Productos encontrados:", data.Result.length);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(order) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    const data = await convertToJson(response);
    return data;
  }
}