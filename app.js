/* ---------------- state + helpers ---------------- */
const S={q:"",topics:new Set(),methods:new Set(),years:new Set(),cos:new Set(),journal:"",oa:false,group:false,sort:"new"};
const $=id=>document.getElementById(id);
const MAROON="#8c1933", GOLD="#c2953b", NAVY="#00102e", GRAY="#8b9199";

function go(p){
 document.querySelectorAll('.page').forEach(s=>s.classList.toggle('on',s.id===p));
 document.querySelectorAll('nav.main button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('nav.main button').forEach(b=>b.onclick=()=>go(b.dataset.p));

function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1500);}
function bold(a){return a.replace(/Vranka, M\. A\./g,'<b>Vranka, M. A.</b>').replace(/Vranka, M\./g,'<b>Vranka, M.</b>');}
function apa(p){return p.a.replace(/…/g,'').replace(/\s+/g,' ').trim()+" ("+p.y+"). "+p.t2+". "+p.j+"."+(p.doi?" https://doi.org/"+p.doi:"");}

/* ---------------- modals ---------------- */
function closeOv(id){$(id).classList.remove('on');}
document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('on')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ov.on').forEach(o=>o.classList.remove('on'))});
function openCV(){$('cvFrame').src="CV_Vranka.pdf";$('ovCV').classList.add('on');}

/* ---------------- publication list ---------------- */
function card(p){
 const tags=p.t.map(x=>'<span class="tag t">'+TOPICS[x]+'</span>').join('')
   +p.m.map(x=>'<span class="tag m">'+METHODS[x]+'</span>').join('');
 const star=p.hl?'<span class="tag star">★ Featured venue</span>':'';
 const oa=p.oa?'<span class="tag oa">Open access</span>':'';
 const cb=(p.c!=null)?'<span class="cbadge">'+p.c+' cite'+(p.c===1?'':'s')+'</span>':'';
 const car=p.ab?'<span class="caret">▶</span>':'';
 const doi=p.doi?'<a href="https://doi.org/'+p.doi+'" target="_blank" rel="noopener">DOI ↗</a>':'';
 const sch='<a href="https://scholar.google.com/scholar?q='+encodeURIComponent(p.t2)+'" target="_blank" rel="noopener">Scholar ↗</a>';
 return '<div class="pub'+(p.hl?' hl':'')+'" data-id="'+p.id+'">'
  +'<div class="pub-top"><span class="pub-y">'+p.y+'</span>'+cb+'</div>'
  +'<h3 onclick="toggleAbs('+p.id+')">'+car+p.t2+'</h3>'
  +'<div class="pub-a">'+bold(p.a)+'</div><div class="pub-j">'+p.j+'</div>'
  +'<div class="tags">'+star+oa+tags+'</div>'
  +'<div class="acts">'+(p.ab?'<button onclick="toggleAbs('+p.id+')">Abstract</button>':'')
  +doi+'<button onclick="cite('+p.id+')">Cite</button>'
  +'<button onclick="copyLink('+p.id+')">Copy link</button>'+sch+'</div>'
  +(p.ab?'<div class="abs">'+p.ab+'</div>':'')+'</div>';
}
function toggleAbs(id){const el=document.querySelector('.pub[data-id="'+id+'"]');if(el)el.classList.toggle('open');}
function cite(id){const p=PUBS.find(x=>x.id===id);navigator.clipboard.writeText(apa(p)).then(()=>toast('Citation copied'));}
function copyLink(id){const p=PUBS.find(x=>x.id===id);navigator.clipboard.writeText(p.doi?'https://doi.org/'+p.doi:location.href).then(()=>toast('Link copied'));}
function openPaper(id){go('research');setTimeout(()=>{const el=document.querySelector('.pub[data-id="'+id+'"]');
 if(el){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'center'});el.style.borderColor=MAROON;}},260);}

function filtered(){
 return PUBS.filter(p=>{
  if(S.topics.size&&!p.t.some(t=>S.topics.has(t)))return false;
  if(S.methods.size&&!p.m.some(m=>S.methods.has(m)))return false;
  if(S.years.size&&!S.years.has(p.y))return false;
  if(S.cos.size&&!(p.co||[]).some(c=>S.cos.has(c)))return false;
  if(S.journal&&p.j!==S.journal)return false;
  if(S.oa&&!p.oa)return false;
  if(S.q){const s=(p.t2+' '+p.a+' '+p.j).toLowerCase();if(!s.includes(S.q))return false;}
  return true;
 });
}
function render(){
 const r=filtered();
 r.sort((a,b)=>S.sort==='cited'?((b.c||0)-(a.c||0)):(S.sort==='new'?b.y-a.y:a.y-b.y));
 $('n').textContent=r.length;
 const active=S.topics.size||S.methods.size||S.years.size||S.cos.size||S.journal||S.oa||S.q;
 $('clr').style.display=active?'inline':'none';
 let out;
 if(S.group&&S.sort!=='cited'){
  const by={};r.forEach(p=>{(by[p.y]=by[p.y]||[]).push(p)});
  const ys=Object.keys(by).map(Number).sort((a,b)=>S.sort==='old'?a-b:b-a);
  out=ys.map(y=>'<div class="yhead">'+y+' <span>· '+by[y].length+'</span></div>'+by[y].map(card).join('')).join('');
 } else out=r.map(card).join('');
 $('papers').innerHTML=r.length?out:'<p style="color:var(--gray);padding:20px 0">No publications match these filters.</p>';
}
function clearAll(){
 S.q="";S.topics.clear();S.methods.clear();S.years.clear();S.cos.clear();S.journal="";S.oa=false;S.group=false;
 $('q').value="";$('fJournal').value="";$('tOA').checked=false;$('tGroup').checked=false;
 document.querySelectorAll('.chip.on').forEach(c=>c.classList.remove('on'));render();
}

/* build chips */
function chip(txt,cls,onclick){const b=document.createElement('button');b.className='chip';b.textContent=txt;
 b.onclick=()=>{b.classList.toggle('on');if(cls)b.classList.toggle(cls,b.classList.contains('on'));onclick(b);};return b;}
Object.entries(TOPICS).forEach(([k,v])=>$('fTopic').appendChild(chip(v,null,b=>{tog(S.topics,k);render();})));
Object.entries(METHODS).forEach(([k,v])=>$('fMethod').appendChild(chip(v,'m',b=>{tog(S.methods,k);render();})));
[...new Set(PUBS.map(p=>p.y))].sort((a,b)=>b-a).forEach(y=>$('fYear').appendChild(chip(y,'y',b=>{tog(S.years,y);render();})));
document.querySelectorAll('#fCo .chip').forEach(b=>{b.onclick=()=>{b.classList.toggle('on');b.classList.toggle('co',b.classList.contains('on'));tog(S.cos,b.textContent);render();};});
function tog(set,k){set.has(k)?set.delete(k):set.add(k);}
$('q').oninput=e=>{S.q=e.target.value.toLowerCase();render();};
$('fJournal').onchange=e=>{S.journal=e.target.value;render();};
$('sort').onchange=e=>{S.sort=e.target.value;render();};
$('tOA').onchange=e=>{S.oa=e.target.checked;render();};
$('tGroup').onchange=e=>{S.group=e.target.checked;render();};

/* most cited */
(function(){
 const t=PUBS.filter(p=>p.c!=null).sort((a,b)=>b.c-a.c).slice(0,5);
 $('topCited').innerHTML=t.map(p=>'<div class="topc" onclick="openPaper('+p.id+')"><div class="topc-n">'+p.c+'</div>'
  +'<div class="topc-t">'+p.t2+' <span class="topc-j">· '+p.j+', '+p.y+'</span></div></div>').join('');
})();

/* ---------------- canvas helpers ---------------- */
function hidpi(cv,w,h){const d=window.devicePixelRatio||1;cv.width=w*d;cv.height=h*d;cv.style.width=w+'px';cv.style.height=h+'px';
 const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x;}

/* ---------------- charts ---------------- */
function drawYearChart(){
 const cv=$('chYear');if(!cv)return;
 const W=cv.parentElement.clientWidth-32, H=150, x=hidpi(cv,W,H);
 const ys={};PUBS.forEach(p=>{ys[p.y]=ys[p.y]||{n:0,c:0};ys[p.y].n++;ys[p.y].c+=(p.c||0);});
 const years=Object.keys(ys).map(Number).sort((a,b)=>a-b);
 if(!years.length)return;
 const maxN=Math.max(...years.map(y=>ys[y].n)), maxC=Math.max(...years.map(y=>ys[y].c));
 const pad={l:26,r:30,t:12,b:22}, iw=W-pad.l-pad.r, ih=H-pad.t-pad.b;
 const bw=Math.max(6,iw/years.length*0.62);
 x.clearRect(0,0,W,H);
 // gridlines
 x.strokeStyle="#eef0f4";x.lineWidth=1;
 for(let i=0;i<=3;i++){const yy=pad.t+ih*i/3;x.beginPath();x.moveTo(pad.l,yy);x.lineTo(W-pad.r,yy);x.stroke();}
 // bars = papers
 years.forEach((y,i)=>{
  const cx=pad.l+iw*(i+0.5)/years.length, h=ih*ys[y].n/maxN;
  x.fillStyle="rgba(140,25,51,.78)";
  x.beginPath();x.roundRect(cx-bw/2,pad.t+ih-h,bw,h,[3,3,0,0]);x.fill();
 });
 // line = citations
 x.strokeStyle=GOLD;x.lineWidth=2;x.beginPath();
 years.forEach((y,i)=>{const cx=pad.l+iw*(i+0.5)/years.length, cy=pad.t+ih-(maxC?ih*ys[y].c/maxC:0);
  i?x.lineTo(cx,cy):x.moveTo(cx,cy);});
 x.stroke();
 years.forEach((y,i)=>{const cx=pad.l+iw*(i+0.5)/years.length, cy=pad.t+ih-(maxC?ih*ys[y].c/maxC:0);
  x.fillStyle=GOLD;x.beginPath();x.arc(cx,cy,2.6,0,7);x.fill();});
 // labels
 x.fillStyle=GRAY;x.font="10px Roboto,sans-serif";x.textAlign="center";
 years.forEach((y,i)=>{if(years.length>12&&i%2)return;
  x.fillText(String(y).slice(2),pad.l+iw*(i+0.5)/years.length,H-7);});
 x.textAlign="left";x.fillStyle=MAROON;x.fillText("papers",pad.l-22,pad.t-2);
 x.textAlign="right";x.fillStyle=GOLD;x.fillText("citations",W-pad.r+26,pad.t-2);
}
function drawTopicChart(){
 const cv=$('chTopic');if(!cv)return;
 const W=cv.parentElement.clientWidth-32, H=150, x=hidpi(cv,W,H);
 const cnt={};PUBS.forEach(p=>p.t.forEach(t=>cnt[t]=(cnt[t]||0)+1));
 const items=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
 const total=items.reduce((s,i)=>s+i[1],0);
 x.clearRect(0,0,W,H);
 const cx=64, cy=H/2, R=52, r0=30;
 let a0=-Math.PI/2;
 items.forEach(([k,v])=>{
  const a1=a0+Math.PI*2*v/total;
  x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R,a0,a1);x.closePath();
  x.fillStyle=COLORS[k]||GRAY;x.fill();
  a0=a1;
 });
 x.globalCompositeOperation="destination-out";
 x.beginPath();x.arc(cx,cy,r0,0,7);x.fill();
 x.globalCompositeOperation="source-over";
 x.fillStyle=NAVY;x.font="600 15px 'Roboto Slab',serif";x.textAlign="center";x.textBaseline="middle";
 x.fillText(String(PUBS.length),cx,cy-4);
 x.font="8.5px Roboto,sans-serif";x.fillStyle=GRAY;x.fillText("papers",cx,cy+9);
 // legend
 x.textAlign="left";x.textBaseline="alphabetic";x.font="10.5px Roboto,sans-serif";
 let ly=16;
 items.forEach(([k,v])=>{
  if(ly>H-4)return;
  x.fillStyle=COLORS[k]||GRAY;x.beginPath();x.arc(130,ly-3,3.6,0,7);x.fill();
  x.fillStyle="#54595f";
  const label=(TOPICS[k]||k);
  x.fillText(label.length>24?label.slice(0,23)+'…':label,139,ly);
  x.fillStyle=GRAY;x.textAlign="right";x.fillText(v,W-4,ly);x.textAlign="left";
  ly+=16;
 });
}

/* ---------------- co-author network ---------------- */
let VIZ={mode:'network',nodes:[],links:[],drag:null,zoom:1,raf:null,hover:null,sizeBy:'papers',minPapers:1};
function buildNetwork(){
 const cnt={},cites={},topics={};
 PUBS.forEach(p=>(p.co||[]).forEach(c=>{
  cnt[c]=(cnt[c]||0)+1;cites[c]=(cites[c]||0)+(p.c||0);
  (topics[c]=topics[c]||{});p.t.forEach(t=>topics[c][t]=(topics[c][t]||0)+1);
 }));
 const names=Object.keys(cnt).filter(n=>cnt[n]>=VIZ.minPapers);
 const box=$('viz').parentElement, W=box.clientWidth, H=box.clientHeight;
 const nodes=[{id:'__me',label:'Vranka',n:PUBS.length,c:0,x:W/2,y:H/2,r:20,me:true,fx:W/2,fy:H/2}];
 names.forEach((nme,i)=>{
  const ang=Math.PI*2*i/names.length-Math.PI/2;
  const dist=Math.min(W,H)*0.30+(6-Math.min(cnt[nme],6))*9;
  const main=Object.entries(topics[nme]||{}).sort((a,b)=>b[1]-a[1])[0];
  nodes.push({id:nme,label:nme,n:cnt[nme],c:cites[nme]||0,topic:main?main[0]:null,
   x:W/2+Math.cos(ang)*dist,y:H/2+Math.sin(ang)*dist,vx:0,vy:0});
 });
 VIZ.nodes=nodes;
 VIZ.links=nodes.slice(1).map(n=>({s:0,t:nodes.indexOf(n),w:n.n}));
 sizeNodes();
}
function sizeNodes(){
 const max=Math.max(...VIZ.nodes.slice(1).map(n=>VIZ.sizeBy==='cites'?n.c:n.n),1);
 VIZ.nodes.forEach((n,i)=>{if(i===0){n.r=20;return;}
  const v=VIZ.sizeBy==='cites'?n.c:(VIZ.sizeBy==='equal'?1:n.n);
  const mx=VIZ.sizeBy==='equal'?1:max;
  n.r=7+13*Math.sqrt(v/mx||0);});
}
function stepNetwork(){
 const box=$('viz').parentElement, W=box.clientWidth, H=box.clientHeight;
 const ns=VIZ.nodes;
 for(let i=1;i<ns.length;i++){
  const n=ns[i];
  if(VIZ.drag===i)continue;
  // spring to centre
  const dx=n.x-W/2, dy=n.y-H/2, d=Math.hypot(dx,dy)||1;
  const target=Math.min(W,H)*0.32+(1-Math.min(n.n,6)/6)*40;
  const f=(d-target)*0.012;
  n.vx-=dx/d*f; n.vy-=dy/d*f;
  // repulsion
  for(let j=1;j<ns.length;j++){
   if(i===j)continue;const m=ns[j];
   let ex=n.x-m.x, ey=n.y-m.y, ed=Math.hypot(ex,ey)||1;
   const min=n.r+m.r+14;
   if(ed<min){const p=(min-ed)*0.06;n.vx+=ex/ed*p;n.vy+=ey/ed*p;}
  }
  n.vx*=0.82;n.vy*=0.82;
  n.x+=n.vx;n.y+=n.vy;
  n.x=Math.max(n.r+2,Math.min(W-n.r-2,n.x));
  n.y=Math.max(n.r+2,Math.min(H-n.r-2,n.y));
 }
}
function drawNetwork(){
 const cv=$('viz'), box=cv.parentElement, W=box.clientWidth, H=box.clientHeight;
 const x=hidpi(cv,W,H);
 x.clearRect(0,0,W,H);
 const me=VIZ.nodes[0];me.x=W/2;me.y=H/2;
 // links
 VIZ.links.forEach(l=>{const n=VIZ.nodes[l.t];
  x.strokeStyle=(VIZ.hover===l.t)?"rgba(140,25,51,.55)":"rgba(140,25,51,"+(0.09+Math.min(l.w,6)*0.035)+")";
  x.lineWidth=(VIZ.hover===l.t?2.4:0.8+Math.min(l.w,8)*0.35);
  x.beginPath();x.moveTo(me.x,me.y);x.lineTo(n.x,n.y);x.stroke();});
 // nodes
 VIZ.nodes.forEach((n,i)=>{
  const act=S.cos.has(n.id);
  x.beginPath();x.arc(n.x,n.y,n.r,0,7);
  if(n.me){const g=x.createLinearGradient(n.x-n.r,n.y-n.r,n.x+n.r,n.y+n.r);
   g.addColorStop(0,MAROON);g.addColorStop(1,"#b8324f");x.fillStyle=g;}
  else x.fillStyle=act?MAROON:(COLORS[n.topic]||"#7d858f");
  x.globalAlpha=(VIZ.hover!=null&&VIZ.hover!==i&&!n.me)?0.35:1;
  x.fill();
  if(act||VIZ.hover===i){x.strokeStyle=NAVY;x.lineWidth=2;x.stroke();}
  x.globalAlpha=1;
  // label
  if(n.me){x.fillStyle="#fff";x.font="600 11px Roboto,sans-serif";x.textAlign="center";x.textBaseline="middle";
   x.fillText("ME",n.x,n.y);}
  else if(n.r>9||VIZ.hover===i){
   x.fillStyle=NAVY;x.font=(VIZ.hover===i?"600 ":"")+"10.5px Roboto,sans-serif";
   x.textAlign="center";x.textBaseline="top";
   x.fillText(n.label,n.x,n.y+n.r+3);
   if(VIZ.hover===i){x.fillStyle=GRAY;x.font="9.5px Roboto,sans-serif";
    x.fillText(n.n+" paper"+(n.n===1?"":"s")+" · "+n.c+" cites",n.x,n.y+n.r+16);}
  }
 });
}
function loopNetwork(){stepNetwork();drawNetwork();VIZ.raf=requestAnimationFrame(loopNetwork);}

/* ---------------- research DNA ---------------- */
function drawDNA(){
 const cv=$('viz'), box=cv.parentElement, W=box.clientWidth, H=box.clientHeight;
 const x=hidpi(cv,W,H);
 x.clearRect(0,0,W,H);
 const strands=Object.keys(TOPICS).filter(t=>PUBS.some(p=>p.t.includes(t)));
 const years=[...new Set(PUBS.map(p=>p.y))].sort((a,b)=>a-b);
 const y0=years[0], y1=years[years.length-1];
 const pad={l:120,r:26,t:22,b:28}, iw=W-pad.l-pad.r, ih=H-pad.t-pad.b;
 const lane=ih/strands.length;
 const px=y=>pad.l+iw*(y-y0)/Math.max(1,(y1-y0));
 // axis
 x.strokeStyle="#eef0f4";x.lineWidth=1;
 years.forEach(y=>{if((y-y0)%2)return;x.beginPath();x.moveTo(px(y),pad.t-6);x.lineTo(px(y),H-pad.b+4);x.stroke();});
 x.fillStyle=GRAY;x.font="9.5px Roboto,sans-serif";x.textAlign="center";
 years.forEach(y=>{if((y-y0)%2)return;x.fillText(y,px(y),H-pad.b+16);});
 // strands
 strands.forEach((t,i)=>{
  const cy=pad.t+lane*(i+0.5);
  const col=COLORS[t]||GRAY;
  const ps=PUBS.filter(p=>p.t.includes(t)).sort((a,b)=>a.y-b.y);
  // ribbon
  x.strokeStyle=col;x.globalAlpha=0.20;x.lineWidth=Math.min(16,4+ps.length*0.7);x.lineCap="round";
  if(ps.length){x.beginPath();x.moveTo(px(ps[0].y),cy);x.lineTo(px(ps[ps.length-1].y),cy);x.stroke();}
  x.globalAlpha=1;
  // label
  x.fillStyle=NAVY;x.font="600 10.5px Roboto,sans-serif";x.textAlign="right";x.textBaseline="middle";
  const lab=TOPICS[t];x.fillText(lab.length>18?lab.slice(0,17)+'…':lab,pad.l-12,cy);
  x.fillStyle=GRAY;x.font="9px Roboto,sans-serif";x.fillText(ps.length+" papers",pad.l-12,cy+11);
  // dots
  const maxc=Math.max(...PUBS.map(p=>p.c||0),1);
  ps.forEach(p=>{
   const r=3.2+5.5*Math.sqrt((p.c||0)/maxc);
   const jitter=((p.id%3)-1)*3.4;
   x.beginPath();x.arc(px(p.y),cy+jitter,r,0,7);
   x.fillStyle=col;x.globalAlpha=VIZ.hover&&VIZ.hover.id===p.id?1:0.82;x.fill();
   if(p.hl){x.strokeStyle=GOLD;x.lineWidth=1.6;x.globalAlpha=1;x.stroke();}
   x.globalAlpha=1;
   p._vx=px(p.y);p._vy=cy+jitter;p._vr=r;
  });
 });
 // hover tooltip
 if(VIZ.hover&&VIZ.hover.t2){
  const p=VIZ.hover;
  const txt=p.t2.length>62?p.t2.slice(0,61)+'…':p.t2;
  x.font="11px Roboto,sans-serif";
  const w=Math.max(x.measureText(txt).width,x.measureText(p.j+", "+p.y).width)+18;
  let bx=Math.min(Math.max(p._vx-w/2,6),W-w-6), by=p._vy-46;
  if(by<4)by=p._vy+16;
  x.fillStyle="rgba(0,16,46,.94)";x.beginPath();x.roundRect(bx,by,w,36,7);x.fill();
  x.fillStyle="#fff";x.textAlign="left";x.textBaseline="top";x.fillText(txt,bx+9,by+7);
  x.fillStyle="rgba(255,255,255,.72)";x.font="10px Roboto,sans-serif";
  x.fillText(p.j+", "+p.y+((p.c!=null)?"  ·  "+p.c+" cites":""),bx+9,by+21);
 }
}

/* ---------------- viz shell ---------------- */
function openViz(mode){
 VIZ.mode=mode;VIZ.hover=null;
 $('ovViz').classList.add('on');
 $('vizTitle').textContent=mode==='network'?'Co-author network':'Research DNA';
 $('tabNet').classList.toggle('pri',mode==='network');
 $('tabDna').classList.toggle('pri',mode==='dna');
 if(VIZ.raf){cancelAnimationFrame(VIZ.raf);VIZ.raf=null;}
 setTimeout(()=>{
  if(mode==='network'){
   $('vizControls').innerHTML='<h4>Size nodes by</h4>'
    +'<select id="szBy"><option value="papers">Number of papers</option><option value="cites">Total citations</option><option value="equal">Equal size</option></select>'
    +'<h4 style="margin-top:11px">Minimum papers</h4>'
    +'<select id="minP"><option value="1">All (1+)</option><option value="2">2+ papers</option><option value="3">3+ papers</option></select>';
   $('szBy').value=VIZ.sizeBy;$('minP').value=VIZ.minPapers;
   $('szBy').onchange=e=>{VIZ.sizeBy=e.target.value;sizeNodes();};
   $('minP').onchange=e=>{VIZ.minPapers=+e.target.value;buildNetwork();};
   buildNetwork();
   const co=VIZ.nodes.length-1;
   $('vizStats').innerHTML='<div class="vstat"><span>Co-authors</span><b>'+co+'</b></div>'
    +'<div class="vstat"><span>Papers</span><b>'+PUBS.length+'</b></div>'
    +'<div class="vstat"><span>Most frequent</span><b>'+(VIZ.nodes[1]?VIZ.nodes[1].label:'—')+'</b></div>';
   $('vizLegend').innerHTML=Object.keys(TOPICS).filter(t=>VIZ.nodes.some(n=>n.topic===t))
    .map(t=>'<div class="legend"><span class="dot" style="background:'+COLORS[t]+'"></span>'+TOPICS[t]+'</div>').join('');
   $('vizHint').textContent='Node size = number of joint papers. Colour = that collaborator’s main topic. Drag to rearrange, click to filter the publication list.';
   loopNetwork();
  } else {
   $('vizControls').innerHTML='<h4>Reading this</h4><div style="color:var(--gray);line-height:1.5">Each ribbon is a research strand; each dot is a paper, sized by citations. Gold rings mark papers in flagship venues.</div>';
   const strands=Object.keys(TOPICS).filter(t=>PUBS.some(p=>p.t.includes(t)));
   const span=Math.min(...PUBS.map(p=>p.y))+'–'+Math.max(...PUBS.map(p=>p.y));
   $('vizStats').innerHTML='<div class="vstat"><span>Strands</span><b>'+strands.length+'</b></div>'
    +'<div class="vstat"><span>Span</span><b>'+span+'</b></div>'
    +'<div class="vstat"><span>Papers</span><b>'+PUBS.length+'</b></div>';
   $('vizLegend').innerHTML=strands.map(t=>'<div class="legend"><span class="dot" style="background:'+COLORS[t]+'"></span>'+TOPICS[t]+'</div>').join('');
   $('vizHint').textContent='Hover a dot for the paper; click to open it in the publication list.';
   drawDNA();
  }
 },60);
}

/* interaction */
(function(){
 const cv=$('viz');
 function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
 cv.addEventListener('mousemove',e=>{
  const p=pos(e);
  if(VIZ.mode==='network'){
   if(VIZ.drag!=null){VIZ.nodes[VIZ.drag].x=p.x;VIZ.nodes[VIZ.drag].y=p.y;return;}
   let h=null;VIZ.nodes.forEach((n,i)=>{if(Math.hypot(n.x-p.x,n.y-p.y)<n.r+3)h=i;});
   VIZ.hover=h;cv.style.cursor=h!=null?'pointer':'default';
  } else {
   let h=null;PUBS.forEach(q=>{if(q._vx!=null&&Math.hypot(q._vx-p.x,q._vy-p.y)<q._vr+3.5)h=q;});
   if(h!==VIZ.hover){VIZ.hover=h;cv.style.cursor=h?'pointer':'default';drawDNA();}
  }
 });
 cv.addEventListener('mousedown',e=>{const p=pos(e);
  if(VIZ.mode==='network')VIZ.nodes.forEach((n,i)=>{if(i&&Math.hypot(n.x-p.x,n.y-p.y)<n.r+3)VIZ.drag=i;});});
 window.addEventListener('mouseup',()=>{VIZ.drag=null;});
 cv.addEventListener('click',e=>{
  const p=pos(e);
  if(VIZ.mode==='network'){
   VIZ.nodes.forEach((n,i)=>{if(i&&Math.hypot(n.x-p.x,n.y-p.y)<n.r+3){
    S.cos.has(n.id)?S.cos.delete(n.id):S.cos.add(n.id);
    document.querySelectorAll('#fCo .chip').forEach(b=>{const on=S.cos.has(b.textContent);b.classList.toggle('on',on);b.classList.toggle('co',on);});
    render();toast(S.cos.has(n.id)?('Filtered to papers with '+n.label):'Filter removed');
   }});
  } else if(VIZ.hover&&VIZ.hover.t2){closeOv('ovViz');openPaper(VIZ.hover.id);}
 });
 cv.addEventListener('mouseleave',()=>{if(VIZ.mode==='dna'&&VIZ.hover){VIZ.hover=null;drawDNA();}});
})();

/* ---------------- init ---------------- */
render();
function drawCharts(){try{drawYearChart();drawTopicChart();}catch(e){}}
drawCharts();
let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
 drawCharts();if($('ovViz').classList.contains('on')&&VIZ.mode==='dna')drawDNA();},180);});
document.querySelectorAll('nav.main button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.p==='research')setTimeout(drawCharts,60);}));
