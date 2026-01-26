import{g as c}from"./utils-C1ZufQCI.js";/* empty css              */function l(){const t=c("so-cart")||[],r=document.querySelector(".product-list");if(t.length===0){r.innerHTML=`
      <li class="cart-card divider" style="list-style: none; text-align: center; padding: 2rem;">
        <p style="font-size: 1.2em; margin-bottom: 1rem; color: var(--dark-grey);">Your cart is empty</p>
        <a href="/index.html" style="color: var(--secondary-color); text-decoration: underline;">
          Continue Shopping
        </a>
      </li>
    `;const e=document.querySelector(".cart-footer");e&&(e.style.display="none");return}const o=t.map(e=>s(e));r.innerHTML=o.join(""),i(t)}function s(t){return`<li class="cart-card divider">
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
</li>`}function i(t){const r=t.reduce((a,n)=>a+n.FinalPrice,0),o=t.length;let e=document.querySelector(".cart-footer");e||(e=document.createElement("li"),e.className="cart-footer",e.style.cssText=`
      list-style: none;
      margin-top: 2rem;
      padding: 1rem;
      border-top: 2px solid var(--primary-color);
      text-align: right;
    `,document.querySelector(".product-list").appendChild(e)),e.innerHTML=`
    <p style="font-size: 1.1em; margin-bottom: 0.5rem;">
      <strong>Items in Cart:</strong> ${o}
    </p>
    <p style="font-size: 1.3em; color: var(--tertiary-color); font-weight: bold;">
      <strong>Total:</strong> ${r.toFixed(2)}
    </p>
  `,e.style.display="block"}l();
