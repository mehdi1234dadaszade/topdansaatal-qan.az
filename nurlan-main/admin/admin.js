/* NOTE: this login runs in the browser only. It keeps casual visitors out but is NOT real security. */
const USER='mehdi', CODE='1234raet';
const $=(s,r=document)=>r.querySelector(s);
function toast(m){const e=$('#toast');e.textContent=m;e.className='show';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2600);}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function login(e){e.preventDefault();
  if($('#u').value.trim()!==USER||$('#p').value!==CODE){$('#err').textContent=tr('Wrong username or code.');return false;}
  if(DB.cloud()&&CLOUD.apiKey&&CLOUD.adminEmail){
    try{await DB.signIn(CODE);}catch(x){$('#err').textContent=tr('Online login failed: {e}',{e:x.message});return false;}
  }
  sessionStorage.setItem('tk_admin','1');start();return false;}
window.onCloud=(ok,m)=>{const b=$('#cl');if(ok){toast(tr('Saved online ✓'));}else{toast(tr('Could not save online: {e}',{e:m||''}));}if(b)b.dataset.s=ok?'1':'0';};
function logout(){sessionStorage.removeItem('tk_admin');location.reload();}
async function start(){
  trStatic();$('#login').hidden=true;$('#app').hidden=false;await DB.load(true);render();if(DB._cloudNew&&DB.cloud()){DB._cloudNew=false;DB.save();}
  document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
    ['w','o','u','q','h','a','c','k','x','d'].forEach(k=>$('#tab-'+k).hidden=k!==b.dataset.t);if(b.dataset.t==='o')renderO();if(b.dataset.t==='u')renderU();});
}
trStatic();
if(sessionStorage.getItem('tk_admin'))start();
const D=()=>DB.data;
const aN=a=>a.name[AL]||a.name.en;
function render(){renderQ();renderW();renderH();renderC();renderK();renderX();renderA();renderD();}
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
  const w=id?D().products.find(x=>x.id===id):{brand:'',model:'',price:100,stock:100,kind:'bottle',color:'#c2476b',tags:[],img:'',desc:''};
  $('#wf').innerHTML=`<h2>${id?tr('Edit product'):tr('Add product')}</h2>
   <div class="two"><label>${tr('Brand')}<input name="brand" required value="${esc(w.brand)}"></label><label>${tr('Model')}<input name="model" required value="${esc(w.model)}"></label>
   <label>${tr('Price ₼')}<input name="price" type="number" min="0" step="any" required value="${w.price}"></label><label>${tr('Stock')}<input name="stock" type="number" min="0" required value="${w.stock}"></label>
   <label>${tr('Shape (for the drawn picture)')}<select name="kind">${['lipstick','tube','bottle','jar','perfume','palette','nail'].map(m=>`<option value="${m}" ${w.kind===m?'selected':''}>${tr(m)}</option>`).join('')}</select></label>
   <label>${tr('Color')}<input type="color" name="color" value="${w.color||'#c2476b'}"></label></div>
   <label>${tr('Image URL (or put the file in images/products/ as product-ID.jpg)')}<input name="img" value="${w.img&&!w.img.startsWith('data:')?esc(w.img):''}" placeholder="https://..."></label>
   <label>${tr('Or upload a photo')}<input type="file" id="file" accept="image/*"></label>
   <label>${tr('Description (optional, shown in every language)')}<textarea name="desc" rows="2">${esc(w.desc)}</textarea></label>
   <div class="two"><label>${tr('Size')}<input name="size" value="${esc(w.size)}" placeholder="100 ml"></label><label>${tr('Shade')}<input name="shade" value="${esc(w.shade)}" placeholder="Rose"></label><label>${tr('Origin')}<input name="origin" value="${esc(w.origin)}" placeholder="France"></label></div>
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
   <label>${tr('Name (English)')}<input id="a_en" required></label><label>${tr('Name (Azərbaycan dili)')}<input id="a_az" required></label>
   <label>${tr('Name (Русский)')}<input id="a_ru"></label><label>${tr('Name (Türkçe)')}<input id="a_tr"></label></div><button class="b">${tr('Add album')}</button></form>
   <p>${tr('Each album can have its own <b>cover photo</b> (shown on the home page and the Albums page). Without one, the first product photo is used.')}</p>`+
   D().albums.map(a=>`<div class="row" style="grid-template-columns:1fr"><div class="cov">${a.img?`<img src="${esc(imgSrc(a.img))}" alt="">`:'<img alt="" src="'+productImg({kind:'jar',color:'#f3b6c8'})+'">'}
   <div style="flex:1"><b>${esc(a.name.en)}</b> · ${esc(a.name.az)} · ${esc(a.name.ru||'')} · ${esc(a.name.tr||'')}
   <small>${tr('{n} products · key: {key}',{n:D().products.filter(w=>(w.tags||[]).includes(a.key)).length,key:esc(a.key)})}</small>
   <div class="acts" style="margin-top:6px"><label class="b s g" style="margin:0;cursor:pointer">${tr('Upload cover')}<input type="file" accept="image/*" hidden onchange="albCover('${esc(a.key)}',this.files[0])"></label>
   <button class="b s" onclick="albCoverUrl('${esc(a.key)}')">${tr('Cover from link')}</button>${a.img?`<button class="b s r" onclick="albCoverDel('${esc(a.key)}')">${tr('Remove cover')}</button>`:''}
   <button class="b s r" onclick="delA('${esc(a.key)}')">${tr('Delete album')}</button></div></div></div></div>`).join('');
}
async function albCover(k,f){if(!f)return;try{const a=D().albums.find(x=>x.key===k);a.img=await readImg(f,900,.82);if(DB.save()){renderA();toast(tr('Cover saved ✓'));}}catch(e){alert(tr('Could not read this image.'));}}
function albCoverUrl(k){const u=prompt(tr('Image link (https://...) or file path in your repository (images/home/cover.jpg):'));if(!u)return;D().albums.find(x=>x.key===k).img=u.trim();DB.save();renderA();toast(tr('Cover saved ✓'));}
function albCoverDel(k){delete D().albums.find(x=>x.key===k).img;DB.save();renderA();}
function addA(e){e.preventDefault();let key=$('#a_en').value.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')||'album';
  while(D().albums.some(a=>a.key===key))key+='-2';
  D().albums.push({key,name:{en:$('#a_en').value.trim(),az:$('#a_az').value.trim(),ru:$('#a_ru').value.trim()||$('#a_en').value.trim(),tr:$('#a_tr').value.trim()||$('#a_en').value.trim()}});DB.save();render();}
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
function imp(f){if(!f)return;f.text().then(s=>{try{const d=JSON.parse(s);if(!d.albums||!d.products)throw 0;DB.data=d;DB.save();render();$('#msg').textContent=tr('Imported.');}catch(e){alert(tr('This is not a valid store.json file.'));}});}
function reset(){if(confirm(tr('Remove all your changes and go back to the sample data?'))){DB.data={albums:SEED_ALBUMS,products:makeProducts(),settings:{}};DB.save();render();}}

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

const THEME=[['gold','Main color (buttons, prices)'],['gold2','Soft color (light accents)'],['deep','Dark color (header, footer)'],['deep2','Second dark color (brands bar)'],['hero','Home page glow'],['bg','Page background'],['ink','Text color']];
const DEF={gold:'#c2476b',gold2:'#f6bccd',deep:'#3a1530',deep2:'#5a2248',hero:'#8a2f63',bg:'#fdf6f7',ink:'#2a1620'};
const PRE={'Rose & plum':DEF,'Ocean':{gold:'#1f7a8c',gold2:'#bfdbf7',deep:'#0b2a3a',deep2:'#12435a',hero:'#1f6f8b',bg:'#f3f8fb',ink:'#112530'},
 'Emerald':{gold:'#2e8b6a',gold2:'#bfe8d6',deep:'#0f2f26',deep2:'#1b4d3e',hero:'#2a7a5f',bg:'#f3faf6',ink:'#14261f'},
 'Black & gold':{gold:'#b8923f',gold2:'#e6c777',deep:'#111111',deep2:'#2a2a2a',hero:'#3d3420',bg:'#faf8f3',ink:'#1a1a1a'}};
function renderC(){
  const th=Object.assign({},DEF,D().settings.theme||{});
  $('#tab-c').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Website colors')}</h2><p>${tr('Pick a ready palette or choose each color yourself.')}</p>
   <p>${Object.keys(PRE).map(n=>`<button class="b s" type="button" onclick="preset('${n}')">${tr(n)}</button> `).join('')}</p>
   <div class="two">${THEME.map(c=>`<label>${tr(c[1])}<input type="color" id="c_${c[0]}" value="${th[c[0]]}" style="height:42px;padding:2px"></label>`).join('')}</div>
   <p><button class="b g" onclick="saveC()">${tr('Save colors')}</button> <button class="b s r" onclick="delete D().settings.theme;DB.save();renderC();toast(tr('Back to default colors.'))">${tr('Reset colors')}</button></p></div>`;
}
function preset(n){THEME.forEach(c=>$('#c_'+c[0]).value=PRE[n][c[0]]);}
function saveC(){const o={};THEME.forEach(c=>o[c[0]]=$('#c_'+c[0]).value);D().settings.theme=o;DB.save();toast(tr('Saved ✓ Open the website to see the colors.'));}
function renderK(){
  const s=D().settings,C=s.contact||{};
  const F=[['name','Store name',s.name,'TREND KOSMETİKA'],['phone','Phone number',C.phone,'+994 51 384 55 80'],['address','Address',C.address,'Yeni şirniyyat, sıra 5-6, mağaza 10'],
   ['maps','Google Maps link',C.maps,'https://maps.app.goo.gl/...'],['map','Map location (coordinates like 40.332061,49.780442, or a place name)',C.map,'40.332061,49.780442'],
   ['instagram','Instagram link',C.instagram,'https://www.instagram.com/...'],['tiktok','TikTok link',C.tiktok,'https://www.tiktok.com/@...']];
  $('#tab-k').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Contact information')}</h2><p>${tr('Leave a field empty to keep the current default.')}</p>
   ${F.map(f=>`<label>${tr(f[1])}<input id="k_${f[0]}" value="${esc(f[2]||'')}" placeholder="${esc(f[3])}"></label>`).join('')}
   <p><button class="b g" onclick="saveK()">${tr('Save contact information')}</button></p></div>`;
}
function saveK(){const g=id=>$('#k_'+id).value.trim();D().settings.name=g('name');
  D().settings.contact={phone:g('phone'),address:g('address'),maps:g('maps'),map:g('map'),instagram:g('instagram'),tiktok:g('tiktok')};DB.save();toast(tr('Saved ✓ Open the website to see the change.'));}
function renderX(){
  const ov=D().settings.texts||{},LG=LANGS;
  $('#tab-x').innerHTML=`<div class="box" style="max-width:none"><h2>${tr('Words on the website')}</h2>
   <p>${tr('Change any word or sentence in each language. The grey text is the current one. Leave a box empty to keep it. Product names and album names are changed in their own tabs.')}</p>
   <input id="x_q" placeholder="${esc(tr('Search a word'))}"><div id="x_list">${Object.keys(T.en).map(k=>`<div class="row" style="grid-template-columns:1fr" data-s="${esc((T.en[k]+' '+k).toLowerCase())}"><b>${esc(T.en[k])}</b>
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
  $('#olist').innerHTML=l.map(o=>`<div class="oc st-b-${esc(o.status||'new')}"><div class="oh"><div><b>${esc(o.name)}</b> · <a href="tel:+${esc(o.phone)}">+${esc(o.phone)}</a></div><div>${dtm(o.date)} · #${esc(String(o.id).toUpperCase())}</div></div>
   <table class="ot">${(o.items||[]).map(i=>`<tr><td>${esc(i.brand)} ${esc(i.model)}</td><td>× ${i.q}</td><td>${fm(i.unit*i.q)}</td></tr>`).join('')}</table>
   <div class="otot">${o.sale>0?`<span>${tr('Sale savings')}: -${fm(o.sale)}</span>`:''}${o.promo>0?`<span>${tr('Promo code')} ${esc(o.code)}: -${fm(o.promo)}</span>`:''}<b>${tr('Total')}: ${fm(o.total)}</b></div>
   <div class="acts"><select onchange="stO('${esc(o._k)}','${esc(o.id)}',this.value)">${STS.map(s=>`<option value="${s}" ${s===(o.status||'new')?'selected':''}>${tr(STL[s])}</option>`).join('')}</select><button class="b s r" onclick="delO('${esc(o._k)}','${esc(o.id)}')">${tr('Delete')}</button></div></div>`).join('')||`<p>${tr('No orders yet.')}</p>`;}
async function stO(k,id,s){try{await CUST.setStatus(k,id,s);const o=OR.find(x=>x.id===id&&x._k===k);if(o)o.status=s;drawO();toast(tr('Saved ✓'));}catch(e){toast(tr('Could not save online: {e}',{e:e.message}));}}
async function delO(k,id){if(!confirm(tr('Delete this order?')))return;try{await CUST.del(k,id);OR=OR.filter(x=>!(x.id===id&&x._k===k));drawO();}catch(e){toast(tr('Could not save online: {e}',{e:e.message}));}}
async function renderU(){$('#tab-u').innerHTML='<p>…</p>';await loadO();
  const rows=Object.keys(CU).map(k=>{const c=CU[k],os=Object.values(c.orders||{}),ok=os.filter(o=>o.status!=='cancelled'),last=os.map(o=>o.date).sort().pop();
    return {k,name:(c.profile||{}).name||'',created:(c.profile||{}).created||'',n:os.length,sum:ok.reduce((a,o)=>a+(+o.total||0),0),last};}).sort((a,b)=>(b.last||b.created)>(a.last||a.created)?1:-1);
  $('#tab-u').innerHTML=`${cloudHint()}<div class="savebar"><span><b>${rows.length}</b> ${tr('registered customers')}</span><button class="b s" onclick="renderU()">${tr('Refresh')}</button></div>
   <div class="tw"><table class="ot cu"><tr><th>${tr('Name')}</th><th>${tr('Phone number')}</th><th>${tr('Registered')}</th><th>${tr('Orders')}</th><th>${tr('Spent')}</th><th>${tr('Last order')}</th></tr>
   ${rows.map(r=>`<tr><td>${esc(r.name)}</td><td><a href="tel:+${esc(r.k)}">+${esc(r.k)}</a></td><td>${r.created?dtm(r.created):''}</td><td>${r.n}</td><td>${fm(r.sum)}</td><td>${r.last?dtm(r.last):'-'}</td></tr>`).join('')||`<tr><td colspan="6">${tr('No customers yet.')}</td></tr>`}</table></div>`;}
function qT(){const t=$('#q_t').value;$('#q_cw').hidden=t==='sale';$('#q_mw').hidden=t==='sale';}
const QN={sale:'Sale - % off products (automatic)',pct:'Promo code - % off the basket',fix:'Promo code - fixed ₼ off the basket'};
function renderQ(){const ds=D().settings.discounts||[];
  $('#tab-q').innerHTML=`<form class="box" style="max-width:none" onsubmit="addQ(event)"><b>${tr('New discount')}</b><div class="two">
   <label>${tr('Name')}<input id="q_n" required></label><label>${tr('Type')}<select id="q_t" onchange="qT()">${Object.keys(QN).map(k=>`<option value="${k}">${tr(QN[k])}</option>`).join('')}</select></label>
   <label>${tr('Value (% or ₼)')}<input id="q_v" type="number" min="1" step="any" required></label>
   <label id="q_cw" hidden>${tr('Code (customer types it in the basket)')}<input id="q_c"></label><label id="q_mw" hidden>${tr('Minimum order ₼')}<input id="q_m" type="number" min="0" value="0"></label>
   <label>${tr('From (optional)')}<input id="q_f" type="date"></label><label>${tr('Until (optional)')}<input id="q_u" type="date"></label></div>
   <label>${tr('Products (empty = all products; hold Ctrl/Cmd to pick several)')}<select id="q_i" multiple size="6">${D().products.map(w=>`<option value="${w.id}">${esc(w.brand)} ${esc(w.model)}</option>`).join('')}</select></label>
   <button class="b">${tr('Add discount')}</button></form><p class="hint">${tr('Sales show the old price crossed out on the website. Promo codes are typed by the customer in the basket.')}</p>`+
  (ds.map(d=>`<div class="row" style="grid-template-columns:1fr auto auto"><div><b>${esc(d.name)}</b> <small>${tr(QN[d.type])} · ${d.type==='fix'?fm(d.value):d.value+'%'}${d.code?' · '+tr('Code')+': <b>'+esc(d.code)+'</b>':''}${+d.min?' · '+tr('Minimum order ₼')+' '+d.min:''}${d.from||d.to?' · '+esc(d.from||'')+' → '+esc(d.to||''):''} · ${(d.ids||[]).length?(d.ids.length+' '+tr('products')):tr('All products')}</small></div>
   <label style="margin:0"><input type="checkbox" ${d.on!==false?'checked':''} onchange="togQ(${d.id},this.checked)" style="width:auto;margin:0 6px 0 0">${tr('Active')}</label><button class="b s r" onclick="delQ(${d.id})">${tr('Delete')}</button></div>`).join('')||`<p>${tr('No discounts yet.')}</p>`);}
function addQ(e){e.preventDefault();const type=$('#q_t').value,v=+$('#q_v').value,code=$('#q_c').value.trim(),ds=D().settings.discounts=D().settings.discounts||[];
  if(type!=='fix'&&v>(type==='sale'?90:100)){alert(tr('Percent is too high.'));return;}
  if(type!=='sale'){if(!code){alert(tr('Enter a code.'));return;}if(ds.some(d=>d.type!=='sale'&&String(d.code).toLowerCase()===code.toLowerCase())){alert(tr('This code already exists.'));return;}}
  ds.push({id:Date.now(),name:$('#q_n').value.trim(),type,value:v,code:type==='sale'?'':code,min:type==='sale'?0:+$('#q_m').value||0,from:$('#q_f').value,to:$('#q_u').value,ids:[...$('#q_i').selectedOptions].map(o=>+o.value),on:true});
  DB.save();renderQ();toast(tr('Saved ✓'));}
function togQ(id,on){const d=D().settings.discounts.find(x=>x.id===id);if(d){d.on=on;DB.save();toast(tr('Saved ✓'));}}
function delQ(id){if(!confirm(tr('Delete this discount?')))return;D().settings.discounts=D().settings.discounts.filter(x=>x.id!==id);DB.save();renderQ();}
