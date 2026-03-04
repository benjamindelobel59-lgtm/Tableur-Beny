import { useState, useCallback, useRef, useEffect } from "react";

const API = "https://api.dofusdu.de/dofus3/v1/fr";

const T = {
  bg:"#0f0d0a",surface:"#17140f",border:"#2c2316",
  accent:"#f59e0b",accent2:"#fbbf24",accentBg:"#f59e0b14",accentBorder:"#f59e0b35",
  text:"#fef3c7",textSub:"#92816a",muted:"#57483a",dimmer:"#211c12",
  danger:"#f87171",success:"#34d399",
  font:"'DM Sans', system-ui, sans-serif",
};

const CLASSES = ["Iop","Cra","Feca","Xelor","Enutrof","Sacrieur","Sadida","Ecaflip","Eniripsa","Sram","Pandawa","Roublard","Zobal","Steamer","Eliotrope","Huppermage","Ouginak","Forgelance","Osamodas"];

// Slots definition
const SLOTS_LEFT = [
  {id:"chapeau",  label:"Chapeau",  icon:"🎩", type:"equipment"},
  {id:"amulette", label:"Amulette", icon:"📿", type:"equipment"},
  {id:"anneau1",  label:"Anneau 1", icon:"💍", type:"equipment"},
  {id:"anneau2",  label:"Anneau 2", icon:"💍", type:"equipment"},
  {id:"ceinture", label:"Ceinture", icon:"🪡", type:"equipment"},
  {id:"bottes",   label:"Bottes",   icon:"👟", type:"equipment"},
];
const SLOTS_RIGHT = [
  {id:"cape",     label:"Cape",     icon:"🧣", type:"equipment"},
  {id:"familier", label:"Familier", icon:"🐾", type:"equipment"},
  {id:"arme",     label:"Arme",     icon:"⚔️", type:"weapon"},
  {id:"bouclier", label:"Bouclier", icon:"🛡️", type:"equipment"},
];
const SLOTS_DOFUS = [
  {id:"dofus1",label:"Dofus 1",icon:"🥚",type:"equipment"},
  {id:"dofus2",label:"Dofus 2",icon:"🥚",type:"equipment"},
  {id:"dofus3",label:"Dofus 3",icon:"🥚",type:"equipment"},
  {id:"dofus4",label:"Dofus 4",icon:"🥚",type:"equipment"},
  {id:"dofus5",label:"Dofus 5",icon:"🥚",type:"equipment"},
  {id:"dofus6",label:"Dofus 6",icon:"🥚",type:"equipment"},
];
const ALL_SLOTS = [...SLOTS_LEFT,...SLOTS_RIGHT,...SLOTS_DOFUS];

// Stat groups for display
const STAT_GROUPS = [
  {
    label:"⚡ Caractéristiques",
    stats:[
      {key:"Vitalité",      label:"PdV",          color:"#f87171", suffix:""},
      {key:"Sagesse",       label:"Sagesse",       color:"#c084fc", suffix:""},
      {key:"Force",         label:"Force",         color:"#fb923c", suffix:""},
      {key:"Intelligence",  label:"Intelligence",  color:"#f87171", suffix:""},
      {key:"Chance",        label:"Chance",        color:"#34d399", suffix:""},
      {key:"Agilité",       label:"Agilité",       color:"#67e8f9", suffix:""},
      {key:"Puissance",     label:"Puissance",     color:"#fbbf24", suffix:"%"},
    ]
  },
  {
    label:"🎯 Combat",
    stats:[
      {key:"PA",                label:"PA",      color:"#fbbf24", suffix:""},
      {key:"PM",                label:"PM",      color:"#34d399", suffix:""},
      {key:"Portée",            label:"PO",      color:"#67e8f9", suffix:""},
      {key:"Initiative",        label:"Init.",   color:"#a78bfa", suffix:""},
      {key:"Critique",          label:"Critique",color:"#f59e0b", suffix:""},
      {key:"Soins",             label:"Soins",   color:"#86efac", suffix:""},
      {key:"Invocations",       label:"Invoc.",  color:"#d1d5db", suffix:""},
    ]
  },
  {
    label:"🦵 Divers",
    stats:[
      {key:"Pods",              label:"Pods",     color:"#92816a", suffix:""},
      {key:"Fuite",             label:"Fuite",    color:"#67e8f9", suffix:""},
      {key:"Tacle",             label:"Tacle",    color:"#f87171", suffix:""},
      {key:"Esquive PA",        label:"Esq. PA",  color:"#fbbf24", suffix:""},
      {key:"Esquive PM",        label:"Esq. PM",  color:"#34d399", suffix:""},
      {key:"Retrait PA",        label:"Ret. PA",  color:"#fbbf24", suffix:""},
      {key:"Retrait PM",        label:"Ret. PM",  color:"#34d399", suffix:""},
    ]
  },
];

const RES_GROUPS = [
  {
    label:"🛡️ Résistances fixes",
    stats:[
      {key:"Résistance Neutre",  label:"Neutre",  color:"#d1d5db"},
      {key:"Résistance Terre",   label:"Terre",   color:"#fb923c"},
      {key:"Résistance Feu",     label:"Feu",     color:"#f87171"},
      {key:"Résistance Eau",     label:"Eau",     color:"#67e8f9"},
      {key:"Résistance Air",     label:"Air",     color:"#86efac"},
      {key:"Résistance Critique",label:"Critique",color:"#fbbf24"},
    ]
  },
  {
    label:"💠 Résistances %",
    stats:[
      {key:"% Résistance Neutre", label:"% Neutre", color:"#d1d5db"},
      {key:"% Résistance Terre",  label:"% Terre",  color:"#fb923c"},
      {key:"% Résistance Feu",    label:"% Feu",    color:"#f87171"},
      {key:"% Résistance Eau",    label:"% Eau",    color:"#67e8f9"},
      {key:"% Résistance Air",    label:"% Air",    color:"#86efac"},
    ]
  },
  {
    label:"💥 Dommages",
    stats:[
      {key:"Dommages",           label:"Dommages",   color:"#f59e0b"},
      {key:"Do Neutre",          label:"Do Neutre",  color:"#d1d5db"},
      {key:"Do Terre",           label:"Do Terre",   color:"#fb923c"},
      {key:"Do Feu",             label:"Do Feu",     color:"#f87171"},
      {key:"Do Eau",             label:"Do Eau",     color:"#67e8f9"},
      {key:"Do Air",             label:"Do Air",     color:"#86efac"},
      {key:"Do Critique",        label:"Do Crit.",   color:"#fbbf24"},
    ]
  },
];

// Compute aggregated stats from equipped items
const computeStats = (slots) => {
  const totals = {};
  for (const item of Object.values(slots)) {
    if (!item?.effects) continue;
    for (const effect of item.effects) {
      const name = effect.type?.name || "";
      if (!name) continue;
      const val = effect.int_minimum ?? effect.int_maximum ?? 0;
      totals[name] = (totals[name]||0) + val;
    }
  }
  return totals;
};

const getName = (item) => {
  if (!item) return "";
  if (typeof item.name === "string") return item.name;
  if (item.name?.fr) return item.name.fr;
  return "";
};
const getImg = (item) => {
  if (!item) return null;
  return item.image_urls?.icon || item.img || null;
};

// ─── SLOT BUTTON ─────────────────────────────────────────────
function SlotBtn({ slot, item, onClick, size=52 }) {
  const hasItem = !!item;
  return (
    <button onClick={onClick}
      title={slot.label}
      style={{
        width:size,height:size,borderRadius:10,
        border:"1px solid "+(hasItem?T.accentBorder:T.border),
        background:hasItem?T.accentBg:T.dimmer,
        display:"flex",alignItems:"center",justifyContent:"center",
        cursor:"pointer",flexShrink:0,position:"relative",
        transition:"all 0.15s",padding:0,
        boxShadow:hasItem?"0 0 10px "+T.accent+"20":"none",
      }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent+"80";e.currentTarget.style.background=T.accentBg;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=hasItem?T.accentBorder:T.border;e.currentTarget.style.background=hasItem?T.accentBg:T.dimmer;}}
    >
      {hasItem && getImg(item) ? (
        <img src={getImg(item)} style={{width:size-10,height:size-10,objectFit:"contain",borderRadius:6}} alt="" onError={e=>e.target.style.display="none"} />
      ) : (
        <span style={{fontSize:size>44?20:14,opacity:0.4}}>{slot.icon}</span>
      )}
      {hasItem && (
        <div style={{position:"absolute",bottom:1,right:1,width:8,height:8,borderRadius:4,background:T.accent}} />
      )}
    </button>
  );
}

// ─── STAT ROW ────────────────────────────────────────────────
function StatRow({ label, value, color, suffix="" }) {
  const v = value||0;
  if (v===0) return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"2px 0"}}>
      <span style={{fontSize:11,color:T.muted}}>{label}</span>
      <span style={{fontSize:11,color:T.muted,fontWeight:500}}>0{suffix}</span>
    </div>
  );
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"2px 0"}}>
      <span style={{fontSize:11,color:T.textSub}}>{label}</span>
      <span style={{fontSize:12,color:color,fontWeight:700}}>{v>0?"+":""}{v}{suffix}</span>
    </div>
  );
}

// ─── BUILD CREATOR ────────────────────────────────────────────
export default function BuildCreator() {
  const [buildName, setBuildName]     = useState("Mon Build");
  const [level, setLevel]             = useState(200);
  const [classe, setClasse]           = useState("Iop");
  const [equipped, setEquipped]       = useState({});
  const [activeSlot, setActiveSlot]   = useState(null);
  const [search, setSearch]           = useState("");
  const [results, setResults]         = useState([]);
  const [searching, setSearching]     = useState(false);
  const [filterLevel, setFilterLevel] = useState("all");
  const [loading, setLoading]         = useState(false);
  const [tooltip, setTooltip]         = useState(null);
  const searchRef                     = useRef(null);
  const timeoutRef                    = useRef(null);

  const stats = computeStats(equipped);

  const searchItems = useCallback(async (q, type) => {
    if (!q||q.length<2) { setResults([]); return; }
    setSearching(true);
    try {
      const endpoint = type==="weapon" ? "weapons" : "equipment";
      let url = `${API}/items/${endpoint}/search?query=${encodeURIComponent(q)}&limit=20`;
      if (filterLevel==="1-50")    url+="&filter[min_level]=1&filter[max_level]=50";
      else if (filterLevel==="51-100")  url+="&filter[min_level]=51&filter[max_level]=100";
      else if (filterLevel==="101-150") url+="&filter[min_level]=101&filter[max_level]=150";
      else if (filterLevel==="151-200") url+="&filter[min_level]=151&filter[max_level]=200";
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data)?data:(data.items||data.data||[]));
    } catch(e) { setResults([]); }
    setSearching(false);
  },[filterLevel]);

  useEffect(()=>{
    if (!activeSlot) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(()=>searchItems(search, activeSlot.type), 350);
    return ()=>clearTimeout(timeoutRef.current);
  },[search, activeSlot, searchItems]);

  useEffect(()=>{
    if (activeSlot && searchRef.current) searchRef.current.focus();
  },[activeSlot]);

  const fetchAndEquip = async (item) => {
    setLoading(true);
    try {
      const id = item.ankama_id||item.id;
      const endpoint = activeSlot.type==="weapon"?"weapons":"equipment";
      const res = await fetch(`${API}/items/${endpoint}/${id}`);
      const full = await res.json();
      setEquipped(prev=>({...prev,[activeSlot.id]:full}));
    } catch(e) {
      setEquipped(prev=>({...prev,[activeSlot.id]:item}));
    }
    setLoading(false);
    setActiveSlot(null);
    setSearch(""); setResults([]);
  };

  const removeItem = (slotId, e) => {
    e?.stopPropagation();
    setEquipped(prev=>{ const n={...prev}; delete n[slotId]; return n; });
  };

  const equippedCount = Object.keys(equipped).length;

  const fi = {background:T.dimmer,border:"1px solid "+T.border,borderRadius:8,padding:"8px 12px",color:T.text,fontSize:13,outline:"none",fontFamily:T.font,boxSizing:"border-box"};

  return (
    <div style={{padding:"20px 26px",maxWidth:1400,margin:"0 auto",fontFamily:T.font}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,flexWrap:"wrap"}}>
        <input value={buildName} onChange={e=>setBuildName(e.target.value)}
          style={{...fi,fontSize:16,fontWeight:700,background:"transparent",border:"none",borderBottom:"2px solid "+T.accentBorder,borderRadius:0,padding:"4px 2px",width:220,color:T.text}}
          placeholder="Nom du build..." />
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <label style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase"}}>Niveau</label>
          <input type="number" min={1} max={200} value={level} onChange={e=>setLevel(parseInt(e.target.value)||1)}
            style={{...fi,width:70,textAlign:"center",padding:"6px 8px"}} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <label style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase"}}>Classe</label>
          <select value={classe} onChange={e=>setClasse(e.target.value)} style={{...fi,cursor:"pointer"}}>
            {CLASSES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:T.muted}}>{equippedCount}/16 slots</span>
          {equippedCount>0 && (
            <button onClick={()=>setEquipped({})} style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:7,padding:"5px 12px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>
              🗑️ Vider
            </button>
          )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr 220px",gap:14}}>

        {/* ── LEFT STATS ──────────────────────────────────── */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {STAT_GROUPS.map(group=>(
            <div key={group.label} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:T.accent,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>{group.label}</div>
              {group.stats.map(s=><StatRow key={s.key} label={s.label} value={stats[s.key]} color={s.color} suffix={s.suffix} />)}
            </div>
          ))}
        </div>

        {/* ── CENTER: EQUIPMENT GRID ───────────────────────── */}
        <div>
          <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"flex-start"}}>

            {/* Left slots */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SLOTS_LEFT.map(slot=>(
                <div key={slot.id} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{fontSize:9,color:T.muted,width:52,textAlign:"right",whiteSpace:"nowrap"}}>{slot.label}</div>
                  <div style={{position:"relative"}}>
                    <SlotBtn slot={slot} item={equipped[slot.id]} onClick={()=>setActiveSlot(slot)} />
                    {equipped[slot.id] && (
                      <button onClick={e=>removeItem(slot.id,e)} style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:8,background:T.danger,border:"none",color:"#fff",cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mannequin center */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
              {/* Mannequin */}
              <div style={{width:130,background:T.dimmer,border:"1px solid "+T.border,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"12px 0"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,"+T.accent+"40,transparent)"}} />
                <svg viewBox="0 0 100 220" width="90" height="198" style={{opacity:0.25}}>
                  {/* Head */}
                  <circle cx="50" cy="22" r="14" fill={T.accent} />
                  {/* Body */}
                  <rect x="30" y="38" width="40" height="55" rx="8" fill={T.accent} />
                  {/* Left arm */}
                  <rect x="8" y="40" width="20" height="50" rx="8" fill={T.accent} />
                  {/* Right arm */}
                  <rect x="72" y="40" width="20" height="50" rx="8" fill={T.accent} />
                  {/* Left leg */}
                  <rect x="28" y="94" width="19" height="60" rx="8" fill={T.accent} />
                  {/* Right leg */}
                  <rect x="53" y="94" width="19" height="60" rx="8" fill={T.accent} />
                  {/* Left foot */}
                  <rect x="20" y="148" width="27" height="14" rx="6" fill={T.accent} />
                  {/* Right foot */}
                  <rect x="53" y="148" width="27" height="14" rx="6" fill={T.accent} />
                </svg>
                <div style={{position:"absolute",bottom:6,fontSize:9,color:T.muted,letterSpacing:1}}>{classe.toUpperCase()}</div>
              </div>

              {/* Dofus row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginTop:4}}>
                {SLOTS_DOFUS.map(slot=>(
                  <div key={slot.id} style={{position:"relative"}}>
                    <SlotBtn slot={slot} item={equipped[slot.id]} onClick={()=>setActiveSlot(slot)} size={40} />
                    {equipped[slot.id] && (
                      <button onClick={e=>removeItem(slot.id,e)} style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:7,background:T.danger,border:"none",color:"#fff",cursor:"pointer",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right slots */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SLOTS_RIGHT.map(slot=>(
                <div key={slot.id} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{position:"relative"}}>
                    <SlotBtn slot={slot} item={equipped[slot.id]} onClick={()=>setActiveSlot(slot)} />
                    {equipped[slot.id] && (
                      <button onClick={e=>removeItem(slot.id,e)} style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:8,background:T.danger,border:"none",color:"#fff",cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>✕</button>
                    )}
                  </div>
                  <div style={{fontSize:9,color:T.muted,width:52,whiteSpace:"nowrap"}}>{slot.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items équipés — aperçu liste */}
          {equippedCount>0 && (
            <div style={{marginTop:14,background:T.surface,border:"1px solid "+T.border,borderRadius:11,padding:"10px 14px"}}>
              <div style={{fontSize:10,color:T.accent,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>📋 Items équipés</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {ALL_SLOTS.filter(s=>equipped[s.id]).map(slot=>{
                  const item = equipped[slot.id];
                  return (
                    <div key={slot.id} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:"1px solid "+T.border+"60"}}>
                      {getImg(item) ? <img src={getImg(item)} style={{width:24,height:24,objectFit:"contain",borderRadius:5,flexShrink:0}} alt="" onError={e=>e.target.style.display="none"} /> : <span style={{fontSize:14,flexShrink:0}}>{slot.icon}</span>}
                      <div style={{flex:1,minWidth:0}}>
                        <span style={{fontSize:11,color:T.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{getName(item)}</span>
                      </div>
                      <span style={{fontSize:9,color:T.muted,flexShrink:0}}>Niv.{item.level}</span>
                      <button onClick={()=>removeItem(slot.id)} style={{background:"transparent",border:"none",color:T.danger,cursor:"pointer",fontSize:11,padding:0,flexShrink:0}}>✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT STATS ──────────────────────────────────── */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {RES_GROUPS.map(group=>(
            <div key={group.label} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,padding:"12px 14px"}}>
              <div style={{fontSize:10,color:T.accent,letterSpacing:1.5,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>{group.label}</div>
              {group.stats.map(s=><StatRow key={s.key} label={s.label} value={stats[s.key]} color={s.color} />)}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL RECHERCHE ITEM ──────────────────────────── */}
      {activeSlot && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(10px)"}}
          onClick={e=>{if(e.target===e.currentTarget){setActiveSlot(null);setSearch("");setResults();}}}>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:18,padding:"22px",width:"100%",maxWidth:480,boxShadow:"0 40px 80px rgba(0,0,0,0.9)",margin:16,maxHeight:"80vh",display:"flex",flexDirection:"column",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+T.accent+","+T.accent2+")",borderRadius:"18px 18px 0 0"}} />
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:T.text}}>{activeSlot.icon} {activeSlot.label}</div>
                <div style={{fontSize:10,color:T.muted,marginTop:1}}>{activeSlot.type==="weapon"?"Arme":"Équipement"}</div>
              </div>
              <button onClick={()=>{setActiveSlot(null);setSearch("");setResults([]);}} style={{background:T.dimmer,border:"1px solid "+T.border,borderRadius:7,padding:"3px 9px",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13}}>✕</button>
            </div>

            <div style={{display:"flex",gap:7,marginBottom:10}}>
              <div style={{position:"relative",flex:1}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:12}}>🔍</span>
                <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder={`Chercher ${activeSlot.label.toLowerCase()}...`}
                  style={{...fi,width:"100%",paddingLeft:32,fontSize:13}} />
                {searching && <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:T.accent,fontSize:11}}>⏳</span>}
              </div>
              <select value={filterLevel} onChange={e=>setFilterLevel(e.target.value)} style={{...fi,width:"auto",cursor:"pointer",fontSize:12}}>
                <option value="all">Tous niveaux</option>
                <option value="1-50">1–50</option>
                <option value="51-100">51–100</option>
                <option value="101-150">101–150</option>
                <option value="151-200">151–200</option>
              </select>
            </div>

            {loading && <div style={{textAlign:"center",padding:"20px",color:T.accent,fontSize:13}}>⏳ Chargement des stats...</div>}

            <div style={{overflowY:"auto",flex:1,display:"flex",flexDirection:"column",gap:4}}>
              {results.length===0 && search.length>=2 && !searching && (
                <div style={{textAlign:"center",padding:"30px",color:T.muted,fontSize:12}}>Aucun résultat pour "{search}"</div>
              )}
              {search.length<2 && (
                <div style={{textAlign:"center",padding:"30px",color:T.muted,fontSize:12}}>✏️ Tape au moins 2 lettres pour rechercher</div>
              )}
              {results.map(item=>{
                const id = item.ankama_id||item.id;
                return (
                  <div key={id} onClick={()=>fetchAndEquip(item)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:T.dimmer,border:"1px solid "+T.border,borderRadius:9,cursor:"pointer",transition:"all 0.12s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=T.accentBg;e.currentTarget.style.borderColor=T.accentBorder;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=T.dimmer;e.currentTarget.style.borderColor=T.border;}}>
                    {getImg(item) ? (
                      <img src={getImg(item)} style={{width:36,height:36,objectFit:"contain",borderRadius:7,flexShrink:0}} alt="" onError={e=>e.target.style.display="none"} />
                    ) : (
                      <div style={{width:36,height:36,borderRadius:7,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{activeSlot.icon}</div>
                    )}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getName(item)}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:1}}>Niv. {item.level}</div>
                    </div>
                    <div style={{fontSize:10,color:T.accent,fontWeight:600,flexShrink:0}}>Équiper →</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
