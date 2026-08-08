const id=(new URLSearchParams(location.search).get('id')||'').trim().toUpperCase();
if(/^BBE-LM-00[1-7]$/.test(id)){
  location.replace('operator.html?id='+encodeURIComponent(id));
}else{
  const box=document.getElementById('viewer');
  const input=document.getElementById('search');
  const results=document.getElementById('results');
  document.getElementById('searchPanel').style.display='block';
  fetch('data/operators.json',{cache:'no-store'}).then(r=>r.json()).then(ops=>{
    box.innerHTML='<div class="message">Search by BBE ID, name or certificate number.</div>';
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase();
      if(q.length<2){results.innerHTML='';return;}
      const list=ops.filter(o=>(o.id+' '+o.name+' '+o.certificateNo).toLowerCase().includes(q)).slice(0,8);
      results.innerHTML=list.map(o=>'<button class="result" data-id="'+o.id+'"><b>'+o.name+'</b><small>'+o.id+' · '+o.certificateNo+'</small></button>').join('')||'<div class="hint">No matching record.</div>';
      document.querySelectorAll('.result').forEach(b=>b.onclick=()=>location.href='operator.html?id='+encodeURIComponent(b.dataset.id));
    });
  });
}
