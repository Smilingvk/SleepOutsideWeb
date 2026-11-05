import{d as c,p as i}from"./utils-DSK5HyOz.js";function s(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function l(t){const e=/\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname),a=`${e?"../":""}product_pages/?product=`,r=t.Images?.PrimaryLarge||t.Images?.PrimaryMedium||t.Image||i,n=String(r).replace(/^\.\.\/images\//,`${e?"../":""}images/`);return`<li class="product-card">
    <a href="${a}${encodeURIComponent(t.Id)}">
      <img src="${s(n)}" data-fallback="${i}" alt="${s(t.Name)}" loading="lazy">
      <div class="product-card__body">
        <p class="card__brand">${s(t.Brand?.Name||"Outdoor gear")}</p>
        <h3 class="card__name">${s(t.NameWithoutBrand||t.Name)}</h3>
        <p class="product-card__price">$${Number(t.FinalPrice||0).toFixed(2)}</p>
      </div>
    </a>
  </li>`}class d{constructor(e,a,r){this.category=e,this.dataSource=a,this.listElement=r,this.products=[]}async init(){if(this.listElement){this.listElement.setAttribute("aria-busy","true");try{this.products=await this.dataSource.getData(this.category),this.renderList(this.products)}catch(e){console.error("Could not load products:",e);const a=/\/(cart|checkout|product_pages|product_listing|search)\//.test(window.location.pathname)?"../index.html":"index.html";this.listElement.innerHTML=`<li class="empty-state"><p>We couldn't load these products right now.</p><a class="text-link" href="${a}">Return home</a></li>`}finally{this.listElement.removeAttribute("aria-busy")}}}renderList(e){const a=document.getElementById("no-results");if(this.listElement.innerHTML="",!e?.length){a&&(a.hidden=!1);return}a&&(a.hidden=!0),c(l,this.listElement,e),this.listElement.querySelectorAll("img[data-fallback]").forEach(r=>{r.addEventListener("error",()=>{r.src=r.dataset.fallback,r.removeAttribute("data-fallback")},{once:!0})})}}export{d as P};
