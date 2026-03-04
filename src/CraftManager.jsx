import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const API = "https://api.dofusdu.de/dofus3/v1/fr";

const T = {
  bg:           "#0f0d0a",
  surface:      "#17140f",
  border:       "#2c2316",
  accent:       "#f59e0b",
  accent2:      "#fbbf24",
  accentBg:     "#f59e0b14",
  accentBorder: "#f59e0b35",
  text:         "#fef3c7",
  textSub:      "#92816a",
  muted:        "#57483a",
  dimmer:       "#211c12",
  danger:       "#f87171",
  success:      "#34d399",
  font:         "'DM Sans', system-ui, sans-serif",
};

const fi = { background:T.dimmer, border:"1px solid "+T.border, borderRadius:9, padding:"10px 14px", color:T.text, fontSize:13, outline:"none", fontFamily:T.font, boxSizing:"border-box" };

export default function CraftManager({ session }) {
  const [search, setSearch]               = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]         = useState(false);
  const [craftList, setCraftList]         = useState([]);
  const [bankResources, setBankResources] = useState({});
  const [calculated, setCalculated]       = useState(null);
  const [savedCrafts, setSavedCrafts]     = useState([]);
  const [activeItem, setActiveItem]       = useState(null);
  const [toast, setToast]                 = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [filterLevel, setFilterLevel]     = useState("all");
  const searchTimeout                     = useRef(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  useEffect(() => { if (session) loadSavedCrafts(); }, [session]);

  const loadSavedCrafts = async () => {
    const { data, error } = await supabase.from("craft_lists").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (!error && data) setSavedCrafts(data);
  };

  const getName = (item) => {
    if (!item) return "";
    if (typeof item.name === "string") return item.name;
    if (item.name && item.name.fr) return item.name.fr;
    return "";
  };

  const getImg = (item) => {
    if (!item) return null;
    if (item.image_urls && item.image_urls.icon) return item.image_urls.icon;
    if (item.img) return item.img;
    return null;
  };

  const searchItems = useCallback(async (q) => {
    if (!q || q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      let url = API + "/items/equipment/search?query=" + encodeURIComponent(q) + "&limit=20";
      if (filterLevel === "1-50")    url += "&filter[min_level]=1&filter[max_level]=50";
      else if (filterLevel === "51-100")  url += "&filter[min_level]=51&filter[max_level]=100";
      else if (filterLevel === "101-150") url += "&filter[min_level]=101&filter[max_level]=150";
      else if (filterLevel === "151-200") url += "&filter[min_level]=151&filter[max_level]=200";
      const res  = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : (data.items || data.data || []));
    } catch (e) { console.error("Search error:", e); setSearchResults([]); }
    setSearching(false);
  }, [filterLevel]);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchItems(search), 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, searchItems]);

  const fetchRecipe = async (item) => {
    setLoadingRecipe(true);
    try {
      const id  = item.ankama_id || item.id;
      const res = await fetch(API + "/items/equipment/" + id);
      if (!res.ok) throw new Error("Item introuvable");
      const data = await res.json();
      if (data.recipe && Array.isArray(data.recipe) && data.recipe.length > 0) {
        return { ingredients: data.recipe.map(e => ({ id:(e.item&&(e.item.ankama_id||e.item.id))||Math.random(), name:(e.item&&e.item.name)||"", img:(e.item&&e.item.image_urls&&e.item.image_urls.icon)||null, quantity:e.quantity||1 })) };
      }
      return null;
    } catch (e) { console.error("fetchRecipe error:", e); return null; }
    finally { setLoadingRecipe(false); }
  };

  const addToCraftList = async (item) => {
    const id       = item.ankama_id || item.id;
    const existing = craftList.find(c => (c.item.ankama_id||c.item.id)===id);
    if (existing) {
      setCraftList(craftList.map(c => (c.item.ankama_id||c.item.id)===id ? {...c,qty:c.qty+1} : c));
      showToast("+1 "+getName(item)+" dans la liste");
      return;
    }
    const recipe = await fetchRecipe(item);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length===0) { showToast("Pas de recette pour "+getName(item),"error"); return; }
    setCraftList(prev => [...prev, {item:{...item,recipe},qty:1}]);
    setSearch(""); setSearchResults([]);
    showToast(getName(item)+" ajouté ✓");
  };

  const removeFromList = (id) => {
    setCraftList(craftList.filter(c=>(c.item.ankama_id||c.item.id)!==id));
    if ((activeItem&&(activeItem.ankama_id||activeItem.id))===id) setActiveItem(null);
    setCalculated(null);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCraftList(craftList.map(c=>(c.item.ankama_id||c.item.id)===id?{...c,qty}:c));
    setCalculated(null);
  };

  const calculate = () => {
    if (craftList.length===0) return;
    const totals = {};
    for (const {item,qty} of craftList) {
      if (!item.recipe||!item.recipe.ingredients) continue;
      for (const ing of item.recipe.ingredients) {
        if (!totals[ing.id]) totals[ing.id] = {...ing,needed:0};
        totals[ing.id].needed += (ing.quantity||1)*qty;
      }
    }
    setCalculated(Object.values(totals).map(r => ({...r,inBank:bankResources[r.id]||0,missing:Math.max(0,r.needed-(bankResources[r.id]||0))})));
  };

  const saveCraftList = async () => {
    if (craftList.length===0) return showToast("La liste est vide !","error");
    const name = "Craft du "+new Date().toLocaleDateString("fr-FR");
    const { error } = await supabase.from("craft_lists").insert([{user_id:session.user.id,name,items:JSON.stringify(craftList),bank:JSON.stringify(bankResources)}]);
    if (error) return showToast("Erreur de sauvegarde","error");
    await loadSavedCrafts();
    showToast("Liste sauvegardée ✓");
  };

  const loadCraftList = (saved) => {
    try { setCraftList(JSON.parse(saved.items)); setBankResources(JSON.parse(saved.bank||"{}")); setCalculated(null); showToast(saved.name+" chargée ✓"); }
    catch (e) { showToast("Erreur lors du chargement","error"); }
  };

  const deleteSaved = async (id) => {
    await supabase.from("craft_lists").delete().eq("id",id);
    await loadSavedCrafts();
    showToast("Liste supprimée");
  };

  // ── UI helper ─────────────────────────────────────────────
  const Section = ({children, style={}}) => (
    <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:14,padding:18,...style}}>{children}</div>
  );

  const SectionTitle = ({children}) => (
    <div style={{fontSize:11,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700,fontFamily:T.font}}>{children}</div>
  );

  return (
    <div style={{position:"relative",zIndex:1,fontFamily:T.font}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"22px 26px"}}>

        {/* Header */}
        <div style={{marginBottom:20}}>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:T.text,display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:36,height:36,borderRadius:9,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚗️</span>
            Craft Manager
          </h2>
          <p style={{margin:"6px 0 0",color:T.muted,fontSize:13}}>Recherche des items craftables, calcule les ressources manquantes.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

          {/* ── LEFT ────────────────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Recherche */}
            <Section>
              <SectionTitle>🔍 Rechercher un item</SectionTitle>
              <div style={{marginBottom:10}}>
                <select value={filterLevel} onChange={e=>setFilterLevel(e.target.value)} style={{...fi,width:"100%",cursor:"pointer"}}>
                  <option value="all">Tous niveaux</option>
                  <option value="1-50">1 – 50</option>
                  <option value="51-100">51 – 100</option>
                  <option value="101-150">101 – 150</option>
                  <option value="151-200">151 – 200</option>
                </select>
              </div>
              <div style={{position:"relative"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ex: Anneau du Bouftou..." style={{...fi,width:"100%"}} />
                {searching && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:T.accent}}>⏳</div>}
              </div>
              {searchResults.length > 0 && (
                <div style={{marginTop:8,background:T.dimmer,border:"1px solid "+T.accentBorder,borderRadius:10,overflow:"hidden",maxHeight:280,overflowY:"auto"}}>
                  {searchResults.map(item => {
                    const id = item.ankama_id||item.id;
                    return (
                      <div key={id} onClick={()=>addToCraftList(item)}
                        style={{display:"flex",alignItems:"center",gap:9,padding:"9px 13px",cursor:"pointer",borderBottom:"1px solid "+T.border}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.accentBg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        {getImg(item) && <img src={getImg(item)} style={{width:30,height:30,objectFit:"contain",borderRadius:6}} alt="" onError={e=>e.target.style.display="none"} />}
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13,color:T.text}}>{getName(item)}</div>
                          <div style={{fontSize:10,color:T.muted}}>Niv. {item.level}</div>
                        </div>
                        <div style={{fontSize:11,color:T.accent,fontWeight:600}}>+ Ajouter</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {loadingRecipe && <div style={{marginTop:8,color:T.accent,fontSize:12,textAlign:"center"}}>⏳ Chargement de la recette...</div>}
            </Section>

            {/* File de craft */}
            <Section style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <SectionTitle style={{margin:0}}>🎒 File de craft ({craftList.length})</SectionTitle>
                {craftList.length > 0 && (
                  <button onClick={()=>{setCraftList([]);setCalculated(null);setActiveItem(null);}}
                    style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:7,padding:"4px 10px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>
                    🗑️ Vider
                  </button>
                )}
              </div>
              {craftList.length===0 ? (
                <div style={{textAlign:"center",padding:"28px 0",color:T.muted,fontSize:12}}>
                  <div style={{fontSize:30,marginBottom:7}}>⚗️</div>Recherche un item pour commencer
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {craftList.map(c => {
                    const id       = c.item.ankama_id||c.item.id;
                    const isActive = activeItem&&(activeItem.ankama_id||activeItem.id)===id;
                    return (
                      <div key={id} onClick={()=>setActiveItem(c.item)}
                        style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:isActive?T.accentBg:T.dimmer,border:"1px solid "+(isActive?T.accentBorder:T.border),borderRadius:9,cursor:"pointer",transition:"all 0.15s"}}>
                        {getImg(c.item) && <img src={getImg(c.item)} style={{width:34,height:34,objectFit:"contain",borderRadius:7,flexShrink:0}} alt="" onError={e=>e.target.style.display="none"} />}
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:12,color:T.text}}>{getName(c.item)}</div>
                          <div style={{fontSize:10,color:T.muted}}>Niv. {c.item.level}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <button onClick={e=>{e.stopPropagation();updateQty(id,c.qty-1);}} style={{width:22,height:22,borderRadius:5,border:"1px solid "+T.border,background:T.surface,color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:13}}>−</button>
                          <span style={{minWidth:22,textAlign:"center",fontWeight:700,color:T.accent,fontSize:13}}>{c.qty}</span>
                          <button onClick={e=>{e.stopPropagation();updateQty(id,c.qty+1);}} style={{width:22,height:22,borderRadius:5,border:"1px solid "+T.border,background:T.surface,color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:13}}>+</button>
                          <button onClick={e=>{e.stopPropagation();removeFromList(id);}} style={{width:22,height:22,borderRadius:5,border:"1px solid rgba(248,113,113,0.2)",background:"rgba(248,113,113,0.08)",color:T.danger,cursor:"pointer",fontFamily:T.font,fontSize:11}}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {craftList.length > 0 && (
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button onClick={calculate} style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:12,boxShadow:"0 4px 14px "+T.accent+"35"}}>⚗️ Calculer les ressources</button>
                  <button onClick={saveCraftList} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid "+T.accentBorder,background:T.accentBg,color:T.accent,fontWeight:600,cursor:"pointer",fontFamily:T.font,fontSize:12}}>💾 Sauver</button>
                </div>
              )}
            </Section>
          </div>

          {/* ── RIGHT ───────────────────────────────────────── */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Recette */}
            {activeItem && (
              <Section>
                <SectionTitle>📋 Recette</SectionTitle>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14,padding:"10px 12px",background:T.dimmer,borderRadius:9,border:"1px solid "+T.border}}>
                  {getImg(activeItem) && <img src={getImg(activeItem)} style={{width:44,height:44,objectFit:"contain",borderRadius:9}} alt="" onError={e=>e.target.style.display="none"} />}
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:T.text}}>{getName(activeItem)}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>Niv. {activeItem.level}</div>
                  </div>
                </div>
                {activeItem.recipe && activeItem.recipe.ingredients && activeItem.recipe.ingredients.length > 0 ? (
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {activeItem.recipe.ingredients.map((ing,i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 11px",background:T.dimmer,borderRadius:8,border:"1px solid "+T.border}}>
                        {ing.img && <img src={ing.img} style={{width:26,height:26,objectFit:"contain",borderRadius:5}} alt="" onError={e=>e.target.style.display="none"} />}
                        <div style={{flex:1,fontSize:12,color:T.textSub}}>{typeof ing.name==="string"?ing.name:(ing.name&&ing.name.fr)||""}</div>
                        <div style={{fontWeight:700,color:T.accent,fontSize:13}}>x{ing.quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:"8px 0"}}>Aucune recette disponible</div>}
              </Section>
            )}

            {/* Ressources calculées */}
            {calculated && (
              <Section style={{flex:1}}>
                <SectionTitle>🧮 Ressources nécessaires ({calculated.length})</SectionTitle>
                <div style={{marginBottom:12,padding:"9px 13px",background:T.accentBg,borderRadius:8,border:"1px solid "+T.accentBorder,fontSize:12,color:T.accent}}>
                  💡 Indique tes ressources en banque pour voir ce qu'il manque
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:380,overflowY:"auto"}}>
                  {calculated.map((r,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 11px",background:r.missing===0?"rgba(52,211,153,0.05)":T.dimmer,borderRadius:8,border:"1px solid "+(r.missing===0?"rgba(52,211,153,0.18)":T.border)}}>
                      {r.img && <img src={r.img} style={{width:26,height:26,objectFit:"contain",borderRadius:5,flexShrink:0}} alt="" onError={e=>e.target.style.display="none"} />}
                      <div style={{flex:1,fontSize:12,color:T.textSub}}>{typeof r.name==="string"?r.name:(r.name&&r.name.fr)||""}</div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <input type="number" min={0} value={bankResources[r.id]||""} placeholder="Banque"
                          onChange={e=>{setBankResources(prev=>{const next={...prev};next[r.id]=parseInt(e.target.value)||0;return next;});}}
                          style={{width:60,background:T.surface,border:"1px solid "+T.border,borderRadius:6,padding:"3px 7px",color:T.textSub,fontSize:11,outline:"none",fontFamily:T.font,textAlign:"center"}} />
                        <div style={{minWidth:55,textAlign:"right"}}>
                          <span style={{fontWeight:700,color:r.missing===0?T.success:T.danger,fontSize:13}}>{r.missing===0?"✓":"-"+r.missing}</span>
                          <span style={{fontSize:10,color:T.muted,marginLeft:3}}>/ {r.needed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={calculate} style={{width:"100%",marginTop:10,padding:"9px",borderRadius:8,border:"1px solid "+T.accentBorder,background:T.accentBg,color:T.accent,fontWeight:600,cursor:"pointer",fontFamily:T.font,fontSize:12}}>🔄 Recalculer avec la banque</button>
              </Section>
            )}

            {/* Listes sauvegardées */}
            {savedCrafts.length > 0 && (
              <Section>
                <SectionTitle>💾 Listes sauvegardées</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {savedCrafts.map(s => (
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:T.dimmer,borderRadius:9,border:"1px solid "+T.border}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:12,color:T.text}}>{s.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{JSON.parse(s.items||"[]").length} items</div>
                      </div>
                      <button onClick={()=>loadCraftList(s)} style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:7,padding:"4px 10px",color:T.accent,cursor:"pointer",fontSize:11,fontFamily:T.font}}>Charger</button>
                      <button onClick={()=>deleteSaved(s.id)} style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:7,padding:"4px 10px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>✕</button>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:toast.type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,padding:"11px 18px",borderRadius:11,fontWeight:700,fontSize:13,boxShadow:"0 10px 36px rgba(0,0,0,0.5)",zIndex:200,fontFamily:T.font,display:"flex",alignItems:"center",gap:7}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
