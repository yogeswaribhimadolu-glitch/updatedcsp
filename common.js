/* ====== CHANGE THESE TWO LINES ====== */
const STUDENT_NAME='YOUR NAME';
const GUIDE_NAME="Mam's Name";
/* ==================================== */

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function load(k){try{return localStorage.getItem(k)}catch(e){return null}}

/* [id, file, nav label, full title] */
const PAGES=[
  ['home','index.html','Home','Tokens and context windows'],
  ['genai','genai.html','Gen AI & Agents','Generative AI, agents and agentic AI'],
  ['tools','tools.html','AI Tools','Best AI tools of 2025'],
  ['prompts','prompts.html','Prompting','Prompt engineering'],
  ['ethics','ethics.html','Ethics','AI ethics and safety'],
  ['timeline','timeline.html','Timeline','History of AI'],
  ['concepts','concepts.html','Key Terms','Key AI terms explained'],
  ['glossary','glossary.html','Glossary','AI glossary'],
  ['chat','chat.html','AI Chat','Ask the AI tutor'],
  ['feedback','feedback.html','Feedback','Feedback']
];

(function(){
  const cur=document.body.dataset.page;
  const i=PAGES.findIndex(p=>p[0]===cur);

  /* header */
  const h=$('#site-header');
  if(h){
    h.innerHTML='<div class="bar"><a class="brand" href="index.html">AI<span>.</span>Explained</a>'+
      '<div class="right"><nav aria-label="Main">'+
      PAGES.map(p=>'<a href="'+p[1]+'"'+(p[0]===cur?' class="active" aria-current="page"':'')+'>'+p[2]+'</a>').join('')+
      '</nav><button id="theme" type="button">Dark mode</button></div></div>';
  }

  /* dark mode */
  const btn=$('#theme');
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    if(btn)btn.textContent=t==='dark'?'Light mode':'Dark mode';
  }
  applyTheme(load('theme')==='dark'?'dark':'light');
  if(btn)btn.addEventListener('click',()=>{
    const t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(t);store('theme',t);
  });

  /* previous / next */
  const pg=$('#pager');
  if(pg&&i>=0){
    const prev=PAGES[i-1],next=PAGES[i+1];
    pg.className='pager';
    pg.innerHTML='<div>'+(prev?'<a class="pbtn" href="'+prev[1]+'"><small>Previous page</small><b>'+prev[3]+'</b></a>':'')+'</div>'+
      '<span class="pcount">Page '+(i+1)+' of '+PAGES.length+'</span>'+
      '<div>'+(next?'<a class="pbtn next" href="'+next[1]+'"><small>Next page</small><b>'+next[3]+'</b></a>':'')+'</div>';
  }

  /* footer */
  const f=$('#site-footer');
  if(f){
    f.innerHTML='College CSP Project | Made by <b></b> | Guide: <b></b>';
    const b=f.querySelectorAll('b');
    b[0].textContent=STUDENT_NAME;b[1].textContent=GUIDE_NAME;
  }

  if(i>=0)document.title=PAGES[i][3]+' | AI Explained';
})();