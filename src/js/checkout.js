import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

await loadHeaderFooter();

if (!(getLocalStorage("so-cart") || []).length) {
  window.location.replace("../cart/index.html");
} else {
  const checkout = new CheckoutProcess("so-cart", ".order-summary");
  checkout.init();
  checkout.calculateOrderTotal();

  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) return;

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Processing…";
    submitButton.disabled = true;

    try {
      await checkout.checkout(checkoutForm);
      window.location.href = "success.html";
    } catch (error) {
      console.error("Checkout failed:", error);
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}
