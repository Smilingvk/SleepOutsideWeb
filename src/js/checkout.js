import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Initialize checkout process
const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

// Listen for zip code input to calculate totals
const zipInput = document.getElementById("zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });

  // Also calculate on input if zip is already filled
  zipInput.addEventListener("input", () => {
    if (zipInput.value.length === 5) {
      checkout.calculateOrderTotal();
    }
  });
}

// Handle form submission
const checkoutForm = document.getElementById("checkout-form");
const alertDiv = document.getElementById("checkout-alert");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state
    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Processing...";
    submitButton.disabled = true;

    // Hide any previous alerts
    alertDiv.classList.remove("show", "success", "error");

    try {
      // Submit the order
      const response = await checkout.checkout(checkoutForm);

      console.log("Checkout successful:", response);

      // Show success message
      alertDiv.textContent = "Order placed successfully! Thank you for your purchase.";
      alertDiv.classList.add("alert", "success", "show");

      // Clear the form
      checkoutForm.reset();

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 3000);
    } catch (error) {
      console.error("Checkout failed:", error);

      // Show error message
      alertDiv.textContent =
        "There was an error processing your order. Please try again.";
      alertDiv.classList.add("alert", "error", "show");

      // Re-enable button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
}

// Calculate totals on page load if cart has items
checkout.calculateOrderTotal();