
// Simple client-side font variant generator
const maps = {
  normal: null,
  bold: { a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',
      A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙' },
  italic: { a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻' },
  cursive: { a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'ℯ',f:'𝒻',g:'ℊ',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'ℴ',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏' },
  double: { a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫' },
  gothic: { a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷' }
};

function stylize(text, map){
  if(!map) return text;
  let out = '';
  for(const ch of text){
    if(map[ch] !== undefined) out += map[ch];
    else if(map[ch.toLowerCase()] !== undefined) out += map[ch.toLowerCase()];
    else out += ch;
  }
  return out;
}

function decorate(text, prefix='', suffix=''){
  return prefix + text + suffix;
}

function makeVariants(text, typeFilter='all'){
  const variants = [];
  if(!text || !text.trim()) return variants;
  text = text.trim();

  variants.push({label:'Normal', out:text});
  variants.push({label:'Bold', out:stylize(text, maps.bold)});
  variants.push({label:'Italic', out:stylize(text, maps.italic)});
  variants.push({label:'Cursive', out:stylize(text, maps.cursive)});
  variants.push({label:'Double', out:stylize(text, maps.double)});
  variants.push({label:'Gothic', out:stylize(text, maps.gothic)});
  variants.push({label:'★ Stars ★', out:decorate(text,'✦ ',' ✦')});
  variants.push({label:'【Brackets】', out:decorate(text,'【','】')});
  variants.push({label:'Wavy', out:decorate(text,'~','~')});
  variants.push({label:'Emoji', out:decorate(text,'🔥','✨')});
  variants.push({label:'Spaced', out:text.split('').join(' ')});
  variants.push({label:'Under_score', out:text.split(' ').join('_')});
  variants.push({label:'UPPERCASE', out:text.toUpperCase()});
  variants.push({label:'lowercase', out:text.toLowerCase()});

  // dedupe
  const uniq = [];
  for(const v of variants){
    if(!uniq.find(u=>u.out===v.out)) uniq.push(v);
    if(uniq.length>60) break;
  }

  // simple filter: for PUBG prefer shorter outputs (rough heuristic)
  if(typeFilter==='pubg') return uniq.map(u=>u).filter(x=>x.out.length<=20 || x.label.toLowerCase().includes('bold') || x.label.toLowerCase().includes('cursive'));
  if(typeFilter==='instagram') return uniq;
  return uniq;
}

// UI helpers
function renderVariantsTo(container, list){
  container.innerHTML = '';
  list.forEach(v=>{
    const div = document.createElement('div'); div.className='variant';
    const out = document.createElement('div'); out.className='out'; out.textContent = v.out;
    const label = document.createElement('div'); label.className='small'; label.textContent = v.label;
    const btn = document.createElement('button'); btn.textContent='Copy'; btn.className='btn'; btn.style.padding='6px 8px';
    btn.addEventListener('click', ()=>{ navigator.clipboard.writeText(v.out).then(()=>showCopied()); });
    div.appendChild(out); div.appendChild(label); div.appendChild(btn);
    container.appendChild(div);
  });
}

function showCopied(){
  const t = document.getElementById('copiedToast');
  if(!t) return;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1000);
}

// Main page wiring
document.addEventListener('DOMContentLoaded', ()=>{
  // index
  const input = document.getElementById('inputText');
  const gen = document.getElementById('generateBtn');
  const copyAll = document.getElementById('copyAllBtn');
  const variantsWrap = document.getElementById('variants');
  const focus = document.getElementById('focusSelect');

  if(gen){
    gen.addEventListener('click', ()=>{
      const list = makeVariants(input.value, focus.value);
      renderVariantsTo(variantsWrap, list);
    });
  }
  if(copyAll){
    copyAll.addEventListener('click', ()=>{
      const items = [...document.querySelectorAll('#variants .out')].map(d=>d.textContent).filter(Boolean);
      if(!items.length) { showCopied(); return; }
      navigator.clipboard.writeText(items.join('\\n')).then(()=>showCopied());
    });
  }

  // pubg page
  const inputP = document.getElementById('inputTextPubg');
  const genP = document.getElementById('generateBtnPubg');
  const copyP = document.getElementById('copyAllBtnPubg');
  const wrapP = document.getElementById('variantsPubg');
  if(genP){
    genP.addEventListener('click', ()=>{ const list = makeVariants(inputP.value, 'pubg'); renderVariantsTo(wrapP, list); });
  }
  if(copyP){
    copyP.addEventListener('click', ()=>{ const items = [...wrapP.querySelectorAll('.out')].map(d=>d.textContent); navigator.clipboard.writeText(items.join('\\n')).then(()=>{ const t=document.getElementById('copiedToastPubg'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1000); }); });
  }

  // instagram page
  const inputI = document.getElementById('inputTextInsta');
  const genI = document.getElementById('generateBtnInsta');
  const copyI = document.getElementById('copyAllBtnInsta');
  const wrapI = document.getElementById('variantsInsta');
  if(genI){
    genI.addEventListener('click', ()=>{ const list = makeVariants(inputI.value, 'instagram'); renderVariantsTo(wrapI, list); });
  }
  if(copyI){
    copyI.addEventListener('click', ()=>{ const items = [...wrapI.querySelectorAll('.out')].map(d=>d.textContent); navigator.clipboard.writeText(items.join('\\n')).then(()=>{ const t=document.getElementById('copiedToastInsta'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1000); }); });
  }

  // auto-generate sample on load for index (helps crawlers)
  if(input && !input.value){ input.value='M Zain Khan'; gen.click(); }
});
