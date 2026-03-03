import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const API = "https://api.dofusdb.fr";

// Types d'items craftables
const ITEM_TYPES = [
  { id: 1,  label: "Amulettes" },
  { id: 2,  label: "Anneaux" },
  { id: 3,  label: "Bottes" },
  { id: 4,  label: "Ceintures" },
  { id: 5,  label: "Capes" },
  { id: 6,  label: "Chapeaux" },
  { id: 11, label: "Épées" },
  { id: 12, label: "Pelles" },
  { id: 13, label: "Marteaux" },
  { id: 14, label: "Baguettes" },
  { id: 15, label: "Arcs" },
  { id: 16, label: "Bâtons" },
  { id: 17, label: "Dagues" },
  { id: 23, label: "Haches" },
  { id: 114,label: "Boucliers" },
];

export default function CraftManager({ session }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [craftList, setCraftList] = useState([]); // [{item, qty}]
  const [bankResources, setBankResources] = useState({}); // {resourceId: qty}
  const [calculated, setCalculated] = useState(null);
  const [savedCrafts, setSavedCrafts] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const searchTimeout = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // Load saved crafts from Supabase
  useEffect(() => {
    if (session) loadSavedCrafts();
  }, [session]);

  const loadSavedCrafts = async () => {
    const { data, error } = await supabase
      .from("craft_lists")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setSavedCrafts(data);
  };

  // Search items from DofusDB
  const searchItems = useCallback(async (q) => {
    if (!q || q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      // DofusDB FeathersJS API - use correct bracket notation
      const base = `${API}/items`;
      const params = new URLSearchParams();
      params.set("lang", "fr");
      params.set("$limit", "20");
      params.set("$sort[level]", "-1");
      params.set("name[fr][$search]", q);
      if (filterType !== "all") params.set("typeId", filterType);
      if (filterLevel === "1-50") { params.set("level[$gte]", "1"); params.set("level[$lte]", "50"); }
      else if (filterLevel === "51-100") { params.set("level[$gte]", "51"); params.set("level[$lte]", "100"); }
      else if (filterLevel === "101-150") { params.set("level[$gte]", "101"); params.set("level[$lte]", "150"); }
      else if (filterLevel === "151-200") { params.set("level[$gte]", "151"); params.set("level[$lte]", "200"); }

      const res = await fetch(`${base}?${params.toString()}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (e) {
      console.error("DofusDB search error:", e);
      setSearchResults([]);
    }
    setSearching(false);
  }, [filterType, filterLevel]);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchItems(search), 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search, searchItems]);

  // Fetch recipe for an item
  const fetchRecipe = async (item) => {
    setLoadingRecipe(true);
    try {
      const res = await fetch(`${API}/recipes/${item.id}?lang=fr`);
      if (!res.ok) throw new Error("Pas de recette");
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    } finally {
      setLoadingRecipe(false);
    }
  };

  const addToCraftList = async (item) => {
    const existing = craftList.find(c => c.item.id === item.id);
    if (existing) {
      setCraftList(craftList.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      showToast(`+1 ${item.name?.fr} dans la liste`);
      return;
    }
    const recipe = await fetchRecipe(item);
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      showToast(`Pas de recette pour ${item.name?.fr}`, "error");
      return;
    }
    setCraftList(prev => [...prev, { item: { ...item, recipe }, qty: 1 }]);
    setSearch("");
    setSearchResults([]);
    showToast(`${item.name?.fr} ajouté ✓`);
  };

  const removeFromList = (id) => {
    setCraftList(craftList.filter(c => c.item.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
    setCalculated(null);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCraftList(craftList.map(c => c.item.id === id ? { ...c, qty } : c));
    setCalculated(null);
  };

  // Calculate needed resources
  const calculate = () => {
    if (craftList.length === 0) return;
    const totals = {};
    for (const { item, qty } of craftList) {
      if (!item.recipe?.ingredients) continue;
      for (const ing of item.recipe.ingredients) {
        const key = ing.id;
        if (!totals[key]) totals[key] = { ...ing, needed: 0 };
        totals[key].needed += (ing.quantity || 1) * qty;
      }
    }
    // Subtract bank resources
    const result = Object.values(totals).map(r => ({
      ...r,
      inBank: bankResources[r.id] || 0,
      missing: Math.max(0, r.needed - (bankResources[r.id] || 0)),
    }));
    setCalculated(result);
  };

  // Save craft list to Supabase
  const saveCraftList = async () => {
    if (craftList.length === 0) return showToast("La liste est vide !", "error");
    const name = `Craft du ${new Date().toLocaleDateString("fr-FR")}`;
    const { error } = await supabase.from("craft_lists").insert([{
      user_id: session.user.id,
      name,
      items: JSON.stringify(craftList),
      bank: JSON.stringify(bankResources),
    }]);
    if (error) return showToast("Erreur de sauvegarde", "error");
    await loadSavedCrafts();
    showToast("Liste sauvegardée ✓");
  };

  const loadCraftList = (saved) => {
    try {
      setCraftList(JSON.parse(saved.items));
      setBankResources(JSON.parse(saved.bank || "{}"));
      setCalculated(null);
      showToast(`"${saved.name}" chargée ✓`);
    } catch (e) {
      showToast("Erreur lors du chargement", "error");
    }
  };

  const deleteSaved = async (id) => {
    await supabase.from("craft_lists").delete().eq("id", id);
    await loadSavedCrafts();
    showToast("Liste supprimée");
  };

  const fi = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 14,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "26px 28px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            ⚗️ <span>Craft Manager</span>
          </h2>
          <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 14 }}>
            Recherche des items, calcule les ressources manquantes. Recettes depuis DofusDB.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* LEFT — Recherche + liste */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recherche */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>🔍 Rechercher un item</div>

              {/* Filtres */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...fi, flex: 1, cursor: "pointer", fontSize: 12 }}>
                  <option value="all">Tous types</option>
                  {ITEM_TYPES.map(t => <option key={t.id} value={t.id} style={{ background: "#0d0f1a" }}>{t.label}</option>)}
                </select>
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...fi, flex: 1, cursor: "pointer", fontSize: 12 }}>
                  <option value="all">Tous niveaux</option>
                  <option value="1-50" style={{ background: "#0d0f1a" }}>1 – 50</option>
                  <option value="51-100" style={{ background: "#0d0f1a" }}>51 – 100</option>
                  <option value="101-150" style={{ background: "#0d0f1a" }}>101 – 150</option>
                  <option value="151-200" style={{ background: "#0d0f1a" }}>151 – 200</option>
                </select>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ex: Anneau du Grand Duc..."
                  style={{ ...fi, width: "100%", paddingRight: searching ? 40 : 14 }}
                />
                {searching && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6366f1", fontSize: 16 }}>⏳</div>}
              </div>

              {/* Résultats */}
              {searchResults.length > 0 && (
                <div style={{ marginTop: 8, background: "#0d0f1a", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, overflow: "hidden", maxHeight: 280, overflowY: "auto" }}>
                  {searchResults.map(item => (
                    <div key={item.id} onClick={() => addToCraftList(item)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {item.img && <img src={item.img} style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6 }} alt="" onError={e => e.target.style.display = "none"} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#f1f5f9" }}>{item.name?.fr}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>Niv. {item.level} · {item.type?.name?.fr || "Item"}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>+ Ajouter</div>
                    </div>
                  ))}
                </div>
              )}
              {loadingRecipe && <div style={{ marginTop: 8, color: "#6366f1", fontSize: 13, textAlign: "center" }}>⏳ Chargement de la recette...</div>}
            </div>

            {/* File de craft */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>🎒 File de craft ({craftList.length})</div>
                {craftList.length > 0 && (
                  <button onClick={() => { setCraftList([]); setCalculated(null); }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "4px 10px", color: "#f87171", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
                    🗑️ Vider
                  </button>
                )}
              </div>

              {craftList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#334155", fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>⚗️</div>
                  Recherche un item pour commencer
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {craftList.map(({ item, qty }) => (
                    <div key={item.id}
                      onClick={() => setActiveItem(item)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: activeItem?.id === item.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${activeItem?.id === item.id ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
                      {item.img && <img src={item.img} style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8, flexShrink: 0 }} alt="" onError={e => e.target.style.display = "none"} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#f1f5f9" }}>{item.name?.fr}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>Niv. {item.level}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={e => { e.stopPropagation(); updateQty(item.id, qty - 1); }} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                        <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700, color: "#818cf8", fontSize: 14 }}>{qty}</span>
                        <button onClick={e => { e.stopPropagation(); updateQty(item.id, qty + 1); }} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
                        <button onClick={e => { e.stopPropagation(); removeFromList(item.id); }} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.08)", color: "#f87171", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {craftList.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button onClick={calculate} style={{ flex: 2, padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13, boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
                    ⚗️ Calculer les ressources
                  </button>
                  <button onClick={saveCraftList} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.08)", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                    💾 Sauver
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Recette + Résultats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recette de l'item actif */}
            {activeItem && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 12, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>📋 Recette</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  {activeItem.img && <img src={activeItem.img} style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 10 }} alt="" onError={e => e.target.style.display = "none"} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>{activeItem.name?.fr}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>Niv. {activeItem.level}</div>
                  </div>
                </div>
                {activeItem.recipe?.ingredients?.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeItem.recipe.ingredients.map((ing, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.04)" }}>
                        {ing.img && <img src={ing.img} style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6 }} alt="" onError={e => e.target.style.display = "none"} />}
                        <div style={{ flex: 1, fontSize: 13, color: "#cbd5e1" }}>{ing.name?.fr || ing.name}</div>
                        <div style={{ fontWeight: 700, color: "#818cf8", fontSize: 14 }}>×{ing.quantity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: "10px 0" }}>Aucune recette disponible</div>
                )}
              </div>
            )}

            {/* Résultats du calcul */}
            {calculated && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 12, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>
                  🧮 Ressources nécessaires ({calculated.length})
                </div>

                {/* Banque */}
                <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)", fontSize: 12, color: "#818cf8" }}>
                  💡 Indique tes ressources en banque pour voir ce qu'il manque
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 400, overflowY: "auto" }}>
                  {calculated.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: r.missing === 0 ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)", borderRadius: 9, border: `1px solid ${r.missing === 0 ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)"}` }}>
                      {r.img && <img src={r.img} style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6, flexShrink: 0 }} alt="" onError={e => e.target.style.display = "none"} />}
                      <div style={{ flex: 1, fontSize: 13, color: "#cbd5e1" }}>{r.name?.fr || r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number" min={0} value={bankResources[r.id] || ""}
                          placeholder="Banque"
                          onChange={e => {
                            const v = parseInt(e.target.value) || 0;
                            setBankResources(prev => ({ ...prev, [r.id]: v }));
                          }}
                          style={{ width: 64, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "4px 8px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "inherit", textAlign: "center" }}
                        />
                        <div style={{ minWidth: 60, textAlign: "right" }}>
                          <span style={{ fontWeight: 700, color: r.missing === 0 ? "#22c55e" : "#f87171", fontSize: 14 }}>
                            {r.missing === 0 ? "✓" : `−${r.missing}`}
                          </span>
                          <span style={{ fontSize: 11, color: "#475569", marginLeft: 4 }}>/ {r.needed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={calculate} style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 10, border: "none", background: "rgba(99,102,241,0.15)", color: "#818cf8", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                  🔄 Recalculer avec la banque
                </button>
              </div>
            )}

            {/* Listes sauvegardées */}
            {savedCrafts.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 12, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>💾 Listes sauvegardées</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {savedCrafts.map(s => (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#f1f5f9" }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{JSON.parse(s.items || "[]").length} items</div>
                      </div>
                      <button onClick={() => loadCraftList(s)} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 7, padding: "5px 10px", color: "#818cf8", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Charger</button>
                      <button onClick={() => deleteSaved(s.id)} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "5px 10px", color: "#f87171", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 26, right: 26, background: toast.type === "error" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 200, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
