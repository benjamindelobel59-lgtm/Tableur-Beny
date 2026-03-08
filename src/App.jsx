import { useState, useEffect } from "react";
import CraftManager from "./CraftManager.jsx";
import BuildCreator from "./BuildCreator.jsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const T = {
  bg:"#0f0d0a",surface:"#17140f",border:"#2c2316",
  accent:"#f59e0b",accent2:"#fbbf24",accentBg:"#f59e0b14",accentBorder:"#f59e0b35",
  pvp:"#f43f5e",pvm:"#34d399",text:"#fef3c7",textSub:"#92816a",
  muted:"#57483a",dimmer:"#211c12",danger:"#f87171",success:"#34d399",
  discord:"#5865F2",
  font:"'DM Sans', system-ui, sans-serif",
};


// ─── CODE D'ACCÈS ─────────────────────────────────────────────
const ACCESS_CODE = "FMX";
const GATE_KEY    = "tbb_access_granted";

function GatePage({ onSuccess }) {
  const [input, setInput]   = useState("");
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);

  const tryCode = () => {
    if (input.trim().toUpperCase() === ACCESS_CODE) {
      localStorage.setItem(GATE_KEY, "1");
      onSuccess();
    } else {
      setError(true); setShake(true); setInput("");
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 30px rgba(245,158,11,0.15)} 50%{box-shadow:0 0 60px rgba(245,158,11,0.35)} }
        .shake{animation:shake 0.5s ease;}
        .glow{animation:glow 3s ease-in-out infinite;}
        *{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}
        input::placeholder{color:${T.muted};}
      `}</style>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,background:"radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,"+T.accentBorder+",transparent)"}} />
      <div style={{width:"100%",maxWidth:380,margin:16,position:"relative",zIndex:1,textAlign:"center"}}>
        <div className="glow" style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 20px",boxShadow:"0 0 40px "+T.accent+"30"}}>⚔️</div>
        <div style={{fontWeight:800,fontSize:22,color:T.text,letterSpacing:0.5,marginBottom:4}}>Tableur By Beny</div>
        <div style={{fontSize:10,color:T.accent,letterSpacing:5,textTransform:"uppercase",marginBottom:32}}>Accès Restreint</div>
        <div style={{background:T.surface,border:"1px solid "+(error?"rgba(248,113,113,0.4)":T.border),borderRadius:20,padding:"28px",boxShadow:"0 40px 80px rgba(0,0,0,0.7)",transition:"border-color 0.3s"}}>
          <div style={{height:2,background:error?"linear-gradient(90deg,#f87171,#ef4444)":"linear-gradient(90deg,"+T.accent+","+T.accent2+")",borderRadius:2,marginBottom:24,transition:"background 0.3s"}} />
          <div style={{fontSize:12,color:T.textSub,marginBottom:18,lineHeight:1.7}}>🔒 Ce site est réservé aux membres.<br/>Entre le code d'accès pour continuer.</div>
          <div className={shake?"shake":""} style={{marginBottom:14}}>
            <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="CODE D'ACCÈS" maxLength={20}
              style={{width:"100%",background:T.dimmer,border:"1px solid "+(error?"rgba(248,113,113,0.4)":T.border),borderRadius:11,padding:"14px",color:error?T.danger:T.accent,fontSize:22,fontWeight:700,outline:"none",fontFamily:T.font,boxSizing:"border-box",textAlign:"center",letterSpacing:8,transition:"all 0.2s"}} />
          </div>
          {error&&<div style={{marginBottom:14,padding:"8px 12px",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,color:T.danger,fontSize:12,fontWeight:600}}>❌ Code incorrect — réessaie</div>}
          <button onClick={tryCode} style={{width:"100%",padding:"13px",borderRadius:11,border:"none",background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:14,boxShadow:"0 4px 20px "+T.accent+"40"}}>
            Entrer →
          </button>
        </div>
        <div style={{marginTop:18,fontSize:11,color:T.muted}}>
          Pas de code ? Rejoins le <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{color:"#5865F2",textDecoration:"none",fontWeight:600}}>Discord ⚡</a>
        </div>
      </div>
    </div>
  );
}

const CLASSES = ["Iop","Cra","Feca","Xelor","Enutrof","Sacrieur","Sadida","Ecaflip","Eniripsa","Sram","Pandawa","Roublard","Zobal","Steamer","Eliotrope","Huppermage","Ouginak","Forgelance","Osamodas"];
const ETATS   = ["Prêt","À stuff","À xp","Pano Sagesse","Mort","Check","Métier","Banque"];
const ETAT_COLORS = {"Prêt":"#34d399","À stuff":"#6ee7b7","À xp":"#818cf8","Pano Sagesse":"#fbbf24","Mort":"#f87171","Check":"#22d3ee","Métier":"#fb923c","Banque":"#a8a29e"};
const CLASS_ICONS = {"Iop":"/classes/iop.png","Cra":"/classes/cra.png","Feca":"/classes/feca.png","Xelor":"/classes/xelor.png","Enutrof":"/classes/enutrof.png","Sacrieur":"/classes/sacrieur.png","Sadida":"/classes/sadida.png","Ecaflip":"/classes/ecaflip.png","Eniripsa":"/classes/eniripsa.png","Sram":"/classes/sram.png","Pandawa":"/classes/pandawa.png","Roublard":"/classes/roublard.png","Zobal":"/classes/zobal.png","Steamer":"/classes/steamer.png","Eliotrope":"/classes/eliotrope.png","Huppermage":"/classes/huppermage.png","Ouginak":"/classes/ouginak.png","Forgelance":"/classes/forgelance.png","Osamodas":"/classes/osamodas.png"};

const SURCATS = [
  {id:"all",label:"Tous",icon:"⚔️",color:T.accent},
  {id:"PVP",label:"PVP",icon:"🏆",color:T.pvp},
  {id:"PVM",label:"PVM",icon:"🐉",color:T.pvm},
];
const CATEGORIES = [
  {id:"all",    label:"Tous",        icon:"⚔️",color:T.accent, etats:null},
  {id:"pret",   label:"Prêt",        icon:"✅",color:"#34d399",etats:["Prêt"]},
  {id:"astuff", label:"À stuff",     icon:"🛡️",color:"#6ee7b7",etats:["À stuff"]},
  {id:"axp",    label:"À xp",        icon:"⭐",color:"#818cf8",etats:["À xp"]},
  {id:"sagesse",label:"Pano Sagesse",icon:"🟡",color:"#fbbf24",etats:["Pano Sagesse"]},
  {id:"mort",   label:"Mort",        icon:"💀",color:"#f87171",etats:["Mort"]},
  {id:"check",  label:"Check",       icon:"🔍",color:"#22d3ee",etats:["Check"]},
  {id:"metier", label:"Métier",      icon:"⚒️",color:"#fb923c",etats:["Métier"]},
  {id:"banque", label:"Banque",      icon:"🏦",color:"#a8a29e",etats:["Banque"]},
];

const defaultChar = () => ({compte:"",nom:"",classe:"Iop",level:1,level_max:1,etat:"Prêt",frigost:"Continent",surcat:"PVM"});
const getCatForEtat = (etat) => { for (const c of CATEGORIES) { if (c.etats?.includes(etat)) return c.id; } return "all"; };
const fi = {width:"100%",background:T.dimmer,border:"1px solid "+T.border,borderRadius:9,padding:"10px 14px",color:T.text,fontSize:14,outline:"none",fontFamily:T.font,boxSizing:"border-box"};

const SHARE_TYPE_LABELS = {
  all:   {icon:"⚔️",label:"Tous les personnages"},
  compte:{icon:"👤",label:"Un compte spécifique"},
  craft: {icon:"⚗️",label:"Craft Manager"},
};

// ─── WEBHOOK EVENTS ───────────────────────────────────────────
const WEBHOOK_EVENTS = [
  {id:"mort",      label:"Mort d'un personnage", icon:"💀", color:"#f87171",   desc:"Quand un perso passe en état Mort"},
  {id:"etat",      label:"Changement d'état",    icon:"🔄", color:"#818cf8",   desc:"Quand l'état d'un perso change"},
  {id:"surcat",    label:"Changement PVP/PVM",   icon:"⚔️", color:T.accent,    desc:"Quand un perso change de dossier"},
  {id:"add",       label:"Nouveau personnage",   icon:"✨", color:"#34d399",   desc:"Quand un perso est ajouté"},
  {id:"levelup",   label:"Level up",             icon:"⭐", color:"#fbbf24",   desc:"Quand le level d'un perso augmente"},
];

// ─── BUILD DISCORD EMBED (minimaliste) ───────────────────────
const buildEmbed = (type, char, extra={}) => {
  const surcat = char.surcat||"PVM";
  const si = surcat==="PVP"?"🏆":"🐉";
  const footer = { text:"Tableur By Beny" };
  const ts = new Date().toISOString();

  const embed = (color, description) => ({
    embeds:[{ description, color, footer, timestamp:ts }]
  });

  if (type==="mort")    return embed(0xf87171, `💀 **${char.nom}** (${char.classe} • ${si} ${surcat}) est mort — Level ${char.level} — ⚠️ Pense à le reprendre !`);
  if (type==="etat")    return embed(parseInt((ETAT_COLORS[extra.newEtat]||"#818cf8").replace("#",""),16), `🔄 **${char.nom}** (${char.classe} • ${si} ${surcat}) : ${extra.oldEtat} → **${extra.newEtat}**`);
  if (type==="surcat")  return embed(extra.newSurcat==="PVP"?0xf43f5e:0x34d399, `⚔️ **${char.nom}** (${char.classe}) a changé de dossier : ${extra.oldSurcat==="PVP"?"🏆":"🐉"} ${extra.oldSurcat} → ${extra.newSurcat==="PVP"?"🏆":"🐉"} **${extra.newSurcat}**`);
  if (type==="add")     return embed(0x34d399, `✨ **${char.nom}** (${char.classe} • ${si} ${surcat}) a été ajouté — Level ${char.level} — ${char.etat}`);
  if (type==="levelup") return embed(0xfbbf24, `⭐ **${char.nom}** (${char.classe} • ${si} ${surcat}) a level up : ${extra.oldLevel} → **${extra.newLevel}**`);

  return null;
};

// ─── SEND WEBHOOK ─────────────────────────────────────────────
const sendWebhook = async (webhookUrl, payload) => {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),
    });
  } catch(e) { console.error("Webhook error:", e); }
};

// ─── WEBHOOKS TAB ─────────────────────────────────────────────
function WebhooksTab({ session }) {
  const [url, setUrl]         = useState("");
  const [saved, setSaved]     = useState("");
  const [events, setEvents]   = useState({mort:true,etat:true,surcat:true,add:true,levelup:true});
  const [testing, setTesting] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState(null);

  const storageKey = "webhook_config_"+session.user.id;

  useEffect(()=>{
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const cfg = JSON.parse(raw);
      setUrl(cfg.url||"");
      setSaved(cfg.url||"");
      setEvents(cfg.events||{mort:true,etat:true,surcat:true,add:true,levelup:true});
    }
  },[]);

  const save = () => {
    setSaving(true);
    localStorage.setItem(storageKey, JSON.stringify({url, events}));
    setSaved(url);
    setTimeout(()=>setSaving(false), 600);
    setMsg({type:"success",text:"Configuration sauvegardée ✓"});
    setTimeout(()=>setMsg(null),3000);
  };

  const test = async () => {
    if (!url) return setMsg({type:"error",text:"Entre d'abord l'URL du webhook !"});
    setTesting(true);
    const payload = {
      embeds:[{
        title:"🔔 Test — Tableur By Beny",
        description:"Ton webhook est bien connecté ! Les notifications fonctionnent correctement.",
        color:0xf59e0b,
        fields:[
          {name:"✅ Statut",    value:"Connecté",            inline:true},
          {name:"👤 Compte",   value:session.user.email,     inline:true},
          {name:"📅 Date",     value:new Date().toLocaleString("fr-FR"), inline:true},
        ],
        footer:{text:"Tableur By Beny • Serveur Héroïque"},
        timestamp:new Date().toISOString(),
      }]
    };
    try {
      const res = await fetch(url, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      if (res.ok) setMsg({type:"success",text:"✅ Message test envoyé sur Discord !"});
      else setMsg({type:"error",text:"❌ URL invalide ou webhook supprimé"});
    } catch(e) {
      setMsg({type:"error",text:"❌ Erreur réseau — vérifie l'URL"});
    }
    setTesting(false);
    setTimeout(()=>setMsg(null),4000);
  };

  const toggleEvent = (id) => setEvents(prev=>({...prev,[id]:!prev[id]}));

  return (
    <div style={{maxWidth:700}}>
      <div style={{marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:17,color:T.text,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:36,height:36,borderRadius:9,background:"#5865F220",border:"1px solid #5865F240",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🔔</span>
          Notifications Discord
        </div>
        <div style={{fontSize:12,color:T.muted}}>Reçois des messages automatiques dans ton salon Discord à chaque modification.</div>
      </div>

      {/* ÉTAPES */}
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:13,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>📋 Comment ça marche ?</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            ["1","Va dans ton serveur Discord → paramètres d'un salon → Intégrations → Webhooks"],
            ["2","Clique sur \"Nouveau Webhook\", donne-lui un nom (ex: Tableur Beny)"],
            ["3","Copie l'URL du webhook et colle-la ci-dessous"],
            ["4","Choisis les événements qui t'intéressent et sauvegarde !"],
          ].map(([n,t])=>(
            <div key={n} style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{width:22,height:22,borderRadius:6,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.accent,flexShrink:0}}>{n}</span>
              <span style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* URL WEBHOOK */}
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:13,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:12,fontWeight:700}}>🔗 URL du Webhook Discord</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input
            value={url}
            onChange={e=>setUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            style={{...fi,flex:1,fontSize:12}}
          />
          {saved && url===saved && (
            <span style={{fontSize:10,color:T.success,whiteSpace:"nowrap",fontWeight:600}}>✓ Sauvegardé</span>
          )}
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={test} disabled={testing} style={{flex:1,padding:"9px",borderRadius:9,border:"1px solid #5865F240",background:"#5865F215",color:T.discord,fontWeight:600,cursor:testing?"not-allowed":"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            {testing?"⏳ Envoi...":"🧪 Tester la connexion"}
          </button>
          <button onClick={save} disabled={saving} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:T.font,fontSize:12,boxShadow:"0 4px 14px "+T.accent+"40"}}>
            {saving?"✓ Sauvegardé !":"💾 Sauvegarder"}
          </button>
        </div>
        {msg && (
          <div style={{marginTop:10,padding:"9px 13px",background:msg.type==="error"?"rgba(248,113,113,0.1)":"rgba(52,211,153,0.1)",border:"1px solid "+(msg.type==="error"?"rgba(248,113,113,0.25)":"rgba(52,211,153,0.25)"),borderRadius:8,color:msg.type==="error"?T.danger:T.success,fontSize:12,fontWeight:600}}>
            {msg.text}
          </div>
        )}
      </div>

      {/* ÉVÉNEMENTS */}
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:13,padding:18}}>
        <div style={{fontSize:11,color:T.accent,letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:700}}>⚡ Événements actifs</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {WEBHOOK_EVENTS.map(ev=>(
            <div key={ev.id} onClick={()=>toggleEvent(ev.id)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:events[ev.id]?ev.color+"0d":T.dimmer,border:"1px solid "+(events[ev.id]?ev.color+"35":T.border),borderRadius:10,cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{width:36,height:36,borderRadius:9,background:ev.color+"15",border:"1px solid "+ev.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ev.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,color:events[ev.id]?T.text:T.muted}}>{ev.label}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1}}>{ev.desc}</div>
              </div>
              {/* Toggle */}
              <div style={{width:42,height:24,borderRadius:12,background:events[ev.id]?"linear-gradient(135deg,"+T.accent+","+T.accent2+")":T.border,position:"relative",flexShrink:0,transition:"all 0.2s",boxShadow:events[ev.id]?"0 2px 8px "+T.accent+"40":"none"}}>
                <div style={{position:"absolute",top:3,left:events[ev.id]?20:3,width:18,height:18,borderRadius:9,background:"#fff",transition:"all 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}} />
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,padding:"9px 13px",background:T.dimmer,borderRadius:8,border:"1px solid "+T.border,fontSize:11,color:T.muted}}>
          💡 N'oublie pas de <strong style={{color:T.accent}}>sauvegarder</strong> après avoir modifié les événements.
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────
function AuthPage() {
  const [mode,setMode]         = useState("login");
  const [email,setEmail]       = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading]   = useState(false);
  const [error,setError]       = useState("");
  const [success,setSuccess]   = useState("");

  const handle = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode==="login") {
        const {error} = await supabase.auth.signInWithPassword({email,password});
        if (error) throw error;
      } else {
        const {error} = await supabase.auth.signUp({email,password});
        if (error) throw error;
        setSuccess("Compte créé ! Vérifie ton email puis connecte-toi.");
        setMode("login"); setLoading(false); return;
      }
    } catch(e) { setError(e.message||"Une erreur est survenue"); }
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

// ─── PARTAGES TAB ─────────────────────────────────────────────
function PartagesTab({ session, characters, showToast }) {
  const [myShares,setMyShares]             = useState([]);
  const [receivedShares,setReceivedShares] = useState([]);
  const [showModal,setShowModal]           = useState(false);
  const [viewShare,setViewShare]           = useState(null);
  const [viewChars,setViewChars]           = useState([]);
  const [viewLoading,setViewLoading]       = useState(false);
  const [shareType,setShareType]           = useState("all");
  const [shareEmail,setShareEmail]         = useState("");
  const [shareCompte,setShareCompte]       = useState("");
  const [canEdit,setCanEdit]               = useState(false);
  const [saving,setSaving]                 = useState(false);
  const comptes = [...new Set(characters.map(c=>c.compte).filter(Boolean))];

  useEffect(()=>{ loadMyShares(); loadReceivedShares(); },[]);

  const loadMyShares = async()=>{
    const {data} = await supabase.from("shares").select("*").eq("owner_id",session.user.id).order("created_at",{ascending:false});
    if(data) setMyShares(data);
  };
  const loadReceivedShares = async()=>{
    const {data} = await supabase.from("shares").select("*").eq("shared_with_email",session.user.email).order("created_at",{ascending:false});
    if(data) setReceivedShares(data);
  };

  const createShare = async()=>{
    if(!shareEmail.trim()) return showToast("Email requis !","error");
    if(shareEmail.trim().toLowerCase()===session.user.email.toLowerCase()) return showToast("Tu ne peux pas partager avec toi-même !","error");
    if(shareType==="compte"&&!shareCompte) return showToast("Choisis un compte à partager !","error");
    setSaving(true);
    const {error} = await supabase.from("shares").insert([{owner_id:session.user.id,owner_email:session.user.email,shared_with_email:shareEmail.trim().toLowerCase(),share_type:shareType,compte_name:shareType==="compte"?shareCompte:null,can_edit:canEdit}]);
    setSaving(false);
    if(error) return showToast("Erreur : "+error.message,"error");
    showToast("Partage créé ✓");
    setShowModal(false); setShareEmail(""); setShareType("all"); setShareCompte(""); setCanEdit(false);
    loadMyShares();
  };

  const deleteShare = async(id)=>{
    await supabase.from("shares").delete().eq("id",id);
    showToast("Partage supprimé"); loadMyShares();
  };

  const openReceivedShare = async(share)=>{
    setViewShare(share); setViewChars([]); setViewLoading(true);
    let query = supabase.from("characters").select("*").eq("user_id",share.owner_id);
    if(share.share_type==="compte") query=query.eq("compte",share.compte_name);
    const {data} = await query.order("created_at",{ascending:true});
    setViewChars(data||[]); setViewLoading(false);
  };

  const ShareTypeBtn = ({id})=>{
    const t=SHARE_TYPE_LABELS[id]; const active=shareType===id;
    return <button onClick={()=>setShareType(id)} style={{flex:1,padding:"11px 8px",borderRadius:9,border:"2px solid "+(active?T.accent:T.border),background:active?T.accentBg:T.dimmer,color:active?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:active?700:400,textAlign:"center"}}>
      <div style={{fontSize:18,marginBottom:3}}>{t.icon}</div>
      <div style={{fontSize:10,lineHeight:1.3}}>{t.label}</div>
    </button>;
  };

  if(viewShare){
    const typeInfo=SHARE_TYPE_LABELS[viewShare.share_type];
    return (
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={()=>setViewShare(null)} style={{background:T.dimmer,border:"1px solid "+T.border,borderRadius:8,padding:"6px 12px",color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:12}}>← Retour</button>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:T.text}}>{typeInfo.icon} {viewShare.share_type==="compte"?`Compte "${viewShare.compte_name}"`:typeInfo.label}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:1}}>Partagé par <span style={{color:T.accent}}>{viewShare.owner_email}</span></div>
          </div>
        </div>
        {viewLoading?<div style={{textAlign:"center",padding:"60px",color:T.muted}}>⏳ Chargement...</div>:viewChars.length===0?<div style={{textAlign:"center",padding:"60px",color:T.muted}}>🗡️ Aucun personnage</div>:(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>
            {viewChars.map((char)=>{
              const catColor=CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;
              const sc=SURCATS.find(s=>s.id===(char.surcat||"PVM"))||SURCATS[2];
              return (
                <div key={char.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:13,overflow:"hidden"}}>
                  <div style={{height:2,background:"linear-gradient(90deg,"+catColor+","+catColor+"30)"}} />
                  <div style={{padding:"12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                      <div style={{width:38,height:38,borderRadius:10,background:catColor+"12",border:"1px solid "+catColor+"28",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <img src={CLASS_ICONS[char.classe]} style={{width:30,height:30,objectFit:"contain"}} alt="" onError={e=>e.target.style.display="none"} />
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <span style={{fontWeight:700,fontSize:13,color:T.text}}>{char.nom}</span>
                          <span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:20,background:sc.color+"18",color:sc.color}}>{sc.icon} {sc.label}</span>
                        </div>
                        <div style={{fontSize:10,color:T.muted,marginTop:1}}>{char.compte}</div>
                      </div>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:ETAT_COLORS[char.etat]+"15",color:ETAT_COLORS[char.etat],fontWeight:600}}>{char.etat}</span>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      {[{l:"Classe",v:char.classe,c:T.textSub},{l:"Level",v:char.level,c:T.accent},{l:"Max",v:char.level_max,c:T.accent2}].map(s=>(
                        <div key={s.l} style={{flex:1,background:T.dimmer,borderRadius:6,padding:"4px 6px",textAlign:"center",border:"1px solid "+T.border}}>
                          <div style={{fontSize:7,color:T.muted,marginBottom:1}}>{s.l}</div>
                          <div style={{fontSize:11,fontWeight:600,color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:T.text}}>📤 Mes partages</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>Ce que tu partages avec d'autres</div>
            </div>
            <button onClick={()=>setShowModal(true)} style={{background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,border:"none",borderRadius:9,padding:"8px 16px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:T.font}}>+ Nouveau</button>
          </div>
          {myShares.length===0?(
            <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:"40px 20px",textAlign:"center"}}>
              <div style={{fontSize:34,marginBottom:8}}>🔒</div>
              <div style={{color:T.muted,fontSize:13}}>Tu ne partages rien pour l'instant</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {myShares.map(s=>{
                const t=SHARE_TYPE_LABELS[s.share_type];
                return (
                  <div key={s.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:9,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:T.text}}>{s.share_type==="compte"?`Compte "${s.compte_name}"`:t.label}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>→ <span style={{color:T.accent}}>{s.shared_with_email}</span></div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:s.can_edit?"rgba(52,211,153,0.12)":"rgba(245,158,11,0.12)",color:s.can_edit?T.success:T.accent,fontWeight:600}}>{s.can_edit?"✏️ Modifiable":"👁️ Lecture"}</span>
                      <button onClick={()=>deleteShare(s.id)} style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.18)",borderRadius:6,padding:"2px 8px",color:T.danger,cursor:"pointer",fontSize:10,fontFamily:T.font}}>Supprimer</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <div style={{marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:15,color:T.text}}>📥 Partagé avec moi</div>
            <div style={{fontSize:11,color:T.muted,marginTop:2}}>Ce que d'autres ont partagé avec toi</div>
          </div>
          {receivedShares.length===0?(
            <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:"40px 20px",textAlign:"center"}}>
              <div style={{fontSize:34,marginBottom:8}}>📭</div>
              <div style={{color:T.muted,fontSize:13}}>Personne n'a encore partagé avec toi</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {receivedShares.map(s=>{
                const t=SHARE_TYPE_LABELS[s.share_type];
                return (
                  <div key={s.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{t.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:T.text}}>{s.share_type==="compte"?`Compte "${s.compte_name}"`:t.label}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>De <span style={{color:T.success}}>{s.owner_email}</span></div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:s.can_edit?"rgba(52,211,153,0.12)":"rgba(245,158,11,0.12)",color:s.can_edit?T.success:T.accent,fontWeight:600}}>{s.can_edit?"✏️ Modifiable":"👁️ Lecture"}</span>
                      {s.share_type!=="craft"&&<button onClick={()=>openReceivedShare(s)} style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:6,padding:"2px 8px",color:T.accent,cursor:"pointer",fontSize:10,fontFamily:T.font}}>Voir</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(10px)"}}>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:18,padding:"26px",width:"100%",maxWidth:480,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",position:"relative",margin:16}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+T.accent+","+T.accent2+")",borderRadius:"18px 18px 0 0"}} />
            <button onClick={()=>setShowModal(false)} style={{position:"absolute",top:14,right:14,background:T.dimmer,border:"1px solid "+T.border,color:T.muted,fontSize:14,cursor:"pointer",borderRadius:7,padding:"3px 9px",fontFamily:T.font}}>✕</button>
            <h2 style={{margin:"0 0 20px",color:T.text,fontSize:17,fontWeight:700}}>🔗 Nouveau partage</h2>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Que veux-tu partager ?</label>
              <div style={{display:"flex",gap:8}}><ShareTypeBtn id="all"/><ShareTypeBtn id="compte"/><ShareTypeBtn id="craft"/></div>
            </div>
            {shareType==="compte"&&(
              <div style={{marginBottom:14}}>
                <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Quel compte ?</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {comptes.map(c=><button key={c} onClick={()=>setShareCompte(c)} style={{padding:"5px 12px",borderRadius:7,border:"1px solid "+(shareCompte===c?T.accent:T.border),background:shareCompte===c?T.accentBg:T.dimmer,color:shareCompte===c?T.accent:T.muted,fontFamily:T.font,fontSize:12,cursor:"pointer",fontWeight:shareCompte===c?600:400}}>👤 {c}</button>)}
                </div>
              </div>
            )}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Email du destinataire</label>
              <input value={shareEmail} onChange={e=>setShareEmail(e.target.value)} placeholder="ami@email.com" style={fi} />
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",color:T.muted,fontSize:9,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Permission</label>
              <div style={{display:"flex",gap:8}}>
                {[{v:false,icon:"👁️",label:"Lecture seule",sub:"Peut voir, pas modifier"},{v:true,icon:"✏️",label:"Lecture + modification",sub:"Peut changer les états"}].map(p=>(
                  <button key={p.label} onClick={()=>setCanEdit(p.v)} style={{flex:1,padding:"10px",borderRadius:9,border:"2px solid "+(canEdit===p.v?T.accent:T.border),background:canEdit===p.v?T.accentBg:T.dimmer,color:canEdit===p.v?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,textAlign:"left"}}>
                    <div style={{fontSize:16,marginBottom:3}}>{p.icon}</div>
                    <div style={{fontSize:11,fontWeight:600}}>{p.label}</div>
                    <div style={{fontSize:9,marginTop:1,opacity:0.7}}>{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13}}>Annuler</button>
              <button onClick={createShare} disabled={saving} style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:T.font,fontSize:13}}>
                {saving?"Création...":"🔗 Créer le partage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [gateOpen,setGateOpen]           = useState(()=>localStorage.getItem(GATE_KEY)==="1");
  const [session,setSession]             = useState(null);
  const [mainTab,setMainTab]             = useState("persos");
  const [authLoading,setAuthLoading]     = useState(true);
  const [characters,setCharacters]       = useState([]);
  const [loading,setLoading]             = useState(false);
  const [activeSurcat,setActiveSurcat]   = useState("all");
  const [activeTab,setActiveTab]         = useState("all");
  const [search,setSearch]               = useState("");
  const [filterCompte,setFilterCompte]   = useState("Tous");
  const [sortBy,setSortBy]               = useState("compte");
  const [showForm,setShowForm]           = useState(false);
  const [editingChar,setEditingChar]     = useState(null);
  const [form,setForm]                   = useState(defaultChar());
  const [toast,setToast]                 = useState(null);
  const [deleteConfirm,setDeleteConfirm] = useState(null);
  const [shareCount,setShareCount]       = useState(0);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); setAuthLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{ if(session){ loadCharacters(); loadShareCount(); } },[session]);

  const loadCharacters = async()=>{
    setLoading(true);
    const {data,error} = await supabase.from("characters").select("*").order("created_at",{ascending:true});
    if(!error&&data) setCharacters(data);
    setLoading(false);
  };

  const loadShareCount = async()=>{
    const {data} = await supabase.from("shares").select("id").eq("shared_with_email",session?.user?.email);
    if(data) setShareCount(data.length);
  };

  // ── Récupère la config webhook de l'utilisateur ────────────
  const getWebhookConfig = () => {
    if (!session) return null;
    const raw = localStorage.getItem("webhook_config_"+session.user.id);
    if (!raw) return null;
    return JSON.parse(raw);
  };

  const fireWebhook = (type, char, extra={}) => {
    const cfg = getWebhookConfig();
    if (!cfg || !cfg.url) return;
    if (cfg.events && cfg.events[type]===false) return;
    const payload = buildEmbed(type, char, extra);
    if (payload) sendWebhook(cfg.url, payload);
  };

  const showToast = (msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const openAdd  = ()=>{ setForm(defaultChar()); setEditingChar(null); setShowForm(true); };
  const openEdit = (c)=>{ setForm({compte:c.compte,nom:c.nom,classe:c.classe,level:c.level,level_max:c.level_max,etat:c.etat,frigost:c.frigost,surcat:c.surcat||"PVM"}); setEditingChar(c.id); setShowForm(true); };

  const handleSubmit = async()=>{
    if(!form.nom.trim()) return showToast("Le nom est requis !","error");
    if(editingChar){
      const oldChar = characters.find(c=>c.id===editingChar);
      const {error} = await supabase.from("characters").update(form).eq("id",editingChar);
      if(error) return showToast("Erreur lors de la modification","error");
      // Level up webhook
      if(oldChar && form.level > oldChar.level) {
        fireWebhook("levelup", {...oldChar,...form}, {oldLevel:oldChar.level, newLevel:form.level});
      }
      showToast("Personnage modifié ✓");
    } else {
      const {error} = await supabase.from("characters").insert([{...form,user_id:session.user.id}]);
      if(error) return showToast("Erreur lors de l'ajout","error");
      fireWebhook("add", form);
      showToast("Personnage ajouté ✓");
    }
    await loadCharacters(); setShowForm(false);
  };

  const handleDelete = async(id)=>{
    const {error} = await supabase.from("characters").delete().eq("id",id);
    if(error) return showToast("Erreur lors de la suppression","error");
    await loadCharacters(); setDeleteConfirm(null);
    showToast("Personnage supprimé");
  };

  const handleEtatChange = async(id,etat)=>{
    const char = characters.find(c=>c.id===id);
    const oldEtat = char?.etat;
    const {error} = await supabase.from("characters").update({etat}).eq("id",id);
    if(error) return;
    setCharacters(characters.map(c=>c.id===id?{...c,etat}:c));
    const newCat = getCatForEtat(etat);
    setActiveTab(newCat);
    // Webhook : mort ou changement d'état
    if(etat==="Mort") fireWebhook("mort",{...char,etat},{});
    else fireWebhook("etat",{...char,etat},{oldEtat,newEtat:etat});
    showToast("Déplacé → \""+CATEGORIES.find(c=>c.id===newCat)?.label+"\" ✓");
  };

  const handleSurcatChange = async(id,surcat)=>{
    const char = characters.find(c=>c.id===id);
    const oldSurcat = char?.surcat||"PVM";
    const {error} = await supabase.from("characters").update({surcat}).eq("id",id);
    if(error) return;
    setCharacters(characters.map(c=>c.id===id?{...c,surcat}:c));
    fireWebhook("surcat",{...char,surcat},{oldSurcat,newSurcat:surcat});
    showToast("Dossier → "+surcat+" ✓");
  };

  const handleLogout = async()=>{ await supabase.auth.signOut(); };

  if(!gateOpen) return <GatePage onSuccess={()=>setGateOpen(true)} />;

  if(authLoading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,color:T.accent,fontFamily:T.font}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:14}}>⚔️</div><div style={{letterSpacing:3,color:T.textSub}}>CHARGEMENT...</div></div>
    </div>
  );
  if(!session) return <AuthPage />;

  const comptes     = ["Tous",...Array.from(new Set(characters.map(c=>c.compte).filter(Boolean)))];
  const countSurcat = (sc)=> sc.id==="all"?characters.length:characters.filter(c=>(c.surcat||"PVM")===sc.id).length;
  const countFor    = (cat)=>{ const base=activeSurcat==="all"?characters:characters.filter(c=>(c.surcat||"PVM")===activeSurcat); return cat.etats?base.filter(c=>cat.etats.includes(c.etat)).length:base.length; };

  const filtered = characters.filter(c=>{
    const inSurcat=activeSurcat==="all"||(c.surcat||"PVM")===activeSurcat;
    const cat=CATEGORIES.find(cat=>cat.id===activeTab);
    const inTab=activeTab==="all"||(cat?.etats&&cat.etats.includes(c.etat));
    const s=search.toLowerCase();
    return inSurcat&&inTab&&(c.nom.toLowerCase().includes(s)||c.compte.toLowerCase().includes(s)||c.classe.toLowerCase().includes(s))&&(filterCompte==="Tous"||c.compte===filterCompte);
  }).sort((a,b)=>{
    if(sortBy==="compte") return (a.compte||"").localeCompare(b.compte||"")||(a.nom||"").localeCompare(b.nom||"");
    if(sortBy==="level")  return b.level-a.level;
    if(sortBy==="nom")    return (a.nom||"").localeCompare(b.nom||"");
    return (a.classe||"").localeCompare(b.classe||"");
  });

  const TabBtn = ({active,color,onClick,icon,label,count})=>(
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,border:"1px solid "+(active?color+"55":T.border),background:active?color+"12":T.surface,color:active?color:T.muted,cursor:"pointer",fontWeight:active?600:400,fontSize:13,transition:"all 0.15s",fontFamily:T.font}}>
      <span>{icon}</span><span>{label}</span>
      <span style={{background:active?color+"28":T.dimmer,color:active?color:T.muted,borderRadius:20,padding:"0 6px",fontSize:11,fontWeight:700}}>{count}</span>
    </button>
  );

  const MAIN_TABS = [
    {id:"persos",   icon:"⚔️", label:"Personnages"},
    {id:"craft",    icon:"⚗️", label:"Craft Manager"},
    {id:"build",    icon:"🧪", label:"Créateur de Build"},
    {id:"partages", icon:"🔗", label:"Partages", badge:shareCount},
    {id:"webhooks", icon:"🔔", label:"Webhooks"},
  ];

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
            {mainTab==="persos"&&<button onClick={openAdd} style={{background:"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,border:"none",borderRadius:9,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:T.font,whiteSpace:"nowrap",boxShadow:"0 4px 14px "+T.accent+"40"}}>+ Ajouter</button>}
            <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:"#5865F2",border:"none",borderRadius:9,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap",boxShadow:"0 4px 14px #5865F240",fontFamily:T.font}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              Discord
            </a>
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
          {MAIN_TABS.map(t=>(
            <button key={t.id} onClick={()=>setMainTab(t.id)} style={{padding:"11px 18px",border:"none",borderBottom:mainTab===t.id?"2px solid "+T.accent:"2px solid transparent",background:"transparent",color:mainTab===t.id?T.accent:T.muted,fontWeight:mainTab===t.id?700:400,cursor:"pointer",fontSize:13,fontFamily:T.font,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s",position:"relative"}}>
              <span>{t.icon}</span><span>{t.label}</span>
              {t.badge>0&&<span style={{background:T.pvp,color:"#fff",borderRadius:20,padding:"1px 6px",fontSize:9,fontWeight:700}}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {mainTab==="craft"    && <CraftManager session={session} />}
      {mainTab==="build"    && <BuildCreator />}
      {mainTab==="partages" && <div style={{maxWidth:1400,margin:"0 auto",padding:"22px 26px"}}><PartagesTab session={session} characters={characters} showToast={showToast} /></div>}
      {mainTab==="webhooks" && <div style={{maxWidth:1400,margin:"0 auto",padding:"22px 26px"}}><WebhooksTab session={session} /></div>}

      {/* PERSOS */}
      <div style={{maxWidth:1400,margin:"0 auto",display:mainTab==="persos"?"block":"none",padding:"20px 26px"}}>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>📁 Dossier</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {SURCATS.map(sc=><TabBtn key={sc.id} active={activeSurcat===sc.id} color={sc.color} onClick={()=>{setActiveSurcat(sc.id);setActiveTab("all");}} icon={sc.icon} label={sc.label} count={countSurcat(sc)} />)}
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>🗂️ État</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {CATEGORIES.map(cat=><TabBtn key={cat.id} active={activeTab===cat.id} color={cat.color} onClick={()=>setActiveTab(cat.id)} icon={cat.icon} label={cat.label} count={countFor(cat)} />)}
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:180}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
            <input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...fi,paddingLeft:36}} />
          </div>
          <select value={filterCompte} onChange={e=>setFilterCompte(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>{comptes.map(c=><option key={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>
            <option value="compte">Trier: Compte</option><option value="nom">Trier: Nom</option>
            <option value="level">Trier: Level</option><option value="classe">Trier: Classe</option>
          </select>
        </div>
        {loading?(
          <div style={{textAlign:"center",padding:"80px",color:T.muted}}><div style={{fontSize:38,marginBottom:10}}>⏳</div><div>Chargement...</div></div>
        ):filtered.length===0?(
          <div style={{textAlign:"center",padding:"80px 20px",color:T.muted}}>
            <div style={{fontSize:48,marginBottom:12,opacity:0.3}}>🗡️</div>
            <div style={{fontSize:15,fontWeight:600,color:T.textSub,marginBottom:6}}>{characters.length===0?"Aucun personnage":"Aucun résultat"}</div>
            <div style={{fontSize:12}}>{characters.length===0?"Ajoutez votre premier personnage":"Essayez de modifier vos filtres"}</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:11}}>
            {filtered.map((char)=>{
              const catColor=CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;
              const sc=SURCATS.find(s=>s.id===(char.surcat||"PVM"))||SURCATS[2];
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
      {showForm&&(
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
                  <button key={s.id} onClick={()=>setForm(p=>({...p,surcat:s.id}))} style={{flex:1,padding:"11px",borderRadius:9,border:"2px solid "+(form.surcat===s.id?s.color:T.border),background:form.surcat===s.id?s.color+"14":T.dimmer,color:form.surcat===s.id?s.color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:14,fontWeight:700}}>
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
      {deleteConfirm&&(
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
      {toast&&(
        <div style={{position:"fixed",bottom:24,right:24,background:toast.type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,"+T.accent+","+T.accent2+")",color:T.bg,padding:"11px 18px",borderRadius:11,fontWeight:700,fontSize:13,boxShadow:"0 10px 36px rgba(0,0,0,0.5)",zIndex:200,fontFamily:T.font,display:"flex",alignItems:"center",gap:7}}>
          {toast.type==="error"?"❌":"✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
