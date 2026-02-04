import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// takes a form element and returns an object where the key is the "name" of the form input.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // convert the list of products from localStorage to the simpler form required for the checkout process.
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1, // You can modify this if you implement quantity tracking
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    if (!this.list || this.list.length === 0) {
      this.itemTotal = 0;
    } else {
      this.itemTotal = this.list.reduce((total, item) => {
        return total + item.FinalPrice;
      }, 0);
    }

    // Display the item subtotal
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    const itemCountElement = document.querySelector(
      `${this.outputSelector} #item-count`
    );

    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    if (itemCountElement) {
      const itemCount = this.list ? this.list.length : 0;
      itemCountElement.innerText = `(${itemCount} item${itemCount !== 1 ? "s" : ""})`;
    }
  }

  calculateOrderTotal() {
    // Calculate tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;

    // Calculate shipping: $10 for first item + $2 for each additional item
    const itemCount = this.list ? this.list.length : 0;
    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Calculate order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display the totals
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #order-total`
    );

    if (taxElement) {
      taxElement.innerText = `$${this.tax.toFixed(2)}`;
    }

    if (shippingElement) {
      shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    }

    if (orderTotalElement) {
      orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    // Get form data and convert to JSON
    const formData = formDataToJSON(form);

    // Get current date in ISO format
    const orderDate = new Date().toISOString();

    // Package items for checkout
    const items = packageItems(this.list);

    // Create the order object in the format expected by the server
    const order = {
      orderDate: orderDate,
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: items,
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    console.log("Order to submit:", order);

    try {
      // Create ExternalServices instance and submit the order
      const services = new ExternalServices();
      const response = await services.checkout(order);

      console.log("Order response:", response);

      // Clear the cart after successful checkout
      setLocalStorage(this.key, []);

      return response;
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }
}