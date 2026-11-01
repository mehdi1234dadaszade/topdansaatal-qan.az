/* Data + storage. Order of loading: browser storage (admin edits) -> store.json -> built-in seed */
const ROOT = new URL('../', document.currentScript.src).href;
const LANGS=[['en','English'],['az','Azərbaycan dili'],['ru','Русский'],['tr','Türkçe']];
const SEED_ALBUMS = [
  {key:'makeup',name:{en:'Makeup',az:'Makiyaj',ru:'Макияж',tr:'Makyaj'}},
  {key:'skincare',name:{en:'Skincare',az:'Dəri qulluğu',ru:'Уход за кожей',tr:'Cilt bakımı'}},
  {key:'perfume',name:{en:'Perfume',az:'Ətir',ru:'Парфюмерия',tr:'Parfüm'}},
  {key:'hair',name:{en:'Hair care',az:'Saç qulluğu',ru:'Уход за волосами',tr:'Saç bakımı'}},
  {key:'luxury',name:{en:'Luxury',az:'Lüks',ru:'Люкс',tr:'Lüks'}},
  {key:'budget',name:{en:'Budget',az:'Büdcəyə uyğun',ru:'Бюджетные',tr:'Uygun fiyatlı'}}
];
// [brand, name, shape, color, album, price in AZN] - sample data, change it in the admin panel
const SEED = [
 ['Maybelline','Lipstick Rouge','lipstick','#c2185b','makeup',18],['L\'Oréal Paris','Lipstick Nude','lipstick','#c68a76','makeup',22],
 ['Revlon','Lipstick Red','lipstick','#b0121f','makeup',25],['Essence','Lipstick Coral','lipstick','#ee6b5a','makeup',9],
 ['Maybelline','Mascara','tube','#1c1c1c','makeup',16],['L\'Oréal Paris','Foundation','bottle','#e0b48f','makeup',35],
 ['Catrice','Eyeshadow Palette','palette','#b5838d','makeup',24],['Essence','Blush','jar','#f08a9b','makeup',8],
 ['Revlon','Eyeliner','tube','#2a2a2a','makeup',14],['Essence','Nail Polish','nail','#d6336c','makeup',6],
 ['Catrice','Face Powder','jar','#e8cdb5','makeup',17],
 ['NIVEA','Face Cream','jar','#7fb7e6','skincare',12],['Garnier','Vitamin C Serum','bottle','#f5a623','skincare',28],
 ['Garnier','Micellar Water','bottle','#9fd3e8','skincare',13],['CeraVe','Foaming Cleanser','tube','#4a90c2','skincare',38],
 ['La Roche-Posay','Sunscreen SPF 50','tube','#f2c14e','skincare',52],['NIVEA','Lip Balm','tube','#e57399','skincare',5],
 ['Dove','Hand Cream','tube','#a8d5ba','skincare',7],['Yves Rocher','Face Mask','jar','#8bc6a1','skincare',19],
 ['Eucerin','Moisturizer','jar','#cfe3f0','skincare',46],
 ['Zara','Women Perfume','perfume','#e58aa3','perfume',45],['Lancôme','Eau de Parfum','perfume','#d4a5c4','perfume',140],
 ['Hugo Boss','Men Perfume','perfume','#2c5d87','perfume',95],['Calvin Klein','Eau de Toilette','perfume','#9aa5b1','perfume',85],
 ['Yves Rocher','Body Mist','bottle','#f4a6c0','perfume',20],
 ['Pantene','Shampoo','bottle','#f2b134','hair',11],['Pantene','Conditioner','bottle','#e8a0bf','hair',11],
 ['Garnier','Hair Oil','bottle','#c98b3c','hair',15],['L\'Oréal Paris','Hair Mask','jar','#b86a8f','hair',24],
 ['Schwarzkopf','Hair Color','tube','#5a3a2e','hair',13]
];
function makeProducts(){
  return SEED.map((s,i)=>{
    const tags=[s[4]]; if(s[5]>=45)tags.push('luxury'); if(s[5]<=12)tags.push('budget');
    return {id:i+1,brand:s[0],model:s[1],kind:s[2],color:s[3],price:s[5],stock:100,tags,img:'',desc:'',size:'',shade:'',origin:''};
  });
}
function shape(k,c){
  const g='<rect x="0" y="0" width="0" height="0"/>';
  return {
   lipstick:`<rect x="78" y="112" width="44" height="60" rx="6" fill="#2b2326"/><rect x="82" y="102" width="36" height="12" fill="#d9b45a"/><path d="M85 102V76l30-14v40z" fill="${c}"/><path d="M85 76l30-14v8l-30 14z" fill="#fff" opacity=".25"/>`,
   tube:`<rect x="82" y="44" width="36" height="112" rx="10" fill="${c}"/><rect x="86" y="24" width="28" height="24" rx="5" fill="#2b2326"/><rect x="82" y="132" width="36" height="24" rx="8" fill="#fff" opacity=".22"/>`,
   bottle:`<rect x="66" y="82" width="68" height="90" rx="14" fill="${c}"/><rect x="66" y="82" width="22" height="90" rx="12" fill="#fff" opacity=".25"/><rect x="92" y="62" width="16" height="22" fill="#e6dede"/><rect x="84" y="46" width="32" height="18" rx="4" fill="#2b2326"/><rect x="112" y="50" width="22" height="7" rx="3" fill="#2b2326"/>`,
   jar:`<rect x="54" y="100" width="92" height="58" rx="12" fill="${c}"/><rect x="54" y="100" width="30" height="58" rx="12" fill="#fff" opacity=".25"/><rect x="50" y="74" width="100" height="30" rx="9" fill="#d9b45a"/><rect x="50" y="74" width="100" height="9" rx="4" fill="#fff" opacity=".35"/>`,
   perfume:`<rect x="58" y="88" width="84" height="82" rx="16" fill="${c}"/><rect x="68" y="98" width="64" height="62" rx="10" fill="#fff" opacity=".28"/><rect x="92" y="78" width="16" height="12" fill="#d9b45a"/><rect x="82" y="48" width="36" height="32" rx="6" fill="#d9b45a"/><rect x="82" y="48" width="12" height="32" rx="5" fill="#fff" opacity=".35"/>`,
   palette:`<rect x="34" y="58" width="132" height="90" rx="12" fill="#2b2326"/><rect x="34" y="58" width="132" height="22" rx="10" fill="#3d3236"/>`+[0,1,2,3,4,5].map(i=>`<circle cx="${58+(i%3)*42}" cy="${100+Math.floor(i/3)*30}" r="14" fill="${c}" opacity="${1-i*.13}"/>`).join(''),
   nail:`<rect x="72" y="100" width="56" height="64" rx="12" fill="${c}"/><rect x="72" y="100" width="18" height="64" rx="10" fill="#fff" opacity=".28"/><rect x="88" y="52" width="24" height="52" rx="6" fill="#2b2326"/>`
  }[k]||g;
}
function productImg(w){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe9ee"/><stop offset="1" stop-color="#f3d3dd"/></linearGradient></defs><rect width="200" height="200" fill="url(#b)"/><ellipse cx="100" cy="176" rx="52" ry="7" fill="#000" opacity=".12"/>${shape(w.kind,w.color||'#c2476b')}</svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function heroArt(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><circle cx="200" cy="200" r="190" fill="#f6d5df"/><circle cx="200" cy="200" r="150" fill="#fbe9ee"/>
  <g transform="translate(-10 70) scale(1.5)">${shape('perfume','#e58aa3')}</g><g transform="translate(120 100) scale(1.3)">${shape('lipstick','#c2185b')}</g><g transform="translate(70 170) scale(1.1)">${shape('jar','#8bc6a1')}</g></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const photo=w=>w.img||ROOT+'images/products/product-'+w.id+'.jpg';
const imgTag=(w,alt='')=>`<img src="${String(photo(w)).replace(/"/g,'&quot;')}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.f" data-f="${productImg({...w,img:''})}">`;
/* Flags (inline SVG, so they show on every device) */
const FLAGS=(()=>{
  const star=(cx,cy,R,r,a0=-90)=>{let p=[];for(let i=0;i<10;i++){const a=(a0+i*36)*Math.PI/180,k=i%2?r:R;p.push((cx+k*Math.cos(a)).toFixed(2)+','+(cy+k*Math.sin(a)).toFixed(2));}return `<polygon points="${p.join(' ')}" fill="#fff"/>`;};
  const W=b=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice">${b}</svg>`);
  return {
   en:W(`<svg viewBox="0 0 60 30" width="30" height="20" preserveAspectRatio="xMidYMid slice"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`),
   az:W(`<rect width="30" height="6.67" fill="#00b5e2"/><rect y="6.67" width="30" height="6.67" fill="#ef3340"/><rect y="13.33" width="30" height="6.67" fill="#509e2f"/><circle cx="13.3" cy="10" r="3.6" fill="#fff"/><circle cx="14.4" cy="10" r="2.9" fill="#ef3340"/>${star(18.3,10,1.9,.8)}`),
   ru:W(`<rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/>`),
   tr:W(`<rect width="30" height="20" fill="#e30a17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.5" cy="10" r="4" fill="#e30a17"/>${star(17.4,10,2.6,1.05,0)}`)
  };
})();
const flagImg=(l,h=15)=>`<img class="flag" src="${FLAGS[l]}" alt="" width="${Math.round(h*1.5)}" height="${h}">`;

const CLOUD=window.TK_CLOUD||{};
const DB = {
  data:null, auth:null, _t:null,
  cloud(){return String(CLOUD.databaseURL||'').trim().replace(/\/+$/,'');},
  async load(admin){ await this._l(admin); this._fix(); },
  _fix(){
    const d=this.data; d.settings=d.settings||{}; d.albums=d.albums||[]; d.products=d.products||[];
    d.albums.forEach(a=>{a.name=a.name||{};const s=SEED_ALBUMS.find(x=>x.key===a.key);if(s){a.name.ru=a.name.ru||s.name.ru;a.name.tr=a.name.tr||s.name.tr;}delete a.name.ur;});
    d.products.forEach(w=>{w.tags=w.tags||[];});
    const st=d.settings; if(st.texts)delete st.texts.ur;
    const h=st.home; if(h){['title','sub'].forEach(k=>{if(h[k])delete h[k].ur;});(h.slides||[]).concat(h.gallery||[]).forEach(x=>{if(x.cap)delete x.cap.ur;});}
  },
  _local(){try{const s=localStorage.getItem('tk_data');if(s)return JSON.parse(s);}catch(e){}return null;},
  async _file(){try{const r=await fetch(ROOT+'store.json',{cache:'no-store'});if(r.ok)return await r.json();}catch(e){}return null;},
  async _l(admin){
    if(this.cloud()){
      let ok=false;
      try{const r=await fetch(this.cloud()+'/store.json',{cache:'no-store'});
        if(r.ok){ok=true;const j=await r.json();if(j&&j.products){this.data=j;try{localStorage.setItem('tk_data',JSON.stringify(j));}catch(e){}return;}}}catch(e){}
      if(ok){ /* cloud reachable but still empty: first run */
        const l=admin?this._local():null; if(l){this.data=l;this._cloudNew=true;return;}
        const f=await this._file(); if(f){this.data=f;this._cloudNew=!!admin;return;}
        this.data={albums:SEED_ALBUMS,products:makeProducts()};this._cloudNew=!!admin;return;
      }
      const l=this._local(); if(l){this.data=l;return;}   /* offline: use last copy */
    } else { const l=this._local(); if(l){this.data=l;return;} }
    const f=await this._file(); if(f){this.data=f;return;}
    this.data={albums:SEED_ALBUMS,products:makeProducts()};
  },
  save(){
    let okLocal=true;
    try{localStorage.setItem('tk_data',JSON.stringify(this.data));}catch(e){okLocal=false;}
    if(this.cloud()){clearTimeout(this._t);this._t=setTimeout(()=>this.push(),350);return true;}
    if(!okLocal){alert('Browser storage is full. Remove some photos, or paste image links / file paths (images/home/...) instead of uploading.');return false;}
    return true;
  },
  async push(){
    const note=window.onCloud||(()=>{});
    try{
      const tok=await this.token();
      const r=await fetch(this.cloud()+'/store.json'+(tok?'?auth='+encodeURIComponent(tok):''),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(this.data)});
      if(!r.ok)throw new Error(r.status===401||r.status===403?'denied':'HTTP '+r.status);
      note(true);
    }catch(e){note(false,e.message);}
  },
  async signIn(pw){
    const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+encodeURIComponent(CLOUD.apiKey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:CLOUD.adminEmail,password:pw,returnSecureToken:true})});
    const j=await r.json(); if(!r.ok)throw new Error((j.error&&j.error.message)||'auth');
    this._setAuth(j.idToken,j.refreshToken,+j.expiresIn);
  },
  _setAuth(id,rt,sec){this.auth={id,rt,exp:Date.now()+(sec-120)*1000};try{sessionStorage.setItem('tk_auth',JSON.stringify(this.auth));}catch(e){}},
  async token(){
    if(!(CLOUD.apiKey&&CLOUD.adminEmail))return '';
    if(!this.auth){try{this.auth=JSON.parse(sessionStorage.getItem('tk_auth'));}catch(e){}}
    if(!this.auth)return '';
    if(Date.now()>this.auth.exp){
      const r=await fetch('https://securetoken.googleapis.com/v1/token?key='+encodeURIComponent(CLOUD.apiKey),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(this.auth.rt)});
      const j=await r.json(); if(!r.ok)throw new Error('denied');
      this._setAuth(j.id_token,j.refresh_token,+j.expires_in);
    }
    return this.auth.id;
  }
};

/* Shared helpers: image path resolver + photo resizer (used by the website and the admin) */
const imgSrc=u=>/^(https?:|data:|\/\/|\/)/.test(u||'')?u:ROOT+u;
function readImg(f,max=1400,q=.82){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=no;r.onload=()=>{const im=new Image();im.onerror=no;im.onload=()=>{
  const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',q));};im.src=r.result;};r.readAsDataURL(f);});}
