import { useState, useEffect } from "react";
import CraftManager from "./CraftManager.jsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const CLASSES = ["Iop","Cra","Feca","Xelor","Enutrof","Sacrieur","Sadida","Ecaflip","Eniripsa","Sram","Pandawa","Roublard","Zobal","Steamer","Eliotrope","Huppermage","Ouginak","Forgelance","Osamodas"];
const ETATS = ["Prêt","À stuff","À xp","Pano Sagesse","Mort","Check","Métier","Banque"];
const ETAT_COLORS = {"Prêt":"#22c55e","À stuff":"#86efac","À xp":"#6366f1","Pano Sagesse":"#f5c842","Mort":"#ef4444","Check":"#06b6d4","Métier":"#f97316","Banque":"#94a3b8"};
const CLASS_ICONS = {
  "Iop":"/classes/iop.png","Cra":"/classes/cra.png","Feca":"/classes/feca.png",
  "Xelor":"/classes/xelor.png","Enutrof":"/classes/enutrof.png","Sacrieur":"/classes/sacrieur.png",
  "Sadida":"/classes/sadida.png","Ecaflip":"/classes/ecaflip.png","Eniripsa":"/classes/eniripsa.png",
  "Sram":"/classes/sram.png","Pandawa":"/classes/pandawa.png","Roublard":"/classes/roublard.png",
  "Zobal":"/classes/zobal.png","Steamer":"/classes/steamer.png","Eliotrope":"/classes/eliotrope.png",
  "Huppermage":"/classes/huppermage.png","Ouginak":"/classes/ouginak.png",
  "Forgelance":"/classes/forgelance.png","Osamodas":"/classes/osamodas.png"
};

// ── Sur-catégories (dossiers) ───────────────────────────────────
const SURCATS = [
  { id:"all", label:"Tous",  icon:"⚔️", color:"#818cf8" },
  { id:"PVP", label:"PVP",   icon:"🏆", color:"#f43f5e" },
  { id:"PVM", label:"PVM",   icon:"🐉", color:"#10b981" },
];

// ── Catégories : chaque état = son propre onglet ───────────────
const CATEGORIES = [
  { id:"all",     label:"Tous",        icon:"⚔️", color:"#818cf8", etats:null },
  { id:"pret",    label:"Prêt",        icon:"✅", color:"#22c55e", etats:["Prêt"] },
  { id:"astuff",  label:"À stuff",     icon:"🛡️", color:"#86efac", etats:["À stuff"] },
  { id:"axp",     label:"À xp",        icon:"⭐", color:"#6366f1", etats:["À xp"] },
  { id:"sagesse", label:"Pano Sagesse",icon:"🟡", color:"#f5c842", etats:["Pano Sagesse"] },
  { id:"mort",    label:"Mort",        icon:"💀", color:"#ef4444", etats:["Mort"] },
  { id:"check",   label:"Check",       icon:"🔍", color:"#06b6d4", etats:["Check"] },
  { id:"metier",  label:"Métier",      icon:"⚒️", color:"#f97316", etats:["Métier"] },
  { id:"banque",  label:"Banque",      icon:"🏦", color:"#94a3b8", etats:["Banque"] },
];

const defaultChar = () => ({ compte:"", nom:"", classe:"Iop", level:1, level_max:1, etat:"Prêt", frigost:"Continent", surcat:"PVM" });

function getCatForEtat(etat) {
  for (const cat of CATEGORIES) {
    if (cat.etats && cat.etats.includes(etat)) return cat.id;
  }
  return "all";
}

// ─── AUTH PAGE ────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fi = { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px", color:"#e2e8f0", fontSize:15, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const handle = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.");
        setMode("login"); setLoading(false); return;
      }
    } catch (e) {
      setError(e.message || "Une erreur est survenue");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#07080f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-300,left:-200,width:700,height:700,background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:-200,right:-100,width:600,height:600,background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)",pointerEvents:"none"}} />

      <div style={{width:"100%",maxWidth:420,margin:16,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 16px",boxShadow:"0 0 40px rgba(99,102,241,0.4)"}}>⚔️</div>
          <div style={{fontWeight:800,fontSize:22,color:"#f1f5f9",letterSpacing:2}}>DOFUS MANAGER</div>
          <div style={{fontSize:11,color:"#6366f1",letterSpacing:4,textTransform:"uppercase",marginTop:4}}>Serveur Héroïque</div>
        </div>

        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:20,padding:"32px",boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2,marginBottom:24}} />
          </div>

          <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,marginBottom:28,marginTop:8}}>
            {["login","register"].map(m => (
              <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{flex:1,padding:"10px",borderRadius:9,border:"none",background:mode===m?"linear-gradient(135deg,#6366f1,#8b5cf6)":"transparent",color:mode===m?"#fff":"#475569",fontWeight:mode===m?700:500,cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all 0.2s"}}>
                {m==="login"?"Se connecter":"S'inscrire"}
              </button>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ton@email.com" style={fi} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            <div>
              <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Mot de passe</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={fi} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
          </div>

          {error && <div style={{marginTop:14,padding:"10px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:9,color:"#f87171",fontSize:13}}>❌ {error}</div>}
          {success && <div style={{marginTop:14,padding:"10px 14px",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:9,color:"#86efac",fontSize:13}}>✅ {success}</div>}

          <button onClick={handle} disabled={loading} style={{width:"100%",marginTop:20,padding:"13px",borderRadius:12,border:"none",background:loading?"#2d3748":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",fontSize:15,boxShadow:loading?"none":"0 4px 20px rgba(99,102,241,0.35)",transition:"all 0.2s"}}>
            {loading?"Chargement...":(mode==="login"?"Se connecter":"Créer mon compte")}
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:20,color:"#1e293b",fontSize:12}}>
          Tes personnages sont privés et accessibles uniquement par toi 🔒
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [mainTab, setMainTab] = useState("persos");
  const [authLoading, setAuthLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSurcat, setActiveSurcat] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filterCompte, setFilterCompte] = useState("Tous");
  const [sortBy, setSortBy] = useState("compte");
  const [showForm, setShowForm] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [form, setForm] = useState(defaultChar());
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadCharacters();
  }, [session]);

  const loadCharacters = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("characters").select("*").order("created_at", { ascending: true });
    if (!error && data) setCharacters(data);
    setLoading(false);
  };

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const openAdd = () => { setForm(defaultChar()); setEditingChar(null); setShowForm(true); };
  const openEdit = (char) => {
    setForm({ compte:char.compte, nom:char.nom, classe:char.classe, level:char.level, level_max:char.level_max, etat:char.etat, frigost:char.frigost, surcat:char.surcat||"PVM" });
    setEditingChar(char.id); setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.nom.trim()) return showToast("Le nom est requis !","error");
    if (editingChar) {
      const { error } = await supabase.from("characters").update(form).eq("id", editingChar);
      if (error) return showToast("Erreur lors de la modification","error");
      showToast("Personnage modifié ✓");
    } else {
      const { error } = await supabase.from("characters").insert([{ ...form, user_id: session.user.id }]);
      if (error) return showToast("Erreur lors de l'ajout","error");
      showToast("Personnage ajouté ✓");
    }
    await loadCharacters(); setShowForm(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) return showToast("Erreur lors de la suppression","error");
    await loadCharacters(); setDeleteConfirm(null);
    showToast("Personnage supprimé");
  };

  const handleEtatChange = async (id, etat) => {
    const { error } = await supabase.from("characters").update({ etat }).eq("id", id);
    if (error) return;
    setCharacters(characters.map(c=>c.id===id?{...c,etat}:c));
    const newCat = getCatForEtat(etat);
    setActiveTab(newCat);
    showToast(`Déplacé → "${CATEGORIES.find(c=>c.id===newCat)?.label}" ✓`);
  };

  const handleSurcatChange = async (id, surcat) => {
    const { error } = await supabase.from("characters").update({ surcat }).eq("id", id);
    if (error) return;
    setCharacters(characters.map(c=>c.id===id?{...c,surcat}:c));
    showToast(`Dossier → ${surcat} ✓`);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (authLoading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#07080f",color:"#818cf8",fontSize:20,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:52,marginBottom:16}}>⚔️</div><div style={{letterSpacing:3}}>CHARGEMENT...</div></div>
    </div>
  );

  if (!session) return <AuthPage onAuth={setSession} />;

  const comptes = ["Tous",...Array.from(new Set(characters.map(c=>c.compte).filter(Boolean)))];

  // Filtre complet : surcat + onglet état + search + compte
  const filtered = characters.filter(c => {
    const inSurcat = activeSurcat==="all" || (c.surcat||"PVM")===activeSurcat;
    const cat = CATEGORIES.find(cat=>cat.id===activeTab);
    const inTab = activeTab==="all" || (cat?.etats && cat.etats.includes(c.etat));
    const s = search.toLowerCase();
    const inSearch = c.nom.toLowerCase().includes(s)||c.compte.toLowerCase().includes(s)||c.classe.toLowerCase().includes(s);
    const inCompte = filterCompte==="Tous"||c.compte===filterCompte;
    return inSurcat && inTab && inSearch && inCompte;
  }).sort((a,b) => {
    if (sortBy==="compte") return (a.compte||"").localeCompare(b.compte||"")||(a.nom||"").localeCompare(b.nom||"");
    if (sortBy==="level") return b.level-a.level;
    if (sortBy==="nom") return (a.nom||"").localeCompare(b.nom||"");
    return (a.classe||"").localeCompare(b.classe||"");
  });

  // countFor respecte la surcat active
  const countFor = (cat) => {
    const base = activeSurcat==="all" ? characters : characters.filter(c=>(c.surcat||"PVM")===activeSurcat);
    return cat.etats ? base.filter(c=>cat.etats.includes(c.etat)).length : base.length;
  };
  const countSurcat = (sc) => sc.id==="all" ? characters.length : characters.filter(c=>(c.surcat||"PVM")===sc.id).length;

  const fi = { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  return (
    <div style={{minHeight:"100vh",background:"#07080f",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#e2e8f0",position:"relative"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:-300,left:-200,width:700,height:700,background:"radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)"}} />
        <div style={{position:"absolute",bottom:-200,right:-100,width:600,height:600,background:"radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)"}} />
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,0.008) 60px,rgba(255,255,255,0.008) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.008) 60px,rgba(255,255,255,0.008) 61px)"}} />
      </div>

      {/* NAV */}
      <nav style={{position:"relative",zIndex:10,borderBottom:"1px solid rgba(99,102,241,0.15)",background:"rgba(7,8,15,0.97)",backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:66,flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:"0 0 24px rgba(99,102,241,0.45)"}}>⚔️</div>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9",letterSpacing:1.5}}>DOFUS MANAGER</div>
              <div style={{fontSize:10,color:"#6366f1",letterSpacing:3,textTransform:"uppercase",marginTop:1}}>Serveur Héroïque</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            {[
              {l:"Total",v:characters.length,c:"#818cf8"},
              {l:"PVP",v:characters.filter(c=>(c.surcat||"PVM")==="PVP").length,c:"#f43f5e"},
              {l:"PVM",v:characters.filter(c=>(c.surcat||"PVM")==="PVM").length,c:"#10b981"},
              {l:"Morts",v:characters.filter(c=>c.etat==="Mort").length,c:"#ef4444"},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center",padding:"5px 14px",background:"rgba(255,255,255,0.03)",border:`1px solid ${s.c}20`,borderRadius:8}}>
                <div style={{fontSize:17,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{s.l}</div>
              </div>
            ))}
            {mainTab==="persos" && <button onClick={openAdd} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,padding:"10px 22px",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 4px 20px rgba(99,102,241,0.35)",fontFamily:"inherit",whiteSpace:"nowrap"}}>+ Ajouter</button>}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
              <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
              <span style={{fontSize:12,color:"#64748b",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.user.email}</span>
              <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:7,padding:"4px 10px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginLeft:4}}>Déco</button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN TABS (Personnages / Craft) */}
      <div style={{position:"relative",zIndex:9,borderBottom:"1px solid rgba(99,102,241,0.1)",background:"rgba(7,8,15,0.95)",backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 28px",display:"flex",gap:4}}>
          {[{id:"persos",icon:"⚔️",label:"Personnages"},{id:"craft",icon:"⚗️",label:"Craft Manager"}].map(t=>(
            <button key={t.id} onClick={()=>setMainTab(t.id)} style={{padding:"13px 22px",border:"none",borderBottom:mainTab===t.id?"2px solid #6366f1":"2px solid transparent",background:"transparent",color:mainTab===t.id?"#818cf8":"#475569",fontWeight:mainTab===t.id?700:500,cursor:"pointer",fontSize:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:7,transition:"all 0.2s"}}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {mainTab==="craft" && <CraftManager session={session} />}

      <div style={{maxWidth:1400,margin:"0 auto",display:mainTab==="persos"?"block":"none",padding:"26px 28px",position:"relative",zIndex:1}}>

        {/* ── SUR-CATÉGORIES (PVP / PVM) ── */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:"#334155",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>📁 Dossier</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {SURCATS.map(sc => {
              const cnt = countSurcat(sc);
              const active = activeSurcat===sc.id;
              return (
                <button key={sc.id} onClick={()=>{ setActiveSurcat(sc.id); setActiveTab("all"); }}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,
                    border:`1px solid ${active?sc.color:"rgba(255,255,255,0.06)"}`,
                    background:active?`${sc.color}18`:"rgba(255,255,255,0.02)",
                    color:active?sc.color:"#64748b",cursor:"pointer",fontWeight:active?700:500,
                    fontSize:14,transition:"all 0.2s",
                    boxShadow:active?`0 0 28px ${sc.color}22`:"none",fontFamily:"inherit"}}>
                  <span>{sc.icon}</span>
                  <span>{sc.label}</span>
                  <span style={{background:active?`${sc.color}28`:"rgba(255,255,255,0.05)",color:active?sc.color:"#475569",borderRadius:20,padding:"1px 8px",fontSize:12,fontWeight:700}}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CATÉGORIES (un onglet par état) ── */}
        <div style={{marginBottom:22}}>
          <div style={{fontSize:10,color:"#334155",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>🗂️ État</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {CATEGORIES.map(cat => {
              const cnt = countFor(cat);
              const active = activeTab===cat.id;
              return (
                <button key={cat.id} onClick={()=>setActiveTab(cat.id)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,
                    border:`1px solid ${active?cat.color:"rgba(255,255,255,0.06)"}`,
                    background:active?`${cat.color}15`:"rgba(255,255,255,0.02)",
                    color:active?cat.color:"#64748b",cursor:"pointer",fontWeight:active?700:500,
                    fontSize:14,transition:"all 0.2s",
                    boxShadow:active?`0 0 24px ${cat.color}18`:"none",fontFamily:"inherit"}}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{background:active?`${cat.color}28`:"rgba(255,255,255,0.05)",color:active?cat.color:"#475569",borderRadius:20,padding:"1px 8px",fontSize:12,fontWeight:700}}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTERS */}
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#334155",fontSize:13}}>🔍</span>
            <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...fi,paddingLeft:38}} />
          </div>
          <select value={filterCompte} onChange={e=>setFilterCompte(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>{comptes.map(c=><option key={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>
            <option value="compte">Trier: Compte</option>
            <option value="nom">Trier: Nom</option>
            <option value="level">Trier: Level</option>
            <option value="classe">Trier: Classe</option>
          </select>
        </div>

        {/* CARDS */}
        {loading ? (
          <div style={{textAlign:"center",padding:"80px",color:"#475569"}}>
            <div style={{fontSize:40,marginBottom:12}}>⏳</div>
            <div>Chargement des personnages...</div>
          </div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 20px",color:"#334155"}}>
            <div style={{fontSize:52,marginBottom:14,opacity:0.4}}>🗡️</div>
            <div style={{fontSize:17,fontWeight:600,color:"#475569",marginBottom:8}}>{characters.length===0?"Aucun personnage":"Aucun résultat"}</div>
            <div style={{fontSize:13}}>{characters.length===0?"Ajoutez votre premier personnage avec le bouton ci-dessus":"Essayez de modifier vos filtres"}</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(330px,1fr))",gap:14}}>
            {filtered.map((char)=>{
              const catColor = CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||"#818cf8";
              const sc = SURCATS.find(s=>s.id===(char.surcat||"PVM"))||SURCATS[2];
              return (
                <div key={char.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
                  <div style={{height:2,background:`linear-gradient(90deg,${catColor},${catColor}60)`}} />
                  <div style={{padding:"16px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:13}}>
                      <div style={{display:"flex",alignItems:"center",gap:11}}>
                        <div style={{width:44,height:44,borderRadius:12,background:`${catColor}12`,border:`1px solid ${catColor}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                          <img src={CLASS_ICONS[char.classe]} style={{width:36,height:36,objectFit:"contain"}} alt={char.classe} onError={e=>e.target.style.display="none"} />
                        </div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{fontWeight:700,fontSize:15,color:"#f1f5f9",lineHeight:1.2}}>{char.nom}</div>
                            {/* Badge PVP / PVM */}
                            <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20,background:`${sc.color}18`,color:sc.color,border:`1px solid ${sc.color}30`,letterSpacing:0.5}}>{sc.icon} {sc.label}</span>
                          </div>
                          <div style={{fontSize:12,color:"#475569",marginTop:3}}>{char.compte||<span style={{color:"#1e293b",fontStyle:"italic"}}>Sans compte</span>}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button onClick={()=>openEdit(char)} style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:8,padding:"6px 9px",color:"#818cf8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✏️</button>
                        <button onClick={()=>setDeleteConfirm(char.id)} style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:8,padding:"6px 9px",color:"#f87171",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>🗑️</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginBottom:12}}>
                      {[{l:"Classe",v:char.classe,c:"#94a3b8"},{l:"Level",v:char.level,c:"#818cf8"},{l:"Max",v:char.level_max,c:"#a78bfa"}].map(s=>(
                        <div key={s.l} style={{flex:1,background:"rgba(255,255,255,0.025)",borderRadius:9,padding:"7px 10px",textAlign:"center",border:"1px solid rgba(255,255,255,0.04)"}}>
                          <div style={{fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{s.l}</div>
                          <div style={{fontWeight:700,fontSize:13,color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <select value={char.etat} onChange={e=>handleEtatChange(char.id,e.target.value)}
                        style={{flex:1,background:`${ETAT_COLORS[char.etat]}15`,border:`1px solid ${ETAT_COLORS[char.etat]}38`,borderRadius:9,padding:"7px 10px",color:ETAT_COLORS[char.etat],fontWeight:700,fontSize:12,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
                        {ETATS.map(e=><option key={e}>{e}</option>)}
                      </select>
                      {/* Switcher PVP/PVM rapide */}
                      <select value={char.surcat||"PVM"} onChange={e=>handleSurcatChange(char.id,e.target.value)}
                        style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,padding:"7px 10px",color:"#e2e8f0",fontWeight:700,fontSize:12,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
                        <option value="PVM">🐉 PVM</option>
                        <option value="PVP">🏆 PVP</option>
                      </select>
                      <div style={{background:char.frigost==="Frigost 2"?"rgba(167,139,250,0.1)":"rgba(71,85,105,0.07)",border:`1px solid ${char.frigost==="Frigost 2"?"rgba(167,139,250,0.22)":"rgba(71,85,105,0.15)"}`,borderRadius:9,padding:"7px 11px",fontSize:12,color:char.frigost==="Frigost 2"?"#c4b5fd":"#475569",fontWeight:600,whiteSpace:"nowrap"}}>
                        {char.frigost==="Frigost 2"?"❄️ F2":"🌍 Cont."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{textAlign:"center",marginTop:18,color:"#1e293b",fontSize:11,letterSpacing:1.5}}>{filtered.length} PERSONNAGE{filtered.length>1?"S":""} • SAUVEGARDÉ SUR SUPABASE ☁️</div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(10px)"}}>
          <div style={{background:"#0d0f1a",border:"1px solid rgba(99,102,241,0.25)",borderRadius:20,padding:"30px",width:"100%",maxWidth:520,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",position:"relative",margin:16,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:"20px 20px 0 0"}} />
            <button onClick={()=>setShowForm(false)} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#475569",fontSize:15,cursor:"pointer",borderRadius:8,padding:"4px 10px",fontFamily:"inherit"}}>✕</button>
            <h2 style={{margin:"0 0 22px",color:"#f1f5f9",fontSize:19,fontWeight:700,display:"flex",alignItems:"center",gap:10}}>
              <span>{editingChar?"✏️":"⚔️"}</span>{editingChar?"Modifier":"Nouveau personnage"}
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>

              {/* Sur-catégorie PVP / PVM */}
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>📁 Dossier</label>
                <div style={{display:"flex",gap:10}}>
                  {[{id:"PVM",icon:"🐉",color:"#10b981"},{id:"PVP",icon:"🏆",color:"#f43f5e"}].map(s=>(
                    <button key={s.id} onClick={()=>setForm(p=>({...p,surcat:s.id}))}
                      style={{flex:1,padding:"13px",borderRadius:11,
                        border:`2px solid ${form.surcat===s.id?s.color:"rgba(255,255,255,0.06)"}`,
                        background:form.surcat===s.id?`${s.color}15`:"rgba(255,255,255,0.02)",
                        color:form.surcat===s.id?s.color:"#334155",
                        cursor:"pointer",fontFamily:"inherit",fontSize:15,fontWeight:700,transition:"all 0.2s",
                        boxShadow:form.surcat===s.id?`0 0 20px ${s.color}22`:"none"}}>
                      {s.icon} {s.id}
                    </button>
                  ))}
                </div>
              </div>

              {[{col:"1/-1",label:"Nom du compte",key:"compte",ph:"ex: MonCompte1"},{col:"1/-1",label:"Nom du personnage *",key:"nom",ph:"ex: Darkblade"}].map(f=>(
                <div key={f.key} style={{gridColumn:f.col}}>
                  <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{f.label}</label>
                  <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={fi} />
                </div>
              ))}
              <div>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Classe</label>
                <select value={form.classe} onChange={e=>setForm(p=>({...p,classe:e.target.value}))} style={{...fi,cursor:"pointer"}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>État</label>
                <select value={form.etat} onChange={e=>setForm(p=>({...p,etat:e.target.value}))} style={{...fi,cursor:"pointer"}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select>
              </div>
              <div>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Level actuel</label>
                <input type="number" min={1} max={200} value={form.level} onChange={e=>setForm(p=>({...p,level:parseInt(e.target.value)||1}))} style={fi} />
              </div>
              <div>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Level max atteint</label>
                <input type="number" min={1} max={200} value={form.level_max} onChange={e=>setForm(p=>({...p,level_max:parseInt(e.target.value)||1}))} style={fi} />
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",color:"#334155",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Zone</label>
                <div style={{display:"flex",gap:10}}>
                  {["Continent","Frigost 2"].map(z=>(
                    <button key={z} onClick={()=>setForm(p=>({...p,frigost:z}))} style={{flex:1,padding:"11px",borderRadius:11,border:`2px solid ${form.frigost===z?(z==="Frigost 2"?"#a78bfa":"#6366f1"):"rgba(255,255,255,0.06)"}`,background:form.frigost===z?(z==="Frigost 2"?"rgba(167,139,250,0.1)":"rgba(99,102,241,0.1)"):"rgba(255,255,255,0.02)",color:form.frigost===z?(z==="Frigost 2"?"#c4b5fd":"#818cf8"):"#334155",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600}}>
                      {z==="Frigost 2"?"❄️ Frigost 2":"🌍 Continent"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:22}}>
              <button onClick={()=>setShowForm(false)} style={{flex:1,padding:"11px",borderRadius:11,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"#475569",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Annuler</button>
              <button onClick={handleSubmit} style={{flex:2,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14,boxShadow:"0 4px 20px rgba(99,102,241,0.3)"}}>
                {editingChar?"Sauvegarder":"Ajouter le personnage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}
      {deleteConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(10px)"}}>
          <div style={{background:"#0d0f1a",border:"1px solid rgba(239,68,68,0.25)",borderRadius:20,padding:"30px",maxWidth:360,textAlign:"center",margin:16}}>
            <div style={{width:54,height:54,borderRadius:16,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>💀</div>
            <h3 style={{color:"#f87171",margin:"0 0 8px"}}>Supprimer ce personnage ?</h3>
            <p style={{color:"#334155",margin:"0 0 22px",fontSize:13}}>Action irréversible.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"10px",borderRadius:11,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"#475569",cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
              <button onClick={()=>handleDelete(deleteConfirm)} style={{flex:1,padding:"10px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{position:"fixed",bottom:26,right:26,background:toast.type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",padding:"12px 20px",borderRadius:12,fontWeight:600,fontSize:14,boxShadow:"0 10px 40px rgba(0,0,0,0.5)",zIndex:200,fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}
      <style>{`* { scrollbar-width: thin; scrollbar-color: #1e293b #07080f; } input::placeholder { color: #1e293b; } select option { background: #0d0f1a; }`}</style>
    </div>
  );
}
