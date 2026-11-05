import{l as y,g as p,s as u,u as h,p as m}from"./utils-DSK5HyOz.js";await y();const l=document.querySelector(".cart-list"),d=document.querySelector(".products");function s(e=""){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function b(e){return e.Images?.PrimaryMedium||e.Images?.PrimarySmall||e.Image||m}function $(e){const t=new Map;return e.forEach(a=>{const n=String(a.Id||a.Name);t.has(n)||t.set(n,{item:a,quantity:0}),t.get(n).quantity+=1}),[...t.entries()].map(([a,n])=>({id:a,...n}))}function g(){const e=p("so-cart")||[],t=$(e);if(d.querySelector(".cart-footer")?.remove(),!t.length){l.innerHTML=`<li class="empty-state">
      <h2>Your cart is waiting for an adventure.</h2>
      <p>Explore the collection and find the gear for your next night outside.</p>
      <a class="button" href="../product_listing/index.html?category=tents">Explore gear</a>
    </li>`;return}l.innerHTML=t.map(({id:r,item:o,quantity:f})=>`<li class="cart-card">
    <a href="../product_pages/?product=${encodeURIComponent(o.Id)}" class="cart-card__image" aria-label="View ${s(o.Name)}">
      <img src="${s(b(o))}" data-fallback="${m}" alt="${s(o.Name)}" loading="lazy" />
    </a>
    <div class="cart-card__details">
      <h2><a href="../product_pages/?product=${encodeURIComponent(o.Id)}">${s(o.Name)}</a></h2>
      <p>${s(o.Colors?.[0]?.ColorName||"")}</p>
      <div class="quantity-control" aria-label="Quantity for ${s(o.Name)}">
        <button type="button" class="quantity-button" data-action="decrease" data-id="${s(r)}" aria-label="Decrease quantity" title="Decrease quantity">−</button>
        <output class="quantity-value" aria-live="polite">${f}</output>
        <button type="button" class="quantity-button" data-action="increase" data-id="${s(r)}" aria-label="Increase quantity" title="Increase quantity">+</button>
      </div>
      <button type="button" class="remove-item" data-action="remove" data-id="${s(r)}">Remove item</button>
    </div>
    <p class="cart-card__price">$${Number(o.FinalPrice||0).toFixed(2)} <span>each</span></p>
  </li>`).join(""),l.querySelectorAll("img[data-fallback]").forEach(r=>{r.addEventListener("error",()=>{r.src=r.dataset.fallback,r.removeAttribute("data-fallback")},{once:!0})});const n=e.reduce((r,o)=>r+Number(o.FinalPrice||0),0),i=e.length,c=document.createElement("div");c.className="cart-footer",c.innerHTML=`<p>${i} item${i===1?"":"s"}</p>
    <p class="cart-total">Total: $${n.toFixed(2)}</p>
    <a class="button" href="../checkout/index.html">Continue to checkout</a>`,d.append(c)}l.addEventListener("click",e=>{const t=e.target.closest("button[data-action]");if(!t)return;const a=p("so-cart")||[],n=t.dataset.id,i=a.reduce((c,r,o)=>(String(r.Id||r.Name)===n&&c.push(o),c),[]);i.length&&(t.dataset.action==="remove"?u("so-cart",a.filter(c=>String(c.Id||c.Name)!==n)):t.dataset.action==="increase"?(a.push(a[i[0]]),u("so-cart",a)):t.dataset.action==="decrease"&&(a.splice(i[i.length-1],1),u("so-cart",a)),g(),h())});g();
