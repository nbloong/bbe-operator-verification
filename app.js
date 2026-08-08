const state={operators:[]};
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');

function fmt(iso){if(!iso)return'';const d=new Date(iso+'T00:00:00');return new Intl.DateTimeFormat('en-SG',{day:'2-digit',month:'short',year:'numeric'}).format(d)}
function statusOf(o){
  const manual=String(o.manualStatus||'').trim().toUpperCase();
  if(['SUSPENDED','NOT AUTHORISED','NOT AUTHORIZED','INACTIVE','VOID'].includes(manual))return {text:manual,cls:'bad',cleared:false};
  const today=new Date();today.setHours(0,0,0,0);const exp=new Date(o.expiryDate+'T00:00:00');
  const days=Math.ceil((exp-today)/86400000);
  if(days<0)return{text:'EXPIRED — DO NOT OPERATE',cls:'bad',cleared:false};
  if(days<=90)return{text:'EXPIRING SOON',cls:'soon',cleared:true};
  return{text:'CLEARED TO WORK',cls:'valid',cleared:true};
}
function directUrl(id){const u=new URL(location.href);u.search='';u.searchParams.set('id',id);return u.toString()}
function card(o){
  const s=statusOf(o);
  return `<article class="verification-card">
    <div class="status-band ${s.cls}">${esc(s.text)}</div>
    <div class="card-head"><div class="kicker">OVERHEAD CRANE (LM) OPERATOR VERIFICATION</div><h2>${esc(o.name)}</h2><div class="meta">${esc(o.id)} · ${esc(o.site)}</div></div>
    <img class="training-card" src="${esc(o.cardImage)}" alt="Training card for ${esc(o.name)}" onerror="this.outerHTML='<div class=&quot;image-missing&quot;>Training card image pending upload.</div>'">
    <div class="details">
      <div class="row"><div class="label">Role</div><div class="value">${esc(o.role)}</div></div>
      <div class="row"><div class="label">Training</div><div class="value">${esc(o.training)}</div></div>
      <div class="row"><div class="label">Certificate</div><div class="value">${esc(o.certificateNo)}</div></div>
      <div class="row"><div class="label">Training date</div><div class="value">${esc(fmt(o.trainingDate))}</div></div>
      <div class="row"><div class="label">Valid until</div><div class="value">${esc(fmt(o.expiryDate))}</div></div>
    </div>
    <div class="actions"><button class="btn" onclick="copyDirect('${esc(o.id)}')">Copy Direct Link</button><button class="btn secondary" onclick="showSearch()">Search Another</button></div>
  </article>`
}
function showOperator(id){const o=state.operators.find(x=>x.id.toUpperCase()===String(id).toUpperCase());$('#viewer').innerHTML=o?card(o):'<div class="message">No public operator record found.</div>';if(o)$('#searchPanel').style.display='none'}
function showSearch(){history.replaceState({},'',location.pathname);$('#searchPanel').style.display='block';$('#viewer').innerHTML='';$('#search').value='';$('#results').innerHTML='';$('#search').focus()}
function renderSearch(){const q=$('#search').value.trim().toLowerCase();if(q.length<2){$('#results').innerHTML='';return}const list=state.operators.filter(o=>[o.id,o.name,o.certificateNo].join(' ').toLowerCase().includes(q)).slice(0,8);$('#results').innerHTML=list.length?list.map(o=>`<button class="result" data-id="${esc(o.id)}"><b>${esc(o.name)}</b><small>${esc(o.id)} · ${esc(o.certificateNo)} · ${esc(statusOf(o).text)}</small></button>`).join(''):'<div class="hint">No matching record.</div>';document.querySelectorAll('.result').forEach(b=>b.addEventListener('click',()=>{history.replaceState({},'',directUrl(b.dataset.id));showOperator(b.dataset.id)}))}
async function copyDirect(id){const url=directUrl(id);try{await navigator.clipboard.writeText(url);alert('Direct verification link copied.')}catch(e){prompt('Copy this direct link:',url)}}
window.copyDirect=copyDirect;window.showSearch=showSearch;
fetch('data/operators.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Unable to load operator register');return r.json()}).then(data=>{state.operators=data;const id=new URLSearchParams(location.search).get('id');if(id)showOperator(id);else $('#searchPanel').style.display='block'}).catch(err=>{$('#viewer').innerHTML='<div class="message">'+esc(err.message)+'</div>';$('#searchPanel').style.display='block'});
$('#search').addEventListener('input',renderSearch);