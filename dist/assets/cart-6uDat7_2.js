import{g as c}from"./utils-C1ZufQCI.js";/* empty css              */function l(){const t=c("so-cart")||[],r=document.querySelector(".product-list");if(t.length===0){r.innerHTML=`
      <div style="text-align: center; padding: 2rem; color: var(--dark-grey);">
        <p style="font-size: 1.2em; margin-bottom: 1rem;">Your cart is empty</p>
        <a href="../index.html" style="color: var(--secondary-color); text-decoration: underline;">
          Continue Shopping
        </a>
      </div>
    `;const e=document.querySelector(".cart-footer");e&&(e.style.display="none");return}const o=t.map(e=>i(e));r.innerHTML=o.join(""),s(t)}function i(t){return`<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${t.Image}"
      alt="${t.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${t.Name}</h2>
  </a>
  <p class="cart-card__color">${t.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${t.FinalPrice}</p>
</li>`}function s(t){const r=t.reduce((a,n)=>a+n.FinalPrice,0),o=t.length;let e=document.querySelector(".cart-footer");e||(e=document.createElement("div"),e.className="cart-footer",e.style.cssText=`
      margin-top: 2rem;
      padding: 1rem;
      border-top: 2px solid var(--primary-color);
      text-align: right;
    `,document.querySelector(".products").appendChild(e)),e.innerHTML=`
    <p style="font-size: 1.1em; margin-bottom: 0.5rem;">
      <strong>Items in Cart:</strong> ${o}
    </p>
    <p style="font-size: 1.3em; color: var(--tertiary-color); font-weight: bold;">
      <strong>Total:</strong> $${r.toFixed(2)}
    </p>
  `,e.style.display="block"}l();
