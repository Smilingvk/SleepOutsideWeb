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

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate the form
    const chk_status = checkoutForm.checkValidity();
    checkoutForm.reportValidity();
    
    if (!chk_status) {
      return; // Stop if form is invalid
    }

    // Show loading state
    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Processing...";
    submitButton.disabled = true;

    try {
      // Submit the order
      const response = await checkout.checkout(checkoutForm);

      console.log("Checkout successful:", response);

      // Redirect to success page
      window.location.href = "success.html";
    } catch (error) {
      console.error("Checkout failed:", error);

      // Re-enable button (error message already shown by CheckoutProcess)
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
}

// Calculate totals on page load if cart has items
checkout.calculateOrderTotal();