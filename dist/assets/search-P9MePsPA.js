import{l,c as s,p as o}from"./utils-DSK5HyOz.js";await l();function a(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const r=new URLSearchParams(window.location.search).get("search")?.trim(),i=document.getElementById("search-title"),n=document.getElementById("search-info"),c=document.querySelector(".product-list"),d=document.getElementById("no-results");if(!r)window.location.replace("../index.html");else{i.textContent=`Results for “${r}”`,n.textContent="Searching the collection…";try{const t=await s(r);n.textContent=`${t.length} product${t.length===1?"":"s"} found`,t.length?(c.innerHTML=t.map(e=>`<li class="product-card">
        <a href="../product_pages/?product=${encodeURIComponent(e.Id)}">
          <img src="${a(e.Images?.PrimaryLarge||e.Images?.PrimaryMedium||e.Image||o)}" data-fallback="${o}" alt="${a(e.Name)}" loading="lazy">
          <div class="product-card__body">
            <p class="card__brand">${a(e.Brand?.Name||"Outdoor gear")}</p>
            <h3 class="card__name">${a(e.NameWithoutBrand||e.Name)}</h3>
            <p class="product-card__price">$${Number(e.FinalPrice||0).toFixed(2)}</p>
          </div>
        </a>
      </li>`).join(""),c.querySelectorAll("img[data-fallback]").forEach(e=>{e.addEventListener("error",()=>{e.src=e.dataset.fallback,e.removeAttribute("data-fallback")},{once:!0})})):d.hidden=!1}catch(t){console.error("Search failed:",t),n.textContent="Search is unavailable right now. Please try again."}}
