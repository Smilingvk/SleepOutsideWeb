import{g as o,s,u as c,a as i,p as d,l as n,b as l}from"./utils-DSK5HyOz.js";import{E as u}from"./ExternalServices-DAeCCKjG.js";function m(t){return`
    <p class="eyebrow">${t.Brand?.Name||"Outdoor gear"}</p>
    <h2>${t.NameWithoutBrand||t.Name}</h2>
    <img src="${t.Images?.PrimaryLarge||t.Images?.PrimaryMedium||t.Image||d}" data-fallback="${d}" alt="${t.NameWithoutBrand||t.Name}" id="productImage" class="divider" />
    <p id="productPrice" class="product-card__price">$${t.FinalPrice}</p>
    <p id="productColor" class="product__color">${t.Colors?.[0]?.ColorName||"N/A"}</p>
    <div id="productDesc" class="product__description">${t.DescriptionHtmlSimple}</div>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${t.Id}">Add to Cart</button>
    </div>
  `}class p{constructor(e,a){this.productId=e,this.product={},this.dataSource=a}async init(){this.product=await this.dataSource.findProductById(this.productId),this.renderProductDetails(),document.getElementById("addToCart").addEventListener("click",this.addProductToCart.bind(this))}addProductToCart(){const e=o("so-cart")||[];e.push(this.product),s("so-cart",e),c(!0),i(`${this.product.Name} has been added to your cart!`,!1);const a=document.getElementById("addToCart"),r=a.textContent;a.textContent="Added!",a.classList.add("is-added"),setTimeout(()=>{a.textContent=r,a.classList.remove("is-added")},1500)}renderProductDetails(){const e=document.querySelector(".product-detail");if(e){e.innerHTML=m(this.product);const a=e.querySelector("#productImage");a?.addEventListener("error",()=>{a.src=a.dataset.fallback,a.removeAttribute("data-fallback")},{once:!0})}}}await n();const h={"marmot-ajax-3.html":"880RR","northface-talus-4.html":"985RF","northface-alpine-3.html":"985PR","cedar-ridge-rimrock-2.html":"344YJ"},g=l("product")||h[window.location.pathname.split("/").pop()],C=new u,I=new p(g,C);I.init();
