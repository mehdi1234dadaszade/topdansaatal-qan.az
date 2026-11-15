/* Data + storage. Order of loading: browser storage (admin edits) -> store.json -> built-in seed */
const ROOT = new URL('../', document.currentScript.src).href;
const LANGS=[['az','Azərbaycan dili']];
/* TOPDAN (wholesale) site: the pages in /topdan/ have data-site="w". It has its own products, albums, basket and discounts. */
const WS=!!(document.body&&document.body.dataset.site==='w');
const CK=k=>(WS?'tkw_':'tk_')+k;              /* basket / saved / promo / whatsapp keys are separate for the two sites */
const tkHash=s=>{s=String(s);let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36);};
const WS_DEF='17oxbzg23lu';                    /* hash of the default topdan password (the password itself is not stored in the code) */
let RED=WS;
const AC=()=>RED?'#f87171':'#a78bfa';           /* accent colour of the drawn watch pictures */
const SEED_ALBUMS = [
  {key:'men',name:{en:'Men',az:'Kişi saatları',ru:'Мужские часы',tr:'Erkek saatleri'}},
  {key:'women',name:{en:'Women',az:'Qadın saatları',ru:'Женские часы',tr:'Kadın saatleri'}},
  {key:'smart',name:{en:'Smart watches',az:'Ağıllı saatlar',ru:'Смарт-часы',tr:'Akıllı saatler'}},
  {key:'sport',name:{en:'Sport',az:'İdman saatları',ru:'Спортивные часы',tr:'Spor saatler'}},
  {key:'luxury',name:{en:'Luxury',az:'Lüks',ru:'Люкс',tr:'Lüks'}},
  {key:'budget',name:{en:'Budget',az:'Büdcəyə uyğun',ru:'Бюджетные',tr:'Uygun fiyatlı'}}
];
// [brand, name, shape, color, album, price in AZN] - sample data, change it in the admin panel
const SEED = [
 ['Casio','Edifice Chronograph','chrono','#9aa0b5','men',185],['Seiko','5 Automatic','watch','#c0c4d0','men',320],
 ['Citizen','Eco-Drive','watch','#cfd3dc','men',410],['Orient','Bambino','dress','#d8c9a0','men',290],
 ['Fossil','Grant Chronograph','chrono','#8a6a4a','men',260],['Tissot','PRX','watch','#9fb4cc','men',950],
 ['Hamilton','Khaki Field','watch','#6b7a5a','men',780],['Timex','Weekender','watch','#b8bcc6','men',95],
 ['Casio','Duro MDV-107','watch','#4b5563','men',55],
 ['Daniel Wellington','Petite','dress','#e3c6a8','women',210],['Michael Kors','Runway','chrono','#e0b88f','women',340],
 ['Fossil','Carlie','dress','#d9b5a0','women',195],['Skagen','Anita','dress','#d0d4dc','women',230],
 ['Swatch','Skin Classic','dress','#c9a7e8','women',140],['Casio','Vintage Gold','dress','#d4af37','women',75],
 ['Festina','Boyfriend','watch','#e8d2c0','women',250],['Armani Exchange','Lady Banks','chrono','#d8a7b1','women',360],
 ['Apple','Watch Series 10','smart','#c7ccd6','smart',899],['Apple','Watch SE','smart','#e5d6c3','smart',529],
 ['Samsung','Galaxy Watch 7','smart','#2d3040','smart',519],['Xiaomi','Watch S3','smart','#8b8f9a','smart',199],
 ['Huawei','Watch GT 5','smart','#b9a77a','smart',339],['Xiaomi','Smart Band 9','band','#6c5ce7','smart',79],
 ['Casio','G-Shock GA-2100','watch','#2b2d3a','sport',230],['Garmin','Forerunner 265','smart','#8b5cf6','sport',720],
 ['Casio','Baby-G','watch','#f06fa8','sport',210],['Timex','Ironman Classic','band','#ff7a1a','sport',110],
 ['Longines','Master Collection','dress','#e6d3a0','luxury',2650],['TAG Heuer','Carrera','chrono','#b9b9c4','luxury',6400],
 ['Omega','Seamaster','watch','#2e5ea8','luxury',8900]
];
function makeProducts(){
  return SEED.map((s,i)=>{
    const tags=[s[4]]; if(s[5]>=900&&!tags.includes('luxury'))tags.push('luxury'); if(s[5]<=100)tags.push('budget');
    return {id:i+1,brand:s[0],model:s[1],kind:s[2],color:s[3],price:s[5],stock:100,tags,img:'',desc:'',size:'',shade:'',origin:''};
  });
}
/* drawn watch pictures (used until a real photo is added) */
function shape(k,c){
  const S='#26233a',tick=[...Array(12)].map((_,i)=>{const a=i*30*Math.PI/180,r1=i%3?33:30,r2=36;return `<line x1="${(100+r1*Math.sin(a)).toFixed(1)}" y1="${(100-r1*Math.cos(a)).toFixed(1)}" x2="${(100+r2*Math.sin(a)).toFixed(1)}" y2="${(100-r2*Math.cos(a)).toFixed(1)}" stroke="#e8e6f5" stroke-width="${i%3?1.2:2.2}" opacity=".85"/>`;}).join('');
  const strap=`<rect x="84" y="14" width="32" height="172" rx="12" fill="${S}"/><rect x="84" y="14" width="10" height="172" rx="8" fill="#fff" opacity=".07"/>`;
  const crown=`<rect x="143" y="94" width="9" height="12" rx="3" fill="${c}"/>`;
  return {
   watch:`${strap}${crown}<circle cx="100" cy="100" r="46" fill="${c}"/><circle cx="100" cy="100" r="46" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><circle cx="100" cy="100" r="39" fill="#0b0a14"/>${tick}<line x1="100" y1="100" x2="100" y2="76" stroke="#fff" stroke-width="3" stroke-linecap="round"/><line x1="100" y1="100" x2="118" y2="108" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><line x1="100" y1="100" x2="86" y2="120" stroke="${AC()}" stroke-width="1.2"/><circle cx="100" cy="100" r="3" fill="${AC()}"/>`,
   chrono:`${strap}${crown}<rect x="143" y="72" width="8" height="9" rx="2" fill="${c}"/><rect x="143" y="119" width="8" height="9" rx="2" fill="${c}"/><circle cx="100" cy="100" r="48" fill="${c}"/><circle cx="100" cy="100" r="40" fill="#0b0a14"/>${tick}<circle cx="100" cy="84" r="9" fill="none" stroke="${AC()}" stroke-width="1.2"/><circle cx="84" cy="104" r="9" fill="none" stroke="${AC()}" stroke-width="1.2"/><circle cx="116" cy="104" r="9" fill="none" stroke="${AC()}" stroke-width="1.2"/><line x1="100" y1="100" x2="100" y2="68" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><line x1="100" y1="100" x2="120" y2="112" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="100" cy="100" r="2.6" fill="#fff"/>`,
   dress:`<rect x="88" y="14" width="24" height="172" rx="10" fill="${S}"/>${crown}<circle cx="100" cy="100" r="40" fill="${c}"/><circle cx="100" cy="100" r="34" fill="#f1eee6"/><text x="100" y="82" font-size="6" text-anchor="middle" fill="#555" font-family="Georgia">12</text><text x="100" y="124" font-size="6" text-anchor="middle" fill="#555" font-family="Georgia">6</text><text x="123" y="102" font-size="6" text-anchor="middle" fill="#555" font-family="Georgia">3</text><text x="77" y="102" font-size="6" text-anchor="middle" fill="#555" font-family="Georgia">9</text><line x1="100" y1="100" x2="100" y2="78" stroke="#222" stroke-width="2" stroke-linecap="round"/><line x1="100" y1="100" x2="114" y2="106" stroke="#222" stroke-width="1.6" stroke-linecap="round"/><circle cx="100" cy="100" r="2" fill="#222"/>`,
   smart:`<rect x="80" y="12" width="40" height="176" rx="14" fill="${S}"/><rect x="144" y="86" width="6" height="22" rx="3" fill="${c}"/><rect x="62" y="58" width="80" height="84" rx="22" fill="${c}"/><rect x="69" y="65" width="66" height="70" rx="16" fill="#05040a"/><text x="102" y="97" font-size="19" text-anchor="middle" fill="#fff" font-family="Inter,Arial" font-weight="600">10:09</text><rect x="82" y="106" width="40" height="5" rx="2.5" fill="#8b5cf6"/><rect x="88" y="116" width="28" height="4" rx="2" fill="#3b82f6" opacity=".8"/>`,
   band:`<rect x="86" y="10" width="28" height="180" rx="12" fill="${c}" opacity=".9"/><rect x="74" y="64" width="52" height="72" rx="16" fill="#15131f"/><rect x="79" y="69" width="42" height="62" rx="12" fill="#05040a"/><text x="100" y="97" font-size="13" text-anchor="middle" fill="#fff" font-family="Inter,Arial" font-weight="600">10:09</text><circle cx="100" cy="114" r="6" fill="none" stroke="#8b5cf6" stroke-width="2"/>`,
   lipstick:`<rect x="78" y="112" width="44" height="60" rx="6" fill="#2b2326"/><rect x="82" y="102" width="36" height="12" fill="#d9b45a"/><path d="M85 102V76l30-14v40z" fill="${c}"/>`,
   tube:`<rect x="82" y="44" width="36" height="112" rx="10" fill="${c}"/><rect x="86" y="24" width="28" height="24" rx="5" fill="#2b2326"/>`,
   bottle:`<rect x="66" y="82" width="68" height="90" rx="14" fill="${c}"/><rect x="84" y="46" width="32" height="18" rx="4" fill="#2b2326"/>`,
   jar:`<rect x="54" y="100" width="92" height="58" rx="12" fill="${c}"/><rect x="50" y="74" width="100" height="30" rx="9" fill="#d9b45a"/>`,
   perfume:`<rect x="58" y="88" width="84" height="82" rx="16" fill="${c}"/><rect x="82" y="48" width="36" height="32" rx="6" fill="#d9b45a"/>`,
   palette:`<rect x="34" y="58" width="132" height="90" rx="12" fill="#2b2326"/><circle cx="76" cy="100" r="14" fill="${c}"/><circle cx="118" cy="100" r="14" fill="${c}" opacity=".7"/>`,
   nail:`<rect x="72" y="100" width="56" height="64" rx="12" fill="${c}"/><rect x="88" y="52" width="24" height="52" rx="6" fill="#2b2326"/>`
  }[k]||`<circle cx="100" cy="100" r="40" fill="${c}"/>`;
}
function productImg(w){
  RED=WS||!!w.ws;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="b" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="${RED?'#6b1d24':'#3a2a78'}"/><stop offset=".55" stop-color="${RED?'#2a0a0e':'#150f2e'}"/><stop offset="1" stop-color="#05040a"/></radialGradient></defs>${w.bare?'':'<rect width="200" height="200" fill="url(#b)"/><ellipse cx="100" cy="184" rx="42" ry="6" fill="#000" opacity=".45"/>'}${shape(w.kind,w.color||'#8b5cf6')}</svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function heroArt(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><radialGradient id="g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7c5cff" stop-opacity=".75"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="#05040a"/><circle cx="200" cy="200" r="190" fill="url(#g)"/>
  <g transform="translate(-40 -20) scale(2.2)">${shape('watch','#c4b5fd')}</g></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const photo=w=>w.img||ROOT+(w.ws?'images/topdan/product-':'images/products/product-')+w.id+'.jpg';
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

const PRODS=()=>WS?DB.data.wholesale.products:DB.data.products;
const ALBS=()=>WS?DB.data.wholesale.albums:DB.data.albums;
const CLOUD=window.TK_CLOUD||{};
/* tiny IndexedDB cache (much bigger than localStorage, so the whole shop copy fits) */
const IDBC={_o(){return new Promise((ok,no)=>{try{const r=indexedDB.open('tkc',1);r.onupgradeneeded=()=>r.result.createObjectStore('k');r.onsuccess=()=>ok(r.result);r.onerror=()=>no();}catch(e){no();}});},
 async get(k){try{const d=await this._o();return await new Promise(ok=>{const q=d.transaction('k').objectStore('k').get(k);q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null);});}catch(e){return null;}},
 async set(k,v){try{const d=await this._o();d.transaction('k','readwrite').objectStore('k').put(v,k);}catch(e){}}};
/* SPLIT LOADING: Firebase keeps (1) the full shop copy (used by the admin), (2) _c = everything except the product lists, (3) _p = the product lists split per album, (4) _v = version stamp.
   Visitors read only _v (a few bytes), _c (small) and the one album they open - not the whole shop. */
const SHK=k=>'s'+tkHash(k||'_n');                 /* shard name: safe characters for Firebase keys */
const DB = {
  data:null, auth:null, _t:null,
  cloud(){return String(CLOUD.databaseURL||'').trim().replace(/\/+$/,'');},
  async load(admin){ await this._l(admin); this._fix(); },
  _fix(){
    const d=this.data; d.settings=d.settings||{}; d.albums=d.albums||[]; d.products=d.products||[];
    d.albums.forEach(a=>{a.name=a.name||{};const s=SEED_ALBUMS.find(x=>x.key===a.key);if(s){a.name.ru=a.name.ru||s.name.ru;a.name.tr=a.name.tr||s.name.tr;}delete a.name.ur;});
    /* old makeup/cosmetics data (saved in the browser or online) -> replaced by the watch albums + sample watches */
    const COS=['lipstick','tube','bottle','jar','perfume','palette','nail'];
    if(d.products.some(w=>COS.includes(w.kind))){d.albums=JSON.parse(JSON.stringify(SEED_ALBUMS));d.products=makeProducts();this._migrated=true;}
    if(d.settings.name&&/wal+nut/i.test(d.settings.name)){delete d.settings.name;this._migrated=true;}
    d.products.forEach(w=>{w.tags=w.tags||[];});
    d.bigAlbums=d.bigAlbums||[];d.bigAlbums.forEach(b=>{b.name=b.name||{};b.items=b.items||[];});
    /* TOPDAN (wholesale) goods: own albums + products, shown only on the /topdan/ pages */
    const W=d.wholesale=d.wholesale||{};W.albums=W.albums||[];W.products=W.products||[];W.home=W.home||{};
    W.albums.forEach(a=>{a.name=a.name||{};});W.bigAlbums=W.bigAlbums||[];W.bigAlbums.forEach(b=>{b.name=b.name||{};b.items=b.items||[];});
    /* default big albums (created once; if you delete them later they do not come back) */
    const seedBig=o=>{if(o.bigSeeded)return;o.bigSeeded=true;this._migrated=true;if(o.bigAlbums.length)return;
      [['Premium Brendlər','premium-brendler'],['A Class Brendlər','a-class-brendler']].forEach(x=>o.bigAlbums.push({key:'big-'+x[1],name:{az:x[0],en:x[0],ru:x[0],tr:x[0]},items:[]}));};
    seedBig(d);seedBig(W);W.products.forEach(w=>{w.tags=w.tags||[];w.ws=1;});
    /* store contact details (filled once; afterwards change them in Admin > Contact) */
    if(!d.settings.contactSeeded){const C=d.settings.contact=d.settings.contact||{},D={instagram:'https://www.instagram.com/topdan_saat_',tiktok:'https://www.tiktok.com/@cdvipsaat_',whatsapp:'+994501005444',address:'Sədərək Ticarət Mərkəzi, Sıra 12 Dükan 60',maps:'https://goo.gl/maps/VXDsYAnSGdWrTXEy5?g_st=aw',map:'Sədərək Ticarət Mərkəzi, Bakı'};
      for(const k in D)C[k]=D[k];if(!C.phone)C.phone='+994501005444';d.settings.contactSeeded=true;this._migrated=true;}
    if(d.settings.contact)delete d.settings.contact.facebook;
    const st=d.settings; if(st.texts)delete st.texts.ur;
    const h=st.home; if(h){['title','sub'].forEach(k=>{if(h[k])delete h[k].ur;});(h.slides||[]).concat(h.gallery||[]).forEach(x=>{if(x.cap)delete x.cap.ur;});}
  },
  async refresh(){ /* background check: returns true only when the shop data really changed */
    if(this._split){ /* split mode: ask only for the tiny version stamp; download the core again only if it changed */
      try{const r=await fetch(this.cloud()+'/store/_v.json',{cache:'no-store'});if(!r.ok)return false;const v=await r.json();
        if(v==null||v===this.data._v){IDBC.set('core',{t:Date.now(),s:this._raw});return false;}
        const r2=await fetch(this.cloud()+'/store/_c.json',{cache:'no-store'});if(!r2.ok)return false;const tx=await r2.text(),j=JSON.parse(tx);
        if(!j||!j._ix)return false;IDBC.set('core',{t:Date.now(),s:tx});return true;}catch(e){return false;}
    }
    try{const r=await fetch(this.cloud()+'/store.json',{cache:'no-store'});if(!r.ok)return false;
      const tx=await r.text(),j=JSON.parse(tx);if(!j||!j.products)return false;
      IDBC.set('store',{t:Date.now(),s:tx});return tx!==this._raw;}catch(e){return false;}
  },
  _local(){try{const s=localStorage.getItem('tk_data');if(s)return JSON.parse(s);}catch(e){}return null;},
  async _file(){try{const r=await fetch(ROOT+'store.json',{cache:'no-store'});if(r.ok)return await r.json();}catch(e){}return null;},
  async _l(admin){
    if(this.cloud()){
      let ok=false;
      if(!admin&&await this._lc())return;          /* split mode: small core + per-album product lists */
      /* FAST PATH (visitors): show the copy saved in this browser at once; re-check Firebase only every 10 minutes */
      if(!admin){const c=await IDBC.get('store');
        if(c&&c.s){try{const j=JSON.parse(c.s);if(j&&j.products){this.data=j;this._raw=c.s;this._stale=Date.now()-c.t>600000;return;}}catch(e){}}}
      try{const r=await fetch(this.cloud()+'/store.json',{cache:'no-store'});
        if(r.ok){ok=true;let tx=await r.text(),j=JSON.parse(tx);if(j&&j.products){const had=!!(j._c&&j._p);delete j._c;delete j._p;delete j._v;if(had)tx=JSON.stringify(j);else if(admin)this._needIdx=true;   /* admin works on the clean copy; the split copy is rebuilt on every save */
          this.data=j;this._raw=tx;if(admin){try{localStorage.setItem('tk_data',tx);}catch(e){}}else IDBC.set('store',{t:Date.now(),s:tx});return;}}}catch(e){}
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
  /* ---- split loading: visitor side ---- */
  async _lc(){
    const c=await IDBC.get('core');
    if(c&&c.s){try{const j=JSON.parse(c.s);if(j&&j._ix){this._setCore(j,c.s);this._stale=Date.now()-c.t>600000;return true;}}catch(e){}}
    try{const r=await fetch(this.cloud()+'/store/_c.json',{cache:'no-store'});
      if(r.ok){const tx=await r.text();if(tx&&tx!=='null'){const j=JSON.parse(tx);if(j&&j._ix){IDBC.set('core',{t:Date.now(),s:tx});this._setCore(j,tx);return true;}}}}catch(e){}
    return false;
  },
  _setCore(j,tx){j.products=[];(j.wholesale=j.wholesale||{}).products=[];this.data=j;this._raw=tx;this._split=true;this._have={};},
  ix(){return this._split?this.data._ix[WS?'w':'m']:null;},
  /* load only the product lists that the page needs: {albums:[key],ids:[id],all:true} */
  async need(o){
    if(!this._split)return;
    const side=WS?'w':'m',x=this.data._ix[side];let hs=[];
    if(o.all)hs=x.sh.slice();
    (o.albums||[]).forEach(k=>hs.push(SHK(k)));
    (o.ids||[]).forEach(id=>{const h=x.idAlb[id];if(h)hs.push(h);});
    hs=[...new Set(hs)].filter(h=>x.sh.includes(h)&&!this._have[side+h]);
    await Promise.all(hs.map(h=>this._shard(side,h)));
  },
  async _shard(side,h){
    const v=this.data._v,ck='p:'+side+h;let l=null;
    const c=await IDBC.get(ck);if(c&&c.v===v&&Array.isArray(c.l))l=c.l;
    if(!l){try{const r=await fetch(this.cloud()+'/store/_p/'+side+'/'+h+'.json',{cache:'no-store'});if(r.ok){const j=await r.json();l=Array.isArray(j)?j:(j&&typeof j==='object'?Object.values(j):null);}}catch(e){}
      if(l)IDBC.set(ck,{v,l});}
    if(!l)return;
    const arr=side==='w'?this.data.wholesale.products:this.data.products;
    l.forEach(w=>{if(!w)return;w.tags=w.tags||[];if(side==='w')w.ws=1;if(!arr.some(x=>x.id===w.id))arr.push(w);});
    arr.sort((a,b)=>(a._o||0)-(b._o||0));this._have[side+h]=1;
  },
  /* ---- split loading: admin side (built on every save) ---- */
  derive(d){
    const mk=(P,A,fid,auto,ws)=>{
      const x={n:{},cov:{},feat:[],brands:[],idAlb:{},sh:[]},sh={};
      P.forEach((w,i)=>{const c=Object.assign({},w,{_o:i});if(ws)c.ws=1;const tg=(w.tags&&w.tags.length)?w.tags:[null];tg.forEach(k=>{const h=SHK(k);(sh[h]=sh[h]||[]).push(c);});x.idAlb[w.id]=SHK(tg[0]);});
      A.forEach(a=>{const l=P.filter(w=>(w.tags||[]).includes(a.key));x.n[a.key]=l.length;if(l[0])x.cov[a.key]={id:l[0].id,img:l[0].img||'',kind:l[0].kind,color:l[0].color};});
      let f=(fid||[]).map(id=>P.find(w=>w.id===id)).filter(Boolean);if(!f.length)f=auto(P);
      x.feat=f.map(w=>{const c=Object.assign({},w);if(ws)c.ws=1;return c;});
      x.brands=[...new Set(P.map(w=>w.brand))];x.sh=Object.keys(sh);return {x,sh};
    };
    const W=d.wholesale||{},H=(d.settings||{}).home||{};
    const m=mk(d.products||[],d.albums||[],H.featuredIds,P=>P.slice().sort((a,b)=>b.price-a.price).filter((_,i)=>i%4===0).slice(0,8),false);
    const w=mk(W.products||[],W.albums||[],(W.home||{}).featuredIds,P=>P.slice().reverse().slice(0,8),true);
    const v=Date.now(),core=JSON.parse(JSON.stringify(d));delete core.products;if(core.wholesale)delete core.wholesale.products;
    core._ix={m:m.x,w:w.x};core._v=v;
    return Object.assign({},d,{_c:core,_p:{m:m.sh,w:w.sh},_v:v});
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
      const r=await fetch(this.cloud()+'/store.json'+(tok?'?auth='+encodeURIComponent(tok):''),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(this.derive(this.data))});
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
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
  const I=window.TK_IMG;
  if(!I||!I.cloud||!I.preset){ok(c.toDataURL('image/jpeg',q));return;}   /* no Cloudinary set: old behaviour (photo saved inside Firebase) */
  c.toBlob(async b=>{try{const fd=new FormData();fd.append('file',b,'photo.jpg');fd.append('upload_preset',I.preset);
    const rs=await fetch('https://api.cloudinary.com/v1_1/'+I.cloud+'/image/upload',{method:'POST',body:fd}),j=await rs.json();
    if(!rs.ok||!j.secure_url)throw new Error((j.error&&j.error.message)||'upload');
    ok(j.secure_url.replace('/upload/','/upload/f_auto,q_auto/'));}   /* short link only -> Firebase stays small */
  catch(e){alert('Şəkil Cloudinary-yə yüklənmədi: '+e.message);no(e);}},'image/jpeg',q);};im.src=r.result;};r.readAsDataURL(f);});}
