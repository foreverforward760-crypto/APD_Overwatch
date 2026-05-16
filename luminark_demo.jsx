import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  navy:"#0D1F35", navy2:"#152E4D", navy3:"#1E3F6A",
  gold:"#C8960C", goldlt:"#FDF3D8",
  red:"#8B1A1A", redlt:"#FDECEA", redmed:"#C0392B",
  green:"#1A5C2A", greenlt:"#D6F7DD", greenmed:"#27AE60",
  teal:"#0E6674", teallt:"#D0EEF2",
  orange:"#B85C00", orangelt:"#FEF0E0",
  purple:"#4A1A7A", purplelt:"#EDE0FC",
  gray0:"#F7F6F2", gray1:"#EEECE6", gray2:"#D8D5CC",
  text:"#1A1814", text2:"#4A4640", text3:"#7A7570", white:"#FFFFFF",
};

// ─── STAGES (condensed for demo) ────────────────────────────────────────────
const STAGES = [
  { id:0, name:"The Honeymoon",             color:"#2D7DD2", bg:"#E8F2FC", tension:1,  symbol:"⚫", phase:"0", controlPoint:false,
    familyDesc:"Your loved one is settling in. Things may feel unusually smooth — that's normal and temporary.",
    staffBrief:"Maximum creative potential. The relationship hasn't formed yet — everything is still in superposition.",
    actionPrompt:"Build the relationship now. Be consistent, predictable, honest. This window closes.",
    trapWarning:"Assuming the Honeymoon is the baseline. The Hard Stretch is coming." },
  { id:1, name:"Finding Their Footing",      color:"#3A7D44", bg:"#E8F5EB", tension:3,  symbol:"✨", phase:"I", controlPoint:false,
    familyDesc:"Your loved one is starting to show more of their real personality — a sign they feel safe enough to be themselves.",
    staffBrief:"First differentiation. Small boundary tests. The resident is gathering data about this environment.",
    actionPrompt:"Hold your boundaries warmly and consistently. They need to know the structure is real.",
    trapWarning:"Treating early testing as a behavior problem rather than a trust-building communication." },
  { id:2, name:"Showing Their Colors",       color:"#C67F12", bg:"#FDF0DC", tension:5,  symbol:"☯", phase:"I", controlPoint:false,
    familyDesc:"You may be hearing about both good and challenging moments. This means they're comfortable enough to show all of who they are.",
    staffBrief:"Both poles visible. Cooperative and challenging sides are now measured. This is healthy.",
    actionPrompt:"Accept the whole person. Respond to both sides with the same steady presence.",
    trapWarning:"Trying to fix the difficult side while only rewarding the compliant side." },
  { id:3, name:"The Hard Stretch",           color:"#B93232", bg:"#FDEAEA", tension:8,  symbol:"🔺", phase:"I", controlPoint:true,
    familyDesc:"This is the hardest part of the journey, and it is normal. Your consistency and patience matter more now than ever.",
    staffBrief:"First major control point. The triad under maximum stress. Decisions here determine the entire trajectory.",
    actionPrompt:"Do not abandon the relationship. Update the BA plan. Request support. What you do here is the resident's evidence that they are worth staying for.",
    trapWarning:"Recommending placement change as the first response. Most residents who cycle through multiple homes are discharged at Stage 3." },
  { id:4, name:"The Turning Point",          color:"#2E8B57", bg:"#E0F4E8", tension:6,  symbol:"⬛", phase:"II", controlPoint:false,
    familyDesc:"The hard part has eased. Your loved one is settling into real rhythms — genuine progress built on real trust.",
    staffBrief:"The structure held. The resident now builds on that proof. Deepest emotional processing of the cycle is underway.",
    actionPrompt:"Don't coast. Reinforce what worked. Deepen the relationship. Update the IB plan now.",
    trapWarning:"Treating the calmer behavior as case closed and reducing staff attention." },
  { id:5, name:"Finding Their Groove \xb7 Hidden Duality", color:"#1A7A4A", bg:"#D6F7DD", tension:4,  symbol:"⭐", phase:"II", controlPoint:false,
    familyDesc:"Your loved one is doing well. This is the moment to dream bigger together — ask them what they want their life to look like.",
    staffBrief:"Bilateral threshold. Three outcomes: advance, retreat, or freeze. Do not reduce support here.",
    actionPrompt:"Have honest conversations about the future. Involve them in planning. Watch for small regressions — signals from the hidden duality.",
    trapWarning:"Declaring the resident stable and reducing support. This is the most common cause of Stage 7 regression." },
  { id:6, name:"Living Well Here",           color:"#5C7A1A", bg:"#EBF7D6", tension:2,  symbol:"🔶", phase:"II", controlPoint:true,
    familyDesc:"Your loved one is genuinely thriving. Use this time to start talking about bigger goals and more independence.",
    staffBrief:"Peak triadic coherence. Maximum efficiency — but the hexagon's walls are at minimum thickness.",
    actionPrompt:"Celebrate genuinely. Begin transition planning. This is a launching pad, not a landing pad.",
    trapWarning:"Institutionalizing the resident at their peak — making the group home permanent because everyone is comfortable." },
  { id:7, name:"Stuck In Place",             color:"#9A2A2A", bg:"#FDECEA", tension:9,  symbol:"🌀", phase:"III", controlPoint:false,
    familyDesc:"Your loved one is going through a hard stretch again. This doesn't mean progress was lost — the next layer of growth is being worked through.",
    staffBrief:"Crisis of transformation. The old triad breaks apart. High wisdom potential lives inside Stage 7 if the team can extract it.",
    actionPrompt:"Call an emergency team meeting. Review the entire plan with fresh eyes. Ask the resident: what do you need that you're not getting?",
    trapWarning:"Interpreting Stage 7 as proof the resident has hit their ceiling and reducing expectations permanently." },
  { id:8, name:"The Illusion Trap",          color:"#6B0000", bg:"#F5D5D5", tension:10, symbol:"\u221e", phase:"III", controlPoint:false,
    familyDesc:"Your loved one may seem stable but stable is not the same as thriving. If you haven't heard about new goals in a while — ask. You can request an IB review at any time.",
    staffBrief:"Perceived Permanence. The observer has stopped truly observing. The Quantum Zeno effect — measured too frequently the same way, the system freezes.",
    actionPrompt:"MANDATORY: If a resident has been at Stage 8 for 90+ days without an IB review — escalate immediately. A new observer is required.",
    trapWarning:"This IS the trap. Every feature of this platform exists partly to prevent residents from disappearing into Stage 8 undetected." },
  { id:9, name:"Ready To Fly",              color:"#0D5C2E", bg:"#C8F0D8", tension:1,  symbol:"🕊", phase:"III", controlPoint:true,
    familyDesc:"Your loved one is ready for the next chapter. This is what all the hard work was for.",
    staffBrief:"The triad dissolves into legacy. Integration and readiness for the next level. The cycle completes.",
    actionPrompt:"Begin LRE transition planning immediately. Involve the resident fully. Document everything so the next team receives them as a full person.",
    trapWarning:"The system's attachment — staff who don't want to lose a good resident. Every month a Stage 9 resident waits is a month of potential they are not living." },
];

// ─── KAIROS NSDT CLASSIFIER ──────────────────────────────────────────────────
const CENTROIDS = [
  [0,0,0,0,0],[1,8,1,1,1],[2,7,2,2,2],[4,7,2.5,3,4],
  [3.5,6.5,3,3.5,5],[5,4,5,5,4.5],[6,5.5,4,6,6.5],
  [6.5,3,7,7,3.5],[7.5,7,8,2,2],[8,2,8.5,1.5,1.5],
];
const WEIGHTS = [1.0,1.5,1.5,1.0,0.8];

function classify(nsdt) {
  const dists = CENTROIDS.map(c => {
    let s = 0;
    for (let i=0; i<5; i++) { const d=(nsdt[i]-c[i])/10; s+=WEIGHTS[i]*d*d; }
    return Math.sqrt(s);
  });
  const logits = dists.map(d => -d);
  const mx = Math.max(...logits);
  const exps = logits.map(l => Math.exp((l-mx)/0.7));
  const tot = exps.reduce((a,b)=>a+b,0);
  const post = exps.map(e=>e/tot);
  const dom = post.indexOf(Math.max(...post));
  const trap = dom===8 ? Math.min(1,(1/(dists[8]+0.01))*1.45) : Math.min(1,1/(dists[8]+0.01));
  const bif = post[5]>0.25 || (dom===5 && -post.reduce((s,p)=>s+(p>1e-9?p*Math.log(p):0),0)>0.8);
  return { dom, post, trap, bif, dist:dists };
}

// ─── SENTINEL KEYWORDS ───────────────────────────────────────────────────────
const FLAG_WORDS = ["hit","fell","refused","screamed","kicked","injured","hurt","aggressive",
  "bleeding","seizure","fight","bite","struck","choked","threw","push","shove","elopement",
  "missing","wandered","restraint","minor touch","small incident","slight contact"];

const MINIMIZE_PATTERNS = [
  { re:/minor\s+touch/i,       msg:"\"minor touch\" may minimize physical contact — describe exact body parts and force level" },
  { re:/small\s+incident/i,    msg:"\"small incident\" is vague — describe what actually happened in specific terms" },
  { re:/slight\s+contact/i,    msg:"\"slight contact\" may understate — document exactly what occurred" },
  { re:/was\s+aggressive/i,    msg:"\"was aggressive\" is too vague — write the specific behaviors (hit, kicked, threw, etc.)" },
  { re:/expressed frustration/i, msg:"\"expressed frustration\" may minimize — describe the actual behavior, not your interpretation" },
  { re:/had an episode/i,      msg:"\"had an episode\" is not documentable — describe exactly what the resident did" },
];

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────
const S = {
  card: { background:C.white, borderRadius:14, border:`1px solid ${C.gray1}`, overflow:"hidden" },
  btn: (v="primary", sm=false) => ({
    padding: sm ? "6px 14px" : "10px 20px",
    borderRadius: 9, cursor:"pointer", fontFamily:"inherit",
    fontSize: sm ? 11 : 13, fontWeight:700, border:"none",
    background: v==="gold"?C.gold:v==="red"?C.redmed:v==="green"?C.greenmed:v==="ghost"?"transparent":v==="teal"?C.teal:v==="purple"?C.purple:C.navy,
    color: v==="ghost"?C.text3:C.white,
    border: v==="ghost"?`1px solid ${C.gray2}`:"none",
  }),
};

function Tag({label, color=C.navy, bg=C.gray1}) {
  return <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:700, color, background:bg, border:`1px solid ${color}22` }}>{label}</span>;
}

function Hdr({title, sub, dark}) {
  return (
    <div style={{ padding:"13px 18px", background:dark?`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`:C.gray0, borderBottom:`1px solid ${C.gray1}` }}>
      <div style={{ fontWeight:800, fontSize:15, color:dark?C.white:C.navy, fontFamily:"Georgia,serif" }}>{title}</div>
      {sub && <div style={{ fontSize:11, color:dark?"#8fb3d4":C.text3, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

// ─── PORTAL SELECTOR ─────────────────────────────────────────────────────────
function PortalSelect({onSelect}) {
  const [hover, setHover] = useState(null);
  const portals = [
    { id:"staff",  icon:"🏥", label:"Staff Portal",           sub:"DSP clock-in · Any house · Any shift",   color:C.navy   },
    { id:"nsdt",   icon:"✦",  label:"NSDT Live Observer",      sub:"Kairos behavioral classifier · Live demo", color:C.teal   },
    { id:"stage",  icon:"🧭", label:"SAP Stage Intelligence",   sub:"10-stage behavioral framework · All stages",color:C.purple },
    { id:"sentinel",icon:"🔬", label:"AI Sentinel Demo",        sub:"Incident language analysis · Try it live", color:C.red    },
    { id:"invest", icon:"📊", label:"Investor Overview",        sub:"Business case · Compliance fortress",     color:C.gold   },
  ];
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.navy} 0%,#0A1628 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:480 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:64, height:64, background:C.gold, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:32, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>L</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.white, fontFamily:"Georgia,serif", marginBottom:4 }}>LUMINARK APD OVERWATCH</div>
          <div style={{ fontSize:12, color:"#5A7A9A" }}>Meridian Axiom Alignment Technologies · Interactive Demo</div>
        </div>
        <div style={{ display:"grid", gap:10 }}>
          {portals.map(p => (
            <div key={p.id} onClick={()=>onSelect(p.id)}
              onMouseEnter={()=>setHover(p.id)} onMouseLeave={()=>setHover(null)}
              style={{ padding:"16px 20px", background:hover===p.id?"rgba(255,255,255,.09)":"rgba(255,255,255,.05)", borderRadius:14, cursor:"pointer",
                border:`2px solid ${hover===p.id?p.color:"rgba(255,255,255,.08)"}`, display:"flex", gap:14, alignItems:"center", transition:"all .15s" }}>
              <div style={{ width:44, height:44, background:`${p.color}22`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:14, color:C.white }}>{p.label}</div>
                <div style={{ fontSize:12, color:"#5A7A9A", marginTop:2 }}>{p.sub}</div>
              </div>
              <div style={{ marginLeft:"auto", color:"rgba(255,255,255,.2)", fontSize:18 }}>›</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#3A5A7A" }}>Full production app: github.com/foreverforward760-crypto/APD_Overwatch</div>
      </div>
    </div>
  );
}

// ─── STAFF PORTAL DEMO ───────────────────────────────────────────────────────
function StaffDemo({onBack}) {
  const residents = [
    { id:"R001", name:"Marcus Dubois",    photo:"👨🏾", stage:8, home:"Home A", dob:"1985-03-12", age:40, dnr:false, seizureHistory:true, dietaryTexture:"Regular", allergies:["Penicillin"], diagnosis:["Autism Level 2","PTSD"], ba:"Dr. Sarah Powell, BCBA" },
    { id:"R003", name:"Angela Mercado",   photo:"👩🏽", stage:5, home:"Home A", dob:"1990-07-22", age:35, dnr:false, seizureHistory:false, dietaryTexture:"Regular", allergies:[], diagnosis:["Bipolar I","Intellectual Disability"], ba:"Dr. Sarah Powell, BCBA" },
    { id:"R005", name:"Lydia Fontaine",   photo:"👩🏻", stage:0, home:"Home A", dob:"2001-02-14", age:24, dnr:false, seizureHistory:false, dietaryTexture:"Ground (choking risk)", allergies:["Sulfa drugs"], diagnosis:["Autism Level 1","Anxiety"], ba:"Tanya Williams, BCaBA" },
  ];
  const [selected, setSelected] = useState(residents[0]);
  const [tab, setTab] = useState("facesheet");
  const s = STAGES[selected.stage];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 100%)`, padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:C.gold, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, color:C.navy, fontFamily:"Georgia,serif" }}>L</div>
          <div>
            <div style={{ fontWeight:800, fontSize:13, color:C.white, fontFamily:"Georgia,serif" }}>LUMINARK APD OVERWATCH</div>
            <div style={{ fontSize:10, color:"#7aA4C4" }}>Staff Portal · Home A · Maria Thompson · Active Shift</div>
          </div>
        </div>
        <button onClick={onBack} style={S.btn("ghost",true)}>← Back</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"160px 1fr", minHeight:"calc(100vh - 54px)" }}>
        <div style={{ background:C.navy2, padding:"12px 0" }}>
          {residents.map(r => {
            const rs = STAGES[r.stage];
            return (
              <div key={r.id} onClick={()=>setSelected(r)}
                style={{ padding:"9px 14px", cursor:"pointer", display:"flex", gap:8, alignItems:"center",
                  background:selected.id===r.id?"rgba(200,150,12,.1)":"transparent",
                  borderLeft:selected.id===r.id?`3px solid ${C.gold}`:"3px solid transparent" }}>
                <span style={{fontSize:22}}>{r.photo}</span>
                <div><div style={{ fontSize:11, fontWeight:700, color:selected.id===r.id?C.gold:C.white }}>{r.name.split(" ")[0]}</div><div style={{ fontSize:10, color:rs.color, fontWeight:600 }}>{rs.symbol} S{r.stage}</div></div>
              </div>
            );
          })}
          <div style={{ borderTop:`1px solid ${C.navy3}`, marginTop:12, padding:"12px 14px 0" }}>
            {[["facesheet","📋","Face Sheet"],["stage","🧭","Stage Intel"],["meds","💊","Meds"],["pcm","🤝","Crisis"]].map(([id,icon,lbl])=>(
              <div key={id} onClick={()=>setTab(id)} style={{ padding:"8px 10px", cursor:"pointer", borderRadius:8, fontSize:11, fontWeight:tab===id?700:400,
                color:tab===id?C.gold:"#9ab8d4", background:tab===id?"rgba(200,150,12,.1)":"transparent", marginBottom:4, display:"flex", gap:6, alignItems:"center" }}>
                <span>{icon}</span><span>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:20, overflowY:"auto" }}>
          {/* Resident header */}
          <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${s.color}18 0%,${s.bg} 100%)`, borderRadius:14, border:`2px solid ${s.color}33`, marginBottom:14, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ fontSize:56, lineHeight:1, background:s.bg, borderRadius:12, padding:"6px 10px", border:`2px solid ${s.color}33` }}>{selected.photo}</div>
            <div style={{flex:1}}>
              <div style={{ fontSize:20, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>{selected.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                <Tag label={`${s.symbol} S${selected.stage}: ${s.name}`} color={s.color} bg={`${s.color}18`}/>
                <Tag label={`Age ${selected.age}`} color={C.text2} bg={C.gray0}/>
                <Tag label={selected.dietaryTexture} color={selected.dietaryTexture.includes("Ground")?C.red:C.teal} bg={selected.dietaryTexture.includes("Ground")?C.redlt:C.teallt}/>
                {selected.seizureHistory && <Tag label="⚡ Seizure Hx" color={C.white} bg={C.red}/>}
                {selected.dnr && <Tag label="DNR ON FILE" color={C.white} bg="#4A0000"/>}
                {selected.allergies.map(a=><Tag key={a} label={`⚠ ${a}`} color={C.white} bg={C.redmed}/>)}
              </div>
            </div>
          </div>

          {tab==="facesheet" && (
            <div style={{ display:"grid", gap:12 }}>
              <div style={S.card}>
                <Hdr title="Clinical Information"/>
                <div style={{ padding:16, display:"grid", gap:6 }}>
                  {[["Diagnosis",selected.diagnosis.join(", ")],["Behavior Analyst",selected.ba],["Date of Birth",`${selected.dob} (Age ${selected.age})`],["Home","Home A · (727) 555-0101"]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:`1px solid ${C.gray1}` }}>
                      <span style={{ color:C.text3, fontWeight:600 }}>{l}</span>
                      <span style={{ color:C.text, textAlign:"right", maxWidth:"60%" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selected.seizureHistory && (
                <div style={{ ...S.card, border:`2px solid ${C.red}` }}>
                  <div style={{ padding:"10px 16px", background:C.red }}>
                    <div style={{ fontWeight:800, color:C.white, fontSize:13 }}>⚡ SEIZURE ACTION PLAN — ACTIVE</div>
                  </div>
                  <div style={{ padding:14, display:"grid", gap:8 }}>
                    {[["0–3 min","Stay with resident. Clear area. Time the seizure. Do NOT restrain. Call supervisor."],
                      ["3 min mark","Call 911 immediately. Continue timing. Position on side if possible."],
                      ["5+ min","Administer Diastat per physician order if available. Provide rescue breathing if needed."]].map(([t,d])=>(
                      <div key={t} style={{ padding:"10px 12px", background:C.redlt, borderRadius:9, display:"flex", gap:12 }}>
                        <span style={{ fontSize:11, fontWeight:800, color:C.red, width:70, flexShrink:0 }}>{t}</span>
                        <span style={{ fontSize:12, color:C.text }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==="stage" && (
            <div style={{ ...S.card }}>
              <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${s.color}20 0%,${s.bg} 100%)`, borderBottom:`2px solid ${s.color}33` }}>
                <div style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>S{selected.stage} · {s.symbol} · Phase {s.phase} {s.controlPoint?"· ⭐ Control Point":""}</div>
                <div style={{ fontSize:18, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>{s.name}</div>
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <Tag label={`Tension ${s.tension}/10`} color={s.tension>=8?C.white:C.text} bg={s.tension>=8?C.red:s.tension>=5?C.orange:C.greenlt}/>
                  {s.controlPoint && <Tag label="⭐ SAP 3-6-9 Control Point" color={C.white} bg={C.gold}/>}
                </div>
              </div>
              <div style={{ padding:16, display:"grid", gap:10 }}>
                <div style={{ padding:"12px 14px", background:s.bg, borderRadius:10, borderLeft:`4px solid ${s.color}`, fontSize:13, color:C.text, lineHeight:1.8 }}>{s.staffBrief}</div>
                <div style={{ padding:"12px 14px", background:C.goldlt, borderRadius:10, borderLeft:`4px solid ${C.gold}` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>✦ Action Right Now</div>
                  <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{s.actionPrompt}</div>
                </div>
                <div style={{ padding:"12px 14px", background:C.redlt, borderRadius:10, borderLeft:`4px solid ${C.redmed}` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>⚠ The Stage {selected.stage} Trap</div>
                  <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{s.trapWarning}</div>
                </div>
                <div style={{ padding:"10px 14px", background:"#0A1628", borderRadius:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#C8A020", textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>✦ Family Message</div>
                  <div style={{ fontSize:12, color:"#8AAABB", lineHeight:1.8 }}>{s.familyDesc}</div>
                </div>
              </div>
            </div>
          )}

          {tab==="meds" && (
            <div style={S.card}>
              <Hdr title="Medication Administration — Demo" sub="Three-way match: Right Resident · Right Med · Right Time" dark/>
              <div style={{ padding:16, display:"grid", gap:10 }}>
                {[{name:"Risperidone 1mg",time:"8:00 AM",given:true,type:"routine"},{name:"Sertraline 50mg",time:"8:00 AM",given:true,type:"routine"},{name:"Lorazepam 0.5mg",time:"PRN",given:false,type:"controlled"}].map(m=>(
                  <div key={m.name} style={{ padding:"12px 14px", background:m.given?C.greenlt:m.type==="controlled"?C.redlt:C.gray0, borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center", border:`2px solid ${m.given?C.greenmed:m.type==="controlled"?C.redmed:C.gray2}` }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{m.name}</div>
                      <div style={{ fontSize:11, color:C.text3 }}>{m.time} {m.type==="controlled"?"· 🔐 Controlled — dual witness required":""}</div>
                    </div>
                    <div>{m.given ? <Tag label="✓ Given" color={C.greenmed} bg={C.greenlt}/> : <button style={S.btn("green",true)}>Administer</button>}</div>
                  </div>
                ))}
                <div style={{ padding:"10px 14px", background:C.goldlt, borderRadius:9, fontSize:11, color:C.gold, fontWeight:600 }}>
                  ✦ In the full app: barcode scan verification, PRN 30-min effectiveness follow-up timer, controlled substance dual-PIN witness, destruction log (Form 65G-7.007A)
                </div>
              </div>
            </div>
          )}

          {tab==="pcm" && (
            <div style={{ display:"grid", gap:12 }}>
              <div style={{ ...S.card, border:`2px solid ${C.greenmed}33` }}>
                <div style={{ padding:"12px 16px", background:`linear-gradient(135deg,${C.green} 0%,#1A7A2E 100%)` }}>
                  <div style={{ fontWeight:800, color:C.white, fontSize:13 }}>✅ Approved PCM Techniques — {selected.name.split(" ")[0]}</div>
                </div>
                <div style={{ padding:14, display:"grid", gap:8 }}>
                  {["Verbal redirection — calm, flat tone, no questions","Personal space / step back at least 6 feet","Offer preferred item as redirect","Supportive coaching: name the feeling out loud"].map((item,i)=>(
                    <div key={i} style={{ padding:"9px 12px", background:C.greenlt, borderRadius:9, fontSize:12, color:C.green, fontWeight:600, display:"flex", gap:8 }}>
                      <span>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...S.card, border:`2px solid ${C.red}` }}>
                <div style={{ padding:"12px 16px", background:C.red }}>
                  <div style={{ fontWeight:800, color:C.white, fontSize:13 }}>🚫 PROHIBITED — Civil Rights & APD Reportable</div>
                </div>
                <div style={{ padding:14, display:"grid", gap:8 }}>
                  {["Prone (face-down) restraint","Any hold involving neck, head, or hair","Removing AAC device as consequence","Shouting or threatening language"].map((item,i)=>(
                    <div key={i} style={{ padding:"9px 12px", background:C.redlt, borderRadius:9, fontSize:12, color:C.red, fontWeight:700, display:"flex", gap:8 }}>
                      <span>⛔</span>{item}
                    </div>
                  ))}
                  <div style={{ padding:"9px 12px", background:"#1A1814", borderRadius:9, fontSize:11, color:"#FFB3B3", fontWeight:600 }}>
                    If anyone instructs you to use a prohibited procedure — refuse and report: 1-800-962-2873 (24/7 anonymous)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NSDT LIVE DEMO ───────────────────────────────────────────────────────────
function NSDTDemo({onBack}) {
  const AXES = [
    {id:"N",label:"Behavioral Complexity",q:"How many different, shifting behaviors right now?",sci:"Shannon entropy"},
    {id:"S",label:"Baseline Stability",q:"How steady and consistent is their baseline?",sci:"Homeostatic stability (Bernard 1865)"},
    {id:"D",label:"Distress / Tension",q:"How much active distress or agitation is present?",sci:"Allostatic load (McEwen & Stellar 1993)"},
    {id:"T",label:"Adaptability",q:"How readily do they adjust when routines change?",sci:"Behavioral flexibility (Luria 1966)"},
    {id:"C",label:"Behavioral Coherence",q:"How consistent is their behavior across settings today?",sci:"Neural coherence (Varela et al. 2001)"},
  ];
  const [vals, setVals] = useState([5,5,5,5,5]);
  const result = classify(vals);
  const s = STAGES[result.dom];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.navy} 100%)`, padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>✦ NSDT Live Observer — Kairos Engine</div>
        <button onClick={onBack} style={S.btn("ghost",true)}>← Back</button>
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <div style={{ ...S.card, marginBottom:16 }}>
            <Hdr title="Five-Axis Observation" sub="Rate what you observe right now — 0 to 10" dark/>
            <div style={{ padding:16, display:"grid", gap:14 }}>
              {AXES.map((ax, i) => (
                <div key={ax.id}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <div>
                      <span style={{ fontSize:12, fontWeight:800, color:C.navy }}>{ax.id}: {ax.label}</span>
                      <div style={{ fontSize:11, color:C.text3 }}>{ax.q}</div>
                    </div>
                    <span style={{ fontSize:18, fontWeight:800, color:C.teal }}>{vals[i]}</span>
                  </div>
                  <input type="range" min="0" max="10" step="0.5" value={vals[i]}
                    onChange={e => setVals(v => { const n=[...v]; n[i]=parseFloat(e.target.value); return n; })}
                    style={{ width:"100%", accentColor:C.teal }}/>
                  <div style={{ fontSize:10, color:C.text3, fontStyle:"italic" }}>Scientific basis: {ax.sci}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"10px 14px", background:"#0A1628", borderRadius:10, fontSize:11, color:"#5A7A9A", lineHeight:1.7 }}>
            <span style={{ color:"#C8A020", fontWeight:700 }}>Methodology: </span>
            Weighted Euclidean distance classifier identical to Kairos engine (LASE v1.1). Weights: N×1.0, S×1.5, D×1.5, T×1.0, C×0.8. Softmax temperature: 0.7. Stage 8 TrapScore amplifier: 1.45×.
            This is observational pattern classification, not clinical diagnosis.
          </div>
        </div>
        <div style={{ display:"grid", gap:14 }}>
          <div style={{ ...S.card, border:`3px solid ${s.color}` }}>
            <div style={{ padding:"16px 18px", background:`linear-gradient(135deg,${s.color}20 0%,${s.bg} 100%)` }}>
              <div style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>Live Classification · {(Math.max(...result.post)*100).toFixed(0)}% Confidence</div>
              <div style={{ fontSize:24, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>{s.symbol} S{result.dom}: {s.name}</div>
              <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                {result.bif && <Tag label="⭐ Bifurcation Active" color={C.white} bg={C.gold}/>}
                {result.trap > 0.6 && <Tag label={`⚠ TrapScore ${result.trap.toFixed(2)}`} color={C.white} bg={C.red}/>}
                <Tag label={`Tension ${s.tension}/10`} color={s.tension>=8?C.white:C.text} bg={s.tension>=8?C.red:s.tension>=5?C.orange:C.greenlt}/>
              </div>
            </div>
            <div style={{ padding:"12px 16px", fontSize:13, color:C.text, lineHeight:1.8, borderBottom:`1px solid ${C.gray1}` }}>{s.staffBrief}</div>
            <div style={{ padding:"10px 16px", background:C.goldlt, fontSize:12, color:C.text, lineHeight:1.7 }}>
              <strong style={{ color:C.gold }}>Action: </strong>{s.actionPrompt}
            </div>
          </div>
          <div style={S.card}>
            <Hdr title="Stage Posterior Distribution"/>
            <div style={{ padding:"10px 14px", display:"grid", gap:4 }}>
              {result.post.map((p,i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:STAGES[i].color, width:120, flexShrink:0 }}>S{i} {STAGES[i].name.split(" ").slice(0,2).join(" ")}</span>
                  <div style={{ flex:1, height:6, background:C.gray2, borderRadius:3 }}>
                    <div style={{ height:6, borderRadius:3, background:i===result.dom?STAGES[i].color:`${STAGES[i].color}55`, width:`${(p*100).toFixed(1)}%`, transition:"width .3s" }}/>
                  </div>
                  <span style={{ fontSize:10, fontWeight:i===result.dom?800:400, color:i===result.dom?STAGES[i].color:C.text3, width:32, textAlign:"right" }}>{(p*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SAP STAGE EXPLORER ───────────────────────────────────────────────────────
function StageExplorer({onBack}) {
  const [sel, setSel] = useState(3);
  const s = STAGES[sel];
  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${C.purple} 0%,#2D0F5A 100%)`, padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>🧭 SAP Stage Intelligence — All 10 Stages</div>
        <button onClick={onBack} style={S.btn("ghost",true)}>← Back</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100vh - 54px)" }}>
        <div style={{ background:C.navy2, padding:"12px 0" }}>
          {STAGES.map(st => (
            <div key={st.id} onClick={()=>setSel(st.id)}
              style={{ padding:"9px 14px", cursor:"pointer", display:"flex", gap:8, alignItems:"center",
                background:sel===st.id?"rgba(200,150,12,.1)":"transparent",
                borderLeft:sel===st.id?`3px solid ${C.gold}`:"3px solid transparent" }}>
              <span style={{ fontSize:20 }}>{st.symbol}</span>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:sel===st.id?C.gold:C.white }}>S{st.id}: {st.name.split(" ").slice(0,3).join(" ")}</div>
                <div style={{ fontSize:10, color:st.color, fontWeight:600 }}>Tension {st.tension}/10 {st.controlPoint?"· ⭐":""}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:24, overflowY:"auto" }}>
          <div style={{ ...S.card, border:`2px solid ${s.color}44` }}>
            <div style={{ padding:"18px 22px", background:`linear-gradient(135deg,${s.color}15 0%,${s.bg} 100%)`, borderBottom:`2px solid ${s.color}33` }}>
              <div style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>Stage {sel} · Phase {s.phase} · {s.symbol}</div>
              <div style={{ fontSize:26, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif", marginBottom:10 }}>{s.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Tag label={`Tension ${s.tension}/10`} color={s.tension>=8?C.white:C.text} bg={s.tension>=8?C.red:s.tension>=5?C.orange:C.greenlt}/>
                {s.controlPoint && <Tag label="⭐ SAP 3-6-9 Control Point" color={C.white} bg={C.gold}/>}
                <Tag label={`Phase ${s.phase}: ${s.phase==="0"?"Originating Void":s.phase==="I"?"Emergence":s.phase==="II"?"Consolidation":"Transcendence"}`} color={C.navy} bg={C.gray1}/>
              </div>
            </div>
            <div style={{ padding:20, display:"grid", gap:14 }}>
              <div style={{ padding:"14px 16px", background:s.bg, borderRadius:12, borderLeft:`4px solid ${s.color}` }}>
                <div style={{ fontSize:10, fontWeight:800, color:s.color, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Staff Reality</div>
                <div style={{ fontSize:14, color:C.text, lineHeight:1.9 }}>{s.staffBrief}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div style={{ padding:"14px 16px", background:C.goldlt, borderRadius:12, borderLeft:`4px solid ${C.gold}` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>✦ What To Do</div>
                  <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{s.actionPrompt}</div>
                </div>
                <div style={{ padding:"14px 16px", background:C.redlt, borderRadius:12, borderLeft:`4px solid ${C.redmed}` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>⚠ The Trap</div>
                  <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{s.trapWarning}</div>
                </div>
              </div>
              <div style={{ padding:"14px 16px", background:"#0A1628", borderRadius:12 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#C8A020", textTransform:"uppercase", letterSpacing:.8, marginBottom:6 }}>Family Message</div>
                <div style={{ fontSize:13, color:"#8AAABB", lineHeight:1.8 }}>{s.familyDesc}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:4 }}>
                {STAGES.map(st => (
                  <div key={st.id} onClick={()=>setSel(st.id)} style={{ padding:"8px 4px", borderRadius:9, textAlign:"center", cursor:"pointer",
                    background:sel===st.id?st.color:`${st.color}15`, border:`2px solid ${sel===st.id?st.color:`${st.color}33`}` }}>
                    <div style={{ fontSize:16 }}>{st.symbol}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:sel===st.id?C.white:st.color }}>S{st.id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SENTINEL DEMO ────────────────────────────────────────────────────────────
function SentinelDemo({onBack}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyze = () => {
    if (text.length < 20) return;
    const found = FLAG_WORDS.filter(w => text.toLowerCase().includes(w));
    const minimize = MINIMIZE_PATTERNS.filter(p => p.re.test(text));
    const missing = [];
    if (!text.toLowerCase().includes("before") && !text.toLowerCase().includes("trigger") && !text.toLowerCase().includes("prior")) missing.push("Missing: what happened right before (the trigger)");
    if (!text.match(/\d+\s*(min|second|hour)/)) missing.push("Missing: time duration of the behavior");
    if (!text.toLowerCase().includes("staff") && !text.toLowerCase().includes("i ") && !text.toLowerCase().includes("we ")) missing.push("Missing: how staff responded");
    const severity = minimize.length > 0 ? "flag" : found.length > 0 ? "warning" : missing.length >= 2 ? "warning" : "clean";
    setResult({ severity, found, minimize, missing });
  };

  const examples = [
    ["Minor incident", "There was a minor incident today. Marcus had a small episode and staff handled it. Everything is fine now."],
    ["Properly documented", "At 2:14 PM, prior to medication administration, Marcus began rocking rapidly and covering his ears (trigger: TV volume increased). He picked up a plastic cup and threw it toward the wall — it did not contact anyone. Staff immediately reduced TV volume and offered headphones. Behavior de-escalated within 4 minutes. Supervisor notified at 2:22 PM."],
    ["Trigger words", "Marcus hit staff member on the arm when asked to transition from the TV room. He also kicked the door twice."],
  ];

  const cfg = result ? {
    clean:   { bg:C.greenlt,  col:C.greenmed, label:"✓ Language Approved — Ready to Submit" },
    warning: { bg:C.goldlt,   col:C.gold,     label:"⚠ Review Suggested Before Submitting"  },
    flag:    { bg:C.redlt,    col:C.red,       label:"🚨 Sentinel Flag — Revision Required"  },
  }[result.severity] : null;

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${C.red} 0%,${C.redmed} 100%)`, padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>🔬 AI Sentinel — Incident Language Analysis</div>
        <button onClick={onBack} style={S.btn("ghost",true)}>← Back</button>
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <div style={S.card}>
            <Hdr title="Try the Sentinel" sub="Type or paste an incident report draft" dark/>
            <div style={{ padding:16 }}>
              <textarea value={text} onChange={e=>{setText(e.target.value); setResult(null);}} rows={8} placeholder="Write an incident report draft here... Try phrases like 'minor touch', 'small incident', or write a properly documented report."
                style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }}/>
              <button onClick={analyze} style={{ ...S.btn("red"), width:"100%", marginTop:10 }}>🔬 Run Sentinel Analysis</button>
            </div>
          </div>
          <div style={{ ...S.card, marginTop:16 }}>
            <Hdr title="Try These Examples"/>
            <div style={{ padding:14, display:"grid", gap:8 }}>
              {examples.map(([label, ex])=>(
                <button key={label} onClick={()=>{setText(ex); setResult(null);}}
                  style={{ ...S.btn("ghost"), textAlign:"left", padding:"8px 12px", fontSize:12 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          {!result && (
            <div style={{ ...S.card }}>
              <Hdr title="How the Sentinel Works" sub="Three layers of language analysis"/>
              <div style={{ padding:16, display:"grid", gap:10 }}>
                {[
                  ["🔴 Flag — Blocks Submission","Detects minimizing language: 'minor touch' for assault, 'small incident' for injury, passive voice that removes agency. Must revise or explicitly acknowledge."],
                  ["⚠ Warning — Review Suggested","Trigger words present (hit, fell, kicked, etc.) indicating an incident may require APD reporting within 24 hours."],
                  ["✓ Clean — Ready to Submit","Language is specific, descriptive, and includes required elements: trigger, behavior, staff response, duration."],
                  ["🛡 Immutable on Submit","Once submitted, the report is locked with a timestamp. No administrator can alter or delete it. Staff identity protected."],
                ].map(([t,d])=>(
                  <div key={t} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9 }}>
                    <div style={{ fontWeight:700, fontSize:12, color:C.navy, marginBottom:3 }}>{t}</div>
                    <div style={{ fontSize:12, color:C.text2, lineHeight:1.6 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result && cfg && (
            <div style={{ display:"grid", gap:12 }}>
              <div style={{ ...S.card, border:`2px solid ${cfg.col}` }}>
                <div style={{ padding:"14px 18px", background:cfg.bg }}>
                  <div style={{ fontWeight:800, fontSize:14, color:cfg.col }}>{cfg.label}</div>
                </div>
                <div style={{ padding:16, display:"grid", gap:10 }}>
                  {result.minimize.length > 0 && (
                    <div style={{ padding:"12px 14px", background:C.redlt, borderRadius:10 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:C.red, marginBottom:6 }}>🚨 Minimizing Language Detected</div>
                      {result.minimize.map((m,i)=><div key={i} style={{ fontSize:12, color:C.red, marginBottom:3 }}>• {m.msg}</div>)}
                    </div>
                  )}
                  {result.found.length > 0 && (
                    <div style={{ padding:"12px 14px", background:C.goldlt, borderRadius:10 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:C.gold, marginBottom:6 }}>⚠ Incident Trigger Words</div>
                      <div style={{ fontSize:12, color:C.text }}>Found: <strong>"{result.found.join('", "')}"</strong> — APD 24-hour reporting window may apply.</div>
                    </div>
                  )}
                  {result.missing.length > 0 && (
                    <div style={{ padding:"12px 14px", background:C.gray0, borderRadius:10 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:C.text3, marginBottom:6 }}>📋 Required Elements</div>
                      {result.missing.map((m,i)=><div key={i} style={{ fontSize:12, color:C.text2, marginBottom:3 }}>• {m}</div>)}
                    </div>
                  )}
                  {result.severity==="clean" && (
                    <div style={{ padding:"12px 14px", background:C.greenlt, borderRadius:10 }}>
                      <div style={{ fontSize:13, color:C.greenmed, fontWeight:600 }}>✓ No minimizing language detected. Report appears complete and specific. Ready for submission.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INVESTOR OVERVIEW ────────────────────────────────────────────────────────
function InvestorView({onBack}) {
  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,#0A1628 0%,${C.navy} 100%)`, padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>📊 LUMINARK — Investor Overview</div>
        <button onClick={onBack} style={S.btn("ghost",true)}>← Back</button>
      </div>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:24, display:"grid", gap:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[["$4.2B","Medicaid fraud/yr — FL alone",C.red],["58K","Floridians served by APD",C.navy],["3,800","Licensed group homes — TAM",C.teal],["$3.9B","5-year revenue model",C.gold]].map(([val,label,col])=>(
            <div key={label} style={{ padding:20, background:C.white, borderRadius:14, border:`1px solid ${C.gray1}` }}>
              <div style={{ fontSize:34, fontWeight:900, color:col, fontFamily:"Georgia,serif" }}>{val}</div>
              <div style={{ fontSize:12, color:C.text3, marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ padding:22, background:C.white, borderRadius:14, border:`1px solid ${C.gray1}` }}>
            <div style={{ fontWeight:800, fontSize:16, color:C.navy, fontFamily:"Georgia,serif", marginBottom:14 }}>The Problem</div>
            {[["💊","Medication errors","34% of APD deficiency citations"],["💰","Ghost billing","$4.2B Medicaid fraud annually"],["📝","Incident falsification","No Sentinel, no immutable record"],["🔬","BA gatekeeping","Jargon as a $80-150/hr moat"],["👨‍👩‍👧","Families blind","Financial exploitation #1 hotline complaint"]].map(([icon,title,sub])=>(
              <div key={title} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:`1px solid ${C.gray1}` }}>
                <span style={{fontSize:18}}>{icon}</span>
                <div><div style={{ fontWeight:600, fontSize:13, color:C.text }}>{title}</div><div style={{ fontSize:11, color:C.text3 }}>{sub}</div></div>
              </div>
            ))}
          </div>
          <div style={{ padding:22, background:C.white, borderRadius:14, border:`1px solid ${C.gray1}` }}>
            <div style={{ fontWeight:800, fontSize:16, color:C.navy, fontFamily:"Georgia,serif", marginBottom:14 }}>The Platform</div>
            {[["🏥","Staff Portal","GPS clock-in · Med scan · NSDT observer · Sentinel"],["🎯","Manager Portal","Heatmap · EVV billing · Fidelity tracker · Alerts"],["🧠","BA Portal","BEI fraud detection · AI plan scorer · Jargon translation"],["👨‍👩‍👧","Family Portal","Stage updates · Wallet ledger · Plain-language plan"],["📊","Investor Demo","This interactive briefing"]].map(([icon,title,sub])=>(
              <div key={title} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:`1px solid ${C.gray1}` }}>
                <span style={{fontSize:18}}>{icon}</span>
                <div><div style={{ fontWeight:600, fontSize:13, color:C.text }}>{title}</div><div style={{ fontSize:11, color:C.text3 }}>{sub}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:22, background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 100%)`, borderRadius:14 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C.white, fontFamily:"Georgia,serif", marginBottom:14 }}>Florida Compliance Fortress — Every Statute Addressed</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[["65G-7.007B","Controlled substance dual-witness"],["65G-8.005","Reactive strategy authorization"],["65G-2.009","Incident reporting 24-hr window"],["FS 394.463","Baker Act per-resident thresholds"],["EVV Mandate","GPS-verified billing vs. actuals"],["iConnect API","XML export, double-entry eliminated"]].map(([rule,desc])=>(
              <div key={rule} style={{ padding:"8px 12px", background:"rgba(255,255,255,.06)", borderRadius:8, display:"flex", gap:10 }}>
                <span style={{ fontSize:11, fontWeight:800, color:C.gold, width:100, flexShrink:0 }}>{rule}</span>
                <span style={{ fontSize:11, color:"#8AAABB" }}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[["Year 1","$18M ARR","380 homes · 3-county pilot"],["Year 3","$180M ARR","Full Florida · CMS certified"],["Year 5","$3.9B total","National · Enterprise contracts"]].map(([yr,val,sub])=>(
              <div key={yr} style={{ padding:"14px 16px", background:"rgba(200,150,12,.1)", borderRadius:10, border:`1px solid rgba(200,150,12,.25)` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:.5 }}>{yr}</div>
                <div style={{ fontSize:22, fontWeight:900, color:C.gold, fontFamily:"Georgia,serif" }}>{val}</div>
                <div style={{ fontSize:11, color:"#5A7A9A" }}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:"10px 14px", background:"rgba(255,255,255,.04)", borderRadius:9, fontSize:12, color:"#5A7A9A" }}>
            Contact: LuminarkMeridian@gmail.com · Richard Stanfield, Founder & CSO · St. Petersburg, FL · github.com/foreverforward760-crypto/APD_Overwatch
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("portal");
  if (view==="staff")   return <StaffDemo    onBack={()=>setView("portal")}/>;
  if (view==="nsdt")    return <NSDTDemo     onBack={()=>setView("portal")}/>;
  if (view==="stage")   return <StageExplorer onBack={()=>setView("portal")}/>;
  if (view==="sentinel") return <SentinelDemo onBack={()=>setView("portal")}/>;
  if (view==="invest")  return <InvestorView  onBack={()=>setView("portal")}/>;
  return <PortalSelect onSelect={setView}/>;
}
