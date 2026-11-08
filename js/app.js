const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L='az'; /* the website is Azerbaijani only */
const t=k=>{const o=((DB.data&&DB.data.settings.texts)||{})[L];return (o&&o[k])||(T[L]||T.en)[k]||T.en[k]||k;};
const NAME=()=>(DB.data&&DB.data.settings.name)||'topdansaatalışqan.az';
function applyTheme(){const th=DB.data.settings.theme;if(!th)return;for(const k in th)if(th[k])document.documentElement.style.setProperty('--'+k,th[k]);}
const an=a=>a.name.az||a.name.en;
document.addEventListener('click',e=>{if(!e.target.closest('.lp'))document.querySelectorAll('.lp.open').forEach(x=>x.classList.remove('open'));});
const IC={sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
 tag:'<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',pin:'<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
 insta:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',tiktok:'<path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5"/><path d="M14 3c.3 2.6 2 4.4 5 4.6"/>',
 wa:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.1-1z"/><path d="M9 9c0 3.2 2.8 6 6 6l1.2-1.6-2-1-.9.8c-.9-.4-1.8-1.3-2.2-2.2l.8-.9-1-2z"/>',
 yt:'<rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const safe=u=>/^https?:\/\//.test(u)?esc(u):'#';
const waLink=v=>{v=String(v||'').trim();if(!v)return '';if(/^https?:\/\//.test(v))return v;const d=v.replace(/\D/g,'');return d?'https://wa.me/'+d:'';};
const DS=()=>(DB.data&&DB.data.settings&&DB.data.settings.design)||{};
const LOGO=()=>DS().logo?imgSrc(DS().logo):ROOT+'images/logo.png';
const ytId=u=>((String(u||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1]);
/* social buttons: icons without a link are shown dimmed and lead to the Contact page */
function socials(){const c=CT();
  const L=[['insta',c.ig,'Instagram'],['tiktok',c.tk,'TikTok'],['wa',waLink(c.wa),'WhatsApp']];if(c.yt)L.push(['yt',c.yt,'YouTube']);
  return L.map(x=>x[1]?`<a href="${safe(x[1])}" target="_blank" rel="noopener" aria-label="${x[2]}">${ic(x[0])}</a>`:`<a class="off" href="contact.html" aria-label="${x[2]}">${ic(x[0])}</a>`).join('')
   +(c.mp?`<a href="${safe(c.mp)}" target="_blank" rel="noopener" aria-label="Google Maps" title="Google Maps">${ic('pin')}</a>`:`<a class="off" href="contact.html" aria-label="Google Maps">${ic('pin')}</a>`);}
const CT=()=>{const C=DB.data.settings.contact||{},ph=C.phone||'';
 return {ph,tel:ph.replace(/[^\d+]/g,''),ad:C.address||'',mp:C.maps||'',
  ig:C.instagram||'',tk:C.tiktok||'',wa:C.whatsapp||'',yt:C.youtube||'',q:C.map||''};};
const card=w=>`<a class="card" href="product.html?id=${w.id}">${imgTag(w,esc(w.brand+' '+w.model))}<div class="ci"><span>${esc(w.brand)} ${esc(w.model)}</span>${priceHTML(w)}</div><button class="add" onclick="addToCart(${w.id},event)">${t('addToCart')}</button></a>`;
const inAlbum=(w,k)=>k==='all'||(w.tags||[]).includes(k);

/* header: hide the centered text if there is no room for it (never overlaps logo or buttons) */
function fitHexp(){const e=document.querySelector('.hexp');if(!e)return;e.style.display='';
  const a=e.getBoundingClientRect();if(!a.width)return;
  const bad=x=>{if(!x)return false;const r=x.getBoundingClientRect();return a.left<r.right+14&&a.right>r.left-14;};
  if(bad(document.querySelector('.bar .logo'))||bad(document.querySelector('.bar .hact')))e.style.display='none';}
function chrome(page){
  document.title=NAME()+(WS?' · '+t('wsTag'):'');
  document.documentElement.lang='az'; document.documentElement.dir='ltr';
  const H=DB.data.settings.home||{},c=CT();
  const nav=[['index','index.html','home'],[WS?'products':'wslink',WS?'products.html':'topdan/index.html','navProducts',WS?'':'onclick="return wsOpen(event)"'],['albums','albums.html','navAlbums'],['contact','contact.html','contact'],['account','account.html','account']];
  if(WS)nav.push(['main','../index.html','mainSite']);
  const who=localStorage.getItem('tk_phone')?(localStorage.getItem('tk_name')||'').split(' ')[0]:'';
  const auth=who?`<a class="pill so" href="account.html">${ic('user')}<span>${esc(who)}</span></a>`
   :`<a class="pill gh" href="account.html">${t('login')}</a><a class="pill so" href="account.html?signup=1">${t('signup')}</a>`;
  $('#hdr').innerHTML=`<div class="bar"><a class="logo" href="index.html"><img src="${esc(LOGO())}" alt=""><span>${esc(NAME())}</span></a>
   <span class="hexp">${t('exp17')}</span>
   <div class="hact">${WS?`<span class="wtag">${esc(t('wsOrderTag'))}</span>`:''}${page==='index'?'':`<span class="hauth">${auth}</span>`}<button class="menub" type="button" aria-label="${esc(t('menu'))}" aria-expanded="false"><span>${t('menu')}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button></div></div>`;
  fitHexp();addEventListener('resize',fitHexp);addEventListener('load',fitHexp);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitHexp);
  const pn=document.createElement('div');pn.innerHTML=`<div class="mback"></div><aside class="mpanel" aria-label="${esc(t('menu'))}"><div class="mtop"><b>${esc(NAME())}</b><button class="mclose" type="button" aria-label="${esc(t('close'))}">×</button></div>
   <nav>${nav.map(n=>`<a href="${n[1]}" class="${page===n[0]?'on':''}"${n[3]?' '+n[3]:''}>${t(n[2])}</a>`).join('')}</nav>
   <div class="mauth">${who?`<a class="pill so" href="account.html">${t('account')}</a>`:`<a class="pill gh" href="account.html">${t('login')}</a><a class="pill so" href="account.html?signup=1">${t('signup')}</a>`}</div>
   <div class="soc">${socials()}</div></aside>`;
  while(pn.firstChild)document.body.appendChild(pn.firstChild);
  const mo=o=>{document.body.classList.toggle('mopen',o);const b=$('.menub');if(b)b.setAttribute('aria-expanded',o?'true':'false');};
  $('.menub').onclick=()=>mo(!document.body.classList.contains('mopen'));$('.mclose').onclick=()=>mo(false);$('.mback').onclick=()=>mo(false);
  document.querySelectorAll('.mpanel nav a,.mpanel .mauth a').forEach(a=>a.addEventListener('click',()=>mo(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')mo(false);});
  $('#ftr').innerHTML=`<div class="fgrid"><div><a class="logo" href="index.html"><img src="${esc(LOGO())}" alt=""><span>${esc(NAME())}</span></a></div>
   <div><h4>${t('links')}</h4>${nav.map(n=>`<a href="${n[1]}"${n[3]?' '+n[3]:''}>${t(n[2])}</a>`).join('')}</div>
   <div><h4>${t('contact')}</h4>${c.ph?`<a dir="ltr" href="tel:${esc(c.tel)}">${esc(c.ph)}</a>`:''}<span>${esc(c.ad)}</span>
    <div class="soc">${socials()}</div></div></div>
   <div class="fcopy">© ${new Date().getFullYear()} ${esc(NAME())}. ${t('rights')}</div>`;
  const up=document.createElement('button');up.className='top';up.setAttribute('aria-label','Yuxarı');up.textContent='↑';up.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(up);
  let ly=scrollY;
  const sc=()=>{const h=$('#hdr'),y=scrollY;h.classList.toggle('sc',y>10);up.classList.toggle('show',y>600);
   /* scroll down -> header hides; scroll up (or at the top) -> it comes back */
   if(!document.body.classList.contains('mopen')){if(y<=80||y<ly-6)h.classList.remove('hide');else if(y>ly+6)h.classList.add('hide');}
   if(Math.abs(y-ly)>6)ly=y;};addEventListener('scroll',sc,{passive:true});sc();
}
function albumCard(a){
  const X=DB.ix();let cnt,cover;
  if(X){cnt=X.n[a.key]||0;cover=X.cov[a.key];if(cover&&WS)cover.ws=1;}else{const ws=PRODS().filter(w=>inAlbum(w,a.key));cnt=ws.length;cover=ws[0];}
  const im=a.img?`<img src="${esc(imgSrc(a.img))}" alt="${esc(an(a))}" loading="lazy">`:cover?imgTag(cover):`<img src="${productImg({kind:'watch',color:WS?'#fca5a5':'#c4b5fd'})}" alt="">`;
  return `<a class="card album" href="products.html?album=${encodeURIComponent(a.key)}">${im}<div class="ci"><span>${esc(an(a))}</span><b>${cnt} ${t('count')}</b></div></a>`;
}
/* ===== BIG ALBUMS (böyük albomlar): glass frames, each holding small albums (3 per row) ===== */
const BIGS=()=>((WS?(DB.data.wholesale||{}).bigAlbums:DB.data.bigAlbums)||[]);
const bigItems=b=>(b.items||[]).map(k=>ALBS().find(a=>a.key===k)).filter(Boolean);
/* hero buttons: the first two big albums (falls back to the old button when there are none) */
function bigBtns(fb){const B=BIGS().slice(0,2);if(!B.length)return fb;return B.map(b=>`<a class="btn ghost" href="albums.html?big=${encodeURIComponent(b.key)}">${esc(an(b))}</a>`).join(' ');}
function bigFrame(title,list,href){
  return `<div class="bframe"><div class="head"><h2>${href?`<a href="${href}">${esc(title)}</a>`:esc(title)}</h2></div><div class="bgrid3">${list.map(albumCard).join('')}</div></div>`;
}
function albumsInner(h){
  const B=BIGS().filter(b=>bigItems(b).length);
  if(!B.length)return `<div class="head"><${h}>${t('albums')}</${h}></div><div class="grid">${ALBS().map(albumCard).join('')}</div>`;
  const used=new Set();BIGS().forEach(b=>(b.items||[]).forEach(k=>used.add(k)));
  const rest=ALBS().filter(a=>!used.has(a.key));
  return `<div class="bframes">${B.map(b=>bigFrame(an(b),bigItems(b),'albums.html?big='+encodeURIComponent(b.key))).join('')}${rest.length?bigFrame(t('albums'),rest):''}</div>`;
}
/* hero slider */
function sliderHTML(arr){
  const cp=s=>(s.cap&&(s.cap[L]||s.cap.en))||'';
  return `<div class="slider" id="sld" data-sp="${+(DB.data.settings.home||{}).speed||5}">${arr.map((s,i)=>`<div class="sl ${i?'':'on'}"><img src="${esc(imgSrc(s.img))}" alt="${esc(cp(s))}" ${i?'loading="lazy"':''}>${cp(s)?`<span class="scap">${esc(cp(s))}</span>`:''}</div>`).join('')}
  ${arr.length>1?`<button class="sar p" aria-label="Əvvəlki">‹</button><button class="sar n" aria-label="Növbəti">›</button><div class="dots">${arr.map((_,i)=>`<button class="${i?'':'on'}" aria-label="${i+1}"></button>`).join('')}</div>`:''}</div>`;
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
    const d=document.createElement('div');d.className='lb';d.innerHTML=`<img src="${esc(f.querySelector('img').src)}" alt=""><button aria-label="Bağla">×</button>`;
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
/* ---------- TOPDAN password gate (soft gate in the browser: keeps casual visitors out, it is not real security) ---------- */
const wsKey=()=>((DB.data&&DB.data.settings&&DB.data.settings.wholesaleKey)||WS_DEF);
const wsOK=()=>{try{return sessionStorage.getItem('tk_wok')===wsKey();}catch(e){return false;}};
function wsAsk(ok,full){
  const d=document.createElement('div');d.className='wgate'+(full?' full':'');
  d.innerHTML=`<form class="wbox" autocomplete="off"><div class="wlogo"><img src="${esc(LOGO())}" alt=""></div><h2>${t('wsGateT')}</h2><p>${t('wsGateD')}</p>
   <input type="password" id="wpw" placeholder="${esc(t('wsPass'))}" aria-label="${esc(t('wsPass'))}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" required>
   <p class="err" id="wer" role="alert"></p><button class="btn" type="submit">${t('wsEnter')}</button>
   ${full?`<a class="wback" href="../index.html">${t('wsBack')}</a>`:`<button class="wback" type="button">${t('cancel')}</button>`}</form>`;
  document.body.appendChild(d);const inp=d.querySelector('#wpw');setTimeout(()=>inp.focus(),60);
  d.querySelector('form').onsubmit=e=>{e.preventDefault();
   if(tkHash(inp.value.trim())===wsKey()){try{sessionStorage.setItem('tk_wok',wsKey());}catch(x){}d.remove();ok();}
   else{d.querySelector('#wer').textContent=t('wsBad');inp.value='';inp.focus();}};
  if(!full){const x=()=>d.remove();d.querySelector('.wback').onclick=x;d.addEventListener('click',e=>{if(e.target===d)x();});addEventListener('keydown',function k(e){if(e.key==='Escape'){x();removeEventListener('keydown',k);}});}
}
function wsOpen(e){if(e)e.preventDefault();const go=()=>{location.href='topdan/index.html';};if(wsOK())go();else wsAsk(go);return false;}
const pages={
 windex(){
  const D=DB.data,H=D.wholesale.home||{},Z=DS(),P=PRODS(),A=ALBS(),on=Z.heroMode!=='classic';
  const X=DB.ix();let f=X?X.feat:(H.featuredIds||[]).map(id=>P.find(w=>w.id===id)).filter(Boolean);if(!X&&!f.length)f=P.slice().reverse().slice(0,8);
  const brands=X?X.brands:[...new Set(P.map(w=>w.brand))],yb=ytId(Z.bgYoutube),ov=Math.min(90,Math.max(0,Z.overlay==null||Z.overlay===''?45:+Z.overlay)),
   media=yb?`<iframe src="https://www.youtube.com/embed/${yb}?autoplay=1&mute=1&loop=1&playlist=${yb}&controls=0&modestbranding=1&playsinline=1&rel=0" title="" allow="autoplay;encrypted-media" tabindex="-1"></iframe>`
    :`<video autoplay muted loop playsinline preload="auto" poster="${esc(imgSrc(Z.poster||'images/hero-poster-2.jpg'))}"><source src="${esc(imgSrc(Z.video||'videos/hero.mp4'))}" onerror="this.closest('.hero').classList.add('novid')"></video>`;
  $('#main').innerHTML=`<section class="hero vh"><div class="vbg">${media}</div><div class="vov" style="--ov:${ov/100}"></div><div class="vglow"></div>
   <div class="hin2"><h1>${esc(H.title||t('wsHeroT'))}</h1><p>${esc(H.sub||t('wsHeroS'))}</p>
   <div class="hbtns"><a class="btn" href="products.html">${t('wsShop')}</a></div></div>
   <div class="hfoot"><div class="soc">${socials()}</div><a class="hcontact" href="contact.html">${t('contact')}</a></div>
   <a class="scrolld" href="#after" aria-label="${esc(t('scrollDown'))}"><span>${t('scrollDown')}</span><i></i></a></section><span id="after"></span>
   ${brands.length?`<div class="strip"><b>${t('brandsT')}</b>${brands.map(b=>`<span>${esc(b)}</span>`).join('')}</div>`:''}
   ${A.length?`<section class="wrap">${albumsInner('h2')}</section>`:''}
   <section class="wrap"><div class="head"><h2>${t('whyT')} · ${esc(NAME())}</h2></div><div class="why"><div><div class="ico">${ic('sparkle')}</div><h3>${t('w1')}</h3><p>${t('w1d')}</p></div><div><div class="ico">${ic('tag')}</div><h3>${t('w2')}</h3><p>${t('w2d')}</p></div><div><div class="ico">${ic('pin')}</div><h3>${t('w3')}</h3><p>${t('w3d')}</p></div></div></section>
   <section class="cta"><h2>${t('w3')}</h2><p>${t('w3d')}</p><a class="btn" href="contact.html">${t('contact')}</a></section>`;
  const vv=$('.hero.vh video');if(vv){vv.muted=true;const p=vv.play();if(p&&p.catch)p.catch(()=>{});}
 },
 index(){
  if(WS)return pages.windex();
  const D=DB.data,H=D.settings.home||{},on=k=>!(H.show&&H.show[k]===false);
  const X=DB.ix();let f=X?X.feat:(H.featuredIds||[]).map(id=>PRODS().find(w=>w.id===id)).filter(Boolean);
  if(!X&&!f.length)f=PRODS().slice().sort((a,b)=>b.price-a.price).filter((_,i)=>i%4===0).slice(0,8);
  const auto=X?X.brands:[...new Set(PRODS().map(w=>w.brand))],custom=(H.brands||'').split(',').map(x=>x.trim()).filter(Boolean),brands=custom.length?custom:auto;
  const m=ytId(D.settings.youtube),v2=(D.settings.design||{}).video2||'';
  const vid=m?`<iframe src="https://www.youtube.com/embed/${m}" allowfullscreen title="Video" loading="lazy"></iframe>`
   :v2?`<video controls playsinline preload="metadata"><source src="${esc(imgSrc(v2))}" onerror="this.closest('section').remove()"></video>`:'';
  const slides=(H.slides||[]).filter(s=>s.img),Z=DS(),classic=Z.heroMode==='classic',full=classic&&H.layout==='full'&&slides.length,
   sl=sliderHTML(slides.length?slides:[{img:H.img||heroArt()}]),gal=(H.gallery||[]).filter(g=>g.img),
   gcap=g=>(g.cap&&(g.cap[L]||g.cap.en))||'',
   ttl=esc((H.title&&H.title[L])||t('heroT')),sub=esc((H.sub&&H.sub[L])||t('heroS')),yb=ytId(Z.bgYoutube),
   ov=Math.min(90,Math.max(0,Z.overlay==null||Z.overlay===''?45:+Z.overlay)),
   media=yb?`<iframe src="https://www.youtube.com/embed/${yb}?autoplay=1&mute=1&loop=1&playlist=${yb}&controls=0&modestbranding=1&playsinline=1&rel=0" title="" allow="autoplay;encrypted-media" tabindex="-1"></iframe>`
    :`<video autoplay muted loop playsinline preload="auto" poster="${esc(imgSrc(Z.poster||'images/hero-poster-2.jpg'))}"><source src="${esc(imgSrc(Z.video||'videos/hero.mp4'))}" onerror="this.closest('.hero').classList.add('novid')"></video>`;
  const heroHTML=classic?`<section class="hero ${full?'full':''}">${full?sl+'<div class="ov"></div>':''}<div class="hin"><div class="hcopy">
   <h1>${ttl}</h1><p>${sub}</p>
   <div class="hbtns"><a class="btn" href="topdan/index.html" onclick="return wsOpen(event)">${t('wsBtn')}</a> ${bigBtns(`<a class="btn ghost" href="albums.html">${t('browse')}</a>`)}</div></div>${full?'':`<div class="hvis">${sl}</div>`}</div></section>`
   :`<section class="hero vh"><div class="vbg">${media}</div><div class="vov" style="--ov:${ov/100}"></div><div class="vglow"></div>
   <div class="hin2"><h1>${ttl}</h1><p>${sub}</p>
   <div class="hbtns"><a class="btn" href="topdan/index.html" onclick="return wsOpen(event)">${t('wsBtn')}</a> ${bigBtns(`<a class="btn ghost" href="albums.html">${t('browse')}</a>`)}</div></div>
   <div class="hfoot"><div class="soc">${socials()}</div><a class="hcontact" href="contact.html">${t('contact')}</a></div>
   <a class="scrolld" href="#after" aria-label="${esc(t('scrollDown'))}"><span>${t('scrollDown')}</span><i></i></a></section>
   ${slides.length?`<section class="wrap sliderwrap">${sl}</section>`:''}<span id="after"></span>`;
  $('#main').innerHTML=heroHTML+`
   ${H.showBrands===false||!brands.length?'':`<div class="strip"><b>${t('brandsT')}</b>${brands.map(b=>`<span>${esc(b)}</span>`).join('')}</div>`}
   ${on('albums')?`<section class="wrap">${albumsInner('h2')}</section>`:''}
   ${on('video')&&vid?`<section class="vid"><div class="wrap"><div class="head"><h2>${t('videoT')}</h2></div><div class="vbox">${vid}</div></div></section>`:''}
   ${on('gallery')&&gal.length?`<section class="wrap"><div class="head"><h2>${t('galleryT')}</h2></div><div class="gal">${gal.map(g=>`<figure><img src="${esc(imgSrc(g.img))}" alt="${esc(gcap(g))}" loading="lazy">${gcap(g)?`<figcaption>${esc(gcap(g))}</figcaption>`:''}</figure>`).join('')}</div></section>`:''}
   ${on('why')?`<section class="wrap"><div class="head"><h2>${t('whyT')} · ${esc(NAME())}</h2></div><div class="why"><div><div class="ico">${ic('sparkle')}</div><h3>${t('w1')}</h3><p>${t('w1d')}</p></div><div><div class="ico">${ic('tag')}</div><h3>${t('w2')}</h3><p>${t('w2d')}</p></div><div><div class="ico">${ic('pin')}</div><h3>${t('w3')}</h3><p>${t('w3d')}</p></div></div></section>`:''}
   ${on('cta')?`<section class="cta ${H.ctaImg?'img':''}" ${H.ctaImg?`style="--cta:url('${esc(imgSrc(H.ctaImg)).replace(/'/g,'%27')}')"`:''}><h2>${t('w3')}</h2><p>${t('w3d')}</p><a class="btn" href="contact.html">${t('contact')}</a></section>`:''}`;
  initSlider();lightbox();
  const vv=$('.hero.vh video');if(vv){vv.muted=true;const p=vv.play();if(p&&p.catch)p.catch(()=>{});}
 },
 albums(){
  const bk=new URLSearchParams(location.search).get('big'),bg=bk&&BIGS().find(x=>x.key===bk);
  if(bg){document.title=an(bg)+' · '+NAME();
   $('#main').innerHTML=`<section class="wrap"><p class="bback"><a href="albums.html">← ${t('albums')}</a></p><div class="head"><h1>${esc(an(bg))}</h1></div>${bigItems(bg).length?`<div class="grid">${bigItems(bg).map(albumCard).join('')}</div>`:`<p style="text-align:center">${t('none')}</p>`}</section>`;return;}
  $('#main').innerHTML=`<section class="wrap">${albumsInner('h1')}
   <p style="text-align:center;margin-top:30px"><a class="btn" href="products.html">${t('allProducts')}</a></p></section>`;},
 products(){
  const D=DB.data,p=new URLSearchParams(location.search);let k=p.get('album')||'all',sort='',qs='';
  const draw=()=>{let l=PRODS().filter(w=>inAlbum(w,k)&&(w.brand+' '+w.model).toLowerCase().includes(qs));
   if(sort==='lo')l.sort((a,b)=>a.price-b.price);if(sort==='hi')l.sort((a,b)=>b.price-a.price);
   $('#list').innerHTML=l.length?l.map(card).join(''):`<p>${t('none')}</p>`;$('#cnt').textContent=l.length+' '+t('count');
   $('#chips').innerHTML=[{key:'all',name:{az:t('all')}},...ALBS()].map(a=>`<button class="chip ${a.key===k?'on':''}" data-k="${esc(a.key)}">${esc(an(a))}</button>`).join('');
   document.querySelectorAll('.chip').forEach(b=>b.onclick=async()=>{k=b.dataset.k;await DB.need(k==='all'?{all:true}:{albums:[k]});draw();});};
  $('#main').innerHTML=`<section class="wrap"><div class="head"><h1>${t(WS?'wsProducts':'allProducts')}</h1></div><div class="tools"><input id="qs" type="search" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}"><div id="chips"></div>
   <select id="sort"><option value="">${t('price')}</option><option value="lo">${t('sortLow')}</option><option value="hi">${t('sortHigh')}</option></select></div><p class="cnt" id="cnt"></p><div id="list" class="grid"></div></section>`;
  $('#sort').onchange=e=>{sort=e.target.value;draw();};$('#qs').oninput=e=>{qs=e.target.value.trim().toLowerCase();draw();};draw();
 },
 product(){
  const id=+new URLSearchParams(location.search).get('id'),w=PRODS().find(x=>x.id===id);
  if(!w){$('#main').innerHTML=`<section class="wrap"><p>${t('notFound')}</p><a class="btn" href="products.html">${t('back')}</a></section>`;return;}
  const row=(a,b)=>`<tr><th>${a}</th><td>${b}</td></tr>`,c=CT(),Z=DS(),
   bg=imgSrc(Z.productBg||'images/product-bg.png').replace(/'/g,'%27'),dim=Math.min(85,Math.max(0,Z.pbOverlay==null||Z.pbOverlay===''?25:+Z.pbOverlay))/100,
   rel=PRODS().filter(x=>x.id!==w.id&&(x.tags||[]).some(g=>(w.tags||[]).includes(g))).slice(0,4);
  document.title=w.brand+' '+w.model+' · '+NAME();
  const _bi=new Image();_bi.onload=()=>{const st=$('.pstage');if(st&&_bi.naturalWidth)st.style.setProperty('--par',_bi.naturalWidth+'/'+_bi.naturalHeight);};_bi.src=imgSrc(Z.productBg||'images/product-bg.png');
  $('#main').innerHTML=`<section class="pstage" style="--pbg:url('${bg}');--pdim:${dim}"><div class="pst-in"><div class="crumbs"><a href="index.html">${t('home')}</a> / <a href="products.html">${t('products')}</a> / ${esc(w.brand)} ${esc(w.model)}</div>
   <div class="pimg"><img src="${esc(photo(w))}" alt="${esc(w.brand+' '+w.model)}" onerror="this.onerror=null;this.src=this.dataset.f;this.classList.add('bare')" data-f="${productImg({...w,img:'',bare:1})}"></div>
   <div class="ptitle"><h1>${esc(w.brand)} ${esc(w.model)}</h1><p class="big">${priceHTML(w,1)}</p>
   ${w.mech?`<p class="mech">${t('mech')}: <b>${esc(w.mech)}</b></p>`:''}</div></div>
   <a class="scrolld" href="#pdet" aria-label="${esc(t('details'))}"><span>${t('details')}</span><i></i></a></section>
   <section class="wrap" id="pdet"><div class="pdet"><div class="head"><h2>${t('details')}</h2></div><p class="pdesc">${esc(w.desc)||t('desc')}</p>
   <table>${row(t('brand'),esc(w.brand))}${row(t('category'),esc(ALBS().filter(a=>(w.tags||[]).includes(a.key)).map(an).join(', ')))}${w.size?row(t('size'),esc(w.size)):''}${w.shade?row(t('shade'),esc(w.shade)):''}${w.origin?row(t('origin'),esc(w.origin)):''}${w.mech?row(t('mech'),esc(w.mech)):''}${row(t(WS?'wsPrice':'price'),priceHTML(w,1))}</table>
   <div class="pbtns"><button class="btn" onclick="addToCart(${w.id})">${t('addToCart')}</button> ${c.ph?`<a class="btn ghost" href="tel:${esc(c.tel)}">${t('callUs')}</a> `:''}<a class="btn ghost" href="products.html">${t('back')}</a></div></div>
   ${rel.length?`<div class="head" style="margin-top:56px"><h2>${t('related')}</h2></div><div class="grid">${rel.map(card).join('')}</div>`:''}</section>`;
 },
 contact(){
  const c=CT();
  $('#main').innerHTML=`<section class="wrap"><div class="head"><h1>${t('contact')}</h1></div><div class="cgrid"><div class="info">
   ${c.ph?`<div class="ic-card"><div class="ico">${ic('phone')}</div><div><b>${t('phone')}</b><a dir="ltr" href="tel:${esc(c.tel)}">${esc(c.ph)}</a></div></div>`:''}
   ${c.ad||c.mp?`<div class="ic-card"><div class="ico">${ic('pin')}</div><div><b>${t('address')}</b>${esc(c.ad)}${c.mp?`<br><a href="${safe(c.mp)}" target="_blank" rel="noopener">${esc(c.mp)}</a>`:''}</div></div>`:''}
   ${c.mp?`<p><a class="btn" href="${safe(c.mp)}" target="_blank" rel="noopener">${t('openMap')}</a></p>`:''}
   ${c.ig||c.tk||c.wa||c.yt?`<h2 style="margin-top:28px">${t('follow')}</h2><p>${c.ig?`<a class="btn" href="${safe(c.ig)}" target="_blank" rel="noopener">Instagram</a> `:''}${c.tk?`<a class="btn ghost" href="${safe(c.tk)}" target="_blank" rel="noopener">TikTok</a> `:''}${c.wa?`<a class="btn ghost" href="${safe(waLink(c.wa))}" target="_blank" rel="noopener">WhatsApp</a> `:''}${c.yt?`<a class="btn ghost" href="${safe(c.yt)}" target="_blank" rel="noopener">YouTube</a>`:''}</p>`:''}</div>
   ${c.q?`<iframe class="map" title="Xəritə" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(c.q)}&z=17&output=embed"></iframe>`:''}</div></div></section>`;
 }
};
(async()=>{
  const page=document.body.dataset.page;
  await DB.load(); if(!WS)applyTheme();
  /* load only the products this page needs (the album that is opened / the product / the basket) */
  if(DB._split){try{const q=new URLSearchParams(location.search),ids=[...CART.items().map(c=>c.id),...CART.saved()];
    if(page==='products'){const k=q.get('album')||'all';await DB.need(k==='all'?{all:true}:{albums:[k],ids});}
    else if(page==='product')await DB.need({ids:[+q.get('id')].concat(ids)});
    else if(page==='account')await DB.need({all:true});
    else await DB.need({ids});}catch(e){}}
  const boot=()=>{chrome(page); fab(); if(window.tkWaBanner)tkWaBanner();
   (pages[page]||EXTRA_PAGES[page]||(()=>{}))();fx();};
  if(WS&&!wsOK())wsAsk(boot,true); else boot();
  /* if the cached copy is older than 10 min, check Firebase quietly; reload only if the shop data changed */
  if(DB._stale&&DB.cloud())DB.refresh().then(ch=>{if(ch)location.reload();});
})();
