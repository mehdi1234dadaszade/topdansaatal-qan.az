/* NOTE: this login runs in the browser only. It keeps casual visitors out but is NOT real security. */
const DEF_USER='admin', DEF_CODE='cosqun1998'; /* used until you change them in the "Admin account" tab */
const ahash=s=>{s=String(s);let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36);};
const cloudAuth=()=>!!(DB.cloud()&&CLOUD.apiKey&&CLOUD.adminEmail);
async function adminCred(){let c=null;
  if(DB.cloud()){try{const r=await fetch(DB.cloud()+'/store/settings/adminLogin.json',{cache:'no-store'});if(r.ok)c=await r.json();}catch(e){}}
  if(!c||!c.u){try{c=JSON.parse(localStorage.getItem('tk_admin_cred'))||c;}catch(e){}}
  return c||{};}
const $=(s,r=document)=>r.querySelector(s);
function toast(m){const e=$('#toast');e.textContent=m;e.className='show';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2600);}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function login(e){e.preventDefault();const cr=await adminCred(),code=$('#p').value,user=$('#u').value.trim();
  const bad=()=>{$('#err').textContent=tr('Wrong username or code.');return false;};
  if(ahash(user)!==(cr.u||ahash(DEF_USER)))return bad();
  if(cloudAuth()){
    try{await DB.signIn(code);}catch(x){return /INVALID_|EMAIL_NOT_FOUND|PASSWORD/.test(String(x.message))?bad():(($('#err').textContent=tr('Online login failed: {e}',{e:x.message})),false);}
  }else if(ahash(code)!==(cr.c||ahash(DEF_CODE)))return bad();
  sessionStorage.setItem('tk_admin_user',user);sessionStorage.setItem('tk_admin','1');start();return false;}
window.onCloud=(ok,m)=>{const b=$('#cl');if(ok){toast(tr('Saved online ✓'));}else{toast(tr('Could not save online: {e}',{e:m||''}));}if(b)b.dataset.s=ok?'1':'0';};
function logout(){sessionStorage.removeItem('tk_admin');location.reload();}
async function start(){
  trStatic();$('#login').hidden=true;$('#app').hidden=false;await DB.load(true);render();if(DB._cloudNew&&DB.cloud()){DB._cloudNew=false;DB.save();}if(DB._migrated){DB._migrated=false;DB.save();}
  document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
    ['w','z','o','u','q','h','a','s','c','k','x','d','g'].forEach(k=>$('#tab-'+k).hidden=k!==b.dataset.t);if(b.dataset.t==='o')renderO();if(b.dataset.t==='u')renderU();});
}
trStatic();
if(sessionStorage.getItem('tk_admin'))start();
const D=()=>DB.data;
const aN=a=>a.name.az||a.name.en;
function render(){renderG();renderQ();renderW();renderWS();renderH();renderS();renderC();renderK();renderX();renderA();renderD();}
let q='';
function renderW(){
  const list=D().products.filter(w=>(w.brand+' '+w.model).toLowerCase().includes(q.toLowerCase()));
  $('#tab-w').innerHTML=`<div class="bar2"><input id="q" placeholder="${esc(tr('Search products'))}" value="${esc(q)}"><button class="b g" onclick="editW()">${tr('+ Add product')}</button></div>
   <div class="stats"><div class="stat"><b>${D().products.length}</b><span>${tr('Products')}</span></div><div class="stat"><b>${D().albums.length}</b><span>${tr('Albums')}</span></div><div class="stat"><b>${D().products.filter(w=>w.stock>0&&w.stock<=5).length}</b><span>${tr('Low stock (5 or less)')}</span></div><div class="stat"><b>${D().products.filter(w=>w.stock<=0).length}</b><span>${tr('Out of stock')}</span></div></div>
   <p>${tr('Change price or stock and it saves automatically. Yellow = low stock, red = out of stock (the website shows an "Out of stock" label).')}</p>`+
   list.map(w=>`<div class="row ${w.stock<=0?'out':w.stock<=5?'low':''}">${imgTag(w)}<div><b>${esc(w.brand)} ${esc(w.model)}</b><small>${esc((w.tags||[]).join(', '))}</small></div>
    <label>${tr('Price ₼')}<input type="number" min="0" step="any" value="${w.price}" onchange="upd(${w.id},'price',this.value)"></label>
    <label>${tr('Stock')}<input type="number" min="0" step="1" value="${w.stock}" onchange="upd(${w.id},'stock',this.value)"></label>
    <div class="acts"><button class="b s" onclick="editW(${w.id})">${tr('Edit')}</button><button class="b s r" onclick="delW(${w.id})">${tr('Delete')}</button></div></div>`).join('');
  const qi=$('#q');qi.oninput=()=>{q=qi.value;renderW();const n=$('#q');n.focus();n.setSelectionRange(q.length,q.length);};
}
function upd(id,f,v){const w=D().products.find(x=>x.id===id);w[f]=Math.max(0,+v||0);DB.save();}
function delW(id){const w=D().products.find(x=>x.id===id);
  if(confirm(tr('Delete {name}?',{name:w.brand+' '+w.model}))){D().products=D().products.filter(x=>x.id!==id);DB.save();renderW();}}
function editW(id){
  const w=id?D().products.find(x=>x.id===id):{brand:'',model:'',price:100,stock:100,kind:'watch',color:'#8b5cf6',tags:[],img:'',desc:''};
  $('#wf').innerHTML=`<h2>${id?tr('Edit product'):tr('Add product')}</h2>
   <div class="two"><label>${tr('Brand')}<input name="brand" required value="${esc(w.brand)}"></label><label>${tr('Model')}<input name="model" required value="${esc(w.model)}"></label>
   <label>${tr('Price ₼')}<input name="price" type="number" min="0" step="any" required value="${w.price}"></label><label>${tr('Stock')}<input name="stock" type="number" min="0" required value="${w.stock}"></label>
   <label>${tr('Shape (for the drawn picture)')}<select name="kind">${['watch','chrono','dress','smart','band'].map(m=>`<option value="${m}" ${w.kind===m?'selected':''}>${tr(m)}</option>`).join('')}</select></label>
   <label>${tr('Color')}<input type="color" name="color" value="${w.color||'#8b5cf6'}"></label></div>
   <label>${tr('Image URL (or put the file in images/products/ as product-ID.jpg)')}<input name="img" value="${w.img&&!w.img.startsWith('data:')?esc(w.img):''}" placeholder="https://..."></label>
   <label>${tr('Or upload a photo')}<input type="file" id="file" accept="image/*"></label>
   <label>${tr('Description (optional, shown in every language)')}<textarea name="desc" rows="2">${esc(w.desc)}</textarea></label>
   <div class="two"><label>${tr('Size')}<input name="size" value="${esc(w.size)}" placeholder="${esc(tr('40 mm'))}"></label><label>${tr('Shade')}<input name="shade" value="${esc(w.shade)}" placeholder="${esc(tr('Black leather'))}"></label><label>${tr('Origin')}<input name="origin" value="${esc(w.origin)}" placeholder="${esc(tr('Japan'))}"></label></div>
   <div class="chk"><b>${tr('Albums')}</b><br>${D().albums.map(a=>`<label><input type="checkbox" name="tag" value="${esc(a.key)}" ${(w.tags||[]).includes(a.key)?'checked':''}> ${esc(aN(a))}</label>`).join('')}</div>
   <p class="acts"><button class="b" value="save">${tr('Save')}</button><button class="b s r" value="cancel" formnovalidate>${tr('Cancel')}</button></p>`;
  let photo=w.img&&w.img.startsWith('data:')?w.img:'';
  $('#file').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
    const s=Math.min(1,500/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);photo=c.toDataURL('image/jpeg',.8);};im.src=r.result;};r.readAsDataURL(f);};
  $('#wf').onsubmit=e=>{
    if(e.submitter&&e.submitter.value!=='save')return;
    const f=new FormData($('#wf')),o=id?w:{id:Math.max(0,...D().products.map(x=>x.id))+1};
    Object.assign(o,{brand:f.get('brand').trim(),model:f.get('model').trim(),price:+f.get('price'),stock:+f.get('stock'),kind:f.get('kind'),color:f.get('color'),
      img:f.get('img').trim()||photo,desc:f.get('desc').trim(),size:f.get('size').trim(),shade:f.get('shade').trim(),origin:f.get('origin').trim(),tags:f.getAll('tag')});
    if(!id)D().products.push(o);DB.save();renderW();renderA();};
  $('#dlg').showModal();
}
function renderA(){
  $('#tab-a').innerHTML=`<form class="box" style="max-width:none" onsubmit="addA(event)"><b>${tr('New album')}</b><div class="two">
   <label>${tr('Name (Azərbaycan dili)')}<input id="a_az" required></label></div><button class="b">${tr('Add album')}</button></form>
   <p>${tr('Each album can have its own <b>cover photo</b> (shown on the home page and the Albums page). Without one, the first product photo is used.')}</p>`+
   D().albums.map(a=>`<div class="row" style="grid-template-columns:1fr"><div class="cov">${a.img?`<img src="${esc(imgSrc(a.img))}" alt="">`:'<img alt="" src="'+productImg({kind:'watch',color:'#c4b5fd'})+'">'}
   <div style="flex:1"><b>${esc(a.name.az||a.name.en)}</b>
   <small>${tr('{n} products · key: {key}',{n:D().products.filter(w=>(w.tags||[]).includes(a.key)).length,key:esc(a.key)})}</small>
   <div class="acts" style="margin-top:6px"><label class="b s g" style="margin:0;cursor:pointer">${tr('Upload cover')}<input type="file" accept="image/*" hidden onchange="albCover('${esc(a.key)}',this.files[0])"></label>
   <button class="b s" onclick="albCoverUrl('${esc(a.key)}')">${tr('Cover from link')}</button>${a.img?`<button class="b s r" onclick="albCoverDel('${esc(a.key)}')">${tr('Remove cover')}</button>`:''}
   <button class="b s r" onclick="delA('${esc(a.key)}')">${tr('Delete album')}</button></div></div></div></div>`).join('');
}
async function albCover(k,f){if(!f)return;try{const a=D().albums.find(x=>x.key===k);a.img=await readImg(f,900,.82);if(DB.save()){renderA();toast(tr('Cover saved ✓'));}}catch(e){alert(tr('Could not read this image.'));}}
function albCoverUrl(k){const u=prompt(tr('Image link (https://...) or file path in your repository (images/home/cover.jpg):'));if(!u)return;D().albums.find(x=>x.key===k).img=u.trim();DB.save();renderA();toast(tr('Cover saved ✓'));}
function albCoverDel(k){delete D().albums.find(x=>x.key===k).img;DB.save();renderA();}
function addA(e){e.preventDefault();let key=$('#a_az').value.trim().toLowerCase().replace(/ə/g,'e').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ç/g,'c').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'album';
  while(D().albums.some(a=>a.key===key))key+='-2';
  const nm=$('#a_az').value.trim();D().albums.push({key,name:{az:nm,en:nm,ru:nm,tr:nm}});DB.save();render();}
function delA(k){if(!confirm(tr('Delete this album? The products stay on the website.')))return;
  D().albums=D().albums.filter(a=>a.key!==k);D().products.forEach(w=>w.tags=(w.tags||[]).filter(x=>x!==k));DB.save();render();}
function renderD(){
  $('#tab-d').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Home page video')}</h2><label>${tr('YouTube link')}<input id="yt" value="${esc(D().settings.youtube||'')}" placeholder="https://www.youtube.com/watch?v=..."></label><p><button class="b" onclick="saveYt()">${tr('Save video')}</button></p></div><br><div class="box" style="max-width:none"><h2>${tr('Publish your changes')}</h2>
   <p id="cl" class="${DB.cloud()?'ok':'err'}">${DB.cloud()?tr('Online database is ON: every change is saved for all visitors on all devices.'):tr('Online database is NOT set up. Changes stay only in this browser. Follow the README (Firebase) steps and fill js/config.js.')}</p>
   ${DB.cloud()?`<p><button class="b g" onclick="DB.push()">${tr('Upload everything to the online database now')}</button></p>`:''}
   <p>${tr('Changes are saved in <b>this browser</b>. To show them to all visitors: click <b>Download store.json</b>, then upload that file to the main folder of your GitHub repository (replace the old one).')}</p>
   <p><button class="b g" onclick="exp()">${tr('Download store.json')}</button></p>
   <label>${tr('Import a store.json file')}<input type="file" accept=".json" onchange="imp(this.files[0])"></label>
   <p><button class="b s r" onclick="reset()">${tr('Reset to the 30 sample products')}</button></p><p id="msg" class="ok"></p></div><br><div class="box" style="max-width:none"><h2>${tr('Browser storage')}</h2>${meter()}
   <p style="font-size:.9rem;color:#7d6169">${tr('Uploaded photos live inside your browser (about 5 MB available) and inside store.json. If it fills up, put the photo files in <b>images/home/</b> on GitHub and paste their path (for example <b>images/home/slide-1.jpg</b>) into the photo fields instead.')}</p></div>`;
}
function meter(){const n=(localStorage.getItem('tk_data')||'').length,p=Math.min(100,Math.round(n/50000));return `<div class="meter"><i style="width:${p}%"></i></div>${tr('{mb} MB of about 5 MB used ({p}%)',{mb:(n/1048576).toFixed(2),p})}${p>75?' <span style="color:#b3261e">'+tr('- almost full!')+'</span>':''}`;}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D(),null,1)],{type:'application/json'}));a.download='store.json';a.click();}
function imp(f){if(!f)return;f.text().then(s=>{try{const d=JSON.parse(s);if(!d.albums||!d.products)throw 0;d.settings=d.settings||{};if(D().settings&&D().settings.adminLogin)d.settings.adminLogin=D().settings.adminLogin;
    if(!d.wholesale&&D().wholesale)d.wholesale=D().wholesale;['wholesaleKey','wdiscounts'].forEach(k=>{if(d.settings[k]==null&&D().settings&&D().settings[k]!=null)d.settings[k]=D().settings[k];});DB.data=d;DB.save();render();$('#msg').textContent=tr('Imported.');}catch(e){alert(tr('This is not a valid store.json file.'));}});}
function reset(){if(confirm(tr('Remove all your changes and go back to the sample data?'))){const S0=D().settings||{},keep={};['adminLogin','wholesaleKey','wdiscounts'].forEach(k=>{if(S0[k]!=null)keep[k]=S0[k];});DB.data={albums:SEED_ALBUMS,products:makeProducts(),settings:keep,wholesale:D().wholesale};DB.save();render();}}

function saveYt(){D().settings.youtube=$('#yt').value.trim();DB.save();toast(tr('Saved ✓'));}

const LG=LANGS;
let HS={};
function loadHS(){const h=D().settings.home||{};
  HS={title:Object.assign({},h.title),sub:Object.assign({},h.sub),img:h.img||'',showBrands:h.showBrands!==false,brands:h.brands||'',layout:h.layout||'split',speed:h.speed||5,
   slides:(h.slides||[]).map(x=>({img:x.img,cap:Object.assign({},x.cap)})),gallery:(h.gallery||[]).map(x=>({img:x.img,cap:Object.assign({},x.cap)})),ctaImg:h.ctaImg||'',
   show:Object.assign({albums:true,video:true,featured:true,gallery:true,why:true,cta:true},h.show),featuredIds:[...(h.featuredIds||[])]};}
function collectH(){
  const g=id=>{const e=$('#'+id);return e?e.value.trim():'';};
  LG.forEach(l=>{HS.title[l[0]]=g('h_t_'+l[0]);HS.sub[l[0]]=g('h_s_'+l[0]);});
  HS.brands=g('h_br');HS.showBrands=$('#h_sb').checked;HS.layout=g('h_lay')||'split';HS.speed=Math.min(15,Math.max(2,+g('h_sp')||5));
  document.querySelectorAll('#tab-h [data-sec]').forEach(c=>HS.show[c.dataset.sec]=c.checked);
  HS.featuredIds=[...document.querySelectorAll('#tab-h [data-fid]:checked')].map(c=>+c.dataset.fid);
  document.querySelectorAll('#tab-h [data-k]').forEach(i=>{const o=HS[i.dataset.k][+i.dataset.i];if(!o)return;
    if(i.dataset.f==='img'){const v=i.value.trim();if(v||i.dataset.d!=='1')o.img=v;}else{o.cap=o.cap||{};o.cap[i.dataset.l]=i.value.trim();}});
}
function persistH(msg){collectH();D().settings.home=JSON.parse(JSON.stringify(HS));if(DB.save()&&msg)toast(msg);}
function renderH(){
  loadHS();
  const rtl=l=>'',sec=[['albums','Albums section'],['video','Store video'],['featured','Featured products'],['gallery','Photo gallery'],['why','"Why us" cards'],['cta','Bottom call-to-action banner']];
  const NOPH=tr('No photo');
  const photo=(key,x,i,n)=>`<div class="ph"><div class="pm">${x.img?`<img src="${esc(imgSrc(x.img))}" alt="">`:NOPH}</div><div class="pbody">
   <label>${tr('Image link or file path')}<input data-k="${key}" data-i="${i}" data-f="img" data-d="${x.img&&x.img.startsWith('data:')?1:0}" value="${esc(x.img&&!x.img.startsWith('data:')?x.img:'')}" placeholder="${x.img&&x.img.startsWith('data:')?tr('(uploaded photo)'):'https://... or images/home/photo.jpg'}"></label>
   <label>${tr('Replace with an upload')}<input type="file" accept="image/*" onchange="upPhoto('${key}',${i},this.files[0])"></label>
   ${LG.map(l=>`<label>${tr('Caption ({l}) - optional',{l:l[0].toUpperCase()})}<input data-k="${key}" data-i="${i}" data-l="${l[0]}" value="${esc((x.cap||{})[l[0]])}" ${rtl(l[0])}></label>`).join('')}
   <div class="acts"><button class="b s" type="button" ${i?'':'disabled'} onclick="mvPhoto('${key}',${i},-1)">${tr('↑ Move up')}</button><button class="b s" type="button" ${i<n-1?'':'disabled'} onclick="mvPhoto('${key}',${i},1)">${tr('↓ Move down')}</button><button class="b s r" type="button" onclick="rmPhoto('${key}',${i})">${tr('Remove')}</button></div></div></div>`;
  const group=(key,title,hint,max)=>`<div class="card2"><h2>${tr(title)} (${HS[key].length})</h2><p class="hint">${tr(hint)}</p>
   <div class="photos">${HS[key].map((x,i)=>photo(key,x,i,HS[key].length)).join('')||'<p>'+tr('No photos yet.')+'</p>'}</div>
   <div class="drop"><b>${tr('Add photos')}</b><br>${tr('Choose one or many photos at once. They are resized automatically.')}<input type="file" accept="image/*" multiple onchange="addPhotos('${key}',this.files,${max});this.value=''">
   <p style="margin:8px 0 0"><button class="b s" type="button" onclick="addPhotoUrl('${key}')">${tr('+ Add from a link / file path')}</button></p></div></div>`;
  $('#tab-h').innerHTML=`<div class="savebar"><span>${tr('Edit the home page below. Photos are saved instantly; texts and options are saved with this button.')}</span><span><a href="../index.html" target="_blank" style="color:#c2476b;font-weight:600;margin-right:10px">${tr('Preview website ↗')}</a><button class="b g" onclick="persistH(tr('Home page saved ✓'))">${tr('Save home page')}</button></span></div>
   <div class="card2"><h2>${tr('Top section texts')}</h2><p class="hint">${tr('Leave a field empty to use the default text. Write the text in each language.')}</p>
   <div class="two">${LG.map(l=>`<label>${tr('Title ({l})',{l:l[1]})}<input id="h_t_${l[0]}" value="${esc(HS.title[l[0]])}" ${rtl(l[0])}></label>`).join('')}</div>
   <div class="two">${LG.map(l=>`<label>${tr('Text under the title ({l})',{l:l[1]})}<textarea id="h_s_${l[0]}" rows="3" ${rtl(l[0])}>${esc(HS.sub[l[0]])}</textarea></label>`).join('')}</div></div>
   <div class="card2"><h2>${tr('Top section style')}</h2><div class="two"><label>${tr('Layout')}<select id="h_lay"><option value="split" ${HS.layout==='split'?'selected':''}>${tr('Text on the left, photo slider on the right')}</option><option value="full" ${HS.layout==='full'?'selected':''}>${tr('Full-width photo slider behind the text')}</option></select></label>
   <label>${tr('Seconds per slide (2 to 15)')}<input id="h_sp" type="number" min="2" max="15" value="${esc(HS.speed)}"></label></div>
   <p class="hint">${tr('"Full-width" needs at least one slider photo below.')}</p></div>
   ${group('slides','Home page slider photos','These photos slide automatically at the top of the home page. Use bright, vertical or square photos for the "split" layout and wide photos for "full-width".',10)}
   <div class="card2"><h2>${tr('Single top photo (used only when there are no slider photos)')}</h2><label>${tr('Upload a photo')}<input type="file" accept="image/*" onchange="upSingle('img',this.files[0],900)"></label>
   <p>${HS.img?`<img src="${esc(imgSrc(HS.img))}" alt="" style="max-width:220px;max-height:160px;border-radius:10px;display:block;margin-bottom:8px"><button class="b s r" type="button" onclick="HS.img='';persistH();renderH()">${tr('Use the drawn picture')}</button>`:tr('Currently the drawn picture is used.')}</p></div>
   ${group('gallery','Photo gallery','A grid of store photos shown on the home page (click opens the photo large). Add your store, shelves, new arrivals...',24)}
   <div class="card2"><h2>${tr('Bottom banner photo')}</h2><p class="hint">${tr('Background photo of the "Visit us" banner at the bottom of the home page.')}</p>
   <label>${tr('Upload a photo')}<input type="file" accept="image/*" onchange="upSingle('ctaImg',this.files[0],1600)"></label>
   <p>${HS.ctaImg?`<img src="${esc(imgSrc(HS.ctaImg))}" alt="" style="max-width:260px;max-height:130px;border-radius:10px;display:block;margin-bottom:8px"><button class="b s r" type="button" onclick="HS.ctaImg='';persistH();renderH()">${tr('Remove (use the color)')}</button>`:tr('No photo - the banner uses the main colors.')}</p></div>
   <div class="card2"><h2>${tr('Brands bar')}</h2><label><input type="checkbox" id="h_sb" style="display:inline;width:auto" ${HS.showBrands?'checked':''}> ${tr('Show the brands bar')}</label>
   <label>${tr('Brands in the bar (separate with commas; empty = all brands of your products)')}<textarea id="h_br" rows="2">${esc(HS.brands)}</textarea></label></div>
   <div class="card2"><h2>${tr('Featured products')}</h2><p class="hint">${tr('Tick the products to show in "Featured products". Tick none to let the website choose automatically.')}</p>
   <div class="pick">${D().products.map(w=>`<label><input type="checkbox" data-fid="${w.id}" ${HS.featuredIds.includes(w.id)?'checked':''}>${esc(w.brand)} ${esc(w.model)}</label>`).join('')}</div></div>
   <div class="card2"><h2>${tr('Show or hide sections')}</h2><div class="chk">${sec.map(c=>`<label><input type="checkbox" data-sec="${c[0]}" ${HS.show[c[0]]?'checked':''}> ${tr(c[1])}</label>`).join('')}</div>
   <p class="hint">${tr('The words of every section title can be changed in the <b>Texts</b> tab.')}</p></div>
   <p><button class="b g" onclick="persistH(tr('Home page saved ✓'))">${tr('Save home page')}</button></p>`;
}
async function addPhotos(key,files,max){collectH();let n=0;
  for(const f of files){if(HS[key].length>=max){alert(tr('Maximum {n} photos here.',{n:max}));break;}try{HS[key].push({img:await readImg(f,key==='slides'?1400:1200,.82),cap:{}});n++;}catch(e){}}
  persistH(n?tr('{n} photo(s) added ✓',{n}):'');renderH();}
function addPhotoUrl(key){const u=prompt(tr('Image link (https://...) or file path in your repository (images/home/photo.jpg):'));if(!u)return;collectH();HS[key].push({img:u.trim(),cap:{}});persistH(tr('Photo added ✓'));renderH();}
async function upPhoto(key,i,f){if(!f)return;collectH();try{HS[key][i].img=await readImg(f,key==='slides'?1400:1200,.82);persistH(tr('Photo replaced ✓'));renderH();}catch(e){alert(tr('Could not read this image.'));}}
async function upSingle(field,f,max){if(!f)return;collectH();try{HS[field]=await readImg(f,max,.82);persistH(tr('Photo saved ✓'));renderH();}catch(e){alert(tr('Could not read this image.'));}}
function mvPhoto(key,i,d){collectH();const a=HS[key],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];persistH();renderH();}
function rmPhoto(key,i){if(!confirm(tr('Remove this photo?')))return;collectH();HS[key].splice(i,1);persistH(tr('Photo removed'));renderH();}

const THEME=[['gold','Main color (buttons, prices)'],['gold2','Soft color (light accents)'],['deep','Dark color (header, footer)'],['deep2','Second dark color (brands bar)'],['hero','Home page glow'],['glow2','Second glow (blue)'],['bg','Page background'],['card','Card background'],['ink','Text color'],['mut','Soft text color'],['line','Border lines'],['btn','Button color'],['btntxt','Button text color']];
const DEF={gold:'#8b5cf6',gold2:'#c4b5fd',deep:'#05040a',deep2:'#110d22',hero:'#5b3df5',glow2:'#2f7bff',bg:'#000000',card:'#0d0c15',ink:'#f5f5f7',mut:'#a1a1b5',line:'#25233a',btn:'#ffffff',btntxt:'#07060d'};
const PRE={'Purple night':DEF,
 'Black & gold':{gold:'#d4af37',gold2:'#f1d98a',deep:'#050505',deep2:'#14110a',hero:'#6b5416',glow2:'#b8860b',bg:'#000000',card:'#0e0d0a',ink:'#f7f3e8',mut:'#b3ab94',line:'#2a2619',btn:'#d4af37',btntxt:'#0a0a0a'},
 'Ocean':{gold:'#22b8cf',gold2:'#a5e8f0',deep:'#030a10',deep2:'#0a1c2a',hero:'#0e6f8f',glow2:'#3b82f6',bg:'#000000',card:'#08121b',ink:'#f2fafc',mut:'#9fb3bf',line:'#162a38',btn:'#ffffff',btntxt:'#04121a'},
 'Emerald':{gold:'#34d399',gold2:'#a7f3d0',deep:'#030a07',deep2:'#0a1f17',hero:'#0f7a56',glow2:'#10b981',bg:'#000000',card:'#08130e',ink:'#f1faf6',mut:'#9fb8ad',line:'#173126',btn:'#ffffff',btntxt:'#04140d'},
 'Rose & plum':{gold:'#ec4899',gold2:'#f9a8d4',deep:'#0a0309',deep2:'#200a1b',hero:'#9d174d',glow2:'#8b5cf6',bg:'#000000',card:'#12060f',ink:'#fdf2f8',mut:'#c4a3b7',line:'#33152b',btn:'#ffffff',btntxt:'#1a0612'}};
function renderC(){
  const th=Object.assign({},DEF,D().settings.theme||{});
  $('#tab-c').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Website colors')}</h2><p>${tr('Pick a ready palette or choose each color yourself.')}</p>
   <p>${Object.keys(PRE).map(n=>`<button class="b s" type="button" onclick="preset('${n}')">${tr(n)}</button> `).join('')}</p>
   <div class="two">${THEME.map(c=>`<label>${tr(c[1])}<input type="color" id="c_${c[0]}" value="${th[c[0]]}" style="height:42px;padding:2px"></label>`).join('')}</div>
   <p><button class="b g" onclick="saveC()">${tr('Save colors')}</button> <button class="b s r" onclick="delete D().settings.theme;DB.save();renderC();toast(tr('Back to default colors.'))">${tr('Reset colors')}</button></p></div>`;
}
function preset(n){THEME.forEach(c=>$('#c_'+c[0]).value=PRE[n][c[0]]||DEF[c[0]]);}
function saveC(){const o={};THEME.forEach(c=>o[c[0]]=$('#c_'+c[0]).value);D().settings.theme=o;DB.save();toast(tr('Saved ✓ Open the website to see the colors.'));}
function renderK(){
  const s=D().settings,C=s.contact||{};
  const F=[['name','Store name',s.name,'topdansaatalışqan.az'],['phone','Phone number',C.phone,'+994 50 000 00 00'],['address','Address',C.address,'Street, building, city'],
   ['maps','Google Maps link',C.maps,'https://maps.app.goo.gl/...'],['map','Map location (coordinates like 40.332061,49.780442, or a place name)',C.map,'40.409262,49.867092'],
   ['instagram','Instagram link',C.instagram,'https://www.instagram.com/...'],['tiktok','TikTok link',C.tiktok,'https://www.tiktok.com/@...'],['whatsapp','WhatsApp number or link',C.whatsapp,'+994 50 000 00 00'],['youtube','YouTube channel link',C.youtube,'https://www.youtube.com/@...']];
  $('#tab-k').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Contact information')}</h2><p>${tr('Leave a field empty to keep the current default.')}</p>
   ${F.map(f=>`<label>${tr(f[1])}<input id="k_${f[0]}" value="${esc(f[2]||'')}" placeholder="${esc(tr(f[3]))}"></label>`).join('')}
   <p><button class="b g" onclick="saveK()">${tr('Save contact information')}</button></p></div>`;
}
function saveK(){const g=id=>$('#k_'+id).value.trim();D().settings.name=g('name');
  D().settings.contact={phone:g('phone'),address:g('address'),maps:g('maps'),map:g('map'),instagram:g('instagram'),tiktok:g('tiktok'),whatsapp:g('whatsapp'),youtube:g('youtube')};DB.save();toast(tr('Saved ✓ Open the website to see the change.'));}
function renderX(){
  const ov=D().settings.texts||{},LG=LANGS;
  $('#tab-x').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Words on the website')}</h2>
   <p>${tr('Change any word or sentence in each language. The grey text is the current one. Leave a box empty to keep it. Product names and album names are changed in their own tabs.')}</p>
   <input id="x_q" placeholder="${esc(tr('Search a word'))}"><div id="x_list">${Object.keys(T.en).map(k=>`<div class="row" style="grid-template-columns:1fr" data-s="${esc(((T.az[k]||T.en[k])+' '+k).toLowerCase())}"><b>${esc(T.az[k]||T.en[k])}</b>
    <div class="two">${LG.map(l=>`<input data-k="${k}" data-l="${l[0]}" value="${esc((ov[l[0]]||{})[k]||'')}" placeholder="${esc(T[l[0]][k])}" >`).join('')}</div></div>`).join('')}</div>
   <p><button class="b g" onclick="saveX()">${tr('Save texts')}</button> <button class="b s r" onclick="if(confirm(tr('Remove all your text changes?'))){delete D().settings.texts;DB.save();renderX();}">${tr('Reset all texts')}</button></p></div>`;
  $('#x_q').oninput=e=>{const v=e.target.value.toLowerCase();document.querySelectorAll('#x_list .row').forEach(r=>r.style.display=r.dataset.s.includes(v)?'':'none');};
}
function saveX(){const o={};LANGS.forEach(l=>o[l[0]]={});document.querySelectorAll('#x_list input').forEach(i=>{const v=i.value.trim();if(v)o[i.dataset.l][i.dataset.k]=v;});
  D().settings.texts=o;DB.save();toast(tr('Saved ✓ Open the website to see the change.'));}

/* ---------- orders, customers, discounts ---------- */
const STS=['new','confirmed','delivered','cancelled'],STL={new:'New',confirmed:'Confirmed',delivered:'Delivered',cancelled:'Cancelled'};
let OR=[],CU={},oq='',ofl='';
const fm=n=>'₼'+(Math.round(n*100)/100).toFixed(2).replace(/\.00$/,'');
const dtm=s=>new Date(s).toLocaleString(AL==='az'?'az-AZ':'en-GB',{dateStyle:'medium',timeStyle:'short'});
async function loadO(){try{CU=(await CUST.all())||{};}catch(e){CU={};toast(tr('Could not load orders: {e}',{e:e.message}));}
  OR=[];Object.keys(CU).forEach(k=>Object.values(CU[k].orders||{}).forEach(o=>OR.push(Object.assign({},o,{_k:k,phone:o.phone||k,name:o.name||(CU[k].profile||{}).name||''}))));
  OR.sort((a,b)=>a.date<b.date?1:-1);}
const cloudHint=()=>DB.cloud()?'':`<p class="err">${tr('Orders from other devices need the online database (see README). Right now only orders made in this browser are shown.')}</p>`;
async function renderO(){$('#tab-o').innerHTML='<p>…</p>';await loadO();drawO();}
function drawO(){
  $('#tab-o').innerHTML=`${cloudHint()}<div class="savebar"><span><b>${OR.filter(o=>o.status==='new').length}</b> ${tr('new orders')} · ${OR.length} ${tr('in total')}</span><span><input id="oq" placeholder="${tr('Search name or phone')}" value="${esc(oq)}" oninput="oq=this.value;listO()" style="width:180px"> <select id="ofl" onchange="ofl=this.value;listO()" style="width:auto"><option value="">${tr('All statuses')}</option>${STS.map(s=>`<option value="${s}" ${ofl===s?'selected':''}>${tr(STL[s])}</option>`).join('')}</select> <button class="b s" onclick="renderO()">${tr('Refresh')}</button></span></div><div id="olist"></div>`;listO();}
function listO(){const q=oq.trim().toLowerCase().replace(/^\+/,'');
  const l=OR.filter(o=>(!ofl||o.status===ofl)&&(!q||(o.name+' '+o.phone).toLowerCase().includes(q)));
  $('#olist').innerHTML=l.map(o=>`<div class="oc st-b-${esc(o.status||'new')}"><div class="oh"><div><b>${esc(o.name)}</b>${o.ws?' <span class="st st-confirmed">Topdan</span>':''} · <a href="tel:+${esc(o.phone)}">+${esc(o.phone)}</a>${o.location?' · '+esc(o.location):''}</div><div>${dtm(o.date)} · #${esc(String(o.id).toUpperCase())}</div></div>
   <table class="ot">${(o.items||[]).map(i=>`<tr><td>${esc(i.brand)} ${esc(i.model)}</td><td>× ${i.q}</td><td>${fm(i.unit*i.q)}</td></tr>`).join('')}</table>
   <div class="otot">${o.sale>0?`<span>${tr('Sale savings')}: -${fm(o.sale)}</span>`:''}${o.promo>0?`<span>${tr('Promo code')} ${esc(o.code)}: -${fm(o.promo)}</span>`:''}<b>${tr('Total')}: ${fm(o.total)}</b></div>
   <div class="acts"><select onchange="stO('${esc(o._k)}','${esc(o.id)}',this.value)">${STS.map(s=>`<option value="${s}" ${s===(o.status||'new')?'selected':''}>${tr(STL[s])}</option>`).join('')}</select><button class="b s r" onclick="delO('${esc(o._k)}','${esc(o.id)}')">${tr('Delete')}</button></div></div>`).join('')||`<p>${tr('No orders yet.')}</p>`;}
async function stO(k,id,s){try{await CUST.setStatus(k,id,s);const o=OR.find(x=>x.id===id&&x._k===k);if(o)o.status=s;drawO();toast(tr('Saved ✓'));}catch(e){toast(tr('Could not save online: {e}',{e:e.message}));}}
async function delO(k,id){if(!confirm(tr('Delete this order?')))return;try{await CUST.del(k,id);OR=OR.filter(x=>!(x.id===id&&x._k===k));drawO();}catch(e){toast(tr('Could not save online: {e}',{e:e.message}));}}
async function renderU(){$('#tab-u').innerHTML='<p>…</p>';await loadO();
  const rows=Object.keys(CU).map(k=>{const c=CU[k],os=Object.values(c.orders||{}),ok=os.filter(o=>o.status!=='cancelled'),last=os.map(o=>o.date).sort().pop();
    return {k,name:(c.profile||{}).name||'',loc:(c.profile||{}).location||'',created:(c.profile||{}).created||'',n:os.length,sum:ok.reduce((a,o)=>a+(+o.total||0),0),last};}).sort((a,b)=>(b.last||b.created)>(a.last||a.created)?1:-1);
  $('#tab-u').innerHTML=`${cloudHint()}<div class="savebar"><span><b>${rows.length}</b> ${tr('registered customers')}</span><button class="b s" onclick="renderU()">${tr('Refresh')}</button></div>
   <div class="tw"><table class="ot cu"><tr><th>${tr('Name')}</th><th>${tr('Phone number')}</th><th>${tr('Registered')}</th><th>${tr('Orders')}</th><th>${tr('Spent')}</th><th>${tr('Last order')}</th></tr>
   ${rows.map(r=>`<tr><td>${esc(r.name)}${r.loc?'<br><small>'+esc(r.loc)+'</small>':''}</td><td><a href="tel:+${esc(r.k)}">+${esc(r.k)}</a></td><td>${r.created?dtm(r.created):''}</td><td>${r.n}</td><td>${fm(r.sum)}</td><td>${r.last?dtm(r.last):'-'}</td></tr>`).join('')||`<tr><td colspan="6">${tr('No customers yet.')}</td></tr>`}</table></div>`;}
function qT(){const t=$('#q_t').value;$('#q_cw').hidden=t==='sale';$('#q_mw').hidden=t==='sale';}
const QN={sale:'Sale - % off products (automatic)',pct:'Promo code - % off the basket',fix:'Promo code - fixed ₼ off the basket'};
let QM=''; /* '' = main site, 'w' = topdan site */
const QK=()=>QM?'wdiscounts':'discounts',QPL=()=>QM?D().wholesale.products:D().products;
function renderQ(){const ds=D().settings[QK()]||[];
  $('#tab-q').innerHTML=`<div class="savebar"><span>Endirimlər hansı sayt üçündür?</span><select style="width:auto" onchange="QM=this.value;renderQ()"><option value="" ${QM?'':'selected'}>Əsas sayt</option><option value="w" ${QM?'selected':''}>Topdan müştərilər səhifəsi</option></select></div><form class="box" style="max-width:none" onsubmit="addQ(event)"><b>${tr('New discount')}</b><div class="two">
   <label>${tr('Name')}<input id="q_n" required></label><label>${tr('Type')}<select id="q_t" onchange="qT()">${Object.keys(QN).map(k=>`<option value="${k}">${tr(QN[k])}</option>`).join('')}</select></label>
   <label>${tr('Value (% or ₼)')}<input id="q_v" type="number" min="1" step="any" required></label>
   <label id="q_cw" hidden>${tr('Code (customer types it in the basket)')}<input id="q_c"></label><label id="q_mw" hidden>${tr('Minimum order ₼')}<input id="q_m" type="number" min="0" value="0"></label>
   <label>${tr('From (optional)')}<input id="q_f" type="date"></label><label>${tr('Until (optional)')}<input id="q_u" type="date"></label></div>
   <label>${tr('Products (empty = all products; hold Ctrl/Cmd to pick several)')}<select id="q_i" multiple size="6">${QPL().map(w=>`<option value="${w.id}">${esc(w.brand)} ${esc(w.model)}</option>`).join('')}</select></label>
   <button class="b">${tr('Add discount')}</button></form><p class="hint">${tr('Sales show the old price crossed out on the website. Promo codes are typed by the customer in the basket.')}</p>`+
  (ds.map(d=>`<div class="row" style="grid-template-columns:1fr auto auto"><div><b>${esc(d.name)}</b> <small>${tr(QN[d.type])} · ${d.type==='fix'?fm(d.value):d.value+'%'}${d.code?' · '+tr('Code')+': <b>'+esc(d.code)+'</b>':''}${+d.min?' · '+tr('Minimum order ₼')+' '+d.min:''}${d.from||d.to?' · '+esc(d.from||'')+' → '+esc(d.to||''):''} · ${(d.ids||[]).length?(d.ids.length+' '+tr('products')):tr('All products')}</small></div>
   <label style="margin:0"><input type="checkbox" ${d.on!==false?'checked':''} onchange="togQ(${d.id},this.checked)" style="width:auto;margin:0 6px 0 0">${tr('Active')}</label><button class="b s r" onclick="delQ(${d.id})">${tr('Delete')}</button></div>`).join('')||`<p>${tr('No discounts yet.')}</p>`);}
function addQ(e){e.preventDefault();const type=$('#q_t').value,v=+$('#q_v').value,code=$('#q_c').value.trim(),ds=D().settings[QK()]=D().settings[QK()]||[];
  if(type!=='fix'&&v>(type==='sale'?90:100)){alert(tr('Percent is too high.'));return;}
  if(type!=='sale'){if(!code){alert(tr('Enter a code.'));return;}if(ds.some(d=>d.type!=='sale'&&String(d.code).toLowerCase()===code.toLowerCase())){alert(tr('This code already exists.'));return;}}
  ds.push({id:Date.now(),name:$('#q_n').value.trim(),type,value:v,code:type==='sale'?'':code,min:type==='sale'?0:+$('#q_m').value||0,from:$('#q_f').value,to:$('#q_u').value,ids:[...$('#q_i').selectedOptions].map(o=>+o.value),on:true});
  DB.save();renderQ();toast(tr('Saved ✓'));}
function togQ(id,on){const d=D().settings[QK()].find(x=>x.id===id);if(d){d.on=on;DB.save();toast(tr('Saved ✓'));}}
function delQ(id){if(!confirm(tr('Delete this discount?')))return;D().settings[QK()]=D().settings[QK()].filter(x=>x.id!==id);DB.save();renderQ();}


/* ---------- Design: background video, product-page background, logo ---------- */
function dz(k,v){const z=D().settings.design=D().settings.design||{};if(v===''||v==null)delete z[k];else z[k]=v;}
async function dzUp(k,f,max){if(!f)return;try{dz(k,await readImg(f,max,.85));if(DB.save()){renderS();toast(tr('Photo saved ✓'));}}catch(e){alert(tr('Could not read this image.'));}}
function dzUrl(k){const u=prompt(tr('Image link (https://...) or file path in your repository (images/home/photo.jpg):'));if(!u)return;dz(k,u.trim());DB.save();renderS();toast(tr('Photo saved ✓'));}
function dzDel(k){dz(k,'');DB.save();renderS();toast(tr('Back to the default.'));}
function saveS(){const g=id=>$('#'+id).value.trim();
  dz('heroMode',g('s_mode')==='classic'?'classic':'video');dz('video',g('s_vid'));dz('bgYoutube',g('s_yt'));dz('overlay',g('s_ov'));dz('video2',g('s_v2'));dz('pbOverlay',g('s_pov'));
  DB.save();toast(tr('Saved ✓ Open the website to see the change.'));}
function renderS(){
  const Z=D().settings.design||{},pic=(k,def,w,h)=>{const u=Z[k]?imgSrc(Z[k]):(def?ROOT+def:'');return `<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:8px 0"><div style="width:${w}px;height:${h}px;border-radius:12px;overflow:hidden;background:#000;display:grid;place-items:center;color:#9a8089;border:1px solid #ecdde3">${u?`<img src="${esc(u)}" alt="" style="width:100%;height:100%;object-fit:contain">`:tr('No photo')}</div>
   <div class="acts"><label class="b s g" style="margin:0;cursor:pointer">${tr('Upload a photo')}<input type="file" accept="image/*" hidden onchange="dzUp('${k}',this.files[0],${k==='logo'?256:1600})"></label><button class="b s" type="button" onclick="dzUrl('${k}')">${tr('From a link / file path')}</button>${Z[k]?`<button class="b s r" type="button" onclick="dzDel('${k}')">${tr(def?'Use the default':'Remove')}</button>`:''}</div></div>`;};
  $('#tab-s').innerHTML=`<div class="savebar"><span>${tr('Change the videos, photos and look of the customer website here. Photos save instantly; texts and options save with the button.')}</span><span><a href="../index.html" target="_blank" style="color:#c2476b;font-weight:600;margin-right:10px">${tr('Preview website ↗')}</a><button class="b g" onclick="saveS()">${tr('Save design')}</button></span></div>
   <div class="card2"><h2>${tr('Home page background video')}</h2><p class="hint">${tr('The video plays muted and looping behind the home page. Put your video file in the videos folder of your website (GitHub: videos/store.mp4) - or write another file path / link below.')}</p>
   <div class="two"><label>${tr('Home page style')}<select id="s_mode"><option value="video" ${Z.heroMode!=='classic'?'selected':''}>${tr('Full-screen video background')}</option><option value="classic" ${Z.heroMode==='classic'?'selected':''}>${tr('Classic: text + photo slider')}</option></select></label>
   <label>${tr('Video file path or link (.mp4)')}<input id="s_vid" value="${esc(Z.video||'')}" placeholder="videos/store.mp4"></label>
   <label>${tr('Or a YouTube link as background (used instead of the file)')}<input id="s_yt" value="${esc(Z.bgYoutube||'')}" placeholder="https://youtu.be/..."></label>
   <label>${tr('Darkness over the video (0 to 90)')}<input id="s_ov" type="number" min="0" max="90" value="${esc(Z.overlay==null?45:Z.overlay)}"></label></div>
   <b>${tr('Photo shown while the video loads (poster)')}</b>${pic('poster','',200,112)}
   <label>${tr('Video for the "Inside our store" section (.mp4 path or link, optional - a YouTube link is set in the Data tab)')}<input id="s_v2" value="${esc(Z.video2||'')}" placeholder="videos/inside.mp4"></label></div>
   <div class="card2"><h2>${tr('Product page background')}</h2><p class="hint">${tr('This photo is the background of every product page. The product photo, name and details are shown on and under it.')}</p>
   ${pic('productBg','images/product-bg.png',110,196)}
   <label>${tr('Darkness over the background photo (0 to 85)')}<input id="s_pov" type="number" min="0" max="85" value="${esc(Z.pbOverlay==null?25:Z.pbOverlay)}" style="max-width:160px"></label></div>
   <div class="card2"><h2>${tr('Logo')}</h2><p class="hint">${tr('Small round logo in the top bar and the footer.')}</p>${pic('logo','images/logo.png',84,84)}</div>
   <p><button class="b g" onclick="saveS()">${tr('Save design')}</button></p>`;
}

/* ---------- Admin account: change the admin username and code ---------- */
function renderG(){
  $('#tab-g').innerHTML=`<form class="box" style="max-width:520px" onsubmit="saveG(event)"><h2>${tr('Admin account')}</h2>
   <p style="color:#7d6169;font-size:.9rem">${tr('Change the username and code used to log in to this admin panel.')}</p>
   <label>${tr('Current code')}<input id="g_c" type="password" required autocomplete="current-password"></label>
   <label>${tr('New username')}<input id="g_u" required minlength="3" autocomplete="username" value="${esc(sessionStorage.getItem('tk_admin_user')||'')}"></label>
   <label>${tr('New code (leave empty to keep the current one)')}<input id="g_n" type="password" minlength="6" autocomplete="new-password"></label>
   <label>${tr('Repeat the new code')}<input id="g_n2" type="password" minlength="6" autocomplete="new-password"></label>
   <p class="err" id="g_e"></p><button class="b" id="g_b">${tr('Save login details')}</button>
   <p style="color:#7d6169;font-size:.85rem">${tr('After saving, use the new details the next time you log in. If you ever forget the code, reset it in Firebase > Authentication > Users.')}</p></form>`;
}
async function saveG(e){e.preventDefault();const cur=$('#g_c').value,nu=$('#g_u').value.trim(),np=$('#g_n').value,np2=$('#g_n2').value,er=$('#g_e'),b=$('#g_b');er.textContent='';
  if(nu.length<3){er.textContent=tr('Username must be at least 3 characters.');return;}
  if(np&&np.length<6){er.textContent=tr('The new code must be at least 6 characters.');return;}
  if(np!==np2){er.textContent=tr('The two codes do not match.');return;}
  b.disabled=true;
  try{
    const cr=await adminCred();
    if(cloudAuth()){
      try{await DB.signIn(cur);}catch(x){throw new Error('WRONG');}
      if(np){const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key='+encodeURIComponent(CLOUD.apiKey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:DB.auth.id,password:np,returnSecureToken:true})});
        const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||'auth');DB._setAuth(j.idToken,j.refreshToken,+j.expiresIn);}
    }else if(ahash(cur)!==(cr.c||ahash(DEF_CODE)))throw new Error('WRONG');
    const loc={u:ahash(nu)};if(!cloudAuth())loc.c=np?ahash(np):(cr.c||ahash(DEF_CODE));
    D().settings=D().settings||{};D().settings.adminLogin={u:loc.u};
    localStorage.setItem('tk_admin_cred',JSON.stringify(loc));sessionStorage.setItem('tk_admin_user',nu);
    DB.save();toast(tr('Admin login updated ✓'));renderG();
  }catch(x){er.textContent=x.message==='WRONG'?tr('The current code is wrong.'):tr('Could not update: {e}',{e:x.message});}
  b.disabled=false;}


/* ================= TOPDAN MALLAR: goods that are shown ONLY on the topdan (wholesale) customers' pages ================= */
let wsq='';
const WSD=()=>D().wholesale;
const wsN=a=>a.name.az||a.name.en||a.key;
function renderWS(){
  const W=WSD(),H=W.home||{},list=W.products.filter(w=>(w.brand+' '+w.model).toLowerCase().includes(wsq.toLowerCase()));
  $('#tab-z').innerHTML=`<div class="savebar"><span>Burada yüklənən mallar <b>yalnız topdan müştərilər səhifəsində</b> görünür. Əsas saytda görünmür.</span><span><a href="../topdan/index.html" target="_blank" style="color:#c2476b;font-weight:600">Topdan səhifəni aç ↗</a></span></div>
   <div class="stats"><div class="stat"><b>${W.products.length}</b><span>Topdan məhsul</span></div><div class="stat"><b>${W.albums.length}</b><span>Topdan albom</span></div><div class="stat"><b>${W.products.filter(w=>w.stock>0&&w.stock<=5).length}</b><span>Az qalıb (5 və az)</span></div><div class="stat"><b>${W.products.filter(w=>w.stock<=0).length}</b><span>Stokda yoxdur</span></div></div>
   <div class="bar2"><input id="wsq" placeholder="Məhsul axtar" value="${esc(wsq)}"><button class="b g" onclick="wsEdit()">+ Topdan məhsul əlavə et</button></div>
   <p>Qiyməti və stoku dəyişin, avtomatik saxlanılır. Burada yazdığınız qiymət <b>topdan qiymətdir</b>.</p>
   ${list.map(w=>`<div class="row ${w.stock<=0?'out':w.stock<=5?'low':''}">${imgTag(w)}<div><b>${esc(w.brand)} ${esc(w.model)}</b><small>${esc((w.tags||[]).map(k=>{const a=W.albums.find(x=>x.key===k);return a?wsN(a):k;}).join(', '))}</small></div>
    <label>Topdan qiymət ₼<input type="number" min="0" step="any" value="${w.price}" onchange="wsUpd(${w.id},'price',this.value)"></label>
    <label>Stok<input type="number" min="0" step="1" value="${w.stock}" onchange="wsUpd(${w.id},'stock',this.value)"></label>
    <div class="acts"><button class="b s" onclick="wsEdit(${w.id})">Redaktə</button><button class="b s r" onclick="wsDel(${w.id})">Sil</button></div></div>`).join('')||'<p>Hələ topdan məhsul yoxdur. "+ Topdan məhsul əlavə et" düyməsini basın.</p>'}
   <div class="card2"><h2>Topdan albomlar</h2><p class="hint">Albomlar topdan səhifəsində məhsulları qruplaşdırır (məsələn: Premium modellər, İdman). Məhsulu əlavə edərkən albom seçilir.</p>
   <form class="box" style="max-width:none" onsubmit="wsAddA(event)"><b>Yeni albom</b><div class="two"><label>Ad<input id="wsa_n" required></label></div><button class="b">Albom əlavə et</button></form>
   ${W.albums.map(a=>`<div class="row" style="grid-template-columns:1fr"><div class="cov">${a.img?`<img src="${esc(imgSrc(a.img))}" alt="">`:'<img alt="" src="'+productImg({kind:'watch',color:'#fca5a5',ws:1})+'">'}
    <div style="flex:1"><b>${esc(wsN(a))}</b><small>${W.products.filter(w=>(w.tags||[]).includes(a.key)).length} məhsul</small>
    <div class="acts" style="margin-top:6px"><label class="b s g" style="margin:0;cursor:pointer">Üz qabığı yüklə<input type="file" accept="image/*" hidden onchange="wsCover('${esc(a.key)}',this.files[0])"></label>
    <button class="b s" onclick="wsCoverUrl('${esc(a.key)}')">Linkdən</button>${a.img?`<button class="b s r" onclick="wsCoverDel('${esc(a.key)}')">Üz qabığını sil</button>`:''}
    <button class="b s r" onclick="wsDelA('${esc(a.key)}')">Albomu sil</button></div></div></div></div>`).join('')}</div>
   <div class="card2"><h2>Topdan ana səhifəsi</h2><p class="hint">Boş buraxsanız, hazır mətn işlədilir. Videonun və fonun dəyişdirilməsi "Dizayn" bölməsindədir (əsas saytla eynidir).</p>
   <label>Başlıq<input id="wsh_t" value="${esc(H.title||'')}" placeholder="Topdan müştərilər üçün xüsusi qiymətlər"></label>
   <label>Başlığın altındakı mətn<textarea id="wsh_s" rows="2">${esc(H.sub||'')}</textarea></label>
   <b>Ana səhifədə göstəriləcək saatlar</b> <span class="hint">(heç nə seçməsəniz, ən son əlavə olunanlar göstərilir)</span>
   <div class="pick">${W.products.map(w=>`<label><input type="checkbox" data-wfid="${w.id}" ${(H.featuredIds||[]).includes(w.id)?'checked':''}>${esc(w.brand)} ${esc(w.model)}</label>`).join('')||'<span>Hələ məhsul yoxdur.</span>'}</div>
   <p><button class="b g" onclick="wsSaveHome()">Saxla</button></p></div>
   <div class="card2"><h2>Topdan səhifəsinə giriş parolu</h2><p class="hint">Müştəri "Topdan müştərilər üçün" düyməsini basanda bu parol soruşulur. ${D().settings.wholesaleKey?'Hazırda <b>sizin təyin etdiyiniz</b> parol işləyir.':'Hazırda <b>ilkin parol</b> işləyir.'} Parolu bura yazın, saxlayın və müştərilərə özünüz bildirin.</p>
   <form onsubmit="wsSavePw(event)"><label>Yeni parol<input id="wsp" type="text" minlength="4" autocomplete="off" required></label><p><button class="b g">Parolu dəyiş</button>${D().settings.wholesaleKey?' <button class="b s r" type="button" onclick="wsResetPw()">İlkin parola qayıt</button>':''}</p></form>
   <p class="hint">Qeyd: bu giriş parolu brauzerdə yoxlanılır. Təsadüfi ziyarətçilərin girişinin qarşısını alır, lakin tam təhlükəsizlik mühafizəsi deyil.</p></div>`;
  const qi=$('#wsq');qi.oninput=()=>{wsq=qi.value;renderWS();const n=$('#wsq');n.focus();n.setSelectionRange(wsq.length,wsq.length);};
}
function wsUpd(id,f,v){const w=WSD().products.find(x=>x.id===id);if(!w)return;w[f]=Math.max(0,+v||0);DB.save();}
function wsDel(id){const w=WSD().products.find(x=>x.id===id);if(w&&confirm('Silinsin: '+w.brand+' '+w.model+'?')){WSD().products=WSD().products.filter(x=>x.id!==id);DB.save();renderWS();}}
function wsEdit(id){
  const W=WSD(),w=id?W.products.find(x=>x.id===id):{brand:'',model:'',price:100,stock:100,kind:'watch',color:'#e11d2e',tags:[],img:'',desc:'',size:'',shade:'',origin:''};
  $('#wf').innerHTML=`<h2>${id?'Topdan məhsulu redaktə et':'Topdan məhsul əlavə et'}</h2>
   <div class="two"><label>Brend<input name="brand" required value="${esc(w.brand)}"></label><label>Model<input name="model" required value="${esc(w.model)}"></label>
   <label>Topdan qiymət ₼<input name="price" type="number" min="0" step="any" required value="${w.price}"></label><label>Stok<input name="stock" type="number" min="0" required value="${w.stock}"></label>
   <label>Forma (çəkilmiş şəkil üçün)<select name="kind">${['watch','chrono','dress','smart','band'].map(m=>`<option value="${m}" ${w.kind===m?'selected':''}>${tr(m)}</option>`).join('')}</select></label>
   <label>Rəng<input type="color" name="color" value="${w.color||'#e11d2e'}"></label></div>
   <label>Şəkil linki (və ya faylı images/topdan/ qovluğuna product-ID.jpg kimi qoyun)<input name="img" value="${w.img&&!w.img.startsWith('data:')?esc(w.img):''}" placeholder="https://..."></label>
   <label>Və ya şəkil yüklə<input type="file" id="wsfile" accept="image/*"></label>
   <label>Təsvir (istəyə bağlı)<textarea name="desc" rows="2">${esc(w.desc)}</textarea></label>
   <div class="two"><label>Ölçü<input name="size" value="${esc(w.size)}" placeholder="40 mm"></label><label>Qayış / rəng<input name="shade" value="${esc(w.shade)}" placeholder="Qara dəri"></label><label>Mənşə<input name="origin" value="${esc(w.origin)}" placeholder="Yaponiya"></label></div>
   <div class="chk"><b>Topdan albomlar</b><br>${W.albums.map(a=>`<label><input type="checkbox" name="tag" value="${esc(a.key)}" ${(w.tags||[]).includes(a.key)?'checked':''}> ${esc(wsN(a))}</label>`).join('')||'<small>Əvvəlcə "Topdan albomlar" bölməsində albom yaradın.</small>'}</div>
   <p class="acts"><button class="b" value="save">Saxla</button><button class="b s r" value="cancel" formnovalidate>Ləğv et</button></p>`;
  let photo=w.img&&w.img.startsWith('data:')?w.img:'',busy=null;
  $('#wsfile').onchange=e=>{const f=e.target.files[0];if(!f)return;busy=readImg(f,800,.82).then(d=>{photo=d;}).catch(()=>alert('Bu şəkli oxumaq mümkün olmadı.'));};
  $('#wf').onsubmit=async e=>{
    if(e.submitter&&e.submitter.value!=='save')return;
    if(busy)await busy;
    const f=new FormData($('#wf')),o=id?w:{id:Math.max(0,...WSD().products.map(x=>x.id))+1,ws:1};
    Object.assign(o,{brand:f.get('brand').trim(),model:f.get('model').trim(),price:+f.get('price'),stock:+f.get('stock'),kind:f.get('kind'),color:f.get('color'),
      img:f.get('img').trim()||photo,desc:f.get('desc').trim(),size:f.get('size').trim(),shade:f.get('shade').trim(),origin:f.get('origin').trim(),tags:f.getAll('tag'),ws:1});
    if(!id)WSD().products.push(o);DB.save();renderWS();};
  $('#dlg').showModal();
}
function wsAddA(e){e.preventDefault();const nm=$('#wsa_n').value.trim();if(!nm)return;
  let key=nm.toLowerCase().replace(/ə/g,'e').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ç/g,'c').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'albom';
  while(WSD().albums.some(a=>a.key===key))key+='-2';
  WSD().albums.push({key,name:{az:nm,en:nm,ru:nm,tr:nm}});DB.save();renderWS();toast('Albom əlavə olundu ✓');}
function wsDelA(k){if(!confirm('Bu albom silinsin? Məhsullar qalır.'))return;
  WSD().albums=WSD().albums.filter(a=>a.key!==k);WSD().products.forEach(w=>w.tags=(w.tags||[]).filter(x=>x!==k));DB.save();renderWS();}
async function wsCover(k,f){if(!f)return;try{WSD().albums.find(x=>x.key===k).img=await readImg(f,900,.82);if(DB.save()){renderWS();toast('Üz qabığı saxlanıldı ✓');}}catch(e){alert('Bu şəkli oxumaq mümkün olmadı.');}}
function wsCoverUrl(k){const u=prompt('Şəkil linki (https://...) və ya repozitoriyadakı fayl yolu (images/topdan/cover.jpg):');if(!u)return;WSD().albums.find(x=>x.key===k).img=u.trim();DB.save();renderWS();toast('Üz qabığı saxlanıldı ✓');}
function wsCoverDel(k){delete WSD().albums.find(x=>x.key===k).img;DB.save();renderWS();}
function wsSaveHome(){WSD().home={title:$('#wsh_t').value.trim(),sub:$('#wsh_s').value.trim(),featuredIds:[...document.querySelectorAll('#tab-z [data-wfid]:checked')].map(c=>+c.dataset.wfid)};DB.save();toast('Saxlanıldı ✓');}
function wsSavePw(e){e.preventDefault();const v=$('#wsp').value.trim();if(v.length<4){alert('Parol ən azı 4 simvol olmalıdır.');return;}D().settings.wholesaleKey=tkHash(v);DB.save();toast('Parol dəyişdirildi ✓');renderWS();}
function wsResetPw(){if(!confirm('İlkin parola qayıdılsın?'))return;delete D().settings.wholesaleKey;DB.save();toast('İlkin parola qayıdıldı ✓');renderWS();}
