import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const API = "https://api.dofusdu.de/dofus3/v1/fr";

export default function CraftManager({ session }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [craftList, setCraftList] = useState([]);
  const [bankResources, setBankResources] = useState({});
  const [calculated, setCalculated] = useState(null);
  const [savedCrafts, setSavedCrafts] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [filterLevel, setFilterLevel] = useState("all");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  // clé = ingId, valeur = tableau d'ingrédients ou "none" si pas de recette
  const [subRecipes, setSubRecipes] = useState({});
  const [expandedIngredients, setExpandedIngredients] = useState({});
  const [loadingSubRecipe, setLoadingSubRecipe] = useState({});
  const searchTimeout = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => { if (session) loadSavedCrafts(); }, [session]);

  const loadSavedCrafts = async () => {
    const { data, error } = await supabase.from("craft_lists").select("*")
      .eq("user_id", session.user.id).order("created_at", { ascending: false });
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

  const ingName = (ing) => typeof ing.name === "string" ? ing.name : (ing.name && ing.name.fr) || "";

  // Calcul auto dès que craftList ou bankResources change
  const doCalculate = useCallback((list, bank) => {
    if (!list || list.length === 0) { setCalculated(null); return; }
    const totals = {};
    for (let ci = 0; ci < list.length; ci++) {
      const item = list[ci].item;
      const qty = list[ci].qty;
      if (!item.recipe || !item.recipe.ingredients) continue;
      for (let ii = 0; ii < item.recipe.ingredients.length; ii++) {
        const ing = item.recipe.ingredients[ii];
        const key = ing.id;
        if (!totals[key]) totals[key] = Object.assign({}, ing, { needed: 0 });
        totals[key].needed += (ing.quantity || 1) * qty;
      }
    }
    const result = Object.values(totals).map(function(r) {
      return Object.assign({}, r, {
        missing: Math.max(0, r.needed - (bank[r.id] || 0)),
      });
    });
    setCalculated(result);
  }, []);

  useEffect(() => {
    doCalculate(craftList, bankResources);
  }, [craftList, bankResources, doCalculate]);

  const searchItems = useCallback(async (q) => {
    if (!q || q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      let url = API + "/items/equipment/search?query=" + encodeURIComponent(q) + "&limit=20";
      if (filterLevel === "1-50") url += "&filter[min_level]=1&filter[max_level]=50";
      else if (filterLevel === "51-100") url += "&filter[min_level]=51&filter[max_level]=100";
      else if (filterLevel === "101-150") url += "&filter[min_level]=101&filter[max_level]=150";
      else if (filterLevel === "151-200") url += "&filter[min_level]=151&filter[max_level]=200";
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : (data.items || data.data || []));
    } catch (e) { setSearchResults([]); }
    setSearching(false);
  }, [filterLevel]);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchItems(search), 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, searchItems]);

  const fetchIngredient = async (ingId, subtype) => {
    const endpoint = subtype === "equipment" ? "equipment"
      : subtype === "consumables" ? "consumables"
      : "resources";
    try {
      const r = await fetch(API + "/items/" + endpoint + "/" + ingId);
      if (r.ok) {
        const d = await r.json();
        return { name: d.name || "", img: (d.image_urls && d.image_urls.icon) || null };
      }
    } catch (_) {}
    for (const ep of ["resources", "equipment", "consumables"]) {
      if (ep === endpoint) continue;
      try {
        const r = await fetch(API + "/items/" + ep + "/" + ingId);
        if (r.ok) {
          const d = await r.json();
          return { name: d.name || "", img: (d.image_urls && d.image_urls.icon) || null };
        }
      } catch (_) {}
    }
    return { name: "", img: null };
  };

  const parseRecipeIngredients = async (recipe) => {
    return Promise.all(
      recipe.map(async function(e) {
        const ingId = e.item_ankama_id;
        const subtype = e.item_subtype || "resources";
        if (!ingId) return { id: Math.random(), name: "?", img: null, quantity: e.quantity || 1, subtype: "resources" };
        const details = await fetchIngredient(ingId, subtype);
        return { id: ingId, name: details.name, img: details.img, quantity: e.quantity || 1, subtype };
      })
    );
  };

  const fetchRecipe = async (item) => {
    setLoadingRecipe(true);
    try {
      const id = item.ankama_id || item.id;
      const res = await fetch(API + "/items/equipment/" + id);
      if (!res.ok) throw new Error("Item introuvable");
      const data = await res.json();
      if (data.recipe && Array.isArray(data.recipe) && data.recipe.length > 0) {
        const ingredients = await parseRecipeIngredients(data.recipe);
        return { ingredients };
      }
      return null;
    } catch (e) { return null; }
    finally { setLoadingRecipe(false); }
  };

  // ✅ Tente de charger la sous-recette pour N'IMPORTE quel ingrédient
  // Si pas de recette → stocke "none" pour ne plus retenter
  const toggleSubRecipe = async (ing, parentQty) => {
    const key = ing.id;

    // Ferme si déjà ouvert
    if (expandedIngredients[key]) {
      setExpandedIngredients(function(prev) { var n = Object.assign({}, prev); delete n[key]; return n; });
      return;
    }

    // Déjà chargé (même "none") → ouvre ou ignore
    if (subRecipes[key] !== undefined) {
      if (subRecipes[key] !== "none") {
        setExpandedIngredients(function(prev) { return Object.assign({}, prev, { [key]: true }); });
      }
      return;
    }

    setLoadingSubRecipe(function(prev) { return Object.assign({}, prev, { [key]: true }); });
    try {
      const res = await fetch(API + "/items/equipment/" + key);
      if (!res.ok) {
        // Pas un équipement craftable
        setSubRecipes(function(prev) { return Object.assign({}, prev, { [key]: "none" }); });
        return;
      }
      const data = await res.json();
      if (!data.recipe || data.recipe.length === 0) {
        setSubRecipes(function(prev) { return Object.assign({}, prev, { [key]: "none" }); });
        return;
      }
      const subIngredients = await parseRecipeIngredients(data.recipe);
      setSubRecipes(function(prev) { return Object.assign({}, prev, { [key]: subIngredients }); });
      setExpandedIngredients(function(prev) { return Object.assign({}, prev, { [key]: true }); });
    } finally {
      setLoadingSubRecipe(function(prev) { var n = Object.assign({}, prev); delete n[key]; return n; });
    }
  };

  const addIngredientToCraft = async (ing) => {
    const existing = craftList.find(function(c) { return (c.item.ankama_id || c.item.id) === ing.id; });
    if (existing) {
      setCraftList(craftList.map(function(c) {
        return (c.item.ankama_id || c.item.id) === ing.id ? Object.assign({}, c, { qty: c.qty + 1 }) : c;
      }));
      showToast("+1 " + ingName(ing) + " dans la liste");
      return;
    }
    setLoadingRecipe(true);
    try {
      const res = await fetch(API + "/items/equipment/" + ing.id);
      if (!res.ok) return showToast("Pas de recette pour " + ingName(ing), "error");
      const data = await res.json();
      if (!data.recipe || data.recipe.length === 0) return showToast("Pas de recette pour " + ingName(ing), "error");
      const ingredients = await parseRecipeIngredients(data.recipe);
      const itemWithRecipe = Object.assign({}, data, { recipe: { ingredients } });
      setCraftList(function(prev) { return prev.concat([{ item: itemWithRecipe, qty: 1 }]); });
      showToast(getName(data) + " ajouté ✓");
    } finally {
      setLoadingRecipe(false);
    }
  };

  const addToCraftList = async (item) => {
    const id = item.ankama_id || item.id;
    const existing = craftList.find(function(c) { return (c.item.ankama_id || c.item.id) === id; });
    if (existing) {
      setCraftList(craftList.map(function(c) {
        return (c.item.ankama_id || c.item.id) === id ? Object.assign({}, c, { qty: c.qty + 1 }) : c;
      }));
      showToast("+1 " + getName(item) + " dans la liste");
      return;
    }
    const recipe = await fetchRecipe(item);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      showToast("Pas de recette pour " + getName(item), "error");
      return;
    }
    setCraftList(function(prev) { return prev.concat([{ item: Object.assign({}, item, { recipe: recipe }), qty: 1 }]); });
    showToast(getName(item) + " ajouté ✓");
  };

  const removeFromList = (id) => {
    setCraftList(craftList.filter(function(c) { return (c.item.ankama_id || c.item.id) !== id; }));
    if ((activeItem && (activeItem.ankama_id || activeItem.id)) === id) setActiveItem(null);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCraftList(craftList.map(function(c) {
      return (c.item.ankama_id || c.item.id) === id ? Object.assign({}, c, { qty: qty }) : c;
    }));
  };

  const openSaveModal = () => {
    if (craftList.length === 0) return showToast("La liste est vide !", "error");
    setSaveName("Craft du " + new Date().toLocaleDateString("fr-FR"));
    setShowSaveModal(true);
  };

  const confirmSave = async () => {
    const name = saveName.trim() || "Craft du " + new Date().toLocaleDateString("fr-FR");
    const { error } = await supabase.from("craft_lists").insert([{
      user_id: session.user.id, name: name,
      items: JSON.stringify(craftList), bank: JSON.stringify(bankResources),
    }]);
    if (error) return showToast("Erreur de sauvegarde", "error");
    setShowSaveModal(false);
    setSaveName("");
    await loadSavedCrafts();
    showToast("\"" + name + "\" sauvegardée ✓");
  };

  const loadCraftList = (saved) => {
    try {
      setCraftList(JSON.parse(saved.items));
      setBankResources(JSON.parse(saved.bank || "{}"));
      setSubRecipes({});
      setExpandedIngredients({});
      showToast(saved.name + " chargée ✓");
    } catch (e) { showToast("Erreur lors du chargement", "error"); }
  };

  const deleteSaved = async (id) => {
    await supabase.from("craft_lists").delete().eq("id", id);
    await loadSavedCrafts();
    showToast("Liste supprimée");
  };

  const confirmRename = async (id) => {
    const name = renameValue.trim();
    if (!name) return;
    const { error } = await supabase.from("craft_lists").update({ name }).eq("id", id);
    if (error) return showToast("Erreur de renommage", "error");
    setRenamingId(null);
    setRenameValue("");
    await loadSavedCrafts();
    showToast("Renommée ✓");
  };

  // ✅ Bouton ▼ sur TOUS les ingrédients — disparaît si pas de recette après fetch
  const renderIngredient = (ing, i, parentQty, depth) => {
    if (depth === undefined) depth = 0;
    const isExpanded = !!expandedIngredients[ing.id];
    const isLoadingSub = !!loadingSubRecipe[ing.id];
    const isInList = craftList.some(function(c){ return (c.item.ankama_id || c.item.id) === ing.id; });
    const subData = subRecipes[ing.id]; // undefined = pas encore tenté, "none" = pas de recette, tableau = recette
    const hasNoRecipe = subData === "none";
    const subIngs = Array.isArray(subData) ? subData : null;
    const totalQty = ing.quantity * (parentQty || 1);

    return (
      <div key={ing.id + "-" + i + "-" + depth}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",marginLeft:depth*20,background:depth===0?"rgba(255,255,255,0.02)":depth===1?"rgba(99,102,241,0.05)":"rgba(99,102,241,0.08)",borderRadius:9,border:"1px solid "+(depth===0?"rgba(255,255,255,0.04)":"rgba(99,102,241,0.12)"),marginBottom:4,borderLeft:depth>0?"2px solid rgba(99,102,241,0.3)":"1px solid rgba(255,255,255,0.04)"}}>
          {ing.img && <img src={ing.img} style={{width:depth===0?28:24,height:depth===0?28:24,objectFit:"contain",borderRadius:6,flexShrink:0}} alt="" onError={function(e){e.target.style.display="none";}} />}
          <div style={{flex:1,fontSize:depth===0?13:12,color:depth===0?"#cbd5e1":"#94a3b8"}}>{ingName(ing)}</div>
          <div style={{fontWeight:700,color:"#818cf8",fontSize:depth===0?14:12}}>x{totalQty}</div>
          <div style={{display:"flex",gap:4}}>
            {/* Bouton Crafter : visible si déjà confirmé craftable */}
            {Array.isArray(subData) && (
              <button onClick={function(e){ e.stopPropagation(); addIngredientToCraft(ing); }}
                style={{background:isInList?"rgba(34,197,94,0.1)":"rgba(99,102,241,0.15)",border:"1px solid "+(isInList?"rgba(34,197,94,0.3)":"rgba(99,102,241,0.3)"),borderRadius:7,padding:"3px 8px",color:isInList?"#22c55e":"#818cf8",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {isInList ? "✓" : "⚗️ Crafter"}
              </button>
            )}
            {/* Bouton ▼ : visible tant qu'on n'a pas confirmé "none" */}
            {!hasNoRecipe && (
              <button onClick={function(e){ e.stopPropagation(); toggleSubRecipe(ing, parentQty); }}
                style={{background:isExpanded?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.04)",border:"1px solid "+(isExpanded?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.1)"),borderRadius:7,padding:"3px 8px",color:isExpanded?"#818cf8":"#475569",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>
                {isLoadingSub ? "⏳" : isExpanded ? "▲" : "▼"}
              </button>
            )}
          </div>
        </div>
        {isExpanded && subIngs && (
          <div>
            {subIngs.map(function(sub, si) { return renderIngredient(sub, si, totalQty, depth + 1); })}
          </div>
        )}
      </div>
    );
  };

  const fi = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div style={{position:"relative",zIndex:1}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"26px 28px"}}>
        <div style={{marginBottom:24}}>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#f1f5f9"}}>⚗️ Craft Manager</h2>
          <p style={{margin:"6px 0 0",color:"#475569",fontSize:14}}>Recherche des items craftables, calcule les ressources manquantes.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20}}>
              <div style={{fontSize:12,color:"#6366f1",letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>🔍 Rechercher un item</div>
              <div style={{marginBottom:12}}>
                <select value={filterLevel} onChange={function(e){setFilterLevel(e.target.value);}} style={{...fi,width:"100%",cursor:"pointer",fontSize:12}}>
                  <option value="all">Tous niveaux</option>
                  <option value="1-50" style={{background:"#0d0f1a"}}>1 – 50</option>
                  <option value="51-100" style={{background:"#0d0f1a"}}>51 – 100</option>
                  <option value="101-150" style={{background:"#0d0f1a"}}>101 – 150</option>
                  <option value="151-200" style={{background:"#0d0f1a"}}>151 – 200</option>
                </select>
              </div>
              <div style={{position:"relative"}}>
                <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="ex: Anneau du Bouftou..." style={{...fi,width:"100%"}} />
                {searching && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#6366f1"}}>⏳</div>}
              </div>
              {searchResults.length > 0 && (
                <div style={{marginTop:8,background:"#0d0f1a",border:"1px solid rgba(99,102,241,0.2)",borderRadius:12,overflow:"hidden",maxHeight:300,overflowY:"auto"}}>
                  {searchResults.map(function(item) {
                    const id = item.ankama_id || item.id;
                    const alreadyAdded = craftList.some(function(c){ return (c.item.ankama_id || c.item.id) === id; });
                    return (
                      <div key={id} onClick={function(){addToCraftList(item);}}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)",opacity:alreadyAdded?0.5:1}}
                        onMouseEnter={function(e){e.currentTarget.style.background="rgba(99,102,241,0.1)";}}
                        onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                        {getImg(item) && <img src={getImg(item)} style={{width:32,height:32,objectFit:"contain",borderRadius:6}} alt="" onError={function(e){e.target.style.display="none";}} />}
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13,color:"#f1f5f9"}}>{getName(item)}</div>
                          <div style={{fontSize:11,color:"#475569"}}>Niv. {item.level}</div>
                        </div>
                        <div style={{fontSize:11,color:alreadyAdded?"#475569":"#6366f1",fontWeight:600}}>{alreadyAdded ? "✓ Ajouté" : "+ Ajouter"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {loadingRecipe && <div style={{marginTop:8,color:"#6366f1",fontSize:13,textAlign:"center"}}>⏳ Chargement de la recette...</div>}
            </div>

            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontSize:12,color:"#6366f1",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>🎒 File de craft ({craftList.length})</div>
                {craftList.length > 0 && <button onClick={function(){setCraftList([]);setCalculated(null);setActiveItem(null);}} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:7,padding:"4px 10px",color:"#f87171",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🗑️ Vider</button>}
              </div>
              {craftList.length === 0 ? (
                <div style={{textAlign:"center",padding:"30px 0",color:"#334155",fontSize:13}}>
                  <div style={{fontSize:32,marginBottom:8}}>⚗️</div>Recherche un item pour commencer
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {craftList.map(function(c) {
                    const id = c.item.ankama_id || c.item.id;
                    const isActive = activeItem && (activeItem.ankama_id || activeItem.id) === id;
                    return (
                      <div key={id} onClick={function(){setActiveItem(c.item);setExpandedIngredients({});setSubRecipes({});}}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:isActive?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.02)",border:"1px solid "+(isActive?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer"}}>
                        {getImg(c.item) && <img src={getImg(c.item)} style={{width:36,height:36,objectFit:"contain",borderRadius:8,flexShrink:0}} alt="" onError={function(e){e.target.style.display="none";}} />}
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13,color:"#f1f5f9"}}>{getName(c.item)}</div>
                          <div style={{fontSize:11,color:"#475569"}}>Niv. {c.item.level}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <button onClick={function(e){e.stopPropagation();updateQty(id,c.qty-1);}} style={{width:24,height:24,borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit"}}>−</button>
                          <span style={{minWidth:24,textAlign:"center",fontWeight:700,color:"#818cf8"}}>{c.qty}</span>
                          <button onClick={function(e){e.stopPropagation();updateQty(id,c.qty+1);}} style={{width:24,height:24,borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit"}}>+</button>
                          <button onClick={function(e){e.stopPropagation();removeFromList(id);}} style={{width:24,height:24,borderRadius:6,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.08)",color:"#f87171",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {craftList.length > 0 && (
                <button onClick={openSaveModal} style={{width:"100%",marginTop:14,padding:"11px",borderRadius:11,border:"1px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.08)",color:"#818cf8",fontWeight:600,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>💾 Sauver la liste</button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {activeItem && (
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20}}>
                <div style={{fontSize:12,color:"#6366f1",letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>📋 Recette</div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  {getImg(activeItem) && <img src={getImg(activeItem)} style={{width:48,height:48,objectFit:"contain",borderRadius:10}} alt="" onError={function(e){e.target.style.display="none";}} />}
                  <div>
                    <div style={{fontWeight:700,fontSize:15,color:"#f1f5f9"}}>{getName(activeItem)}</div>
                    <div style={{fontSize:12,color:"#475569"}}>Niv. {activeItem.level}</div>
                  </div>
                </div>
                {activeItem.recipe && activeItem.recipe.ingredients && activeItem.recipe.ingredients.length > 0 ? (
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {activeItem.recipe.ingredients.map(function(ing, i) {
                      const craftEntry = craftList.find(function(c){ return (c.item.ankama_id || c.item.id) === (activeItem.ankama_id || activeItem.id); });
                      const qty = craftEntry ? craftEntry.qty : 1;
                      return renderIngredient(ing, i, qty, 0);
                    })}
                  </div>
                ) : <div style={{color:"#475569",fontSize:13,textAlign:"center",padding:"10px 0"}}>Aucune recette disponible</div>}
              </div>
            )}

            {calculated && calculated.length > 0 && (
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,flex:1}}>
                <div style={{fontSize:12,color:"#6366f1",letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>🧮 Ressources nécessaires ({calculated.length})</div>
                <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(99,102,241,0.06)",borderRadius:10,border:"1px solid rgba(99,102,241,0.15)",fontSize:12,color:"#818cf8"}}>💡 Indique tes ressources en banque — mise à jour automatique</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:400,overflowY:"auto"}}>
                  {calculated.map(function(r,i) {
                    const isInList = craftList.some(function(c){ return (c.item.ankama_id || c.item.id) === r.id; });
                    const subData = subRecipes[r.id];
                    const hasNoRecipe = subData === "none";
                    const isExpanded = !!expandedIngredients[r.id];
                    const isLoadingSub = !!loadingSubRecipe[r.id];
                    return (
                      <div key={i}>
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:r.missing===0?"rgba(34,197,94,0.05)":"rgba(255,255,255,0.02)",borderRadius:9,border:"1px solid "+(r.missing===0?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.04)")}}>
                          {r.img && <img src={r.img} style={{width:28,height:28,objectFit:"contain",borderRadius:6,flexShrink:0}} alt="" onError={function(e){e.target.style.display="none";}} />}
                          <div style={{flex:1,fontSize:13,color:"#cbd5e1"}}>{ingName(r)}</div>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            {Array.isArray(subData) && (
                              <button onClick={function(){ addIngredientToCraft(r); }}
                                style={{background:isInList?"rgba(34,197,94,0.1)":"rgba(99,102,241,0.15)",border:"1px solid "+(isInList?"rgba(34,197,94,0.3)":"rgba(99,102,241,0.3)"),borderRadius:7,padding:"3px 8px",color:isInList?"#22c55e":"#818cf8",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>
                                {isInList ? "✓" : "⚗️ Crafter"}
                              </button>
                            )}
                            {!hasNoRecipe && (
                              <button onClick={function(){ toggleSubRecipe(r, 1); }}
                                style={{background:isExpanded?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.04)",border:"1px solid "+(isExpanded?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.1)"),borderRadius:7,padding:"3px 8px",color:isExpanded?"#818cf8":"#475569",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                                {isLoadingSub ? "⏳" : isExpanded ? "▲" : "▼"}
                              </button>
                            )}
                            <input type="number" min={0} value={bankResources[r.id]||""} placeholder="Banque"
                              onChange={function(e){
                                const val = parseInt(e.target.value) || 0;
                                setBankResources(function(prev){ return Object.assign({}, prev, { [r.id]: val }); });
                              }}
                              style={{width:64,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"4px 8px",color:"#94a3b8",fontSize:12,outline:"none",fontFamily:"inherit",textAlign:"center"}} />
                            <div style={{minWidth:60,textAlign:"right"}}>
                              <span style={{fontWeight:700,color:r.missing===0?"#22c55e":"#f87171",fontSize:14}}>{r.missing===0?"✓":"-"+r.missing}</span>
                              <span style={{fontSize:11,color:"#475569",marginLeft:4}}>/ {r.needed}</span>
                            </div>
                          </div>
                        </div>
                        {isExpanded && Array.isArray(subData) && (
                          <div style={{marginBottom:4}}>
                            {subData.map(function(sub, si) { return renderIngredient(sub, si, r.needed, 1); })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {savedCrafts.length > 0 && (
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20}}>
                <div style={{fontSize:12,color:"#6366f1",letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>💾 Listes sauvegardées</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {savedCrafts.map(function(s) {
                    return (
                      <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:10,border:"1px solid rgba(255,255,255,0.05)"}}>
                        <div style={{flex:1}}>
                          {renamingId === s.id ? (
                            <div style={{display:"flex",gap:6}}>
                              <input value={renameValue} onChange={function(e){setRenameValue(e.target.value);}}
                                onKeyDown={function(e){if(e.key==="Enter")confirmRename(s.id);if(e.key==="Escape"){setRenamingId(null);setRenameValue("");}}}
                                autoFocus style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:7,padding:"4px 8px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"inherit"}} />
                              <button onClick={function(){confirmRename(s.id);}} style={{background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:7,padding:"4px 8px",color:"#818cf8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✓</button>
                              <button onClick={function(){setRenamingId(null);setRenameValue("");}} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"4px 8px",color:"#475569",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
                            </div>
                          ) : (
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{fontWeight:600,fontSize:13,color:"#f1f5f9"}}>{s.name}</div>
                              <button onClick={function(){setRenamingId(s.id);setRenameValue(s.name);}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:12,padding:"2px 4px",fontFamily:"inherit"}}>✏️</button>
                            </div>
                          )}
                          <div style={{fontSize:11,color:"#475569",marginTop:2}}>{JSON.parse(s.items||"[]").length} items</div>
                        </div>
                        {renamingId !== s.id && (
                          <>
                            <button onClick={function(){loadCraftList(s);}} style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:7,padding:"5px 10px",color:"#818cf8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Charger</button>
                            <button onClick={function(){deleteSaved(s.id);}} style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:7,padding:"5px 10px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={function(e){if(e.target===e.currentTarget){setShowSaveModal(false);}}}>
          <div style={{background:"#0d0f1a",border:"1px solid rgba(99,102,241,0.3)",borderRadius:16,padding:28,width:360,boxShadow:"0 20px 60px rgba(0,0,0,0.8)"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",marginBottom:16}}>💾 Nommer la liste</div>
            <input value={saveName} onChange={function(e){setSaveName(e.target.value);}}
              onKeyDown={function(e){if(e.key==="Enter")confirmSave();if(e.key==="Escape")setShowSaveModal(false);}}
              autoFocus placeholder="ex: Pano feu entière, Set Bouftou..."
              style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:10,padding:"10px 14px",color:"#f1f5f9",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:16}} />
            <div style={{display:"flex",gap:8}}>
              <button onClick={confirmSave} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Sauvegarder</button>
              <button onClick={function(){setShowSaveModal(false);}} style={{padding:"10px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{position:"fixed",bottom:26,right:26,background:toast.type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",padding:"12px 20px",borderRadius:12,fontWeight:600,fontSize:14,boxShadow:"0 10px 40px rgba(0,0,0,0.5)",zIndex:200,fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
