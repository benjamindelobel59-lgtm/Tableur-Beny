import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const ThemeCtx = createContext({});
const useT = () => useContext(ThemeCtx);

// ─── THEMES ───────────────────────────────────────────────────
const THEMES = {
  sombre: {
    id:"sombre", label:"Sombre", icon:"🌑",
    dark:true,
    bg:"#080a0d", surface:"#0d1017", surface2:"#11141c", panel:"#0a0c12",
    border:"#1c2030", border2:"#161a27",
    text:"#dde0ec", textSub:"#7a7f96", muted:"#464c64",
    accent:"#d42020", accent2:"#e83535",
    accentBg:"rgba(212,32,32,0.09)", accentBorder:"rgba(212,32,32,0.32)",
    shadow:"0 2px 12px rgba(0,0,0,0.7)", shadowLg:"0 12px 40px rgba(0,0,0,0.85)",
  },
  clair: {
    id:"clair", label:"Clair", icon:"☀️",
    dark:false,
    bg:"#edf0f7", surface:"#ffffff", surface2:"#f3f4f9", panel:"#f8f9fc",
    border:"#d0d5e8", border2:"#e2e6f2",
    text:"#12151f", textSub:"#4a5068", muted:"#8890a8",
    accent:"#b91c1c", accent2:"#c62020",
    accentBg:"rgba(185,28,28,0.06)", accentBorder:"rgba(185,28,28,0.22)",
    shadow:"0 2px 8px rgba(0,0,0,0.07)", shadowLg:"0 12px 40px rgba(0,0,0,0.12)",
  },
  inferno: {
    id:"inferno", label:"Inferno", icon:"🔥",
    dark:true,
    bg:"#0d0700", surface:"#150c02", surface2:"#1c1003", panel:"#110900",
    border:"#3a1a05", border2:"#2a1203",
    text:"#f5d9b0", textSub:"#c47a3a", muted:"#7a4020",
    accent:"#f97316", accent2:"#fb923c",
    accentBg:"rgba(249,115,22,0.10)", accentBorder:"rgba(249,115,22,0.35)",
    shadow:"0 2px 12px rgba(0,0,0,0.8)", shadowLg:"0 12px 40px rgba(0,0,0,0.9)",
  },
  abyssal: {
    id:"abyssal", label:"Abyssal", icon:"🌊",
    dark:true,
    bg:"#020c14", surface:"#041525", surface2:"#061c30", panel:"#031120",
    border:"#0d3354", border2:"#082640",
    text:"#b8e4f9", textSub:"#4a9ac4", muted:"#2a5a7a",
    accent:"#06b6d4", accent2:"#22d3ee",
    accentBg:"rgba(6,182,212,0.09)", accentBorder:"rgba(6,182,212,0.35)",
    shadow:"0 2px 12px rgba(0,0,0,0.75)", shadowLg:"0 12px 40px rgba(0,0,0,0.88)",
  },
  sylvestre: {
    id:"sylvestre", label:"Sylvestre", icon:"🌿",
    dark:true,
    bg:"#020d05", surface:"#041408", surface2:"#061a0b", panel:"#031005",
    border:"#0f3318", border2:"#0a2610",
    text:"#c4f0cc", textSub:"#4aaa62", muted:"#2a6a3a",
    accent:"#22c55e", accent2:"#4ade80",
    accentBg:"rgba(34,197,94,0.09)", accentBorder:"rgba(34,197,94,0.35)",
    shadow:"0 2px 12px rgba(0,0,0,0.75)", shadowLg:"0 12px 40px rgba(0,0,0,0.88)",
  },
};

const makeT = (themeId) => {
  const th = THEMES[themeId] || THEMES.sombre;
  return {
    ...th,
    pvp:      th.dark ? "#ef4444" : "#dc2626",
    pvm:      th.dark ? "#22c55e" : "#16a34a",
    danger:   th.dark ? "#ef4444" : "#dc2626",
    dangerBg: th.dark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.07)",
    success:  th.accent === "#22c55e" || th.accent === "#06b6d4" ? th.accent : (th.dark ? "#22c55e" : "#16a34a"),
    successBg:th.accent === "#22c55e" ? "rgba(34,197,94,0.1)" : th.dark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.08)",
    warning:  th.dark ? "#f59e0b" : "#d97706",
    discord:  "#5865F2",
    font:     "'Rajdhani','DM Sans', system-ui, sans-serif",
    fontBody: "'DM Sans', system-ui, sans-serif",
  };
};

const ACCESS_CODE = "FMX";
const CLASSES = ["Iop","Cra","Feca","Xelor","Enutrof","Sacrieur","Sadida","Ecaflip","Eniripsa","Sram","Pandawa","Roublard","Zobal","Steamer","Eliotrope","Huppermage","Ouginak","Forgelance","Osamodas"];
const ETATS   = ["Prêt","À stuff","À xp","Pano Sagesse","Mort","Check","Métier","Banque"];
const ETAT_COLORS = {"Prêt":"#22c55e","À stuff":"#6ee7b7","À xp":"#818cf8","Pano Sagesse":"#fbbf24","Mort":"#ef4444","Check":"#22d3ee","Métier":"#fb923c","Banque":"#a8a29e"};
const CLASS_ICONS = {"Iop":"/classes/iop.png","Cra":"/classes/cra.png","Feca":"/classes/feca.png","Xelor":"/classes/xelor.png","Enutrof":"/classes/enutrof.png","Sacrieur":"/classes/sacrieur.png","Sadida":"/classes/sadida.png","Ecaflip":"/classes/ecaflip.png","Eniripsa":"/classes/eniripsa.png","Sram":"/classes/sram.png","Pandawa":"/classes/pandawa.png","Roublard":"/classes/roublard.png","Zobal":"/classes/zobal.png","Steamer":"/classes/steamer.png","Eliotrope":"/classes/eliotrope.png","Huppermage":"/classes/huppermage.png","Ouginak":"/classes/ouginak.png","Forgelance":"/classes/forgelance.png","Osamodas":"/classes/osamodas.png"};
const CATEGORIES = [
  {id:"all",    label:"Tous",        icon:"⚔️", color:"#6b7280", etats:null},
  {id:"pret",   label:"Prêt",        icon:"✅", color:"#22c55e", etats:["Prêt"]},
  {id:"astuff", label:"À stuff",     icon:"🛡️", color:"#6ee7b7", etats:["À stuff"]},
  {id:"axp",    label:"À xp",        icon:"⭐", color:"#818cf8", etats:["À xp"]},
  {id:"sagesse",label:"Sagesse",     icon:"🟡", color:"#fbbf24", etats:["Pano Sagesse"]},
  {id:"mort",   label:"Mort",        icon:"💀", color:"#ef4444", etats:["Mort"]},
  {id:"check",  label:"Check",       icon:"🔍", color:"#22d3ee", etats:["Check"]},
  {id:"metier", label:"Métier",      icon:"⚒️", color:"#fb923c", etats:["Métier"]},
  {id:"banque", label:"Banque",      icon:"🏦", color:"#a8a29e", etats:["Banque"]},
];
const SHARE_TYPE_LABELS = {all:{icon:"⚔️",label:"Tous les personnages"},compte:{icon:"👤",label:"Un compte spécifique"},craft:{icon:"⚗️",label:"Craft Manager"}};
const WEBHOOK_EVENTS = [
  {id:"mort",    label:"Mort d'un personnage", icon:"💀", color:"#ef4444", desc:"Quand un perso passe en état Mort"},
  {id:"etat",    label:"Changement d'état",    icon:"🔄", color:"#818cf8", desc:"Quand l'état d'un perso change"},
  {id:"surcat",  label:"Changement PVP/PVM",   icon:"⚔️", color:"#5b6cf0", desc:"Quand un perso change de dossier"},
  {id:"add",     label:"Nouveau personnage",   icon:"✨", color:"#22c55e", desc:"Quand un perso est ajouté"},
  {id:"levelup", label:"Level up",             icon:"⭐", color:"#fbbf24", desc:"Quand le level d'un perso augmente"},
];
const DOFUSDU_BASE = "https://api.dofusdu.de/dofus2/fr";
const CRAFT_SEARCH_TYPES = [{id:"equipment",label:"Équip.",icon:"⚔️"},{id:"resources",label:"Ressources",icon:"🌿"},{id:"consumables",label:"Conso.",icon:"🧪"}];

const defaultChar = () => ({compte:"",nom:"",classe:"Iop",level:1,level_max:1,etat:"Prêt",frigost:"Continent",surcat:"PVM"});
const getCatForEtat = (etat) => { for(const c of CATEGORIES){if(c.etats?.includes(etat))return c.id;}return "all"; };
const makeFi = (T) => ({width:"100%",background:T.surface2,border:"1px solid "+T.border,borderRadius:8,padding:"9px 13px",color:T.text,fontSize:14,outline:"none",fontFamily:T.font,boxSizing:"border-box"});

const buildEmbed = (type,char,extra={}) => {
  const surcat=char.surcat||"PVM";const si=surcat==="PVP"?"🏆":"🐉";const footer={text:"Tableur By Beny"};const ts=new Date().toISOString();
  const embed=(color,description)=>({embeds:[{description,color,footer,timestamp:ts}]});
  if(type==="mort")    return embed(0xef4444,`💀 **${char.nom}** (${char.classe} · ${si} ${surcat}) est mort — Level ${char.level}`);
  if(type==="etat")    return embed(parseInt((ETAT_COLORS[extra.newEtat]||"#818cf8").replace("#",""),16),`🔄 **${char.nom}** (${char.classe}) : ${extra.oldEtat} → **${extra.newEtat}**`);
  if(type==="surcat")  return embed(extra.newSurcat==="PVP"?0xef4444:0x22c55e,`⚔️ **${char.nom}** changement : ${extra.oldSurcat} → **${extra.newSurcat}**`);
  if(type==="add")     return embed(0x22c55e,`✨ **${char.nom}** (${char.classe} · ${si} ${surcat}) ajouté — Level ${char.level}`);
  if(type==="levelup") return embed(0xfbbf24,`⭐ **${char.nom}** level up : ${extra.oldLevel} → **${extra.newLevel}**`);
  return null;
};
const sendWebhook = async(url,payload)=>{if(!url)return;try{await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});}catch{}};

// ─── GATE PAGE ────────────────────────────────────────────────
function GatePage({ onSuccess }) {
  const T = useT();
  const [input,setInput]=useState("");const [error,setError]=useState(false);const [shake,setShake]=useState(false);
  const tryCode=()=>{if(input.trim().toUpperCase()===ACCESS_CODE){onSuccess();}else{setError(true);setShake(true);setInput("");setTimeout(()=>setShake(false),600);setTimeout(()=>setError(false),2500);}};
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
        .shake{animation:shake 0.5s ease;}
        *{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}
        input::placeholder{color:${T.muted};}
        select option{background:${T.surface};}
        @keyframes pulse{0%,100%{opacity:.15}50%{opacity:.28}}
      `}</style>
      {/* Background grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,backgroundSize:"60px 60px",opacity:.35,pointerEvents:"none"}}/>
      {/* Red glow top */}
      <div style={{position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(212,32,32,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:420,margin:16,position:"relative",zIndex:1,textAlign:"center"}}>
        {/* Logo */}
        <div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:10}}>
            <div style={{width:3,height:36,background:T.accent,borderRadius:2}}/>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,color:T.text,letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>TABLEUR<span style={{color:T.accent}}> BY BENY</span></div>
            <div style={{width:3,height:36,background:T.accent,borderRadius:2}}/>
          </div>
          <div style={{fontSize:10,color:T.muted,letterSpacing:5,textTransform:"uppercase"}}>SERVEUR HÉROÏQUE · ACCÈS RESTREINT</div>
        </div>
        {/* Card */}
        <div style={{background:T.surface,border:"1px solid "+(error?"rgba(239,68,68,0.5)":T.border),borderRadius:4,padding:"28px",boxShadow:T.shadowLg,position:"relative"}}>
          {/* Top red bar */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:error?"#ef4444":T.accent,borderRadius:"4px 4px 0 0"}}/>
          <div style={{fontSize:11,color:T.muted,marginBottom:20,letterSpacing:2,textTransform:"uppercase"}}>🔒 Code d'accès requis</div>
          <div className={shake?"shake":""} style={{marginBottom:12}}>
            <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="— CODE —" maxLength={20}
              style={{width:"100%",background:T.panel,border:"2px solid "+(error?"rgba(239,68,68,0.6)":T.accentBorder),borderRadius:3,padding:"15px",color:error?T.danger:T.accent,fontSize:24,fontWeight:700,outline:"none",fontFamily:"'Rajdhani',sans-serif",boxSizing:"border-box",textAlign:"center",letterSpacing:10}} />
          </div>
          {error&&<div style={{marginBottom:12,padding:"8px 12px",background:T.dangerBg,border:"1px solid rgba(239,68,68,0.3)",borderRadius:3,color:T.danger,fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>⚠ Code incorrect</div>}
          <button onClick={tryCode} style={{width:"100%",padding:"13px",borderRadius:3,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,textTransform:"uppercase",transition:"opacity .15s"}}
            onMouseEnter={e=>e.target.style.opacity=".85"} onMouseLeave={e=>e.target.style.opacity="1"}>ENTRER →</button>
        </div>
        <div style={{marginTop:16,fontSize:11,color:T.muted,letterSpacing:1}}>Pas de code ? <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{color:"#5865F2",textDecoration:"none",fontWeight:700}}>DISCORD ⚡</a></div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────
function AuthPage() {
  const T=useT();const fi=makeFi(T);
  const [mode,setMode]=useState("login");const [email,setEmail]=useState("");const [pwd,setPwd]=useState("");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");const [ok,setOk]=useState("");
  const handle=async()=>{setErr("");setOk("");setLoading(true);try{if(mode==="login"){const{error}=await supabase.auth.signInWithPassword({email,password:pwd});if(error)throw error;}else{const{error}=await supabase.auth.signUp({email,password:pwd});if(error)throw error;setOk("Compte créé ! Vérifie ton email.");setMode("login");setLoading(false);return;}}catch(e){setErr(e.message||"Erreur");}setLoading(false);};
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.font,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,backgroundSize:"60px 60px",opacity:.3,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-100,left:"50%",transform:"translateX(-50%)",width:500,height:260,background:"radial-gradient(ellipse,rgba(212,32,32,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:400,margin:16,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
            <div style={{width:3,height:30,background:T.accent,borderRadius:2}}/>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:26,color:T.text,letterSpacing:2,textTransform:"uppercase"}}>TABLEUR<span style={{color:T.accent}}> BY BENY</span></div>
            <div style={{width:3,height:30,background:T.accent,borderRadius:2}}/>
          </div>
          <div style={{fontSize:10,color:T.muted,letterSpacing:4,textTransform:"uppercase"}}>SERVEUR HÉROÏQUE</div>
        </div>
        <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:4,padding:26,boxShadow:T.shadowLg,position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:T.accent,borderRadius:"4px 4px 0 0"}}/>
          <div style={{display:"flex",background:T.panel,borderRadius:3,padding:3,marginBottom:20,border:"1px solid "+T.border}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");setOk("");}} style={{flex:1,padding:"8px",borderRadius:2,border:"none",background:mode===m?T.accent:"transparent",color:mode===m?"#fff":T.muted,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,textTransform:"uppercase",transition:"all 0.2s"}}>{m==="login"?"CONNEXION":"INSCRIPTION"}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            {[["EMAIL","email",email,setEmail,"ton@email.com"],["MOT DE PASSE","password",pwd,setPwd,"••••••••"]].map(([l,type,v,set,ph])=>(
              <div key={l}><label style={{display:"block",color:T.muted,fontSize:10,marginBottom:5,fontWeight:700,letterSpacing:2}}>{l}</label><input type={type} value={v} onChange={e=>set(e.target.value)} placeholder={ph} style={{...fi,borderRadius:3}} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
            ))}
          </div>
          {err&&<div style={{marginTop:13,padding:"8px 12px",background:T.dangerBg,border:"1px solid rgba(239,68,68,0.3)",borderRadius:3,color:T.danger,fontSize:12,fontWeight:700,letterSpacing:1}}>⚠ {err}</div>}
          {ok &&<div style={{marginTop:13,padding:"8px 12px",background:T.successBg,border:"1px solid rgba(34,197,94,0.3)",borderRadius:3,color:T.success,fontSize:12,fontWeight:700}}>✓ {ok}</div>}
          <button onClick={handle} disabled={loading} style={{width:"100%",marginTop:18,padding:"12px",borderRadius:3,border:"none",background:loading?T.surface2:T.accent,color:loading?T.muted:"#fff",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,textTransform:"uppercase"}}>{loading?"CHARGEMENT...":(mode==="login"?"SE CONNECTER →":"CRÉER MON COMPTE →")}</button>
        </div>
        <div style={{textAlign:"center",marginTop:12,color:T.muted,fontSize:11,letterSpacing:1}}>DONNÉES PRIVÉES ET SÉCURISÉES 🔒</div>
      </div>
    </div>
  );
}

// ─── WEBHOOKS TAB ─────────────────────────────────────────────
function WebhooksTab({ session }) {
  const T=useT();const fi=makeFi(T);
  const [url,setUrl]=useState("");const [saved,setSaved]=useState("");const [events,setEvents]=useState({mort:true,etat:true,surcat:true,add:true,levelup:true});
  const [testing,setTesting]=useState(false);const [saving,setSaving]=useState(false);const [msg,setMsg]=useState(null);
  const sk="webhook_config_"+session.user.id;
  useEffect(()=>{const r=localStorage.getItem(sk);if(r){const c=JSON.parse(r);setUrl(c.url||"");setSaved(c.url||"");setEvents(c.events||{mort:true,etat:true,surcat:true,add:true,levelup:true});}},[]);
  const save=()=>{setSaving(true);localStorage.setItem(sk,JSON.stringify({url,events}));setSaved(url);setTimeout(()=>setSaving(false),600);setMsg({t:"ok",x:"Sauvegardé ✓"});setTimeout(()=>setMsg(null),3000);};
  const test=async()=>{if(!url)return setMsg({t:"err",x:"Entre l'URL d'abord !"});setTesting(true);try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({embeds:[{title:"🔔 Test — Tableur By Beny",description:"Webhook connecté !",color:0x5b6cf0,footer:{text:"Tableur By Beny"},timestamp:new Date().toISOString()}]})});if(r.ok)setMsg({t:"ok",x:"✅ Test envoyé !"});else setMsg({t:"err",x:"❌ URL invalide"});}catch{setMsg({t:"err",x:"❌ Erreur réseau"});}setTesting(false);setTimeout(()=>setMsg(null),4000);};
  const card={background:T.surface,border:"1px solid "+T.border,borderRadius:12,padding:18,marginBottom:12};
  return (
    <div style={{maxWidth:620}}>
      <div style={{marginBottom:18}}><div style={{fontWeight:700,fontSize:17,color:T.text,marginBottom:3}}>🔔 Notifications Discord</div><div style={{fontSize:12,color:T.muted}}>Messages automatiques dans ton salon Discord.</div></div>
      <div style={card}>
        <div style={{fontSize:10,color:T.accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:11}}>🔗 URL du Webhook</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://discord.com/api/webhooks/..." style={{...fi,flex:1,fontSize:12}} />
          {saved&&url===saved&&<span style={{fontSize:10,color:T.success,fontWeight:600,whiteSpace:"nowrap"}}>✓ OK</span>}
        </div>
        <div style={{display:"flex",gap:8,marginTop:9}}>
          <button onClick={test} disabled={testing} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid #5865F240",background:"#5865F210",color:"#5865F2",fontWeight:600,cursor:"pointer",fontFamily:T.font,fontSize:12}}>{testing?"⏳ Envoi...":"🧪 Tester"}</button>
          <button onClick={save} disabled={saving} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:12}}>{saving?"✓ Sauvegardé !":"💾 Sauvegarder"}</button>
        </div>
        {msg&&<div style={{marginTop:9,padding:"8px 12px",background:msg.t==="err"?T.dangerBg:T.successBg,border:"1px solid "+(msg.t==="err"?"rgba(239,68,68,0.25)":"rgba(34,197,94,0.25)"),borderRadius:8,color:msg.t==="err"?T.danger:T.success,fontSize:12,fontWeight:600}}>{msg.x}</div>}
      </div>
      <div style={card}>
        <div style={{fontSize:10,color:T.accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:11}}>⚡ Événements</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {WEBHOOK_EVENTS.map(ev=>(
            <div key={ev.id} onClick={()=>setEvents(p=>({...p,[ev.id]:!p[ev.id]}))} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",background:events[ev.id]?ev.color+"0d":T.surface2,border:"1px solid "+(events[ev.id]?ev.color+"35":T.border2),borderRadius:9,cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:17}}>{ev.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:events[ev.id]?T.text:T.muted}}>{ev.label}</div><div style={{fontSize:11,color:T.muted,marginTop:1}}>{ev.desc}</div></div>
              <div style={{width:38,height:21,borderRadius:11,background:events[ev.id]?T.accent:T.border,position:"relative",flexShrink:0,transition:"all 0.2s"}}><div style={{position:"absolute",top:2,left:events[ev.id]?18:2,width:17,height:17,borderRadius:9,background:"#fff",transition:"all 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}} /></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:9,padding:"8px 11px",background:T.surface2,borderRadius:8,border:"1px solid "+T.border2,fontSize:11,color:T.muted}}>💡 N'oublie pas de <strong style={{color:T.accent}}>sauvegarder</strong> après modification.</div>
      </div>
    </div>
  );
}

// ─── PARTAGES TAB ─────────────────────────────────────────────
function PartagesTab({ session, characters, showToast }) {
  const T=useT();const fi=makeFi(T);
  const [myShares,setMyShares]=useState([]);const [receivedShares,setReceivedShares]=useState([]);
  const [showModal,setShowModal]=useState(false);const [viewShare,setViewShare]=useState(null);
  const [viewChars,setViewChars]=useState([]);const [viewCraftLists,setViewCraftLists]=useState([]);const [viewLoading,setViewLoading]=useState(false);
  const [shareType,setShareType]=useState("all");const [shareEmail,setShareEmail]=useState("");const [shareCompte,setShareCompte]=useState("");const [canEdit,setCanEdit]=useState(false);const [saving,setSaving]=useState(false);
  const comptes=[...new Set(characters.map(c=>c.compte).filter(Boolean))];
  useEffect(()=>{loadMyShares();loadReceivedShares();},[]);
  const loadMyShares=async()=>{const{data}=await supabase.from("shares").select("*").eq("owner_id",session.user.id).order("created_at",{ascending:false});if(data)setMyShares(data);};
  const loadReceivedShares=async()=>{const{data}=await supabase.from("shares").select("*").eq("shared_with_email",session.user.email).order("created_at",{ascending:false});if(data)setReceivedShares(data);};
  const createShare=async()=>{if(!shareEmail.trim())return showToast("Email requis !","err");if(shareEmail.trim().toLowerCase()===session.user.email.toLowerCase())return showToast("Tu ne peux pas te partager !","err");if(shareType==="compte"&&!shareCompte)return showToast("Choisis un compte !","err");setSaving(true);const{error}=await supabase.from("shares").insert([{owner_id:session.user.id,owner_email:session.user.email,shared_with_email:shareEmail.trim().toLowerCase(),share_type:shareType,compte_name:shareType==="compte"?shareCompte:null,can_edit:canEdit}]);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast("Partage créé ✓");setShowModal(false);setShareEmail("");setShareType("all");setShareCompte("");setCanEdit(false);loadMyShares();};
  const deleteShare=async(id)=>{await supabase.from("shares").delete().eq("id",id);showToast("Partage supprimé");loadMyShares();};
  const openReceivedShare=async(share)=>{setViewShare(share);setViewChars([]);setViewCraftLists([]);setViewLoading(true);if(share.share_type==="craft"){const{data}=await supabase.from("craft_lists").select("*").eq("user_id",share.owner_id).order("created_at",{ascending:false});setViewCraftLists(data||[]);}else{let q=supabase.from("characters").select("*").eq("user_id",share.owner_id);if(share.share_type==="compte")q=q.eq("compte",share.compte_name);const{data}=await q.order("created_at",{ascending:true});setViewChars(data||[]);}setViewLoading(false);};
  const card={background:T.surface,border:"1px solid "+T.border,borderRadius:12};
  const ShareTypeBtn=({id})=>{const t=SHARE_TYPE_LABELS[id];const active=shareType===id;return<button onClick={()=>setShareType(id)} style={{flex:1,padding:"10px 6px",borderRadius:9,border:"2px solid "+(active?T.accent:T.border),background:active?T.accentBg:T.surface2,color:active?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:11,fontWeight:active?700:400,textAlign:"center"}}><div style={{fontSize:17,marginBottom:2}}>{t.icon}</div><div style={{fontSize:10,lineHeight:1.3}}>{t.label}</div></button>;};
  if(viewShare){
    const typeInfo=SHARE_TYPE_LABELS[viewShare.share_type];const isCraft=viewShare.share_type==="craft";
    return(<div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={()=>setViewShare(null)} style={{background:T.surface2,border:"1px solid "+T.border,borderRadius:8,padding:"6px 12px",color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:12}}>← Retour</button>
        <div><div style={{fontWeight:700,fontSize:15,color:T.text}}>{typeInfo.icon} {viewShare.share_type==="compte"?`Compte "${viewShare.compte_name}"`:typeInfo.label}</div><div style={{fontSize:11,color:T.muted,marginTop:1}}>Partagé par <span style={{color:T.accent}}>{viewShare.owner_email}</span></div></div>
      </div>
      {viewLoading?<div style={{textAlign:"center",padding:"60px",color:T.muted}}>⏳ Chargement...</div>
      :isCraft?(viewCraftLists.length===0?<div style={{textAlign:"center",padding:"60px",color:T.muted}}>⚗️ Aucune liste</div>:
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {viewCraftLists.map(list=>{const items=list.items||[];const ingMap={};for(const{item,qty}of items)for(const r of(item.recipe||[])){const k=r.ankama_id??r.name;if(!ingMap[k])ingMap[k]={name:r.name,image_url:r.image_url,qty:0};ingMap[k].qty+=r.quantity*qty;}const ings=Object.values(ingMap).sort((a,b)=>a.name.localeCompare(b.name));return(
            <div key={list.id} style={{...card,overflow:"hidden"}}>
              <div style={{padding:"12px 15px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:19}}>⚗️</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text}}>{list.name}</div><div style={{fontSize:11,color:T.muted}}>{items.length} item{items.length!==1?"s":""}</div></div></div>
              <div style={{padding:"12px 15px"}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:ings.length?11:0}}>{items.map(({item,qty})=>(<div key={item.ankama_id} style={{display:"flex",alignItems:"center",gap:6,background:T.surface2,borderRadius:7,padding:"5px 9px",border:"1px solid "+T.border2}}>{item.image_url?<img src={item.image_url} style={{width:18,height:18,objectFit:"contain",imageRendering:"pixelated"}} alt="" onError={e=>e.target.style.display="none"}/>:<span style={{fontSize:13}}>⚗️</span>}<span style={{fontSize:12,color:T.text,fontWeight:500}}>{item.name}</span><span style={{fontSize:11,color:T.accent,fontWeight:700,background:T.accentBg,borderRadius:4,padding:"0 5px"}}>×{qty}</span></div>))}</div>
                {ings.length>0&&<div style={{background:T.surface2,borderRadius:9,border:"1px solid "+T.border2,overflow:"hidden"}}><div style={{padding:"6px 12px",borderBottom:"1px solid "+T.border2,fontSize:10,color:T.accent,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>🧮 Ressources</div><div style={{maxHeight:170,overflowY:"auto"}}>{ings.map((ing,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",borderBottom:"1px solid "+T.border2+"55"}}><div style={{width:20,height:20,borderRadius:5,background:T.surface,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ing.image_url?<img src={ing.image_url} style={{width:15,height:15,objectFit:"contain",imageRendering:"pixelated"}} alt="" onError={e=>e.target.style.display="none"}/>:<span style={{fontSize:10}}>🌿</span>}</div><span style={{flex:1,fontSize:12,color:T.text}}>{ing.name}</span><span style={{fontSize:12,fontWeight:700,color:T.accent,background:T.accentBg,borderRadius:5,padding:"1px 7px"}}>{ing.qty}</span></div>))}</div></div>}
              </div>
            </div>
          );})}
        </div>
      ):(viewChars.length===0?<div style={{textAlign:"center",padding:"60px",color:T.muted}}>🗡️ Aucun personnage</div>:
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:9}}>
          {viewChars.map(char=>{const catColor=CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;return(
            <div key={char.id} style={{...card,overflow:"hidden"}}>
              <div style={{height:2,background:catColor}} />
              <div style={{padding:"11px"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}><div style={{width:34,height:34,borderRadius:9,background:catColor+"15",border:"1px solid "+catColor+"30",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><img src={CLASS_ICONS[char.classe]} style={{width:26,height:26,objectFit:"contain"}} alt="" onError={e=>e.target.style.display="none"}/></div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text}}>{char.nom}</div><div style={{fontSize:10,color:T.muted,marginTop:1}}>{char.compte}</div></div><span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:ETAT_COLORS[char.etat]+"15",color:ETAT_COLORS[char.etat],fontWeight:600}}>{char.etat}</span></div>
                <div style={{display:"flex",gap:4}}>{[{l:"Classe",v:char.classe},{l:"Level",v:char.level},{l:"Max",v:char.level_max}].map(s=>(<div key={s.l} style={{flex:1,background:T.surface2,borderRadius:6,padding:"3px 5px",textAlign:"center",border:"1px solid "+T.border2}}><div style={{fontSize:7,color:T.muted,marginBottom:1,textTransform:"uppercase",letterSpacing:1}}>{s.l}</div><div style={{fontSize:11,fontWeight:600,color:T.text}}>{s.v}</div></div>))}</div>
              </div>
            </div>
          );})}
        </div>
      )}
    </div>);
  }
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontWeight:700,fontSize:15,color:T.text}}>📤 Mes partages</div><div style={{fontSize:11,color:T.muted,marginTop:1}}>Ce que tu partages</div></div><button onClick={()=>setShowModal(true)} style={{background:T.accent,color:"#fff",border:"none",borderRadius:8,padding:"6px 13px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:T.font}}>+ Nouveau</button></div>
          {myShares.length===0?(<div style={{...card,padding:"36px 18px",textAlign:"center"}}><div style={{fontSize:26,marginBottom:7}}>🔒</div><div style={{color:T.muted,fontSize:13}}>Aucun partage</div></div>):(<div style={{display:"flex",flexDirection:"column",gap:7}}>{myShares.map(s=>{const t=SHARE_TYPE_LABELS[s.share_type];return(<div key={s.id} style={{...card,padding:"11px 13px",display:"flex",alignItems:"center",gap:11}}><div style={{width:32,height:32,borderRadius:8,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{t.icon}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:T.text}}>{s.share_type==="compte"?`Compte "${s.compte_name}"`:t.label}</div><div style={{fontSize:10,color:T.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>→ <span style={{color:T.accent}}>{s.shared_with_email}</span></div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}><span style={{fontSize:9,padding:"2px 6px",borderRadius:20,background:s.can_edit?T.successBg:T.accentBg,color:s.can_edit?T.success:T.accent,fontWeight:600}}>{s.can_edit?"✏️ Modif":"👁️ Lecture"}</span><button onClick={()=>deleteShare(s.id)} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,padding:"2px 7px",color:T.danger,cursor:"pointer",fontSize:10,fontFamily:T.font}}>Supprimer</button></div></div>);})}</div>)}
        </div>
        <div>
          <div style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:15,color:T.text}}>📥 Partagé avec moi</div><div style={{fontSize:11,color:T.muted,marginTop:1}}>Ce que tu as reçu</div></div>
          {receivedShares.length===0?(<div style={{...card,padding:"36px 18px",textAlign:"center"}}><div style={{fontSize:26,marginBottom:7}}>📭</div><div style={{color:T.muted,fontSize:13}}>Rien pour l'instant</div></div>):(<div style={{display:"flex",flexDirection:"column",gap:7}}>{receivedShares.map(s=>{const t=SHARE_TYPE_LABELS[s.share_type];return(<div key={s.id} style={{...card,padding:"11px 13px",display:"flex",alignItems:"center",gap:11}}><div style={{width:32,height:32,borderRadius:8,background:T.successBg,border:"1px solid rgba(34,197,94,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{t.icon}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,color:T.text}}>{s.share_type==="compte"?`Compte "${s.compte_name}"`:t.label}</div><div style={{fontSize:10,color:T.muted,marginTop:1}}>De <span style={{color:T.success}}>{s.owner_email}</span></div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}><span style={{fontSize:9,padding:"2px 6px",borderRadius:20,background:s.can_edit?T.successBg:T.accentBg,color:s.can_edit?T.success:T.accent,fontWeight:600}}>{s.can_edit?"✏️ Modif":"👁️ Lecture"}</span><button onClick={()=>openReceivedShare(s)} style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:6,padding:"2px 7px",color:T.accent,cursor:"pointer",fontSize:10,fontFamily:T.font}}>{s.share_type==="craft"?"⚗️ Voir":"Voir"}</button></div></div>);})}</div>)}
        </div>
      </div>
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(8px)"}}>
          <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:16,padding:22,width:"100%",maxWidth:450,boxShadow:T.shadowLg,position:"relative",margin:16}}>
            <button onClick={()=>setShowModal(false)} style={{position:"absolute",top:13,right:13,background:T.surface2,border:"1px solid "+T.border,color:T.muted,cursor:"pointer",borderRadius:6,padding:"3px 9px",fontFamily:T.font}}>✕</button>
            <h2 style={{margin:"0 0 16px",color:T.text,fontSize:15,fontWeight:700}}>🔗 Nouveau partage</h2>
            <div style={{marginBottom:13}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:7,fontWeight:500}}>Que veux-tu partager ?</label><div style={{display:"flex",gap:7}}><ShareTypeBtn id="all"/><ShareTypeBtn id="compte"/><ShareTypeBtn id="craft"/></div></div>
            {shareType==="compte"&&<div style={{marginBottom:13}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:6,fontWeight:500}}>Quel compte ?</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{comptes.map(c=><button key={c} onClick={()=>setShareCompte(c)} style={{padding:"4px 11px",borderRadius:6,border:"1px solid "+(shareCompte===c?T.accent:T.border),background:shareCompte===c?T.accentBg:T.surface2,color:shareCompte===c?T.accent:T.muted,fontFamily:T.font,fontSize:12,cursor:"pointer"}}>👤 {c}</button>)}</div></div>}
            <div style={{marginBottom:13}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>Email du destinataire</label><input value={shareEmail} onChange={e=>setShareEmail(e.target.value)} placeholder="ami@email.com" style={fi} /></div>
            <div style={{marginBottom:16}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:7,fontWeight:500}}>Permission</label><div style={{display:"flex",gap:7}}>{[{v:false,icon:"👁️",label:"Lecture seule"},{v:true,icon:"✏️",label:"Lecture + modif"}].map(p=>(<button key={p.label} onClick={()=>setCanEdit(p.v)} style={{flex:1,padding:"9px",borderRadius:9,border:"2px solid "+(canEdit===p.v?T.accent:T.border),background:canEdit===p.v?T.accentBg:T.surface2,color:canEdit===p.v?T.accent:T.muted,cursor:"pointer",fontFamily:T.font}}><div style={{fontSize:15,marginBottom:2}}>{p.icon}</div><div style={{fontSize:11,fontWeight:600}}>{p.label}</div></button>))}</div></div>
            <div style={{display:"flex",gap:7}}><button onClick={()=>setShowModal(false)} style={{flex:1,padding:"9px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13}}>Annuler</button><button onClick={createShare} disabled={saving} style={{flex:2,padding:"9px",borderRadius:9,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:13}}>{saving?"Création...":"🔗 Créer le partage"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CRAFT TAB ────────────────────────────────────────────────
function CraftTab({ session, externalItems, onExternalConsumed }) {
  const T=useT();const fi=makeFi(T);
  const [query,setQuery]=useState("");const [searchType,setSearchType]=useState("equipment");const [results,setResults]=useState([]);const [searching,setSearching]=useState(false);const [craftView,setCraftView]=useState("par_craft");
  const lsKey=`craft_session_v2_${session.user.id}`;const lsBanqKey=`craft_banque_${session.user.id}`;const lsNameKey=`craft_name_${session.user.id}`;
  const [craftItems,setCraftItems]=useState(()=>{try{const r=localStorage.getItem(lsKey);return r?JSON.parse(r):[]}catch{return []}});
  const [savedLists,setSavedLists]=useState([]);const [banque,setBanque]=useState(()=>{try{const r=localStorage.getItem(lsBanqKey);return r?JSON.parse(r):{}}catch{return {}}});
  const [listName,setListName]=useState(()=>{try{const r=localStorage.getItem(lsNameKey);return r||"Mon atelier"}catch{return "Mon atelier"}});
  const [saving,setSaving]=useState(false);const [loadingId,setLoadingId]=useState(null);const [ingCache,setIngCache]=useState({});
  const [activeList,setActiveList]=useState(null);const [deleteId,setDeleteId]=useState(null);const [updateId,setUpdateId]=useState(null);
  const [toast,setToast]=useState(null);const [addQty,setAddQty]=useState(1);
  const [showSaveModal,setShowSaveModal]=useState(false);const [saveModalName,setSaveModalName]=useState("");
  const [subCraftsEnabled,setSubCraftsEnabled]=useState(()=>{try{return localStorage.getItem(`craft_subcrafts_${session.user.id}`)==="true";}catch{return false;}});
  const [subCraftCache,setSubCraftCache]=useState({});
  const [resolvingSubCrafts,setResolvingSubCrafts]=useState(false);
  const [skipSubCraft,setSkipSubCraft]=useState(()=>{try{const r=localStorage.getItem(`craft_skip_${session.user.id}`);return r?JSON.parse(r):{}}catch{return {};}});
  const [collapsedItems,setCollapsedItems]=useState({});
  const [sortOrder,setSortOrder]=useState(null); // null=nom, "asc"=niveau↑, "desc"=niveau↓
  const debounceRef=useRef(null);
  useEffect(()=>{try{localStorage.setItem(lsKey,JSON.stringify(craftItems));}catch{}},[craftItems]);
  useEffect(()=>{try{localStorage.setItem(lsBanqKey,JSON.stringify(banque));}catch{}},[banque]);
  useEffect(()=>{try{localStorage.setItem(lsNameKey,listName);}catch{}},[listName]);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  useEffect(()=>{localStorage.removeItem(`craft_session_${session.user.id}`);loadSavedLists();},[]);

  // ── Re-enrich existing recipe ingredients that are missing level ──
  useEffect(()=>{
    const enrichMissing=async()=>{
      let changed=false;
      const updated=await Promise.all(craftItems.map(async({item,qty})=>{
        if(!item.recipe?.length)return{item,qty};
        const needsEnrich=item.recipe.some(r=>r.level==null&&r.ankama_id);
        if(!needsEnrich)return{item,qty};
        const enriched=await Promise.all(item.recipe.map(async(r)=>{
          if(r.level!=null||!r.ankama_id)return r;
          const info=await fetchIconById(r.ankama_id);
          if(info?.level!=null){changed=true;return{...r,level:info.level,name:r.name||info.name,image_url:r.image_url||info.icon};}
          return r;
        }));
        return{item:{...item,recipe:enriched},qty};
      }));
      if(changed)setCraftItems(updated);
    };
    if(craftItems.length>0)enrichMissing();
  },[]);
  // ── Receive items from BuildTab ──
  useEffect(()=>{
    if(!externalItems||!externalItems.length)return;
    (async()=>{
      let added=0;
      for(const item of externalItems){
        if(!item?.ankama_id)continue;
        const ex=craftItems.find(ci=>ci.item.ankama_id===item.ankama_id);
        if(ex){setCraftItems(prev=>prev.map(ci=>ci.item.ankama_id===item.ankama_id?{...ci,qty:ci.qty+1}:ci));added++;continue;}
        try{
          const{data:recipeRow}=await supabase.from("recipes").select("*").eq("Item_Id",item.ankama_id).maybeSingle();
          let recipe=[];let jobLabel=null;
          if(recipeRow?.Ingredients){jobLabel=recipeRow.Job??null;const ingParts=recipeRow.Ingredients.split(",").map(s=>{const[rawId,rawQty]=s.trim().split("x");return{ankama_id:parseInt(rawId,10),quantity:parseInt(rawQty,10)||1};}).filter(r=>!isNaN(r.ankama_id));const icons=await Promise.all(ingParts.map(r=>fetchIconById(r.ankama_id)));recipe=ingParts.map((r,i)=>({ankama_id:r.ankama_id,name:icons[i]?.name??`#${r.ankama_id}`,image_url:icons[i]?.icon??null,level:icons[i]?.level??null,quantity:r.quantity}));}
          const newItem={ankama_id:item.ankama_id,name:item.name,level:item.level??null,image_url:item.image_urls?.icon??item.image_url??null,job:jobLabel,recipe};
          setCraftItems(prev=>[...prev,{item:newItem,qty:1}]);added++;
        }catch{}
      }
      showToast(added+' item(s) importé(s) du build ✓');
      if(onExternalConsumed)onExternalConsumed();
    })();
  },[externalItems]);
  const loadSavedLists=async()=>{const{data}=await supabase.from("craft_lists").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false});if(data)setSavedLists(data);};
  useEffect(()=>{if(debounceRef.current)clearTimeout(debounceRef.current);if(!query.trim()||query.length<2){setResults([]);return;}debounceRef.current=setTimeout(()=>doSearch(query,searchType),350);return()=>clearTimeout(debounceRef.current);},[query,searchType]);
  const doSearch=async(q,type)=>{setSearching(true);try{const r=await fetch(`${DOFUSDU_BASE}/items/${type}/search?query=${encodeURIComponent(q)}&limit=20`);if(!r.ok)throw new Error();const d=await r.json();setResults(Array.isArray(d)?d:[]);}catch{setResults([]);}setSearching(false);};
  const fetchIconById=async(ankama_id)=>{const ck=`icon_${ankama_id}`;if(ingCache[ck]!==undefined)return ingCache[ck];for(const type of["resources","equipment","consumables","quest_items"]){try{const r=await fetch(`${DOFUSDU_BASE}/items/${type}/${ankama_id}`);if(r.ok){const d=await r.json();const v={icon:d?.image_urls?.icon??null,name:d?.name??null,level:d?.level??null};setIngCache(p=>({...p,[ck]:v}));return v;}}catch{}}setIngCache(p=>({...p,[ck]:{icon:null,name:null,level:null}}));return{icon:null,name:null,level:null};};
  const addItem=async(item)=>{const ex=craftItems.find(ci=>ci.item.ankama_id===item.ankama_id);if(ex){const nq=(ex.qty||1)+addQty;setCraftItems(prev=>prev.map(ci=>ci.item.ankama_id===item.ankama_id?{...ci,qty:nq}:ci));showToast(`${item.name} ×${nq}`);return;}setLoadingId(item.ankama_id);try{const{data:recipeRow}=await supabase.from("recipes").select("*").eq("Item_Id",item.ankama_id).maybeSingle();let recipe=[];let jobLabel=null;if(recipeRow?.Ingredients){jobLabel=recipeRow.Job??null;const ingParts=recipeRow.Ingredients.split(",").map(s=>{const[rawId,rawQty]=s.trim().split("x");return{ankama_id:parseInt(rawId,10),quantity:parseInt(rawQty,10)||1};}).filter(r=>!isNaN(r.ankama_id));const icons=await Promise.all(ingParts.map(r=>fetchIconById(r.ankama_id)));recipe=ingParts.map((r,i)=>({ankama_id:r.ankama_id,name:icons[i]?.name??`#${r.ankama_id}`,image_url:icons[i]?.icon??null,level:icons[i]?.level??null,quantity:r.quantity}));}const newItem={ankama_id:item.ankama_id,name:item.name,level:item.level??null,image_url:item.image_urls?.icon??null,subtype:searchType,job:jobLabel,recipe};setCraftItems(prev=>[...prev,{item:newItem,qty:addQty}]);showToast(`${item.name} ajouté ✓`);}catch{showToast("Erreur de chargement","err");}setLoadingId(null);};
  const removeItem=(ankama_id)=>setCraftItems(prev=>prev.filter(ci=>ci.item.ankama_id!==ankama_id));
  const updateQty=(ankama_id,qty)=>{if(qty<=0)removeItem(ankama_id);else setCraftItems(prev=>prev.map(ci=>ci.item.ankama_id===ankama_id?{...ci,qty}:ci));};
  const clearList=()=>{setCraftItems([]);setActiveList(null);setListName("Mon atelier");setUpdateId(null);};
  const saveList=async()=>{if(!listName.trim())return showToast("Donne un nom !","err");if(craftItems.length===0)return showToast("Ajoute des items d'abord !","err");setSaving(true);if(updateId){const{error}=await supabase.from("craft_lists").update({name:listName.trim(),items:craftItems,updated_at:new Date().toISOString()}).eq("id",updateId);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast("Mise à jour ✓");}else{const{error}=await supabase.from("craft_lists").insert([{user_id:session.user.id,name:listName.trim(),items:craftItems}]);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast("Sauvegardée ✓");}loadSavedLists();};
  const openSaveModal=()=>{if(craftItems.length===0)return showToast("Ajoute des items d'abord !","err");setSaveModalName("");setShowSaveModal(true);};
  const confirmSaveModal=async()=>{const name=saveModalName.trim();if(!name)return showToast("Donne un nom !","err");setSaving(true);const{error}=await supabase.from("craft_lists").insert([{user_id:session.user.id,name,items:craftItems}]);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast(`"${name}" sauvegardée ✓`);setShowSaveModal(false);loadSavedLists();};
  const deleteList=async(id)=>{await supabase.from("craft_lists").delete().eq("id",id);showToast("Liste supprimée");if(activeList?.id===id)clearList();setDeleteId(null);loadSavedLists();};
  const loadList=(list)=>{setActiveList(list);setCraftItems(list.items||[]);setListName(list.name);setUpdateId(list.id);showToast(`"${list.name}" chargée ✓`);};
  // ── Fetch recipe for a single ingredient id ──
  const fetchRecipeForId=async(ankama_id)=>{
    const ck=`recipe_${ankama_id}`;
    if(subCraftCache[ck]!==undefined)return subCraftCache[ck];
    const{data:recipeRow}=await supabase.from("recipes").select("*").eq("Item_Id",ankama_id).maybeSingle();
    if(!recipeRow?.Ingredients){setSubCraftCache(p=>({...p,[ck]:null}));return null;}
    const ingParts=recipeRow.Ingredients.split(",").map(s=>{const[rawId,rawQty]=s.trim().split("x");return{ankama_id:parseInt(rawId,10),quantity:parseInt(rawQty,10)||1};}).filter(r=>!isNaN(r.ankama_id));
    const icons=await Promise.all(ingParts.map(r=>fetchIconById(r.ankama_id)));
    const recipe=ingParts.map((r,i)=>({ankama_id:r.ankama_id,name:icons[i]?.name??`#${r.ankama_id}`,image_url:icons[i]?.icon??null,level:icons[i]?.level??null,quantity:r.quantity}));
    setSubCraftCache(p=>({...p,[ck]:recipe}));
    return recipe;
  };

  // ── Recursively build sub-craft tree ──
  const buildSubTree=async(ingredients,qty,depth=0)=>{
    if(depth>5)return ingredients.map(r=>({...r,qty:r.quantity*qty,subRecipe:null}));
    return Promise.all(ingredients.map(async(r)=>{
      const sub=await fetchRecipeForId(r.ankama_id);
      return{...r,qty:r.quantity*qty,subRecipe:sub?await buildSubTree(sub,r.quantity*qty,depth+1):null};
    }));
  };

  // ── Flatten sub-craft tree to leaf resources (respects skip decisions) ──
  const flattenToLeaves=(nodes,map={},skip={})=>{
    for(const node of nodes){
      const k=node.ankama_id??node.name;
      const isSkipped=skip[k];
      if(node.subRecipe&&node.subRecipe.length>0&&!isSkipped){flattenToLeaves(node.subRecipe,map,skip);}
      else{if(!map[k])map[k]={...node,qty:0,key:k};map[k].qty+=node.qty;}
    }
    return map;
  };

  const [subTrees,setSubTrees]=useState({});

  const resolveAllSubCrafts=async()=>{
    setResolvingSubCrafts(true);
    const newTrees={};
    for(const{item,qty}of craftItems){
      if(!item.recipe?.length){newTrees[item.ankama_id]=[];continue;}
      const tree=await buildSubTree(item.recipe,qty,0);
      newTrees[item.ankama_id]=tree;
    }
    setSubTrees(newTrees);
    setResolvingSubCrafts(false);
  };

  // Toggle sub-crafts
  const toggleSubCrafts=async()=>{
    if(!subCraftsEnabled){await resolveAllSubCrafts();setSubCraftsEnabled(true);}
    else{setSubCraftsEnabled(false);}
  };

  // Re-resolve when craftItems change and sub-crafts are enabled
  useEffect(()=>{try{localStorage.setItem(`craft_subcrafts_${session.user.id}`,String(subCraftsEnabled));}catch{}},[subCraftsEnabled]);
  useEffect(()=>{try{localStorage.setItem(`craft_skip_${session.user.id}`,JSON.stringify(skipSubCraft));}catch{}},[skipSubCraft]);
  useEffect(()=>{if(subCraftsEnabled)resolveAllSubCrafts();},[craftItems,subCraftsEnabled]);

  const totalIngredients=()=>{
    let list;
    if(subCraftsEnabled&&Object.keys(subTrees).length>0){
      const map={};
      for(const{item}of craftItems){
        const tree=subTrees[item.ankama_id]||[];
        flattenToLeaves(tree,map,skipSubCraft);
      }
      list=Object.values(map);
    }else{
      const map={};for(const{item,qty}of craftItems)for(const r of(item.recipe||[])){const k=r.ankama_id??r.name;if(!map[k])map[k]={...r,qty:0,key:k};map[k].qty+=r.quantity*qty;}
      list=Object.values(map);
    }
    if(sortOrder==="asc")return list.sort((a,b)=>(a.level??0)-(b.level??0));
    if(sortOrder==="desc")return list.sort((a,b)=>(b.level??0)-(a.level??0));
    return list.sort((a,b)=>a.name.localeCompare(b.name));
  };

  const ingredients=totalIngredients();
  const bv=(key)=>Math.max(0,parseInt(banque[key]||0,10)||0);
  const pb={borderRight:"1px solid "+T.border};
  return (
    <div style={{display:"flex",height:"calc(100vh - 112px)",background:T.bg,overflow:"hidden",borderRadius:12,border:"1px solid "+T.border,boxShadow:T.shadow}}>
      {/* ── COL 1 : DOSSIERS ── */}
      <div style={{width:195,flexShrink:0,background:T.panel,...pb,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",borderBottom:"1px solid "+T.border}}>
          <span style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>Dossiers</span>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"5px 7px"}}>
          <div onClick={()=>{if(updateId){setActiveList(null);setUpdateId(null);}}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",borderRadius:7,background:!activeList?T.accentBg:T.surface,border:"1px solid "+(!activeList?T.accentBorder:T.border2),cursor:"pointer",marginBottom:3,transition:"all 0.15s"}}>
            <span style={{fontSize:13}}>📁</span>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:!activeList?T.accent:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{listName}</div><div style={{fontSize:9,color:T.muted}}>{craftItems.length} craft{craftItems.length!==1?"s":""}</div></div>
          </div>
          {savedLists.map(list=>{const isAct=activeList?.id===list.id;return(<div key={list.id} onClick={()=>loadList(list)} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",borderRadius:7,background:isAct?T.accentBg:T.surface,border:"1px solid "+(isAct?T.accentBorder:T.border2),cursor:"pointer",marginBottom:3,transition:"all 0.15s"}}>
            <span style={{fontSize:13}}>📁</span>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:isAct?T.accent:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{list.name}</div><div style={{fontSize:9,color:T.muted}}>{(list.items||[]).length} craft{(list.items||[]).length!==1?"s":""}</div></div>
            <button onClick={e=>{e.stopPropagation();setDeleteId(list.id);}} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:11,padding:1,flexShrink:0,opacity:0.55}}>✕</button>
          </div>);})}
        </div>
      </div>
      {/* ── COL 2 : AJOUTER + LISTE ── */}
      <div style={{width:268,flexShrink:0,background:T.surface,...pb,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"11px 11px 7px",borderBottom:"1px solid "+T.border}}>
          <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:7}}>Ajouter un craft</div>
          <div style={{display:"flex",gap:3,marginBottom:7}}>
            {CRAFT_SEARCH_TYPES.map(st=>(<button key={st.id} onClick={()=>{setSearchType(st.id);setResults([]);}} style={{flex:1,padding:"5px 2px",borderRadius:6,border:"1px solid "+(searchType===st.id?T.accentBorder:T.border2),background:searchType===st.id?T.accentBg:T.surface2,color:searchType===st.id?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:10,fontWeight:searchType===st.id?700:400,textAlign:"center"}}><div style={{marginBottom:1}}>{st.icon}</div><div>{st.label}</div></button>))}
          </div>
          <div style={{position:"relative",marginBottom:7}}>
            <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:11,pointerEvents:"none"}}>🔍</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un item..." style={{...fi,paddingLeft:25,fontSize:12}} />
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <span style={{fontSize:10,color:T.muted,flexShrink:0}}>Qté</span>
            <button onClick={()=>setAddQty(q=>Math.max(1,q-1))} style={{width:20,height:20,borderRadius:4,border:"1px solid "+T.border,background:T.surface2,color:T.text,cursor:"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
            <input type="number" min={1} value={addQty} onChange={e=>setAddQty(Math.max(1,parseInt(e.target.value)||1))} style={{...fi,width:38,padding:"2px",textAlign:"center",fontSize:12,fontWeight:700}} />
            <button onClick={()=>setAddQty(q=>q+1)} style={{width:20,height:20,borderRadius:4,border:"1px solid "+T.accentBorder,background:T.accentBg,color:T.accent,cursor:"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            <div style={{flex:1}}/>
            <button onClick={openSaveModal} title="Sauvegarder l'atelier" style={{height:24,padding:"0 9px",borderRadius:4,border:"1px solid "+T.accentBorder,background:T.accentBg,color:T.accent,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:11,fontWeight:700,letterSpacing:0.5,display:"flex",alignItems:"center",gap:4,flexShrink:0,whiteSpace:"nowrap"}}>💾 <span>Sauvegarder</span></button>
          </div>
        </div>
        {results.length>0&&(<div style={{maxHeight:200,overflowY:"auto",borderBottom:"1px solid "+T.border}}>
          {results.map(item=>{const isLoad=loadingId===item.ankama_id;const alrIn=craftItems.some(ci=>ci.item.ankama_id===item.ankama_id);return(<div key={item.ankama_id} onClick={()=>!isLoad&&addItem(item)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 11px",borderBottom:"1px solid "+T.border2,cursor:isLoad?"wait":"pointer",background:alrIn?T.accentBg:"transparent"}} onMouseEnter={e=>{if(!alrIn)e.currentTarget.style.background=T.surface2;}} onMouseLeave={e=>{e.currentTarget.style.background=alrIn?T.accentBg:"transparent";}}>
            <div style={{width:28,height:28,borderRadius:5,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{item.image_urls?.icon?<img src={item.image_urls.icon} style={{width:22,height:22,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:12}}>⚗️</span>}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:alrIn?T.accent:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>{item.level&&<div style={{fontSize:9,color:T.muted}}>Niv. {item.level}</div>}</div>
            <span style={{flexShrink:0,fontSize:13,color:T.accent}}>{isLoad?"⏳":alrIn?"✓":"+"}</span>
          </div>);})}
        </div>)}
        <div style={{padding:"7px 11px 3px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>{craftItems.length} craft{craftItems.length!==1?"s":""}</span>
          {craftItems.length>0&&<button onClick={clearList} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,padding:"2px 8px",color:T.danger,cursor:"pointer",fontSize:10,fontFamily:T.font}}>Vider</button>}
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {craftItems.length===0?(<div style={{textAlign:"center",padding:"28px 14px",color:T.muted}}><div style={{fontSize:25,marginBottom:6,opacity:0.35}}>⚗️</div><div style={{fontSize:11}}>Recherche et clique pour ajouter</div></div>)
          :craftItems.map(({item,qty})=>(<div key={item.ankama_id} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 11px",borderBottom:"1px solid "+T.border2}}>
            <div style={{width:30,height:30,borderRadius:6,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{item.image_url?<img src={item.image_url} style={{width:24,height:24,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:14}}>⚗️</span>}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>{item.job&&<div style={{fontSize:9,color:T.muted}}>{item.job}</div>}</div>
            <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
              <button onClick={()=>updateQty(item.ankama_id,qty-1)} style={{width:18,height:18,borderRadius:4,border:"1px solid "+T.border,background:T.surface2,color:qty===1?T.danger:T.text,cursor:"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{fontSize:11,fontWeight:700,color:T.accent,minWidth:20,textAlign:"center"}}>×{qty}</span>
              <button onClick={()=>updateQty(item.ankama_id,qty+1)} style={{width:18,height:18,borderRadius:4,border:"1px solid "+T.accentBorder,background:T.accentBg,color:T.accent,cursor:"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              <button onClick={()=>removeItem(item.ankama_id)} style={{width:18,height:18,borderRadius:4,border:"none",background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:11,marginLeft:1}}>✕</button>
            </div>
          </div>))}
        </div>
      </div>
      {/* ── COL 3 : VUE PRINCIPALE ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 17px",borderBottom:"1px solid "+T.border,background:T.surface,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{fontWeight:700,fontSize:14,color:T.text}}>{listName}</span>
            {craftItems.length>0&&<span style={{fontSize:11,color:T.muted,background:T.surface2,borderRadius:20,padding:"1px 7px",border:"1px solid "+T.border2}}>{craftItems.length} craft{craftItems.length!==1?"s":""}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {craftView==="total"&&ingredients.length>0&&<button onClick={()=>setBanque({})} style={{fontSize:11,padding:"4px 9px",borderRadius:6,border:"1px solid "+T.border,background:T.surface2,color:T.muted,cursor:"pointer",fontFamily:T.font}}>Réinit. banque</button>}
            <button onClick={toggleSubCrafts} disabled={resolvingSubCrafts||craftItems.length===0} style={{fontSize:11,padding:"4px 11px",borderRadius:6,border:"1px solid "+(subCraftsEnabled?T.accentBorder:T.border),background:subCraftsEnabled?T.accentBg:T.surface2,color:subCraftsEnabled?T.accent:craftItems.length===0?T.muted+"55":T.muted,cursor:resolvingSubCrafts||craftItems.length===0?"not-allowed":"pointer",fontFamily:T.font,fontWeight:subCraftsEnabled?700:400,display:"flex",alignItems:"center",gap:4,opacity:craftItems.length===0?0.5:1}}>{resolvingSubCrafts?"⏳ Calcul...":"⚗️ Sous-crafts"}{subCraftsEnabled&&!resolvingSubCrafts&&<span style={{fontSize:9,background:T.accent,color:"#fff",borderRadius:10,padding:"1px 5px",fontWeight:700}}>ON</span>}</button>
            <div style={{display:"flex",background:T.surface2,borderRadius:7,padding:3,border:"1px solid "+T.border2}}>
              {[["par_craft","Par craft"],["total","Total global"]].map(([id,label])=>(<button key={id} onClick={()=>setCraftView(id)} style={{padding:"5px 11px",borderRadius:5,border:"none",background:craftView===id?T.accent:"transparent",color:craftView===id?"#fff":T.muted,fontWeight:craftView===id?700:400,cursor:"pointer",fontFamily:T.font,fontSize:12,transition:"all 0.15s"}}>{label}</button>))}
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"13px 17px"}}>
          {craftItems.length===0?(<div style={{textAlign:"center",padding:"55px 18px",color:T.muted}}><div style={{fontSize:36,marginBottom:10,opacity:0.25}}>⚗️</div><div style={{fontSize:14,fontWeight:600,color:T.textSub,marginBottom:5}}>Atelier de Craft</div><div style={{fontSize:12}}>Ajoute des items depuis le panneau de gauche</div></div>)
          :craftView==="par_craft"?(
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {craftItems.map(({item,qty})=>{
                const tree=subCraftsEnabled?subTrees[item.ankama_id]:null;
                // Recursive cascade renderer
                const renderNodes=(nodes,depth=0)=>nodes.map((r,i)=>{
                  const total=r.qty??r.quantity*qty;
                  const key=r.ankama_id??r.name;
                  const inBanque=bv(key);
                  const complete=inBanque>=total;
                  const hasSubCraft=r.subRecipe&&r.subRecipe.length>0;
                  const isSkipped=skipSubCraft[key]||false;
                  const showChildren=hasSubCraft&&!isSkipped;
                  return(
                    <div key={i}>
                      <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px",marginLeft:depth*18,borderLeft:depth>0?"2px solid "+T.accentBorder:"none",marginBottom:2}}>
                        {depth>0&&<span style={{fontSize:9,color:T.accentBorder,flexShrink:0}}>{"└"}</span>}
                        <div style={{width:depth===0?34:26,height:depth===0?34:26,borderRadius:depth===0?7:5,background:complete?T.successBg:T.surface2,border:"1px solid "+(complete?"rgba(34,197,94,0.4)":hasSubCraft&&!isSkipped?T.accentBorder:T.border),display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0,position:"relative"}}>
                          {complete&&<div style={{position:"absolute",top:1,right:1,fontSize:7,color:T.success}}>✓</div>}
                          {r.image_url?<img src={r.image_url} style={{width:depth===0?28:20,height:depth===0?28:20,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:depth===0?16:12}}>🌿</span>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:depth===0?11:10,fontWeight:600,color:complete?T.success:showChildren?T.accent:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
                          <div style={{fontSize:8,color:T.muted}}>{r.level?`Niv. ${r.level}`:""}{depth>0?(r.level?` · ×${total} nécess.`:`×${total} nécessaires`):""}</div>
                        </div>
                        {/* ── Toggle craft/acheter ── */}
                        {hasSubCraft&&(
                          <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,marginLeft:4}}>
                            <span style={{fontSize:9,color:isSkipped?T.muted:T.accent,fontWeight:700,whiteSpace:"nowrap"}}>{isSkipped?"🛒 Acheter":"⚗️ Crafter"}</span>
                            <div onClick={()=>setSkipSubCraft(p=>{const next={...p};if(next[key])delete next[key];else next[key]=true;return next;})}
                              style={{width:36,height:20,borderRadius:10,background:isSkipped?T.border:T.accent,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0,border:"1px solid "+(isSkipped?T.border2:T.accentBorder)}}>
                              <div style={{position:"absolute",top:2,left:isSkipped?2:18,width:14,height:14,borderRadius:7,background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
                            </div>
                          </div>
                        )}
                        <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                          {(!hasSubCraft||isSkipped)&&<input type="number" min={0} value={banque[key]??""} placeholder="0" onChange={e=>setBanque(b=>({...b,[key]:Math.max(0,parseInt(e.target.value)||0)}))} style={{width:42,background:T.surface,border:"1px solid "+(complete?"rgba(34,197,94,0.4)":T.border),borderRadius:5,padding:"3px 3px",color:complete?T.success:T.text,fontSize:10,fontWeight:700,outline:"none",fontFamily:T.font,textAlign:"center",boxSizing:"border-box"}} />}
                          <span style={{fontSize:11,fontWeight:700,color:complete?T.success:T.accent,background:complete?T.successBg:T.accentBg,borderRadius:5,padding:"2px 7px",border:"1px solid "+(complete?"rgba(34,197,94,0.3)":T.accentBorder),minWidth:28,textAlign:"center"}}>×{total}</span>
                        </div>
                      </div>
                      {showChildren&&renderNodes(r.subRecipe,depth+1)}
                    </div>
                  );
                });
                return(()=>{
                  const isCollapsed=collapsedItems[item.ankama_id]||false;
                  const toggleCollapse=()=>setCollapsedItems(p=>({...p,[item.ankama_id]:!p[item.ankama_id]}));
                  return(
                  <div key={item.ankama_id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,overflow:"hidden"}}>
                    <div onClick={toggleCollapse} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 13px",borderBottom:isCollapsed?"none":"1px solid "+T.border2,background:T.panel,cursor:"pointer",userSelect:"none"}} onMouseEnter={e=>e.currentTarget.style.background=T.surface2} onMouseLeave={e=>e.currentTarget.style.background=T.panel}>
                      <div style={{width:32,height:32,borderRadius:7,background:T.surface2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{item.image_url?<img src={item.image_url} style={{width:26,height:26,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:15}}>⚗️</span>}</div>
                      <div style={{flex:1}}><span style={{fontWeight:700,fontSize:13,color:T.text}}>{item.name}</span>{item.level&&<span style={{marginLeft:6,fontSize:10,color:T.muted}}>Niv. {item.level}</span>}</div>
                      {item.job&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:T.surface2,color:T.textSub,border:"1px solid "+T.border2}}>{item.job}</span>}
                      <span style={{fontSize:11,color:T.accent,fontWeight:700,background:T.accentBg,borderRadius:6,padding:"2px 8px",border:"1px solid "+T.accentBorder}}>×{qty}</span>
                      <div style={{width:22,height:22,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",background:T.surface2,border:"1px solid "+T.border2,flexShrink:0,transition:"transform 0.2s",transform:isCollapsed?"rotate(-90deg)":"rotate(0deg)"}}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke={T.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    {!isCollapsed&&(subCraftsEnabled&&tree?(
                      tree.length>0?(<div style={{padding:"11px 13px"}}>{renderNodes(tree,0)}</div>):(<div style={{padding:"11px 13px",fontSize:11,color:T.muted,fontStyle:"italic"}}>Aucune recette connue</div>)
                    ):(
                      item.recipe?.length>0?(<div style={{padding:"11px 13px",display:"flex",flexWrap:"wrap",gap:7}}>
                      {item.recipe.map((r,i)=>{const total=r.quantity*qty;const key=r.ankama_id??r.name;const inBanque=bv(key);const complete=inBanque>=total;return(<div key={i} style={{width:108,border:"1px solid "+(complete?"rgba(34,197,94,0.4)":T.border),borderRadius:9,background:complete?T.successBg:T.surface2,padding:"7px 5px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s",position:"relative"}}>
                        {complete&&<div style={{position:"absolute",top:4,right:4,fontSize:9,color:T.success}}>✓</div>}
                        <div style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>{r.image_url?<img src={r.image_url} style={{width:30,height:30,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:19}}>🌿</span>}</div>
                        <div style={{fontSize:10,fontWeight:600,color:complete?T.success:T.text,textAlign:"center",lineHeight:1.25,width:"100%",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{r.name}</div>
                        <div style={{fontSize:9,color:T.muted,textAlign:"center",minHeight:11}}>{r.level?`Niv. ${r.level}`:"ressource"}</div>
                        <div style={{display:"flex",alignItems:"center",gap:3,marginTop:1}}>
                          <input type="number" min={0} value={banque[key]??""} placeholder="0" onChange={e=>setBanque(b=>({...b,[key]:Math.max(0,parseInt(e.target.value)||0)}))} style={{width:42,background:T.surface,border:"1px solid "+(complete?"rgba(34,197,94,0.4)":T.border),borderRadius:5,padding:"3px 3px",color:complete?T.success:T.text,fontSize:11,fontWeight:700,outline:"none",fontFamily:T.font,textAlign:"center",boxSizing:"border-box"}} />
                          <span style={{fontSize:10,color:T.muted}}>/{total}</span>
                        </div>
                      </div>);})}
                      </div>):(<div style={{padding:"12px 15px",fontSize:11,color:T.muted,fontStyle:"italic"}}>Aucune recette dans la BDD</div>)
                    ))}
                  </div>
                );
                })();
              })}
            </div>
          ):(
            ingredients.length===0?(<div style={{textAlign:"center",padding:"36px",color:T.muted,fontSize:13}}>Aucun ingrédient</div>):(
              <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:11,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 60px 85px 115px 85px",padding:"8px 15px",background:T.panel,borderBottom:"1px solid "+T.border,alignItems:"center"}}>
                  <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700}}>Ressource</div>
                  <div style={{textAlign:"center"}}>
                    <button onClick={()=>setSortOrder(s=>s==="asc"?"desc":s==="desc"?null:"asc")} style={{fontSize:9,color:sortOrder?T.accent:T.muted,background:sortOrder?T.accentBg:T.surface2,border:"1px solid "+(sortOrder?T.accentBorder:T.border2),borderRadius:4,padding:"2px 6px",cursor:"pointer",fontFamily:T.font,fontWeight:700,letterSpacing:1,whiteSpace:"nowrap"}}>
                      NIV {sortOrder==="asc"?"↑":sortOrder==="desc"?"↓":"⇅"}
                    </button>
                  </div>
                  {["Nécessaire","En banque 🏦","Reste"].map((h)=>(<div key={h} style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,textAlign:"center"}}>{h}</div>))}
                </div>
                <div>
                  {ingredients.map((ing,i)=>{const k=ing.key;const inBanque=bv(k);const reste=Math.max(0,ing.qty-inBanque);const complete=reste===0;return(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 85px 115px 85px",padding:"8px 15px",borderBottom:"1px solid "+T.border2,alignItems:"center",background:complete?T.successBg:"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}><div style={{width:24,height:24,borderRadius:5,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{ing.image_url?<img src={ing.image_url} style={{width:18,height:18,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:10}}>🌿</span>}</div><span style={{fontSize:12,color:complete?T.success:T.text,fontWeight:complete?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</span>{complete&&<span style={{fontSize:11,color:T.success}}>✓</span>}</div>
                    <div style={{textAlign:"center"}}>{ing.level?<span style={{fontSize:10,fontWeight:700,color:T.textSub,background:T.surface2,border:"1px solid "+T.border2,borderRadius:4,padding:"1px 5px"}}>{ing.level}</span>:<span style={{fontSize:9,color:T.muted}}>—</span>}</div>
                    <div style={{textAlign:"center"}}><span style={{fontSize:12,fontWeight:700,color:T.accent,background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:5,padding:"2px 9px"}}>{ing.qty}</span></div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                      <button onClick={()=>setBanque(b=>({...b,[k]:Math.max(0,bv(k)-1)}))} style={{width:18,height:18,borderRadius:4,border:"1px solid "+T.border2,background:T.surface2,color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <input type="number" min={0} value={banque[k]??""} placeholder="0" onChange={e=>setBanque(b=>({...b,[k]:Math.max(0,parseInt(e.target.value)||0)}))} style={{width:44,background:T.surface2,border:"1px solid "+(inBanque>0?"rgba(34,197,94,0.35)":T.border2),borderRadius:5,padding:"3px 3px",color:inBanque>0?T.success:T.muted,fontSize:11,fontWeight:700,outline:"none",fontFamily:T.font,textAlign:"center",boxSizing:"border-box"}} />
                      <button onClick={()=>setBanque(b=>({...b,[k]:bv(k)+1}))} style={{width:18,height:18,borderRadius:4,border:"1px solid rgba(34,197,94,0.3)",background:T.successBg,color:T.success,cursor:"pointer",fontFamily:T.font,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                    <div style={{textAlign:"center"}}><span style={{fontSize:12,fontWeight:700,color:complete?T.success:reste<=ing.qty*0.3?"#f59e0b":T.danger,background:complete?T.successBg:reste<=ing.qty*0.3?"rgba(245,158,11,0.1)":T.dangerBg,border:"1px solid "+(complete?"rgba(34,197,94,0.3)":reste<=ing.qty*0.3?"rgba(245,158,11,0.3)":"rgba(239,68,68,0.3)"),borderRadius:5,padding:"2px 9px"}}>{complete?"✓":reste}</span></div>
                  </div>);})}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 60px 85px 115px 85px",padding:"8px 15px",background:T.panel,borderTop:"1px solid "+T.border}}>
                  <div style={{fontSize:10,color:T.muted,display:"flex",alignItems:"center",gap:4}}><span style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:4,padding:"1px 6px",color:T.accent,fontWeight:700,fontSize:10}}>{ingredients.filter(i=>bv(i.key)>=i.qty).length}/{ingredients.length}</span>complètes</div>
                  <div/>
                  <div style={{textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.accent}}>{ingredients.reduce((s,i)=>s+i.qty,0)}</span></div>
                  <div style={{textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.success}}>{Object.values(banque).reduce((s,v)=>s+(parseInt(v,10)||0),0)}</span></div>
                  <div style={{textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.danger}}>{ingredients.reduce((s,i)=>s+Math.max(0,i.qty-bv(i.key)),0)}</span></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {deleteId&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)"}}><div style={{background:T.surface,border:"1px solid rgba(239,68,68,0.3)",borderRadius:15,padding:22,maxWidth:290,textAlign:"center",margin:16,boxShadow:T.shadowLg}}><div style={{fontSize:26,marginBottom:7}}>🗑️</div><h3 style={{color:T.danger,margin:"0 0 5px",fontFamily:T.font}}>Supprimer cette liste ?</h3><p style={{color:T.muted,margin:"0 0 16px",fontSize:12}}>Action irréversible.</p><div style={{display:"flex",gap:7}}><button onClick={()=>setDeleteId(null)} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font}}>Annuler</button><button onClick={()=>deleteList(deleteId)} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#dc2626",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Supprimer</button></div></div></div>)}
      {showSaveModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)"}}>
          <div style={{background:T.surface,border:"1px solid "+T.accentBorder,borderRadius:4,padding:24,width:"100%",maxWidth:360,boxShadow:T.shadowLg,position:"relative",margin:16}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:T.accent,borderRadius:"4px 4px 0 0"}}/>
            <div style={{fontSize:22,textAlign:"center",marginBottom:10}}>💾</div>
            <h3 style={{margin:"0 0 4px",color:T.text,fontSize:15,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:"uppercase",textAlign:"center"}}>SAUVEGARDER L'ATELIER</h3>
            <p style={{margin:"0 0 16px",fontSize:11,color:T.muted,textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>{craftItems.length} craft{craftItems.length!==1?"s":""} seront sauvegardés</p>
            <label style={{display:"block",color:T.muted,fontSize:9,marginBottom:6,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>NOM DE LA SAVE</label>
            <input
              autoFocus
              value={saveModalName}
              onChange={e=>setSaveModalName(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")confirmSaveModal();if(e.key==="Escape")setShowSaveModal(false);}}
              placeholder="ex: Farm Kanig semaine 1..."
              style={{width:"100%",background:T.surface2,border:"1px solid "+T.accentBorder,borderRadius:3,padding:"10px 12px",color:T.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",marginBottom:14}}
            />
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowSaveModal(false)} style={{flex:1,padding:"10px",borderRadius:3,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,fontWeight:700}}>ANNULER</button>
              <button onClick={confirmSaveModal} disabled={saving||!saveModalName.trim()} style={{flex:2,padding:"10px",borderRadius:3,border:"none",background:saving||!saveModalName.trim()?T.surface2:T.accent,color:saving||!saveModalName.trim()?T.muted:"#fff",fontWeight:700,cursor:saving||!saveModalName.trim()?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1}}>{saving?"SAUVEGARDE...":"💾 SAUVEGARDER"}</button>
            </div>
          </div>
        </div>
      )}
      {toast&&(<div style={{position:"fixed",bottom:22,right:22,background:toast.type==="err"?"#dc2626":T.accent,color:"#fff",padding:"9px 15px",borderRadius:9,fontWeight:700,fontSize:13,boxShadow:T.shadowLg,zIndex:300,fontFamily:T.font}}>{toast.type==="err"?"❌":"✅"} {toast.msg}</div>)}
    </div>
  );
}

// ─── BUILD TAB ────────────────────────────────────────────────
const SL=[
  {k:'chapeau',  l:'Coiffe',       ph:'https://api.dofusdb.fr/img/items/16289.png'},
  {k:'amulette', l:'Amulette',     ph:'https://api.dofusdb.fr/img/items/1181.png'},
  {k:'cape',     l:'Cape',         ph:'https://api.dofusdb.fr/img/items/17256.png'},
  {k:'bouclier', l:'Bouclier',     ph:'https://api.dofusdb.fr/img/items/82031.png'},
  {k:'arme',     l:'Arme',         ph:'https://api.dofusdb.fr/img/items/5069.png'},
  {k:'anneau1',  l:'Anneau',       ph:'https://api.dofusdb.fr/img/items/9142.png'},
  {k:'anneau2',  l:'Anneau',       ph:'https://api.dofusdb.fr/img/items/9142.png'},
  {k:'familier', l:'Familier',     ph:'https://api.dofusdb.fr/img/items/18011.png'},
  {k:'ceinture', l:'Ceinture',     ph:'https://api.dofusdb.fr/img/items/10176.png'},
  {k:'bottes',   l:'Bottes',       ph:'https://api.dofusdb.fr/img/items/11230.png'},
  {k:'dofus1',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
  {k:'dofus2',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
  {k:'dofus3',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
  {k:'dofus4',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
  {k:'dofus5',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
  {k:'dofus6',   l:'Dofus/Trophée',ph:'https://api.dofusdb.fr/img/items/23001.png'},
];
const SCOL={"Vitalité":"#ef4444","PA":"#60a5fa","PM":"#4ade80","Portée":"#c084fc","Force":"#ef4444","Intelligence":"#fb923c","Chance":"#60a5fa","Agilité":"#4ade80","Sagesse":"#60a5fa","Puissance":"#fbbf24","Dommages":"#ef4444","% Critique":"#ef4444","Initiative":"#fb923c","Prospection":"#fbbf24","Soins":"#4ade80","Invocations":"#c084fc"};
const CARACS=['Vitalité','Sagesse','Force','Intelligence','Chance','Agilité'];
const CARAC_ICONS={"Vitalité":"❤️","Sagesse":"🌟","Force":"💪","Intelligence":"🧠","Chance":"🍀","Agilité":"💨"};
const costBySlice=(stat,invested)=>{if(stat==='Vitalité')return 1;if(stat==='Sagesse')return 3;if(invested<100)return 1;if(invested<200)return 2;if(invested<300)return 3;if(invested<400)return 4;return 5;};
const pointsToStat=(stat,pts)=>{if(stat==='Vitalité')return pts;if(stat==='Sagesse')return Math.floor(pts/3);let v=0,rm=pts;for(const[cap,cost]of[[100,1],[100,2],[100,3],[100,4],[1e9,5]]){const take=cap<1e9?Math.min(rm,cap*cost):rm;const gained=Math.floor(take/cost);v+=gained;rm-=gained*cost;if(rm<=0)break;}return v;};
const defaultBuild=()=>({name:'Mon Build',classe:'Iop',level:200,slots:{},ch:{Vitalité:0,Sagesse:0,Force:0,Intelligence:0,Chance:0,Agilité:0},setOff:{}});

function BuildTab({session, onSendToAtelier}){
  const T=useT();const fi=makeFi(T);
  const lsKey='bld_v3_'+session.user.id;
  const [builds,setBuilds]=useState(()=>{try{const r=localStorage.getItem(lsKey);return r?JSON.parse(r):[]}catch{return [];}});
  const [activeBuildId,setActiveBuildId]=useState(null);
  const [build,setBuild]=useState(defaultBuild());
  const [buildName,setBuildName]=useState('Mon Build');
  const [activeSlot,setActiveSlot]=useState(null);
  const [searchQ,setSearchQ]=useState('');
  const [searchRes,setSearchRes]=useState([]);
  const [searching,setSearching]=useState(false);
  const [tip,setTip]=useState({vis:false,item:null,x:0,y:0});
  const [toast,setToast]=useState(null);
  const [showBuildSaveModal,setShowBuildSaveModal]=useState(false);
  const [buildSaveModalName,setBuildSaveModalName]=useState('');
  const [savingBuild,setSavingBuild]=useState(false);
  const debRef=useRef(null);
  useEffect(()=>{try{localStorage.setItem(lsKey,JSON.stringify(builds));}catch{}},[builds]);
  const showToast=(msg,type='ok')=>{setToast({msg,type});setTimeout(()=>setToast(null),2500);};

  // Search items
  useEffect(()=>{
    if(debRef.current)clearTimeout(debRef.current);
    if(!searchQ.trim()||searchQ.length<2){setSearchRes([]);return;}
    debRef.current=setTimeout(async()=>{
      setSearching(true);
      try{const r=await fetch(DOFUSDU_BASE+'/items/equipment/search?query='+encodeURIComponent(searchQ)+'&limit=24');if(r.ok){const d=await r.json();setSearchRes(Array.isArray(d)?d:[]);}}catch{}
      setSearching(false);
    },350);
  },[searchQ]);

  const fetchFull=async(id)=>{try{const r=await fetch(DOFUSDU_BASE+'/items/equipment/'+id);if(r.ok)return await r.json();}catch{}return null;};
  const equipItem=async(item)=>{const full=await fetchFull(item.ankama_id)||item;setBuild(b=>({...b,slots:{...b.slots,[activeSlot]:full}}));setActiveSlot(null);setSearchQ('');setSearchRes([]);showToast(item.name+' équipé ✓');};
  const unequipSlot=(k)=>setBuild(b=>{const s={...b.slots};delete s[k];return{...b,slots:s};});

  // Carac math
  const maxPts=(lv)=>(lv-1)*5;
  const usedPts=()=>Object.values(build.ch).reduce((a,b)=>a+b,0);
  const addCarac=(stat,delta)=>{setBuild(b=>{const cur=b.ch[stat]||0;let next=cur+delta;if(next<0)next=0;if(delta>0){const avail=maxPts(b.level)-Object.values(b.ch).reduce((a,v)=>a+v,0);if(delta>avail)next=cur+avail;}return{...b,ch:{...b.ch,[stat]:next}};});};

  // ── Panoplies detection ──
  const getSetCounts=()=>{
    const counts={};
    for(const item of Object.values(build.slots)){
      if(!item)continue;
      const sid=item.parent_set?.id;
      if(sid!=null){counts[sid]=(counts[sid]||{count:0,set:item.parent_set});counts[sid].count++;}
    }
    return counts;
  };
  const toggleSet=(sid)=>setBuild(b=>({...b,setOff:{...b.setOff,[sid]:!b.setOff[sid]}}));

  // ── Fetch set bonus details from dofusdu API ──
  const [setDetails,setSetDetails]=useState({});
  useEffect(()=>{
    const counts=getSetCounts();
    Object.keys(counts).forEach(async(sid)=>{
      if(setDetails[sid])return;
      try{
        const r=await fetch(DOFUSDU_BASE+'/sets/'+sid);
        if(r.ok){const d=await r.json();setSetDetails(p=>({...p,[sid]:d}));}
      }catch{}
    });
  },[build.slots]);

  // ── Full stat calc (items + caracs + set bonuses) ──
  const calcStats=()=>{
    const base={},eq={},bo={},t={};
    base['Vitalité']=55+(build.level-1)*5;base['PA']=6+(build.level>=100?1:0);base['PM']=3;base['Prospection']=100;base['Pods']=1000;
    // Caracs
    for(const[k,pts]of Object.entries(build.ch)){const v=pointsToStat(k,pts);if(v)eq[k]=(eq[k]||0)+v;}
    // Equipped items
    for(const item of Object.values(build.slots)){
      if(!item)continue;
      for(const eff of(item.effects||[])){const nm=eff.type?.name||'';const v=eff.int_maximum??eff.int_minimum??0;if(nm)eq[nm]=(eq[nm]||0)+v;}
    }
    // Set bonuses
    const counts=getSetCounts();
    for(const[sid,{count,set}]of Object.entries(counts)){
      if(build.setOff[sid])continue;
      const detail=setDetails[sid];
      if(!detail?.effects)continue;
      // Phaeris-style: effects have min/max per number of items
      // dofusdu returns effects array, find highest applicable bonus
      const applicable=detail.effects.filter(e=>e.min_count<=count);
      for(const eff of applicable){const nm=eff.type?.name||'';const v=eff.int_maximum??eff.int_minimum??0;if(nm)bo[nm]=(bo[nm]||0)+v;}
    }
    // Derivations
    const totalSag=(base['Sagesse']||0)+(eq['Sagesse']||0)+(bo['Sagesse']||0);const sagD=Math.floor(totalSag/10);
    if(sagD){['Esquive PA','Esquive PM','Retrait PA','Retrait PM'].forEach(k=>eq[k]=(eq[k]||0)+sagD);}
    const totalAgi=(base['Agilité']||0)+(eq['Agilité']||0)+(bo['Agilité']||0);const agiD=Math.floor(totalAgi/10);
    if(agiD){eq['Tacle']=(eq['Tacle']||0)+agiD;eq['Fuite']=(eq['Fuite']||0)+agiD;}
    const totalCha=(base['Chance']||0)+(eq['Chance']||0)+(bo['Chance']||0);const chaD=Math.floor(totalCha/10);
    if(chaD)eq['Prospection']=(eq['Prospection']||0)+chaD;
    for(const k of new Set([...Object.keys(base),...Object.keys(eq),...Object.keys(bo)])){t[k]=(base[k]||0)+(eq[k]||0)+(bo[k]||0);}
    t['Initiative']=(t['Initiative']||0)+(t['Force']||0)+(t['Intelligence']||0)+(t['Chance']||0)+(t['Agilité']||0);
    if(t['PA']>12)t['PA']=12;if(t['PM']>6)t['PM']=6;if(t['Portée']>6)t['Portée']=6;
    return{base,eq,bo,t};
  };
  const {base,eq,bo,t:stats}=calcStats();

  // Build save/load
  const saveBuild=()=>{const b={...build,name:buildName,id:activeBuildId||Date.now().toString()};if(activeBuildId){setBuilds(p=>p.map(x=>x.id===activeBuildId?b:x));}else{setBuilds(p=>[b,...p]);setActiveBuildId(b.id);}showToast('Build sauvegardé ✓');};
  const loadBuild=(b)=>{setBuild(b);setBuildName(b.name);setActiveBuildId(b.id);};
  const newBuild=()=>{setBuild(defaultBuild());setBuildName('Mon Build');setActiveBuildId(null);};
  const deleteBuild=(id)=>{setBuilds(p=>p.filter(b=>b.id!==id));if(activeBuildId===id)newBuild();showToast('Build supprimé');};
  const openBuildSaveModal=()=>{setBuildSaveModalName(buildName||'Mon Build');setShowBuildSaveModal(true);};
  const confirmBuildSaveModal=()=>{const name=buildSaveModalName.trim();if(!name)return;setSavingBuild(true);const id=Date.now().toString();const b={...build,name,id};setBuilds(p=>[b,...p]);setActiveBuildId(id);setBuildName(name);setSavingBuild(false);showToast(`"${name}" sauvegardé ✓`);setShowBuildSaveModal(false);};

  // ── Send equipped items to craft atelier ──
  const sendToAtelier=()=>{
    const items=Object.values(build.slots).filter(Boolean);
    if(!items.length){showToast('Aucun item équipé !','err');return;}
    onSendToAtelier(items);
    showToast(items.length+' item(s) envoyé(s) à l\'atelier ✓');
  };

  // Tooltip
  const onSlotEnter=(e,item)=>{if(!item)return;const rect=e.currentTarget.getBoundingClientRect();const flip=rect.right+270>window.innerWidth;setTip({vis:true,item,x:flip?rect.left-270:rect.right+8,y:Math.min(rect.top,window.innerHeight-440)});};
  const onSlotLeave=()=>setTip(t=>({...t,vis:false}));
  const fmtEff=(eff)=>{const min=eff.int_minimum??0;const max=eff.int_maximum??min;const nm=eff.type?.name||'';if(min===max)return(min>=0?'+':'')+min+' '+nm;return min+' à '+(max>=0?'+':'')+max+' '+nm;};
  const effColor=(eff)=>{const v=eff.int_minimum??0;const nm=eff.type?.name||'';const col=SCOL[nm];if(col)return v<0&&!nm.includes('Résistance')?'#ef4444':col;return v<0?'#ef4444':'#d0ccc4';};

  const used=usedPts();const maxP=maxPts(build.level);const rem=maxP-used;const pct=Math.min(100,maxP>0?used/maxP*100:0);
  const setCounts=getSetCounts();
  const hasEquipped=Object.values(build.slots).some(Boolean);

  const statRows=[
    {nm:'Vitalité',ic:'❤️',bv:55+(build.level-1)*5,hasCh:true},
    {nm:'PA',ic:'⚡',bv:6+(build.level>=100?1:0),hasCh:false},
    {nm:'PM',ic:'🦵',bv:3,hasCh:false},
    {nm:'Portée',ic:'🎯',bv:0,hasCh:false},null,
    {nm:'Force',ic:'💪',bv:0,hasCh:true},
    {nm:'Intelligence',ic:'🧠',bv:0,hasCh:true},
    {nm:'Chance',ic:'🍀',bv:0,hasCh:true},
    {nm:'Agilité',ic:'💨',bv:0,hasCh:true},
    {nm:'Sagesse',ic:'🌟',bv:0,hasCh:true},
  ];
  const statRows2=[
    {nm:'Pods',ic:'🎒',bv:1000},null,
    {nm:'Tacle',ic:'⚔️',bv:0},{nm:'Fuite',ic:'🏃',bv:0},
    {nm:'Esquive PA',ic:'🛡️',bv:0},{nm:'Esquive PM',ic:'🛡️',bv:0},
    {nm:'Retrait PA',ic:'↩️',bv:0},{nm:'Retrait PM',ic:'↩️',bv:0},null,
    {nm:'Initiative',ic:'🏆',bv:0},{nm:'Prospection',ic:'🔍',bv:100},{nm:'% Critique',ic:'💥',bv:0},{nm:'Soins',ic:'💚',bv:0},null,
    {nm:'Dommages Terre',ic:'🟤',bv:0},{nm:'Dommages Feu',ic:'🔴',bv:0},
    {nm:'Dommages Eau',ic:'🔵',bv:0},{nm:'Dommages Air',ic:'🟢',bv:0},{nm:'Dommages Neutre',ic:'⚪',bv:0},null,
    {nm:'Résistance Terre',ic:'🟤',bv:0},{nm:'Résistance Feu',ic:'🔴',bv:0},
    {nm:'Résistance Eau',ic:'🔵',bv:0},{nm:'Résistance Air',ic:'🟢',bv:0},{nm:'Résistance Neutre',ic:'⚪',bv:0},
  ];

  const cardS={background:T.surface,border:'1px solid '+T.border,borderRadius:10,overflow:'hidden'};
  const tdB={padding:'2px 4px',fontSize:11,fontWeight:600,textAlign:'right',background:T.surface,borderBottom:'1px solid '+T.border2,whiteSpace:'nowrap'};

  return(
    <div style={{display:'flex',gap:12,height:'calc(100vh - 112px)',fontFamily:T.font,overflow:'hidden',fontSize:13}}>
      <style>{`
        @keyframes bldPulse{0%,100%{box-shadow:0 0 10px ${T.accent}33}50%{box-shadow:0 0 22px ${T.accent}55}}
        @keyframes tipFade{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
        .bld-slot{width:64px;height:64px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;transition:all .18s;position:relative;border:2px dashed ${T.border};background:${T.panel}}
        .bld-slot.filled{background:${T.surface2};border:2px solid ${T.border}}
        .bld-slot:hover,.bld-slot.active{border-color:${T.accent}!important}
        .bld-slot.active{animation:bldPulse 2s ease-in-out infinite}
        .bld-slot:hover{box-shadow:0 0 14px ${T.accent}33}
        .bld-slot img.iimg{width:36px;height:36px;object-fit:contain;image-rendering:pixelated;transition:transform .12s}
        .bld-slot:hover img.iimg{transform:scale(1.08)}
        .bld-slot img.ph{width:34px;height:34px;object-fit:contain;filter:grayscale(1) opacity(.25)}
        .slot-lbl{font-size:7px;font-weight:700;color:${T.muted};text-transform:uppercase;letter-spacing:.3px;max-width:60px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .bld-slot.filled .slot-lbl{color:${T.textSub}}
        .slot-rm{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#ef4444;border:2px solid ${T.surface};color:#fff;font-size:9px;display:none;align-items:center;justify-content:center;cursor:pointer;font-weight:800;line-height:1;z-index:2}
        .bld-slot.filled:hover .slot-rm{display:flex}
        .slot-rm:hover{transform:scale(1.15)}
        .crbtn{width:22px;height:22px;padding:0;border-radius:5px;border:1px solid ${T.border};background:${T.surface2};color:${T.text};cursor:pointer;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;transition:all .12s;font-family:inherit}
        .crbtn:hover{background:${T.accent};border-color:${T.accent};color:#fff}
        .icard2{display:flex;align-items:center;gap:7px;padding:5px 8px;background:${T.surface2};border:1px solid transparent;border-radius:7px;cursor:pointer;transition:all .15s}
        .icard2:hover{background:${T.surface};border-color:${T.border};transform:translateX(2px)}
        .bstbl{width:100%;border-collapse:separate;border-spacing:0 1px}
        .bstbl th{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:${T.muted};padding:3px 4px;text-align:right;background:${T.panel};position:sticky;top:0;z-index:1;white-space:nowrap}
        .bstbl th:first-child{text-align:left;border-radius:4px 0 0 4px}
        .bstbl th:last-child{border-radius:0 4px 4px 0}
        .bstbl td:first-child{text-align:left;font-weight:700;color:${T.textSub};border-radius:4px 0 0 4px}
        .bstbl td:last-child{border-radius:0 4px 4px 0}
        .bstbl tr:hover td{background:${T.surface2}!important}
        .bstbl .sp td{height:6px;border:none!important;background:none!important}
        .sbox-sw{width:34px;height:19px;background:${T.border};border:1px solid ${T.border2};border-radius:10px;cursor:pointer;position:relative;transition:all .15s;flex-shrink:0}
        .sbox-sw.on{background:${T.accentBg};border-color:${T.accent}}
        .sbox-sw::after{content:'';position:absolute;top:2px;left:2px;width:13px;height:13px;background:${T.muted};border-radius:50%;transition:all .15s}
        .sbox-sw.on::after{left:17px;background:${T.accent}}
      `}</style>

      {/* ── COL 1 : BUILDS ── */}
      <div style={{width:185,flexShrink:0,...cardS,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'10px 12px',borderBottom:'1px solid '+T.border,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:10,color:T.muted,textTransform:'uppercase',letterSpacing:2,fontWeight:700}}>Mes Builds</span>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'5px 7px'}}>
          {builds.length===0&&<div style={{padding:'24px 8px',textAlign:'center',color:T.muted,fontSize:11}}>Aucun build</div>}
          {builds.map(b=>(
            <div key={b.id} onClick={()=>loadBuild(b)} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 9px',borderRadius:7,background:activeBuildId===b.id?T.accentBg:T.surface,border:'1px solid '+(activeBuildId===b.id?T.accentBorder:T.border2),cursor:'pointer',marginBottom:3,transition:'all .15s'}}>
              <img src={CLASS_ICONS[b.classe]} style={{width:20,height:20,objectFit:'contain',flexShrink:0}} alt="" onError={e=>e.target.style.display='none'}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:activeBuildId===b.id?T.accent:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.name}</div>
                <div style={{fontSize:9,color:T.muted}}>Niv.{b.level} {b.classe}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();deleteBuild(b.id);}} style={{background:'transparent',border:'none',color:T.muted,cursor:'pointer',fontSize:11,opacity:.5}}>✕</button>
            </div>
          ))}
        </div>
        {hasEquipped&&<div style={{padding:'8px 7px',borderTop:'1px solid '+T.border}}>
          <button onClick={sendToAtelier} style={{width:'100%',padding:'6px',borderRadius:7,border:'1px solid '+T.accentBorder,background:T.accentBg,color:T.accent,fontWeight:700,cursor:'pointer',fontFamily:T.font,fontSize:11}}>📦 → Atelier de Craft</button>
        </div>}
      </div>

      {/* ── COL 2 : MANNEQUIN ── */}
      <div style={{width:300,flexShrink:0,display:'flex',flexDirection:'column',gap:10,overflowY:'auto'}}>
        {/* Classe */}
        <div style={{...cardS,padding:'12px'}}>
          <div style={{fontSize:9,color:T.accent,letterSpacing:2,textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Personnage</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
            <img src={CLASS_ICONS[build.classe]} style={{width:34,height:34,objectFit:'contain',flexShrink:0}} alt="" onError={e=>e.target.style.display='none'}/>
            <div style={{flex:1,minWidth:0}}>
              <input value={buildName} onChange={e=>setBuildName(e.target.value)} style={{...fi,padding:'3px 7px',fontSize:13,fontWeight:700,marginBottom:2,width:'100%'}}/>
              <div style={{fontSize:10,color:T.muted}}>{build.classe} — Niv. {build.level}</div>
            </div>
            <input type="number" min={1} max={200} value={build.level} onChange={e=>setBuild(b=>({...b,level:Math.min(200,Math.max(1,parseInt(e.target.value)||1))}))} style={{...fi,width:52,padding:'4px 4px',fontSize:12,textAlign:'center',flexShrink:0}}/>
            <button onClick={openBuildSaveModal} title="Sauvegarder ce build" style={{height:32,padding:'0 10px',borderRadius:5,border:'1px solid '+T.accentBorder,background:T.accentBg,color:T.accent,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:11,fontWeight:700,letterSpacing:0.5,display:'flex',alignItems:'center',gap:4,flexShrink:0,whiteSpace:'nowrap'}}>💾</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4}}>
            {CLASSES.map(c=>(
              <div key={c} onClick={()=>setBuild(b=>({...b,classe:c}))} title={c}
                style={{display:'flex',alignItems:'center',justifyContent:'center',padding:4,borderRadius:7,border:'1px solid '+(build.classe===c?T.accent:T.border2),background:build.classe===c?T.accentBg:T.surface2,cursor:'pointer',transition:'all .12s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=build.classe===c?T.accent:T.border2}>
                <img src={CLASS_ICONS[c]} style={{width:22,height:22,objectFit:'contain'}} alt={c} onError={e=>e.target.style.display='none'}/>
              </div>
            ))}
          </div>
        </div>

        {/* Doll 4×4 */}
        <div style={{...cardS,padding:'14px'}}>
          <div style={{fontSize:9,color:T.accent,letterSpacing:2,textTransform:'uppercase',fontWeight:700,marginBottom:10}}>Équipement</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,64px)',gridTemplateRows:'repeat(4,64px)',gap:5,margin:'0 auto',width:'fit-content'}}>
            {SL.map(s=>{
              const item=build.slots[s.k];const isAct=activeSlot===s.k;
              return(
                <div key={s.k}
                  className={'bld-slot'+(item?' filled':'')+(isAct?' active':'')}
                  onClick={()=>{setActiveSlot(s.k);setSearchQ('');setSearchRes([]);}}
                  onContextMenu={e=>{e.preventDefault();unequipSlot(s.k);}}
                  onMouseEnter={e=>onSlotEnter(e,item)}
                  onMouseLeave={onSlotLeave}
                  title="Clic : sélectionner | Clic droit : retirer">
                  {item?<img className="iimg" src={item.image_urls?.icon||s.ph} alt="" onError={e=>e.target.src=s.ph}/>:<img className="ph" src={s.ph} alt={s.l}/>}
                  <span className="slot-lbl">{item?item.name.slice(0,7)+(item.name.length>7?'…':''):s.l}</span>
                  {item&&<span className="slot-rm" onClick={e=>{e.stopPropagation();unequipSlot(s.k);}}>✕</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search */}
        {activeSlot&&(
          <div style={{...cardS,padding:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:700,color:T.accent}}>{SL.find(s=>s.k===activeSlot)?.l}</span>
              <button onClick={()=>{setActiveSlot(null);setSearchQ('');setSearchRes([]);}} style={{background:'transparent',border:'none',color:T.muted,cursor:'pointer',fontSize:14}}>✕</button>
            </div>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Chercher un item…" style={{...fi,fontSize:12,marginBottom:5}}/>
            {searching&&<div style={{textAlign:'center',padding:'8px',color:T.muted}}>⏳</div>}
            <div style={{maxHeight:210,overflowY:'auto',display:'flex',flexDirection:'column',gap:2}}>
              {searchRes.map(item=>(
                <div key={item.ankama_id} className="icard2" onClick={()=>equipItem(item)}>
                  <div style={{width:30,height:30,borderRadius:5,background:T.surface,border:'1px solid '+T.border,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                    {item.image_urls?.icon?<img src={item.image_urls.icon} style={{width:24,height:24,objectFit:'contain',imageRendering:'pixelated'}} alt="" onError={e=>e.target.style.display='none'}/>:<span>⚔️</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</div>
                    {item.level&&<div style={{fontSize:9,color:T.muted}}>Niv. {item.level}</div>}
                  </div>
                  <span style={{fontSize:12,color:T.accent}}>+</span>
                </div>
              ))}
              {!searching&&searchQ.length>=2&&searchRes.length===0&&<div style={{textAlign:'center',padding:'10px',color:T.muted,fontSize:11}}>Aucun résultat</div>}
            </div>
          </div>
        )}

        {/* ── PANOPLIES ── */}
        {Object.keys(setCounts).length>0&&(
          <div style={{...cardS,padding:'12px'}}>
            <div style={{fontSize:9,color:T.accent,letterSpacing:2,textTransform:'uppercase',fontWeight:700,marginBottom:8}}>🎭 Panoplies</div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {Object.entries(setCounts).map(([sid,{count,set}])=>{
                const detail=setDetails[sid];
                const isOff=build.setOff[sid];
                const setName=set?.name||detail?.name||('Set #'+sid);
                // Build bonus lines from detail
                const bonusLines=detail?.effects
                  ?[...new Set(detail.effects.map(e=>e.min_count))].sort((a,b)=>a-b).map(p=>{
                    const effs=detail.effects.filter(e=>e.min_count===p);
                    const active=!isOff&&count>=p;
                    const summary=effs.map(e=>{const v=e.int_maximum??e.int_minimum??0;return(v>0?'+':'')+v+' '+(e.type?.name||'');}).join(', ');
                    return{p,summary,active};
                  })
                  :[];
                return(
                  <div key={sid} style={{background:isOff?T.surface2:T.accentBg,border:'1px solid '+(isOff?T.border2:T.accentBorder),borderRadius:8,padding:'8px 10px',opacity:isOff?.4:1,transition:'all .2s'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:bonusLines.length?6:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:isOff?T.muted:T.accent}}>{setName} ({count}p)</span>
                      <div className={'sbox-sw'+(isOff?'':' on')} onClick={()=>toggleSet(sid)}/>
                    </div>
                    {bonusLines.map(({p,summary,active})=>(
                      <div key={p} style={{fontSize:10,color:active?T.success:T.muted,lineHeight:1.6,display:'flex',alignItems:'flex-start',gap:4}}>
                        <span>{active?'✅':'⬜'}</span>
                        <span><strong>{p}p :</strong> {summary}</span>
                      </div>
                    ))}
                    {!detail&&<div style={{fontSize:9,color:T.muted,fontStyle:'italic'}}>Chargement des bonus…</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── COL 3 : STATS ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,overflowY:'auto',minWidth:0}}>
        {/* Carac */}
        <div style={{...cardS,padding:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'6px 10px',background:T.panel,border:'1px solid '+T.border,borderRadius:8,marginBottom:10,flexWrap:'nowrap'}}>
            <span style={{fontSize:11,fontWeight:700,color:T.textSub,whiteSpace:'nowrap'}}>Points</span>
            <div style={{flex:1,height:5,background:T.border2,borderRadius:3,overflow:'hidden',minWidth:50}}>
              <div style={{height:'100%',width:pct+'%',background:rem<0?T.danger:T.accent,borderRadius:3,transition:'width .3s'}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:rem<0?T.danger:T.accent,whiteSpace:'nowrap'}}>{used} / {maxP}</span>
            <button onClick={()=>setBuild(b=>({...b,ch:{Vitalité:0,Sagesse:0,Force:0,Intelligence:0,Chance:0,Agilité:0}}))} style={{fontSize:10,padding:'2px 7px',borderRadius:5,border:'1px solid rgba(239,68,68,.25)',background:'rgba(239,68,68,.07)',color:T.danger,cursor:'pointer',fontFamily:T.font}}>↺ Reset</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
            {CARACS.map(stat=>{
              const pts=build.ch[stat]||0;const gained=pointsToStat(stat,pts);const nc=costBySlice(stat,pts);
              return(
                <div key={stat} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 8px',background:T.panel,border:'1px solid '+T.border,borderRadius:7}}>
                  <span style={{fontSize:12,width:16,textAlign:'center',flexShrink:0}}>{CARAC_ICONS[stat]}</span>
                  <span style={{fontSize:10,fontWeight:700,color:T.textSub,width:58,flexShrink:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{stat}</span>
                  <button className="crbtn" onClick={()=>addCarac(stat,-nc)}>−</button>
                  <input type="number" min={0} value={pts} onChange={e=>setBuild(b=>({...b,ch:{...b.ch,[stat]:Math.max(0,parseInt(e.target.value)||0)}}))} style={{width:44,padding:'2px 3px',background:T.surface,border:'1px solid '+T.border,borderRadius:5,color:T.accent,fontSize:11,fontWeight:700,outline:'none',fontFamily:T.font,textAlign:'center',boxSizing:'border-box'}}/>
                  <button className="crbtn" onClick={()=>addCarac(stat,nc)}>+</button>
                  <span style={{fontSize:11,fontWeight:800,color:SCOL[stat]||T.text,minWidth:24,textAlign:'right',marginLeft:'auto'}}>{gained}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stat tables */}
        <div style={{...cardS,padding:'12px'}}>
          <div style={{fontSize:9,color:T.accent,letterSpacing:2,textTransform:'uppercase',fontWeight:700,marginBottom:8}}>📊 Caractéristiques détaillées</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1px 1fr',gap:0,alignItems:'start'}}>
            <table className="bstbl">
              <thead><tr>
                <th>Stat</th><th>Base</th><th>Carac</th><th>Équip</th><th style={{color:T.success}}>Pano</th><th>Total</th>
              </tr></thead>
              <tbody>
                {statRows.map((row,i)=>{
                  if(!row)return <tr key={i} className="sp"><td colSpan={6}></td></tr>;
                  const {nm,ic,bv,hasCh}=row;
                  const cv=hasCh?Math.round(pointsToStat(nm,build.ch[nm]||0)):0;
                  const bov=bo[nm]||0;
                  const ev=(eq[nm]||0)-cv;
                  const tot=stats[nm]||0;
                  const col=SCOL[nm]||T.text;
                  return(<tr key={nm}>
                    <td style={{...tdB,textAlign:'left',color:T.textSub,fontSize:10}}><span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,textAlign:'center'}}>{ic}</span>{nm}</span></td>
                    <td style={{...tdB,color:T.muted}}>{bv||''}</td>
                    <td style={{...tdB,color:cv>0?col:T.muted}}>{cv>0?'+'+cv:''}</td>
                    <td style={{...tdB,color:ev>0?col:ev<0?T.danger:T.muted}}>{ev!==0?(ev>0?'+':'')+ev:''}</td>
                    <td style={{...tdB,color:bov>0?T.success:T.muted}}>{bov>0?'+'+bov:''}</td>
                    <td style={{...tdB,color:col,fontWeight:800,fontSize:13}}>{tot}</td>
                  </tr>);
                })}
              </tbody>
            </table>
            <div style={{background:T.border,minHeight:'100%',margin:'0 8px',alignSelf:'stretch'}}/>
            <table className="bstbl">
              <thead><tr>
                <th>Stat</th><th>Base</th><th>Équip</th><th style={{color:T.success}}>Pano</th><th>Total</th>
              </tr></thead>
              <tbody>
                {statRows2.map((row,i)=>{
                  if(!row)return <tr key={'sp'+i} className="sp"><td colSpan={5}></td></tr>;
                  const {nm,ic,bv}=row;
                  const tot=stats[nm]||0;const ev=(eq[nm]||0)-(bv===0?0:0);const bov=bo[nm]||0;const equipV=tot-bv-bov;
                  const isRes=nm.includes('Résistance');
                  const col=isRes?(tot>0?'#4ade80':tot<0?'#ef4444':T.muted):SCOL[nm]||T.text;
                  if(!bv&&!equipV&&!bov&&!tot)return null;
                  return(<tr key={nm}>
                    <td style={{...tdB,textAlign:'left',color:T.textSub,fontSize:10}}><span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:16,textAlign:'center'}}>{ic}</span>{nm}</span></td>
                    <td style={{...tdB,color:T.muted}}>{bv||''}</td>
                    <td style={{...tdB,color:equipV>0?col:equipV<0?'#ef4444':T.muted}}>{equipV!==0?(equipV>0?'+':'')+equipV:''}</td>
                    <td style={{...tdB,color:bov>0?T.success:T.muted}}>{bov>0?'+'+bov:''}</td>
                    <td style={{...tdB,color:col,fontWeight:800,fontSize:13}}>{tot||''}</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tip.vis&&tip.item&&(()=>{
        const it=tip.item;const effs=it.effects||[];const setNm=it.parent_set?.name;
        return(
          <div style={{position:'fixed',left:tip.x,top:Math.min(tip.y,window.innerHeight-440),zIndex:9999,pointerEvents:'none',width:255,background:T.surface,border:'1px solid '+T.accent,borderRadius:10,boxShadow:'0 8px 30px rgba(0,0,0,.65)',animation:'tipFade .15s ease-out',overflow:'hidden'}}>
            <div style={{padding:'10px 12px 8px',borderBottom:'1px solid '+T.border2}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:4}}>
                {it.image_urls?.icon&&<img src={it.image_urls.icon} style={{width:38,height:38,objectFit:'contain',imageRendering:'pixelated',flexShrink:0}} alt=""/>}
                <div><div style={{fontWeight:800,fontSize:13,color:T.text,lineHeight:1.2}}>{it.name}</div><div style={{fontSize:10,color:T.accent,marginTop:2}}>{it.type?.name||''}</div></div>
              </div>
              {it.level&&<div style={{fontSize:11,color:T.accent,fontWeight:700}}>Niveau {it.level}</div>}
            </div>
            <div style={{padding:'8px 12px',maxHeight:260,overflowY:'auto'}}>
              {effs.length>0?effs.map((eff,i)=><div key={i} style={{fontSize:11,color:effColor(eff),lineHeight:1.75,fontWeight:600}}>{fmtEff(eff)}</div>):<div style={{fontSize:10,color:T.muted,fontStyle:'italic'}}>Aucun effet connu</div>}
            </div>
            {setNm&&<div style={{padding:'6px 12px',borderTop:'1px solid '+T.border2,fontSize:10,color:T.accent,fontStyle:'italic'}}>🎭 {setNm}</div>}
            <div style={{padding:'4px 12px',background:T.panel,borderTop:'1px solid '+T.border2,fontSize:9,color:T.muted,textAlign:'center'}}>CLIC : équiper &nbsp;|&nbsp; CLIC DROIT : retirer</div>
          </div>
        );
      })()}

      {showBuildSaveModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,backdropFilter:'blur(8px)'}}>
          <div style={{background:T.surface,border:'1px solid '+T.accentBorder,borderRadius:4,padding:24,width:'100%',maxWidth:360,boxShadow:T.shadowLg,position:'relative',margin:16}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:T.accent,borderRadius:'4px 4px 0 0'}}/>
            <div style={{fontSize:22,textAlign:'center',marginBottom:10}}>💾</div>
            <h3 style={{margin:'0 0 4px',color:T.text,fontSize:15,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:'uppercase',textAlign:'center'}}>SAUVEGARDER LE BUILD</h3>
            <p style={{margin:'0 0 16px',fontSize:11,color:T.muted,textAlign:'center',fontFamily:"'DM Sans',sans-serif"}}>{build.classe} — Niv. {build.level}</p>
            <label style={{display:'block',color:T.muted,fontSize:9,marginBottom:6,fontWeight:700,letterSpacing:2,textTransform:'uppercase',fontFamily:"'Rajdhani',sans-serif"}}>NOM DU BUILD</label>
            <input
              autoFocus
              value={buildSaveModalName}
              onChange={e=>setBuildSaveModalName(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')confirmBuildSaveModal();if(e.key==='Escape')setShowBuildSaveModal(false);}}
              placeholder="ex: Iop full Force PVP..."
              style={{width:'100%',background:T.surface2,border:'1px solid '+T.accentBorder,borderRadius:3,padding:'10px 12px',color:T.text,fontSize:13,outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box',marginBottom:14}}
            />
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setShowBuildSaveModal(false)} style={{flex:1,padding:'10px',borderRadius:3,border:'1px solid '+T.border,background:'transparent',color:T.muted,cursor:'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,fontWeight:700}}>ANNULER</button>
              <button onClick={confirmBuildSaveModal} disabled={savingBuild||!buildSaveModalName.trim()} style={{flex:2,padding:'10px',borderRadius:3,border:'none',background:savingBuild||!buildSaveModalName.trim()?T.surface2:T.accent,color:savingBuild||!buildSaveModalName.trim()?T.muted:'#fff',fontWeight:700,cursor:savingBuild||!buildSaveModalName.trim()?'not-allowed':'pointer',fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1}}>{savingBuild?'SAUVEGARDE...':'💾 SAUVEGARDER'}</button>
            </div>
          </div>
        </div>
      )}
      {toast&&<div style={{position:'fixed',bottom:20,right:20,background:toast.type==='err'?'#dc2626':T.accent,color:'#fff',padding:'9px 15px',borderRadius:9,fontWeight:700,fontSize:13,boxShadow:T.shadowLg,zIndex:300,fontFamily:T.font}}>{toast.type==='err'?'❌':'✅'} {toast.msg}</div>}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [themeId,setThemeId]=useState(()=>{try{const s=localStorage.getItem("theme_id");return s&&THEMES[s]?s:"sombre";}catch{return "sombre";}});
  const T=makeT(themeId);
  const setTheme=(id)=>{try{localStorage.setItem("theme_id",id);}catch{}setThemeId(id);};
  // legacy migration: if old theme_dark flag was set
  useEffect(()=>{try{const old=localStorage.getItem("theme_dark");if(old&&!localStorage.getItem("theme_id")){setTheme(old==="false"?"clair":"sombre");}}catch{}},[]);
  return (<ThemeCtx.Provider value={T}><AppInner themeId={themeId} setTheme={setTheme} /></ThemeCtx.Provider>);
}

// ─── MAIN APP INNER ───────────────────────────────────────────
function AppInner({ themeId, setTheme }) {
  const T=useT();const fi=makeFi(T);
  const [gateOpen,setGateOpen]=useState(false);const [session,setSession]=useState(null);const [mainTab,setMainTab]=useState("persos");const [authLoading,setAuthLoading]=useState(true);
  const [characters,setCharacters]=useState([]);const [loading,setLoading]=useState(false);
  const [activeSurcat,setActiveSurcat]=useState("all");const [activeTab,setActiveTab]=useState("all");const [search,setSearch]=useState("");const [filterCompte,setFilterCompte]=useState("Tous");const [sortBy,setSortBy]=useState("compte");
  const [showForm,setShowForm]=useState(false);const [editingChar,setEditingChar]=useState(null);const [form,setForm]=useState(defaultChar());
  const [toast,setToast]=useState(null);const [deleteConfirm,setDeleteConfirm]=useState(null);const [shareCount,setShareCount]=useState(0);const [craftExternalItems,setCraftExternalItems]=useState(null);
  const [showThemePicker,setShowThemePicker]=useState(false);const themePickerRef=useRef(null);
  useEffect(()=>{if(!showThemePicker)return;const h=(e)=>{if(themePickerRef.current&&!themePickerRef.current.contains(e.target))setShowThemePicker(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[showThemePicker]);
  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthLoading(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe();},[]);
  useEffect(()=>{if(session){loadCharacters();loadShareCount();}},[session]);
  const loadCharacters=async()=>{setLoading(true);const{data,error}=await supabase.from("characters").select("*").order("created_at",{ascending:true});if(!error&&data)setCharacters(data);setLoading(false);};
  const loadShareCount=async()=>{const{data}=await supabase.from("shares").select("id").eq("shared_with_email",session?.user?.email);if(data)setShareCount(data.length);};
  const getWebhookConfig=()=>{if(!session)return null;const r=localStorage.getItem("webhook_config_"+session.user.id);if(!r)return null;return JSON.parse(r);};
  const fireWebhook=(type,char,extra={})=>{const cfg=getWebhookConfig();if(!cfg||!cfg.url)return;if(cfg.events&&cfg.events[type]===false)return;const p=buildEmbed(type,char,extra);if(p)sendWebhook(cfg.url,p);};
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  const openAdd=()=>{setForm(defaultChar());setEditingChar(null);setShowForm(true);};
  const openEdit=(c)=>{setForm({compte:c.compte,nom:c.nom,classe:c.classe,level:c.level,level_max:c.level_max,etat:c.etat,frigost:c.frigost,surcat:c.surcat||"PVM"});setEditingChar(c.id);setShowForm(true);};
  const handleSubmit=async()=>{if(!form.nom.trim())return showToast("Le nom est requis !","err");if(editingChar){const oldChar=characters.find(c=>c.id===editingChar);const{error}=await supabase.from("characters").update(form).eq("id",editingChar);if(error)return showToast("Erreur modification","err");if(oldChar&&form.level>oldChar.level)fireWebhook("levelup",{...oldChar,...form},{oldLevel:oldChar.level,newLevel:form.level});showToast("Modifié ✓");}else{const{error}=await supabase.from("characters").insert([{...form,user_id:session.user.id}]);if(error)return showToast("Erreur ajout","err");fireWebhook("add",form);showToast("Ajouté ✓");}await loadCharacters();setShowForm(false);};
  const handleDelete=async(id)=>{const{error}=await supabase.from("characters").delete().eq("id",id);if(error)return showToast("Erreur suppression","err");await loadCharacters();setDeleteConfirm(null);showToast("Supprimé");};
  const handleEtatChange=async(id,etat)=>{const char=characters.find(c=>c.id===id);const oldEtat=char?.etat;const{error}=await supabase.from("characters").update({etat}).eq("id",id);if(error)return;setCharacters(characters.map(c=>c.id===id?{...c,etat}:c));const newCat=getCatForEtat(etat);setActiveTab(newCat);if(etat==="Mort")fireWebhook("mort",{...char,etat},{});else fireWebhook("etat",{...char,etat},{oldEtat,newEtat:etat});showToast('→ "'+CATEGORIES.find(c=>c.id===newCat)?.label+'" ✓');};
  const handleSurcatChange=async(id,surcat)=>{const char=characters.find(c=>c.id===id);const oldSurcat=char?.surcat||"PVM";const{error}=await supabase.from("characters").update({surcat}).eq("id",id);if(error)return;setCharacters(characters.map(c=>c.id===id?{...c,surcat}:c));fireWebhook("surcat",{...char,surcat},{oldSurcat,newSurcat:surcat});showToast("Dossier → "+surcat+" ✓");};
  const handleLogout=async()=>await supabase.auth.signOut();
  if(!gateOpen)return<GatePage onSuccess={()=>setGateOpen(true)}/>;
  if(authLoading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,color:T.accent,fontFamily:T.font}}><div style={{textAlign:"center"}}><div style={{width:50,height:2,background:T.accent,margin:"0 auto 16px",animation:"none"}}></div><div style={{fontSize:11,letterSpacing:5,color:T.muted,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>Chargement...</div></div></div>);
  if(!session)return<AuthPage/>;
  const comptes=["Tous",...Array.from(new Set(characters.map(c=>c.compte).filter(Boolean)))];
  const surcats=[{id:"all",label:"Tous",icon:"⚔️",color:"#6b7280"},{id:"PVP",label:"PVP",icon:"🏆",color:T.pvp},{id:"PVM",label:"PVM",icon:"🐉",color:T.pvm}];
  const countSurcat=(sc)=>sc.id==="all"?characters.length:characters.filter(c=>(c.surcat||"PVM")===sc.id).length;
  const countFor=(cat)=>{const base=activeSurcat==="all"?characters:characters.filter(c=>(c.surcat||"PVM")===activeSurcat);return cat.etats?base.filter(c=>cat.etats.includes(c.etat)).length:base.length;};
  const filtered=characters.filter(c=>{const inSurcat=activeSurcat==="all"||(c.surcat||"PVM")===activeSurcat;const cat=CATEGORIES.find(cat=>cat.id===activeTab);const inTab=activeTab==="all"||(cat?.etats&&cat.etats.includes(c.etat));const s=search.toLowerCase();return inSurcat&&inTab&&(c.nom.toLowerCase().includes(s)||c.compte.toLowerCase().includes(s)||c.classe.toLowerCase().includes(s))&&(filterCompte==="Tous"||c.compte===filterCompte);}).sort((a,b)=>{if(sortBy==="compte")return(a.compte||"").localeCompare(b.compte||"")||(a.nom||"").localeCompare(b.nom||"");if(sortBy==="level")return b.level-a.level;if(sortBy==="nom")return(a.nom||"").localeCompare(b.nom||"");return(a.classe||"").localeCompare(b.classe||"");});
  const TabBtn=({active,color,onClick,icon,label,count})=>(<button onClick={onClick} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:3,border:"1px solid "+(active?color+"44":T.border2),background:active?color+"12":T.surface,color:active?color:T.muted,cursor:"pointer",fontWeight:700,fontSize:11,transition:"all 0.15s",fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:"uppercase"}}><span style={{fontSize:12}}>{icon}</span><span>{label}</span><span style={{background:active?color+"22":T.surface2,color:active?color:T.muted,borderRadius:2,padding:"0 5px",fontSize:10,fontWeight:700,minWidth:16,textAlign:"center"}}>{count}</span></button>);
  const MAIN_TABS=[{id:"persos",icon:"⚔️",label:"PERSONNAGES"},{id:"craft",icon:"⚗️",label:"ATELIER CRAFT"},{id:"build",icon:"🏗️",label:"BUILD"},{id:"partages",icon:"🔗",label:"PARTAGES",badge:shareCount},{id:"webhooks",icon:"🔔",label:"WEBHOOKS"}];
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}
        input::placeholder{color:${T.muted};}
        select option{background:${T.surface};}
      `}</style>
      {/* ── TOP NAV ── */}
      <nav style={{position:"sticky",top:0,zIndex:10,borderBottom:"1px solid "+T.border,background:T.surface,height:52,display:"flex",alignItems:"stretch"}}>
        {/* Red left accent bar */}
        <div style={{width:3,background:T.accent,flexShrink:0}}/>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",gap:10}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,color:T.text,letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>TABLEUR<span style={{color:T.accent,marginLeft:4}}>BY BENY</span></div>
            <div style={{width:1,height:24,background:T.border,marginLeft:4}}/>
            <div style={{fontSize:9,color:T.muted,letterSpacing:3,textTransform:"uppercase"}}>Serveur Héroïque</div>
          </div>
          {/* Right side stats + actions */}
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            {[{l:"TOTAL",v:characters.length,c:T.text},{l:"PVP",v:characters.filter(c=>(c.surcat||"PVM")==="PVP").length,c:T.pvp},{l:"PVM",v:characters.filter(c=>(c.surcat||"PVM")==="PVM").length,c:T.pvm},{l:"MORTS",v:characters.filter(c=>c.etat==="Mort").length,c:T.danger}].map(s=>(<div key={s.l} style={{textAlign:"center",padding:"3px 9px",background:T.panel,border:"1px solid "+T.border,borderRadius:2}}><div style={{fontSize:14,fontWeight:700,color:s.c,lineHeight:1,fontFamily:"'Rajdhani',sans-serif"}}>{s.v}</div><div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,marginTop:1}}>{s.l}</div></div>))}
            {mainTab==="persos"&&<button onClick={openAdd} style={{background:T.accent,color:"#fff",border:"none",borderRadius:2,padding:"6px 14px",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,textTransform:"uppercase",whiteSpace:"nowrap"}}>+ AJOUTER</button>}
            <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,padding:"5px 11px",background:"#5865F2",borderRadius:2,color:"#fff",fontWeight:700,fontSize:12,textDecoration:"none",whiteSpace:"nowrap",fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:"uppercase"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>DISCORD</a>
            {/* ── THEME PICKER ── */}
            <div style={{position:"relative",flexShrink:0}} ref={themePickerRef}>
              <button onClick={()=>setShowThemePicker(p=>!p)} title="Changer de thème" style={{height:30,padding:"0 10px",borderRadius:2,border:"1px solid "+(showThemePicker?T.accentBorder:T.border),background:showThemePicker?T.accentBg:T.panel,color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:12,display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"}}>
                <span style={{fontSize:14}}>{THEMES[themeId]?.icon||"🎨"}</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1,fontSize:11,color:showThemePicker?T.accent:T.textSub}}>{THEMES[themeId]?.label||"Thème"}</span>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{transition:"transform 0.2s",transform:showThemePicker?"rotate(180deg)":"rotate(0deg)"}}><path d="M2 3.5L5 6.5L8 3.5" stroke={T.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {showThemePicker&&(
                <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:T.surface,border:"1px solid "+T.border,borderRadius:6,boxShadow:T.shadowLg,overflow:"hidden",zIndex:50,minWidth:150}}>
                  <div style={{padding:"6px 10px 4px",fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,borderBottom:"1px solid "+T.border2}}>🎨 THÈME</div>
                  {Object.values(THEMES).map(th=>{const active=themeId===th.id;return(
                    <button key={th.id} onClick={()=>{setTheme(th.id);setShowThemePicker(false);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 12px",border:"none",background:active?T.accentBg:"transparent",color:active?T.accent:T.text,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:active?700:500,fontSize:13,letterSpacing:0.5,textAlign:"left",transition:"background 0.12s"}}
                      onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.surface2;}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
                      <span style={{fontSize:16,flexShrink:0}}>{th.icon}</span>
                      <span style={{flex:1}}>{th.label}</span>
                      {active&&<span style={{fontSize:10,color:T.accent}}>✓</span>}
                      <span style={{display:"flex",gap:3,flexShrink:0}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:th.accent,display:"inline-block"}}/>
                        <span style={{width:8,height:8,borderRadius:"50%",background:th.bg==="transparent"?"#fff":th.text,display:"inline-block",opacity:0.5}}/>
                      </span>
                    </button>
                  );})}
                </div>
              )}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",background:T.panel,border:"1px solid "+T.border,borderRadius:2}}><span style={{fontSize:10,color:T.textSub,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>{session.user.email}</span><button onClick={handleLogout} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.25)",borderRadius:2,padding:"2px 7px",color:T.danger,cursor:"pointer",fontSize:10,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1}}>DÉCO</button></div>
          </div>
        </div>
      </nav>
      {/* ── TAB BAR ── */}
      <div style={{borderBottom:"2px solid "+T.border,background:T.surface,position:"sticky",top:52,zIndex:9}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 21px",display:"flex",gap:0}}>
          {MAIN_TABS.map(t=>(<button key={t.id} onClick={()=>setMainTab(t.id)} style={{padding:"11px 18px",border:"none",borderBottom:mainTab===t.id?"2px solid "+T.accent:"2px solid transparent",marginBottom:"-2px",background:"transparent",color:mainTab===t.id?T.accent:T.muted,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s",fontSize:13,letterSpacing:1.5,textTransform:"none"}}><span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>{t.badge>0&&<span style={{background:T.pvp,color:"#fff",borderRadius:2,padding:"1px 5px",fontSize:9,fontWeight:700}}>{t.badge}</span>}</button>))}
        </div>
      </div>
      {mainTab==="build"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"14px 20px"}}><BuildTab session={session} onSendToAtelier={items=>{setCraftExternalItems(items);setMainTab("craft");}}/></div>}
      {mainTab==="partages"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"18px 20px"}}><PartagesTab session={session} characters={characters} showToast={showToast}/></div>}
      {mainTab==="webhooks"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"18px 20px"}}><WebhooksTab session={session}/></div>}
      {mainTab==="craft"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"14px 20px"}}><CraftTab session={session} externalItems={craftExternalItems} onExternalConsumed={()=>setCraftExternalItems(null)}/></div>}
      <div style={{maxWidth:1500,margin:"0 auto",display:mainTab==="persos"?"block":"none",padding:"14px 20px"}}>
        {/* Surcat filters */}
        <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>{surcats.map(sc=><TabBtn key={sc.id} active={activeSurcat===sc.id} color={sc.color} onClick={()=>{setActiveSurcat(sc.id);setActiveTab("all");}} icon={sc.icon} label={sc.label} count={countSurcat(sc)}/>)}</div>
        {/* Status filters */}
        <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>{CATEGORIES.map(cat=><TabBtn key={cat.id} active={activeTab===cat.id} color={cat.color} onClick={()=>setActiveTab(cat.id)} icon={cat.icon} label={cat.label} count={countFor(cat)}/>)}</div>
        {/* Search/filter bar */}
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center",padding:"10px 12px",background:T.surface,border:"1px solid "+T.border,borderRadius:3}}>
          <div style={{position:"relative",flex:1,minWidth:170}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:12,pointerEvents:"none"}}>🔍</span><input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...fi,paddingLeft:30,borderRadius:2,fontFamily:"'DM Sans',sans-serif"}}/></div>
          <select value={filterCompte} onChange={e=>setFilterCompte(e.target.value)} style={{...fi,width:"auto",cursor:"pointer",borderRadius:2,fontFamily:"'DM Sans',sans-serif"}}>{comptes.map(c=><option key={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...fi,width:"auto",cursor:"pointer",borderRadius:2,fontFamily:"'DM Sans',sans-serif"}}><option value="compte">Compte</option><option value="nom">Nom</option><option value="level">Level</option><option value="classe">Classe</option></select>
        </div>
        {loading?(<div style={{textAlign:"center",padding:"70px",color:T.muted}}><div style={{width:40,height:2,background:T.accent,margin:"0 auto 14px"}}></div><div style={{fontSize:11,letterSpacing:4,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>Chargement...</div></div>)
        :filtered.length===0?(<div style={{textAlign:"center",padding:"70px 18px",color:T.muted}}><div style={{fontSize:40,marginBottom:9,opacity:0.15}}>🗡️</div><div style={{fontSize:14,fontWeight:700,color:T.textSub,marginBottom:5,fontFamily:"'Rajdhani',sans-serif",letterSpacing:2,textTransform:"uppercase"}}>{characters.length===0?"Aucun personnage":"Aucun résultat"}</div><div style={{fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{characters.length===0?"Ajoutez votre premier personnage":"Modifiez vos filtres"}</div></div>)
        :(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:8}}>
          {filtered.map(char=>{const catColor=CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;const sc=surcats.find(s=>s.id===(char.surcat||"PVM"))||surcats[2];return(
            <div key={char.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:3,overflow:"hidden",boxShadow:T.shadow,transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=catColor+"55"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              {/* Top colored line */}
              <div style={{height:2,background:catColor}}/>
              <div style={{padding:"10px 12px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:36,height:36,borderRadius:3,background:catColor+"10",border:"1px solid "+catColor+"20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><img src={CLASS_ICONS[char.classe]} style={{width:28,height:28,objectFit:"contain"}} alt={char.classe} onError={e=>e.target.style.display="none"}/></div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:"'Rajdhani',sans-serif",letterSpacing:.5}}>{char.nom}</span>
                        <span style={{fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:2,background:sc.color+"14",color:sc.color,border:"1px solid "+sc.color+"30",fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>{sc.icon} {sc.label}</span>
                      </div>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'DM Sans',sans-serif"}}>{char.compte||<span style={{fontStyle:"italic"}}>Sans compte</span>}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:3,flexShrink:0}}>
                    <button onClick={()=>openEdit(char)} style={{background:T.panel,border:"1px solid "+T.border,borderRadius:2,padding:"4px 7px",color:T.textSub,cursor:"pointer",fontSize:11,fontFamily:T.font}}>✏️</button>
                    <button onClick={()=>setDeleteConfirm(char.id)} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.2)",borderRadius:2,padding:"4px 7px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>🗑️</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:3,marginBottom:8}}>
                  {[{l:"CLASSE",v:char.classe,c:T.textSub},{l:"LEVEL",v:char.level,c:T.accent},{l:"MAX",v:char.level_max,c:T.accent}].map(s=>(<div key={s.l} style={{flex:1,background:T.panel,borderRadius:2,padding:"4px 5px",textAlign:"center",border:"1px solid "+T.border}}><div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:1,fontFamily:"'Rajdhani',sans-serif"}}>{s.l}</div><div style={{fontWeight:700,fontSize:11,color:s.c,fontFamily:"'Rajdhani',sans-serif"}}>{s.v}</div></div>))}
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <select value={char.etat} onChange={e=>handleEtatChange(char.id,e.target.value)} style={{flex:1,background:ETAT_COLORS[char.etat]+"11",border:"1px solid "+ETAT_COLORS[char.etat]+"33",borderRadius:2,padding:"5px 6px",color:ETAT_COLORS[char.etat],fontWeight:700,fontSize:11,outline:"none",fontFamily:"'Rajdhani',sans-serif",cursor:"pointer",letterSpacing:.5}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select>
                  <select value={char.surcat||"PVM"} onChange={e=>handleSurcatChange(char.id,e.target.value)} style={{background:T.panel,border:"1px solid "+T.border,borderRadius:2,padding:"5px 6px",color:T.text,fontWeight:700,fontSize:11,outline:"none",fontFamily:"'Rajdhani',sans-serif",cursor:"pointer"}}><option value="PVM">🐉 PVM</option><option value="PVP">🏆 PVP</option></select>
                  <div style={{background:char.frigost!=="Continent"?T.accentBg:T.panel,border:"1px solid "+(char.frigost!=="Continent"?T.accentBorder:T.border),borderRadius:2,padding:"5px 7px",fontSize:11,color:char.frigost!=="Continent"?T.accent:T.muted,fontWeight:700,whiteSpace:"nowrap",fontFamily:"'Rajdhani',sans-serif"}}>{char.frigost!=="Continent"?`❄️ ${char.frigost==="Frigost 2"?"F2":char.frigost}`:"🌍"}</div>
                </div>
              </div>
            </div>
          );})}
        </div>)}
        <div style={{textAlign:"center",marginTop:12,color:T.muted,fontSize:9,letterSpacing:3,fontFamily:"'Rajdhani',sans-serif"}}>{filtered.length} PERSONNAGE{filtered.length!==1?"S":""} · SUPABASE ☁️</div>
      </div>
      {/* ── MODALS ── */}
      {showForm&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)"}}>
        <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:4,padding:24,width:"100%",maxWidth:490,boxShadow:T.shadowLg,position:"relative",margin:16,maxHeight:"90vh",overflowY:"auto"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:T.accent,borderRadius:"4px 4px 0 0"}}/>
          <button onClick={()=>setShowForm(false)} style={{position:"absolute",top:14,right:14,background:T.panel,border:"1px solid "+T.border,color:T.muted,cursor:"pointer",borderRadius:2,padding:"3px 9px",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>✕</button>
          <h2 style={{margin:"0 0 18px",color:T.text,fontSize:16,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:"uppercase"}}>{editingChar?"✏️ MODIFIER":"⚔️ NOUVEAU PERSONNAGE"}</h2>
          <div style={{marginBottom:14}}><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>📁 DOSSIER</label><div style={{display:"flex",gap:7}}>{[{id:"PVM",icon:"🐉",color:T.pvm},{id:"PVP",icon:"🏆",color:T.pvp}].map(s=>(<button key={s.id} onClick={()=>setForm(p=>({...p,surcat:s.id}))} style={{flex:1,padding:"9px",borderRadius:2,border:"2px solid "+(form.surcat===s.id?s.color:T.border),background:form.surcat===s.id?s.color+"12":T.panel,color:form.surcat===s.id?s.color:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,letterSpacing:1}}>{s.icon} {s.id}</button>))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{col:"1/-1",label:"NOM DU COMPTE",key:"compte",ph:"ex: MonCompte1"},{col:"1/-1",label:"NOM DU PERSONNAGE *",key:"nom",ph:"ex: Darkblade"}].map(f=>(<div key={f.key} style={{gridColumn:f.col}}><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>{f.label}</label><input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{...fi,borderRadius:2}}/></div>))}
            <div><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>CLASSE</label><select value={form.classe} onChange={e=>setForm(p=>({...p,classe:e.target.value}))} style={{...fi,cursor:"pointer",borderRadius:2}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>ÉTAT</label><select value={form.etat} onChange={e=>setForm(p=>({...p,etat:e.target.value}))} style={{...fi,cursor:"pointer",borderRadius:2}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select></div>
            <div><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>LEVEL ACTUEL</label><input type="number" min={1} max={200} value={form.level} onChange={e=>setForm(p=>({...p,level:parseInt(e.target.value)||1}))} style={{...fi,borderRadius:2}}/></div>
            <div><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>LEVEL MAX</label><input type="number" min={1} max={200} value={form.level_max} onChange={e=>setForm(p=>({...p,level_max:parseInt(e.target.value)||1}))} style={{...fi,borderRadius:2}}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{display:"block",color:T.muted,fontSize:9,marginBottom:8,fontWeight:700,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>ZONE</label>
              <div style={{display:"flex",gap:7,marginBottom:form.frigost!=="Continent"?8:0}}>
                <button onClick={()=>setForm(p=>({...p,frigost:"Continent"}))} style={{flex:1,padding:"8px",borderRadius:2,border:"2px solid "+(form.frigost==="Continent"?T.accent:T.border),background:form.frigost==="Continent"?T.accentBg:T.panel,color:form.frigost==="Continent"?T.accent:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,letterSpacing:1}}>🌍 CONTINENT</button>
                <button onClick={()=>setForm(p=>({...p,frigost:p.frigost==="Continent"?"Ben":p.frigost}))} style={{flex:1,padding:"8px",borderRadius:2,border:"2px solid "+(form.frigost!=="Continent"?T.accent:T.border),background:form.frigost!=="Continent"?T.accentBg:T.panel,color:form.frigost!=="Continent"?T.accent:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,letterSpacing:1}}>❄️ FRIGOST 2</button>
              </div>
              {form.frigost!=="Continent"&&(
                <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"9px 10px",background:T.accentBg,borderRadius:2,border:"1px solid "+T.accentBorder}}>
                  {["Ben","Obsi","Tengu","Korri","Kolloso","Glour","F3"].map(z=>(
                    <button key={z} onClick={()=>setForm(p=>({...p,frigost:z}))} style={{padding:"4px 10px",borderRadius:2,border:"1px solid "+(form.frigost===z?T.accent:T.accentBorder),background:form.frigost===z?T.accent:T.panel,color:form.frigost===z?"#fff":T.accent,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1,transition:"all 0.12s"}}>{z}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",gap:7,marginTop:18}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:"10px",borderRadius:2,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:1,fontWeight:700}}>ANNULER</button>
            <button onClick={handleSubmit} style={{flex:2,padding:"10px",borderRadius:2,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2}}>{editingChar?"SAUVEGARDER ✓":"AJOUTER +"}</button>
          </div>
        </div>
      </div>)}
      {deleteConfirm&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)"}}><div style={{background:T.surface,border:"1px solid rgba(239,68,68,0.35)",borderRadius:4,padding:24,maxWidth:310,textAlign:"center",margin:16,boxShadow:T.shadowLg,position:"relative"}}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:T.danger}}/>  <div style={{fontSize:24,marginBottom:8}}>💀</div><h3 style={{color:T.danger,margin:"0 0 5px",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:1,textTransform:"uppercase"}}>SUPPRIMER CE PERSONNAGE ?</h3><p style={{color:T.muted,margin:"0 0 16px",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>Action irréversible.</p><div style={{display:"flex",gap:7}}><button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"9px",borderRadius:2,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:1}}>ANNULER</button><button onClick={()=>handleDelete(deleteConfirm)} style={{flex:1,padding:"9px",borderRadius:2,border:"none",background:"#dc2626",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:1}}>SUPPRIMER</button></div></div></div>)}
      {toast&&(<div style={{position:"fixed",bottom:20,right:20,background:toast.type==="err"?"#dc2626":T.accent,color:"#fff",padding:"10px 16px",borderRadius:2,fontWeight:700,fontSize:13,boxShadow:T.shadowLg,zIndex:200,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,borderLeft:"4px solid rgba(255,255,255,0.3)"}}>{toast.type==="err"?"⚠":"✓"} {toast.msg}</div>)}
    </div>
  );
}
