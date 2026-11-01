const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let L=localStorage.getItem('tk_lang');
const t=k=>{const o=((DB.data&&DB.data.settings.texts)||{})[L];return (o&&o[k])||(T[L]||T.en)[k]||T.en[k]||k;};
const NAME=()=>(DB.data&&DB.data.settings.name)||'TREND KOSMETİKA';
function applyTheme(){const th=DB.data.settings.theme;if(!th)return;for(const k in th)if(th[k])document.documentElement.style.setProperty('--'+k,th[k]);}
const an=a=>a.name[L]||a.name.en;
function setLang(l){localStorage.setItem('tk_lang',l);location.reload();}
function langPicker(){
  const cur=LANGS.find(x=>x[0]===L)||LANGS[0];
  return `<div class="lp"><button class="lpb" type="button" aria-haspopup="listbox" aria-label="Language" onclick="this.parentNode.classList.toggle('open')">${flagImg(cur[0])}<span>${cur[1]}</span><i>▾</i></button><ul class="lpl" role="listbox">${LANGS.map(l=>`<li><button type="button" class="${l[0]===L?'on':''}" onclick="setLang('${l[0]}')">${flagImg(l[0])}<span>${l[1]}</span></button></li>`).join('')}</ul></div>`;
}
document.addEventListener('click',e=>{if(!e.target.closest('.lp'))document.querySelectorAll('.lp.open').forEach(x=>x.classList.remove('open'));});
const IC={sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
 tag:'<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',pin:'<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
 insta:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',tiktok:'<path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5"/><path d="M14 3c.3 2.6 2 4.4 5 4.6"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const safe=u=>/^https?:\/\//.test(u)?esc(u):'#';
const CT=()=>{const C=DB.data.settings.contact||{},ph=C.phone||'+994 51 384 55 80';
 return {ph,tel:ph.replace(/[^\d+]/g,''),ad:C.address||'Yeni şirniyyat, sıra 5-6, mağaza 10',mp:C.maps||'https://maps.app.goo.gl/yv9MKragGhSCnDZH8',
  ig:C.instagram||'https://www.instagram.com/trend__kosmetika?stkn=a2lkODlodnJmdjJj',tk:C.tiktok||'https://www.tiktok.com/@trend__cosmetics?_r=1&_t=ZS-9AFaMqBDZTj',q:C.map||'40.332061,49.780442'};};
const card=w=>`<a class="card" href="product.html?id=${w.id}">${w.stock<=0?`<span class="badge no">${t('outOfStock')}</span>`:''}${imgTag(w,esc(w.brand+' '+w.model))}<div class="ci"><span>${esc(w.brand)} ${esc(w.model)}</span>${priceHTML(w)}</div>${w.stock>0?`<button class="add" onclick="addToCart(${w.id},event)">${t('addToCart')}</button>`:''}</a>`;
const inAlbum=(w,k)=>k==='all'||(w.tags||[]).includes(k);

function chrome(page){
  document.title=NAME();
  document.documentElement.lang=L||'en'; document.documentElement.dir='ltr';
  const H=DB.data.settings.home||{},c=CT();
  const nav=[['index','index.html','home'],['products','products.html','products'],['albums','albums.html','albums'],['contact','contact.html','contact'],['account','account.html','account']];
  $('#hdr').innerHTML=`<div class="bar"><a class="logo" href="index.html"><i>${esc(NAME().charAt(0))}</i><span>${esc(NAME())}</span></a>
   <button class="burger" aria-label="Menu" onclick="document.body.classList.toggle('open')">☰</button>
   <nav>${nav.map(n=>`<a href="${n[1]}" class="${page===n[0]?'on':''}">${t(n[2])}</a>`).join('')}</nav>
   ${langPicker()}</div>`;
  $('#ftr').innerHTML=`<div class="fgrid"><div><a class="logo" href="index.html"><i>${esc(NAME().charAt(0))}</i><span>${esc(NAME())}</span></a><p>${esc((H.sub&&H.sub[L])||t('heroS'))}</p></div>
   <div><h4>${t('links')}</h4>${nav.map(n=>`<a href="${n[1]}">${t(n[2])}</a>`).join('')}</div>
   <div><h4>${t('contact')}</h4><a dir="ltr" href="tel:${esc(c.tel)}">${esc(c.ph)}</a><span>${esc(c.ad)}</span>
    <div class="soc"><a href="${safe(c.ig)}" target="_blank" rel="noopener" aria-label="Instagram">${ic('insta')}</a><a href="${safe(c.tk)}" target="_blank" rel="noopener" aria-label="TikTok">${ic('tiktok')}</a><a href="${safe(c.mp)}" target="_blank" rel="noopener" aria-label="${t('openMap')}">${ic('pin')}</a></div></div></div>
   <div class="fcopy">© ${new Date().getFullYear()} ${esc(NAME())}. ${t('rights')}</div>`;
  const up=document.createElement('button');up.className='top';up.setAttribute('aria-label','Top');up.textContent='↑';up.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(up);
  const sc=()=>{$('#hdr').classList.toggle('sc',scrollY>10);up.classList.toggle('show',scrollY>600);};addEventListener('scroll',sc,{passive:true});sc();
}
function langGate(){
  const d=document.createElement('div');d.className='gate';
  d.innerHTML=`<div class="gbox"><h2>${esc(NAME())}</h2><p>Choose your language · Dil seçin · Выберите язык · Dilinizi seçin</p>${LANGS.map(l=>`<button onclick="setLang('${l[0]}')">${flagImg(l[0],20)}<span>${l[1]}</span></button>`).join('')}</div>`;
  document.body.appendChild(d);
}
function albumCard(a){
  const ws=DB.data.products.filter(w=>inAlbum(w,a.key)),cover=ws[0];
  const im=a.img?`<img src="${esc(imgSrc(a.img))}" alt="${esc(an(a))}" loading="lazy">`:cover?imgTag(cover):`<img src="${productImg({kind:'jar',color:'#f3b6c8'})}" alt="">`;
  return `<a class="card album" href="products.html?album=${encodeURIComponent(a.key)}">${im}<div class="ci"><span>${esc(an(a))}</span><b>${ws.length} ${t('count')}</b></div></a>`;
}
/* hero slider */
function sliderHTML(arr){
  const cp=s=>(s.cap&&(s.cap[L]||s.cap.en))||'';
  return `<div class="slider" id="sld" data-sp="${+(DB.data.settings.home||{}).speed||5}">${arr.map((s,i)=>`<div class="sl ${i?'':'on'}"><img src="${esc(imgSrc(s.img))}" alt="${esc(cp(s))}" ${i?'loading="lazy"':''}>${cp(s)?`<span class="scap">${esc(cp(s))}</span>`:''}</div>`).join('')}
  ${arr.length>1?`<button class="sar p" aria-label="Previous">‹</button><button class="sar n" aria-label="Next">›</button><div class="dots">${arr.map((_,i)=>`<button class="${i?'':'on'}" aria-label="${i+1}"></button>`).join('')}</div>`:''}</div>`;
}
function initSlider(){
  const s=$('#sld');if(!s)return;const sl=[...s.querySelectorAll('.sl')],dt=[...s.querySelectorAll('.dots button')];if(sl.length<2)return;
  let i=0,tm;const go=n=>{i=(n+sl.length)%sl.length;sl.forEach((x,k)=>x.classList.toggle('on',k===i));dt.forEach((x,k)=>x.classList.toggle('on',k===i));};
  const auto=()=>{clearInterval(tm);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)tm=setInterval(()=>go(i+1),Math.max(2,+s.dataset.sp||5)*1000);};
  const mv=d=>{go(i+d);auto();};
  $('.sar.p',s).onclick=()=>mv(-1);$('.sar.n',s).onclick=()=>mv(1);dt.forEach((d,k)=>d.onclick=()=>{go(k);auto();});
  let x0=null;s.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
  s.addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)mv(d<0?1:-1);x0=null;});
  s.addEventListener('mouseenter',()=>clearInterval(tm));s.addEventListener('mouseleave',auto);auto();
}
function lightbox(){
  document.querySelectorAll('.gal figure').forEach(f=>f.onclick=()=>{
    const d=document.createElement('div');d.className='lb';d.innerHTML=`<img src="${esc(f.querySelector('img').src)}" alt=""><button aria-label="Close">×</button>`;
    const close=()=>{d.remove();removeEventListener('keydown',k);};const k=e=>{if(e.key==='Escape')close();};
    d.onclick=close;addEventListener('keydown',k);document.body.appendChild(d);});
}
function fx(){
  if(!('IntersectionObserver' in window))return;
  const els=document.querySelectorAll('main .card,main .why>div,main .head,.gal figure,.vbox,.ic-card,.map,.pimg');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  els.forEach(e=>{e.classList.add('rv');io.observe(e);});
  setTimeout(()=>els.forEach(e=>e.classList.add('in')),2500);
}
const pages={
 index(){
  const D=DB.data,H=D.settings.home||{},on=k=>!(H.show&&H.show[k]===false);
  let f=(H.featuredIds||[]).map(id=>D.products.find(w=>w.id===id)).filter(Boolean);
  if(!f.length)f=D.products.slice().sort((a,b)=>b.price-a.price).filter((_,i)=>i%4===0).slice(0,8);
  const auto=[...new Set(D.products.map(w=>w.brand))],custom=(H.brands||'').split(',').map(x=>x.trim()).filter(Boolean),brands=custom.length?custom:auto;
  const m=((D.settings.youtube||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1];
  const vid=m?`<iframe src="https://www.youtube.com/embed/${m}" allowfullscreen title="Video" loading="lazy"></iframe>`
   :`<video controls playsinline preload="metadata"><source src="videos/store.mp4" type="video/mp4" onerror="this.closest('section').remove()"></video>`;
  const slides=(H.slides||[]).filter(s=>s.img),full=H.layout==='full'&&slides.length,
   sl=sliderHTML(slides.length?slides:[{img:H.img||heroArt()}]),gal=(H.gallery||[]).filter(g=>g.img),
   gcap=g=>(g.cap&&(g.cap[L]||g.cap.en))||'';
  $('#main').innerHTML=`<section class="hero ${full?'full':''}">${full?sl+'<div class="ov"></div>':''}<div class="hin"><div class="hcopy"><span class="eyebrow">${esc(NAME())}</span>
   <h1>${esc((H.title&&H.title[L])||t('heroT'))}</h1><p>${esc((H.sub&&H.sub[L])||t('heroS'))}</p>
   <div class="hbtns"><a class="btn" href="products.html">${t('shopNow')}</a> <a class="btn ghost" href="albums.html">${t('browse')}</a></div></div>${full?'':`<div class="hvis">${sl}</div>`}</div></section>
   ${H.showBrands===false||!brands.length?'':`<div class="strip"><b>${t('brandsT')}</b>${brands.map(b=>`<span>${esc(b)}</span>`).join('')}</div>`}
   ${on('albums')?`<section class="wrap"><div class="head"><h2>${t('albums')}</h2></div><div class="grid">${D.albums.map(albumCard).join('')}</div></section>`:''}
   ${on('video')?`<section class="vid"><div class="wrap"><div class="head"><h2>${t('videoT')}</h2></div><div class="vbox">${vid}</div></div></section>`:''}
   ${on('featured')?`<section class="wrap"><div class="head"><h2>${t('featured')}</h2></div><div class="grid">${f.map(card).join('')}</div></section>`:''}
   ${on('gallery')&&gal.length?`<section class="wrap"><div class="head"><h2>${t('galleryT')}</h2></div><div class="gal">${gal.map(g=>`<figure><img src="${esc(imgSrc(g.img))}" alt="${esc(gcap(g))}" loading="lazy">${gcap(g)?`<figcaption>${esc(gcap(g))}</figcaption>`:''}</figure>`).join('')}</div></section>`:''}
   ${on('why')?`<section class="wrap"><div class="head"><h2>${t('whyT')}</h2></div><div class="why"><div><div class="ico">${ic('sparkle')}</div><h3>${t('w1')}</h3><p>${t('w1d')}</p></div><div><div class="ico">${ic('tag')}</div><h3>${t('w2')}</h3><p>${t('w2d')}</p></div><div><div class="ico">${ic('pin')}</div><h3>${t('w3')}</h3><p>${t('w3d')}</p></div></div></section>`:''}
   ${on('cta')?`<section class="cta ${H.ctaImg?'img':''}" ${H.ctaImg?`style="--cta:url('${esc(imgSrc(H.ctaImg)).replace(/'/g,'%27')}')"`:''}><h2>${t('w3')}</h2><p>${t('w3d')}</p><a class="btn" href="contact.html">${t('contact')}</a></section>`:''}`;
  initSlider();lightbox();
 },
 albums(){$('#main').innerHTML=`<section class="wrap"><div class="head"><h1>${t('albums')}</h1></div><div class="grid">${DB.data.albums.map(albumCard).join('')}</div>
   <p style="text-align:center;margin-top:30px"><a class="btn" href="products.html">${t('allProducts')}</a></p></section>`;},
 products(){
  const D=DB.data,p=new URLSearchParams(location.search);let k=p.get('album')||'all',sort='',qs='';
  const draw=()=>{let l=D.products.filter(w=>inAlbum(w,k)&&(w.brand+' '+w.model).toLowerCase().includes(qs));
   if(sort==='lo')l.sort((a,b)=>a.price-b.price);if(sort==='hi')l.sort((a,b)=>b.price-a.price);
   $('#list').innerHTML=l.length?l.map(card).join(''):`<p>${t('none')}</p>`;$('#cnt').textContent=l.length+' '+t('count');
   $('#chips').innerHTML=[{key:'all',name:{en:t('all')}},...D.albums].map(a=>`<button class="chip ${a.key===k?'on':''}" data-k="${esc(a.key)}">${esc(an(a))}</button>`).join('');
   document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw();});};
  $('#main').innerHTML=`<section class="wrap"><div class="head"><h1>${t('allProducts')}</h1></div><div class="tools"><input id="qs" type="search" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}"><div id="chips"></div>
   <select id="sort"><option value="">${t('price')}</option><option value="lo">${t('sortLow')}</option><option value="hi">${t('sortHigh')}</option></select></div><p class="cnt" id="cnt"></p><div id="list" class="grid"></div></section>`;
  $('#sort').onchange=e=>{sort=e.target.value;draw();};$('#qs').oninput=e=>{qs=e.target.value.trim().toLowerCase();draw();};draw();
 },
 product(){
  const id=+new URLSearchParams(location.search).get('id'),w=DB.data.products.find(x=>x.id===id);
  if(!w){$('#main').innerHTML=`<section class="wrap"><p>${t('notFound')}</p><a class="btn" href="products.html">${t('back')}</a></section>`;return;}
  const row=(a,b)=>`<tr><th>${a}</th><td>${b}</td></tr>`,c=CT(),
   rel=DB.data.products.filter(x=>x.id!==w.id&&(x.tags||[]).some(g=>(w.tags||[]).includes(g))).slice(0,4);
  document.title=w.brand+' '+w.model+' · '+NAME();
  $('#main').innerHTML=`<section class="wrap"><div class="crumbs"><a href="index.html">${t('home')}</a> / <a href="products.html">${t('products')}</a> / ${esc(w.brand)} ${esc(w.model)}</div>
   <div class="detail"><div class="pimg">${imgTag(w,esc(w.brand+' '+w.model))}</div><div>
   <h1>${esc(w.brand)} ${esc(w.model)}</h1><p class="big">${priceHTML(w,1)}</p>
   <p class="stock ${w.stock>0?'ok':'no'}">${w.stock>0?`${t('inStock')}: ${esc(w.stock)} ${t('pcs')}`:t('outOfStock')}</p>
   <p>${esc(w.desc)||t('desc')}</p>
   <table>${row(t('brand'),esc(w.brand))}${row(t('category'),esc(DB.data.albums.filter(a=>(w.tags||[]).includes(a.key)).map(an).join(', ')))}${w.size?row(t('size'),esc(w.size)):''}${w.shade?row(t('shade'),esc(w.shade)):''}${w.origin?row(t('origin'),esc(w.origin)):''}${row(t('price'),priceHTML(w,1))}</table>
   ${w.stock>0?`<button class="btn" onclick="addToCart(${w.id})">${t('addToCart')}</button> `:''}<a class="btn ghost" style="color:var(--ink)" href="tel:${esc(c.tel)}">${t('callUs')}</a> <a class="btn ghost" style="color:var(--ink)" href="products.html">${t('back')}</a></div></div>
   ${rel.length?`<div class="head" style="margin-top:56px"><h2>${t('related')}</h2></div><div class="grid">${rel.map(card).join('')}</div>`:''}</section>`;
 },
 contact(){
  const c=CT();
  $('#main').innerHTML=`<section class="wrap"><div class="head"><h1>${t('contact')}</h1></div><div class="cgrid"><div class="info">
   <div class="ic-card"><div class="ico">${ic('phone')}</div><div><b>${t('phone')}</b><a dir="ltr" href="tel:${esc(c.tel)}">${esc(c.ph)}</a></div></div>
   <div class="ic-card"><div class="ico">${ic('pin')}</div><div><b>${t('address')}</b>${esc(c.ad)}<br><a href="${safe(c.mp)}" target="_blank" rel="noopener">${esc(c.mp)}</a></div></div>
   <p><a class="btn" href="${safe(c.mp)}" target="_blank" rel="noopener">${t('openMap')}</a></p>
   <h2 style="margin-top:28px">${t('follow')}</h2><p><a class="btn" href="${safe(c.ig)}" target="_blank" rel="noopener">Instagram</a>
   <a class="btn ghost" style="color:var(--ink)" href="${safe(c.tk)}" target="_blank" rel="noopener">TikTok</a></p></div>
   <iframe class="map" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(c.q)}&z=17&output=embed"></iframe></div></section>`;
 }
};
(async()=>{
  const page=document.body.dataset.page;
  await DB.load(); applyTheme(); chrome(page); fab();
  if(!L){langGate();return;}
  (pages[page]||EXTRA_PAGES[page]||(()=>{}))();fx();
})();
