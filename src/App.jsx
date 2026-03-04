import { useState, useEffect } from "react";
import CraftManager from "./CraftManager.jsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const T = {
  bg:           "#0f0d0a",
  surface:      "#17140f",
  border:       "#2c2316",
  accent:       "#f59e0b",
  accent2:      "#fbbf24",
  accentBg:     "#f59e0b14",
  accentBorder: "#f59e0b35",
  pvp:          "#f43f5e",
  pvm:          "#34d399",
  text:         "#fef3c7",
  textSub:      "#92816a",
  muted:        "#57483a",
  dimmer:       "#211c12",
  danger:       "#f87171",
  success:      "#34d399",
  font:         "'DM Sans', system-ui, sans-serif",
};

const CLASSES = ["Iop","Cra","Feca","Xelor","Enutrof","Sacrieur","Sadida","Ecaflip","Eniripsa","Sram","Pandawa","Roublard","Zobal","Steamer","Eliotrope","Huppermage","Ouginak","Forgelance","Osamodas"];
const ETATS   = ["Prêt","À stuff","À xp","Pano Sagesse","Mort","Check","Métier","Banque"];
const ETAT_COLORS = {"Prêt":"#34d399","À stuff":"#6ee7b7","À xp":"#818cf8","Pano Sagesse":"#fbbf24","Mort":"#f87171","Check":"#22d3ee","Métier":"#fb923c","Banque":"#a8a29e"};
const CLASS_ICONS = {"Iop":"/classes/iop.png","Cra":"/classes/cra.png","Feca":"/classes/feca.png","Xelor":"/classes/xelor.png","Enutrof":"/classes/enutrof.png","Sacrieur":"/classes/sacrieur.png","Sadida":"/classes/sadida.png","Ecaflip":"/classes/ecaflip.png","Eniripsa":"/classes/eniripsa.png","Sram":"/classes/sram.png","Pandawa":"/classes/pandawa.png","Roublard":"/classes/roublard.png","Zobal":"/classes/zobal.png","Steamer":"/classes/steamer.png","Eliotrope":"/classes/eliotrope.png","Huppermage":"/classes/huppermage.png","Ouginak":"/classes/ouginak.png","Forgelance":"/classes/forgelance.png","Osamodas":"/classes/osamodas.png"};

const SURCATS = [
  { id:"all", label:"Tous", icon:"⚔️", color:T.accent },
  { id:"PVP", label:"PVP",  icon:"🏆", color:T.pvp },
  { id:"PVM", label:"PVM",  icon:"🐉", color:T.pvm },
];

const CATEGORIES = [
  { id:"all",     label:"Tous",         icon:"⚔️", color:T.accent,  etats:null },
  { id:"pret",    label:"Prêt",         icon:"✅", color:"#34d399", etats:["Prêt"] },
  { id:"astuff",  label:"À stuff",      icon:"🛡️", color:"#6ee7b7", etats:["À stuff"] },
  { id:"axp",     label:"À xp",         icon:"⭐", color:"#818cf8", etats:["À xp"] },
  { id:"sagesse", label:"Pano Sagesse", icon:"🟡", color:"#fbbf24", etats:["Pano Sagesse"] },
  { id:"mort",    label:"Mort",         icon:"💀", color:"#f87171", etats:["Mort"] },
  { id:"check",   label:"Check",        icon:"🔍", color:"#22d3ee", etats:["Check"] },
  { id:"metier",  label:"Métier",       icon:"⚒️", color:"#fb923c", etats:["Métier"] },
  { id:"banque",  label:"Banque",       icon:"🏦", color:"#a8a29e", etats:["Banque"] },
];

const defaultChar = () => ({ compte:"", nom:"", classe:"Iop", level:1, level_max:1, etat:"Prêt", frigost:"Continent", surcat:"PVM" });
const getCatForEtat = (etat) => { for (const cat of CATEGORIES) { if (cat.etats && cat.etats.includes(etat)) return cat.id; } return "all"; };

const fi = { width:"100%", background:T.dimmer, border:"1px solid "+T.border, borderRadius:9, padding:"10px 14px", color:T.text, fontSize:14, outline:"none", fontFamily:T.font, boxSizing:"border-box" };

function AuthPage() {
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handle = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Compte créé ! Vérifie ton email puis connecte-toi.");
        setMode("login"); setLoading(false); return;
      }
    } catch (e) { setError(e.message || "Une erreur est survenue"); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-300,left:-200,width:700,height:700,background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{width:"100%",maxWidth:420,margin:16,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px",boxShadow:"0 0 36px "+T.accent+"40"}}>⚔️</div>
          <div style={{fontWeight:800,fontSize:21,color:T.text,letterSpacing:0.5}}>Tableur By Beny</div>
          <div style={{fontSize:10,color:T.accent,letterSpacing:4,textTransform:"uppercase",marginTop:3}}>Serveur Héroïque</div>
        </div>
        <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:18,padding:"28px",boxShadow:"0 40px 80px rgba(0,0,0,0.7)"}}>
          <div style={{height:2,background:"linear-gradient(90deg,"+T.accent+","+T.accent2+")",borderRadius:2,marginBottom:24}} />
          <div style={{display:"flex",background:T.dimmer,borderRadius:10,padding:4,marginBottom:24}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{flex:1,padding:"9px",borderRadius:7,border:"none",background:mode===m?"linear-gradient(135deg,"+T.accent+","+T.accent2+")":"transparent",color:mode===m?T.bg:T.muted,fontWeight:mode===m?700:500,cursor:"pointer",fontFamily:T.font,fontSize:13,transition:"all 0.2s"}}>
                {m==="login"?"Se connecter":"S'inscrire"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["Email","email",email,setEmail,"ton@email.com"],["Mot de passe","password",password,setPassword,"••••••••"]].map(([l,type,v,set,ph])=>(
              <div key={l}>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{l}</label>
                <input type={type} value={v} onChange={e=>set(e.target.value)} placeholder={ph} style={{...fi,width:"100%"}} onKeyDown={e=>e.key==="Enter"&&handle()} />
              </div>
            ))}
          </div>
          {error   && <div style={{marginTop:12,padding:"9px 13px",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,color:T.danger,fontSize:12}}>❌ {error}</div>}
          {success && <div style={{marginTop:12,padding:"9px 13px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,color:T.success,fontSize:12}}>✅ {success}</div>}
          <button onClick={handle} disabled={loading} style={{width:"100%",marginTop:18,padding:"12px",borderRadius:10,border:"none",background:loading?T.dimmer:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:loading?T.muted:T.bg,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:T.font,fontSize:14,transition:"all 0.2s"}}>
            {loading?"Chargement...":(mode==="login"?"Se connecter":"Créer mon compte")}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:16,color:T.muted,fontSize:11}}>Tes personnages sont privés et sécurisés 🔒</div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');*{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}input::placeholder{color:${T.muted};}select option{background:${T.surface};}`}</style>
    </div>
  );
}

export default function App() {
  const [session, setSession]             = useState(null);
  const [mainTab, setMainTab]             = useState("persos");
  const [authLoading, setAuthLoading]     = useState(true);
  const [characters, setCharacters]       = useState([]);
  const [loading, setLoading]             = useState(false);
  const [activeSurcat, setActiveSurcat]   = useState("all");
  const [activeTab, setActiveTab]         = useState("all");
  const [search, setSearch]               = useState("");
  const [filterCompte, setFilterCompte]   = useState("Tous");
  const [sortBy, setSortBy]               = useState("compte");
  const [showForm, setShowForm]           = useState(false);
  const [editingChar, setEditingChar]     = useState(null);
  const [form, setForm]                   = useState(defaultChar());
  const [toast, setToast]                 = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) loadCharacters(); }, [session]);

  const loadCharacters = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("characters").select("*").order("created_at", { ascending: true });
    if (!error && data) setCharacters(data);
    setLoading(false);
  };

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const openAdd   = () => { setForm(defaultChar()); setEditingChar(null); setShowForm(true); };
  const openEdit  = (c) => { setForm({ compte:c.compte,nom:c.nom,classe:c.classe,level:c.level,level_max:c.level_max,etat:c.etat,frigost:c.frigost,surcat:c.surcat||"PVM" }); setEditingChar(c.id); setShowForm(true); };

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
    showToast("Déplacé → \""+CATEGORIES.find(c=>c.id===newCat)?.label+"\" ✓");
  };

  const handleSurcatChange = async (id, surcat) => {
    const { error } = await supabase.from("characters").update({ surcat }).eq("id", id);
    if (error) return;
    setCharacters(characters.map(c=>c.id===id?{...c,surcat}:c));
    showToast("Dossier → "+surcat+" ✓");
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (authLoading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,color:T.accent,fontSize:20,fontFamily:T.font}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:14}}>⚔️</div><div style={{letterSpacing:3,color:T.textSub}}>CHARGEMENT...</div></div>
    </div>
  );

  if (!session) return <AuthPage />;

  const comptes     = ["Tous",...Array.from(new Set(characters.map(c=>c.compte).filter(Boolean)))];
  const countSurcat = (sc) => sc.id==="all" ? characters.length : characters.filter(c=>(c.surcat||"PVM")===sc.id).length;
  const countFor    = (cat) => { const base = activeSurcat==="all"?characters:characters.filter(c=>(c.surcat||"PVM")===activeSurcat); return cat.etats?base.filter(c=>cat.etats.includes(c.etat)).length:base.length; };

  const filtered = characters.filter(c => {
    const inSurcat = activeSurcat==="all"||(c.surcat||"PVM")===activeSurcat;
    const cat      = CATEGORIES.find(cat=>cat.id===activeTab);
    const inTab    = activeTab==="all"||(cat?.etats&&cat.etats.includes(c.etat));
    const s        = search.toLowerCase();
    return inSurcat&&inTab&&(c.nom.toLowerCase().includes(s)||c.compte.toLowerCase().includes(s)||c.classe.toLowerCase().includes(s))&&(filterCompte==="Tous"||c.compte===filterCompte);
  }).sort((a,b) => {
    if (sortBy==="compte") return (a.compte||"").localeCompare(b.compte||"")||(a.nom||"").localeCompare(b.nom||"");
    if (sortBy==="level")  return b.level-a.level;
    if (sortBy==="nom")    return (a.nom||"").localeCompare(b.nom||"");
    return (a.classe||"").localeCompare(b.classe||"");
  });

  const TabBtn = ({active, color, onClick, icon, label, count}) => (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,border:"1px solid "+(active?color+"55":T.border),background:active?color+"12":T.surface,color:active?color:T.muted,cursor:"pointer",fontWeight:active?600:400,fontSize:13,transition:"all 0.15s",fontFamily:T.font}}>
      <span>{icon}</span><span>{label}</span>
      <span style={{background:active?color+"28":T.dimmer,color:active?color:T.muted,borderRadius:20,padding:"0 6px",fontSize:11,fontWeight:700}}>{count}</span>
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');*{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}input::placeholder{color:${T.muted};}select option{background:${T.surface};}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:10,borderBottom:"1px solid "+T.border,background:T.surface,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 26px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:"0 0 20px "+T.accent+"50"}}>⚔️</div>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:T.text,letterSpacing:0.3}}>Tableur By Beny</div>
              <div style={{fontSize:9,color:T.accent,letterSpacing:3,textTransform:"uppercase"}}>Serveur Héroïque</div>
            </div>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
            {[{l:"Total",v:characters.length,c:T.accent},{l:"PVP",v:characters.filter(c=>(c.surcat||"PVM")==="PVP").length,c:T.pvp},{l:"PVM",v:characters.filter(c=>(c.surcat||"PVM")==="PVM").length,c:T.pvm},{l:"Morts",v:characters.filter(c=>c.etat==="Mort").length,c:T.danger}].map(s=>(
              <div key={s.l} style={{textAlign:"center",padding:"3px 10px",background:T.dimmer,border:"1px solid "+T.border,borderRadius:7}}>
                <div style={{fontSize:14,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginTop:1}}>{s.l}</div>
              </div>
            ))}
            {mainTab==="persos" && <button onClick={openAdd} style={{background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,border:"none",borderRadius:9,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:T.font,whiteSpace:"nowrap",boxShadow:"0 4px 14px "+T.accent+"40"}}>+ Ajouter</button>}
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:T.dimmer,border:"1px solid "+T.border,borderRadius:9}}>
              <span style={{fontSize:11,color:T.textSub,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.user.email}</span>
              <button onClick={handleLogout} style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:6,padding:"3px 8px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>Déco</button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN TABS */}
      <div style={{borderBottom:"1px solid "+T.border,background:T.bg}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 26px",display:"flex",gap:2}}>
          {[{id:"persos",icon:"⚔️",label:"Personnages"},{id:"craft",icon:"⚗️",label:"Craft Manager"}].map(t=>(
            <button key={t.id} onClick={()=>setMainTab(t.id)} style={{padding:"11px 18px",border:"none",borderBottom:mainTab===t.id?"2px solid "+T.accent:"2px solid transparent",background:"transparent",color:mainTab===t.id?T.accent:T.muted,fontWeight:mainTab===t.id?700:400,cursor:"pointer",fontSize:13,fontFamily:T.font,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {mainTab==="craft" && <CraftManager session={session} />}

      <div style={{maxWidth:1400,margin:"0 auto",display:mainTab==="persos"?"block":"none",padding:"20px 26px",position:"relative",zIndex:1}}>

        {/* Dossier */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>📁 Dossier</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {SURCATS.map(sc=><TabBtn key={sc.id} active={activeSurcat===sc.id} color={sc.color} onClick={()=>{setActiveSurcat(sc.id);setActiveTab("all");}} icon={sc.icon} label={sc.label} count={countSurcat(sc)} />)}
          </div>
        </div>

        {/* État */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>🗂️ État</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {CATEGORIES.map(cat=><TabBtn key={cat.id} active={activeTab===cat.id} color={cat.color} onClick={()=>setActiveTab(cat.id)} icon={cat.icon} label={cat.label} count={countFor(cat)} />)}
          </div>
        </div>

        {/* Filtres */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:180}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
            <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...fi,paddingLeft:36}} />
          </div>
          <select value={filterCompte} onChange={e=>setFilterCompte(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>{comptes.map(c=><option key={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>
            <option value="compte">Trier: Compte</option>
            <option value="nom">Trier: Nom</option>
            <option value="level">Trier: Level</option>
            <option value="classe">Trier: Classe</option>
          </select>
        </div>

        {/* Cartes */}
        {loading ? (
          <div style={{textAlign:"center",padding:"80px",color:T.muted}}><div style={{fontSize:38,marginBottom:10}}>⏳</div><div>Chargement...</div></div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 20px",color:T.muted}}>
            <div style={{fontSize:48,marginBottom:12,opacity:0.3}}>🗡️</div>
            <div style={{fontSize:15,fontWeight:600,color:T.textSub,marginBottom:6}}>{characters.length===0?"Aucun personnage":"Aucun résultat"}</div>
            <div style={{fontSize:12}}>{characters.length===0?"Ajoutez votre premier personnage":"Essayez de modifier vos filtres"}</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:11}}>
            {filtered.map((char)=>{
              const catColor = CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;
              const sc       = SURCATS.find(s=>s.id===(char.surcat||"PVM"))||SURCATS[2];
              return (
                <div key={char.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:13,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
                  <div style={{height:2,background:"linear-gradient(90deg,"+catColor+","+catColor+"30)"}} />
                  <div style={{padding:"13px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:40,height:40,borderRadius:10,background:catColor+"12",border:"1px solid "+catColor+"28",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <img src={CLASS_ICONS[char.classe]} style={{width:32,height:32,objectFit:"contain"}} alt={char.classe} onError={e=>e.target.style.display="none"} />
                        </div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                            <span style={{fontWeight:700,fontSize:14,color:T.text}}>{char.nom}</span>
                            <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20,background:sc.color+"18",color:sc.color,border:"1px solid "+sc.color+"28"}}>{sc.icon} {sc.label}</span>
                          </div>
                          <div style={{fontSize:11,color:T.muted}}>{char.compte||<span style={{fontStyle:"italic"}}>Sans compte</span>}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        <button onClick={()=>openEdit(char)} style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:7,padding:"5px 7px",color:T.accent,cursor:"pointer",fontSize:11,fontFamily:T.font}}>✏️</button>
                        <button onClick={()=>setDeleteConfirm(char.id)} style={{background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:7,padding:"5px 7px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>🗑️</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,marginBottom:9}}>
                      {[{l:"Classe",v:char.classe,c:T.textSub},{l:"Level",v:char.level,c:T.accent},{l:"Max",v:char.level_max,c:T.accent2}].map(s=>(
                        <div key={s.l} style={{flex:1,background:T.dimmer,borderRadius:6,padding:"4px 7px",textAlign:"center",border:"1px solid "+T.border}}>
                          <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{s.l}</div>
                          <div style={{fontWeight:700,fontSize:12,color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <select value={char.etat} onChange={e=>handleEtatChange(char.id,e.target.value)}
                        style={{flex:1,background:ETAT_COLORS[char.etat]+"15",border:"1px solid "+ETAT_COLORS[char.etat]+"38",borderRadius:8,padding:"6px 8px",color:ETAT_COLORS[char.etat],fontWeight:700,fontSize:11,outline:"none",fontFamily:T.font,cursor:"pointer"}}>
                        {ETATS.map(e=><option key={e}>{e}</option>)}
                      </select>
                      <select value={char.surcat||"PVM"} onChange={e=>handleSurcatChange(char.id,e.target.value)}
                        style={{background:T.dimmer,border:"1px solid "+T.border,borderRadius:8,padding:"6px 8px",color:T.text,fontWeight:600,fontSize:11,outline:"none",fontFamily:T.font,cursor:"pointer"}}>
                        <option value="PVM">🐉 PVM</option>
                        <option value="PVP">🏆 PVP</option>
                      </select>
                      <div style={{background:char.frigost==="Frigost 2"?T.accentBg:T.dimmer,border:"1px solid "+(char.frigost==="Frigost 2"?T.accentBorder:T.border),borderRadius:8,padding:"6px 9px",fontSize:11,color:char.frigost==="Frigost 2"?T.accent:T.muted,fontWeight:600,whiteSpace:"nowrap"}}>
                        {char.frigost==="Frigost 2"?"❄️ F2":"🌍 Cont."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{textAlign:"center",marginTop:14,color:T.muted,fontSize:10,letterSpacing:1.5}}>{filtered.length} PERSONNAGE{filtered.length>1?"S":""} • SAUVEGARDÉ SUR SUPABASE ☁️</div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(10px)"}}>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:18,padding:"26px",width:"100%",maxWidth:510,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",position:"relative",margin:16,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+T.accent+","+T.accent2+")",borderRadius:"18px 18px 0 0"}} />
            <button onClick={()=>setShowForm(false)} style={{position:"absolute",top:14,right:14,background:T.dimmer,border:"1px solid "+T.border,color:T.muted,fontSize:14,cursor:"pointer",borderRadius:7,padding:"3px 9px",fontFamily:T.font}}>✕</button>
            <h2 style={{margin:"0 0 20px",color:T.text,fontSize:17,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
              <span>{editingChar?"✏️":"⚔️"}</span>{editingChar?"Modifier":"Nouveau personnage"}
            </h2>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>📁 Dossier</label>
              <div style={{display:"flex",gap:8}}>
                {[{id:"PVM",icon:"🐉",color:T.pvm},{id:"PVP",icon:"🏆",color:T.pvp}].map(s=>(
                  <button key={s.id} onClick={()=>setForm(p=>({...p,surcat:s.id}))} style={{flex:1,padding:"11px",borderRadius:9,border:"2px solid "+(form.surcat===s.id?s.color:T.border),background:form.surcat===s.id?s.color+"14":T.dimmer,color:form.surcat===s.id?s.color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:14,fontWeight:700,transition:"all 0.15s"}}>
                    {s.icon} {s.id}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              {[{col:"1/-1",label:"Nom du compte",key:"compte",ph:"ex: MonCompte1"},{col:"1/-1",label:"Nom du personnage *",key:"nom",ph:"ex: Darkblade"}].map(f=>(
                <div key={f.key} style={{gridColumn:f.col}}>
                  <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{f.label}</label>
                  <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={fi} />
                </div>
              ))}
              <div>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Classe</label>
                <select value={form.classe} onChange={e=>setForm(p=>({...p,classe:e.target.value}))} style={{...fi,cursor:"pointer"}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>État</label>
                <select value={form.etat} onChange={e=>setForm(p=>({...p,etat:e.target.value}))} style={{...fi,cursor:"pointer"}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select>
              </div>
              <div>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Level actuel</label>
                <input type="number" min={1} max={200} value={form.level} onChange={e=>setForm(p=>({...p,level:parseInt(e.target.value)||1}))} style={fi} />
              </div>
              <div>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Level max atteint</label>
                <input type="number" min={1} max={200} value={form.level_max} onChange={e=>setForm(p=>({...p,level_max:parseInt(e.target.value)||1}))} style={fi} />
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Zone</label>
                <div style={{display:"flex",gap:8}}>
                  {["Continent","Frigost 2"].map(z=>(
                    <button key={z} onClick={()=>setForm(p=>({...p,frigost:z}))} style={{flex:1,padding:"10px",borderRadius:9,border:"2px solid "+(form.frigost===z?T.accent:T.border),background:form.frigost===z?T.accentBg:T.dimmer,color:form.frigost===z?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:600}}>
                      {z==="Frigost 2"?"❄️ Frigost 2":"🌍 Continent"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button onClick={()=>setShowForm(false)} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13}}>Annuler</button>
              <button onClick={handleSubmit} style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:13,boxShadow:"0 4px 16px "+T.accent+"40"}}>
                {editingChar?"Sauvegarder":"Ajouter le personnage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}
      {deleteConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(10px)"}}>
          <div style={{background:T.surface,border:"1px solid rgba(248,113,113,0.25)",borderRadius:18,padding:"28px",maxWidth:340,textAlign:"center",margin:16}}>
            <div style={{width:50,height:50,borderRadius:14,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 12px"}}>💀</div>
            <h3 style={{color:T.danger,margin:"0 0 6px",fontFamily:T.font}}>Supprimer ce personnage ?</h3>
            <p style={{color:T.muted,margin:"0 0 20px",fontSize:12}}>Action irréversible.</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"9px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font}}>Annuler</button>
              <button onClick={()=>handleDelete(deleteConfirm)} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:toast.type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,padding:"11px 18px",borderRadius:11,fontWeight:700,fontSize:13,boxShadow:"0 10px 36px rgba(0,0,0,0.5)",zIndex:200,fontFamily:T.font,display:"flex",alignItems:"center",gap:7}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
