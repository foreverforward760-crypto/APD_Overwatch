import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  navy:"#0D1F35", navy2:"#152E4D", navy3:"#1E3F6A",
  gold:"#C8960C", goldlt:"#FDF3D8", goldmed:"#E0A800",
  red:"#8B1A1A", redlt:"#FDECEA", redmed:"#C0392B",
  green:"#1A5C2A", greenlt:"#D6F7DD", greenmed:"#27AE60",
  teal:"#0E6674", teallt:"#D0EEF2",
  orange:"#B85C00", orangelt:"#FEF0E0",
  purple:"#4A1A7A", purplelt:"#EDE0FC",
  gray0:"#F7F6F2", gray1:"#EEECE6", gray2:"#D8D5CC", gray3:"#9A9488",
  text:"#1A1814", text2:"#4A4640", text3:"#7A7570", white:"#FFFFFF",
};

// ─── STAGE CONFIG ───────────────────────────────────────────────────────────────
const STAGES = [
  {
    id:0, name:"The Honeymoon", color:"#2D7DD2", bg:"#E8F2FC", tension:1,
    geometry:"Circle", symbol:"⚫",
    sapPrinciple:"Pure potential — no history yet written in this environment. The cleared field. Everything is possible because nothing has been established.",
    inversion:"Neutral — no polarity tension yet. The slate is genuinely blank.",
    staffReality:"The resident is compliant, cooperative, and often unusually easy to work with. They follow house routines, accept staff direction, and may seem like the 'perfect' resident. Do not be fooled by the ease.",
    internalReality:"The resident is reading the room — quietly assessing who is safe, what the rules really are, and whether this place is different from the last one. The calm is real, but it is the calm of observation, not of comfort.",
    actionPrompt:"Build the relationship now — this window closes. Be consistent, predictable, and honest. The patterns you set here become the foundation the resident trusts or tests later. Use this period to establish daily rhythms, learn preferences, and observe without pressure.",
    trapWarning:"Assuming the Honeymoon is the baseline — and treating what comes next as deterioration. Staff who expect this level of cooperation throughout the placement are set up for a hard fall when Stage 3 arrives. Also watch for void addiction: residents who cycle back here repeatedly after crises may be unconsciously using reset as an avoidance pattern.",
    controlPoint:false,
    velocity:"Slow — the resident is still absorbing. This stage often follows a major life transition: new placement, post-hospitalization, post-incident reset. The calm is real. The work underneath it has already begun.",
    familyDesc:"Your loved one is settling in. Things may feel unusually smooth right now — that's normal and temporary. The staff are using this time to build trust.",
    clinicalParallel:"Initial placement adaptation period. Low behavioral frequency. Baseline establishment phase.",
  },
  {
    id:1, name:"Finding Their Footing", color:"#3A7D44", bg:"#E8F5EB", tension:3,
    geometry:"Point becoming Line", symbol:"✨",
    sapPrinciple:"First real emergence — direction begins to form out of the initial stillness. Unstable on the outside, but a clear internal sense of self is starting to activate.",
    inversion:"Physically unstable / Consciously stable. The resident's behavior may start showing variation — but they know exactly who they are. The testing is intentional, not random.",
    staffReality:"Small boundary tests appear. The resident finds out what the real rules are — not the posted rules, the actual rules. Who backs down? Who means what they say? They are gathering data, not being defiant.",
    internalReality:"A growing sense of: 'I think I can actually be myself here.' First real personality emerges — humor, preferences, quirks, small refusals. This is healthy.",
    actionPrompt:"Hold your boundaries warmly and consistently. When the resident tests, the correct response is calm follow-through — not punishment, not ignoring. They need to know the structure is real.",
    trapWarning:"Treating early testing as a behavior problem to eliminate rather than a trust-building communication to respond to.",
    controlPoint:false,
    velocity:"Building — the momentum from The Honeymoon is starting to move. Expect gradual increase in behavioral complexity.",
    familyDesc:"Your loved one is starting to show more of their real personality. Some of this may look like pushing boundaries — it means they're starting to feel safe enough to be themselves.",
    clinicalParallel:"Post-honeymoon behavioral emergence. Antecedent assessment window. Functional behavior hypothesis formation.",
  },
  {
    id:2, name:"Showing Their Colors", color:"#C67F12", bg:"#FDF0DC", tension:5,
    geometry:"Axis / Two Poles", symbol:"☯",
    sapPrinciple:"Duality fully surfaces — the resident shows the full range of who they are. Stable on the outside, churning on the inside. The tension between their two sides becomes visible.",
    inversion:"Physically stable / Consciously unstable. The resident has settled into the home's physical routines but is internally sorting out identity, belonging, and safety.",
    staffReality:"You see both sides now — the cooperative, engaged side AND the resistant, challenging side. Neither is fake. Both are real. Staff who only accept the 'good' side will face escalating conflict as the resident fights to be fully seen.",
    internalReality:"Am I accepted as a whole person here — not just when I'm easy? The resident is testing whether staff can handle the full truth of who they are.",
    actionPrompt:"Accept the whole person. When the difficult side emerges, respond to it the same way you respond to the pleasant side — with steadiness. Consistency across both states builds deep trust.",
    trapWarning:"Trying to 'fix' the difficult side while only rewarding the compliant side. This communicates that the resident is only acceptable when they perform.",
    controlPoint:false,
    velocity:"Accelerating — the two-sidedness creates natural momentum toward the first real crisis.",
    familyDesc:"You may be hearing about more challenging moments alongside the good ones. This is a healthy sign — it means your loved one is comfortable enough to show all of who they are.",
    clinicalParallel:"Full behavioral repertoire emergence. Target behavior identification. Antecedent-behavior-consequence pattern mapping begins.",
  },
  {
    id:3, name:"The Hard Stretch", color:"#B93232", bg:"#FDEAEA", tension:8,
    geometry:"Triangle — first true structure under pressure", symbol:"🔺",
    sapPrinciple:"First major threshold. The most important and most misread stage in the entire cycle. High chaos on the outside — high clarity on the inside. This is where the resident expresses what they could not express before. The triangle: the structure is being stress-tested to find out if it will hold.",
    inversion:"Physically unstable / Consciously stable. Behavior is at its most challenging — but the resident often has the clearest sense of what they need. The escalation IS the communication.",
    staffReality:"Incidents increase. Sleep disruption, refusals, aggression, property destruction, or shutdown behaviors peak. Staff feel the relationship is deteriorating. It is not — it is being tested at depth. This is also a SAP control point (3-6-9): the decisions made here determine the entire trajectory.",
    internalReality:"'Will this place hold me when I'm at my worst?' The resident is not trying to destroy the placement. They are trying to find out if the placement will survive the real version of them.",
    actionPrompt:"Do not abandon the relationship at The Hard Stretch. Update the BA plan. Request additional support. Document with precision. What you do at Stage 3 becomes the resident's lived evidence of whether they are worth staying for.",
    trapWarning:"Recommending placement change, restrictive procedures, or medication increases as the first response to Stage 3. This stage ends placements that should not end. Most residents who cycle through multiple group homes are being discharged at Stage 3 rather than supported through it.",
    controlPoint:true,
    velocity:"Fast and unpredictable — momentum can accelerate crisis OR breakthrough. Immediate BA involvement is critical. This is where the cycle either advances or resets.",
    familyDesc:"This is the hardest part of the journey, and it is normal. Your loved one is testing whether this home will stay committed to them. The staff need your support and patience right now too.",
    clinicalParallel:"Crisis escalation phase. Behavioral incident peak. FBA (Functional Behavior Assessment) revision point. Placement stability risk window.",
  },
  {
    id:4, name:"The Turning Point", color:"#2E8B57", bg:"#E0F4E8", tension:6,
    geometry:"Square — four corners, stable foundation", symbol:"⬛",
    sapPrinciple:"Consolidation after the crisis. The structure held. The resident now begins to build on that proof. Stable on the outside as real routines form — but the inner work of learning to trust is the most active it has ever been.",
    inversion:"Physically stable / Consciously unstable. Incidents decrease. Routines solidify. Staff breathe again. But internally the resident is doing the deepest emotional processing of the entire cycle.",
    staffReality:"Things get noticeably calmer. The specific strategies that worked during The Hard Stretch are now producing consistent results. Staff-resident rapport deepens. The relationship is becoming real. This is when BA plans should be actively refined — while you have the data and the cooperation.",
    internalReality:"'They stayed. They actually stayed.' The resident is processing what it means that the staff and the home held firm. This often surfaces as quiet vulnerability — unexpected openness, conversations that haven't happened before.",
    actionPrompt:"Don't coast. The stability is real but not automatic. Reinforce what worked during The Hard Stretch. Deepen the relationship. Update the IB plan while you have the data and the cooperation. Begin thinking about next-level goals — this is the most durable foundation in the entire cycle. Heart-centered support belongs here: this is the stage where the resident begins to feel, not just perform.",
    trapWarning:"Treating the calmer behavior as 'case closed' and reducing staff attention and plan updates. Stage 4 stability is actively maintained, not passive. The comfort trap is real: residents and staff alike can become so comfortable here that growth stops — and the system rewards the stagnation by calling it success.",
    controlPoint:false,
    velocity:"Steady and building — the square is the most durable geometry. Progress here is slower but more permanent than any earlier stage.",
    familyDesc:"The hard part has eased. Your loved one is settling into real rhythms now — this is genuine progress being built on real trust, not just compliance.",
    clinicalParallel:"Post-crisis stabilization. Behavioral frequency decline. Behavior plan refinement window. IB goal reassessment opportunity.",
  },
  {
    id:5, name:"Finding Their Groove · Hidden Duality", color:"#1A7A4A", bg:"#D6F7DD", tension:4,
    geometry:"Pentagram — five points, the hidden star within the circle", symbol:"⭐",
    sapPrinciple:"The bilateral threshold. The only stage in the cycle where the door opens equally in both directions — forward toward flourishing OR backward toward earlier stages. The resident appears settled, even thriving. But underneath is a hidden crossroads: they are making a fundamental internal decision about whether this life is truly theirs. Hidden Duality: what you see on the surface is not the whole picture. Three possible outcomes: advance, retreat, or freeze.",
    inversion:"Physically unstable / Consciously stable — but the instability is internal and invisible. The resident knows exactly where they stand. Staff often do not.",
    staffReality:"The resident seems to be doing really well. Schedules are working. Goals are being met. Community participation is increasing. Staff and families often relax here — which is the most dangerous response to this stage. The groove is real. The hidden duality underneath it is also real.",
    internalReality:"'Is this actually my life? Do I want it to be? Can I trust that it will last?' The resident is experiencing both the pull forward toward genuine belonging AND the pull backward toward familiar patterns — even familiar pain. The inner debate is active even when the outer behavior is calm.",
    actionPrompt:"Do not assume the work is done. Deepen goals. Have honest conversations with the resident about their future. Involve them in planning. This is the most important window for self-determination — what the resident decides here shapes everything that follows. Watch for sudden small regressions — they are signals from the hidden duality, not random setbacks.",
    trapWarning:"Declaring the resident 'stable' and reducing support at Stage 5. This is the most common cause of Stage 7 regression. The groove can only sustain itself if the underlying decision resolves forward.",
    controlPoint:false,
    velocity:"Peak tension — the pentagram holds five points in perfect tension. Everything feels balanced. Everything is at a crossroads. Do not reduce monitoring or support.",
    familyDesc:"Your loved one is doing well — and this is the moment to dream bigger together with them. Ask them what they want their life to look like. Their answer matters more right now than at any other time.",
    clinicalParallel:"Behavioral stabilization. Self-determination planning window. LRE (Least Restrictive Environment) assessment opportunity. Transition planning initiation.",
  },
  {
    id:6, name:"Living Well Here", color:"#5C7A1A", bg:"#EBF7D6", tension:2,
    geometry:"Hexagon — honeycomb, peak efficiency in nature", symbol:"🔶",
    sapPrinciple:"The peak of harmony within this cycle. The resident has crossed the threshold and is genuinely thriving. The hexagon: nature's most efficient structure — maximum function, minimum waste. But hexagons are also fragile at the edges. This is a SAP control point (3-6-9): the maintenance decisions made here determine whether the peak sustains or collapses.",
    inversion:"Physically stable / Consciously unstable — the inner work of maintaining this peak is real and constant. The resident may feel the fragility themselves even while appearing to flourish.",
    staffReality:"The resident is meaningfully engaged — in activities, in the community, in relationships. Goals are being achieved. This is a flow state: skills are clicking, participation is high, relative harmony defines the house. This looks like success because it is success. But the hexagon's strength is also its vulnerability — Stage 6 can destabilize faster than any other stage when something disrupts the structure. Staffing changes, medication adjustments, or family upheaval can crack it quickly.",
    internalReality:"Real joy, real belonging — and underneath it, a quiet awareness that this peak cannot be taken for granted. The resident may begin to think about what comes next, even if they cannot articulate it. Some residents feel the fragility themselves before staff notice it.",
    actionPrompt:"Celebrate genuinely. Document the progress in detail — this data belongs in the IB review and the LRE assessment. AND: begin the conversation about next-level goals. Step-down planning, community integration, greater independence. Living Well Here should be preparation for Ready To Fly — not the permanent destination. Monitor for early Stage 7 micro-signals: increased vocalization after routine changes, mild regression in specific settings, uncharacteristic withdrawal.",
    trapWarning:"Institutionalizing the resident at their peak — making the group home permanent because everyone (staff, family, system) is comfortable with Stage 6. This is the beginning of Stage 8's Perceived Permanence. The peak is meant to be a launching pad, not a landing pad.",
    controlPoint:true,
    velocity:"High flow, low friction — but structurally vulnerable to disruption. Staffing changes, medication adjustments, or family upheaval can destabilize Stage 6 faster than any other stage.",
    familyDesc:"Your loved one is genuinely thriving. Use this time to start talking about bigger goals — more independence, more community involvement. This is the best time to plan the next step forward.",
    clinicalParallel:"Peak adaptive functioning. Quality of life metrics at maximum. IB reclassification review. Transition planning acceleration.",
  },
  {
    id:7, name:"Stuck In Place", color:"#9A2A2A", bg:"#FDECEA", tension:9,
    geometry:"Heptagon — seven sides, natural cycles of transformation", symbol:"🌀",
    sapPrinciple:"Crisis of transformation, not failure. The peak has cracked — and the cracking is the point. Stage 7 is the lens that examines everything: every assumption, every plan, every relationship is stress-tested. Old patterns break apart. This is painful to witness and to live through. But the heptagon appears in nature at every major transformation point. What looks like 'stuck' to the outside observer is often the pressure required for the next breakthrough. High wisdom potential lives inside Stage 7 — if the team has the skill to extract it.",
    inversion:"Physically unstable / Consciously stable — behavioral incidents return, regression is visible, but the resident often has razor-sharp clarity about what is wrong. The crisis IS the message.",
    staffReality:"Something has broken down. Incidents returning. Progress plateauing or reversing. Staff are frustrated. Plans feel ineffective. The temptation is to increase restrictions, change medications, or consider placement change. This is usually the wrong response. Stage 7 is a 'dark night' for the placement — it requires deeper engagement and a safe container for transformation, not retreat.",
    internalReality:"'Nothing is working. Nothing will ever work.' The resident is experiencing what feels like permanent suffering — but this is the distillation phase speaking, not the truth. The intensity of Stage 7 is the friction of transformation. Wisdom is being extracted from the difficulty, even when the resident cannot feel it yet. Shadow work — facing the parts of themselves they have avoided — is active here.",
    actionPrompt:"Call an emergency team meeting. Review the entire plan with fresh eyes — not an update, a real review. Bring in the BA, the physician, and the family. Ask the resident directly: 'What do you need right now that you're not getting?' Provide a safe container for the transformation. Do not rush through this stage. Extract what it is teaching and document it — that intelligence becomes the foundation of Stage 8 and the roadmap for Stage 9.",
    trapWarning:"Interpreting Stage 7 as proof that the resident has 'hit their ceiling' and reducing expectations permanently. This is the doorway into Stage 8's Perceived Permanence — the institutionalized belief that suffering is inevitable. Despair and prolonged suffering without extraction of wisdom is what turns a Stage 7 into a Stage 8 sentence.",
    controlPoint:false,
    velocity:"Intense and separative — things that were working come apart. This creates the space for something better. The velocity here can accelerate quickly toward Stage 8 if not addressed with skilled, consistent support.",
    familyDesc:"Your loved one is going through a hard stretch again. This doesn't mean the progress was lost — it means the next layer of growth is being worked through. Shadow work is real and necessary. Your consistency and patience are more important right now than at any other time.",
    clinicalParallel:"Behavioral regression. Crisis intervention activation. Wisdom extraction / FBA revision. Placement stability review. Restrictive procedure evaluation. Shadow work / distillation phase.",
  },
  {
    id:8, name:"The Illusion Trap", color:"#6B0000", bg:"#F5D5D5", tension:10,
    geometry:"Infinity loop / Möbius strip", symbol:"∞",
    sapPrinciple:"The primary trap in the entire SAP framework. Maximum density. The resident (or the system around them) has become locked in a false permanent state. Two forms of Perceived Permanence: the resident appears fine but nothing is moving forward, or everyone has accepted that suffering will never end and progress is impossible. Both are illusions. Both require active intervention to break. TrapScore amplifier: 1.45× — everything that keeps the resident here is being amplified by the system itself.",
    inversion:"Physically stable / Consciously seeking release — but the conscious seeking is suppressed. The system has stopped listening. The resident's signals for change are being interpreted as symptoms to manage rather than communications to respond to.",
    staffReality:"PERCEIVED PERMANENCE — FORM 1: The resident has been in this home for years. Behavior is manageable. No one has reviewed the IB plan in months. The BA checks in quarterly. Staff know the routines. Everyone is comfortable — except the resident, who has stopped growing. PERCEIVED PERMANENCE — FORM 2: The resident has a long history of incidents. Staff say 'that's just how they are.' Families have stopped expecting progress. The plan has not changed in over a year. The resident's potential is being actively suppressed by the system's belief that there is no potential.",
    internalReality:"Perceived Permanence takes two forms from the inside: a quiet, unspoken despair — the sense that this is all there will ever be; or that same despair expressed loudly through behavior because no other channel is available.",
    actionPrompt:"MANDATORY: If a resident has been at Stage 8 for more than 90 days without an IB review or BA plan update — escalate immediately. Request a full team meeting. Review every assumption about this resident's ceiling. The Illusion Trap requires someone from outside the daily routine to break the pattern. This is what the BA, the family portal, and the manager dashboard exist to catch.",
    trapWarning:"This IS the trap. Every feature of this platform — the Fidelity Tracker, the EVV engine, the Stage Heatmap, the iConnect sync — exists partly to prevent residents from disappearing into Stage 8 undetected.",
    controlPoint:false,
    velocity:"Stalled — maximum drag. The Möbius strip loops back on itself. Without active external intervention, Stage 8 residents do not naturally tumble forward. They require a deliberate disruption to the pattern.",
    familyDesc:"Your loved one may seem stable right now, but stable is not the same as thriving. If you haven't heard about new goals, new activities, or progress in a while — ask. You have the right to request an IB review at any time.",
    clinicalParallel:"Behavioral plateau with systemic reinforcement of status quo. IB review overdue. Restrictive procedure normalization. Institutional learned helplessness. Stagnation requiring crisis-of-compassion intervention.",
  },
  {
    id:9, name:"Ready To Fly", color:"#0D5C2E", bg:"#C8F0D8", tension:1,
    geometry:"Circle returning — the nonagon completing the arc", symbol:"🕊",
    sapPrinciple:"Integration and readiness for the next level. The resident has done the real work of the entire cycle — and now they are becoming a source of stability for others around them. The circle closes not as an ending but as a launching point. Wisdom is ready to be transmitted, and the legacy of this placement becomes theirs to carry forward. This is a SAP control point (3-6-9): what gets documented, celebrated, and handed off here shapes the next cycle entirely.",
    inversion:"Physically unstable (the current placement no longer fits) / Consciously stable and accepting. Stage 9 is the only stage where this inversion is welcomed rather than resisted. The readiness to move forward and the readiness to let go are the same feeling.",
    staffReality:"The resident has become a quiet anchor in the home — other residents follow their lead, staff relationships are deep and mutual, and the person is genuinely contributing to the house culture. AND: they are outgrowing the setting. They may not say it directly, but growing restlessness, boredom with former routines, and increasing interest in what comes next are all Stage 9 signals. The hardest and most important work at this stage is recognizing when to actively support the transition rather than hold on.",
    internalReality:"'I've learned what this place had to teach me. I'm ready for the next chapter.' — Earned, sometimes bittersweet, always real. The resident knows. The question is whether the system around them is listening. Independence and greater community integration are no longer abstract goals — they feel possible from the inside.",
    actionPrompt:"Begin LRE transition planning immediately — document every gain, every skill, every relationship built. Involve the resident fully in every decision and every timeline. Connect them with the next setting before they leave this one. Their story belongs to them. Make sure it travels with them in a way the next team can actually use.",
    trapWarning:"Premature exit OR incomplete cycle — the trap runs both directions. Exiting too early (before the resident is truly ready) destabilizes the gains. But the more common trap is the system's attachment: staff who don't want to lose a 'good resident,' families afraid of the unknown, administrators behind on paperwork. Every month a Stage 9 resident spends waiting for the system to catch up is a month of potential they are not living.",
    controlPoint:true,
    velocity:"Completing and dissolving — the nonagon releases. If the transition is actively supported, this momentum carries the resident into their next cycle with everything they need. If it is blocked, Stage 9 regresses toward Stage 8's Perceived Permanence — 'high-functioning' residents quietly warehoused at their ceiling, their readiness slowly eroding.",
    familyDesc:"Your loved one is ready for the next chapter — greater independence, more community involvement, a setting that fits who they have become. This is what all the hard work was for. It's okay to feel emotional about the change. It's the right time to celebrate how far they've come and to step forward with them.",
    clinicalParallel:"Full adaptive functioning. LRE transition readiness. Wisdom transmission / legacy documentation. Supported living or independent living assessment. Step-down planning. Discharge coordination. Transition IEP/ISP revision. LRE advocacy.",
  },
];

// ─── DATA ───────────────────────────────────────────────────────────────────────
const STAFF_DB = {
  "S001":{ id:"S001", name:"Maria Thompson",  role:"DSP",      pin:"1234", homes:["Home A","Home B","Home C"], hourlyRate:16.50 },
  "S002":{ id:"S002", name:"Carlos Rivera",   role:"DSP",      pin:"5678", homes:["Home A","Home B","Home C"], hourlyRate:16.50 },
  "S003":{ id:"S003", name:"Janet Williams",  role:"Lead DSP", pin:"9012", homes:["Home A","Home B","Home C"], hourlyRate:19.25 },
  "S004":{ id:"S004", name:"Deja Mosley",     role:"DSP",      pin:"3456", homes:["Home A","Home B","Home C"], hourlyRate:16.50 },
};

const PAY_PERIOD = {
  start:"2026-04-28", end:"2026-05-11",
  shifts:{
    "S001":[
      {date:"2026-04-28",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-04-29",home:"Home B",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-04-30",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-02",home:"Home C",shift:"11:00 PM – 7:00 AM",hours:8},
      {date:"2026-05-03",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-05",home:"Home B",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-05-07",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-08",home:"Home A",shift:"3:00 PM – 11:00 PM",hours:8},// OT
      {date:"2026-05-09",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
    ],
    "S002":[
      {date:"2026-04-28",home:"Home B",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-04-30",home:"Home A",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-05-02",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-05",home:"Home B",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-09",home:"Home A",shift:"3:00 PM – 11:00 PM",hours:8},
    ],
    "S003":[
      {date:"2026-04-28",home:"Home B",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-04-29",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-01",home:"Home B",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-05-03",home:"Home B",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-06",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-09",home:"Home B",shift:"7:00 AM – 3:00 PM",hours:8},
    ],
    "S004":[
      {date:"2026-04-29",home:"Home C",shift:"3:00 PM – 11:00 PM",hours:8},
      {date:"2026-05-01",home:"Home A",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-04",home:"Home B",shift:"7:00 AM – 3:00 PM",hours:8},
      {date:"2026-05-08",home:"Home C",shift:"3:00 PM – 11:00 PM",hours:8},
    ],
  }
};

const SCHEDULE_DB = [
  { staffId:"S001", home:"Home A", date:"2026-05-09", shift:"7:00 AM – 3:00 PM",  shiftStart:"07:00", shiftEnd:"15:00" },
  { staffId:"S002", home:"Home A", date:"2026-05-09", shift:"3:00 PM – 11:00 PM", shiftStart:"15:00", shiftEnd:"23:00" },
  { staffId:"S003", home:"Home B", date:"2026-05-09", shift:"7:00 AM – 3:00 PM",  shiftStart:"07:00", shiftEnd:"15:00" },
];

const HOMES = {
  "Home A":{ address:"2841 Suncoast Blvd, St. Petersburg, FL 33701", phone:"(727) 555-0192", supervisor:"Shondra Baxter (727) 555-0911", license:"APD-GH-2024-0441", capacity:4, onsite:3 },
  "Home B":{ address:"4102 Pinellas Ave, Clearwater, FL 33756", phone:"(727) 555-0284", supervisor:"Shondra Baxter (727) 555-0911", license:"APD-GH-2024-0512", capacity:4, onsite:2 },
  "Home C":{ address:"9310 Gulf Blvd, Treasure Island, FL 33706", phone:"(727) 555-0377", supervisor:"Shondra Baxter (727) 555-0911", license:"APD-GH-2024-0633", capacity:3, onsite:1 },
};

const RESIDENTS_DB = {
  "Home A":[
    {
      id:"R001", name:"Marcus Dubois", dob:"1987-03-14", age:39,
      photo:"👨🏾", stage:8, home:"Home A",
      diagnosis:["Intellectual Disability – Moderate","Autism Spectrum Disorder","PTSD"],
      allergies:["Penicillin","Tree nuts"],
      dnr:false,
      dietaryTexture:"Soft/Minced",
      dietaryAlert:"⚠ NO CHUNKY FOOD — choking risk documented 2024",
      seizureHistory:true,
      seizurePlan:{
        atStart:"Call out calmly, clear area, begin timing",
        at3min:"Call 911 immediately",
        at5min:"Administer Diastat 10mg rectal — in bathroom cabinet top shelf",
        post:"Document exact start/end time, duration, movements observed, call guardian"
      },
      communication:"Verbal – limited. Uses picture board for complex requests.",
      behavioralTriggers:["Loud sudden noises","Changes to routine","Physical contact without warning","Crowded spaces"],
      physician:"Dr. Anita Patel – (727) 555-0340",
      guardian:"Dorothy Dubois (Mother) – (727) 555-0881",
      emergencyContact:"Dorothy Dubois – (727) 555-0881",
      insurance:"Florida Medicaid – ID: FL-MED-0044812",
      ibStatus:"Active IB – Review OVERDUE (183 days without incident)",
      ba:"Tanya Williams, BCaBA – (727) 555-0762",
      wallet:{ balance:47.50, transactions:[
        {date:"2026-05-07",desc:"Walmart outing",amount:-23.15,staff:"Maria Thompson",receipt:"WMT-20260507"},
        {date:"2026-05-04",desc:"Monthly stipend",amount:75.00,staff:"System",receipt:"STD-MAY"},
        {date:"2026-04-30",desc:"McDonald's outing",amount:-4.35,staff:"Carlos Rivera",receipt:"MCD-20260430"},
      ]},
      pillCounts:{ "M001":{current:24,perDay:2,label:"Risperidone 1mg"}, "M003":{current:9,perDay:0.3,label:"Lorazepam 0.5mg (PRN)"} },
      meds:[
        { id:"M001", name:"Risperidone 1mg",  route:"Oral", times:["8:00 AM","8:00 PM"], ndc:"00003-1413-01", instructions:"Give with food. Monitor for drowsiness.", controlled:false },
        { id:"M002", name:"Sertraline 50mg",  route:"Oral", times:["8:00 AM"], ndc:"00049-4960-66", instructions:"May cause nausea first 2 weeks.", controlled:false },
        { id:"M003", name:"Lorazepam 0.5mg",  route:"Oral", times:["As needed – anxiety"], ndc:"00603-3213-21", instructions:"PRN only. Document behavior before and after. Max 1 per day. CONTROLLED.", controlled:true, isPRN:true },
      ],
      notes:"HONEYMOON ENDED. Known for elopement history. Always announce yourself before entering room.",
      pcm:["Verbal redirection — calm, flat tone, no questions","Personal space / step back at least 6 feet","Offer preferred fidget item (top drawer, desk)","Supportive coaching: name the feeling out loud ('I can see this is hard')"],
      prohibited:["⛔ Prone (face-down) restraint — civil rights violation / APD reportable","⛔ Any hold involving neck, head, or hair","⛔ Blocking doorways as behavioral consequence","⛔ Removing AAC picture board as consequence","⛔ Shouting, threatening, or commanding voice"],
      bakerAct:{ statute:"FL Statute 394.463", history:true, historyNote:"Marcus has 2 prior voluntary Baker Act evaluations (Jan 2023, Aug 2024). Both resolved with med adjustment — no involuntary holds on record.", threshold:"Consider Baker Act consult if: refuses all food/water 24+ hrs AND expresses active hopelessness AND shows paradoxical sudden calm after sustained distress period.", nonVerbalNote:null },
      behaviorPlan:{ 
        clinicalDesc:"Target behaviors: Physical Aggression (hitting, kicking, throwing objects — function: escape/demand avoidance + sensory overload) and Elopement (leaving without authorization — function: escape/sensory overload). Intervention: DRA protocol, preferred item NCR schedule VR-5 during high-risk antecedent periods, planned ignoring for lower-intensity iterations, active redirection for escalating topographies. FCT targeting picture-exchange outdoor access request. Environmental: all exterior doors double-lock protocol. Measurement: event recording per occurrence with topography, duration, intensity 1–5, antecedent coded.", 
        plainDesc:"What to do when Marcus starts to escalate: (1) BEFORE it happens — watch for early signs: rocking faster, humming loudly, covering ears. These mean he is getting overwhelmed. (2) During low-level escalation: offer headphones immediately. Move toward him slowly. Say calmly: 'Marcus, headphones?' Give him space. (3) If already escalating: create distance. Remove other residents. Stay calm and quiet. No instructions. Wait. (4) After: log exactly what you saw before (trigger), exactly what he did, exactly what you did. Write the specific actions — not 'was aggressive.' (5) Do NOT raise your voice, physically block him, or remove preferred items as consequence. ELOPEMENT: all exterior doors stay double-locked. Take Marcus outside 3x daily for 15 min — this reduces the urge to escape. Teach him to use his 'outside' picture card.",
        certificationHints:[
          {term:"DRA (Differential Reinforcement of Alternative Behavior)", plain:"Rewarding a replacement behavior instead — teaching Marcus to tap the table instead of hitting, and rewarding the tap"},
          {term:"Non-contingent reinforcement (NCR)", plain:"Giving preferred items on a schedule regardless of behavior — this reduces the motivation to act out to get them"},
          {term:"Escape-motivated behavior", plain:"The behavior happens because it gets Marcus out of something he does not want to do"},
          {term:"Inter-response time (IRT)", plain:"The amount of calm time between behaviors — we are measuring how long the good stretches are getting"},
        ],
      },
    },
    {
      id:"R003", name:"Lydia Mercado", dob:"2001-07-22", age:24,
      photo:"👩🏽", stage:0, home:"Home A",
      diagnosis:["Down Syndrome","Anxiety Disorder – Generalized"],
      allergies:["Latex","Sulfa drugs"],
      dnr:false,
      dietaryTexture:"Regular",
      dietaryAlert:null,
      seizureHistory:false,
      seizurePlan:null,
      communication:"Verbal – good. Speaks in 3-5 word sentences.",
      behavioralTriggers:["Being told 'no' without explanation","Long waiting periods","Unfamiliar people"],
      physician:"Dr. James Okafor – (727) 555-0517",
      guardian:"Rosa Mercado (Mother) – (813) 555-0334",
      emergencyContact:"Rosa Mercado – (813) 555-0334",
      insurance:"Florida Medicaid – ID: FL-MED-0089341",
      ibStatus:"Standard Behavioral",
      ba:"Sarah Patterson, BCBA – (727) 555-0614",
      wallet:{ balance:112.00, transactions:[
        {date:"2026-05-08",desc:"Monthly stipend",amount:112.00,staff:"System",receipt:"STD-MAY"},
      ]},
      pillCounts:{ "M004":{current:62,perDay:3,label:"Buspirone 10mg"}, "M005":{current:20,perDay:1,label:"Melatonin 5mg"} },
      meds:[
        { id:"M004", name:"Buspirone 10mg", route:"Oral", times:["8:00 AM","2:00 PM","8:00 PM"], ndc:"00093-0823-01", instructions:"Consistent timing important. Do not skip.", controlled:false },
        { id:"M005", name:"Melatonin 5mg",  route:"Oral", times:["8:00 PM"], ndc:"OTC", instructions:"30 minutes before target bedtime.", controlled:false },
      ],
      notes:"NEW RESIDENT – Day 12. Currently in Honeymoon Stage. Prior history: property destruction during manic episodes. DO NOT lower guard.",
      pcm:["Give advance notice before transitions ('In 5 minutes we are…')","Offer choices to maintain sense of control","Calm explanation when 'no' is necessary — always give a reason","Redirect to preferred activity before escalation peaks"],
      prohibited:["⛔ Prone (face-down) restraint — civil rights violation / APD reportable","⛔ Taking away personal items as punishment","⛔ Isolating resident without supervisor authorization","⛔ Raised voice or sarcastic tone"],
      bakerAct:{ statute:"FL Statute 394.463", history:false, historyNote:"No Baker Act history on file. New resident — baseline still being established.", threshold:"Monitor for: property destruction escalating to self-directed behavior, statements of self-harm intent, refusal of all medication for 2+ days. Consult BA before any Baker Act consideration given Honeymoon Stage status.", nonVerbalNote:null },
      behaviorPlan:{ clinicalDesc:"Antecedent-based intervention with NCR (Non-Contingent Reinforcement). Target behavior: property destruction (throwing items). EO: restricted access to preferred items. Establishing operations: transition resistance. FCT component in development — BA assessment pending.", plainDesc:"Lydia is still getting settled (Day 12). The most important thing right now is to give her advance notice before ANY change — even small ones. When you have to say no, always explain why in simple words ('We can't do that right now because…'). Give her something she likes to do before situations that usually upset her — don't wait for the meltdown." },
    },
    {
      id:"R005", name:"Angela Fontaine", dob:"1994-11-03", age:31,
      photo:"👩🏿", stage:5, home:"Home A",
      diagnosis:["Bipolar Disorder – Type I","Mild Intellectual Disability"],
      allergies:["None known"],
      dnr:false,
      dietaryTexture:"Regular",
      dietaryAlert:null,
      seizureHistory:false,
      seizurePlan:null,
      communication:"Verbal – good. Very expressive.",
      behavioralTriggers:["Feeling dismissed","Sleep disruption","Missing medication"],
      physician:"Dr. Sarah Kim – (727) 555-0288",
      guardian:"Thomas Fontaine (Brother) – (404) 555-0177",
      emergencyContact:"Thomas Fontaine – (404) 555-0177",
      insurance:"Florida Medicaid – ID: FL-MED-0067203",
      ibStatus:"Standard Behavioral – IB Review Recommended",
      ba:"Sarah Patterson, BCBA – (727) 555-0614",
      wallet:{ balance:58.75, transactions:[
        {date:"2026-05-06",desc:"Target outing",amount:-41.25,staff:"Janet Williams",receipt:"TGT-20260506"},
        {date:"2026-05-04",desc:"Monthly stipend",amount:100.00,staff:"System",receipt:"STD-MAY"},
      ]},
      pillCounts:{ "M006":{current:18,perDay:2,label:"Lamotrigine 100mg"}, "M007":{current:7,perDay:1,label:"Quetiapine 50mg"} },
      meds:[
        { id:"M006", name:"Lamotrigine 100mg", route:"Oral", times:["8:00 AM","8:00 PM"], ndc:"00173-0665-00", instructions:"CRITICAL: Never skip. Abrupt discontinuation risk. If refused, contact BA immediately.", controlled:false },
        { id:"M007", name:"Quetiapine 50mg",   route:"Oral", times:["8:00 PM"], ndc:"00310-0272-10", instructions:"Bedtime only. May cause morning grogginess.", controlled:false },
      ],
      notes:"Angela has made excellent progress over 67 days. Mood stable. BA should initiate IB review.",
      pcm:["Low-stimulation environment during mood monitoring window (6 AM–10 AM)","Reflective listening — repeat her words back, do not argue with her perception","Physical activity redirect during early mania indicators (pacing, rapid speech)","Offer weighted blanket for anxiety escalation"],
      prohibited:["⛔ Prone (face-down) restraint — civil rights violation / APD reportable","⛔ Arguing with delusional content — do not challenge, redirect","⛔ Withholding mood stabilizer under any circumstances","⛔ Social isolation as behavioral intervention"],
      bakerAct:{ statute:"FL Statute 394.463", history:false, historyNote:"No involuntary Baker Act history. Prior hospitalization 2022 was voluntary, pre-diagnosis.", threshold:"Mania checklist — Baker Act consult if 3+ present: no sleep 48+ hrs, grandiose statements about leaving or special mission, refusal of all mood stabilizers, property destruction, expressed intent to harm self or others, inability to follow 2-step instructions.", nonVerbalNote:null },
      behaviorPlan:{ clinicalDesc:"Proactive mood monitoring via circadian rhythm tracking. Behavioral indicators of prodromal mania: increased speech rate (>1.5× baseline), decreased sleep self-report, inflated self-esteem statements. Intervention: environmental modification + TEAMS protocol for mood escalation. Lithium compliance is primary behavioral target.", plainDesc:"Angela's mood follows patterns — watch for her 'early warning signs' each morning: if she's talking faster than usual, seems overly energetic before 9 AM, or starts making big plans, flag it in the comm log right away and text the BA. She is doing really well at Stage 5. Give her meaningful tasks — she thrives on purpose." },
    },
  ],
  "Home B":[
    {
      id:"R002", name:"Jonah Kwame", dob:"1990-05-18", age:35,
      photo:"👨🏾", stage:9, home:"Home B",
      diagnosis:["Intellectual Disability – Mild","Anxiety Disorder"],
      allergies:["Aspirin"],
      dnr:false,
      dietaryTexture:"Regular",
      dietaryAlert:null,
      seizureHistory:false,
      seizurePlan:null,
      communication:"Verbal – excellent. Fully conversational.",
      behavioralTriggers:["Uncertainty about plans","Crowded unexpected environments"],
      physician:"Dr. Robert Chen – (727) 555-0440",
      guardian:"Kwame Sr. (Father) – (727) 555-0990",
      emergencyContact:"Kwame Sr. – (727) 555-0990",
      insurance:"Florida Medicaid – ID: FL-MED-0034511",
      ibStatus:"IB – STEP-DOWN OVERDUE. Ready to Fly.",
      ba:"Sarah Patterson, BCBA – (727) 555-0614",
      wallet:{ balance:203.00, transactions:[
        {date:"2026-05-07",desc:"Grocery outing",amount:-34.50,staff:"Janet Williams",receipt:"PBX-20260507"},
        {date:"2026-05-04",desc:"Monthly stipend",amount:200.00,staff:"System",receipt:"STD-MAY"},
        {date:"2026-04-28",desc:"Movie outing",amount:-12.50,staff:"Carlos Rivera",receipt:"AMC-20260428"},
        {date:"2026-04-04",desc:"April stipend",amount:50.00,staff:"System",receipt:"STD-APR"},
      ]},
      pillCounts:{ "M008":{current:11,perDay:1,label:"Escitalopram 10mg"} },
      meds:[
        { id:"M008", name:"Escitalopram 10mg", route:"Oral", times:["8:00 AM"], ndc:"00456-2010-01", instructions:"Take with or without food. Consistent timing.", controlled:false },
      ],
      notes:"SUCCESS STORY. Stage 9 for 42 days. Step-down to assisted living being pursued. Give him responsibilities.",
      pcm:["Collaborative problem-solving — involve him in decisions","Acknowledge autonomy: ask, don't tell, when possible","Natural consequences approach — BA-approved"],
      prohibited:["⛔ Prone (face-down) restraint — civil rights violation / APD reportable","⛔ Any intervention that undermines his demonstrated independence","⛔ Treating him as a lower-stage resident — he has earned Stage 9 status"],
      bakerAct:{ statute:"FL Statute 394.463", history:false, historyNote:"No Baker Act history. Stage 9 — no current clinical concerns.", threshold:"Not currently applicable. If regression to Stage 7+ persists 7+ days, consult BA for reassessment.", nonVerbalNote:null },
      behaviorPlan:{ clinicalDesc:"Maintenance protocol — no active behavioral intervention required. Goals: LRE transition planning, ADL independence skill generalization, supported decision-making practice.", plainDesc:"Jonah is ready to fly. Your job with him is more like a life coach than a caregiver. Involve him in house decisions where possible, let him mentor newer residents, and document any steps he takes toward independence — they all count toward his assisted living transition plan." },
    },
    {
      id:"R006", name:"Ramon Velasquez", dob:"1999-02-07", age:27,
      photo:"👨🏽", stage:3, home:"Home B",
      diagnosis:["Autism Spectrum Disorder – Level 2","Epilepsy – Controlled"],
      allergies:["Shellfish","Carbamazepine"],
      dnr:false,
      dietaryTexture:"Ground",
      dietaryAlert:"⚠ GROUND TEXTURE ONLY — seizure medication affects swallowing reflex",
      seizureHistory:true,
      seizurePlan:{
        atStart:"Position on side, clear airway, begin timing, do NOT restrain",
        at3min:"Call 911 — Ramon's seizures exceed 3 min baseline",
        at5min:"Administer Diastat 7.5mg rectal — locked cabinet, key on duty ring",
        post:"Lateral recovery position until fully alert. Document and call Dr. Patel."
      },
      communication:"Minimal verbal. Uses AAC device. Approach slowly and calmly.",
      behavioralTriggers:["Loud TV or music","Unexpected touch","Transition between activities","Missing preferred items"],
      physician:"Dr. Anita Patel – (727) 555-0340",
      guardian:"Elena Velasquez (Mother) – (813) 555-0553",
      emergencyContact:"Elena Velasquez – (813) 555-0553",
      insurance:"Florida Medicaid – ID: FL-MED-0091847",
      ibStatus:"Active IB – Hard Stretch Phase",
      ba:"Tanya Williams, BCaBA – (727) 555-0762",
      wallet:{ balance:31.20, transactions:[
        {date:"2026-05-04",desc:"Monthly stipend",amount:50.00,staff:"System",receipt:"STD-MAY"},
        {date:"2026-05-02",desc:"7-Eleven snacks",amount:-8.80,staff:"Carlos Rivera",receipt:"7EL-20260502"},
        {date:"2026-04-20",desc:"Park outing",amount:-10.00,staff:"Maria Thompson",receipt:"PRK-20260420"},
      ]},
      pillCounts:{ "M009":{current:16,perDay:2,label:"Valproic Acid 250mg"}, "M010":{current:8,perDay:1,label:"Aripiprazole 10mg"} },
      meds:[
        { id:"M009", name:"Valproic Acid 250mg", route:"Oral", times:["8:00 AM","8:00 PM"], ndc:"00074-6214-13", instructions:"SEIZURE MED – Never skip. With food. Watch for unusual bruising.", controlled:false },
        { id:"M010", name:"Aripiprazole 10mg",   route:"Oral", times:["8:00 AM"], ndc:"59148-0006-65", instructions:"Monitor for restlessness. Give with breakfast.", controlled:false },
        { id:"M011", name:"Melatonin 3mg",        route:"Oral", times:["8:30 PM"], ndc:"OTC", instructions:"30 min before bedtime.", controlled:false },
      ],
      notes:"Ramon is in The Hard Stretch. Recent incident INC-007. AAC device must be accessible at all times.",
      pcm:["ALWAYS approach from the front — never from behind","Allow AAC device response time — minimum 15 seconds before prompting","Low-stimulation redirection: dim lights, reduce noise before approach","No physical prompt without verbal announcement first"],
      prohibited:["⛔ Prone (face-down) restraint — civil rights violation / APD reportable","⛔ Removing AAC device for any reason during a behavioral episode","⛔ Rapid approach or sudden touch","⛔ More than 2 staff members in room during de-escalation (increases arousal)"],
      bakerAct:{ statute:"FL Statute 394.463", history:false, historyNote:"No Baker Act history. Non-verbal — standard assessment criteria do not apply directly.", threshold:null, nonVerbalNote:"⚠ CRITICAL: Ramon cannot self-report distress verbally. Baker Act threshold assessment must use BEHAVIORAL indicators ONLY: sustained SIB (head-banging, hand-biting >5 min), complete food/fluid refusal 24+ hrs, loss of seizure medication compliance. DO NOT use verbal consent criteria — consult BA and physician immediately for any crisis assessment." },
      behaviorPlan:{ 
        clinicalDesc:"Target behaviors: SIB (head-banging, hand-biting, face-hitting — function: automatic reinforcement/sensory + escape/avoidance during demand contexts; seizure-related SIB distinguished by post-ictal observation protocol) and Physical Aggression (hitting, biting staff — function: escape). Intervention: sensory integration protocol with scheduled proprioceptive input (weighted vest 20 min 3x daily). Environmental modification: padded surfaces in high-risk zones. FCT via AAC device targeting 'I need a break' and 'This is too much.' RIRD only if AAC unavailable. DRO schedule active. Measurement: duration recording with intensity 1–3, antecedent coded, seizure cross-referenced.",
        plainDesc:"How to support Ramon during self-injury: (1) FIRST — reduce the overwhelming thing immediately. Lower TV/music. Move to quieter space. Give more physical space. (2) Offer his AAC device — point to it and say 'Ramon, break?' Give him the chance to communicate. (3) If SIB continues: calmly guide away from hard surfaces using minimal physical contact. The padded area in his room is available. (4) Do NOT raise your voice, add demands, or try to hold him still — restraint escalates the behavior. (5) SEIZURE AWARENESS: if the SIB looks different — rhythmic, unresponsive to voice, eyes different — follow the seizure protocol immediately. (6) After: document how long it lasted, what you think triggered it, and how it resolved. Any visible injury requires immediate medical documentation and supervisor notification before end of shift.",
        certificationHints:[
          {term:"SIB (Self-Injurious Behavior)", plain:"When a person hurts themselves — head-banging, biting, hitting"},
          {term:"Automatic reinforcement", plain:"The behavior feels good or soothing to the person doing it — the reward comes from inside, not from staff response"},
          {term:"FCT (Functional Communication Training)", plain:"Teaching a safe replacement way to say what the behavior was saying — like using a picture card to say 'I need a break'"},
          {term:"RIRD (Response Interruption and Redirection)", plain:"Gently interrupting the behavior and immediately offering something else to do"},
          {term:"Post-ictal state", plain:"The period after a seizure when a person is often confused, sleepy, or behaving differently than normal"},
        ],
      },
    },
  ],
};

const COMM_LOG_INIT = [
  {id:"CL001",date:"2026-05-09",time:"7:12 AM",staffId:"S001",home:"Home A",category:"Handover",
   text:"Marcus calm overnight. All meds given. Angela had mild anxiety around 4 AM — redirect to weighted blanket worked. Lydia slept through the night.",
   aiFlag:false, flagReason:""},
  {id:"CL002",date:"2026-05-09",time:"8:45 AM",staffId:"S001",home:"Home A",category:"Behavioral",
   text:"Marcus refused breakfast. Sat at table 8 mins then accepted oatmeal. No escalation.",
   aiFlag:false, flagReason:""},
  {id:"CL003",date:"2026-05-08",time:"11:22 PM",staffId:"S002",home:"Home A",category:"Medical",
   text:"Angela hit her head on the cabinet door — minor bump, no bleeding. She said she felt fine. Supervisor notified.",
   aiFlag:true, flagReason:"🚨 Key word 'hit' detected — Incident Report required. 24-hour reporting window active."},
  {id:"CL004",date:"2026-05-08",time:"3:05 PM",staffId:"S001",home:"Home A",category:"General",
   text:"Lydia participated in arts and crafts for 45 minutes. Excellent engagement today.",
   aiFlag:false, flagReason:""},
  {id:"CL005",date:"2026-05-07",time:"10:30 AM",staffId:"S003",home:"Home B",category:"Behavioral",
   text:"Ramon had a meltdown during TV time — neighbor turned volume up. Staff reduced volume, offered headphones. Ramon calmed in 9 minutes.",
   aiFlag:false, flagReason:""},
];

const HANDOVER_TEMPLATE = {
  residents:{},
  allMedsGiven:false,
  allResidentsPresent:false,
  suppliesAdequate:false,
  openIncidents:"",
  outgoingNotes:"",
  outgoingSignature:"",
  incomingSignature:"",
  completedAt:null,
};

const INCIDENT_CHART_DATA = [
  {day:"Mon",incidents:1},{day:"Tue",incidents:0},{day:"Wed",incidents:2},
  {day:"Thu",incidents:1},{day:"Fri",incidents:3},{day:"Sat",incidents:1},{day:"Sun",incidents:0},
];
const MED_COMPLIANCE_DATA = [
  {name:"Marcus",compliance:94},{name:"Lydia",compliance:100},{name:"Angela",compliance:98},
  {name:"Jonah",compliance:100},{name:"Ramon",compliance:96},
];
const STAGE_DIST_DATA = [
  {name:"S0 Honeymoon",value:1,color:"#2D7DD2"},
  {name:"S3 Hard Stretch",value:1,color:"#B93232"},
  {name:"S5 Finding Groove",value:1,color:"#1A7A4A"},
  {name:"S8 Illusion Trap",value:1,color:"#6B0000"},
  {name:"S9 Ready To Fly",value:1,color:"#0D5C2E"},
];
const EVV_DATA = [
  {date:"5/3",billed:16,verified:16},{date:"5/4",billed:24,verified:22},
  {date:"5/5",billed:16,verified:16},{date:"5/6",billed:8,verified:8},
  {date:"5/7",billed:24,verified:24},{date:"5/8",billed:24,verified:21},
  {date:"5/9",billed:8,verified:8},
];

const OPEN_SHIFTS = [
  { id:"OS1", home:"Home B", date:"2026-05-10", shift:"3:00 PM – 11:00 PM", hours:8, urgency:"critical", reason:"No coverage — callout" },
  { id:"OS2", home:"Home C", date:"2026-05-11", shift:"7:00 AM – 3:00 PM",  hours:8, urgency:"warning",  reason:"Scheduled staff requested PTO" },
  { id:"OS3", home:"Home A", date:"2026-05-12", shift:"11:00 PM – 7:00 AM", hours:8, urgency:"warning",  reason:"Holiday weekend — extra coverage" },
  { id:"OS4", home:"Home B", date:"2026-05-13", shift:"7:00 AM – 3:00 PM",  hours:8, urgency:"info",     reason:"Optional overtime available" },
];

const ICONNECT_SYNC = [
  { label:"Incident Reports",          icon:"🚨", count:"9 records",    status:"ready",    readyCount:7, pendingCount:2 },
  { label:"MAR (Medication Admin)",    icon:"💊", count:"312 entries",  status:"ready",    readyCount:312,pendingCount:0 },
  { label:"Communication Logs",        icon:"📝", count:"84 entries",   status:"ready",    readyCount:84, pendingCount:0 },
  { label:"EVV / Shift Records",       icon:"📍", count:"47 records",   status:"ready",    readyCount:47, pendingCount:0 },
  { label:"Behavioral Data",           icon:"🧠", count:"28 BA notes",  status:"warning",  readyCount:21, pendingCount:7 },
  { label:"IB Reclassification Data",  icon:"📋", count:"5 residents",  status:"warning",  readyCount:3,  pendingCount:2 },
];

const MED_SUPPLY_RADAR = [
  { subject:"Risperidone", Marcus:12, Angela:0, Jonah:0, Lydia:0, Ramon:0, full:30 },
  { subject:"Sertraline",  Marcus:22, Angela:0, Jonah:0, Lydia:0, Ramon:0, full:30 },
  { subject:"Lorazepam",   Marcus:3,  Angela:0, Jonah:0, Lydia:0, Ramon:0, full:30 },
  { subject:"Buspirone",   Marcus:0,  Angela:0, Jonah:0, Lydia:20,Ramon:0, full:30 },
  { subject:"Quetiapine",  Marcus:0,  Angela:6, Jonah:0, Lydia:0, Ramon:0, full:30 },
  { subject:"Valproic",    Marcus:0,  Angela:0, Jonah:0, Lydia:0, Ramon:8, full:30 },
  { subject:"Aripiprazole",Marcus:0,  Angela:0, Jonah:14,Lydia:0, Ramon:9, full:30 },
];

const FAMILY_DB = {
  "F001":{ id:"F001", residentId:"R001", residentHome:"Home A", name:"Dorothy Dubois",   relation:"Mother", pin:"4321" },
  "F002":{ id:"F002", residentId:"R003", residentHome:"Home A", name:"Rosa Mercado",     relation:"Mother", pin:"8765" },
  "F003":{ id:"F003", residentId:"R002", residentHome:"Home B", name:"Kwame Sr.",         relation:"Father", pin:"2109" },
  "F004":{ id:"F004", residentId:"R005", residentHome:"Home A", name:"Thomas Fontaine",  relation:"Brother", pin:"5544" },
  "F005":{ id:"F005", residentId:"R006", residentHome:"Home B", name:"Elena Velasquez",  relation:"Mother", pin:"7733" },
};

const ADMIN_DB = {
  "A001":{ id:"A001", name:"Shondra Baxter",   role:"Program Manager", pin:"0000", homes:["Home A","Home B","Home C"] },
  "A002":{ id:"A002", name:"Reginald Okafor",  role:"Clinical Director", pin:"9999", homes:["Home A","Home B","Home C"] },
};

const FIDELITY_DATA = [
  { staffId:"S001", name:"Maria Thompson",  totalLogs:42, flaggedLogs:1, avgClaimedMin:18, avgActualMin:17, score:97, trend:"+2" },
  { staffId:"S002", name:"Carlos Rivera",   totalLogs:31, flaggedLogs:4, avgClaimedMin:22, avgActualMin:9,  score:71, trend:"-8" },
  { staffId:"S003", name:"Janet Williams",  totalLogs:58, flaggedLogs:0, avgClaimedMin:16, avgActualMin:15, score:100,trend:"+1" },
  { staffId:"S004", name:"Deja Mosley",     totalLogs:24, flaggedLogs:2, avgClaimedMin:20, avgActualMin:14, score:83, trend:"0" },
];

const ORG_ALERTS = [
  { type:"pill",    severity:"critical", home:"Home A", msg:"Marcus Dubois — Lorazepam 0.5mg: 2 days supply remaining",          time:"Now" },
  { type:"evv",     severity:"warning",  home:"Home B", msg:"EVV discrepancy 5/8: Billed 8hrs, GPS-verified 5hrs — Carlos Rivera",time:"5/8" },
  { type:"fidelity",severity:"warning",  home:"Home A", msg:"Fidelity flag: Carlos Rivera claimed 25-min ROM exercise, timer 6min",time:"Yesterday" },
  { type:"incident",severity:"critical", home:"Home B", msg:"Incident INC-009 — 24-hr APD reporting window closes in 3 hours",    time:"3 hrs left" },
  { type:"ib",      severity:"info",     home:"Home B", msg:"Jonah Kwame — Step-down overdue 42 days. IB Review required.",       time:"Overdue" },
];

const DEMO_STEPS = [
  { id:"entry",    icon:"🔐", title:"The Problem — $4.2B Lost Annually",            stat:"$4.2B in Medicaid fraud & billing errors in FL alone",
    body:"Florida APD serves 58,000 individuals with disabilities. The current system relies on paper logs, inconsistent handovers, and manual med counts — resulting in preventable deaths, financial exploitation, and state deficiency citations that go undetected for months." },
  { id:"clockin",  icon:"📍", title:"Any House. Any Shift. GPS-Verified.",           stat:"Zero ghost billing — every clock-in GPS-anchored",
    body:"Staff clock into any house, any time — eliminating shift coverage gaps. Unlike legacy EVV systems, LUMINARK links GPS-verified presence to specific billing codes in real time. Overtime at a different house? The system flags and approves it automatically, preventing double-billing fraud." },
  { id:"safety",   icon:"💊", title:"Three-Way Med Verification — Zero Error Margin", stat:"34% of APD deficiency citations involve med errors",
    body:"The medication scanner performs a live three-way match: Right Resident · Right Medication · Right Time. Controlled substances require dual-witness PIN sign-off. PRN medications trigger a mandatory 30-minute effectiveness follow-up. Dropped pill? The destruction log creates a permanent chain of custody." },
  { id:"facesheet",icon:"📋", title:"The Full Clinical Picture — In the Staff's Hand", stat:"Seizure plans, DNR, dietary alerts — one tap away",
    body:"Every resident's face sheet includes real-time access to seizure action plans, DNR status, dietary texture alerts (preventing choking), behavioral triggers, and one-tap emergency protocols. Staff no longer search binders during a crisis — the right information surfaces at the right moment." },
  { id:"sentinel", icon:"🧠", title:"AI Sentinel — Catches What Humans Miss",        stat:"24-hour APD reporting window — never missed again",
    body:"Every communication log entry is scanned for incident-trigger language in real time. Words like 'hit', 'fell', 'refused', 'seized' auto-flag the entry and generate a complete APD-compliant Incident Report draft in seconds — with required notifications, timestamps, and follow-up actions pre-populated." },
  { id:"fidelity", icon:"⏱", title:"Pencil-Whipping Detection — BA Effectiveness Engine", stat:"Estimated 18% of logged activity hours are falsified",
    body:"Staff claim they performed a 20-minute range-of-motion exercise. The task timer ran 4 minutes. LUMINARK flags the discrepancy, attaches it to the staff member's Fidelity Score, and surfaces it on the manager dashboard — creating a self-auditing workforce without adversarial oversight." },
  { id:"family",   icon:"👨‍👩‍👧", title:"The Family Guardian Portal — Built-In Accountability", stat:"Financial exploitation: #1 complaint to FL Abuse Hotline",
    body:"Families receive a secure portal showing their loved one's stage, wallet ledger with receipts, and filtered daily notes. Every dollar spent on a community outing is logged with a receipt. Families become the auditors — at zero cost to the state. Political support guaranteed." },
  { id:"bizcase",  icon:"📈", title:"The Business Case — $3.9B 5-Year Projection",  stat:"SaaS licensing: $85–$240/bed/month across FL's 3,800 homes",
    body:"LUMINARK deploys as a vendor-neutral SaaS platform. No hardware. No state infrastructure investment. Licensing fees are offset by Medicaid fraud recovery alone. Early adoption by 10% of Florida APD homes generates $18M ARR in Year 1, scaling to full-state deployment in Year 3 with DOJ and CMS compliance certification." },
];

// ─── KAIROS ENGINE — CANONICAL NSDT CLASSIFIER ─────────────────────────────────
// Weighted Euclidean distance classifier — direct port of sap_kairos_geometry.py
// Centroids, weights, and scales are identical to the Kairos FastAPI engine (port 8002)
// Source: foreverforward760-crypto/Kairos · foreverforward760-crypto/LUMINARK-Axiom-Systems-Engine-LASE-v1.1
const KAIROS_CENTROIDS = [
  [0.0, 0.0, 0.0, 0.0, 0.0],  // S0 The Honeymoon
  [1.0, 8.0, 1.0, 1.0, 1.0],  // S1 Finding Their Footing
  [2.0, 7.0, 2.0, 2.0, 2.0],  // S2 Showing Their Colors
  [4.0, 7.0, 2.5, 3.0, 4.0],  // S3 The Hard Stretch
  [3.5, 6.5, 3.0, 3.5, 5.0],  // S4 The Turning Point
  [5.0, 4.0, 5.0, 5.0, 4.5],  // S5 Finding Their Groove · Hidden Duality
  [6.0, 5.5, 4.0, 6.0, 6.5],  // S6 Living Well Here
  [6.5, 3.0, 7.0, 7.0, 3.5],  // S7 Stuck In Place
  [7.5, 7.0, 8.0, 2.0, 2.0],  // S8 The Illusion Trap
  [8.0, 2.0, 8.5, 1.5, 1.5],  // S9 Ready To Fly
];
const KAIROS_WEIGHTS = [1.0, 1.5, 1.5, 1.0, 0.8]; // N, S, D, T, C
const KAIROS_SCALES  = [10.0, 10.0, 10.0, 10.0, 10.0];
const KAIROS_TRAP_AMPLIFIER = 1.45; // Stage 8 TrapScore amplifier — canonical SAP constant

// NSDT axis definitions — plain language for staff, scientific parallel for disclosure
const NSDT_AXES = [
  {
    id:"N", label:"Behavioral Complexity",
    staffQ:"How many different, shifting behaviors or needs are showing up today?",
    hint:"Few and predictable → Many and unpredictable",
    sciParallel:"Shannon information entropy — a measure of unpredictability in a signal",
  },
  {
    id:"S", label:"Baseline Stability",
    staffQ:"How steady and consistent is this person's baseline right now?",
    hint:"Very unstable → Very stable",
    sciParallel:"Homeostatic stability — the organism's capacity to maintain internal equilibrium (Claude Bernard, 1865)",
  },
  {
    id:"D", label:"Distress / Tension Level",
    staffQ:"How much active distress, agitation, or behavioral tension is present?",
    hint:"No tension → Extreme distress",
    sciParallel:"Allostatic load — cumulative physiological cost of chronic stress exposure (McEwen & Stellar, 1993)",
  },
  {
    id:"T", label:"Adaptability",
    staffQ:"How readily does this person adjust when routines or plans change?",
    hint:"Rigid / no flexibility → Highly adaptable",
    sciParallel:"Behavioral flexibility — cognitive and behavioral adaptation capacity (executive function research, Luria 1966)",
  },
  {
    id:"C", label:"Behavioral Coherence",
    staffQ:"How consistent and predictable is this person's behavior across different settings today?",
    hint:"Fragmented / inconsistent → Coherent and consistent",
    sciParallel:"Neural coherence — synchronized pattern consistency across brain regions and time (Varela et al., 2001)",
  },
];

// Pure JavaScript implementation of Kairos weighted Euclidean distance classifier
function runKairosClassifier(nsdt) {
  // nsdt: [N, S, D, T, C] each 0–10
  const distances = KAIROS_CENTROIDS.map(centroid => {
    let sum = 0;
    for (let i = 0; i < 5; i++) {
      const diff = (nsdt[i] - centroid[i]) / KAIROS_SCALES[i];
      sum += KAIROS_WEIGHTS[i] * diff * diff;
    }
    return Math.sqrt(sum);
  });

  // Softmax posterior (temperature 0.7)
  const logits = distances.map(d => -d);
  const maxL = Math.max(...logits);
  const temp = 0.7;
  const exps = logits.map(l => Math.exp((l - maxL) / temp));
  const total = exps.reduce((a, b) => a + b, 0);
  const posterior = exps.map(e => e / total);

  const dominant = posterior.indexOf(Math.max(...posterior));
  const expectedStage = posterior.reduce((sum, p, i) => sum + p * i, 0);
  const entropy = -posterior.reduce((sum, p) => sum + (p > 1e-12 ? p * Math.log(p + 1e-12) : 0), 0);

  // TrapScore — Stage 8 distance with 1.45× amplifier
  const stage8dist = distances[8];
  const trapScore = dominant === 8
    ? Math.min(1.0, (1.0 / (stage8dist + 0.01)) * KAIROS_TRAP_AMPLIFIER)
    : Math.min(1.0, (1.0 / (stage8dist + 0.01)));

  // Bifurcation flag — Stage 5 bilateral threshold
  const bifurcation = posterior[5] > 0.25 || (dominant === 5 && entropy > 0.8);

  // Stability flag — Tumbling Inversion (odd stages physically unstable)
  const isOdd = dominant % 2 !== 0;
  const inversionState = dominant === 9
    ? "Accepted — conscious dissolution, no tension"
    : isOdd
    ? "Physically unstable / Consciously stable — behavior is the communication"
    : "Physically stable / Consciously seeking — internal processing is primary";

  return { dominant, posterior, expectedStage, entropy, trapScore, bifurcation, inversionState, distances };
}

// ─── LIABILITY & METHODOLOGY DISCLOSURE ────────────────────────────────────────
function LiabilityBanner() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background:"#0A1218", borderBottom:`1px solid #1E3A4A`, fontSize:11 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"6px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <div style={{ color:"#5A8A9A", lineHeight:1.5 }}>
          <strong style={{color:"#7AACBC"}}>LUMINARK Stage Intelligence</strong> is a computational behavioral pattern tracking system.
          It does not diagnose, treat, or constitute medical advice.
          All outputs require interpretation by a qualified clinician.
          <span onClick={()=>setExpanded(p=>!p)} style={{ color:"#C8A020", cursor:"pointer", marginLeft:8, textDecoration:"underline" }}>
            {expanded ? "Hide methodology ▲" : "View full methodology & scientific basis ▼"}
          </span>
        </div>
        <div style={{ color:"#3A6A7A", whiteSpace:"nowrap", fontSize:10 }}>
          MAAT · Stanfield's Axiom of Perpetuity · Not FDA-cleared
        </div>
      </div>
      {expanded && (
        <div style={{ background:"#0D1F2D", padding:"20px 28px", borderTop:`1px solid #1E3A4A`, maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#C8A020", marginBottom:10, fontFamily:"Georgia,serif" }}>What LUMINARK Stage Intelligence Is</div>
              <div style={{ fontSize:12, color:"#8AAABB", lineHeight:1.9 }}>
                LUMINARK uses a five-dimensional behavioral observation vector (NSDT) and a weighted Euclidean distance classifier — the same mathematical method used in validated clinical decision support systems — to classify a resident's current behavioral pattern against ten reference stage profiles. The output is a <strong style={{color:"#C8E0E8"}}>pattern classification</strong>, not a clinical diagnosis.
                <br/><br/>
                Stage classifications describe <em>where a person appears to be in a recognizable behavioral process</em> — the same way a meteorologist classifies weather patterns without diagnosing the atmosphere. The purpose is to give staff, clinicians, and administrators a shared language and a structured framework for observation, documentation, and proactive support.
              </div>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#C8A020", marginBottom:10, fontFamily:"Georgia,serif" }}>Scientific Foundations</div>
              <div style={{ display:"grid", gap:8 }}>
                {[
                  ["Bayesian Classification","The stage classifier uses weighted Euclidean distance with softmax posterior normalization — identical to the statistical architecture of FDA-cleared clinical decision support systems."],
                  ["Allostatic Load Theory","The Tension (D) axis operationalizes the physiological stress burden construct established by McEwen & Stellar (1993) — a peer-reviewed framework used in clinical medicine."],
                  ["Polyvagal Theory","Stage inversion states (Physically Unstable / Consciously Stable) map to the autonomic nervous system hierarchy established by Porges (1994) — ventral vagal, sympathetic mobilization, and dorsal vagal shutdown."],
                  ["Bifurcation Theory","Stage 5's bilateral threshold is mathematically equivalent to a bifurcation point in nonlinear dynamical systems — a proven construct in physics and systems biology where small perturbations determine which of multiple stable states a system moves toward."],
                  ["Information Entropy","The Complexity (N) axis is operationalized as behavioral information entropy (Shannon, 1948) — measuring unpredictability in behavioral output, not clinical disorder."],
                  ["Phase Transition Dynamics","Stage 3, 6, and 7 dynamics parallel phase transitions in physical systems — points of maximum instability that precede reorganization into a new stable state."],
                ].map(([title, body]) => (
                  <div key={title} style={{ padding:"8px 12px", background:"#0A1A28", borderRadius:8, borderLeft:`3px solid #C8A02044` }}>
                    <div style={{ fontSize:11, fontWeight:800, color:"#C8A020", marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:11, color:"#7A9AAA", lineHeight:1.7 }}>{body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop:16, padding:"10px 16px", background:"#0A1018", borderRadius:8, borderLeft:`3px solid #C83020` }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#C83020", marginBottom:4 }}>Important Limitations</div>
            <div style={{ fontSize:11, color:"#8AAABB", lineHeight:1.8 }}>
              LUMINARK stage classifications are based on staff observations logged at a single point in time. They are not validated against clinical diagnostic criteria (DSM-5, ICD-11) and should not be used as a substitute for formal psychological or psychiatric assessment.
              Stage movement predictions are probabilistic, not deterministic. A resident's actual trajectory may differ from the system's estimate.
              All clinical decisions — medication changes, restraint authorization, Baker Act initiation, discharge planning — must be made by qualified licensed professionals using their full clinical judgment.
              LUMINARK outputs are observational documentation tools. They inform clinical conversation. They do not replace it.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NSDT OBSERVATION LOGGER ────────────────────────────────────────────────────
function NSDTLogger({resident, onClassified}) {
  const [values, setValues] = useState([5, 5, 5, 5, 5]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [narrative, setNarrative] = useState("");

  const runClassification = async () => {
    setRunning(true);
    const engineResult = runKairosClassifier(values);
    setResult(engineResult);

    // Claude generates the narrative layer on top of the classification
    const txt = await callClaude(
      [{role:"user", content:`A behavioral pattern classifier (Kairos NSDT Engine — Stanfield's Axiom of Perpetuity) has analyzed observational data for a group home resident and returned the following classification:

Resident: ${resident.name}
Current documented stage: S${resident.stage} (${STAGES[resident.stage].name})
NSDT observation vector logged by staff:
- Behavioral Complexity (N): ${values[0]}/10
- Baseline Stability (S): ${values[1]}/10
- Distress / Tension (D): ${values[2]}/10
- Adaptability (T): ${values[3]}/10
- Behavioral Coherence (C): ${values[4]}/10

Engine classification result:
- Classified Stage: S${engineResult.dominant} (${STAGES[engineResult.dominant].name})
- Classifier confidence: ${(Math.max(...engineResult.posterior) * 100).toFixed(1)}%
- Expected stage value: ${engineResult.expectedStage.toFixed(2)}
- TrapScore: ${engineResult.trapScore.toFixed(3)}
- Inversion state: ${engineResult.inversionState}
- Bifurcation flag: ${engineResult.bifurcation ? "ACTIVE — bilateral threshold detected" : "Not active"}

Using this classification as your foundation, generate a plain-language clinical support note (3-4 sentences, no mystical language, grounded in behavioral observation) for the care team. 
- If the classified stage differs from the documented stage, note this and explain what it may indicate about movement direction.
- If TrapScore > 0.6, flag the Perceived Permanence risk and name what staff should look for.
- If the bifurcation flag is active, explain what that means practically for this resident's care plan right now.
- End with one specific, actionable recommendation.
Format as plain prose. No headers. No bullet points.`}],
      "You are a behavioral support specialist providing observational pattern notes for an APD group home team. You do not diagnose. You do not prescribe. You describe behavioral patterns and their implications for care planning using plain, professional language. Never use the term 'SAP' or 'Kairos' in your output — refer to 'the pattern classifier' if needed. Always note that your output informs but does not replace qualified clinical judgment."
    );
    setNarrative(txt);
    setRunning(false);
    if (onClassified) onClassified({ ...engineResult, nsdt: values, narrative: txt });
  };

  const enginePreview = runKairosClassifier(values);
  const previewStage = STAGES[enginePreview.dominant];

  return (
    <Card style={{ border:`2px solid ${C.teal}33` }}>
      <div style={{ padding:"12px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, borderRadius:"12px 12px 0 0" }}>
        <div style={{ fontSize:13, fontWeight:800, color:C.white }}>✦ NSDT Behavioral Observation — Kairos Classification</div>
        <div style={{ fontSize:11, color:"#8fb3d4", marginTop:2 }}>Rate what you observe right now. The engine classifies the pattern. This is not a diagnosis.</div>
      </div>
      <div style={{ padding:16 }}>
        {/* Live preview badge */}
        <div style={{ padding:"10px 14px", background:previewStage.bg, borderRadius:10, border:`2px solid ${previewStage.color}44`, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:previewStage.color, textTransform:"uppercase", letterSpacing:.5 }}>Live Pattern Preview</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.navy }}>{previewStage.symbol} S{enginePreview.dominant}: {previewStage.name}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:C.text3 }}>Confidence: <strong style={{color:previewStage.color}}>{(Math.max(...enginePreview.posterior)*100).toFixed(0)}%</strong></div>
            {enginePreview.bifurcation && <div style={{ fontSize:11, fontWeight:700, color:C.gold }}>⭐ Bifurcation Active</div>}
            {enginePreview.trapScore > 0.6 && <div style={{ fontSize:11, fontWeight:700, color:C.red }}>⚠ TrapScore {enginePreview.trapScore.toFixed(2)}</div>}
          </div>
        </div>

        {/* NSDT sliders */}
        <div style={{ display:"grid", gap:12, marginBottom:16 }}>
          {NSDT_AXES.map((axis, i) => (
            <div key={axis.id}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <div>
                  <span style={{ fontSize:12, fontWeight:800, color:C.navy }}>{axis.id}: {axis.label}</span>
                  <span style={{ fontSize:11, color:C.text3, marginLeft:8 }}>{axis.staffQ}</span>
                </div>
                <span style={{ fontSize:15, fontWeight:800, color:C.teal, minWidth:24, textAlign:"right" }}>{values[i]}</span>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:10, color:C.text3, whiteSpace:"nowrap" }}>0 {axis.hint.split(" → ")[0]}</span>
                <input type="range" min="0" max="10" step="0.5" value={values[i]}
                  onChange={e => setValues(v => { const n=[...v]; n[i]=parseFloat(e.target.value); return n; })}
                  style={{ flex:1, accentColor:C.teal }}/>
                <span style={{ fontSize:10, color:C.text3, whiteSpace:"nowrap" }}>{axis.hint.split(" → ")[1]} 10</span>
              </div>
              <div style={{ fontSize:10, color:C.text3, fontStyle:"italic", marginTop:2 }}>Scientific basis: {axis.sciParallel}</div>
            </div>
          ))}
        </div>

        <Btn v="teal" full onClick={runClassification}>{running ? "Running Kairos Classifier..." : "✦ Run NSDT Classification"}</Btn>
        <div style={{ fontSize:10, color:C.text3, textAlign:"center", marginTop:6 }}>
          Weighted Euclidean distance classifier · Identical to Kairos engine (LASE v1.1) · Results inform — do not replace — clinical judgment
        </div>

        {result && narrative && (
          <div style={{ marginTop:14, display:"grid", gap:10 }}>
            {/* Posterior distribution */}
            <div style={{ padding:"12px 14px", background:C.gray0, borderRadius:10 }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Stage Posterior Distribution</div>
              <div style={{ display:"grid", gap:4 }}>
                {result.posterior.map((p, s) => (
                  <div key={s} style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:STAGES[s].color, width:140, flexShrink:0 }}>S{s} {STAGES[s].name.split(" ").slice(0,2).join(" ")}</span>
                    <div style={{ flex:1, height:6, background:C.gray2, borderRadius:3 }}>
                      <div style={{ height:6, borderRadius:3, background:s===result.dominant?STAGES[s].color:`${STAGES[s].color}66`, width:`${(p*100).toFixed(1)}%`, transition:"width .3s" }}/>
                    </div>
                    <span style={{ fontSize:11, color:s===result.dominant?STAGES[s].color:C.text3, fontWeight:s===result.dominant?800:400, width:36, textAlign:"right" }}>{(p*100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, display:"flex", gap:12, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:C.text3 }}>Entropy: <strong>{result.entropy.toFixed(3)}</strong></span>
                <span style={{ fontSize:11, color:C.text3 }}>Expected stage: <strong>{result.expectedStage.toFixed(2)}</strong></span>
                <span style={{ fontSize:11, color:result.trapScore>0.6?C.red:C.text3 }}>TrapScore: <strong>{result.trapScore.toFixed(3)}</strong></span>
                <span style={{ fontSize:11, color:C.text3 }}>Inversion: <strong>{result.inversionState.split(" —")[0]}</strong></span>
              </div>
            </div>

            {/* Narrative */}
            <div style={{ padding:"14px 16px", background:STAGES[result.dominant].bg, borderRadius:10, borderLeft:`4px solid ${STAGES[result.dominant].color}` }}>
              <div style={{ fontSize:11, fontWeight:800, color:STAGES[result.dominant].color, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>
                ✦ Pattern Support Note — S{result.dominant}: {STAGES[result.dominant].name}
              </div>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.9 }}>{narrative}</div>
              <div style={{ marginTop:10, fontSize:10, color:C.text3, fontStyle:"italic" }}>
                This note is generated from staff observations and classifier output. It is observational documentation, not clinical assessment.
                It must be reviewed by a qualified clinician before influencing any care decision.
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

const BEI_DATA = [
  { ba:"Sarah P., BCBA",  clients:3, bei:81, progress:78, revision:92, accessibility:73, stagnation:0,  flag:"good" },
  { ba:"Dr. James R.",    clients:3, bei:42, progress:28, revision:31, accessibility:41, stagnation:2,  flag:"fraud" },
  { ba:"Tanya W., BCaBA", clients:2, bei:38, progress:24, revision:18, accessibility:58, stagnation:1,  flag:"fraud" },
];

const ABA_JARGON = [
  ["Antecedent",              "What happened right before (the trigger)",                               "e.g. TV turned up loud before Marcus started yelling"],
  ["Behavior",                "What the resident actually did — describe exactly",                       "e.g. Yelled for 3 min, threw a cup — not 'was aggressive'"],
  ["Consequence",             "What happened right after",                                               "e.g. Staff turned off TV; Marcus stopped within 1 minute"],
  ["Positive Reinforcement",  "Giving something good to make a behavior happen more",                   "e.g. Tablet time after Marcus uses words instead of yelling"],
  ["Negative Reinforcement",  "Removing something unpleasant to encourage a behavior",                  "e.g. Allowing break from loud activity when requested calmly"],
  ["Extinction",              "Stopping giving attention to make a behavior fade",                       "e.g. Don't respond to yelling for snacks — only follow plan"],
  ["Eloping / Elopement",     "Running away / leaving without permission",                               "e.g. 'Marcus left the home without telling anyone'"],
  ["FBA",                     "Finding out WHY the behavior is happening",                               "e.g. Is Marcus hitting to escape, get attention, or pain?"],
  ["DRA",                     "Rewarding a replacement behavior instead",                                "e.g. Reward table-tapping instead of yelling"],
  ["Generalization",          "Using the skill in different places",                                     "e.g. Marcus asks for juice at home AND at the restaurant"],
  ["LRE",                     "The most independent living situation possible",                          "e.g. Step-down from IB to standard group home"],
  ["PCM",                     "Approved physical/behavioral crisis techniques",                          "e.g. Only the specific techniques listed on the resident's plan"],
];

// ─── AI CALL ───────────────────────────────────────────────────────────────────
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─── SHARED UI ─────────────────────────────────────────────────────────────────
function Card({children, style}) {
  return <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.gray1}`, boxShadow:"0 2px 12px rgba(0,0,0,.05)", overflow:"hidden", ...style }}>{children}</div>;
}
function CardHdr({title, sub, right, dark}) {
  return (
    <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.gray1}`, display:"flex", alignItems:"center", justifyContent:"space-between",
      background: dark ? `linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)` : C.white }}>
      <div>
        <div style={{ fontWeight:700, fontSize:14, color: dark ? C.white : C.navy, fontFamily:"'Georgia', serif" }}>{title}</div>
        {sub && <div style={{ fontSize:11, color: dark ? "#8fb3d4" : C.text3, marginTop:1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
function Btn({children, onClick, v="default", small, full, style:sx={}}) {
  const vs = {
    default:{ bg:C.gray1, col:C.text, bdr:C.gray2 },
    primary:{ bg:C.navy, col:C.white, bdr:C.navy },
    gold:   { bg:C.gold, col:C.white, bdr:C.gold },
    green:  { bg:C.green, col:C.white, bdr:C.green },
    red:    { bg:C.red, col:C.white, bdr:C.red },
    orange: { bg:C.orange, col:C.white, bdr:C.orange },
    ghost:  { bg:"transparent", col:C.navy, bdr:C.navy3 },
    teal:   { bg:C.teal, col:C.white, bdr:C.teal },
    purple: { bg:C.purple, col:C.white, bdr:C.purple },
  };
  const s = vs[v] || vs.default;
  return (
    <button onClick={onClick} style={{ padding:small?"5px 11px":"9px 18px", borderRadius:9, fontSize:small?11:13,
      fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:`1px solid ${s.bdr}`,
      background:s.bg, color:s.col, width:full?"100%":"auto", transition:"opacity .15s", ...sx }}>
      {children}
    </button>
  );
}
function Tag({label, color, bg, small}) {
  return <span style={{ display:"inline-flex", alignItems:"center", padding:small?"2px 8px":"4px 12px",
    borderRadius:20, fontSize:small?10:12, fontWeight:700, background:bg||C.goldlt, color:color||C.gold,
    letterSpacing:.3, whiteSpace:"nowrap" }}>{label}</span>;
}
function Textarea({label, value, onChange, placeholder, rows=3, required}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.gray2}`,fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
    </div>
  );
}
function Inp({label, value, onChange, placeholder, type="text"}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.gray2}`,fontSize:13,fontFamily:"inherit",background:C.white,color:C.text,boxSizing:"border-box"}}/>
    </div>
  );
}
function ResidentBar({resident}) {
  if (!resident) return null;
  const s = STAGES[resident.stage];
  return (
    <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`,
      padding:"10px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:`3px solid ${s.color}`, borderRadius:"12px 12px 0 0" }}>
      <div style={{ fontSize:44, lineHeight:1, background:s.bg, borderRadius:12, padding:"4px 8px", border:`2px solid ${s.color}44` }}>{resident.photo}</div>
      <div style={{flex:1}}>
        <div style={{ fontSize:20, fontWeight:800, color:C.white, fontFamily:"'Georgia',serif" }}>{resident.name}</div>
        <div style={{ display:"flex", gap:8, marginTop:4, flexWrap:"wrap" }}>
          <Tag label={`S${s.id}: ${s.name}`} color={s.color} bg={s.bg} small/>
          <Tag label={`Age ${resident.age}`} color={C.white} bg={`${C.white}22`} small/>
          {resident.allergies.map(a=><Tag key={a} label={`⚠ ${a}`} color={C.white} bg={C.redmed} small/>)}
          {resident.dnr && <Tag label="⛔ DNR" color={C.white} bg={C.red} small/>}
          <Tag label={resident.dietaryTexture} color={C.teal} bg={C.teallt} small/>
        </div>
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:11,color:"#7aA4C4"}}>Assigned BA</div>
        <div style={{fontSize:12,color:C.white,fontWeight:600}}>{resident.ba?.split("–")[0].trim()}</div>
        <div style={{fontSize:11,color:"#7aA4C4",marginTop:4}}>Guardian</div>
        <div style={{fontSize:12,color:C.white,fontWeight:600}}>{resident.guardian?.split("(")[0].trim()}</div>
      </div>
    </div>
  );
}

// ─── ADMIN PORTAL ──────────────────────────────────────────────────────────────
function AdminPortal({admin, onLogout}) {
  const [tab, setTab] = useState("overview");
  const allResidents = Object.values(RESIDENTS_DB).flat();

  const hoursData = Object.entries(STAFF_DB).map(([id,s])=>{
    const shifts = PAY_PERIOD.shifts[id]||[];
    const total = shifts.reduce((a,sh)=>a+sh.hours,0);
    return { name:s.name.split(" ")[0], regular:Math.min(total,40), ot:Math.max(0,total-40), total };
  });

  const homeSummary = Object.entries(HOMES).map(([name,h])=>{
    const res = RESIDENTS_DB[name]||[];
    const staffOnShift = SCHEDULE_DB.filter(s=>s.date==="2026-05-09"&&s.home===name).length;
    const highTension = res.filter(r=>STAGES[r.stage].tension>=7).length;
    const pillLow = res.flatMap(r=>Object.entries(r.pillCounts||{})).filter(([,pc])=>Math.floor(pc.current/pc.perDay)<=7).length;
    return { name, residents:res.length, staffOnShift, highTension, pillLow, license:h.license };
  });

  const criticalAlerts = ORG_ALERTS.filter(a=>a.severity==="critical");
  const TABS = [
    {id:"overview",    icon:"🏠", label:"Org Overview"},
    {id:"fidelity",    icon:"⏱", label:"Staff Fidelity"},
    {id:"evv",         icon:"📍", label:"EVV / Billing"},
    {id:"alerts",      icon:"🚨", label:`Alerts ${ORG_ALERTS.length}`},
    {id:"scheduling",  icon:"📅", label:"Open Shifts"},
    {id:"export",      icon:"📤", label:"iConnect Export"},
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <LiabilityBanner/>
      {/* ADMIN TOPBAR */}
      <div style={{ background:`linear-gradient(135deg,#0A1628 0%,${C.navy} 100%)`, padding:"0 24px", height:56,
        display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,.4)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:36, height:36, background:C.gold, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:18, color:C.navy, fontFamily:"Georgia,serif" }}>L</div>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>LUMINARK OVERWATCH — ADMIN</div>
            <div style={{ fontSize:11, color:"#7aA4C4" }}>{admin.role} · {admin.name} · All Houses</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {criticalAlerts.length > 0 && (
            <div style={{ padding:"4px 12px", background:C.redmed, borderRadius:20, fontSize:11, fontWeight:700, color:C.white }}>
              🚨 {criticalAlerts.length} Critical Alert{criticalAlerts.length!==1?"s":""}
            </div>
          )}
          <Btn v="ghost" small onClick={onLogout} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>Log Out</Btn>
        </div>
      </div>

      {/* ADMIN NAV */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray1}`, display:"flex", padding:"0 24px", gap:4 }}>
        {TABS.map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"12px 16px", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:500,
              color:tab===t.id?C.navy:C.text3, borderBottom:tab===t.id?`3px solid ${C.gold}`:"3px solid transparent",
              display:"flex", gap:6, alignItems:"center", whiteSpace:"nowrap" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:24 }}>
        {/* ORG OVERVIEW */}
        {tab==="overview" && (
          <div style={{ display:"grid", gap:18 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>Organization Overview — All Houses · May 9, 2026</div>

            {/* House cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {homeSummary.map(h=>(
                <Card key={h.name}>
                  <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)` }}>
                    <div style={{ fontSize:15, fontWeight:800, color:C.white, marginBottom:2 }}>{h.name}</div>
                    <div style={{ fontSize:11, color:"#8fb3d4" }}>{HOMES[h.name]?.address?.split(",")[0]}</div>
                  </div>
                  <div style={{ padding:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      ["Residents",h.residents,"👤",C.navy],
                      ["Staff On Shift",h.staffOnShift,"🕐",C.green],
                      ["High Tension",h.highTension,"⚡",h.highTension>0?C.orange:C.green],
                      ["Pill Supply Low",h.pillLow,"💊",h.pillLow>0?C.red:C.green],
                    ].map(([label,val,icon,col])=>(
                      <div key={label} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9, textAlign:"center" }}>
                        <div style={{ fontSize:20 }}>{icon}</div>
                        <div style={{ fontSize:22, fontWeight:800, color:col }}>{val}</div>
                        <div style={{ fontSize:10, color:C.text3, fontWeight:700, textTransform:"uppercase" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Stage heatmap all houses */}
            <Card>
              <CardHdr title="Resident Tension Heatmap — All Houses" sub="Higher scores indicate more clinical support needed"/>
              <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 }}>
                {allResidents.map(r=>{
                  const st = STAGES[r.stage];
                  const intensity = st.tension / 10;
                  const col = st.tension>7?C.red:st.tension>4?C.orange:C.green;
                  return (
                    <div key={r.id} style={{ padding:"12px 14px", borderRadius:12, background:`${col}12`, border:`2px solid ${col}33` }}>
                      <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                        <span style={{fontSize:22}}>{r.photo}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:800, color:C.text }}>{r.name.split(" ")[0]}</div>
                          <div style={{ fontSize:10, color:C.text3 }}>{r.home}</div>
                        </div>
                      </div>
                      <div style={{ height:5, background:C.gray1, borderRadius:3, marginBottom:4 }}>
                        <div style={{ height:5, borderRadius:3, background:col, width:`${st.tension*10}%` }}/>
                      </div>
                      <div style={{ fontSize:11, fontWeight:700, color:col }}>S{r.stage} · Tension {st.tension}/10</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Staff hours chart */}
            <Card>
              <CardHdr title="Pay Period Hours — All Staff" sub="Apr 28 – May 11 · Regular + Overtime"/>
              <div style={{ padding:"14px 20px" }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={hoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                    <XAxis dataKey="name" tick={{fontSize:11}} stroke={C.gray2}/>
                    <YAxis tick={{fontSize:11}} stroke={C.gray2}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="regular" name="Regular" fill={C.navy} radius={[4,4,0,0]} stackId="a"/>
                    <Bar dataKey="ot" name="Overtime" fill={C.gold} radius={[4,4,0,0]} stackId="a"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* STAFF FIDELITY */}
        {tab==="fidelity" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>Staff Fidelity Scores — BA Effectiveness Engine</div>
            <div style={{ padding:"12px 18px", background:C.goldlt, borderRadius:10, fontSize:13, color:C.text, borderLeft:`4px solid ${C.gold}` }}>
              ✦ Fidelity Score compares claimed task duration against actual task-timer data. Scores below 80 are flagged for supervisor follow-up. Consistent under-100 scores trigger automatic BA review notification.
            </div>
            <div style={{ display:"grid", gap:12 }}>
              {FIDELITY_DATA.map(f=>{
                const scoreColor = f.score>=95?C.green:f.score>=80?C.gold:C.red;
                return (
                  <Card key={f.staffId}>
                    <div style={{ padding:18, display:"flex", gap:16, alignItems:"center" }}>
                      <div style={{ width:64, height:64, borderRadius:"50%", background:`${scoreColor}18`,
                        border:`3px solid ${scoreColor}`, display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:20, fontWeight:800, color:scoreColor, flexShrink:0 }}>
                        {f.score}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:4 }}>{f.name}</div>
                        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                          {[
                            [`${f.totalLogs} logs this period`,C.navy],
                            [`${f.flaggedLogs} fidelity flag${f.flaggedLogs!==1?"s":""}`,f.flaggedLogs>0?C.red:C.green],
                            [`Avg claimed: ${f.avgClaimedMin}min`,C.text3],
                            [`Avg actual: ${f.avgActualMin}min`,f.avgActualMin<f.avgClaimedMin*.7?C.red:C.text3],
                          ].map(([txt,col])=>(
                            <span key={txt} style={{ fontSize:12, color:col, fontWeight:600 }}>{txt}</span>
                          ))}
                        </div>
                        <div style={{ marginTop:8, height:6, background:C.gray1, borderRadius:3, maxWidth:400 }}>
                          <div style={{ height:6, borderRadius:3, background:scoreColor, width:`${f.score}%`, transition:"width .4s" }}/>
                        </div>
                      </div>
                      <div style={{ textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:f.trend.startsWith("+")?C.green:f.trend==="-0"||f.trend==="0"?C.text3:C.red }}>
                          {f.trend} this week
                        </div>
                        {f.score < 80 && (
                          <div style={{ marginTop:8, padding:"5px 10px", background:C.redlt, color:C.red, borderRadius:8, fontSize:11, fontWeight:700 }}>
                            ⚠ Supervisor Review
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Fidelity trend chart */}
            <Card>
              <CardHdr title="Org-Wide Fidelity Trend — 7 Days"/>
              <div style={{ padding:"14px 20px" }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={[
                    {day:"Mon",avg:91},{day:"Tue",avg:88},{day:"Wed",avg:85},
                    {day:"Thu",avg:87},{day:"Fri",avg:82},{day:"Sat",avg:89},{day:"Sun",avg:88},
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                    <XAxis dataKey="day" tick={{fontSize:11}}/>
                    <YAxis domain={[75,100]} tick={{fontSize:11}}/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="avg" stroke={C.gold} strokeWidth={2} dot={{fill:C.gold}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* EVV / BILLING */}
        {tab==="evv" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>EVV Billing Integrity — GPS-Verified vs. Billed Hours</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                ["Total Billed Hours","120",C.navy,"This pay period"],
                ["GPS-Verified Hours","114",C.green,"94 verified,  6 flagged"],
                ["Billing Discrepancies","6",C.red,"Flagged for CFO audit"],
              ].map(([label,val,col,sub])=>(
                <Card key={label}>
                  <div style={{ padding:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>{label}</div>
                    <div style={{ fontSize:34, fontWeight:800, color:col, fontFamily:"Georgia,serif" }}>{val}</div>
                    <div style={{ fontSize:12, color:C.text3, marginTop:4 }}>{sub}</div>
                  </div>
                </Card>
              ))}
            </div>
            <Card>
              <CardHdr title="Billed vs. GPS-Verified Hours — Last 7 Days" sub="Red bars = discrepancy auto-flagged for audit"/>
              <div style={{ padding:"14px 20px" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={EVV_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                    <XAxis dataKey="date" tick={{fontSize:11}}/>
                    <YAxis tick={{fontSize:11}}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="billed" name="Billed" fill={C.navy} radius={[4,4,0,0]}/>
                    <Bar dataKey="verified" name="GPS-Verified" radius={[4,4,0,0]}>
                      {EVV_DATA.map((e,i)=><Cell key={i} fill={e.billed!==e.verified?C.red:C.green}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* ALERTS */}
        {tab==="alerts" && (
          <div style={{ display:"grid", gap:12 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>Active Alerts — All Houses</div>
            {ORG_ALERTS.map((a,i)=>{
              const col = a.severity==="critical"?C.red:a.severity==="warning"?C.orange:C.navy;
              const bg  = a.severity==="critical"?C.redlt:a.severity==="warning"?C.orangelt:C.gray0;
              const icons = {pill:"💊",evv:"📍",fidelity:"⏱",incident:"🚨",ib:"📋"};
              return (
                <Card key={i} style={{ border:`2px solid ${col}33` }}>
                  <div style={{ padding:16, display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icons[a.type]}</div>
                    <div style={{flex:1}}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                        <Tag label={a.severity.toUpperCase()} color={C.white} bg={col} small/>
                        <Tag label={a.home} color={C.navy} bg={C.gray1} small/>
                        <span style={{ fontSize:11, color:C.text3 }}>{a.time}</span>
                      </div>
                      <div style={{ fontSize:14, color:C.text, fontWeight:600 }}>{a.msg}</div>
                    </div>
                    <Btn v={a.severity==="critical"?"red":"orange"} small>Resolve</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* iCONNECT EXPORT */}
        {/* OPEN SHIFTS */}
        {tab==="scheduling" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>Open Shifts & Overtime Board</div>
            <div style={{ padding:"10px 16px", background:C.teallt, borderRadius:10, fontSize:13, color:C.text, borderLeft:`4px solid ${C.teal}` }}>
              Staff can claim any open shift at any house. Each claim automatically creates an EVV record and applies the appropriate overtime flag. Double-billing is blocked at the system level.
            </div>
            <div style={{ display:"grid", gap:10 }}>
              {OPEN_SHIFTS.map(os=>{
                const urgencyCol = os.urgency==="critical"?C.red:os.urgency==="warning"?C.orange:C.teal;
                const urgencyBg  = os.urgency==="critical"?C.redlt:os.urgency==="warning"?C.orangelt:C.teallt;
                return (
                  <Card key={os.id} style={{ border:`2px solid ${urgencyCol}33` }}>
                    <div style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
                      <div style={{ width:48,height:48,borderRadius:12,background:urgencyBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                        {os.urgency==="critical"?"🚨":os.urgency==="warning"?"⚠":"📋"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                          <Tag label={os.urgency.toUpperCase()} color={C.white} bg={urgencyCol} small/>
                          <Tag label={os.home} color={C.navy} bg={C.gray1} small/>
                          <span style={{ fontSize:12, color:C.text3 }}>{os.date} · {os.shift} · {os.hours}h</span>
                        </div>
                        <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{os.reason}</div>
                      </div>
                      <Btn v={os.urgency==="critical"?"red":"orange"}>Claim Shift</Btn>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* iCONNECT EXPORT */}
        {tab==="export" && (
          <div style={{ display:"grid", gap:14, maxWidth:700 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>iConnect Export — Florida APD State System Sync</div>
            <div style={{ padding:"14px 18px", background:C.teallt, borderRadius:10, borderLeft:`4px solid ${C.teal}`, fontSize:13, color:C.text, lineHeight:1.7 }}>
              LUMINARK is positioned as an API-first layer over iConnect. All verified data — shift records, med administrations, incident reports, EVV logs, and behavioral data — exports in <strong>iConnect-compliant XML format</strong> per APD specifications (Generations interface protocol). This eliminates double-entry and the clerical errors that trigger QA alert remediations.
            </div>
            <Card>
              <CardHdr title="Medication Supply — Days Remaining by Resident" sub="Under 7 days = critical refill · Red bars require immediate action"/>
              <div style={{ padding:16, overflowX:"auto" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={MED_SUPPLY_RADAR} layout="vertical" margin={{left:110}}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                    <XAxis type="number" tick={{fontSize:10}}/>
                    <YAxis type="category" dataKey="subject" tick={{fontSize:11,fontWeight:700}}/>
                    <Tooltip/>
                    <Legend/>
                    {["Marcus","Angela","Jonah","Lydia","Ramon"].map((name,i)=>{
                      const cols=[C.navy,C.orange,C.green,C.teal,C.purple];
                      return <Bar key={name} dataKey={name} name={name} fill={cols[i]} radius={[0,4,4,0]}/>;
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            {[
              { label:"Shift Records & EVV",      count:"47 records", status:"Ready", icon:"📍" },
              { label:"Medication Administration Logs", count:"312 entries", status:"Ready", icon:"💊" },
              { label:"Incident Reports",          count:"9 reports",  status:"2 Pending Signature", icon:"🚨" },
              { label:"Controlled Substance Log",  count:"28 entries", status:"Ready", icon:"🔐" },
              { label:"Communication Log",         count:"84 entries", status:"Ready", icon:"📝" },
              { label:"Resident Face Sheets",      count:"5 records",  status:"Ready", icon:"📋" },
            ].map(item=>(
              <Card key={item.label}>
                <div style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:C.teallt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{item.label}</div>
                    <div style={{ fontSize:12, color:C.text3 }}>{item.count}</div>
                  </div>
                  <Tag label={item.status} color={item.status==="Ready"?C.green:C.orange} bg={item.status==="Ready"?C.greenlt:C.orangelt} small/>
                  <Btn v="teal" small>Export</Btn>
                </div>
              </Card>
            ))}
            <Btn v="primary" full style={{padding:14,fontSize:14}}>📤 Export All Ready Records to iConnect</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FAMILY PORTAL ─────────────────────────────────────────────────────────────
function FamilyPortal({member, onLogout}) {
  const resident = Object.values(RESIDENTS_DB).flat().find(r=>r.id===member.residentId);
  const [tab, setTab] = useState("today");
  if (!resident) return <div>Resident not found.</div>;
  const stage = STAGES[resident.stage];

  // Pull family descriptions directly from the canonical SAP STAGES array — one source of truth
  const familyDesc = STAGES[resident.stage].familyDesc;
  const stageName  = STAGES[resident.stage].name;

  const recentLogs = [
    { date:"May 9", cat:"General",   text:"Had a great morning. Helped prepare breakfast and was in good spirits. Participated in the group walk after lunch." },
    { date:"May 8", cat:"Outing",    text:"Community outing to Walmart. Purchased personal items. Receipt logged below. Returned home safely at 3:20 PM." },
    { date:"May 7", cat:"General",   text:"Quiet day. Watched favorite shows. Medications given on schedule. No concerns to report." },
    { date:"May 6", cat:"Activity",  text:"Participated in music group. Staff noted positive engagement and good mood throughout the session." },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:"#F0F4F8", minHeight:"100vh" }}>
      {/* FAMILY TOPBAR */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1B4F72 100%)`, padding:"0 24px", height:56,
        display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 16px rgba(0,0,0,.3)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:34, height:34, background:C.gold, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:C.navy, fontFamily:"Georgia,serif" }}>L</div>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>LUMINARK Family Portal</div>
            <div style={{ fontSize:11, color:"#7aA4C4" }}>Welcome, {member.name} · {member.relation}</div>
          </div>
        </div>
        <Btn v="ghost" small onClick={onLogout} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>Log Out</Btn>
      </div>

      {/* RESIDENT HERO */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, padding:"24px 28px", borderBottom:`4px solid ${stage.color}` }}>
        <div style={{ display:"flex", gap:20, alignItems:"center", maxWidth:800, margin:"0 auto" }}>
          <div style={{ fontSize:72, lineHeight:1, background:stage.bg, borderRadius:16, padding:"8px 14px", border:`2px solid ${stage.color}44` }}>{resident.photo}</div>
          <div>
            <div style={{ fontSize:26, fontWeight:800, color:C.white, fontFamily:"Georgia,serif", marginBottom:6 }}>{resident.name}</div>
            <div style={{ fontSize:13, fontWeight:800, color:stage.color, marginBottom:4, background:`${stage.color}22`, display:"inline-block", padding:"4px 12px", borderRadius:20 }}>
              {stage.symbol} {stageName}
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginBottom:8, maxWidth:500 }}>
              {familyDesc}
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, color:"#8fb3d4" }}>📍 {resident.home}</span>
              <span style={{ fontSize:13, color:"#8fb3d4" }}>👨‍⚕️ {resident.physician?.split("–")[0].trim()}</span>
              <span style={{ fontSize:13, color:"#8fb3d4" }}>📞 {HOMES[resident.home]?.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:24 }}>
        {/* TABS */}
        <div style={{ display:"flex", gap:4, background:C.white, borderRadius:14, padding:6, marginBottom:18, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
          {[["today","📅","Today's Update"],["stage","🧭","Their Stage"],["plan","📋","Care Plan"],["wallet","💰","Personal Funds"],["contact","📞","Contact Home"]].map(([id,icon,label])=>(
            <div key={id} onClick={()=>setTab(id)}
              style={{ flex:1, padding:"10px 14px", borderRadius:10, textAlign:"center", cursor:"pointer",
                background:tab===id?C.navy:"transparent", color:tab===id?C.white:C.text3, fontSize:13, fontWeight:tab===id?700:500,
                transition:"all .15s", display:"flex", gap:6, alignItems:"center", justifyContent:"center" }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>

        {tab==="today" && (
          <div style={{ display:"grid", gap:14 }}>
            <Card>
              <CardHdr title={`${resident.name.split(" ")[0]}'s Day — May 9, 2026`}/>
              <div style={{ padding:16, display:"grid", gap:10 }}>
                {recentLogs.map((log,i)=>(
                  <div key={i} style={{ padding:"12px 14px", background:C.gray0, borderRadius:10, borderLeft:`3px solid ${C.gold}` }}>
                    <div style={{ display:"flex", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.text3 }}>{log.date}</span>
                      <Tag label={log.cat} color={C.navy} bg={C.gray1} small/>
                    </div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{log.text}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHdr title="Current Support Team"/>
              <div style={{ padding:16, display:"grid", gap:8 }}>
                {[
                  ["Physician", resident.physician],
                  ["Behavior Analyst", resident.ba],
                  ["Home Supervisor", `Shondra Baxter — (727) 555-0911`],
                ].map(([label,val])=>(
                  <div key={label} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.4, marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:13, color:C.text }}>{val}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab==="stage" && (
          <Card>
            <CardHdr title={`Understanding ${resident.name.split(" ")[0]}'s Current Stage`} sub={`${stage.symbol} ${stage.name}`}/>
            <div style={{ padding:18, display:"grid", gap:12 }}>
              <div style={{ padding:"14px 16px", background:stage.bg, borderRadius:10, border:`2px solid ${stage.color}44` }}>
                <div style={{ fontSize:16, fontWeight:800, color:stage.color, marginBottom:6, fontFamily:"Georgia,serif" }}>{stage.symbol} {stage.name}</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{stage.familyDesc}</div>
              </div>
              <div style={{ padding:"12px 14px", background:C.gray0, borderRadius:10 }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>What the Staff Are Focusing On Right Now</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{stage.actionPrompt}</div>
              </div>
              {stage.trapWarning && (
                <div style={{ padding:"12px 14px", background:C.orangelt, borderRadius:10, borderLeft:`4px solid ${C.orange}` }}>
                  <div style={{ fontSize:11, fontWeight:800, color:C.orange, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>⚠ What to Watch For — Ask About This</div>
                  <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{stage.trapWarning}</div>
                </div>
              )}
              <div style={{ padding:"10px 14px", background:C.goldlt, borderRadius:9, fontSize:11, color:C.text, borderLeft:`3px solid ${C.gold}` }}>
                <strong>As a family member, you can always request an IB review</strong> if you feel your loved one's plan needs updating. You don't need a specific reason — your concern is enough.
              </div>
            </div>
          </Card>
        )}

        {tab==="plan" && (
          <Card>
            <CardHdr title="Care Plan — Family Summary" sub={`Plain-language version · BA: ${resident.ba}`}/>
            <div style={{ padding:18 }}>
              {resident.behaviorPlan ? (
                <>
                  <div style={{ padding:"14px 16px", background:C.greenlt, borderRadius:10, borderLeft:`4px solid ${C.green}`, fontSize:13, color:C.text, lineHeight:1.9, marginBottom:12 }}>
                    {resident.behaviorPlan.plainDesc}
                  </div>
                  <div style={{ fontSize:11, color:C.text3, fontStyle:"italic" }}>
                    This is a plain-language summary of the clinical behavior support plan. For the full clinical plan, contact {resident.ba} directly.
                    You have the right to receive a copy of the full plan at any time.
                  </div>
                </>
              ) : (
                <div style={{ padding:24, textAlign:"center", color:C.text3 }}>
                  <div style={{fontSize:28,marginBottom:8}}>📋</div>
                  <div style={{fontSize:13}}>No behavior plan on file yet. Contact {resident.ba} to request one.</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {tab==="wallet" && (
          <div style={{ display:"grid", gap:14 }}>
            <Card>
              <div style={{ padding:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>Current Balance</div>
                    <div style={{ fontSize:40, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>${resident.wallet?.balance?.toFixed(2)||"47.50"}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11, color:C.text3 }}>Last updated</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Today, 2:14 PM</div>
                  </div>
                </div>
                <div style={{ padding:"10px 14px", background:C.greenlt, borderRadius:10, fontSize:12, color:C.green, fontWeight:600 }}>
                  ✓ All transactions have photo receipts on file. Family audited in real time.
                </div>
              </div>
            </Card>
            <Card>
              <CardHdr title="Transaction History"/>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:C.gray0 }}>
                      {["Date","Description","Staff","Amount"].map(h=>(
                        <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.4 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(resident.wallet?.transactions||[
                      {date:"5/8",desc:"Walmart — personal items",staff:"M. Thompson",amount:-22.50},
                      {date:"5/6",desc:"McDonald's — community outing",staff:"C. Rivera",amount:-8.75},
                      {date:"5/1",desc:"Family deposit",staff:"Guardian",amount:80.00},
                      {date:"4/28",desc:"Walgreens — hygiene items",staff:"J. Williams",amount:-9.25},
                    ]).map((tx,i)=>(
                      <tr key={i} style={{ borderTop:`1px solid ${C.gray1}` }}>
                        <td style={{ padding:"12px 14px", fontWeight:600 }}>{tx.date}</td>
                        <td style={{ padding:"12px 14px" }}>{tx.desc}</td>
                        <td style={{ padding:"12px 14px", color:C.text3 }}>{tx.staff}</td>
                        <td style={{ padding:"12px 14px", fontWeight:700, color:tx.amount<0?C.red:C.green }}>
                          {tx.amount>0?"+":""}{tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab==="contact" && (
          <div style={{ display:"grid", gap:14 }}>
            <Card>
              <CardHdr title="Contact the Home"/>
              <div style={{ padding:20, display:"grid", gap:12 }}>
                {[
                  { label:"Home Direct Line",    val:HOMES[resident.home]?.phone,          icon:"📞" },
                  { label:"On-Call Supervisor",  val:"Shondra Baxter — (727) 555-0911",     icon:"🚨" },
                  { label:"Physician",           val:resident.physician,                    icon:"👨‍⚕️" },
                  { label:"Behavior Analyst",    val:resident.ba,                           icon:"🧠" },
                  { label:"Florida APD Hotline", val:"1-866-APD-CARES (1-866-273-2273)",   icon:"🏛" },
                  { label:"Abuse Hotline",       val:"1-800-962-2873 (24/7 mandatory)",     icon:"🛡" },
                ].map(c=>(
                  <div key={c.label} style={{ padding:"12px 16px", background:C.gray0, borderRadius:10, display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{fontSize:22}}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.4 }}>{c.label}</div>
                      <div style={{ fontSize:14, color:C.text, fontWeight:600 }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DEMO / INVESTOR MODE ──────────────────────────────────────────────────────
function DemoMode({onExit}) {
  const [step, setStep] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const current = DEMO_STEPS[step];
  const isLast = step === DEMO_STEPS.length - 1;

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh", position:"relative" }}>
      {/* Simulated app background */}
      <div style={{ filter:"brightness(.45) blur(1px)", pointerEvents:"none", minHeight:"100vh", background:C.gray0 }}>
        <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 100%)`, height:56, display:"flex", alignItems:"center", padding:"0 24px", gap:14 }}>
          <div style={{ width:34,height:34,background:C.gold,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:C.navy,fontFamily:"Georgia,serif" }}>L</div>
          <div style={{ fontWeight:800,fontSize:14,color:C.white,fontFamily:"Georgia,serif" }}>LUMINARK APD OVERWATCH</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", minHeight:"calc(100vh - 56px)" }}>
          <div style={{ background:C.navy2, padding:"20px 0" }}>
            {["👥 Residents","📋 Face Sheet","💊 Meds","📝 Comm Log","🚨 Incident","✦ AI Guide","📊 Analytics","🔄 Handover"].map(item=>(
              <div key={item} style={{ padding:"10px 16px", color:"#9ab8d4", fontSize:13 }}>{item}</div>
            ))}
          </div>
          <div style={{ padding:24 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
              {Object.entries(HOMES).map(([name])=>(
                <div key={name} style={{ background:C.white, borderRadius:14, padding:20 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:C.navy }}>{name}</div>
                  <div style={{ fontSize:12, color:C.text3, marginTop:4 }}>{(RESIDENTS_DB[name]||[]).length} residents</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STORY CARD OVERLAY */}
      {!minimized && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, padding:24 }}>
          <div style={{ maxWidth:760, margin:"0 auto", background:C.white, borderRadius:20, boxShadow:"0 -8px 48px rgba(0,0,0,.35), 0 24px 60px rgba(0,0,0,.25)", overflow:"hidden" }}>
            {/* Story card header */}
            <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:44, height:44, background:C.gold, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{current.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#7aA4C4", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>LUMINARK APD OVERWATCH · Investor Briefing · Step {step+1} of {DEMO_STEPS.length}</div>
                  <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:"Georgia,serif" }}>{current.title}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn v="ghost" small onClick={()=>setMinimized(true)} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>Minimize</Btn>
                <Btn v="ghost" small onClick={onExit} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>Exit Demo</Btn>
              </div>
            </div>

            {/* Stat callout */}
            <div style={{ background:`${C.gold}18`, borderBottom:`2px solid ${C.gold}33`, padding:"10px 24px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>📊</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.gold }}>{current.stat}</span>
            </div>

            {/* Body */}
            <div style={{ padding:"20px 24px" }}>
              <p style={{ fontSize:14, color:C.text, lineHeight:1.9, margin:0 }}>{current.body}</p>
            </div>

            {/* Progress + nav */}
            <div style={{ padding:"14px 24px", borderTop:`1px solid ${C.gray1}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:6 }}>
                {DEMO_STEPS.map((_,i)=>(
                  <div key={i} onClick={()=>setStep(i)} style={{ width:i===step?24:8, height:8, borderRadius:4, background:i===step?C.gold:C.gray2, cursor:"pointer", transition:"all .3s" }}/>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                {step > 0 && <Btn v="ghost" onClick={()=>setStep(s=>s-1)}>← Previous</Btn>}
                {!isLast && <Btn v="gold" onClick={()=>setStep(s=>s+1)}>Next →</Btn>}
                {isLast && (
                  <div style={{ display:"flex", gap:10 }}>
                    <Btn v="green" onClick={onExit}>✓ Enter Live Demo</Btn>
                    <Btn v="primary" onClick={()=>setStep(0)}>↺ Restart</Btn>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {minimized && (
        <div onClick={()=>setMinimized(false)} style={{ position:"fixed", bottom:24, right:24, zIndex:200,
          background:C.gold, borderRadius:20, padding:"12px 20px", cursor:"pointer",
          boxShadow:"0 8px 32px rgba(200,150,12,.5)", display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:18 }}>📊</span>
          <span style={{ fontWeight:800, color:C.navy, fontSize:13 }}>Investor Briefing — Step {step+1}/{DEMO_STEPS.length}</span>
        </div>
      )}
    </div>
  );
}

// ─── CLOCK IN ──────────────────────────────────────────────────────────────────
function ClockIn({onClockIn, onAdmin, onFamily, onBA, onDemo}) {
  const [portal, setPortal] = useState(null); // null | "staff" | "admin" | "family"
  const [staffId, setStaffId] = useState("S001");
  const [pin, setPin]         = useState("");
  const [home, setHome]       = useState("");
  const [adminId, setAdminId] = useState("A001");
  const [adminPin, setAdminPin] = useState("");
  const [familyId, setFamilyId] = useState("F001");
  const [familyPin, setFamilyPin] = useState("");
  const [error, setError]     = useState("");

  const clearError = () => setError("");

  const tryStaffLogin = () => {
    const staff = STAFF_DB[staffId];
    if (!staff) { setError("Staff ID not found."); return; }
    if (pin !== staff.pin) { setError("Incorrect PIN."); setPin(""); return; }
    if (!home) { setError("Select a home."); return; }
    const shift = SCHEDULE_DB.find(s=>s.staffId===staffId&&s.home===home&&s.date==="2026-05-09");
    onClockIn({ staff, home, shift, clockInTime:new Date(), isOvertime:!shift });
  };

  const tryAdminLogin = () => {
    const admin = ADMIN_DB[adminId];
    if (!admin) { setError("Admin ID not found."); return; }
    if (adminPin !== admin.pin) { setError("Incorrect PIN."); setAdminPin(""); return; }
    onAdmin(admin);
  };

  const tryFamilyLogin = () => {
    const member = FAMILY_DB[familyId];
    if (!member) { setError("Family ID not found."); return; }
    if (familyPin !== member.pin) { setError("Incorrect PIN."); setFamilyPin(""); return; }
    onFamily(member);
  };

  const staff = STAFF_DB[staffId];

  const PORTALS = [
    { id:"staff",  icon:"🏥", label:"Staff Portal",          sub:"DSP / Lead DSP clock-in",            color:C.navy   },
    { id:"admin",  icon:"🎯", label:"Manager Portal",         sub:"Program Manager / Director",         color:C.teal   },
    { id:"ba",     icon:"🧠", label:"Behavior Analyst Portal", sub:"BCBA / BCaBA plan management",       color:C.purple },
    { id:"family", icon:"👨‍👩‍👧", label:"Family Portal",         sub:"Guardian / family member",            color:C.green  },
    { id:"demo",   icon:"📊", label:"Investor Demo",          sub:"Platform walkthrough & pitch",       color:C.gold   },
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${C.navy} 0%,#0A1628 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:480 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:64, height:64, background:C.gold, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:32, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>L</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.white, fontFamily:"Georgia,serif", marginBottom:4 }}>LUMINARK APD OVERWATCH</div>
          <div style={{ fontSize:12, color:"#7aA4C4" }}>Meridian Axiom Alignment Technologies · Florida APD Compliance Platform</div>
        </div>

        {/* Portal selector */}
        {!portal && (
          <div style={{ display:"grid", gap:10 }}>
            {PORTALS.map(p=>(
              <div key={p.id} onClick={()=>{ setPortal(p.id); clearError(); if(p.id==="demo") onDemo(); if(p.id==="ba") onBA(); }}
                style={{ padding:"18px 22px", background:"rgba(255,255,255,.07)", borderRadius:14, cursor:"pointer",
                  border:`2px solid ${portal===p.id?p.color:"rgba(255,255,255,.1)"}`,
                  display:"flex", gap:16, alignItems:"center", transition:"all .15s",
                  backdropFilter:"blur(8px)" }}>
                <div style={{ width:48, height:48, background:`${p.color}25`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:C.white, marginBottom:2 }}>{p.label}</div>
                  <div style={{ fontSize:12, color:"#7aA4C4" }}>{p.sub}</div>
                </div>
                <div style={{ marginLeft:"auto", color:"rgba(255,255,255,.3)", fontSize:18 }}>›</div>
              </div>
            ))}
          </div>
        )}

        {/* STAFF LOGIN */}
        {portal==="staff" && (
          <div style={{ background:C.white, borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.4)" }}>
            <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, padding:"20px 28px", display:"flex", alignItems:"center", gap:12 }}>
              <Btn v="ghost" small onClick={()=>{setPortal(null);clearError();}} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>← Back</Btn>
              <div style={{ fontSize:15, fontWeight:800, color:C.white }}>🏥 Staff Clock-In</div>
            </div>
            <div style={{ padding:"24px 28px" }}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Staff Member</label>
                <select value={staffId} onChange={e=>{setStaffId(e.target.value);setHome("");clearError();}}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit" }}>
                  {Object.values(STAFF_DB).map(s=><option key={s.id} value={s.id}>{s.id} — {s.name} ({s.role})</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>PIN</label>
                <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryStaffLogin()}
                  placeholder="4-digit PIN" maxLength={4}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:20, fontFamily:"monospace", letterSpacing:6, textAlign:"center", boxSizing:"border-box" }}/>
              </div>
              {staff && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Select Home</label>
                  <div style={{ display:"grid", gap:8 }}>
                    {Object.keys(HOMES).map(h => {
                      const sched = SCHEDULE_DB.find(s=>s.staffId===staffId&&s.home===h&&s.date==="2026-05-09");
                      return (
                        <div key={h} onClick={()=>{setHome(h);clearError();}}
                          style={{ padding:"12px 14px", borderRadius:10, border:`2px solid ${home===h?C.gold:C.gray2}`,
                            background:home===h?C.goldlt:C.gray0, cursor:"pointer", transition:"all .15s" }}>
                          <div style={{ fontWeight:700, fontSize:14, color:home===h?C.gold:C.text }}>{h}</div>
                          {sched
                            ? <div style={{ fontSize:12, color:C.green, marginTop:2 }}>📅 Scheduled: {sched.shift}</div>
                            : <div style={{ fontSize:12, color:C.orange, marginTop:2 }}>⚡ Overtime / Unscheduled — EVV will flag</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {error && <div style={{ padding:"10px 14px", background:C.redlt, color:C.red, borderRadius:9, fontSize:13, fontWeight:600, marginBottom:14 }}>⚠ {error}</div>}
              <Btn v="gold" full onClick={tryStaffLogin}>🔐 Clock In & Begin Shift</Btn>
              <div style={{ fontSize:11, color:C.text3, textAlign:"center", marginTop:10 }}>
                Client info accessible only during active shift · Auto-locks after 15 min
              </div>
            </div>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {portal==="admin" && (
          <div style={{ background:C.white, borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.4)" }}>
            <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.navy} 100%)`, padding:"20px 28px", display:"flex", alignItems:"center", gap:12 }}>
              <Btn v="ghost" small onClick={()=>{setPortal(null);clearError();}} style={{color:"rgba(255,255,255,.6)",borderColor:"rgba(255,255,255,.3)"}}>← Back</Btn>
              <div style={{ fontSize:15, fontWeight:800, color:C.white }}>🎯 Manager / Admin Portal</div>
            </div>
            <div style={{ padding:"24px 28px" }}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Admin Account</label>
                <select value={adminId} onChange={e=>{setAdminId(e.target.value);clearError();}}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit" }}>
                  {Object.values(ADMIN_DB).map(a=><option key={a.id} value={a.id}>{a.id} — {a.name} ({a.role})</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>PIN</label>
                <input type="password" value={adminPin} onChange={e=>setAdminPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryAdminLogin()}
                  placeholder="Admin PIN" maxLength={4}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:20, fontFamily:"monospace", letterSpacing:6, textAlign:"center", boxSizing:"border-box" }}/>
              </div>
              {error && <div style={{ padding:"10px 14px", background:C.redlt, color:C.red, borderRadius:9, fontSize:13, fontWeight:600, marginBottom:14 }}>⚠ {error}</div>}
              <Btn v="teal" full onClick={tryAdminLogin}>🎯 Enter Manager Portal</Btn>
            </div>
          </div>
        )}

        {/* FAMILY LOGIN */}
        {portal==="family" && (
          <div style={{ background:C.white, borderRadius:20, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,.4)" }}>
            <div style={{ background:`linear-gradient(135deg,${C.green} 0%,${C.navy} 100%)`, padding:"20px 28px", display:"flex", alignItems:"center", gap:12 }}>
              <Btn v="ghost" small onClick={()=>{setPortal(null);clearError();}} style={{color:"rgba(255,255,255,.6)",borderColor:"rgba(255,255,255,.3)"}}>← Back</Btn>
              <div style={{ fontSize:15, fontWeight:800, color:C.white }}>👨‍👩‍👧 Family Guardian Portal</div>
            </div>
            <div style={{ padding:"24px 28px" }}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Family Account</label>
                <select value={familyId} onChange={e=>{setFamilyId(e.target.value);clearError();}}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit" }}>
                  {Object.values(FAMILY_DB).map(f=><option key={f.id} value={f.id}>{f.name} — {f.relation} of {Object.values(RESIDENTS_DB).flat().find(r=>r.id===f.residentId)?.name||f.residentId}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Family PIN</label>
                <input type="password" value={familyPin} onChange={e=>setFamilyPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryFamilyLogin()}
                  placeholder="Your family PIN" maxLength={4}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:20, fontFamily:"monospace", letterSpacing:6, textAlign:"center", boxSizing:"border-box" }}/>
              </div>
              {error && <div style={{ padding:"10px 14px", background:C.redlt, color:C.red, borderRadius:9, fontSize:13, fontWeight:600, marginBottom:14 }}>⚠ {error}</div>}
              <Btn v="green" full onClick={tryFamilyLogin}>👨‍👩‍👧 Enter Family Portal</Btn>
              <div style={{ fontSize:11, color:C.text3, textAlign:"center", marginTop:10 }}>
                Your loved one's info is private and protected. Only authorized guardians can log in.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BEHAVIOR PLAN VIEWER (Staff ↔ Clinical toggle) ────────────────────────────
function BehaviorPlanViewer({resident}) {
  const [view, setView] = useState("staff");
  const plan = resident.behaviorPlan;
  if (!plan) return null;
  const stage = STAGES[resident.stage];
  const stageCtx = resident.stage>=7?"small triggers may cause bigger reactions than expected. Use the calm-down steps below and notify the BA of any escalation.":resident.stage<=1?"you are still establishing trust. Consistency is more important than correction right now.":resident.stage===9?"they have earned significant autonomy. Your role is support, not correction.":"stay consistent with the plan below. Progress is happening even when it's hard to see.";
  return (
    <Card style={{ border:`2px solid ${stage.color}33` }}>
      <div style={{ padding:"12px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, display:"flex", justifyContent:"space-between", alignItems:"center", borderRadius:"12px 12px 0 0" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:C.white }}>📋 Behavior Support Plan</div>
          <div style={{ fontSize:11, color:"#8fb3d4", marginTop:2 }}>BA: {resident.ba}</div>
        </div>
        <div style={{ display:"flex", gap:2, background:"rgba(255,255,255,.1)", borderRadius:10, padding:3 }}>
          {[["staff","👤 Staff View"],["clinical","🧠 Clinical View"]].map(([id,label])=>(
            <div key={id} onClick={()=>setView(id)} style={{ padding:"5px 12px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, transition:"all .15s", background:view===id?C.white:"transparent", color:view===id?C.navy:"rgba(255,255,255,.6)" }}>{label}</div>
          ))}
        </div>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ padding:"10px 14px", background:stage.bg, borderRadius:9, marginBottom:14, borderLeft:`4px solid ${stage.color}` }}>
          <span style={{ fontSize:12, fontWeight:700, color:stage.color }}>Because {resident.name.split(" ")[0]} is in <em>{stage.name}</em>: {stageCtx}</span>
        </div>
        {view==="staff" ? (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>What to do — plain language</div>
            <div style={{ fontSize:14, color:C.text, lineHeight:1.9, padding:"14px 16px", background:C.gray0, borderRadius:10, borderLeft:`4px solid ${C.gold}`, whiteSpace:"pre-line" }}>{plan.plainDesc}</div>
            {plan.certificationHints?.length > 0 && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.teal, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>💡 APD Exam Prep — What These Terms Mean in Real Life</div>
                <div style={{ display:"grid", gap:6 }}>
                  {plan.certificationHints.map((h,i)=>(
                    <div key={i} style={{ padding:"9px 12px", background:C.teallt, borderRadius:8, display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ minWidth:4, width:4, borderRadius:2, background:C.teal, alignSelf:"stretch", flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:11, fontWeight:800, color:C.teal, marginBottom:2 }}>{h.term}</div>
                        <div style={{ fontSize:12, color:C.text }}>{h.plain}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:8, fontSize:11, color:C.text3, fontStyle:"italic" }}>
                  Switch to Clinical View to see these terms in the full plan — useful for certification exam study.
                </div>
              </div>
            )}
            {!plan.certificationHints?.length && (
              <div style={{ marginTop:10, padding:"8px 12px", background:C.teallt, borderRadius:8, fontSize:12, color:C.teal, fontWeight:600 }}>
                💡 Test Hint: Your BA calls this plan "FCT" or "DRA" on the APD certification exam. In real life, it just means what the plain-language description above says.
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Clinical Description — BA / Supervisor View</div>
            <div style={{ fontSize:13, color:C.text2, lineHeight:1.8, padding:"14px 16px", background:"#0D1F3508", borderRadius:10, borderLeft:`4px solid ${C.navy}`, fontFamily:"monospace", whiteSpace:"pre-line" }}>{plan.clinicalDesc}</div>
            <div style={{ marginTop:10, padding:"8px 12px", background:C.goldlt, borderRadius:8, fontSize:12, color:C.gold, fontWeight:600 }}>⚠ This view is for BA/supervisor reference. Staff should use the "Staff View" tab during their shift.</div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── BA PORTAL ─────────────────────────────────────────────────────────────────
function BAPortal({onLogout}) {
  const [tab, setTab]         = useState("caseload");
  const allResidents          = Object.values(RESIDENTS_DB).flat();
  const [planView, setPlanView]   = useState({});
  const [accessScore, setAccessScore] = useState({});
  const [scoring, setScoring] = useState({});

  const scorePlan = async (r) => {
    setScoring(p=>({...p,[r.id]:true}));
    const txt = await callClaude(
      [{role:"user",content:`Review this behavior plan for a Florida APD group home resident:\n\n"${r.behaviorPlan?.clinicalDesc}"\n\nScore it on:\n1. Plain-language accessibility (0-100): Can a DSP with a high school diploma understand it?\n2. APD compliance (0-100): Does it reference Chapter 65G interventions appropriately?\n3. Missing elements (list up to 3 short items).\n4. Staff translation: Write 2 plain-language sentences for daily care staff.\n\nReturn ONLY valid JSON: { "accessibility": number, "compliance": number, "missing": ["item"], "translation": "text" }`}],
      "You are a Florida APD behavior analyst supervisor. Return only valid JSON with no markdown."
    );
    try { const c=txt.replace(/```json|```/g,"").trim(); setAccessScore(p=>({...p,[r.id]:JSON.parse(c)})); }
    catch { setAccessScore(p=>({...p,[r.id]:{accessibility:0,compliance:0,missing:["Parse error"],translation:"Score unavailable."}})); }
    setScoring(p=>({...p,[r.id]:false}));
  };

  const TABS=[{id:"caseload",icon:"👥",label:"Caseload & Stages"},{id:"plans",icon:"📋",label:"Plan Scorer"},{id:"effectiveness",icon:"📊",label:"Effectiveness"},{id:"jargon",icon:"🗣",label:"Jargon Translator"}];

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${C.purple} 0%,#2D0F5A 100%)`, padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:36,height:36,background:C.gold,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,color:C.navy,fontFamily:"Georgia,serif" }}>L</div>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>LUMINARK — BA PORTAL</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.6)" }}>Behavior Analyst · All Houses · SAP Clinical Intelligence</div>
          </div>
        </div>
        <Btn v="ghost" small onClick={onLogout} style={{color:"rgba(255,255,255,.6)",borderColor:"rgba(255,255,255,.3)"}}>Log Out</Btn>
      </div>
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray1}`, display:"flex", padding:"0 24px" }}>
        {TABS.map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"12px 16px", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:500, color:tab===t.id?C.purple:C.text3, borderBottom:tab===t.id?`3px solid ${C.purple}`:"3px solid transparent", display:"flex", gap:6, alignItems:"center" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
        {tab==="caseload" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>Active Caseload — SAP Stage Overview</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
              {allResidents.map(r=>{ const st=STAGES[r.stage]; return (
                <Card key={r.id} style={{ border:`2px solid ${st.color}33` }}>
                  <div style={{ padding:"14px 16px", background:st.bg }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <span style={{fontSize:36}}>{r.photo}</span>
                      <div><div style={{ fontSize:15, fontWeight:800, color:C.text }}>{r.name}</div><Tag label={`S${r.stage}: ${st.name}`} color={st.color} bg={`${st.color}22`} small/></div>
                    </div>
                  </div>
                  <div style={{ padding:14 }}>
                    <div style={{ fontSize:12, color:C.text3, marginBottom:4 }}><strong>Home:</strong> {r.home} &nbsp;·&nbsp; <strong>IB:</strong> {r.ibStatus}</div>
                    <div style={{ height:5, background:C.gray1, borderRadius:3, marginTop:8 }}><div style={{ height:5, borderRadius:3, background:st.color, width:`${st.tension*10}%` }}/></div>
                    <div style={{ fontSize:11, fontWeight:700, color:st.color, marginTop:4 }}>Tension Index: {st.tension}/10</div>
                    {r.stage>=7&&<div style={{ marginTop:8, padding:"6px 10px", background:C.redlt, color:C.red, borderRadius:8, fontSize:11, fontWeight:700 }}>⚠ High-tension — enhanced monitoring</div>}
                  </div>
                </Card>
              );})}
            </div>
          </div>
        )}
        {tab==="plans" && (
          <div style={{ display:"grid", gap:18 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif", marginBottom:6 }}>Plan Accessibility Scorer</div>
              <div style={{ padding:"10px 16px", background:C.purplelt, borderRadius:10, fontSize:13, color:C.purple, fontWeight:600 }}>✦ AI scores each plan for staff readability and APD Chapter 65G compliance, then generates a plain-language staff translation.</div>
            </div>
            {allResidents.filter(r=>r.behaviorPlan).map(r=>{
              const score=accessScore[r.id]; const st=STAGES[r.stage];
              return (
                <Card key={r.id}>
                  <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, display:"flex", justifyContent:"space-between", alignItems:"center", borderRadius:"12px 12px 0 0" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{fontSize:28}}>{r.photo}</span>
                      <div><div style={{ fontSize:14, fontWeight:800, color:C.white }}>{r.name}</div><div style={{ fontSize:11, color:"#8fb3d4" }}>S{r.stage}: {st.name} · {r.home}</div></div>
                    </div>
                    {!score&&<Btn v="gold" small onClick={()=>scorePlan(r)}>{scoring[r.id]?"Scoring...":"✦ Score Plan"}</Btn>}
                  </div>
                  <div style={{ padding:16 }}>
                    <div style={{ display:"flex", gap:4, background:C.gray0, borderRadius:10, padding:4, marginBottom:12 }}>
                      {[["staff","👤 Staff"],["clinical","🧠 Clinical"]].map(([id,label])=>(
                        <div key={id} onClick={()=>setPlanView(p=>({...p,[r.id]:id}))} style={{ flex:1, padding:"7px 0", borderRadius:8, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:700, background:(planView[r.id]||"staff")===id?C.navy:C.gray0, color:(planView[r.id]||"staff")===id?C.white:C.text3 }}>{label}</div>
                      ))}
                    </div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.8, padding:"12px 14px", background:C.gray0, borderRadius:9, marginBottom:score?12:0 }}>
                      {(planView[r.id]||"staff")==="staff"?r.behaviorPlan.plainDesc:r.behaviorPlan.clinicalDesc}
                    </div>
                    {score&&(
                      <div style={{ display:"grid", gap:10 }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                          {[["Accessibility",score.accessibility,"👤"],[" APD Compliance",score.compliance,"⚖"]].map(([lbl,val,icon])=>{ const col=val>=85?C.green:val>=70?C.gold:C.red; return (
                            <div key={lbl} style={{ padding:14, background:C.gray0, borderRadius:10, textAlign:"center" }}>
                              <div style={{fontSize:20}}>{icon}</div>
                              <div style={{ fontSize:28, fontWeight:800, color:col, fontFamily:"Georgia,serif" }}>{val}</div>
                              <div style={{ fontSize:11, color:C.text3, fontWeight:700 }}>{lbl}</div>
                              <div style={{ height:5, background:C.gray2, borderRadius:3, marginTop:6 }}><div style={{ height:5, borderRadius:3, background:col, width:`${val}%` }}/></div>
                            </div>
                          );})}
                        </div>
                        {score.missing?.length>0&&<div style={{ padding:"12px 14px", background:C.orangelt, borderRadius:9 }}><div style={{ fontSize:12, fontWeight:800, color:C.orange, marginBottom:6 }}>Missing Elements</div>{score.missing.map((m,i)=><div key={i} style={{fontSize:12,color:C.orange}}>• {m}</div>)}</div>}
                        {score.translation&&<div style={{ padding:"12px 14px", background:C.greenlt, borderRadius:9, borderLeft:`4px solid ${C.green}` }}><div style={{ fontSize:11, fontWeight:800, color:C.green, textTransform:"uppercase", letterSpacing:.4, marginBottom:6 }}>✦ AI Staff Translation</div><div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{score.translation}</div></div>}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {tab==="effectiveness" && (
          <div style={{ display:"grid", gap:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>BA Effectiveness Scorecard</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {[["Plans Active","5",C.purple,"All residents covered"],["Reviews Overdue","2",C.red,">90 days without update"],["Incidents This Wk","3",C.orange,"Down from 7 last week"],["Stage Progressions","1",C.green,"Jonah: S8→S9 (42 days)"]].map(([lbl,val,col,sub])=>(
                <Card key={lbl}><div style={{ padding:20 }}><div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>{lbl}</div><div style={{ fontSize:32, fontWeight:800, color:col, fontFamily:"Georgia,serif" }}>{val}</div><div style={{ fontSize:12, color:C.text3, marginTop:4 }}>{sub}</div></div></Card>
              ))}
            </div>

            {/* BEI Radar — multidimensional BA comparison */}
            <Card>
              <CardHdr title="BEI Radar — All Behavior Analysts" sub="Visual comparison across 4 dimensions · Low scores + stagnation = fraud pattern"/>
              <div style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, alignItems:"center" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={[
                    { dim:"Client Progress",      "Sarah P.":78, "Dr. James R.":28, "Tanya W.":24 },
                    { dim:"Plan Revision",         "Sarah P.":92, "Dr. James R.":31, "Tanya W.":18 },
                    { dim:"Plan Accessibility",    "Sarah P.":73, "Dr. James R.":41, "Tanya W.":58 },
                    { dim:"Overall BEI",           "Sarah P.":81, "Dr. James R.":42, "Tanya W.":38 },
                  ]}>
                    <PolarGrid stroke={C.gray2}/>
                    <PolarAngleAxis dataKey="dim" tick={{fontSize:10, fill:C.text3}}/>
                    <Radar name="Sarah P., BCBA"  dataKey="Sarah P."      stroke={C.green}  fill={C.green}  fillOpacity={0.15}/>
                    <Radar name="Dr. James R."    dataKey="Dr. James R."  stroke={C.red}    fill={C.red}    fillOpacity={0.15}/>
                    <Radar name="Tanya W., BCaBA" dataKey="Tanya W."      stroke={C.orange} fill={C.orange} fillOpacity={0.15}/>
                    <Legend/>
                    <Tooltip/>
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ padding:"0 14px", display:"grid", gap:10 }}>
                  {BEI_DATA.map(ba=>{
                    const col = ba.bei>=70?C.green:ba.bei>=50?C.gold:C.red;
                    const bg  = ba.bei>=70?C.greenlt:ba.bei>=50?C.goldlt:C.redlt;
                    return (
                      <div key={ba.ba} style={{ padding:"10px 14px", background:bg, borderRadius:10, border:`2px solid ${col}33` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <div style={{ fontSize:12, fontWeight:800, color:col }}>{ba.ba}</div>
                          <div style={{ fontSize:16, fontWeight:800, color:col }}>{ba.bei}</div>
                        </div>
                        <div style={{ height:5, background:"rgba(0,0,0,.08)", borderRadius:3 }}>
                          <div style={{ height:5, borderRadius:3, background:col, width:`${ba.bei}%` }}/>
                        </div>
                        {ba.flag==="fraud" && (
                          <div style={{ fontSize:11, color:col, fontWeight:700, marginTop:5 }}>
                            ⚠ {ba.stagnation>0?`${ba.stagnation} stagnation flag${ba.stagnation>1?"s":""}  detected`:"Data integrity anomaly"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{ padding:"8px 12px", background:C.gray0, borderRadius:9, fontSize:11, color:C.text3 }}>
                    BEI &lt; 50 with stagnation flags → automatic APD review notification
                  </div>
                </div>
              </div>
            </Card>
              <CardHdr title="BEI by Stage — Behavioral Episode Incidents"/>
              <div style={{ padding:"14px 20px" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[{stage:"S0 Honeymoon",beis:0},{stage:"S3 Hard Stretch",beis:3},{stage:"S5 Groove",beis:1},{stage:"S7 Stuck",beis:4},{stage:"S8 Illusion",beis:2}]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                    <XAxis dataKey="stage" tick={{fontSize:10}}/>
                    <YAxis tick={{fontSize:11}}/>
                    <Tooltip/>
                    <Bar dataKey="beis" name="Incidents" radius={[4,4,0,0]}>
                      {[0,3,1,4,2].map((v,i)=><Cell key={i} fill={v>=4?C.red:v>=2?C.orange:C.purple}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* BEI Scorecard — BA fraud detection */}
            <div style={{ fontSize:15, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>BA Behavioral Effectiveness Index (BEI) — Fraud Detection</div>
            <div style={{ padding:"10px 16px", background:C.redlt, borderRadius:10, fontSize:13, color:C.red, fontWeight:600, borderLeft:`4px solid ${C.red}` }}>
              ⚠ BEI scores below 50 combined with stagnation flags trigger automatic APD notification review. "Uniform data entries" is a Sentinel indicator for pencil-whipping.
            </div>
            {BEI_DATA.map(ba=>{
              const accColor = s=>s>=70?C.green:s>=50?C.gold:C.red;
              const accBg    = s=>s>=70?C.greenlt:s>=50?C.goldlt:C.redlt;
              return (
                <Card key={ba.ba} style={{ border:ba.flag==="fraud"?`2px solid ${C.redmed}`:undefined }}>
                  <div style={{ padding:"13px 18px", borderBottom:`1px solid ${C.gray1}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:ba.flag==="fraud"?C.redlt:C.white, borderRadius:"12px 12px 0 0" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:ba.flag==="fraud"?C.red:C.navy }}>{ba.ba}</div>
                      <div style={{ fontSize:11, color:C.text3 }}>{ba.clients} clients · LUMINARK BEI</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      {ba.stagnation>0 && <Tag label={`${ba.stagnation} Stagnation Flag${ba.stagnation>1?"s":""}`} color={C.white} bg={C.redmed} small/>}
                      <div style={{ padding:"6px 14px", background:accBg(ba.bei), borderRadius:20, fontSize:13, fontWeight:800, color:accColor(ba.bei) }}>BEI: {ba.bei}/100</div>
                    </div>
                  </div>
                  <div style={{ padding:14, display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10 }}>
                    {[["Client Progress",ba.progress],["Plan Revision Rate",ba.revision],["Plan Accessibility",ba.accessibility],["Overall BEI",ba.bei]].map(([l,v])=>(
                      <div key={l}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:11, color:C.text3 }}>{l}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:accColor(v) }}>{v}%</span>
                        </div>
                        <div style={{ height:6, background:C.gray1, borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${v}%`, background:accColor(v), borderRadius:3 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ba.flag==="fraud" && (
                    <div style={{ padding:"10px 16px", background:C.redlt, borderTop:`1px solid ${C.gray1}` }}>
                      <div style={{ fontSize:12, color:C.red, fontWeight:700 }}>
                        {ba.stagnation>0
                          ? `⚠ ${ba.stagnation} resident(s) in Stage 7+ for 90+ days with no plan revision — Persistent Non-Resolution Pattern detected. APD notification may be required.`
                          : "⚠ Data integrity anomaly detected — uniform data entries flagged by Sentinel. Review required before next APD submission."}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* JARGON TRANSLATOR TAB */}
        {tab==="jargon" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Card>
              <CardHdr title="ABA → Plain Language Quick Reference" sub="12 most common clinical terms — what they really mean"/>
              <div style={{ padding:14, display:"grid", gap:7 }}>
                {ABA_JARGON.map(([aba, plain, example]) => (
                  <div key={aba} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                      <div style={{ fontSize:11, fontWeight:800, color:C.red, minWidth:140, flexShrink:0 }}>{aba}</div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.navy }}>{plain}</div>
                        <div style={{ fontSize:11, color:C.text3, fontStyle:"italic", marginTop:2 }}>{example}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHdr title="✦ AI Jargon Translator" sub="Paste clinical text — get plain English back"/>
              <div style={{ padding:14 }}>
                <AIPlanTranslator/>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FACE SHEET (enhanced) ─────────────────────────────────────────────────────
function FaceSheet({resident}) {
  const s = STAGES[resident.stage];
  const [showSeizure, setShowSeizure] = useState(false);
  return (
    <div style={{ display:"grid", gap:14 }}>
      <ResidentBar resident={resident}/>

      {/* CRITICAL ALERTS ROW */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
        {resident.dnr && (
          <div style={{ padding:"12px 16px", background:C.red, color:C.white, borderRadius:12, textAlign:"center", fontWeight:800, fontSize:14 }}>
            ⛔ DO NOT RESUSCITATE<div style={{fontSize:11,fontWeight:400,marginTop:2}}>DNR Order on File</div>
          </div>
        )}
        {!resident.dnr && (
          <div style={{ padding:"12px 16px", background:C.greenlt, color:C.green, borderRadius:12, textAlign:"center", fontWeight:700, fontSize:13 }}>
            ✓ Full Resuscitation Authorized<div style={{fontSize:11,fontWeight:400,marginTop:2}}>No DNR on file</div>
          </div>
        )}
        <div style={{ padding:"12px 16px", background:resident.dietaryAlert?C.redlt:C.greenlt, color:resident.dietaryAlert?C.red:C.green, borderRadius:12, fontWeight:700, fontSize:13 }}>
          🍽 Diet: {resident.dietaryTexture}
          {resident.dietaryAlert && <div style={{fontSize:11,fontWeight:600,marginTop:2}}>{resident.dietaryAlert}</div>}
        </div>
        {resident.seizureHistory && (
          <div onClick={()=>setShowSeizure(true)} style={{ padding:"12px 16px", background:C.redlt, color:C.red, borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", border:`2px solid ${C.redmed}` }}>
            ⚡ SEIZURE HISTORY<div style={{fontSize:11,fontWeight:600,marginTop:2}}>Tap for Action Plan →</div>
          </div>
        )}
        {!resident.seizureHistory && (
          <div style={{ padding:"12px 16px", background:C.gray0, color:C.text3, borderRadius:12, fontWeight:600, fontSize:13 }}>
            ✓ No Seizure History
          </div>
        )}
      </div>

      {/* SAP STAGE INTELLIGENCE CARD */}
      <Card style={{ border:`2px solid ${s.color}44` }}>
        <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${s.color}18 0%,${s.bg} 100%)`, borderRadius:"12px 12px 0 0", borderBottom:`2px solid ${s.color}33` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>
                LUMINARK Stage {resident.stage} · {s.geometry} {s.symbol} {s.controlPoint?"· ⭐ SAP Control Point":""}
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>{s.name}</div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <Tag label={`Tension ${s.tension}/10`} color={s.tension>=8?C.white:C.text} bg={s.tension>=8?C.red:s.tension>=5?C.orange:C.greenlt} small/>
              <Tag label={s.inversion.split(" — ")[0]} color={C.navy} bg={C.gray1} small/>
              {s.controlPoint && <Tag label="⭐ 3-6-9 Control Point" color={C.white} bg={C.gold} small/>}
            </div>
          </div>
        </div>
        <div style={{ padding:16, display:"grid", gap:12 }}>
          {/* SAP Principle */}
          <div style={{ padding:"12px 14px", background:s.bg, borderRadius:10, borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:10, fontWeight:800, color:s.color, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>What This Stage Means</div>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{s.sapPrinciple}</div>
          </div>
          {/* Staff Reality vs Internal Reality */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ padding:"12px 14px", background:C.gray0, borderRadius:10 }}>
              <div style={{ fontSize:10, fontWeight:800, color:C.navy, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>👤 What Staff See</div>
              <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{s.staffReality}</div>
            </div>
            <div style={{ padding:"12px 14px", background:`${s.color}08`, borderRadius:10, border:`1px solid ${s.color}22` }}>
              <div style={{ fontSize:10, fontWeight:800, color:s.color, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>💭 What the Resident Experiences</div>
              <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{s.internalReality}</div>
            </div>
          </div>
          {/* Action Prompt */}
          <div style={{ padding:"12px 14px", background:C.goldlt, borderRadius:10, borderLeft:`4px solid ${C.gold}` }}>
            <div style={{ fontSize:10, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>✦ What To Do Right Now</div>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{s.actionPrompt}</div>
          </div>
          {/* Trap Warning */}
          <div style={{ padding:"12px 14px", background:C.redlt, borderRadius:10, borderLeft:`4px solid ${C.redmed}` }}>
            <div style={{ fontSize:10, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>⚠ The Stage {resident.stage} Trap — Watch For This</div>
            <div style={{ fontSize:12, color:C.text, lineHeight:1.7 }}>{s.trapWarning}</div>
          </div>
          {/* Velocity + Clinical (last) */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ padding:"10px 12px", background:C.teallt, borderRadius:9 }}>
              <div style={{ fontSize:10, fontWeight:800, color:C.teal, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>⚡ Momentum</div>
              <div style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{s.velocity}</div>
            </div>
            <div style={{ padding:"10px 12px", background:C.gray0, borderRadius:9 }}>
              <div style={{ fontSize:10, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>📋 Clinical Term (for documentation)</div>
              <div style={{ fontSize:11, color:C.text2, lineHeight:1.6, fontStyle:"italic" }}>{s.clinicalParallel}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* NSDT LIVE CLASSIFICATION — Kairos Engine */}
      <NSDTLogger resident={resident} onClassified={()=>{}}/>

      {showSeizure && resident.seizurePlan && (
        <Card style={{ border:`3px solid ${C.red}` }}>
          <div style={{ padding:"14px 18px", background:C.red, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:C.white, fontWeight:800, fontSize:15 }}>⚡ SEIZURE ACTION PLAN — {resident.name}</div>
            <Btn v="ghost" small onClick={()=>setShowSeizure(false)} style={{color:C.white,borderColor:C.white}}>Close</Btn>
          </div>
          <div style={{ padding:16, display:"grid", gap:10 }}>
            {[
              ["At start of seizure", resident.seizurePlan.atStart, C.orange, C.orangelt],
              ["At 3 minutes", resident.seizurePlan.at3min, C.red, C.redlt],
              ["At 5 minutes", resident.seizurePlan.at5min, C.red, "#F5D5D5"],
              ["After seizure ends", resident.seizurePlan.post, C.teal, C.teallt],
            ].map(([label,text,col,bg])=>(
              <div key={label} style={{ padding:"12px 14px", background:bg, borderRadius:10, borderLeft:`4px solid ${col}` }}>
                <div style={{ fontSize:11, fontWeight:800, color:col, textTransform:"uppercase", letterSpacing:.4, marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:14, color:C.text, fontWeight:600 }}>{text}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <CardHdr title="Demographics & Clinical"/>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {[
              ["Date of Birth", `${resident.dob} (Age ${resident.age})`],
              ["Insurance", resident.insurance],
              ["Physician", resident.physician],
              ["Guardian / Emergency", resident.guardian],
              ["Communication Style", resident.communication],
              ["IB Status", resident.ibStatus],
              ["Assigned BA", resident.ba],
            ].map(([l,v])=>(
              <div key={l} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.4, marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <CardHdr title="⚠ Allergies" dark/>
            <div style={{ padding:14, display:"grid", gap:6 }}>
              {resident.allergies.map(a=>(
                <div key={a} style={{ padding:"8px 14px", background:C.redlt, color:C.red, borderRadius:8, fontSize:14, fontWeight:700 }}>⚠ {a}</div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHdr title="Diagnoses"/>
            <div style={{ padding:14, display:"grid", gap:6 }}>
              {resident.diagnosis.map(d=>(
                <div key={d} style={{ padding:"8px 12px", background:C.purplelt, color:C.purple, borderRadius:8, fontSize:12, fontWeight:600 }}>{d}</div>
              ))}
            </div>
          </Card>
          <div style={{ padding:14, background:s.bg, borderRadius:12, border:`2px solid ${s.color}44` }}>
            <div style={{ fontSize:11, fontWeight:700, color:s.color, textTransform:"uppercase", letterSpacing:.4, marginBottom:4 }}>Current Lifecycle Stage</div>
            <div style={{ fontSize:16, fontWeight:800, color:s.color, fontFamily:"Georgia,serif" }}>S{s.id}: {s.name}</div>
          </div>
        </div>
      </div>
      <Card>
        <CardHdr title="Behavioral Triggers — Know Before Your Shift"/>
        <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
          {resident.behavioralTriggers.map(t=>(
            <div key={t} style={{ padding:"10px 14px", background:C.orangelt, color:C.orange, borderRadius:10, fontSize:13, fontWeight:600 }}>⚡ {t}</div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHdr title="Staff Notes"/>
        <div style={{ padding:16 }}>
          <p style={{ fontSize:14, color:C.text, lineHeight:1.8, margin:0, background:C.gray0, padding:"14px 16px", borderRadius:10, borderLeft:`4px solid ${C.gold}` }}>{resident.notes}</p>
        </div>
      </Card>

      {/* ── BEHAVIOR PLAN — Staff/Clinical toggle ── */}
      {resident.behaviorPlan && <BehaviorPlanViewer resident={resident}/>}

      {/* ── PCM APPROVED TECHNIQUES ── */}
      {resident.pcm && (
        <Card style={{ border:`2px solid ${C.greenmed}33` }}>
          <div style={{ padding:"12px 18px", background:`linear-gradient(135deg,${C.green} 0%,#1A7A2E 100%)`, borderRadius:"12px 12px 0 0" }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.white }}>✅ Approved PCM Techniques</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginTop:2 }}>Only these interventions are authorized for {resident.name.split(" ")[0]} — Florida APD Chapter 65G-8</div>
          </div>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {resident.pcm.map((item,i)=>(
              <div key={i} style={{ padding:"10px 14px", background:C.greenlt, borderRadius:9, fontSize:13, color:C.green, fontWeight:600, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{fontSize:16,flexShrink:0}}>✓</span>{item}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── PROHIBITED PROCEDURES ── */}
      {resident.prohibited && (
        <Card style={{ border:`2px solid ${C.red}` }}>
          <div style={{ padding:"12px 18px", background:`linear-gradient(135deg,${C.red} 0%,${C.redmed} 100%)`, borderRadius:"12px 12px 0 0" }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.white }}>🚫 PROHIBITED PROCEDURES</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", marginTop:2 }}>Using any prohibited procedure is a civil rights violation and a mandatory APD reportable incident — FL Ch. 65G-8.005</div>
          </div>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {resident.prohibited.map((item,i)=>(
              <div key={i} style={{ padding:"10px 14px", background:C.redlt, borderRadius:9, fontSize:13, color:C.red, fontWeight:700, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{fontSize:16,flexShrink:0}}>⛔</span>{item.replace("⛔ ","")}
              </div>
            ))}
            <div style={{ padding:"10px 14px", background:"#1A1814", borderRadius:9, fontSize:12, color:"#FFB3B3", fontWeight:600, fontStyle:"italic" }}>
              If an owner, supervisor, or any person instructs you to use a prohibited procedure — you have the legal right and duty to refuse. Report immediately to APD at 1-866-APD-CARES.
            </div>
          </div>
        </Card>
      )}

      {/* ── BAKER ACT GUIDANCE ── */}
      {resident.bakerAct && (
        <Card style={{ border:`2px solid ${C.purple}44` }}>
          <div style={{ padding:"12px 18px", background:`linear-gradient(135deg,${C.purple} 0%,#2D0F5A 100%)`, borderRadius:"12px 12px 0 0" }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.white }}>⚖ Baker Act Decision Guidance — {resident.bakerAct.statute}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginTop:2 }}>Use the AI Procedure Guide for the full interactive checklist — this card is a quick reference only</div>
          </div>
          <div style={{ padding:16, display:"grid", gap:10 }}>
            {resident.bakerAct.history && (
              <div style={{ padding:"10px 14px", background:C.goldlt, borderRadius:9, fontSize:12, color:C.text, fontWeight:600, borderLeft:`4px solid ${C.gold}` }}>
                📋 History: {resident.bakerAct.historyNote}
              </div>
            )}
            {!resident.bakerAct.history && (
              <div style={{ padding:"10px 14px", background:C.greenlt, borderRadius:9, fontSize:12, color:C.green, fontWeight:600 }}>
                ✓ No Baker Act history on file
              </div>
            )}
            {resident.bakerAct.threshold && (
              <div style={{ padding:"12px 14px", background:C.purplelt, borderRadius:9, fontSize:12, color:C.purple, fontWeight:600 }}>
                <div style={{ fontWeight:800, marginBottom:6 }}>Threshold for consult:</div>
                {resident.bakerAct.threshold}
              </div>
            )}
            {resident.bakerAct.nonVerbalNote && (
              <div style={{ padding:"12px 14px", background:"#1A0030", borderRadius:9, fontSize:12, color:"#FFB3FF", fontWeight:700 }}>
                {resident.bakerAct.nonVerbalNote}
              </div>
            )}
            <Btn v="purple" small onClick={()=>{}}>⚖ Open Full Baker Act Checklist in AI Guide</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── MED ADMIN (enhanced) ──────────────────────────────────────────────────────
function MedAdmin({resident}) {
  const now = new Date();
  const currentHour = now.getHours();
  const [administered, setAdministered] = useState({});
  const [refused, setRefused] = useState({});
  const [destroyed, setDestroyed] = useState({});
  const [scanResult, setScanResult] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [prnFollowUp, setPrnFollowUp] = useState({});
  const [prnEffectiveness, setPrnEffectiveness] = useState({});
  const [controlledWitness, setControlledWitness] = useState({});
  const [witnessName, setWitnessName] = useState("");
  const [showDestroyModal, setShowDestroyModal] = useState(null);
  const [destroyWitness, setDestroyWitness] = useState("");

  const isDue = (times) => {
    if (showAll) return true;
    return times.some(t => {
      if (t.includes("needed")) return false;
      let hr = parseInt(t);
      if (t.includes("PM") && hr !== 12) hr += 12;
      return Math.abs(hr - currentHour) <= 1;
    });
  };

  const dueMeds = resident.meds.filter(m => isDue(m.times));
  const prnMeds = resident.meds.filter(m => m.times.some(t=>t.includes("needed")));

  const confirmAdmin = (med) => {
    if (med.controlled && !controlledWitness[med.id]) return;
    setAdministered(p=>({...p,[med.id]:now.toLocaleTimeString()}));
    setScanResult(null);
    if (med.isPRN) {
      // Schedule 30-min follow-up alert
      setPrnFollowUp(p=>({...p,[med.id]:{startTime:new Date(),done:false}}));
    }
  };

  const markRefused = (medId) => {
    setRefused(p=>({...p,[medId]:now.toLocaleTimeString()}));
    setScanResult(null);
  };

  const logPRNEffectiveness = (medId, effective) => {
    setPrnEffectiveness(p=>({...p,[medId]:{effective, time:new Date().toLocaleTimeString()}}));
    setPrnFollowUp(p=>({...p,[medId]:{...p[medId], done:true}}));
  };

  const getDaysRemaining = (medId) => {
    const pc = resident.pillCounts?.[medId];
    if (!pc) return null;
    return Math.floor(pc.current / pc.perDay);
  };

  const mealTimeDisplay = () => {
    const h = currentHour;
    if (h >= 6 && h < 10) return "Breakfast Time";
    if (h >= 11 && h < 14) return "Lunch Time";
    if (h >= 17 && h < 20) return "Dinner Time";
    return null;
  };
  const mealTime = mealTimeDisplay();

  return (
    <div style={{ display:"grid", gap:14 }}>
      <ResidentBar resident={resident}/>

      {/* DIETARY ALERT AT MEAL TIMES */}
      {mealTime && (resident.dietaryAlert || resident.dietaryTexture !== "Regular") && (
        <div style={{ padding:"14px 18px", background:C.redlt, borderRadius:12, border:`2px solid ${C.redmed}`, display:"flex", gap:12, alignItems:"center" }}>
          <span style={{fontSize:28}}>🍽</span>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:C.red }}>{mealTime} — DIETARY ALERT</div>
            <div style={{ fontSize:13, color:C.text, marginTop:2 }}>
              Required texture: <strong>{resident.dietaryTexture}</strong>
              {resident.dietaryAlert && <span> — {resident.dietaryAlert}</span>}
            </div>
          </div>
        </div>
      )}

      {/* 3-WAY MATCH */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, padding:"14px 20px", borderRadius:14, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[
          ["✓ Right Resident", resident.name, C.greenlt, C.green],
          ["✓ Right Time", now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), C.goldlt, C.gold],
          [dueMeds.length>0?`${dueMeds.length} Med(s) Due`:"All Clear", showAll?"Showing All":"Current Window", C.teallt, C.teal],
        ].map(([l,v,bg,col])=>(
          <div key={l} style={{ textAlign:"center", background:bg, borderRadius:10, padding:"10px 12px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:col, textTransform:"uppercase", letterSpacing:.4, marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      {/* PRN FOLLOW-UP ALERTS */}
      {Object.entries(prnFollowUp).filter(([,v])=>!v.done).map(([medId, data])=>{
        const med = resident.meds.find(m=>m.id===medId);
        const minsPassed = Math.floor((new Date() - data.startTime) / 60000);
        return (
          <div key={medId} style={{ padding:"14px 18px", background:C.goldlt, borderRadius:12, border:`2px solid ${C.gold}` }}>
            <div style={{ fontWeight:800, color:C.gold, marginBottom:8 }}>⏰ PRN Follow-Up Required — {med?.name} ({minsPassed} min ago)</div>
            <div style={{ fontSize:13, color:C.text, marginBottom:10 }}>Florida APD requires effectiveness documentation 30–60 minutes after PRN administration.</div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn v="green" onClick={()=>logPRNEffectiveness(medId, true)}>✓ Medication Was Effective</Btn>
              <Btn v="red" onClick={()=>logPRNEffectiveness(medId, false)}>✗ Not Effective — Notify BA</Btn>
            </div>
          </div>
        );
      })}

      {/* SCAN RESULT */}
      {scanResult && (
        <Card style={{ border:`3px solid ${C.green}` }}>
          <div style={{ padding:20 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.green, marginBottom:8 }}>✓ SCAN VERIFIED — THREE-WAY MATCH CONFIRMED</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[["Resident",scanResult.resident.name],["Medication",scanResult.matched.name],["NDC",scanResult.matched.ndc],["Route",scanResult.matched.route]].map(([l,v])=>(
                <div key={l} style={{ padding:"8px 12px", background:C.greenlt, borderRadius:9 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.green, textTransform:"uppercase" }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.green }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:"10px 14px", background:C.goldlt, borderRadius:9, fontSize:13, marginBottom:12 }}>
              <strong>Instructions:</strong> {scanResult.matched.instructions}
            </div>
            {scanResult.matched.controlled && (
              <div style={{ padding:"12px 14px", background:C.redlt, borderRadius:9, marginBottom:12 }}>
                <div style={{ fontWeight:800, color:C.red, marginBottom:8 }}>⚠ CONTROLLED SUBSTANCE — Dual Witness Required (Form 65G-7.007B)</div>
                <Inp label="Witness Name (Print Full Name)" value={witnessName} onChange={n=>{setWitnessName(n);setControlledWitness(p=>({...p,[scanResult.matched.id]:n}));}} placeholder="Witnessing staff member's full name"/>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <Btn v="green" full onClick={()=>confirmAdmin(scanResult.matched)}>
                ✓ Confirm Administered — {now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
              </Btn>
              <Btn v="red" onClick={()=>markRefused(scanResult.matched.id)}>Refused</Btn>
              <Btn v="orange" onClick={()=>{setShowDestroyModal(scanResult.matched);setScanResult(null);}}>Destroy/Dispose</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* DESTROY MODAL */}
      {showDestroyModal && (
        <Card style={{ border:`3px solid ${C.orange}` }}>
          <CardHdr title="Medication Destruction / Disposal — Form 65G-7.007A" dark/>
          <div style={{ padding:16 }}>
            <div style={{ fontSize:13, color:C.text, marginBottom:12, padding:"10px 14px", background:C.orangelt, borderRadius:9 }}>
              Dropped pill, refused dose, or damaged medication must be documented and destroyed with a witness. This record is permanent and immutable.
            </div>
            <Inp label="Reason for Destruction" value={destroyWitness} onChange={setDestroyWitness} placeholder="e.g. Pill dropped on floor during administration"/>
            <Inp label="Witness Name" value={witnessName} onChange={setWitnessName} placeholder="Full name of witnessing staff"/>
            <div style={{ display:"flex", gap:10 }}>
              <Btn v="orange" full onClick={()=>{setDestroyed(p=>({...p,[showDestroyModal.id]:{reason:destroyWitness,witness:witnessName,time:now.toLocaleTimeString()}}));setShowDestroyModal(null);}}>
                ✓ Log Destruction — Witnessed & Documented
              </Btn>
              <Btn v="ghost" onClick={()=>setShowDestroyModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* MED LIST */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{dueMeds.length > 0 ? `${dueMeds.length} medication(s) due now` : "No meds due in current window"}</div>
        <Btn v="ghost" small onClick={()=>setShowAll(p=>!p)}>{showAll?"Show Due Only":"Show All Meds"}</Btn>
      </div>

      <div style={{ display:"grid", gap:10 }}>
        {(showAll ? resident.meds : [...dueMeds, ...prnMeds]).map(med => {
          const done = administered[med.id];
          const ref = refused[med.id];
          const dest = destroyed[med.id];
          const daysLeft = getDaysRemaining(med.id);
          const lowStock = daysLeft !== null && daysLeft <= 7;
          return (
            <Card key={med.id} style={{ border: done?`2px solid ${C.green}`:ref?`2px solid ${C.orange}`:dest?`2px solid ${C.purple}`:med.controlled?`2px solid ${C.red}22`:`1px solid ${C.gray1}` }}>
              <div style={{ padding:16 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:done?C.greenlt:ref?C.orangelt:dest?C.purplelt:med.controlled?C.redlt:C.gray0,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {done?"✓":ref?"⚠":dest?"⛔":"💊"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:4, alignItems:"center" }}>
                      <span style={{ fontWeight:800, fontSize:15 }}>{med.name}</span>
                      {med.controlled && <Tag label="CONTROLLED" color={C.white} bg={C.red} small/>}
                      {med.isPRN && <Tag label="PRN" color={C.teal} bg={C.teallt} small/>}
                      {lowStock && <Tag label={`⚠ ${daysLeft}d supply left`} color={C.white} bg={C.orange} small/>}
                    </div>
                    <div style={{ fontSize:12, color:C.text3 }}>Route: {med.route} · NDC: {med.ndc}</div>
                    <div style={{ fontSize:12, color:C.text2, margin:"4px 0" }}>⏰ {med.times.join(" · ")}</div>
                    <div style={{ fontSize:12, color:C.text2, background:C.gray0, padding:"6px 10px", borderRadius:7 }}>{med.instructions}</div>
                    {prnEffectiveness[med.id] && (
                      <div style={{ marginTop:6, padding:"6px 10px", borderRadius:7, background:prnEffectiveness[med.id].effective?C.greenlt:C.redlt, fontSize:12, fontWeight:700, color:prnEffectiveness[med.id].effective?C.green:C.red }}>
                        PRN Follow-up @ {prnEffectiveness[med.id].time}: {prnEffectiveness[med.id].effective?"✓ Effective":"✗ Not Effective — BA Notified"}
                      </div>
                    )}
                    {dest && <div style={{ marginTop:6, fontSize:12, fontWeight:700, color:C.purple }}>⛔ Destroyed @ {dest.time} · Witness: {dest.witness} · Reason: {dest.reason}</div>}
                  </div>
                  <div style={{ flexShrink:0 }}>
                    {done && <div style={{ fontSize:12, fontWeight:700, color:C.green }}>Given {done}</div>}
                    {ref && <div style={{ fontSize:12, fontWeight:700, color:C.orange }}>Refused {ref}</div>}
                    {!done && !ref && !dest && (
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <Btn v="primary" small onClick={()=>setScanResult({matched:med,resident})}>📱 Scan & Verify</Btn>
                        <Btn v="orange" small onClick={()=>markRefused(med.id)}>Refused</Btn>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        {dueMeds.length===0 && !showAll && (
          <div style={{ textAlign:"center", padding:32, color:C.text3, background:C.white, borderRadius:14, border:`1px solid ${C.gray1}` }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✓</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.green }}>No meds due right now</div>
            <Btn v="ghost" style={{marginTop:12}} onClick={()=>setShowAll(true)}>View All Medications</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMMUNICATION LOG ─────────────────────────────────────────────────────────
function CommunicationLog({session}) {
  const [logs, setLogs] = useState(COMM_LOG_INIT.filter(l=>l.home===session.home));
  const [form, setForm] = useState({category:"General", text:"", claimedMinutes:""});
  const [analyzing, setAnalyzing] = useState(false);
  const [taskStart, setTaskStart] = useState(null);
  const [taskElapsed, setTaskElapsed] = useState(0);
  const [taskRunning, setTaskRunning] = useState(false);
  const [irDrafts, setIrDrafts] = useState({});
  const [irLoading, setIrLoading] = useState({});
  const CATS = ["General","Behavioral","Medical","Safety","Handover","Outing","Activity Log"];

  // Task timer tick
  useEffect(() => {
    if (!taskRunning) return;
    const t = setInterval(() => setTaskElapsed(Math.floor((Date.now() - taskStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, [taskRunning, taskStart]);

  const startTask = () => { setTaskStart(Date.now()); setTaskElapsed(0); setTaskRunning(true); };
  const stopTask  = () => { setTaskRunning(false); };
  const fmtSecs   = s => `${Math.floor(s/60)}m ${s%60}s`;

  const detectFidelityFlag = (claimedMins, actualSecs) => {
    if (!claimedMins || !actualSecs) return null;
    const claimedSecs = parseFloat(claimedMins) * 60;
    const ratio = actualSecs / claimedSecs;
    if (ratio < 0.25) return { flag:true, msg:`⚠ FIDELITY ALERT: You claimed ${claimedMins} min but the task timer ran only ${fmtSecs(actualSecs)}. This discrepancy is flagged for supervisor review (BA Effectiveness Score).` };
    if (ratio < 0.5)  return { flag:true, msg:`⚠ Note: Task timer (${fmtSecs(actualSecs)}) is significantly shorter than claimed duration (${claimedMins} min). Supervisor may follow up.` };
    return null;
  };

  const addLog = async () => {
    if (!form.text.trim()) return;
    setAnalyzing(true);
    const flagWords = ["hit","fell","refused","screamed","kicked","injured","hurt","aggressive","bleeding","seizure","fight","bite","struck","choked","threw","push","shove","elopement","missing","wandered","restraint"];
    const found = flagWords.filter(w=>form.text.toLowerCase().includes(w));
    const flagged = found.length > 0;
    const flagReason = flagged ? `🚨 Key word(s) "${found.join('", "')}" detected — Incident Report may be required within 24 hours (APD Rule 65G-2.009)` : "";
    const fidelityCheck = taskElapsed > 0 ? detectFidelityFlag(form.claimedMinutes, taskElapsed) : null;
    const newLog = {
      id:`CL${Date.now()}`, date:"2026-05-09", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      staffId:session.staff.id, home:session.home, category:form.category, text:form.text,
      aiFlag:flagged, flagReason,
      claimedMinutes:form.claimedMinutes||null, actualSeconds:taskElapsed||null,
      fidelityFlag: fidelityCheck,
    };
    setLogs(p=>[newLog,...p]);
    setForm({category:"General",text:"",claimedMinutes:""});
    setTaskElapsed(0); setTaskRunning(false); setTaskStart(null);
    setAnalyzing(false);
  };

  const draftIR = async (log) => {
    setIrLoading(p=>({...p,[log.id]:true}));
    const txt = await callClaude(
      [{role:"user", content:`A Florida APD group home staff member wrote this communication log entry:\n\n"${log.text}"\n\nThis was flagged by the AI Sentinel because it contains incident-trigger language. Draft a professional Incident Report for APD Rule 65G-2.009. Include:\n1. DATE/TIME: ${log.date} at ${log.time}\n2. STAFF: ${STAFF_DB[log.staffId]?.name}\n3. HOME: ${log.home}\n4. DESCRIPTION OF INCIDENT: (expand on the log note professionally)\n5. IMMEDIATE ACTIONS TAKEN:\n6. NOTIFICATIONS REQUIRED: (Supervisor, Guardian, BA, APD within 24 hrs)\n7. FOLLOW-UP REQUIRED:\n\nUse plain, professional language. Do not soften or minimize the incident.`}],
      "You are a Florida APD incident report drafting assistant. You write clear, accurate, legally defensible incident reports based on staff notes. Never minimize injuries or behavioral incidents. Flag if language seems to understate severity."
    );
    setIrDrafts(p=>({...p,[log.id]:txt}));
    setIrLoading(p=>({...p,[log.id]:false}));
  };

  const catColors = {General:C.navy,Behavioral:C.orange,Medical:C.teal,Safety:C.red,Handover:C.green,Outing:C.purple,"Activity Log":C.teal};

  return (
    <div style={{ display:"grid", gap:14 }}>
      <Card>
        <CardHdr title="Add Communication Log Entry" sub={`${session.home} · ${session.staff.name}`} dark/>
        <div style={{ padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6, marginBottom:14 }}>
            {CATS.map(c=>(
              <div key={c} onClick={()=>setForm(p=>({...p,category:c}))}
                style={{ padding:"6px 4px", borderRadius:8, textAlign:"center", cursor:"pointer", fontSize:11, fontWeight:700,
                  background:form.category===c?(catColors[c]||C.navy):C.gray0,
                  color:form.category===c?C.white:C.text3, border:`2px solid ${form.category===c?(catColors[c]||C.navy):C.gray2}` }}>
                {c}
              </div>
            ))}
          </div>
          <Textarea label="Note" value={form.text} onChange={v=>setForm(p=>({...p,text:v}))} rows={4}
            placeholder="Document exactly what happened, using plain and specific language. Avoid vague terms."/>

          {/* TIME-ON-TASK FIDELITY TRACKER */}
          <div style={{ background:C.gray0, borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>
              ⏱ Activity Fidelity Timer <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional — for timed tasks like ROM exercise, hygiene, etc.)</span>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
              {!taskRunning && taskElapsed === 0 && (
                <Btn v="teal" small onClick={startTask}>▶ Start Task Timer</Btn>
              )}
              {taskRunning && (
                <Btn v="red" small onClick={stopTask}>■ Stop — {fmtSecs(taskElapsed)}</Btn>
              )}
              {!taskRunning && taskElapsed > 0 && (
                <div style={{ padding:"5px 12px", background:C.teallt, borderRadius:8, fontSize:12, fontWeight:700, color:C.teal }}>
                  ✓ Timer stopped: {fmtSecs(taskElapsed)}
                </div>
              )}
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:12, color:C.text3 }}>Claimed duration (min):</span>
                <input type="number" value={form.claimedMinutes} onChange={e=>setForm(p=>({...p,claimedMinutes:e.target.value}))}
                  placeholder="e.g. 15" style={{ width:70, padding:"5px 8px", borderRadius:7, border:`1px solid ${C.gray2}`, fontSize:12, fontFamily:"inherit" }}/>
              </div>
            </div>
            {taskElapsed > 0 && form.claimedMinutes && (() => {
              const chk = detectFidelityFlag(form.claimedMinutes, taskElapsed);
              return chk ? (
                <div style={{ marginTop:8, padding:"8px 12px", background:C.redlt, color:C.red, borderRadius:8, fontSize:12, fontWeight:700 }}>{chk.msg}</div>
              ) : (
                <div style={{ marginTop:8, padding:"8px 12px", background:C.greenlt, color:C.green, borderRadius:8, fontSize:12, fontWeight:700 }}>✓ Timer ({fmtSecs(taskElapsed)}) matches claimed duration — no fidelity flag</div>
              );
            })()}
          </div>

          <Btn v="gold" full onClick={addLog}>{analyzing?"Analyzing...":"✓ Submit & Run AI Sentinel Scan"}</Btn>
          <div style={{ fontSize:11, color:C.text3, textAlign:"center", marginTop:8 }}>
            ✦ AI Sentinel scans for incident-trigger language · Time-on-Task fidelity checked on submission
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gap:10 }}>
        {logs.map(log=>(
          <Card key={log.id} style={{ border:log.aiFlag?`2px solid ${C.red}`:log.fidelityFlag?.flag?`2px solid ${C.orange}`:`1px solid ${C.gray1}` }}>
            <div style={{ padding:14 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                <Tag label={log.category} color={C.white} bg={catColors[log.category]||C.navy} small/>
                <span style={{ fontSize:12, color:C.text3 }}>{log.date} · {log.time}</span>
                <span style={{ fontSize:12, color:C.text3 }}>— {STAFF_DB[log.staffId]?.name || log.staffId}</span>
                {log.aiFlag && <Tag label="🚨 IR Required" color={C.white} bg={C.red} small/>}
                {log.fidelityFlag?.flag && <Tag label="⏱ Fidelity Flag" color={C.white} bg={C.orange} small/>}
              </div>
              <p style={{ fontSize:14, color:C.text, margin:0, lineHeight:1.7 }}>{log.text}</p>

              {/* Fidelity flag detail */}
              {log.fidelityFlag?.flag && (
                <div style={{ marginTop:8, padding:"8px 12px", background:C.orangelt, color:C.orange, borderRadius:8, fontSize:12, fontWeight:700 }}>
                  {log.fidelityFlag.msg}
                </div>
              )}

              {/* Sentiment IR flag + AI drafter */}
              {log.aiFlag && (
                <div style={{ marginTop:10, padding:"10px 12px", background:C.redlt, borderRadius:10, border:`1px solid ${C.redmed}33` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:8 }}>{log.flagReason}</div>
                  {!irDrafts[log.id] && (
                    <Btn v="red" small onClick={()=>draftIR(log)} style={{ marginBottom:4 }}>
                      {irLoading[log.id] ? "Drafting IR..." : "📝 Draft Incident Report with AI"}
                    </Btn>
                  )}
                  {irDrafts[log.id] && (
                    <div>
                      <div style={{ fontSize:11, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>✦ AI SENTINEL — Incident Report Draft</div>
                      <div style={{ background:C.white, borderRadius:9, padding:"12px 14px", fontSize:13, color:C.text, lineHeight:1.8, whiteSpace:"pre-wrap", borderLeft:`4px solid ${C.red}` }}>
                        {irDrafts[log.id]}
                      </div>
                      <div style={{ fontSize:11, color:C.text3, marginTop:8 }}>
                        ⚠ This is an AI-drafted template. Review, verify accuracy, sign, and submit within 24 hours per APD Rule 65G-2.009.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS DASHBOARD ───────────────────────────────────────────────────────
function AnalyticsDashboard({session}) {
  const allResidents = Object.values(RESIDENTS_DB).flat();
  const homeResidents = RESIDENTS_DB[session.home] || [];

  const COLORS = STAGES.map(s=>s.color);

  const heatmapData = allResidents.map(r=>({
    name:r.name.split(" ")[0], stage:r.stage, tension:STAGES[r.stage].tension, home:r.home, color:STAGES[r.stage].color
  }));

  const hoursData = Object.entries(STAFF_DB).map(([id,staff])=>{
    const shifts = PAY_PERIOD.shifts[id]||[];
    const total = shifts.reduce((a,s)=>a+s.hours,0);
    const regular = Math.min(total,40);
    const ot = Math.max(0,total-40);
    return { name:staff.name.split(" ")[0], regular, ot, total };
  });

  const pillAlerts = allResidents.flatMap(r=>
    Object.entries(r.pillCounts||{}).map(([id,pc])=>({
      resident:r.name.split(" ")[0], med:pc.label, days:Math.floor(pc.current/pc.perDay), home:r.home
    }))
  ).filter(a=>a.days<=7);

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ fontSize:16, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif" }}>
        Analytics & Oversight Dashboard — {session.home}
      </div>

      {/* PILL ALERTS */}
      {pillAlerts.length > 0 && (
        <Card style={{ border:`2px solid ${C.orange}` }}>
          <CardHdr title="⚠ Low Medication Supply Alerts" sub="Prescriptions needing refill within 7 days" dark/>
          <div style={{ padding:14, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
            {pillAlerts.map((a,i)=>(
              <div key={i} style={{ padding:"10px 14px", background:a.days<=3?C.redlt:C.orangelt, borderRadius:10, borderLeft:`4px solid ${a.days<=3?C.red:C.orange}` }}>
                <div style={{ fontWeight:700, fontSize:13, color:a.days<=3?C.red:C.orange }}>{a.resident}</div>
                <div style={{ fontSize:12, color:C.text, marginTop:2 }}>{a.med}</div>
                <div style={{ fontSize:11, fontWeight:800, color:a.days<=3?C.red:C.orange, marginTop:4 }}>{a.days} days remaining</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* INCIDENT TREND */}
        <Card>
          <CardHdr title="Incident Trend — Last 7 Days" sub="All houses"/>
          <div style={{ padding:"14px 16px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={INCIDENT_CHART_DATA}>
                <defs><linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.3}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                <XAxis dataKey="day" tick={{fontSize:11}} stroke={C.gray2}/>
                <YAxis tick={{fontSize:11}} stroke={C.gray2}/>
                <Tooltip/>
                <Area type="monotone" dataKey="incidents" stroke={C.red} fill="url(#inc)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* MED COMPLIANCE */}
        <Card>
          <CardHdr title="Med Compliance Rate %" sub="This pay period"/>
          <div style={{ padding:"14px 16px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MED_COMPLIANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                <XAxis dataKey="name" tick={{fontSize:10}} stroke={C.gray2}/>
                <YAxis domain={[90,100]} tick={{fontSize:11}} stroke={C.gray2}/>
                <Tooltip/>
                <Bar dataKey="compliance" fill={C.green} radius={[6,6,0,0]}>
                  {MED_COMPLIANCE_DATA.map((_,i)=><Cell key={i} fill={_.compliance>=99?C.green:_.compliance>=95?C.gold:C.orange}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* STAGE DISTRIBUTION */}
        <Card>
          <CardHdr title="Resident Stage Distribution" sub="All houses"/>
          <div style={{ padding:"14px 16px", display:"flex", gap:16, alignItems:"center" }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={STAGE_DIST_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={30}>
                  {STAGE_DIST_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:"grid", gap:6 }}>
              {STAGE_DIST_DATA.map(d=>(
                <div key={d.name} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                  <div style={{ fontSize:11, color:C.text }}>{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* STAFF HOURS */}
        <Card>
          <CardHdr title="Staff Hours — Current Pay Period" sub="Apr 28 – May 11"/>
          <div style={{ padding:"14px 16px" }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                <XAxis dataKey="name" tick={{fontSize:10}} stroke={C.gray2}/>
                <YAxis tick={{fontSize:11}} stroke={C.gray2}/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="regular" name="Regular" fill={C.navy} radius={[4,4,0,0]} stackId="a"/>
                <Bar dataKey="ot" name="Overtime" fill={C.gold} radius={[4,4,0,0]} stackId="a"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* EVV BILLING */}
        <Card style={{ gridColumn:"1/-1" }}>
          <CardHdr title="EVV Billing Verification — Billed vs. GPS-Verified Hours" sub="Discrepancies auto-flagged to CFO dashboard"/>
          <div style={{ padding:"14px 16px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={EVV_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray1}/>
                <XAxis dataKey="date" tick={{fontSize:11}} stroke={C.gray2}/>
                <YAxis tick={{fontSize:11}} stroke={C.gray2}/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="billed" name="Billed Hours" fill={C.navy} radius={[4,4,0,0]}/>
                <Bar dataKey="verified" name="GPS-Verified" fill={C.green} radius={[4,4,0,0]}>
                  {EVV_DATA.map((e,i)=><Cell key={i} fill={e.billed!==e.verified?C.red:C.green}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ fontSize:11, color:C.text3, textAlign:"center", marginTop:6 }}>Red bars = billing discrepancy flagged for audit · {EVV_DATA.filter(d=>d.billed!==d.verified).length} flag(s) this week</div>
          </div>
        </Card>

        {/* HOUSE TENSION HEATMAP */}
        <Card style={{ gridColumn:"1/-1" }}>
          <CardHdr title="House Tension Heatmap — Resident SAP Stage Scores" sub="Management view — proactive staffing intel"/>
          <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
            {heatmapData.map(r=>{
              const intensity = r.tension / 10;
              const bg = `rgba(${r.tension>7?"184,92,0":r.tension>4?"13,31,53":"26,92,42"},${0.08 + intensity * 0.2})`;
              const col = r.tension>7?C.orange:r.tension>4?C.navy:C.green;
              return (
                <div key={r.name} style={{ padding:"12px 14px", borderRadius:12, background:bg, border:`2px solid ${col}33` }}>
                  <div style={{ fontSize:13, fontWeight:800, color:col }}>{r.name}</div>
                  <div style={{ fontSize:11, color:C.text3 }}>{r.home}</div>
                  <div style={{ marginTop:8, height:6, background:C.gray1, borderRadius:3 }}>
                    <div style={{ height:6, borderRadius:3, background:r.tension>7?C.orange:r.tension>4?C.navy:C.green, width:`${r.tension*10}%`, transition:"width .3s" }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:col, marginTop:4 }}>Tension {r.tension}/10 · S{r.stage}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SHIFT HANDOVER ────────────────────────────────────────────────────────────
function ShiftHandover({session, residents}) {
  const [handover, setHandover] = useState({...HANDOVER_TEMPLATE});
  const [resStatus, setResStatus] = useState(Object.fromEntries(residents.map(r=>[r.id,{present:false,medsGiven:false,notes:""}])));
  const [submitted, setSubmitted] = useState(false);
  const [incomingStaff, setIncomingStaff] = useState("");

  const setRes = (id, field, val) => setResStatus(p=>({...p,[id]:{...p[id],[field]:val}}));
  const allGreen = Object.values(resStatus).every(s=>s.present&&s.medsGiven) && handover.allResidentsPresent && handover.allMedsGiven && handover.suppliesAdequate;

  if (submitted) return (
    <Card>
      <div style={{ padding:48, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:14 }}>🔄</div>
        <div style={{ fontSize:22, fontWeight:800, color:C.green, fontFamily:"Georgia,serif" }}>Shift Handover Complete</div>
        <p style={{ color:C.text2, marginTop:8 }}>Outgoing staff: {session.staff.name} · Incoming: {incomingStaff}</p>
        <p style={{ color:C.text3, fontSize:13 }}>Responsibility has been formally transferred. This record is immutable.</p>
      </div>
    </Card>
  );

  return (
    <div style={{ display:"grid", gap:14 }}>
      <Card style={{ border:`2px solid ${allGreen?C.green:C.orange}` }}>
        <div style={{ padding:"14px 18px", background:allGreen?`linear-gradient(135deg,${C.green} 0%,#1A7A2E 100%)`:`linear-gradient(135deg,${C.orange} 0%,#A05000 100%)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{allGreen?"✅ ALL GREEN — Ready to Hand Over":"🔴 STATUS INCOMPLETE"}</div>
            <div style={{ color:"rgba(255,255,255,.8)", fontSize:12, marginTop:2 }}>Complete all items below before outgoing staff clocks out</div>
          </div>
        </div>
        <div style={{ padding:16 }}>
          {[
            ["allResidentsPresent","All residents present and accounted for"],
            ["allMedsGiven","All scheduled medications administered or documented"],
            ["suppliesAdequate","Supplies (meds, PPE, food) adequate for next shift"],
          ].map(([key,label])=>(
            <div key={key} onClick={()=>setHandover(p=>({...p,[key]:!p[key]}))}
              style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", borderRadius:10, cursor:"pointer", background:handover[key]?C.greenlt:C.gray0, marginBottom:8, border:`2px solid ${handover[key]?C.green:C.gray2}` }}>
              <div style={{ width:24, height:24, borderRadius:6, background:handover[key]?C.green:C.white, border:`2px solid ${handover[key]?C.green:C.gray2}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontWeight:800, fontSize:14 }}>
                {handover[key]?"✓":""}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:handover[key]?C.green:C.text }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* PER-RESIDENT STATUS */}
      <Card>
        <CardHdr title="Resident-by-Resident Handover Status"/>
        <div style={{ padding:14, display:"grid", gap:10 }}>
          {residents.map(r=>(
            <div key={r.id} style={{ padding:"12px 14px", borderRadius:10, background:C.gray0, border:`2px solid ${resStatus[r.id].present&&resStatus[r.id].medsGiven?C.green:C.gray2}` }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                <span style={{fontSize:24}}>{r.photo}</span>
                <div style={{flex:1}}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{r.name}</div>
                  <Tag label={`S${r.stage}: ${STAGES[r.stage].name}`} color={STAGES[r.stage].color} bg={STAGES[r.stage].bg} small/>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  {[["present","Present"],["medsGiven","Meds ✓"]].map(([f,l])=>(
                    <div key={f} onClick={()=>setRes(r.id,f,!resStatus[r.id][f])}
                      style={{ padding:"6px 12px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:11,
                        background:resStatus[r.id][f]?C.green:C.white, color:resStatus[r.id][f]?C.white:C.text3, border:`2px solid ${resStatus[r.id][f]?C.green:C.gray2}` }}>
                      {resStatus[r.id][f]?"✓ ":""}{l}
                    </div>
                  ))}
                </div>
              </div>
              <Textarea value={resStatus[r.id].notes} onChange={v=>setRes(r.id,"notes",v)} rows={2} placeholder={`Handover notes for ${r.name.split(" ")[0]}...`}/>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHdr title="Open Incidents & Notes"/>
        <div style={{ padding:14 }}>
          <Textarea label="Open Incidents, Flags, or Concerns" value={handover.openIncidents} onChange={v=>setHandover(p=>({...p,openIncidents:v}))} rows={3} placeholder="List any open incidents, behavior plans that activated, or items incoming staff must be aware of..."/>
          <Textarea label="General Handover Notes" value={handover.outgoingNotes} onChange={v=>setHandover(p=>({...p,outgoingNotes:v}))} rows={3} placeholder="Anything else incoming staff needs to know..."/>
          <Inp label="Outgoing Staff Signature (Type Full Name)" value={handover.outgoingSignature} onChange={v=>setHandover(p=>({...p,outgoingSignature:v}))} placeholder={session.staff.name}/>
          <Inp label="Incoming Staff Name" value={incomingStaff} onChange={setIncomingStaff} placeholder="Who is receiving this shift?"/>
          <Btn v={allGreen?"green":"default"} full onClick={()=>allGreen&&handover.outgoingSignature&&incomingStaff&&setSubmitted(true)}>
            {allGreen?"✓ Complete Handover & Transfer Responsibility":"Complete All Items Above First"}
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── RESIDENT WALLET ────────────────────────────────────────────────────────────
function ResidentWallet({resident}) {
  const [transactions, setTransactions] = useState(resident.wallet.transactions);
  const [balance, setBalance] = useState(resident.wallet.balance);
  const [form, setForm] = useState({desc:"",amount:"",receipt:"",type:"debit"});
  const [adding, setAdding] = useState(false);

  const addTxn = () => {
    if (!form.desc || !form.amount) return;
    const amt = parseFloat(form.amount) * (form.type==="debit"?-1:1);
    const newTxn = { date:"2026-05-09", desc:form.desc, amount:amt, staff:"Current Staff", receipt:form.receipt||"N/A" };
    setTransactions(p=>[newTxn,...p]);
    setBalance(p=>p+amt);
    setForm({desc:"",amount:"",receipt:"",type:"debit"});
    setAdding(false);
  };

  return (
    <div style={{ display:"grid", gap:14 }}>
      <ResidentBar resident={resident}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <div style={{ padding:24, textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Current Balance</div>
            <div style={{ fontSize:40, fontWeight:900, color:balance>=0?C.green:C.red, fontFamily:"Georgia,serif" }}>${balance.toFixed(2)}</div>
            <div style={{ fontSize:12, color:C.text3, marginTop:6 }}>Personal funds — family guardian has read access</div>
          </div>
          <div style={{ padding:"0 16px 16px" }}>
            <Btn v="gold" full onClick={()=>setAdding(true)}>+ Log Transaction / Outing Expense</Btn>
          </div>
        </Card>
        <Card>
          <CardHdr title="Guardian Transparency" sub="Family portal access"/>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {[
              ["Guardian",resident.guardian?.split("(")[0].trim()],
              ["Portal Access","Real-time read-only"],
              ["Last Receipt","May 8, 2026 — Walmart"],
              ["Fraud Protection","Sovereign Witness active"],
            ].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:C.gray0, borderRadius:8 }}>
                <span style={{ fontSize:12, color:C.text3 }}>{l}</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {adding && (
        <Card style={{ border:`2px solid ${C.gold}` }}>
          <CardHdr title="Log Transaction" sub="All entries are visible to the guardian"/>
          <div style={{ padding:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[["debit","💸 Expense (Outing)"],["credit","💰 Deposit / Stipend"]].map(([t,l])=>(
                <div key={t} onClick={()=>setForm(p=>({...p,type:t}))}
                  style={{ padding:"10px 14px", borderRadius:9, cursor:"pointer", textAlign:"center", fontWeight:700, fontSize:13,
                    background:form.type===t?C.navy:C.gray0, color:form.type===t?C.white:C.text, border:`2px solid ${form.type===t?C.gold:C.gray2}` }}>
                  {l}
                </div>
              ))}
            </div>
            <Inp label="Description" value={form.desc} onChange={v=>setForm(p=>({...p,desc:v}))} placeholder="e.g. McDonald's outing, Monthly stipend"/>
            <Inp label="Amount ($)" value={form.amount} onChange={v=>setForm(p=>({...p,amount:v}))} placeholder="0.00" type="number"/>
            <Inp label="Receipt # (optional)" value={form.receipt} onChange={v=>setForm(p=>({...p,receipt:v}))} placeholder="Store receipt or reference number"/>
            <div style={{ display:"flex", gap:10 }}>
              <Btn v="gold" full onClick={addTxn}>✓ Record Transaction</Btn>
              <Btn v="ghost" onClick={()=>setAdding(false)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHdr title="Transaction Ledger" sub="All entries visible to guardian"/>
        <div>
          {transactions.map((t,i)=>(
            <div key={i} style={{ padding:"12px 18px", borderBottom:`1px solid ${C.gray1}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{t.desc}</div>
                <div style={{ fontSize:12, color:C.text3 }}>{t.date} · Staff: {t.staff} · Receipt: {t.receipt}</div>
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:t.amount<0?C.red:C.green, fontFamily:"Georgia,serif" }}>
                {t.amount<0?"-":"+"} ${Math.abs(t.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── PAY PERIOD & SCHEDULE ──────────────────────────────────────────────────────
function ScheduleView({staff, session}) {
  const myShifts = PAY_PERIOD.shifts[staff.id] || [];
  const totalHours = myShifts.reduce((a,s)=>a+s.hours,0);
  const regularHours = Math.min(totalHours, 40);
  const overtimeHours = Math.max(0, totalHours - 40);
  const homeBreakdown = Object.keys(HOMES).map(h=>({home:h, hours:myShifts.filter(s=>s.home===h).reduce((a,s)=>a+s.hours,0), shifts:myShifts.filter(s=>s.home===h).length})).filter(h=>h.hours>0);
  const upcomingShifts = SCHEDULE_DB.filter(s=>s.staffId===staff.id);

  return (
    <div style={{ display:"grid", gap:14 }}>
      {/* PAY PERIOD SUMMARY */}
      <Card>
        <div style={{ padding:20, background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)` }}>
          <div style={{ fontSize:12, color:"#8fb3d4", marginBottom:6 }}>PAY PERIOD — Apr 28 – May 11, 2026</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.white, fontFamily:"Georgia,serif", marginBottom:12 }}>{staff.name} · Pay Period Hours</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {[
              ["Total Hours", totalHours, C.white],
              ["Regular", regularHours, C.goldlt],
              ["Overtime", overtimeHours, overtimeHours>0?C.orange:C.greenlt],
              ["Shifts Worked", myShifts.length, C.teallt],
            ].map(([l,v,col])=>(
              <div key={l} style={{ textAlign:"center", padding:"12px", background:"rgba(255,255,255,.1)", borderRadius:10 }}>
                <div style={{ fontSize:10, color:"#8fb3d4", fontWeight:700, textTransform:"uppercase", letterSpacing:.4, marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:26, fontWeight:900, color:col, fontFamily:"Georgia,serif" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Overtime warning */}
        {overtimeHours > 0 && (
          <div style={{ padding:"10px 18px", background:C.goldlt, borderTop:`2px solid ${C.gold}` }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.gold }}>⚡ OT Active: {overtimeHours} hours at 1.5× rate — supervisor approval required per company policy</span>
          </div>
        )}
      </Card>

      {/* PER-HOME BREAKDOWN */}
      <Card>
        <CardHdr title="Hours by Home This Pay Period"/>
        <div style={{ padding:14, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
          {homeBreakdown.map(h=>(
            <div key={h.home} style={{ padding:"14px", background:C.gray0, borderRadius:10, borderLeft:`4px solid ${C.navy}` }}>
              <div style={{ fontWeight:800, fontSize:14, color:C.navy }}>{h.home}</div>
              <div style={{ fontSize:26, fontWeight:900, color:C.navy, fontFamily:"Georgia,serif" }}>{h.hours}h</div>
              <div style={{ fontSize:11, color:C.text3 }}>{h.shifts} shift{h.shifts!==1?"s":""}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* SHIFT LOG */}
      <Card>
        <CardHdr title={`All Shifts This Pay Period (${myShifts.length} total)`}/>
        <div>
          {myShifts.map((s,i)=>(
            <div key={i} style={{ padding:"12px 18px", borderBottom:`1px solid ${C.gray1}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{s.home} — {s.shift}</div>
                <div style={{ fontSize:12, color:C.text3 }}>{s.date}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Tag label={`${s.hours}h`} color={C.navy} bg={C.gray0} small/>
                {s.date === "2026-05-09" && <Tag label="Today" color={C.white} bg={C.green} small/>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* UPCOMING */}
      {upcomingShifts.length > 0 && (
        <Card>
          <CardHdr title="Upcoming Scheduled Shifts"/>
          <div>
            {upcomingShifts.map((s,i)=>(
              <div key={i} style={{ padding:"12px 18px", borderBottom:`1px solid ${C.gray1}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{s.home}</div>
                  <div style={{ fontSize:12, color:C.text3 }}>{s.date} · {s.shift}</div>
                </div>
                <Tag label={s.date==="2026-05-09"?"Today":"Scheduled"} color={s.date==="2026-05-09"?C.white:C.navy} bg={s.date==="2026-05-09"?C.green:C.gray1} small/>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── SENTINEL LANGUAGE ANALYSIS ─────────────────────────────────────────────────
function SentinelAnalysis({text, onAccept, onRevise}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState("");

  const analyze = async (t) => {
    if (!t || t.length < 30 || t === ran) return;
    setLoading(true); setRan(t);
    const response = await callClaude([{role:"user", content:
      `Analyze this incident report draft for INCONGRUENT SENTIMENT — language that minimizes or obscures the actual severity of what is described. Look for:
- Words that downplay violence: "minor touch," "small incident," "slight contact," "bumped"
- Passive voice that removes agency: "was contacted" instead of "was struck"
- Vague intensity terms: "expressed frustration" for a physical assault
- Missing required elements: no trigger, no consequence, no injury assessment
- Euphemisms for serious events

INCIDENT DRAFT:
"${t}"

Respond in JSON only, no markdown:
{ "severity": "clean" | "warning" | "flag", "score": 0-100, "findings": ["finding 1"], "requiredRevisions": ["revision 1"], "approvedLanguage": "reason if appropriate", "flagReason": "one sentence if flagged" }`}],
    "You are a Medicaid fraud prevention AI for Florida APD. Analyze incident report language for minimization or missing required elements. Return only valid JSON.");
    try {
      const clean = response.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch {
      setResult({ severity:"warning", score:50, findings:["Could not parse analysis — review manually"], requiredRevisions:[], approvedLanguage:"", flagReason:"" });
    }
    setLoading(false);
  };

  useEffect(() => { if (text && text.length > 30) analyze(text); }, [text]);

  if (!text || text.length < 30) return null;
  if (loading) return (
    <div style={{ padding:"10px 14px", background:C.gray0, borderRadius:9, fontSize:12, color:C.text3, display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
      <span>⏳</span> Sentinel analyzing language...
    </div>
  );
  if (!result) return null;

  const cfg = {
    clean:   { bg:C.greenlt, col:C.green,  label:"✓ Language Approved" },
    warning: { bg:C.goldlt,  col:C.gold,   label:"⚠ Review Suggested" },
    flag:    { bg:C.redlt,   col:C.red,    label:"🚨 Sentinel Flag — Revision Required" },
  }[result.severity] || { bg:C.goldlt, col:C.gold, label:"⚠ Review Suggested" };

  return (
    <div style={{ padding:"14px 16px", background:cfg.bg, borderRadius:10, border:`2px solid ${cfg.col}33`, marginTop:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:result.findings?.length?10:0 }}>
        <div style={{ fontWeight:800, fontSize:13, color:cfg.col }}>✦ Sentinel: {cfg.label}</div>
        <div style={{ fontSize:11, color:cfg.col, fontWeight:700 }}>Score: {result.score}/100</div>
      </div>
      {result.findings?.length > 0 && (
        <div style={{ display:"grid", gap:4, marginBottom:8 }}>
          {result.findings.map((f,i) => (
            <div key={i} style={{ fontSize:12, color:C.text, padding:"5px 10px", background:"rgba(255,255,255,.6)", borderRadius:6 }}>• {f}</div>
          ))}
        </div>
      )}
      {result.flagReason && <div style={{ fontSize:12, color:cfg.col, fontWeight:600, marginBottom:8 }}>{result.flagReason}</div>}
      {result.requiredRevisions?.length > 0 && (
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:11, fontWeight:700, color:cfg.col, textTransform:"uppercase", letterSpacing:.4, marginBottom:4 }}>Required Revisions:</div>
          {result.requiredRevisions.map((r,i) => <div key={i} style={{ fontSize:12, color:C.text }}>{i+1}. {r}</div>)}
        </div>
      )}
      {result.severity !== "clean" && (
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          <Btn v="gold" small onClick={onRevise}>Revise Before Submitting</Btn>
          {result.severity === "warning" && <Btn v="ghost" small onClick={onAccept}>Accept As Written</Btn>}
        </div>
      )}
    </div>
  );
}

// ─── INCIDENT LOG WITH SENTINEL ─────────────────────────────────────────────────
function IncidentLog({resident, staff}) {
  const [form, setForm] = useState({trigger:"", behavior:"", response:"", plan:"", injuries:"none", notifications:""});
  const [submitted, setSubmitted] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [aiPlan, setAiPlan] = useState("");
  const [sentinelCleared, setSentinelCleared] = useState(false);
  const [sentinelSeverity, setSentinelSeverity] = useState(null);
  const f = k => v => { setForm(p=>({...p,[k]:v})); setSentinelCleared(false); };

  const fullText = [form.trigger, form.behavior, form.response, aiPlan||form.plan].filter(Boolean).join(" ");

  const suggestPlan = async () => {
    if (!form.trigger||!form.behavior||!form.response) return;
    setSuggesting(true);
    const txt = await callClaude([{role:"user",content:`Resident: ${resident.name} (Stage: S${resident.stage} ${STAGES[resident.stage].name})\nTrigger: ${form.trigger}\nBehavior: ${form.behavior}\nResponse: ${form.response}\n\nSuggest a plain-language "Plan Going Forward" (2-3 sentences). Include what the BA should be told and what staff should do differently next time. Reference relevant Florida APD rules if applicable.`}],
      "You are a plain-language behavioral support assistant for Florida APD group home staff. Write brief, practical, jargon-free guidance under 100 words.");
    setAiPlan(txt); setSuggesting(false);
  };

  const canSubmit = form.trigger && form.behavior && form.response && (sentinelSeverity !== "flag" || sentinelCleared);

  if (submitted) return (
    <Card>
      <div style={{ padding:48, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:14 }}>✓</div>
        <div style={{ fontSize:22, fontWeight:800, color:C.green, fontFamily:"Georgia,serif" }}>Incident Logged & Locked</div>
        <p style={{ color:C.text2, fontSize:14, maxWidth:380, margin:"0 auto 20px" }}>
          This report is timestamped, immutable, and visible to the assigned BA and APD.<br/>
          Supervisor must be notified within 24 hours per APD Rule 65G-2.009.
        </p>
        <Btn v="primary" onClick={()=>{setSubmitted(false);setForm({trigger:"",behavior:"",response:"",plan:"",injuries:"none",notifications:""});setAiPlan("");setSentinelCleared(false);setSentinelSeverity(null);}}>
          Log Another Incident
        </Btn>
      </div>
    </Card>
  );

  return (
    <div style={{ display:"grid", gap:14 }}>
      <ResidentBar resident={resident}/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <CardHdr title="Incident Report — Plain Language" dark/>
          <div style={{ padding:18 }}>
            <Textarea label="What happened right before? (The trigger)" value={form.trigger} onChange={f("trigger")} rows={2}
              placeholder="e.g. TV was loud, another resident took their seat, shift change, mealtime delayed..."/>
            <Textarea label="What did the resident do? (Exact description — no vague terms)" value={form.behavior} onChange={f("behavior")} rows={2}
              placeholder="e.g. Yelled for 4 minutes. Threw a plastic cup toward the wall. Did not make physical contact with anyone."/>
            <Textarea label="How did staff respond?" value={form.response} onChange={f("response")} rows={2}
              placeholder="e.g. Reduced TV volume. Offered headphones. Behavior de-escalated within 6 minutes."/>

            {fullText.length > 40 && (
              <SentinelAnalysis
                text={fullText}
                onAccept={()=>{ setSentinelCleared(true); setSentinelSeverity("warning"); }}
                onRevise={()=>{ setForm(p=>({...p,behavior:"",trigger:""})); setSentinelSeverity(null); }}
              />
            )}

            <div style={{ marginBottom:12, marginTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5 }}>Plan Going Forward</label>
                <Btn v="gold" small onClick={suggestPlan}>{suggesting?"Thinking...":"✦ AI Suggest"}</Btn>
              </div>
              <textarea value={aiPlan||form.plan} onChange={e=>{setAiPlan(""); f("plan")(e.target.value);}} rows={3}
                placeholder="What should staff do differently? What does the BA need to know?"
                style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }}/>
              {aiPlan && <div style={{ fontSize:11, color:C.gold, marginTop:3 }}>✦ AI-suggested — edit before saving</div>}
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Injuries</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                {["none","minor","medical"].map(v=>(
                  <button key={v} onClick={()=>f("injuries")(v)}
                    style={{ padding:8, borderRadius:8, border:`2px solid ${form.injuries===v?(v==="none"?C.green:v==="minor"?C.gold:C.red):C.gray2}`,
                      background:form.injuries===v?(v==="none"?C.greenlt:v==="minor"?C.goldlt:C.redlt):C.white,
                      color:form.injuries===v?(v==="none"?C.green:v==="minor"?C.gold:C.red):C.text3,
                      cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600 }}>
                    {v==="none"?"✓ None":v==="minor"?"⚠ Minor":"🚨 Medical Attention"}
                  </button>
                ))}
              </div>
            </div>

            <Textarea label="Notifications Made (required within 24 hrs)" value={form.notifications} onChange={f("notifications")} rows={2}
              placeholder="e.g. Supervisor notified 7:45 AM. Guardian called 8:02 AM. BA texted 8:05 AM."/>

            {sentinelSeverity === "flag" && !sentinelCleared && (
              <div style={{ padding:"10px 14px", background:C.redlt, borderRadius:9, marginBottom:10, fontSize:12, color:C.red, fontWeight:700 }}>
                🚨 Sentinel has flagged language concerns. Revise the report or acknowledge and accept before submitting.
              </div>
            )}
            <Btn v="green" full onClick={()=>canSubmit&&setSubmitted(true)}
              style={{ opacity:canSubmit?1:.5, cursor:canSubmit?"pointer":"not-allowed" }}>
              Submit Immutable Incident Report
            </Btn>
            <div style={{ fontSize:11, color:C.text3, textAlign:"center", marginTop:8 }}>
              Staff: {staff?.name} · {new Date().toLocaleTimeString()} · Once submitted, this report cannot be altered by anyone
            </div>
          </div>
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card style={{ border:`2px solid ${C.purple}` }}>
            <div style={{ padding:"13px 18px", background:`linear-gradient(135deg,${C.purple} 0%,#6B2AA0 100%)` }}>
              <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>✦ Sentinel Language Analysis</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.75)" }}>AI scans your report for language that minimizes severity</div>
            </div>
            <div style={{ padding:14, display:"grid", gap:8 }}>
              {[
                ["What it catches","Language like 'minor touch' for a physical assault, 'small incident' for a documented injury, passive voice that removes agency, missing required report elements"],
                ["Why it matters","Minimized incident reports are a primary tool for covering up abuse. The Sentinel detects this pattern before submission — protecting residents, protecting you, and creating an accurate legal record"],
                ["When it flags","A flag means specific language may not match the severity of what happened. You can revise or acknowledge and proceed — but the flag is logged either way"],
              ].map(([t,d])=>(
                <div key={t} style={{ padding:"10px 12px", background:C.purplelt, borderRadius:9 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:C.purple, marginBottom:3 }}>{t}</div>
                  <div style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{d}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ padding:"13px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)` }}>
              <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>🛡 Staff Integrity Shield</div>
              <div style={{ fontSize:12, color:"#8fb3d4" }}>Your report cannot be altered by administrators or owners</div>
            </div>
            <div style={{ padding:14, display:"grid", gap:8 }}>
              {[
                ["Immutable","Once submitted, locked with timestamp. No admin can alter or delete."],
                ["Protected","Your identity protected in the audit trail — not visible to home operators."],
                ["Direct APD","If you are being asked to falsify data — this button bypasses the operator entirely."],
              ].map(([t,d])=>(
                <div key={t} style={{ padding:"10px 12px", background:C.gray0, borderRadius:9, display:"flex", gap:8 }}>
                  <span style={{ color:C.gold }}>✓</span>
                  <div><div style={{ fontWeight:700, fontSize:12, color:C.navy }}>{t}</div><div style={{ fontSize:12, color:C.text2 }}>{d}</div></div>
                </div>
              ))}
              <Btn v="red" full>🚨 Anonymous APD Report — Bypass Operator</Btn>
            </div>
          </Card>

          <Card>
            <CardHdr title="Known Triggers — Quick Reference"/>
            <div style={{ padding:14, display:"grid", gap:6 }}>
              {(resident.behavioralTriggers||[]).map(t=>(
                <div key={t} style={{ padding:"8px 12px", background:C.orangelt, color:C.orange, borderRadius:8, fontSize:12, fontWeight:600 }}>⚡ {t}</div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHdr title="Florida Required Notifications"/>
            <div style={{ padding:14, display:"grid", gap:8 }}>
              {[
                ["Within 24 hours","Supervisor + BA notification required","APD 65G-2.009"],
                ["If injury","Guardian must be notified immediately","APD 65G-2.009"],
                ["If medical","911 + physician + guardian","Emergency protocol"],
                ["If pattern","APD incident report filing required","Repeated incidents"],
              ].map(([when,what,rule])=>(
                <div key={when} style={{ padding:"9px 12px", background:C.gray0, borderRadius:9 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, fontWeight:700, color:C.navy }}>{when}</span>
                    <span style={{ fontSize:10, color:C.text3 }}>{rule}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.text2, marginTop:2 }}>{what}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── AI PLAN TRANSLATOR ──────────────────────────────────────────────────────────
function AIPlanTranslator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const txt = await callClaude([{role:"user", content:
      `Translate this ABA clinical text into plain English for a group home DSP with a high school diploma. No jargon. Warm, clear, step-by-step where needed. Under 150 words.\n\nClinical text:\n"${input}"`}],
      "You translate ABA clinical jargon into plain English for non-clinical group home staff. Never use clinical terms in your response. Be warm, clear, and practical.");
    setOutput(txt); setLoading(false);
  };
  return (
    <div>
      <Textarea label="Paste clinical text" value={input} onChange={setInput} rows={6}
        placeholder="e.g. 'Implement DRA protocol targeting manding as replacement for escape-motivated aggression...'"/>
      <Btn v="purple" full onClick={translate} style={{marginBottom:12}}>{loading?"Translating...":"✦ Translate to Plain English"}</Btn>
      {output && (
        <div style={{ padding:"12px 14px", background:C.greenlt, borderRadius:10, border:`1px solid ${C.green}33` }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:.4, marginBottom:6 }}>Plain English Version</div>
          <div style={{ fontSize:13, color:C.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{output}</div>
        </div>
      )}
    </div>
  );
}

// ─── AI PROCEDURE GUIDE ─────────────────────────────────────────────────────────
const PROCEDURES = [
  {id:"incident",icon:"🚨",label:"Incident Report",color:C.red,prompt:"Walk me through completing an incident report for a Florida APD group home. Include what to document, who to notify and when, and relevant APD rules."},
  {id:"bodycheck",icon:"🔍",label:"Body Check",color:C.teal,prompt:"Guide me through a proper body check procedure for a group home resident. Include documentation requirements and how to handle any findings per Florida APD standards."},
  {id:"outing",icon:"🚌",label:"Community Outing",color:C.navy3,prompt:"Walk me through the pre-outing safety checklist for taking a group home resident into the community. Include documentation, medication, emergency items, and supervision requirements."},
  {id:"emergency",icon:"🆘",label:"Emergency Response",color:C.red,prompt:"Guide me through emergency response procedures for a group home, covering medical emergencies, elopement, fire, and behavioral crises. Include 911 and notification timelines."},
  {id:"bakerAct",icon:"⚖",label:"Baker Act Assessment",color:C.purple,prompt:"Provide a plain-language Baker Act decision support checklist for staff under Florida Statute 394. Help me determine if a resident meets criteria and what the correct process is."},
  {id:"pcm",icon:"🤝",label:"PCM Protocol",color:C.orange,prompt:"Walk me through the Professional Crisis Management (PCM) protocol for de-escalating a resident in crisis. Cover approved intervention types, prohibited restraints, and documentation requirements."},
  {id:"meds",icon:"💊",label:"Med Administration",color:C.green,prompt:"Guide me through correct medication administration procedures under Florida Chapter 65G-7. Include the three-way match, documentation, controlled substance protocols, and error reporting."},
  {id:"fall",icon:"🏥",label:"Fall Protocol",color:C.orange,prompt:"Walk me through the fall protocol for a group home resident — first steps, body check documentation, when to call 911, guardian notification requirements, and incident report timing."},
];

function ProcedureGuide({resident, staff}) {
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const startProc = async (proc) => {
    setSelected(proc);
    setMessages([]);
    setLoading(true);
    const system = `You are LUMINARK's AI Procedure Guide for Florida APD group home staff. You provide clear, concise, step-by-step guidance compliant with Florida Chapter 65G regulations. ${resident ? `Current resident context: ${resident.name}, Stage S${resident.stage} (${STAGES[resident.stage].name}), diagnoses: ${resident.diagnosis.join(", ")}.` : "No specific resident selected."} Always use plain language. Never use ABA jargon without explanation. Be directive and specific.`;
    const txt = await callClaude([{role:"user",content:proc.prompt}], system);
    setMessages([{role:"assistant",content:txt}]);
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim()||loading) return;
    const userMsg = {role:"user",content:input};
    setMessages(p=>[...p,userMsg]);
    setInput("");
    setLoading(true);
    const system = `You are LUMINARK's AI Procedure Guide for Florida APD group home staff. Provide step-by-step guidance compliant with Florida Chapter 65G. ${resident ? `Current resident: ${resident.name}, S${resident.stage} ${STAGES[resident.stage].name}.` : ""} Be direct and practical.`;
    const txt = await callClaude([...messages, userMsg], system);
    setMessages(p=>[...p,{role:"assistant",content:txt}]);
    setLoading(false);
    setTimeout(()=>chatRef.current?.scrollTo(0,chatRef.current.scrollHeight),100);
  };

  if (!selected) return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.navy, fontFamily:"Georgia,serif", marginBottom:4 }}>✦ AI Procedure Guide</div>
        <div style={{ fontSize:13, color:C.text3 }}>Florida APD–compliant step-by-step guidance for any situation. Powered by LUMINARK AI.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
        {PROCEDURES.map(p=>(
          <div key={p.id} onClick={()=>startProc(p)}
            style={{ padding:"18px 16px", borderRadius:14, background:C.white, border:`2px solid ${C.gray1}`, cursor:"pointer", transition:"all .2s",
              display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:32 }}>{p.icon}</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{p.label}</div>
            <div style={{ fontSize:10, color:C.white, background:p.color, padding:"3px 10px", borderRadius:20, alignSelf:"flex-start", fontWeight:700 }}>APD Guide</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <div style={{ padding:"14px 18px", background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:C.white }}>{selected.icon} {selected.label} — AI Guide</div>
          <div style={{ fontSize:11, color:"#8fb3d4" }}>Florida Chapter 65G Compliant · {staff?.name}</div>
        </div>
        <Btn v="ghost" small onClick={()=>setSelected(null)} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>← Back</Btn>
      </div>
      <div ref={chatRef} style={{ height:380, overflowY:"auto", padding:16, display:"grid", gap:12 }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", gap:10, justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant" && <div style={{ width:32, height:32, background:C.gold, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:C.navy, flexShrink:0 }}>L</div>}
            <div style={{ maxWidth:"75%", padding:"12px 16px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
              background:m.role==="user"?C.navy:C.gray0, color:m.role==="user"?C.white:C.text, fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ width:32, height:32, background:C.gold, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:C.navy }}>L</div>
            <div style={{ padding:"12px 16px", background:C.gray0, borderRadius:"14px 14px 14px 4px", display:"flex", gap:4 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.navy3, display:"inline-block", animation:"bounce 1.4s infinite", animationDelay:`${i*.16}s` }}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.gray1}`, display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask a follow-up question..."
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit" }}/>
        <Btn v="gold" onClick={send}>{loading?"...":"Send"}</Btn>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
    </Card>
  );
}

// ─── CRISIS REFERENCE — PCM / Baker Act / Prohibited ───────────────────────────
function CrisisReference({resident}) {
  const [activeTab, setActiveTab] = useState("pcm");
  const stage = STAGES[resident.stage];
  const ba = resident.bakerAct;

  return (
    <div style={{ display:"grid", gap:14 }}>
      <ResidentBar resident={resident}/>

      {/* Quick action bar */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[
          ["🚨","Start Incident","Open incident log now"],
          ["📞","Call Supervisor", HOMES[resident.home]?.supervisor?.split(" ")[0]||"On-call supervisor"],
          ["🏥","911 — Medical","Seizure >3min · Not breathing"],
        ].map(([icon,label,sub])=>(
          <div key={label} style={{ padding:14, background:C.white, borderRadius:12, border:`2px solid ${C.red}33`, textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
            <div style={{fontSize:26}}>{icon}</div>
            <div style={{fontSize:12,fontWeight:800,color:C.red,marginTop:6}}>{label}</div>
            <div style={{fontSize:10,color:C.text3,marginTop:2}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:4, background:C.white, borderRadius:12, padding:4, boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
        {[["pcm","🤝 PCM De-escalation"],["baker","⚖ Baker Act"],["prohibited","⛔ Prohibited"]].map(([id,label])=>(
          <div key={id} onClick={()=>setActiveTab(id)}
            style={{ flex:1, padding:"10px 14px", borderRadius:9, textAlign:"center", cursor:"pointer", fontSize:12, fontWeight:700,
              background:activeTab===id?C.navy:"transparent", color:activeTab===id?C.white:C.text3, transition:"all .15s" }}>
            {label}
          </div>
        ))}
      </div>

      {/* PCM TAB */}
      {activeTab==="pcm" && (
        <Card>
          <CardHdr title="🤝 PCM De-escalation — Follow In Order" sub={`Do not skip steps. Current stage: ${stage.symbol} ${stage.name}`}/>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {(resident.pcm||[]).map((step,i)=>(
              <div key={i} style={{ padding:"12px 16px", background:C.gray0, borderRadius:10, display:"flex", gap:12, alignItems:"flex-start",
                borderLeft:`4px solid ${i===0?C.green:i===(resident.pcm.length-1)?C.orange:C.navy}` }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:C.navy,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0 }}>{i+1}</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.7, flex:1 }}>{step}</div>
              </div>
            ))}
            <div style={{ padding:"10px 14px", background:C.goldlt, borderRadius:9, fontSize:12, color:C.text, borderLeft:`3px solid ${C.gold}` }}>
              <strong>Current Stage Guidance:</strong> {stage.actionPrompt}
            </div>
          </div>
        </Card>
      )}

      {/* BAKER ACT TAB */}
      {activeTab==="baker" && (
        <Card>
          <CardHdr title="⚖ Baker Act — Florida Statute 394.463" sub={ba?.statute||"FL Statute 394.463"}/>
          <div style={{ padding:16, display:"grid", gap:12 }}>
            {ba?.history
              ? <div style={{ padding:"12px 14px", background:C.orangelt, borderRadius:10, border:`2px solid ${C.orange}44` }}>
                  <div style={{ fontSize:11, fontWeight:800, color:C.orange, marginBottom:4 }}>📋 History</div>
                  <div style={{ fontSize:13, color:C.text }}>{ba.historyNote}</div>
                </div>
              : <div style={{ padding:"12px 14px", background:C.greenlt, borderRadius:10 }}>
                  <div style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ No Baker Act history on file</div>
                </div>
            }
            {ba?.threshold && (
              <div style={{ padding:"14px 16px", background:C.redlt, borderRadius:10, border:`2px solid ${C.red}44` }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.red, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>⚠ Threshold for Baker Act Consideration</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>{ba.threshold}</div>
              </div>
            )}
            {ba?.nonVerbalNote && (
              <div style={{ padding:"14px 16px", background:C.purplelt, borderRadius:10, border:`2px solid ${C.purple}44` }}>
                <div style={{ fontSize:11, fontWeight:800, color:C.purple, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>⚠ NON-VERBAL RESIDENT — Special Assessment Rules</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.8, fontWeight:600 }}>{ba.nonVerbalNote}</div>
              </div>
            )}
            <div style={{ padding:"12px 14px", background:C.gray0, borderRadius:10 }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.text3, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Required Notifications — Before or During Baker Act</div>
              {["Supervisor — immediately upon considering Baker Act","BA — before initiating, unless immediate emergency","Guardian / family — as soon as safe to do so","Physician — if any medical concerns are present"].map((note,i)=>(
                <div key={i} style={{ fontSize:12, color:C.text, marginBottom:4 }}>• {note}</div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* PROHIBITED TAB */}
      {activeTab==="prohibited" && (
        <Card style={{ border:`2px solid ${C.red}44` }}>
          <div style={{ padding:"12px 18px", background:C.red, borderRadius:"12px 12px 0 0" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.white }}>⛔ PROHIBITED INTERVENTIONS — Civil Rights & APD Reportable</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", marginTop:2 }}>Any prohibited intervention must be reported to APD within 1 hour — 65G-2.010</div>
          </div>
          <div style={{ padding:16, display:"grid", gap:8 }}>
            {(resident.prohibited||[]).map((item,i)=>(
              <div key={i} style={{ padding:"12px 16px", background:C.redlt, borderRadius:10, display:"flex", gap:10, alignItems:"flex-start", border:`1px solid ${C.red}22` }}>
                <span style={{fontSize:18,flexShrink:0}}>⛔</span>
                <div style={{ fontSize:13, color:C.red, fontWeight:700, lineHeight:1.6 }}>{item.replace("⛔ ","")}</div>
              </div>
            ))}
            <div style={{ padding:"10px 14px", background:"#1A1814", borderRadius:9, fontSize:12, color:"#FFB3B3", fontWeight:600, lineHeight:1.7 }}>
              If an owner, supervisor, or any person instructs you to use a prohibited procedure — you have the legal right and professional duty to refuse.
              Report immediately: APD Abuse Hotline 1-800-962-2873 (anonymous, 24/7) or APD 1-866-APD-CARES.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── CLOCK-OUT GATE MODAL ───────────────────────────────────────────────────────
function ClockOutGate({session, residents, onConfirm, onCancel}) {
  const [step, setStep] = useState("controlled"); // controlled → handover → pin → done
  const [countChecks, setCountChecks] = useState({});
  const [witnessPin, setWitnessPin] = useState("");
  const [witnessError, setWitnessError] = useState("");
  const [handoverAccepted, setHandoverAccepted] = useState(false);
  const [incomingStaffId, setIncomingStaffId] = useState("");

  const controlledMeds = residents.flatMap(r =>
    r.meds.filter(m => m.controlled).map(m => ({...m, residentName: r.name, residentId: r.id}))
  );

  const allCountsDone = controlledMeds.length === 0 || controlledMeds.every(m => countChecks[`${m.residentId}-${m.id}`]);

  const verifyWitness = () => {
    const incoming = Object.values(STAFF_DB).find(s => s.id === incomingStaffId);
    if (!incoming) { setWitnessError("Staff ID not found."); return; }
    if (witnessPin !== incoming.pin) { setWitnessError("Incorrect PIN for incoming staff."); setWitnessPin(""); return; }
    if (incomingStaffId === session.staff.id) { setWitnessError("Incoming staff cannot be the same person clocking out."); return; }
    onConfirm(incoming);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(13,31,53,.92)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:20, width:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ background:`linear-gradient(135deg,${C.red} 0%,${C.redmed} 100%)`, padding:"22px 28px" }}>
          <div style={{ fontSize:18, fontWeight:800, color:C.white, fontFamily:"Georgia,serif" }}>🔐 Clock-Out Compliance Gate</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.75)", marginTop:4 }}>Complete all steps before ending your shift — required by Florida APD Rule 65G-7.007B</div>
        </div>

        <div style={{ padding:24, display:"grid", gap:16 }}>
          {/* Step indicators */}
          <div style={{ display:"flex", gap:8 }}>
            {[["controlled","💊 Med Count"],["handover","🟢 Handover"],["pin","🔐 Witness PIN"]].map(([s,label],i)=>(
              <div key={s} style={{ flex:1, padding:"6px 8px", borderRadius:8, textAlign:"center", fontSize:11, fontWeight:700,
                background: step===s?C.navy:(["controlled","handover","pin"].indexOf(step)>i?C.greenlt:C.gray0),
                color: step===s?C.white:(["controlled","handover","pin"].indexOf(step)>i?C.green:C.text3) }}>
                {label}
              </div>
            ))}
          </div>

          {/* STEP 1: Controlled med count */}
          {step==="controlled" && (
            <div>
              <div style={{ fontWeight:700, color:C.navy, marginBottom:12 }}>
                {controlledMeds.length > 0 ? `${controlledMeds.length} controlled medication(s) require dual count before clock-out` : "✓ No controlled medications at this house"}
              </div>
              {controlledMeds.map(m => {
                const key = `${m.residentId}-${m.id}`;
                const done = countChecks[key];
                return (
                  <div key={key} style={{ padding:"12px 14px", background:done?C.greenlt:C.redlt, borderRadius:10, marginBottom:8, border:`2px solid ${done?C.green:C.red}` }}>
                    <div style={{ fontWeight:700, color:done?C.green:C.red, fontSize:13 }}>{m.name}</div>
                    <div style={{ fontSize:12, color:C.text3 }}>Resident: {m.residentName} · Controlled substance</div>
                    {!done && (
                      <div style={{ marginTop:8 }}>
                        <div style={{ fontSize:11, color:C.text, marginBottom:6 }}>Confirm physical pill count witnessed by incoming staff before proceeding.</div>
                        <Btn v="green" small onClick={()=>setCountChecks(p=>({...p,[key]:true}))}>✓ Count Verified — Both Staff Witnessed</Btn>
                      </div>
                    )}
                    {done && <div style={{ fontSize:12, fontWeight:700, color:C.green, marginTop:4 }}>✓ Count verified and logged</div>}
                  </div>
                );
              })}
              <Btn v="primary" full onClick={()=>setStep("handover")} style={{ marginTop:8, opacity:allCountsDone?1:.4, pointerEvents:allCountsDone?"auto":"none" }}>
                Continue → Shift Handover Status
              </Btn>
            </div>
          )}

          {/* STEP 2: Handover acceptance */}
          {step==="handover" && (
            <div>
              <div style={{ fontWeight:700, color:C.navy, marginBottom:12 }}>Select incoming staff and confirm house status is accepted.</div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:6 }}>Incoming Staff ID</label>
                <select value={incomingStaffId} onChange={e=>setIncomingStaffId(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:9, border:`1px solid ${C.gray2}`, fontSize:13, fontFamily:"inherit" }}>
                  <option value="">— Select incoming staff —</option>
                  {Object.values(STAFF_DB).filter(s=>s.id!==session.staff.id).map(s=>(
                    <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display:"grid", gap:8, marginBottom:14 }}>
                {[
                  "All scheduled medications have been administered or documented",
                  "All residents are present and accounted for",
                  "No outstanding incidents requiring immediate attention",
                  "Communication log is up to date for this shift",
                  "House is clean and residents' needs are met",
                ].map(item=>(
                  <div key={item} onClick={()=>setHandoverAccepted(p=>!p)}
                    style={{ padding:"10px 14px", borderRadius:9, cursor:"pointer",
                      background:handoverAccepted?C.greenlt:C.gray0,
                      border:`2px solid ${handoverAccepted?C.green:C.gray2}`, fontSize:13, color:C.text }}>
                    {handoverAccepted?"✅":"⬜"} {item}
                  </div>
                ))}
              </div>
              <Btn v="green" full onClick={()=>setStep("pin")} style={{ opacity:(handoverAccepted&&incomingStaffId)?1:.4, pointerEvents:(handoverAccepted&&incomingStaffId)?"auto":"none" }}>
                ✓ Handover Acknowledged → Enter Witness PIN
              </Btn>
            </div>
          )}

          {/* STEP 3: Incoming staff PIN */}
          {step==="pin" && (
            <div>
              <div style={{ padding:"14px 16px", background:C.goldlt, borderRadius:10, marginBottom:14 }}>
                <div style={{ fontWeight:700, color:C.gold, marginBottom:4 }}>Dual Authentication Required</div>
                <div style={{ fontSize:13, color:C.text }}>Incoming staff <strong>{STAFF_DB[incomingStaffId]?.name}</strong> must enter their PIN to accept the shift. This creates a tamper-proof transfer of responsibility.</div>
              </div>
              <Inp label={`${STAFF_DB[incomingStaffId]?.name}'s PIN`} type="password" value={witnessPin} onChange={setWitnessPin} placeholder="Incoming staff PIN"/>
              {witnessError && <div style={{ padding:"8px 12px", background:C.redlt, color:C.red, borderRadius:8, fontSize:12, fontWeight:700, marginBottom:8 }}>{witnessError}</div>}
              <div style={{ display:"flex", gap:10 }}>
                <Btn v="green" full onClick={verifyWitness}>🔐 Confirm Handover & Clock Out</Btn>
                <Btn v="ghost" onClick={onCancel}>Cancel</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STAFF PORTAL ───────────────────────────────────────────────────────────────
function StaffPortal({session, onLogout, onShowClockOut}) {
  const [page, setPage]                         = useState("roster");
  const [selectedResident, setSelectedResident] = useState(null);
  const [locked, setLocked]                     = useState(false);
  const [lastActivity, setLastActivity]         = useState(Date.now());
  const residents = RESIDENTS_DB[session.home] || [];

  useEffect(() => {
    const interval = setInterval(() => { if (Date.now() - lastActivity > 15 * 60 * 1000) setLocked(true); }, 30000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  const touch = useCallback(() => setLastActivity(Date.now()), []);
  useEffect(() => {
    window.addEventListener("mousemove", touch);
    window.addEventListener("keydown", touch);
    window.addEventListener("touchstart", touch);
    return () => { window.removeEventListener("mousemove",touch); window.removeEventListener("keydown",touch); window.removeEventListener("touchstart",touch); };
  }, [touch]);

  const goToResident = (r, target) => { setSelectedResident(r); setPage(target||"facesheet"); };

  const NAV = [
    {id:"roster",    icon:"👥", label:"Residents"},
    {id:"facesheet", icon:"📋", label:"Face Sheet"},
    {id:"meds",      icon:"💊", label:"Meds"},
    {id:"behavior",  icon:"🧠", label:"Behavior Plan"},
    {id:"pcm",       icon:"🤝", label:"PCM / Crisis"},
    {id:"nsdt",      icon:"✦",  label:"NSDT Observe"},
    {id:"commlog",   icon:"📝", label:"Comm Log"},
    {id:"incident",  icon:"🚨", label:"Incident"},
    {id:"procedure", icon:"📖", label:"AI Guide"},
    {id:"analytics", icon:"📊", label:"Analytics"},
    {id:"handover",  icon:"🔄", label:"Handover"},
    {id:"wallet",    icon:"💰", label:"Wallet"},
    {id:"schedule",  icon:"📅", label:"Schedule"},
  ];

  const RESIDENT_PAGES = ["facesheet","meds","behavior","pcm","nsdt","incident","wallet"];

  if (locked) return (
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:C.white }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"Georgia,serif", marginBottom:8 }}>Session Locked</div>
        <div style={{ fontSize:14, color:"#8fb3d4", marginBottom:24 }}>15-minute inactivity — client data protected.</div>
        <Btn v="gold" onClick={()=>{ setLocked(false); setLastActivity(Date.now()); }}>Unlock — {session.staff.name}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:C.gray0, minHeight:"100vh", color:C.text }}>
      <LiabilityBanner/>
      {/* TOPBAR */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 100%)`,
        padding:"0 20px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,.35)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:34,height:34,background:C.gold,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:C.navy,fontFamily:"Georgia,serif" }}>L</div>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:C.white, fontFamily:"Georgia,serif" }}>LUMINARK APD OVERWATCH</div>
            <div style={{ fontSize:11, color:"#7aA4C4" }}>Staff Portal · {session.home} · {session.staff.name}{session.isOvertime?" · ⚡ OT Shift":""}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ padding:"4px 12px", background:"rgba(255,255,255,.1)", borderRadius:20, fontSize:11, color:"#8fb3d4" }}>
            🕐 {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} · Shift Active
          </div>
          <Btn v="ghost" small onClick={onShowClockOut} style={{color:"#8fb3d4",borderColor:"#8fb3d4"}}>🔐 Clock Out</Btn>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", minHeight:"calc(100vh - 54px)" }}>
        {/* SIDEBAR */}
        <div style={{ background:C.navy2, display:"flex", flexDirection:"column", overflowY:"auto" }}>
          <div style={{ padding:"12px 0", flex:1 }}>
            <div style={{ padding:"0 14px 8px", fontSize:10, fontWeight:700, color:"#3a6080", textTransform:"uppercase", letterSpacing:.8 }}>Navigation</div>
            {NAV.map(item=>(
              <div key={item.id} onClick={()=>{ setPage(item.id); if(RESIDENT_PAGES.includes(item.id)&&!selectedResident&&residents.length>0) setSelectedResident(residents[0]); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 16px", cursor:"pointer",
                  color:page===item.id?C.gold:"#9ab8d4",
                  background:page===item.id?"rgba(200,150,12,.1)":"transparent",
                  borderLeft:page===item.id?`3px solid ${C.gold}`:"3px solid transparent",
                  fontSize:13, fontWeight:page===item.id?700:400 }}>
                <span style={{fontSize:14}}>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* Resident quick list */}
          <div style={{ borderTop:`1px solid ${C.navy3}`, padding:"10px 0" }}>
            <div style={{ padding:"0 14px 6px", fontSize:10, fontWeight:700, color:"#3a6080", textTransform:"uppercase", letterSpacing:.8 }}>On Shift — {session.home}</div>
            {residents.map(r=>{
              const s = STAGES[r.stage];
              return (
                <div key={r.id} onClick={()=>goToResident(r,"facesheet")}
                  style={{ padding:"7px 14px", cursor:"pointer", display:"flex", gap:8, alignItems:"center",
                    background:selectedResident?.id===r.id?"rgba(200,150,12,.08)":"transparent",
                    borderLeft:selectedResident?.id===r.id?`3px solid ${C.gold}`:"3px solid transparent" }}>
                  <span style={{fontSize:18}}>{r.photo}</span>
                  <div style={{flex:1,overflow:"hidden"}}>
                    <div style={{ fontSize:11,fontWeight:700,color:selectedResident?.id===r.id?C.gold:C.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{r.name}</div>
                    <div style={{ fontSize:10,color:s.color,fontWeight:600 }}>{s.symbol} {s.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ overflowY:"auto", padding:20 }}>
          {RESIDENT_PAGES.includes(page) && residents.length > 1 && (
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {residents.map(r=>(
                <div key={r.id} onClick={()=>setSelectedResident(r)}
                  style={{ padding:"8px 14px", borderRadius:10, cursor:"pointer", display:"flex", gap:8, alignItems:"center",
                    background:selectedResident?.id===r.id?C.navy:C.white,
                    border:`2px solid ${selectedResident?.id===r.id?C.gold:C.gray2}`, transition:"all .15s" }}>
                  <span style={{fontSize:18}}>{r.photo}</span>
                  <div>
                    <div style={{ fontSize:12,fontWeight:700,color:selectedResident?.id===r.id?C.white:C.text }}>{r.name}</div>
                    <div style={{ fontSize:10,color:selectedResident?.id===r.id?"#8fb3d4":C.text3 }}>{STAGES[r.stage].symbol} {r.home}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGES */}
          {page==="roster" && (
            <div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:18,fontWeight:800,color:C.navy,fontFamily:"Georgia,serif",marginBottom:4 }}>Resident Roster — {session.home}</div>
                <div style={{ fontSize:13,color:C.text3 }}>Showing residents at your current home. Access restricted to active shift only.</div>
              </div>
              <div style={{ display:"grid", gap:10 }}>
                {residents.map(r=>{
                  const s = STAGES[r.stage];
                  const lowMedAlerts = Object.entries(r.pillCounts||{}).filter(([,pc])=>Math.floor(pc.current/pc.perDay)<=7).length;
                  return (
                    <Card key={r.id}>
                      <div style={{ padding:16, display:"flex", gap:14, alignItems:"center" }}>
                        <div style={{ fontSize:48,lineHeight:1,background:s.bg,borderRadius:12,padding:"6px 10px",border:`2px solid ${s.color}33`,cursor:"pointer" }}
                          onClick={()=>goToResident(r,"facesheet")}>{r.photo}</div>
                        <div style={{flex:1}}>
                          <div style={{ fontSize:17,fontWeight:800,color:C.text,marginBottom:4,fontFamily:"Georgia,serif" }}>{r.name}</div>
                          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                            <Tag label={`${s.symbol} ${s.name}`} color={s.color} bg={s.bg} small/>
                            <Tag label={`Age ${r.age}`} color={C.text2} bg={C.gray0} small/>
                            <Tag label={r.dietaryTexture} color={C.teal} bg={C.teallt} small/>
                            {r.seizureHistory && <Tag label="⚡ Seizure Hx" color={C.white} bg={C.red} small/>}
                            {lowMedAlerts>0 && <Tag label={`⚠ ${lowMedAlerts} Med Low`} color={C.white} bg={C.orange} small/>}
                            {r.allergies.slice(0,2).map(a=><Tag key={a} label={`⚠ ${a}`} color={C.white} bg={C.redmed} small/>)}
                            {s.tension>=8 && <Tag label={`Tension ${s.tension}/10`} color={C.white} bg={C.red} small/>}
                          </div>
                        </div>
                        <div style={{ display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end" }}>
                          <Btn v="primary" small onClick={()=>goToResident(r,"facesheet")}>Face Sheet</Btn>
                          <Btn v="gold"    small onClick={()=>goToResident(r,"meds")}>💊 Meds</Btn>
                          <Btn v="teal"    small onClick={()=>goToResident(r,"behavior")}>🧠 Plan</Btn>
                          <Btn v="red"     small onClick={()=>goToResident(r,"pcm")}>🤝 Crisis</Btn>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {page==="facesheet" && selectedResident && <FaceSheet resident={selectedResident}/>}
          {page==="meds"      && selectedResident && <MedAdmin resident={selectedResident}/>}
          {page==="behavior"  && selectedResident && <BehaviorPlanViewer resident={selectedResident}/>}
          {page==="pcm"       && selectedResident && <CrisisReference resident={selectedResident}/>}
          {page==="nsdt"      && selectedResident && <NSDTLogger resident={selectedResident} onClassified={()=>{}}/>}
          {page==="incident"  && selectedResident && <IncidentLog resident={selectedResident} staff={session.staff}/>}
          {page==="wallet"    && selectedResident && <ResidentWallet resident={selectedResident}/>}
          {page==="procedure" && <ProcedureGuide resident={selectedResident} staff={session.staff}/>}
          {page==="commlog"   && <CommunicationLog session={session}/>}
          {page==="analytics" && <AnalyticsDashboard session={session}/>}
          {page==="handover"  && <ShiftHandover session={session} residents={residents}/>}
          {page==="schedule"  && <ScheduleView staff={session.staff} session={session}/>}

          {RESIDENT_PAGES.includes(page) && !selectedResident && (
            <div style={{ textAlign:"center", padding:48, color:C.text3 }}>
              <div style={{fontSize:32,marginBottom:8}}>👆</div>
              <div style={{fontSize:14}}>Select a resident above to continue</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]           = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [familyMember, setFamilyMember] = useState(null);
  const [baSession, setBaSession]       = useState(null);
  const [demoMode, setDemoMode]         = useState(false);
  const [showClockOutGate, setShowClockOutGate] = useState(false);

  if (demoMode)     return <DemoMode onExit={()=>setDemoMode(false)}/>;
  if (adminSession) return <AdminPortal admin={adminSession} onLogout={()=>setAdminSession(null)}/>;
  if (familyMember) return <FamilyPortal member={familyMember} onLogout={()=>setFamilyMember(null)}/>;
  if (baSession)    return <BAPortal onLogout={()=>setBaSession(null)}/>;

  if (!session) return (
    <ClockIn
      onClockIn={setSession}
      onAdmin={setAdminSession}
      onFamily={setFamilyMember}
      onBA={()=>setBaSession(true)}
      onDemo={()=>setDemoMode(true)}
    />
  );

  const residents = RESIDENTS_DB[session.home] || [];

  return (
    <>
      {showClockOutGate && (
        <ClockOutGate
          session={session}
          residents={residents}
          onConfirm={()=>{ setShowClockOutGate(false); setSession(null); }}
          onCancel={()=>setShowClockOutGate(false)}
        />
      )}
      <StaffPortal
        session={session}
        onLogout={()=>setSession(null)}
        onShowClockOut={()=>setShowClockOutGate(true)}
      />
    </>
  );
}
