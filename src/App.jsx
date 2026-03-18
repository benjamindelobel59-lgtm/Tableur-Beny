import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://smpbyqwnskuymjvcrrcu.supabase.co",
  "sb_publishable_V1jFd_pAkXmM6qfYyb83Ag_SdLEsxui"
);

const ThemeCtx = createContext({});
const useT = () => useContext(ThemeCtx);

const makeT = (dark) => ({
  dark,
  bg:           dark ? "#12141a" : "#f0f2f7",
  surface:      dark ? "#1a1d27" : "#ffffff",
  surface2:     dark ? "#1e2130" : "#f5f6fa",
  panel:        dark ? "#161922" : "#fafbfc",
  border:       dark ? "#2a2d3d" : "#dde1ed",
  border2:      dark ? "#222538" : "#eaecf4",
  text:         dark ? "#e4e6ef" : "#1a1d2e",
  textSub:      dark ? "#8b8fa8" : "#5d6175",
  muted:        dark ? "#585c72" : "#9196ab",
  accent:       dark ? "#5b6cf0" : "#4f5de0",
  accent2:      dark ? "#7b8cf5" : "#6b7ae8",
  accentBg:     dark ? "rgba(91,108,240,0.12)" : "rgba(79,93,224,0.08)",
  accentBorder: dark ? "rgba(91,108,240,0.35)" : "rgba(79,93,224,0.25)",
  pvp:          dark ? "#ef4444" : "#dc2626",
  pvm:          dark ? "#22c55e" : "#16a34a",
  danger:       dark ? "#ef4444" : "#dc2626",
  dangerBg:     dark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.07)",
  success:      dark ? "#22c55e" : "#16a34a",
  successBg:    dark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.08)",
  warning:      dark ? "#f59e0b" : "#d97706",
  discord:      "#5865F2",
  font:         "'DM Sans', system-ui, sans-serif",
  shadow:       dark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.07)",
  shadowLg:     dark ? "0 12px 40px rgba(0,0,0,0.7)" : "0 12px 40px rgba(0,0,0,0.12)",
});

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
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}.shake{animation:shake 0.5s ease;}*{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}input::placeholder{color:${T.muted};}select option{background:${T.surface};}`}</style>
      <div style={{width:"100%",maxWidth:360,margin:16,textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:15,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 14px"}}>⚔️</div>
        <div style={{fontWeight:700,fontSize:20,color:T.text,marginBottom:3}}>Tableur By Beny</div>
        <div style={{fontSize:10,color:T.muted,letterSpacing:3,textTransform:"uppercase",marginBottom:26}}>Accès Restreint</div>
        <div style={{background:T.surface,border:"1px solid "+(error?"rgba(239,68,68,0.4)":T.border),borderRadius:16,padding:"22px",boxShadow:T.shadowLg}}>
          <div style={{fontSize:12,color:T.textSub,marginBottom:14,lineHeight:1.6}}>🔒 Réservé aux membres</div>
          <div className={shake?"shake":""} style={{marginBottom:12}}>
            <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="CODE D'ACCÈS" maxLength={20}
              style={{width:"100%",background:T.surface2,border:"1px solid "+(error?"rgba(239,68,68,0.4)":T.border),borderRadius:10,padding:"13px",color:error?T.danger:T.accent,fontSize:20,fontWeight:700,outline:"none",fontFamily:T.font,boxSizing:"border-box",textAlign:"center",letterSpacing:8}} />
          </div>
          {error&&<div style={{marginBottom:12,padding:"8px 12px",background:T.dangerBg,border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,color:T.danger,fontSize:12,fontWeight:600}}>Code incorrect</div>}
          <button onClick={tryCode} style={{width:"100%",padding:"11px",borderRadius:10,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:14}}>Entrer →</button>
        </div>
        <div style={{marginTop:14,fontSize:11,color:T.muted}}>Pas de code ? <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{color:"#5865F2",textDecoration:"none",fontWeight:600}}>Discord ⚡</a></div>
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
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.font}}>
      <div style={{width:"100%",maxWidth:390,margin:16}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:50,height:50,borderRadius:13,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 12px"}}>⚔️</div>
          <div style={{fontWeight:700,fontSize:19,color:T.text}}>Tableur By Beny</div>
          <div style={{fontSize:10,color:T.muted,letterSpacing:3,marginTop:2,textTransform:"uppercase"}}>Serveur Héroïque</div>
        </div>
        <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:16,padding:22,boxShadow:T.shadowLg}}>
          <div style={{display:"flex",background:T.surface2,borderRadius:9,padding:3,marginBottom:18}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");setOk("");}} style={{flex:1,padding:"8px",borderRadius:7,border:"none",background:mode===m?T.accent:"transparent",color:mode===m?"#fff":T.muted,fontWeight:mode===m?700:400,cursor:"pointer",fontFamily:T.font,fontSize:13,transition:"all 0.2s"}}>{m==="login"?"Se connecter":"S'inscrire"}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {[["Email","email",email,setEmail,"ton@email.com"],["Mot de passe","password",pwd,setPwd,"••••••••"]].map(([l,type,v,set,ph])=>(
              <div key={l}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>{l}</label><input type={type} value={v} onChange={e=>set(e.target.value)} placeholder={ph} style={fi} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
            ))}
          </div>
          {err&&<div style={{marginTop:11,padding:"8px 12px",background:T.dangerBg,border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,color:T.danger,fontSize:12}}>❌ {err}</div>}
          {ok &&<div style={{marginTop:11,padding:"8px 12px",background:T.successBg,border:"1px solid rgba(34,197,94,0.25)",borderRadius:8,color:T.success,fontSize:12}}>✅ {ok}</div>}
          <button onClick={handle} disabled={loading} style={{width:"100%",marginTop:16,padding:"11px",borderRadius:10,border:"none",background:loading?T.surface2:T.accent,color:loading?T.muted:"#fff",fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:T.font,fontSize:14}}>{loading?"Chargement...":(mode==="login"?"Se connecter":"Créer mon compte")}</button>
        </div>
        <div style={{textAlign:"center",marginTop:12,color:T.muted,fontSize:11}}>Données privées et sécurisées 🔒</div>
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
function CraftTab({ session }) {
  const T=useT();const fi=makeFi(T);
  const [query,setQuery]=useState("");const [searchType,setSearchType]=useState("equipment");const [results,setResults]=useState([]);const [searching,setSearching]=useState(false);const [craftView,setCraftView]=useState("par_craft");
  const lsKey=`craft_session_v2_${session.user.id}`;const lsBanqKey=`craft_banque_${session.user.id}`;const lsNameKey=`craft_name_${session.user.id}`;
  const [craftItems,setCraftItems]=useState(()=>{try{const r=localStorage.getItem(lsKey);return r?JSON.parse(r):[]}catch{return []}});
  const [savedLists,setSavedLists]=useState([]);const [banque,setBanque]=useState(()=>{try{const r=localStorage.getItem(lsBanqKey);return r?JSON.parse(r):{}}catch{return {}}});
  const [listName,setListName]=useState(()=>{try{const r=localStorage.getItem(lsNameKey);return r||"Mon atelier"}catch{return "Mon atelier"}});
  const [saving,setSaving]=useState(false);const [loadingId,setLoadingId]=useState(null);const [ingCache,setIngCache]=useState({});
  const [activeList,setActiveList]=useState(null);const [deleteId,setDeleteId]=useState(null);const [updateId,setUpdateId]=useState(null);
  const [toast,setToast]=useState(null);const [addQty,setAddQty]=useState(1);
  const [subCraftsEnabled,setSubCraftsEnabled]=useState(()=>{try{return localStorage.getItem(`craft_subcrafts_${session.user.id}`)==="true";}catch{return false;}});
  const [subCraftCache,setSubCraftCache]=useState({});
  const [resolvingSubCrafts,setResolvingSubCrafts]=useState(false);
  const [skipSubCraft,setSkipSubCraft]=useState(()=>{try{const r=localStorage.getItem(`craft_skip_${session.user.id}`);return r?JSON.parse(r):{}}catch{return {};}});
  const [collapsedItems,setCollapsedItems]=useState({});
  const debounceRef=useRef(null);
  useEffect(()=>{try{localStorage.setItem(lsKey,JSON.stringify(craftItems));}catch{}},[craftItems]);
  useEffect(()=>{try{localStorage.setItem(lsBanqKey,JSON.stringify(banque));}catch{}},[banque]);
  useEffect(()=>{try{localStorage.setItem(lsNameKey,listName);}catch{}},[listName]);
  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};
  useEffect(()=>{localStorage.removeItem(`craft_session_${session.user.id}`);loadSavedLists();},[]);
  const loadSavedLists=async()=>{const{data}=await supabase.from("craft_lists").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false});if(data)setSavedLists(data);};
  useEffect(()=>{if(debounceRef.current)clearTimeout(debounceRef.current);if(!query.trim()||query.length<2){setResults([]);return;}debounceRef.current=setTimeout(()=>doSearch(query,searchType),350);return()=>clearTimeout(debounceRef.current);},[query,searchType]);
  const doSearch=async(q,type)=>{setSearching(true);try{const r=await fetch(`${DOFUSDU_BASE}/items/${type}/search?query=${encodeURIComponent(q)}&limit=20`);if(!r.ok)throw new Error();const d=await r.json();setResults(Array.isArray(d)?d:[]);}catch{setResults([]);}setSearching(false);};
  const fetchIconById=async(ankama_id)=>{const ck=`icon_${ankama_id}`;if(ingCache[ck]!==undefined)return ingCache[ck];for(const type of["resources","equipment","consumables","quest_items"]){try{const r=await fetch(`${DOFUSDU_BASE}/items/${type}/${ankama_id}`);if(r.ok){const d=await r.json();const v={icon:d?.image_urls?.icon??null,name:d?.name??null};setIngCache(p=>({...p,[ck]:v}));return v;}}catch{}}setIngCache(p=>({...p,[ck]:{icon:null,name:null}}));return{icon:null,name:null};};
  const addItem=async(item)=>{const ex=craftItems.find(ci=>ci.item.ankama_id===item.ankama_id);if(ex){const nq=(ex.qty||1)+addQty;setCraftItems(prev=>prev.map(ci=>ci.item.ankama_id===item.ankama_id?{...ci,qty:nq}:ci));showToast(`${item.name} ×${nq}`);return;}setLoadingId(item.ankama_id);try{const{data:recipeRow}=await supabase.from("recipes").select("*").eq("Item_Id",item.ankama_id).maybeSingle();let recipe=[];let jobLabel=null;if(recipeRow?.Ingredients){jobLabel=recipeRow.Job??null;const ingParts=recipeRow.Ingredients.split(",").map(s=>{const[rawId,rawQty]=s.trim().split("x");return{ankama_id:parseInt(rawId,10),quantity:parseInt(rawQty,10)||1};}).filter(r=>!isNaN(r.ankama_id));const icons=await Promise.all(ingParts.map(r=>fetchIconById(r.ankama_id)));recipe=ingParts.map((r,i)=>({ankama_id:r.ankama_id,name:icons[i]?.name??`#${r.ankama_id}`,image_url:icons[i]?.icon??null,quantity:r.quantity}));}const newItem={ankama_id:item.ankama_id,name:item.name,level:item.level??null,image_url:item.image_urls?.icon??null,subtype:searchType,job:jobLabel,recipe};setCraftItems(prev=>[...prev,{item:newItem,qty:addQty}]);showToast(`${item.name} ajouté ✓`);}catch{showToast("Erreur de chargement","err");}setLoadingId(null);};
  const removeItem=(ankama_id)=>setCraftItems(prev=>prev.filter(ci=>ci.item.ankama_id!==ankama_id));
  const updateQty=(ankama_id,qty)=>{if(qty<=0)removeItem(ankama_id);else setCraftItems(prev=>prev.map(ci=>ci.item.ankama_id===ankama_id?{...ci,qty}:ci));};
  const clearList=()=>{setCraftItems([]);setActiveList(null);setListName("Mon atelier");setUpdateId(null);};
  const saveList=async()=>{if(!listName.trim())return showToast("Donne un nom !","err");if(craftItems.length===0)return showToast("Ajoute des items d'abord !","err");setSaving(true);if(updateId){const{error}=await supabase.from("craft_lists").update({name:listName.trim(),items:craftItems,updated_at:new Date().toISOString()}).eq("id",updateId);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast("Mise à jour ✓");}else{const{error}=await supabase.from("craft_lists").insert([{user_id:session.user.id,name:listName.trim(),items:craftItems}]);setSaving(false);if(error)return showToast("Erreur : "+error.message,"err");showToast("Sauvegardée ✓");}loadSavedLists();};
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
    const recipe=ingParts.map((r,i)=>({ankama_id:r.ankama_id,name:icons[i]?.name??`#${r.ankama_id}`,image_url:icons[i]?.icon??null,quantity:r.quantity}));
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
  useEffect(()=>{if(subCraftsEnabled)resolveAllSubCrafts();},[craftItems]);

  const totalIngredients=()=>{
    if(subCraftsEnabled&&Object.keys(subTrees).length>0){
      const map={};
      for(const{item}of craftItems){
        const tree=subTrees[item.ankama_id]||[];
        flattenToLeaves(tree,map,skipSubCraft);
      }
      return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
    }
    const map={};for(const{item,qty}of craftItems)for(const r of(item.recipe||[])){const k=r.ankama_id??r.name;if(!map[k])map[k]={...r,qty:0,key:k};map[k].qty+=r.quantity*qty;}return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
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
          <button onClick={()=>{clearList();}} style={{width:22,height:22,borderRadius:5,border:"1px solid "+T.border,background:T.surface2,color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
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
        <div style={{padding:"9px 7px",borderTop:"1px solid "+T.border}}>
          <input value={listName} onChange={e=>setListName(e.target.value)} style={{...fi,padding:"6px 9px",fontSize:11,marginBottom:5}} placeholder="Nom du dossier..." />
          <button onClick={saveList} disabled={saving} style={{width:"100%",padding:"6px",borderRadius:7,border:"none",background:saving?T.surface2:T.accent,color:saving?T.muted:"#fff",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:T.font,fontSize:11}}>{saving?"…":updateId?"🔄 Mettre à jour":"💾 Sauvegarder"}</button>
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
                          {depth>0&&<div style={{fontSize:8,color:T.muted}}>×{total} nécessaires</div>}
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
                        <div style={{fontSize:9,color:T.muted,textAlign:"center",minHeight:11}}>ressource</div>
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
                <div style={{display:"grid",gridTemplateColumns:"1fr 85px 115px 85px",padding:"8px 15px",background:T.panel,borderBottom:"1px solid "+T.border}}>
                  {["Ressource","Nécessaire","En banque 🏦","Reste"].map((h,i)=>(<div key={h} style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,textAlign:i===0?"left":"center"}}>{h}</div>))}
                </div>
                <div>
                  {ingredients.map((ing,i)=>{const k=ing.key;const inBanque=bv(k);const reste=Math.max(0,ing.qty-inBanque);const complete=reste===0;return(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 85px 115px 85px",padding:"8px 15px",borderBottom:"1px solid "+T.border2,alignItems:"center",background:complete?T.successBg:"transparent"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}><div style={{width:24,height:24,borderRadius:5,background:T.surface2,border:"1px solid "+T.border2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{ing.image_url?<img src={ing.image_url} style={{width:18,height:18,objectFit:"contain",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"} alt=""/>:<span style={{fontSize:10}}>🌿</span>}</div><span style={{fontSize:12,color:complete?T.success:T.text,fontWeight:complete?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</span>{complete&&<span style={{fontSize:11,color:T.success}}>✓</span>}</div>
                    <div style={{textAlign:"center"}}><span style={{fontSize:12,fontWeight:700,color:T.accent,background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:5,padding:"2px 9px"}}>{ing.qty}</span></div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                      <button onClick={()=>setBanque(b=>({...b,[k]:Math.max(0,bv(k)-1)}))} style={{width:18,height:18,borderRadius:4,border:"1px solid "+T.border2,background:T.surface2,color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <input type="number" min={0} value={banque[k]??""} placeholder="0" onChange={e=>setBanque(b=>({...b,[k]:Math.max(0,parseInt(e.target.value)||0)}))} style={{width:44,background:T.surface2,border:"1px solid "+(inBanque>0?"rgba(34,197,94,0.35)":T.border2),borderRadius:5,padding:"3px 3px",color:inBanque>0?T.success:T.muted,fontSize:11,fontWeight:700,outline:"none",fontFamily:T.font,textAlign:"center",boxSizing:"border-box"}} />
                      <button onClick={()=>setBanque(b=>({...b,[k]:bv(k)+1}))} style={{width:18,height:18,borderRadius:4,border:"1px solid rgba(34,197,94,0.3)",background:T.successBg,color:T.success,cursor:"pointer",fontFamily:T.font,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                    <div style={{textAlign:"center"}}><span style={{fontSize:12,fontWeight:700,color:complete?T.success:reste<=ing.qty*0.3?"#f59e0b":T.danger,background:complete?T.successBg:reste<=ing.qty*0.3?"rgba(245,158,11,0.1)":T.dangerBg,border:"1px solid "+(complete?"rgba(34,197,94,0.3)":reste<=ing.qty*0.3?"rgba(245,158,11,0.3)":"rgba(239,68,68,0.3)"),borderRadius:5,padding:"2px 9px"}}>{complete?"✓":reste}</span></div>
                  </div>);})}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 85px 115px 85px",padding:"8px 15px",background:T.panel,borderTop:"1px solid "+T.border}}>
                  <div style={{fontSize:10,color:T.muted,display:"flex",alignItems:"center",gap:4}}><span style={{background:T.accentBg,border:"1px solid "+T.accentBorder,borderRadius:4,padding:"1px 6px",color:T.accent,fontWeight:700,fontSize:10}}>{ingredients.filter(i=>bv(i.key)>=i.qty).length}/{ingredients.length}</span>complètes</div>
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
      {toast&&(<div style={{position:"fixed",bottom:22,right:22,background:toast.type==="err"?"#dc2626":T.accent,color:"#fff",padding:"9px 15px",borderRadius:9,fontWeight:700,fontSize:13,boxShadow:T.shadowLg,zIndex:300,fontFamily:T.font}}>{toast.type==="err"?"❌":"✅"} {toast.msg}</div>)}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [darkMode,setDarkMode]=useState(()=>{try{return localStorage.getItem("theme_dark")!=="false";}catch{return true;}});
  const T=makeT(darkMode);
  const toggleTheme=()=>setDarkMode(d=>{const next=!d;try{localStorage.setItem("theme_dark",String(next));}catch{}return next;});
  return (<ThemeCtx.Provider value={T}><AppInner darkMode={darkMode} toggleTheme={toggleTheme} /></ThemeCtx.Provider>);
}

// ─── MAIN APP INNER ───────────────────────────────────────────
function AppInner({ darkMode, toggleTheme }) {
  const T=useT();const fi=makeFi(T);
  const [gateOpen,setGateOpen]=useState(false);const [session,setSession]=useState(null);const [mainTab,setMainTab]=useState("persos");const [authLoading,setAuthLoading]=useState(true);
  const [characters,setCharacters]=useState([]);const [loading,setLoading]=useState(false);
  const [activeSurcat,setActiveSurcat]=useState("all");const [activeTab,setActiveTab]=useState("all");const [search,setSearch]=useState("");const [filterCompte,setFilterCompte]=useState("Tous");const [sortBy,setSortBy]=useState("compte");
  const [showForm,setShowForm]=useState(false);const [editingChar,setEditingChar]=useState(null);const [form,setForm]=useState(defaultChar());
  const [toast,setToast]=useState(null);const [deleteConfirm,setDeleteConfirm]=useState(null);const [shareCount,setShareCount]=useState(0);
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
  if(authLoading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,color:T.accent,fontFamily:T.font}}><div style={{textAlign:"center"}}><div style={{fontSize:38,marginBottom:12}}>⚔️</div><div style={{letterSpacing:3,color:T.muted,fontSize:10,textTransform:"uppercase"}}>Chargement...</div></div></div>);
  if(!session)return<AuthPage/>;
  const comptes=["Tous",...Array.from(new Set(characters.map(c=>c.compte).filter(Boolean)))];
  const surcats=[{id:"all",label:"Tous",icon:"⚔️",color:"#6b7280"},{id:"PVP",label:"PVP",icon:"🏆",color:T.pvp},{id:"PVM",label:"PVM",icon:"🐉",color:T.pvm}];
  const countSurcat=(sc)=>sc.id==="all"?characters.length:characters.filter(c=>(c.surcat||"PVM")===sc.id).length;
  const countFor=(cat)=>{const base=activeSurcat==="all"?characters:characters.filter(c=>(c.surcat||"PVM")===activeSurcat);return cat.etats?base.filter(c=>cat.etats.includes(c.etat)).length:base.length;};
  const filtered=characters.filter(c=>{const inSurcat=activeSurcat==="all"||(c.surcat||"PVM")===activeSurcat;const cat=CATEGORIES.find(cat=>cat.id===activeTab);const inTab=activeTab==="all"||(cat?.etats&&cat.etats.includes(c.etat));const s=search.toLowerCase();return inSurcat&&inTab&&(c.nom.toLowerCase().includes(s)||c.compte.toLowerCase().includes(s)||c.classe.toLowerCase().includes(s))&&(filterCompte==="Tous"||c.compte===filterCompte);}).sort((a,b)=>{if(sortBy==="compte")return(a.compte||"").localeCompare(b.compte||"")||(a.nom||"").localeCompare(b.nom||"");if(sortBy==="level")return b.level-a.level;if(sortBy==="nom")return(a.nom||"").localeCompare(b.nom||"");return(a.classe||"").localeCompare(b.classe||"");});
  const TabBtn=({active,color,onClick,icon,label,count})=>(<button onClick={onClick} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 11px",borderRadius:8,border:"1px solid "+(active?color+"55":T.border2),background:active?color+"10":T.surface,color:active?color:T.muted,cursor:"pointer",fontWeight:active?600:400,fontSize:12,transition:"all 0.15s",fontFamily:T.font}}><span style={{fontSize:13}}>{icon}</span><span>{label}</span><span style={{background:active?color+"22":T.surface2,color:active?color:T.muted,borderRadius:20,padding:"0 5px",fontSize:10,fontWeight:700,minWidth:16,textAlign:"center"}}>{count}</span></button>);
  const MAIN_TABS=[{id:"persos",icon:"⚔️",label:"Personnages"},{id:"craft",icon:"⚗️",label:"Atelier de Craft"},{id:"partages",icon:"🔗",label:"Partages",badge:shareCount},{id:"webhooks",icon:"🔔",label:"Webhooks"}];
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.font,color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');*{scrollbar-width:thin;scrollbar-color:${T.border} ${T.bg};}input::placeholder{color:${T.muted};}select option{background:${T.surface};}`}</style>
      <nav style={{position:"sticky",top:0,zIndex:10,borderBottom:"1px solid "+T.border,background:T.surface,height:56,display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 20px",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:31,height:31,borderRadius:8,background:T.accentBg,border:"1px solid "+T.accentBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚔️</div>
            <div><div style={{fontWeight:700,fontSize:14,color:T.text,letterSpacing:-0.2}}>Tableur By Beny</div><div style={{fontSize:9,color:T.muted,letterSpacing:2,textTransform:"uppercase"}}>Serveur Héroïque</div></div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
            {[{l:"Total",v:characters.length,c:T.accent},{l:"PVP",v:characters.filter(c=>(c.surcat||"PVM")==="PVP").length,c:T.pvp},{l:"PVM",v:characters.filter(c=>(c.surcat||"PVM")==="PVM").length,c:T.pvm},{l:"Morts",v:characters.filter(c=>c.etat==="Mort").length,c:T.danger}].map(s=>(<div key={s.l} style={{textAlign:"center",padding:"3px 8px",background:T.surface2,border:"1px solid "+T.border2,borderRadius:7}}><div style={{fontSize:13,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginTop:1}}>{s.l}</div></div>))}
            {mainTab==="persos"&&<button onClick={openAdd} style={{background:T.accent,color:"#fff",border:"none",borderRadius:8,padding:"6px 13px",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:T.font,whiteSpace:"nowrap"}}>+ Ajouter</button>}
            <a href="https://discord.gg/z4VXdcQx4Y" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,padding:"5px 11px",background:"#5865F2",borderRadius:8,color:"#fff",fontWeight:700,fontSize:12,textDecoration:"none",whiteSpace:"nowrap",fontFamily:T.font}}><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>Discord</a>
            <button onClick={toggleTheme} title={darkMode?"Mode clair":"Mode sombre"} style={{width:32,height:32,borderRadius:8,border:"1px solid "+T.border,background:T.surface2,color:T.textSub,cursor:"pointer",fontFamily:T.font,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{darkMode?"☀️":"🌙"}</button>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",background:T.surface2,border:"1px solid "+T.border2,borderRadius:8}}><span style={{fontSize:11,color:T.textSub,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.user.email}</span><button onClick={handleLogout} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.2)",borderRadius:5,padding:"2px 6px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>Déco</button></div>
          </div>
        </div>
      </nav>
      <div style={{borderBottom:"1px solid "+T.border,background:T.surface}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 20px",display:"flex",gap:1}}>
          {MAIN_TABS.map(t=>(<button key={t.id} onClick={()=>setMainTab(t.id)} style={{padding:"10px 15px",border:"none",borderBottom:mainTab===t.id?"2px solid "+T.accent:"2px solid transparent",background:"transparent",color:mainTab===t.id?T.accent:T.muted,fontWeight:mainTab===t.id?600:400,cursor:"pointer",fontSize:13,fontFamily:T.font,display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"}}><span style={{fontSize:13}}>{t.icon}</span><span>{t.label}</span>{t.badge>0&&<span style={{background:T.pvp,color:"#fff",borderRadius:20,padding:"1px 5px",fontSize:9,fontWeight:700}}>{t.badge}</span>}</button>))}
        </div>
      </div>
      {mainTab==="partages"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"18px 20px"}}><PartagesTab session={session} characters={characters} showToast={showToast}/></div>}
      {mainTab==="webhooks"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"18px 20px"}}><WebhooksTab session={session}/></div>}
      {mainTab==="craft"&&<div style={{maxWidth:1500,margin:"0 auto",padding:"14px 20px"}}><CraftTab session={session}/></div>}
      <div style={{maxWidth:1500,margin:"0 auto",display:mainTab==="persos"?"block":"none",padding:"14px 20px"}}>
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>{surcats.map(sc=><TabBtn key={sc.id} active={activeSurcat===sc.id} color={sc.color} onClick={()=>{setActiveSurcat(sc.id);setActiveTab("all");}} icon={sc.icon} label={sc.label} count={countSurcat(sc)}/>)}</div>
        <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>{CATEGORIES.map(cat=><TabBtn key={cat.id} active={activeTab===cat.id} color={cat.color} onClick={()=>setActiveTab(cat.id)} icon={cat.icon} label={cat.label} count={countFor(cat)}/>)}</div>
        <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:170}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:12,pointerEvents:"none"}}>🔍</span><input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{...fi,paddingLeft:30}}/></div>
          <select value={filterCompte} onChange={e=>setFilterCompte(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}>{comptes.map(c=><option key={c}>{c}</option>)}</select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...fi,width:"auto",cursor:"pointer"}}><option value="compte">Compte</option><option value="nom">Nom</option><option value="level">Level</option><option value="classe">Classe</option></select>
        </div>
        {loading?(<div style={{textAlign:"center",padding:"70px",color:T.muted}}><div style={{fontSize:30,marginBottom:8}}>⏳</div><div>Chargement...</div></div>)
        :filtered.length===0?(<div style={{textAlign:"center",padding:"70px 18px",color:T.muted}}><div style={{fontSize:40,marginBottom:9,opacity:0.2}}>🗡️</div><div style={{fontSize:14,fontWeight:600,color:T.textSub,marginBottom:5}}>{characters.length===0?"Aucun personnage":"Aucun résultat"}</div><div style={{fontSize:12}}>{characters.length===0?"Ajoutez votre premier personnage":"Modifiez vos filtres"}</div></div>)
        :(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:9}}>
          {filtered.map(char=>{const catColor=CATEGORIES.find(cat=>cat.etats?.includes(char.etat))?.color||T.accent;const sc=surcats.find(s=>s.id===(char.surcat||"PVM"))||surcats[2];return(
            <div key={char.id} style={{background:T.surface,border:"1px solid "+T.border,borderRadius:12,overflow:"hidden",boxShadow:T.shadow}}>
              <div style={{height:2,background:catColor}}/>
              <div style={{padding:"11px 12px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:9}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:38,height:38,borderRadius:9,background:catColor+"12",border:"1px solid "+catColor+"25",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><img src={CLASS_ICONS[char.classe]} style={{width:30,height:30,objectFit:"contain"}} alt={char.classe} onError={e=>e.target.style.display="none"}/></div>
                    <div><div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}><span style={{fontWeight:700,fontSize:13,color:T.text}}>{char.nom}</span><span style={{fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,background:sc.color+"14",color:sc.color,border:"1px solid "+sc.color+"22"}}>{sc.icon} {sc.label}</span></div><div style={{fontSize:10,color:T.muted}}>{char.compte||<span style={{fontStyle:"italic"}}>Sans compte</span>}</div></div>
                  </div>
                  <div style={{display:"flex",gap:3,flexShrink:0}}>
                    <button onClick={()=>openEdit(char)} style={{background:T.surface2,border:"1px solid "+T.border2,borderRadius:6,padding:"4px 7px",color:T.textSub,cursor:"pointer",fontSize:11,fontFamily:T.font}}>✏️</button>
                    <button onClick={()=>setDeleteConfirm(char.id)} style={{background:T.dangerBg,border:"1px solid rgba(239,68,68,0.18)",borderRadius:6,padding:"4px 7px",color:T.danger,cursor:"pointer",fontSize:11,fontFamily:T.font}}>🗑️</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:8}}>
                  {[{l:"Classe",v:char.classe,c:T.textSub},{l:"Level",v:char.level,c:T.accent},{l:"Max",v:char.level_max,c:T.accent}].map(s=>(<div key={s.l} style={{flex:1,background:T.surface2,borderRadius:6,padding:"4px 5px",textAlign:"center",border:"1px solid "+T.border2}}><div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{s.l}</div><div style={{fontWeight:700,fontSize:11,color:s.c}}>{s.v}</div></div>))}
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <select value={char.etat} onChange={e=>handleEtatChange(char.id,e.target.value)} style={{flex:1,background:ETAT_COLORS[char.etat]+"11",border:"1px solid "+ETAT_COLORS[char.etat]+"33",borderRadius:7,padding:"5px 6px",color:ETAT_COLORS[char.etat],fontWeight:700,fontSize:11,outline:"none",fontFamily:T.font,cursor:"pointer"}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select>
                  <select value={char.surcat||"PVM"} onChange={e=>handleSurcatChange(char.id,e.target.value)} style={{background:T.surface2,border:"1px solid "+T.border2,borderRadius:7,padding:"5px 6px",color:T.text,fontWeight:600,fontSize:11,outline:"none",fontFamily:T.font,cursor:"pointer"}}><option value="PVM">🐉 PVM</option><option value="PVP">🏆 PVP</option></select>
                  <div style={{background:char.frigost!=="Continent"?T.accentBg:T.surface2,border:"1px solid "+(char.frigost!=="Continent"?T.accentBorder:T.border2),borderRadius:7,padding:"5px 7px",fontSize:11,color:char.frigost!=="Continent"?T.accent:T.muted,fontWeight:600,whiteSpace:"nowrap"}}>{char.frigost!=="Continent"?`❄️ ${char.frigost==="Frigost 2"?"F2":char.frigost}`:"🌍"}</div>
                </div>
              </div>
            </div>
          );})}
        </div>)}
        <div style={{textAlign:"center",marginTop:10,color:T.muted,fontSize:9,letterSpacing:2}}>{filtered.length} PERSONNAGE{filtered.length!==1?"S":""} · SUPABASE ☁️</div>
      </div>
      {/* ── MODALS ── */}
      {showForm&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(8px)"}}>
        <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:16,padding:22,width:"100%",maxWidth:490,boxShadow:T.shadowLg,position:"relative",margin:16,maxHeight:"90vh",overflowY:"auto"}}>
          <button onClick={()=>setShowForm(false)} style={{position:"absolute",top:13,right:13,background:T.surface2,border:"1px solid "+T.border,color:T.muted,cursor:"pointer",borderRadius:6,padding:"3px 9px",fontFamily:T.font}}>✕</button>
          <h2 style={{margin:"0 0 16px",color:T.text,fontSize:15,fontWeight:700}}>{editingChar?"✏️ Modifier":"⚔️ Nouveau personnage"}</h2>
          <div style={{marginBottom:13}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:7,fontWeight:500}}>📁 Dossier</label><div style={{display:"flex",gap:7}}>{[{id:"PVM",icon:"🐉",color:T.pvm},{id:"PVP",icon:"🏆",color:T.pvp}].map(s=>(<button key={s.id} onClick={()=>setForm(p=>({...p,surcat:s.id}))} style={{flex:1,padding:"9px",borderRadius:9,border:"2px solid "+(form.surcat===s.id?s.color:T.border),background:form.surcat===s.id?s.color+"12":T.surface2,color:form.surcat===s.id?s.color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13,fontWeight:700}}>{s.icon} {s.id}</button>))}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{col:"1/-1",label:"Nom du compte",key:"compte",ph:"ex: MonCompte1"},{col:"1/-1",label:"Nom du personnage *",key:"nom",ph:"ex: Darkblade"}].map(f=>(<div key={f.key} style={{gridColumn:f.col}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>{f.label}</label><input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={fi}/></div>))}
            <div><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>Classe</label><select value={form.classe} onChange={e=>setForm(p=>({...p,classe:e.target.value}))} style={{...fi,cursor:"pointer"}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>État</label><select value={form.etat} onChange={e=>setForm(p=>({...p,etat:e.target.value}))} style={{...fi,cursor:"pointer"}}>{ETATS.map(e=><option key={e}>{e}</option>)}</select></div>
            <div><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>Level actuel</label><input type="number" min={1} max={200} value={form.level} onChange={e=>setForm(p=>({...p,level:parseInt(e.target.value)||1}))} style={fi}/></div>
            <div><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:5,fontWeight:500}}>Level max</label><input type="number" min={1} max={200} value={form.level_max} onChange={e=>setForm(p=>({...p,level_max:parseInt(e.target.value)||1}))} style={fi}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{display:"block",color:T.muted,fontSize:11,marginBottom:7,fontWeight:500}}>Zone</label>
              <div style={{display:"flex",gap:7,marginBottom:form.frigost!=="Continent"?8:0}}>
                <button onClick={()=>setForm(p=>({...p,frigost:"Continent"}))} style={{flex:1,padding:"8px",borderRadius:9,border:"2px solid "+(form.frigost==="Continent"?T.accent:T.border),background:form.frigost==="Continent"?T.accentBg:T.surface2,color:form.frigost==="Continent"?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:600}}>🌍 Continent</button>
                <button onClick={()=>setForm(p=>({...p,frigost:p.frigost==="Continent"?"Ben":p.frigost}))} style={{flex:1,padding:"8px",borderRadius:9,border:"2px solid "+(form.frigost!=="Continent"?T.accent:T.border),background:form.frigost!=="Continent"?T.accentBg:T.surface2,color:form.frigost!=="Continent"?T.accent:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:12,fontWeight:600}}>❄️ Frigost 2</button>
              </div>
              {form.frigost!=="Continent"&&(
                <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"9px 10px",background:T.accentBg,borderRadius:8,border:"1px solid "+T.accentBorder}}>
                  {["Ben","Obsi","Tengu","Korri","Kolloso","Glour","F3"].map(z=>(
                    <button key={z} onClick={()=>setForm(p=>({...p,frigost:z}))} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+(form.frigost===z?T.accent:T.accentBorder),background:form.frigost===z?T.accent:T.surface,color:form.frigost===z?"#fff":T.accent,cursor:"pointer",fontFamily:T.font,fontSize:11,fontWeight:form.frigost===z?700:500,transition:"all 0.15s"}}>{z}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",gap:7,marginTop:16}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font,fontSize:13}}>Annuler</button>
            <button onClick={handleSubmit} style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:T.accent,color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font,fontSize:13}}>{editingChar?"Sauvegarder":"Ajouter"}</button>
          </div>
        </div>
      </div>)}
      {deleteConfirm&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(8px)"}}><div style={{background:T.surface,border:"1px solid rgba(239,68,68,0.3)",borderRadius:15,padding:22,maxWidth:310,textAlign:"center",margin:16,boxShadow:T.shadowLg}}><div style={{fontSize:26,marginBottom:7}}>💀</div><h3 style={{color:T.danger,margin:"0 0 5px",fontFamily:T.font}}>Supprimer ce personnage ?</h3><p style={{color:T.muted,margin:"0 0 16px",fontSize:12}}>Action irréversible.</p><div style={{display:"flex",gap:7}}><button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"9px",borderRadius:9,border:"1px solid "+T.border,background:"transparent",color:T.muted,cursor:"pointer",fontFamily:T.font}}>Annuler</button><button onClick={()=>handleDelete(deleteConfirm)} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:"#dc2626",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:T.font}}>Supprimer</button></div></div></div>)}
      {toast&&(<div style={{position:"fixed",bottom:20,right:20,background:toast.type==="err"?"#dc2626":T.accent,color:"#fff",padding:"9px 15px",borderRadius:9,fontWeight:700,fontSize:13,boxShadow:T.shadowLg,zIndex:200,fontFamily:T.font}}>{toast.type==="err"?"❌":"✅"} {toast.msg}</div>)}
    </div>
  );
}
