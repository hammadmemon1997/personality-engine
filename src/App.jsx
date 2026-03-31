import { useState, useRef, useEffect } from "react";
import "./index.css";

// ═══════════════════════════════════════════════════
// SCORING KEYWORDS
// ═══════════════════════════════════════════════════
const OCEAN_KW = {
  O:{pos:["creative","innovation","research","design","strategy","explore","concept","idea","vision","develop","invent","curious","learning","experiment","novel","diverse","art","write","philosophy","theory","architect","plan","imagine","discover","build","startup","entrepreneurship","digital","technology","transform","launch","initiative","reimagine","pioneered"],neg:["routine","compliance","process","standard","procedure","maintain","operations","admin","clerical","entry","repetitive","support","coordinate"]},
  C:{pos:["audit","compliance","accuracy","detail","deadline","report","analysis","review","manage","organise","plan","implement","deliver","quality","control","improve","monitor","measure","track","complete","precise","thorough","systematic","structured","efficient","certif","accounting","finance","tax","legal","engineer","schedule","budget","forecast","reconcil","ifrs","isa","gaap","framework","governance","oversight","assurance"],neg:["flexible","adapt","spontaneous","informal","casual","freelance","varied"]},
  E:{pos:["lead","manage","team","client","present","stakeholder","collaborate","communicate","negotiate","train","mentor","coach","public","speak","network","partner","engage","relationship","business development","sales","marketing","customer","community","event","conference","workshop","facilitate","coordinate","executive","director","head","chief"],neg:["independent","solo","remote","individual","analyst","research","technical","data","model","code","program","backend","internal"]},
  A:{pos:["team","support","help","mentor","coach","develop","community","volunteer","charity","nonprofit","collaborate","assist","care","empathy","patient","teach","train","people","culture","wellbeing","diversity","inclusion","service","humanitarian","social"],neg:["negotiate","competitive","target","performance","revenue","sales","commercial","drive","aggressive","push","challenge","critical","evaluate"]},
  N:{neg:["stable","consistent","reliable","calm","confident","resilient","composed","steady","manage pressure","deliver under","high stakes","crisis","volatile","uncertainty","complex","challenging","adapt","flexible"],pos:["concern","risk","careful","cautious","sensitive","aware","thorough","check","verify","validate","monitor","oversight","safeguard"]}
};
const ENN_KW = {"1":["quality","standard","compliance","correct","improve","error","accuracy","ethics","integrity","principle","perfect","right","responsibility","audit","legal","policy","procedure","excellence","precise"],"2":["help","support","mentor","coach","team","collaborate","assist","care","develop people","training","hr","counsell","social work","volunteer","community","teach","guide"],"3":["achieve","target","performance","award","recognition","promot","success","result","deliver","milestone","lead","executive","career","objective","goal","efficient"],"4":["creative","design","art","unique","authentic","express","identity","brand","culture","diversity","write","narrative","vision","meaning","craft"],"5":["research","analysis","data","model","investigate","expert","knowledge","technical","academic","publish","study","insight","analytics","science","engineer","program"],"6":["security","risk","compliance","safety","reliable","loyal","policy","procedure","team","protect","contingency","audit","review","check","verify","due diligence"],"7":["diverse","varied","new","exciting","opportunities","travel","project","startup","growth","entrepreneurship","creative","innovation","launch","explore","experience"],"8":["lead","director","executive","ceo","founder","head","chief","senior","authority","decision","control","power","drive","challenge","bold","impact","transform"],"9":["mediator","balance","consensus","harmony","stable","maintain","coordinate","support","bridge","peace","relationship","collaborative","steady","culture","community"]};
const DISC_KW = {D:["director","executive","vp","head","chief","ceo","coo","cfo","lead","senior","manager","principal","partner","founder","president","drive","deliver","target","revenue","competitive","growth","strategy","commercial","authority","decision","transform"],I:["sales","marketing","business development","brand","client","customer","present","pitch","network","engage","communicate","partner","public","event","social","media","creative","collaborate","inspire","train","coach","facilitate"],S:["support","assist","coordinate","admin","operations","hr","team","service","maintain","process","consistent","reliable","stable","steady","patient","care","help","long-term","loyalty","continuity"],C:["audit","analysis","data","research","compliance","quality","accounting","finance","tax","engineer","technical","model","report","review","accuracy","detail","standard","procedure","system","measure","monitor","control","verify","reconcil"]};

// ═══════════════════════════════════════════════════
// INDUSTRY-SPECIFIC QUESTIONS
// ═══════════════════════════════════════════════════
const INDUSTRY_QUESTIONS = {
  "audit": {
    label:"Audit & Assurance",
    qs:[
      {id:"sector",q:"Primary sector you audit?",opts:[{l:"Banking & Capital Markets",kw:"banking capital markets investment financial instruments credit risk ecl"},{l:"Insurance & Asset Management",kw:"insurance actuarial asset management fund investment risk"},{l:"Corporate & General",kw:"corporate manufacturing retail general industry"},{l:"Public Sector / NFP",kw:"government nonprofit public sector regulatory compliance social"}]},
      {id:"scale",q:"Typical client size?",opts:[{l:"ASX/Listed entities",kw:"listed asx public reporting disclosure continuous disclosure materiality"},{l:"Large private / MNC",kw:"multinational large private complex cross-border consolidation"},{l:"Mid-market",kw:"mid-market private growing business owner-managed"},{l:"Small business / SME",kw:"small business sme owner advisory practical"}]},
      {id:"focus",q:"Specialist focus area?",opts:[{l:"Digital Audit & Analytics",kw:"data analytics alteryx halo digital audit automation ai machine learning continuous monitoring"},{l:"IFRS Technical",kw:"ifrs 9 ifrs 16 ifrs 15 technical accounting complex judgement ecl impairment"},{l:"Risk & Internal Controls",kw:"internal controls risk framework sox icfr governance process improvement"},{l:"ESG & Sustainability",kw:"esg sustainability climate risk reporting greenwashing assurance"}]}
    ]
  },
  "tech": {
    label:"Technology",
    qs:[
      {id:"stack",q:"Your primary stack?",opts:[{l:"Frontend / Product",kw:"react ui ux frontend product design user experience interface"},{l:"Backend / Infrastructure",kw:"backend api database infrastructure cloud aws devops systems architecture"},{l:"Data / ML / AI",kw:"data science machine learning artificial intelligence model training analytics python"},{l:"Full-stack",kw:"full stack end to end product build deploy scale"}]},
      {id:"env",q:"Environment?",opts:[{l:"Startup / Early-stage",kw:"startup early stage founder zero to one build fast iterate pivot"},{l:"Scale-up / Growth",kw:"scale growth series b product market fit team building rapid expansion"},{l:"Enterprise / Big Tech",kw:"enterprise large scale distributed systems reliability governance process"},{l:"Consulting / Agency",kw:"consulting client delivery multiple projects diverse technology advisory"}]},
      {id:"role_type",q:"Role type?",opts:[{l:"Individual Contributor",kw:"individual contributor deep technical expert specialist craft quality"},{l:"Tech Lead / Manager",kw:"technical lead manager team engineering leadership mentoring architecture decisions"},{l:"Product / Strategy",kw:"product strategy roadmap stakeholder prioritisation outcome metrics"}]}
    ]
  },
  "finance": {
    label:"Financial Services",
    qs:[
      {id:"domain",q:"Your domain?",opts:[{l:"Banking & Lending",kw:"banking lending credit risk retail commercial corporate treasury"},{l:"Investment & Markets",kw:"investment portfolio trading markets equity fixed income derivatives funds"},{l:"Insurance",kw:"insurance underwriting claims actuarial risk product pricing"},{l:"FinTech / Payments",kw:"fintech payments digital banking embedded finance api technology regulation"}]},
      {id:"function",q:"Primary function?",opts:[{l:"Risk & Compliance",kw:"risk compliance regulatory apra asic governance oversight framework"},{l:"Finance & Reporting",kw:"financial reporting ifrs accounting close consolidation management accounts"},{l:"Advisory & Strategy",kw:"advisory strategy transformation consulting stakeholder executive"},{l:"Operations / Delivery",kw:"operations delivery process improvement efficiency client service"}]}
    ]
  },
  "consulting": {
    label:"Consulting & Advisory",
    qs:[
      {id:"type",q:"Consulting type?",opts:[{l:"Strategy",kw:"strategy growth transformation corporate advisory c-suite board"},{l:"Operations",kw:"operations process improvement lean six sigma efficiency delivery"},{l:"Technology / Digital",kw:"digital transformation technology implementation change management erp cloud"},{l:"Specialist / Boutique",kw:"specialist niche domain expert boutique independent advisory"}]},
      {id:"clients",q:"Client base?",opts:[{l:"Corporate / Enterprise",kw:"corporate large enterprise asx listed complex stakeholder"},{l:"Government / Public",kw:"government public sector policy regulatory tender procurement"},{l:"SME / Mid-market",kw:"sme mid market private owner managed practical implementation"},{l:"Startup / Scale-up",kw:"startup venture growth scale advisory board mentor"}]}
    ]
  },
  "health": {
    label:"Healthcare & Life Sciences",
    qs:[
      {id:"domain",q:"Your area?",opts:[{l:"Clinical / Patient Care",kw:"clinical patient care treatment outcomes health wellbeing therapeutic"},{l:"Health Administration",kw:"health administration hospital management operations system policy"},{l:"Pharmaceutical / Research",kw:"pharmaceutical clinical trials research regulatory tga fda drug development"},{l:"Allied Health",kw:"allied health physio psychology occupational therapy community care"}]}
    ]
  },
  "marketing": {
    label:"Marketing & Communications",
    qs:[
      {id:"channel",q:"Primary channel focus?",opts:[{l:"Digital / Performance",kw:"digital performance seo sem paid social analytics conversion roi"},{l:"Brand & Creative",kw:"brand creative storytelling design visual identity campaign"},{l:"Content & PR",kw:"content editorial pr communications media relations thought leadership"},{l:"Strategy & Insights",kw:"strategy insights data research market audience segmentation"}]},
      {id:"sector_focus",q:"B2B or B2C?",opts:[{l:"B2B",kw:"b2b business enterprise account based sales enablement demand generation"},{l:"B2C",kw:"b2c consumer retail mass market loyalty engagement"},{l:"Both",kw:"cross market multi channel integrated campaign broad"}]}
    ]
  },
  "legal": {
    label:"Legal & Compliance",
    qs:[
      {id:"practice",q:"Practice area?",opts:[{l:"Corporate & Commercial",kw:"corporate commercial M&A transactions due diligence contracts negotiation"},{l:"Litigation & Disputes",kw:"litigation dispute resolution advocacy court proceedings mediation"},{l:"Regulatory & Compliance",kw:"regulatory compliance financial services apra asic policy governance risk"},{l:"In-house Counsel",kw:"in-house general counsel corporate governance board risk commercial"}]}
    ]
  }
};

function detectIndustryQs(roleText, bgText) {
  const t = (roleText + " " + bgText).toLowerCase();
  if (/audit|assurance|pwc|ey\b|kpmg|deloitte|big 4|big four/.test(t)) return "audit";
  if (/software|engineer|developer|frontend|backend|devops|fullstack|full.stack|tech lead|cto|vp eng/.test(t)) return "tech";
  if (/bank|invest|capital market|insurance|asset manag|fund|fintech|trading|portfolio|wealth/.test(t)) return "finance";
  if (/consult|advisor|advisory|mckinsey|bain|bcg|accenture|strategy&/.test(t)) return "consulting";
  if (/health|clinical|hospital|medical|pharma|allied|nursing|gp|doctor/.test(t)) return "health";
  if (/market|brand|content|pr |communications|campaign|seo|digital market/.test(t)) return "marketing";
  if (/legal|law|litigation|solicitor|barrister|counsel|compliance officer/.test(t)) return "legal";
  return null;
}

// ═══════════════════════════════════════════════════
// SHARE LINK UTILITIES
// ═══════════════════════════════════════════════════
function encodeShare(data) {
  try { return btoa(encodeURIComponent(JSON.stringify(data))); } catch { return null; }
}
function decodeShare(hash) {
  try { return JSON.parse(decodeURIComponent(atob(hash))); } catch { return null; }
}

// ═══════════════════════════════════════════════════
// PDF PRINT UTILITY
// ═══════════════════════════════════════════════════
function printToPDF(report, dob) {
  const{name,headline,tagline,ocean,mbti,mbtiData,ennType,ennData,discLabel,discDom,strengths,blind,wealthPsych,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData,careerCtx,soulPurpose,relData,roleModels,dailyProtocol,decisionTiming,lifeJourney}=report;
  const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
  const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};
  const bars=Object.entries(ocean).map(([k,v])=>`<div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:10px;color:#888;letter-spacing:1.5px;text-transform:uppercase;font-family:DM Sans,sans-serif">${BL[k]}</span><span style="font-size:12px;color:${BC[k]};font-weight:600">${v}%</span></div><div style="height:4px;background:#f0ece4;border-radius:2px"><div style="height:100%;width:${v}%;background:${BC[k]};border-radius:2px"></div></div></div>`).join("");
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Personal Intelligence Report — ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"DM Sans",sans-serif;background:#FAFAF8;color:#1a1a1a;font-size:12px;line-height:1.7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:15mm 18mm}
.cover{background:#090E15;color:#F0EAD6;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px 60px;page-break-after:always;position:relative}
.eyebrow{font-size:9px;letter-spacing:5px;color:#C9A84C;text-transform:uppercase;margin-bottom:32px}
.cname{font-family:"Cormorant Garamond",serif;font-size:52px;font-weight:300;margin-bottom:14px}
.arch{font-family:"Cormorant Garamond",serif;font-size:22px;font-style:italic;color:#C9A84C;margin-bottom:12px}
.ctag{font-size:13px;color:#6a8090;max-width:480px;margin:0 auto 28px;line-height:1.8}
.chips{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.chip{border:1px solid rgba(201,168,76,0.5);color:#C9A84C;font-size:9px;letter-spacing:2px;padding:6px 18px;border-radius:20px;text-transform:uppercase}
.pg{max-width:100%;padding:0}
.sec{padding:28px 0;border-bottom:1px solid #e8e4dc;page-break-inside:avoid}
.sl{font-size:8px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-bottom:8px}
.st{font-family:"Cormorant Garamond",serif;font-size:24px;font-weight:400;color:#0a0e14;margin-bottom:16px}
p{color:#444;line-height:1.85}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.cl{font-size:8px;letter-spacing:3px;color:#aaa;text-transform:uppercase;margin-bottom:8px}
.li{font-size:11px;color:#555;line-height:1.8;margin-bottom:3px}
.hl{background:#FBF7EE;border-left:3px solid #C9A84C;padding:12px 16px;margin-top:12px;border-radius:0 4px 4px 0}
.card{background:#F5F2EC;border-radius:8px;padding:12px;margin-bottom:8px;border-left:3px solid #C9A84C}
.cn{font-size:9px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}
.g4{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.rm{padding-left:14px;border-left:2px solid #C9A84C;margin-bottom:14px}
.ry{font-size:8px;color:#C9A84C;letter-spacing:3px;text-transform:uppercase;margin-bottom:3px}
.ngrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
.nc{background:#F5F2EC;border:1px solid #e8e4dc;border-radius:8px;padding:12px;text-align:center}
.nn{font-family:"Cormorant Garamond",serif;font-size:32px;font-weight:300;color:#C9A84C}
.nl{font-size:8px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:4px}
.qsec{background:#090E15;padding:50px 60px;text-align:center}
.qt{font-family:"Cormorant Garamond",serif;font-size:20px;font-style:italic;font-weight:300;color:#F0EAD6;line-height:1.7;max-width:560px;margin:0 auto 12px}
.qa{font-size:8px;color:#C9A84C;letter-spacing:4px;text-transform:uppercase}
.ft{text-align:center;padding:16px;font-size:8px;color:#aaa;letter-spacing:1.5px}
.skill-tag{display:inline-block;background:#EEF5F0;border:1px solid #c8e0cc;color:#4a7060;font-size:9px;padding:2px 8px;border-radius:4px;margin:2px}
</style></head><body>
<div class="cover">
<div class="eyebrow">Personal Intelligence Report · ${new Date().toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</div>
<div class="cname">${name}</div><div class="arch">${headline}</div><p class="ctag">${tagline}</p>
<div class="chips"><span class="chip">${mbti}</span><span class="chip">Enneagram ${ennType}</span><span class="chip">DISC — ${discLabel}</span>${nums?`<span class="chip">Life Path ${nums.lp}</span><span class="chip">${nums.element}</span>`:""}</div>
</div>
<div class="pg">
<div class="sec"><div class="sl">01 — Profile</div><div class="st">Who You Are</div><p>${report.summary}</p>${careerCtx.skills.length?`<div style="margin-top:10px">${careerCtx.skills.map(s=>`<span class="skill-tag">${s}</span>`).join("")}</div>`:""}</div>
<div class="sec"><div class="sl">02 — Big Five OCEAN</div><div class="st">Personality Dimensions</div>${bars}</div>
<div class="sec"><div class="sl">03 — MBTI</div><div class="st">${mbti} · ${mbtiData[0]}</div><p style="margin-bottom:10px">${mbtiData[1]}</p><div class="hl"><p><em>${mbtiData[2]}</em></p></div></div>
<div class="sec"><div class="sl">04 — Enneagram</div><div class="st">Type ${ennType} · ${ennData.name}</div><p style="margin-bottom:10px">${ennData.core}</p><div class="g4"><div class="card"><div class="cn" style="color:#7DBF8A">Gift</div><p style="font-size:11px">${ennData.gift}</p></div><div class="card" style="border-color:#C9A84C"><div class="cn">Growth</div><p style="font-size:11px">${ennData.growth}</p></div><div class="card" style="border-color:#C97A7A"><div class="cn" style="color:#C97A7A">Stress</div><p style="font-size:11px">${ennData.stress}</p></div><div class="card" style="border-color:#7C9CBF"><div class="cn" style="color:#7C9CBF">Wing</div><p style="font-size:11px">${ennData.wing}</p></div></div></div>
<div class="sec"><div class="sl">05 — Communication</div><div class="st">How to Work With ${name.split(" ")[0]}</div><p>${commStyle}</p></div>
<div class="sec"><div class="sl">06 — Career</div><div class="st">Career Intelligence · ${careerCtx.archetype}</div><p style="color:#666;font-size:11px;margin-bottom:12px">${careerCtx.archetypeDesc}</p><div class="two"><div><div class="cl">Strengths</div>${strengths.map(s=>`<div class="li">◆ ${s}</div>`).join("")}</div><div><div class="cl">Three Paths Forward</div>${careerCtx.nextMoves.map((m,i)=>`<div class="li">0${i+1} → ${m.title}</div>`).join("")}</div></div><div class="hl"><p><strong>Blind spot:</strong> ${blind}</p></div></div>
<div class="sec"><div class="sl">07 — Strategy</div><div class="st">3-Year Roadmap</div>${roadmap.map(r=>`<div class="rm"><div class="ry">${r.y} — ${r.t}</div><p>${r.a}</p></div>`).join("")}</div>
${nums&&lpData?`<div class="sec"><div class="sl">08 — Numerology</div><div class="st">${nums.element} Element · Life Path ${nums.lp}</div><div class="ngrid">${[["Life Path",nums.lp],["Expression",nums.expr],["Soul Urge",nums.soul],["Birth Day",nums.bd],["Personality",nums.pers],["Personal Year",nums.py]].map(([l,n])=>`<div class="nc"><div class="nn">${n}</div><div class="nl">${l}</div></div>`).join("")}</div><p style="margin-bottom:8px"><strong>Life Path ${nums.lp} — ${lpData.name}:</strong> ${lpData.desc}</p><p>${nums.element} Element: ${elemData?.desc}</p><div class="hl"><p>${numSynthesis}</p></div></div>`:""}
${soulPurpose?`<div class="sec"><div class="sl">09 — Soul Purpose</div><div class="st">${soulPurpose.missionType}</div><p style="margin-bottom:10px">${soulPurpose.mission}</p><div class="two"><div class="card" style="border-color:#7C9CBF"><div class="cn" style="color:#7C9CBF">Lesson</div><p style="font-size:11px">${soulPurpose.lesson}</p></div><div class="card" style="border-color:#7DBF8A"><div class="cn" style="color:#7DBF8A">Contribution</div><p style="font-size:11px">${soulPurpose.contribution}</p></div></div></div>`:""}
<div class="sec"><div class="sl">10 — Wealth</div><div class="st">Financial Psychology</div><p style="margin-bottom:8px">${wealthPsych.frequency}</p><p style="margin-bottom:4px;color:#C97A7A"><strong>Block:</strong> ${wealthPsych.block}</p><p style="color:#4a7060"><strong>Strategy:</strong> ${wealthPsych.strategy}</p></div>
${relData?`<div class="sec"><div class="sl">11 — Relationships</div><div class="st">Relationship Dynamics</div><p style="margin-bottom:10px">${relData.ideal}</p><div class="hl"><p><strong>Partner profile:</strong> ${relData.partner}</p></div></div>`:""}
${roleModels?`<div class="sec"><div class="sl">12 — Role Models</div><div class="st">Strategic Archetypes to Model</div>${roleModels.models.map((m,i)=>`<p style="margin-bottom:6px"><strong>${i+1}. ${m.name}</strong> <em style="color:#aaa">${m.tag}</em><br><span style="font-size:11px;color:#666">${m.why}</span></p>`).join("")}</div>`:""}
</div>
${quote?`<div class="qsec"><p class="qt">"${quote}"</p><div class="qa">— ${headline}</div></div>`:""}
<div class="ft">PERSONAL INTELLIGENCE ENGINE · ${name.toUpperCase()} · 🔒 ZERO DATA STORED · Generated ${new Date().toLocaleDateString("en-AU")}</div>
</body></html>`;
  const w=window.open("","_blank");
  if(!w){alert("Please allow popups to generate PDF");return;}
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(()=>{w.print();},600);
}
const MBTI_MAP = {INTJ:["Architect","Strategic, independent visionary who builds long-term frameworks. Makes decisions by internalising complex patterns.","Driven by mastery and systemic improvement — values competence above all."],INTP:["Logician","Analytical, inventive thinker who seeks to understand the underlying principles behind every system.","Motivated by truth and elegant solutions to complex problems."],ENTJ:["Commander","Bold, decisive, natural executive who builds efficient systems at scale. Sees the strategic picture and moves toward it.","Driven by achievement, leadership, and transformative impact."],ENTP:["Debater","Quick-witted innovator who thrives on intellectual challenge and disruption. Generates ideas faster than they can be executed.","Motivated by novel ideas and challenging the status quo."],INFJ:["Advocate","Insightful, principled, deeply empathetic with a long-term vision. Senses patterns in people and systems others miss.","Driven by meaningful contribution to something larger than themselves."],INFP:["Mediator","Idealistic, creative, deeply values-driven and authentic. Brings unusual depth of feeling to work and relationships.","Motivated by personal meaning, creativity, and helping others grow."],ENFJ:["Protagonist","Charismatic, inspiring leader focused on developing people. Reads the room intuitively and moves groups toward a shared vision.","Driven by enabling others to reach their full potential."],ENFP:["Campaigner","Enthusiastic, imaginative, energised by possibility and human connection. Sees potential everywhere.","Motivated by freedom, creativity, and making a positive difference."],ISTJ:["Logistician","Reliable, meticulous, duty-driven executor of structured systems. Builds trust through consistency, precision, and follow-through.","Driven by responsibility, accuracy, and proven methodologies."],ISFJ:["Defender","Warm, loyal, deeply committed to protecting and serving others. Remembers details about people and uses them to help.","Motivated by stability, helpfulness, and maintaining trusted structures."],ESTJ:["Executive","Organised, decisive, natural administrator who creates order from chaos. Sets clear expectations and holds to them.","Driven by efficiency, clear hierarchies, and tangible results."],ESFJ:["Consul","Caring, socially aware, focused on group harmony. Takes responsibility for the emotional climate of a team.","Motivated by belonging, helpfulness, and maintaining strong relationships."],ISTP:["Virtuoso","Pragmatic, observant, master of practical problem-solving. Engages fully when there's a real problem to solve.","Driven by understanding how things work and fixing them efficiently."],ISFP:["Adventurer","Flexible, charming, quietly creative and deeply values-aligned. Expresses identity through actions and aesthetics.","Motivated by authentic self-expression and present-moment engagement."],ESTP:["Entrepreneur","Bold, perceptive, action-oriented, thrives in dynamic environments. Negotiates and acts faster than most think.","Driven by immediate results, excitement, and practical impact."],ESFP:["Entertainer","Spontaneous, fun-loving, energises groups with warmth and enthusiasm. Fully present and generous in every interaction.","Motivated by enjoyment, social connection, and bringing joy to others."]};

const ENN_DATA = {"1":{name:"The Reformer",core:"Motivated by doing things right — fears being corrupt, flawed, or wrong",gift:"Brings integrity, precision, and principled standards to every environment",growth:"Learn that imperfection is not failure — good enough is sometimes perfect",stress:"Under stress, becomes critical, rigid, and self-righteous",wing:"Leans toward Type 9 (calm idealist) or Type 2 (principled helper)"},"2":{name:"The Helper",core:"Motivated by being needed — fears being unloved or unwanted",gift:"Creates belonging and genuine care wherever they go",growth:"Receive help as readily as you give it — your needs matter equally",stress:"Under stress, becomes controlling, possessive, and resentful",wing:"Leans toward Type 1 (orderly helper) or Type 3 (ambitious helper)"},"3":{name:"The Achiever",core:"Motivated by success and recognition — fears being worthless or a failure",gift:"Turns vision into tangible results with remarkable efficiency",growth:"Your value exists independent of your achievements — rest is not regression",stress:"Under stress, becomes image-obsessed, deceptive, and workaholic",wing:"Leans toward Type 2 (charming achiever) or Type 4 (artistic achiever)"},"4":{name:"The Individualist",core:"Motivated by authenticity and depth — fears being ordinary or without identity",gift:"Brings creative depth, emotional intelligence, and originality",growth:"Ordinary moments contain extraordinary meaning — presence over drama",stress:"Under stress, becomes self-absorbed, moody, and withdrawn",wing:"Leans toward Type 3 (expressive achiever) or Type 5 (introspective artist)"},"5":{name:"The Investigator",core:"Motivated by knowledge and competence — fears being useless or overwhelmed",gift:"Provides the deepest expertise and most thorough analysis in any field",growth:"Share your knowledge before it is complete — connection requires vulnerability",stress:"Under stress, becomes detached, hoarding, and isolated",wing:"Leans toward Type 4 (imaginative investigator) or Type 6 (loyal analyst)"},"6":{name:"The Loyalist",core:"Motivated by security and support — fears being abandoned or without guidance",gift:"The most reliable, thorough, and trustworthy presence in any team",growth:"Your inner guidance is as trustworthy as external authority — trust it",stress:"Under stress, becomes anxious, suspicious, and reactive",wing:"Leans toward Type 5 (intellectual guardian) or Type 7 (optimistic loyalist)"},"7":{name:"The Enthusiast",core:"Motivated by freedom and possibility — fears pain, limitation, or missing out",gift:"Brings contagious optimism and the ability to see opportunity everywhere",growth:"Depth over breadth — staying with discomfort reveals what scattered energy misses",stress:"Under stress, becomes scattered, impulsive, and escapist",wing:"Leans toward Type 6 (grounded enthusiast) or Type 8 (assertive visionary)"},"8":{name:"The Challenger",core:"Motivated by control and strength — fears being controlled or appearing weak",gift:"Protects the vulnerable and creates change at a scale others cannot imagine",growth:"Vulnerability is strength — letting people in multiplies your impact",stress:"Under stress, becomes domineering, confrontational, and destructive",wing:"Leans toward Type 7 (bold expansionist) or Type 9 (calm protector)"},"9":{name:"The Peacemaker",core:"Motivated by harmony and peace — fears conflict and separation",gift:"Creates consensus and an environment where everyone feels included",growth:"Your presence and opinion matter — showing up fully is an act of love",stress:"Under stress, becomes disengaged, stubborn, and avoidant",wing:"Leans toward Type 8 (assertive mediator) or Type 1 (principled peacemaker)"}};

const LP_DATA = {1:{name:"The Leader",desc:"Independent, pioneering drive — here to initiate and lead",shadow:"Lone wolf tendency; struggles to delegate or accept help"},2:{name:"The Peacemaker",desc:"Diplomatic, cooperative, partnership-oriented energy",shadow:"Over-accommodates others; avoids necessary conflict"},3:{name:"The Achiever",desc:"Success-driven, adaptable, image-conscious high performer",shadow:"Defines worth by accomplishments; workaholic tendencies"},4:{name:"The Builder",desc:"Disciplined, methodical, creates lasting structures",shadow:"Rigidity; struggles with rapid change or ambiguity"},5:{name:"The Freedom Seeker",desc:"Adventurous, versatile, craves variety and new experience",shadow:"Commitment avoidance; scattered energy"},6:{name:"The Nurturer",desc:"Responsible, caring, deepest fulfilment through service",shadow:"Self-neglect; difficulty receiving help from others"},7:{name:"The Seeker",desc:"Analytical, introspective, truth-oriented deep thinker",shadow:"Over-analysis paralysis; withdraws when overwhelmed"},8:{name:"The Powerhouse",desc:"Ambitious, authoritative, built for material mastery",shadow:"Control issues; struggles to show vulnerability"},9:{name:"The Humanitarian",desc:"Compassionate, wise, service to something larger",shadow:"Martyr complex; gives too much, burns out silently"},11:{name:"Master 11 — The Illuminator",desc:"Highly intuitive visionary; inspires without trying",shadow:"Intense nervous energy when vision is not being lived"},22:{name:"Master 22 — The Master Builder",desc:"Visionary and practical; built to create at generational scale",shadow:"Collapses under own weight; pressure turns to anxiety"},33:{name:"Master 33 — The Teacher",desc:"Healing, inspiration, compassionate leadership at scale",shadow:"Carries everyone's pain; forgets their own needs"}};

const ELEM_DATA = {
  Fire:{desc:"Passionate, bold, charismatic — leads with energy and inspires others naturally",lucky:"Crimson Red, Burnt Orange, Deep Gold",peak:"10:00 AM – 1:00 PM",season:"Spring and Summer — your most potent period for bold moves and launches",avoid:"Late evenings and winter; your energy depletes rapidly in cold, low-light environments",decision:"Your fire energy peaks at midday. Schedule high-stakes negotiations, pitches, and pivotal decisions between 10am–1pm when your instinct and charisma are sharpest."},
  Earth:{desc:"Stable, practical, grounded — builds lasting things with precision and patience",lucky:"Emerald Green, Royal Blue, Soft Silver",peak:"8:00 AM – 11:00 AM",season:"Late Spring (May) and Autumn (September/October) — ideal windows for career pivots and major investments",avoid:"Impulsive decisions late at night; your Earth element requires rest to maintain analytical clarity",decision:"Your Earth energy peaks in the 'Golden Hours' of 8am–10:30am. High-stakes negotiations and complex conclusions should be finalised during this window when your grounding energy is most supportive."},
  Water:{desc:"Intuitive, empathetic, deep — reads the room before thinking it, flows around obstacles",lucky:"Deep Blue, Sea Green, Pearl White",peak:"7:00 AM – 10:00 AM",season:"Autumn and early Winter — periods of depth and reflection align with your intuitive cycles",avoid:"High-pressure peak hours and crowded environments; you process slowly and deeply, not quickly and broadly",decision:"Your Water intuition is sharpest in the early morning quiet. Major decisions benefit from overnight reflection — never commit to something important the same day it arises."},
  Air:{desc:"Quick-minded, social, idea-rich — connects everything to everything, thrives on variety",lucky:"Sky Blue, Lavender, Bright Yellow",peak:"9:00 AM – 12:00 PM",season:"Spring and early Autumn — your mental agility and social energy peak when temperatures are moderate",avoid:"Isolation and repetitive routines; your Air nature requires stimulation and variety to function at its best",decision:"Your best decisions come through conversation and brainstorming. Use the morning hours for independent thinking, but validate key decisions through dialogue before committing."}
};

const COMM_STYLE = {ISTJ:"Direct and precise. Give data, structure, and clear timelines — not emotion. Allow processing time before expecting a decision. Put important things in writing.",INTJ:"Skip small talk and get to the point. Respect their autonomy. Disagree with logic, not emotion. They respect those who push back intelligently.",ENTJ:"Match their pace and be direct. Disagree with logic, not feeling. They respect those who hold their ground with sound reasoning.",INTP:"Engage through intellectual discussion. Present problems as puzzles to solve together. Do not rush conclusions; they need to process thoroughly.",INFJ:"Needs authenticity above all. They sense inauthenticity instantly. Have meaningful conversations, not transactional ones.",INFP:"Needs emotional safety before opening up. Validate feelings first, solutions second. Never dismiss their values as impractical.",ENFJ:"Check in personally before getting to business. Express appreciation explicitly. They give freely and need to feel that noticed.",ENFP:"Match their energy and enthusiasm for ideas. Give space to brainstorm without immediate critique. They need space before structure.",ISFJ:"Warm, personal communication. Show genuine appreciation for their contributions. Avoid sudden changes without explanation.",ESFJ:"Acknowledge their efforts publicly. Address issues privately and gently. They value harmony and take conflict personally.",ESTJ:"Be punctual, prepared, and professional. Respect hierarchy. Get to the point with clear structure — they have no patience for vagueness.",ESFP:"Be present and engaged. Match their warmth. Avoid heavy structure or rigid timelines — they lose interest quickly.",ISTP:"Keep it brief and competent. Show, do not tell. Respect their need for space and autonomy above all.",ISFP:"Be patient and non-confrontational. Appreciate their sensitivity as a strength, not a weakness.",ESTP:"Be direct and action-oriented. Skip lengthy processes. Make it energetic and tangible.",ENTP:"Challenge them intellectually. They love a good debate — do not take their devil's advocate personally."};

// ═══════════════════════════════════════════════════
// NEW: SOUL PURPOSE DATA
// ═══════════════════════════════════════════════════
const SOUL_PURPOSE = {
  1:{missionType:"The Pioneer",mission:"You are here to lead, initiate, and demonstrate that excellence is achievable alone. Your core purpose is to prove that independent thinking — not consensus — drives meaningful progress.",lesson:"The Lesson of Delegation: your growth depends on learning to trust the competence of others. Your value is not only in your labor, but in your vision and guidance.",contribution:"You serve the collective by blazing trails others follow. Every system you build, every standard you set, creates invisible scaffolding that others stand on long after you have moved forward.",daily:"Every Sunday, spend 15 minutes reviewing one decision you deferred to someone else this week. Notice the quality of the outcome. Build your evidence base for delegation."},
  2:{missionType:"The Connector",mission:"You are here to build the relational fabric that holds communities and organisations together. Your core purpose is to remind the world that no structure survives without the human bonds that support it.",lesson:"The Lesson of Boundaries: giving without receiving depletes the very source others depend on. Learning to say no is not selfish — it is self-preserving.",contribution:"You protect the vulnerable by ensuring no one falls through the gaps. Your care for individuals translates into systemic empathy in every environment you inhabit.",daily:"Begin each day by asking: what do I need today? Answer honestly before asking what others need."},
  3:{missionType:"The Achiever Archetype",mission:"You are here to demonstrate that focused ambition, when aligned with integrity, creates lasting value. Your purpose is to build visible proof that excellence and ethics coexist.",lesson:"The Lesson of Stillness: your identity runs deeper than your accomplishments. The work you do in rest — processing, integrating, being — is as generative as your output.",contribution:"You inspire others to reach higher by making achievement visible and attainable. Your results become permission slips for people who cannot yet imagine their own potential.",daily:"Identify one thing you accomplished this week that no one will ever know about. Sit with the satisfaction of that, separate from recognition."},
  4:{missionType:"The Architect of Structure",mission:"You are here to build things that last. Your core purpose is to demonstrate that careful, methodical construction creates more lasting value than speed or spectacle.",lesson:"The Lesson of Flexibility: the structures you build must bend or they will break. Your greatest growth comes when you allow your carefully laid plans to adapt to new information.",contribution:"You create the frameworks others inhabit. The processes, systems, and standards you establish protect people from chaos long after you are gone.",daily:"Each week, identify one process in your life or work that you have been reluctant to change. Ask: what would a 10% improvement look like?"},
  5:{missionType:"The Freedom Catalyst",mission:"You are here to demonstrate that variety, adaptability, and freedom are not liabilities but strategic assets. Your purpose is to show that versatility is a form of mastery.",lesson:"The Lesson of Depth: your greatest insights come not from breadth of experience, but from sustained engagement with a single thread long enough to reach its core.",contribution:"You bring fresh energy and new perspectives into environments that have grown stagnant. Your restlessness is a diagnostic tool — it points to where renewal is needed.",daily:"Choose one project, skill, or relationship this week to go deeper in, rather than wider. Note what you discover beyond the surface."},
  6:{missionType:"The Guardian of Trust",mission:"You are here to ensure that the systems governing human resources and wealth are handled with ethical precision. Your purpose is to prevent the collapses that arise from negligence and greed.",lesson:"The Lesson of Self-Trust: you are as reliable a source of guidance as any external authority. Your instinct, honed through years of diligence, is worth following.",contribution:"By ensuring accuracy, compliance, and integrity in every environment you inhabit, you protect people who never know they were protected. Your work is the invisible scaffolding that keeps things upright.",daily:"Each evening, identify one moment today where you trusted your instinct over external pressure. Celebrate that act of internal authority."},
  7:{missionType:"The Seeker of Truth",mission:"You are here to go deeper than the surface of things and bring back what you find. Your purpose is to provide the depth of insight that prevents systemic error.",lesson:"The Lesson of Sharing: knowledge hoarded is knowledge lost. Your growth depends on generosity — releasing what you know before you feel fully ready.",contribution:"Your ability to see beneath the obvious protects others from repeating patterns they cannot see themselves. Your insights are gifts; give them freely.",daily:"Once a week, share one insight with someone who did not ask for it. Notice their response. Build the habit of intellectual generosity."},
  8:{missionType:"The Architect of Power",mission:"You are here to demonstrate that power, when used in service of others rather than self-aggrandisement, creates lasting institutional change. Your purpose is to build authority worth having.",lesson:"The Lesson of Vulnerability: the walls you build to protect yourself also prevent genuine connection. Letting people in does not diminish your strength — it multiplies it.",contribution:"You protect those who cannot protect themselves. In every system you enter, your presence raises the standard of accountability and the cost of negligence.",daily:"Once a week, share something uncertain — a doubt, a fear, an open question — with someone you trust. Build the muscle of strategic vulnerability."},
  9:{missionType:"The Architect of Harmony",mission:"You are here to model that peace is not passive — it is a deliberate, courageous act. Your purpose is to create environments where everyone's contribution is visible and valued.",lesson:"The Lesson of Presence: the world needs your opinion, your energy, your full participation. Withholding yourself to keep the peace is a form of disappearance.",contribution:"You create the conditions in which others do their best work. The calm you provide in chaotic environments is a rare and precious gift that few can offer.",daily:"Each day, share one opinion that you have been holding back. Begin small. Build the habit of showing up fully."},
  11:{missionType:"The Illuminator",mission:"You are here to channel insight from the collective unconscious and translate it into usable wisdom for others. Your purpose is to inspire without trying.",lesson:"The Lesson of Embodiment: your visions are only valuable when acted upon. Ground your intuition in consistent, disciplined action.",contribution:"You shift the emotional climate of every room you enter. Your presence alone often resolves what logic cannot.",daily:"Every morning before checking your phone, spend five minutes in complete silence. Notice what surfaces. Record it."},
  22:{missionType:"The Master Builder",mission:"You are here to build something that outlasts you — a system, institution, or body of work that serves future generations. Your purpose is generational, not personal.",lesson:"The Lesson of Scale: you are capable of more than you permit yourself to attempt. The project that feels too large is precisely the one you were built for.",contribution:"What you create becomes infrastructure for others. Your buildings — literal or metaphorical — become the foundations on which civilisations stand.",daily:"Identify the project you have been putting off because it feels too large. Begin one concrete step this week. The momentum will follow."},
  33:{missionType:"The Master Teacher",mission:"You are here to heal, teach, and lead with compassion at a scale that transforms communities. Your purpose is to embody the lesson you are here to teach.",lesson:"The Lesson of Receiving: you are here to give — but you can only sustain that giving if you learn to receive with equal grace.",contribution:"Your presence in any environment raises the consciousness of everyone around you. What you model becomes permission for others to do the same.",daily:"Each week, accept one act of care from another person without deflecting, minimising, or immediately reciprocating."}
};

// ═══════════════════════════════════════════════════
// NEW: RELATIONSHIP DYNAMICS DATA
// ═══════════════════════════════════════════════════
const RELATIONSHIP_DATA = {
  Earth:{ideal:"Visionary Air or intuitive Water types — individuals who provide the big ideas and emotional depth that your grounded nature can manifest into reality. Professionally, you excel when paired with a Strategic Optimist who challenges your boundaries while you provide necessary reality checks.",lesson:"Vulnerability as Strength — because you are the reliable, rock-like figure, you may find it difficult to express your own needs or uncertainties. Learning to share your process, not just your results, will deepen your emotional connections significantly.",partner:"Your ideal partner is an Intellectual Nurturer — someone as ambitious as you are but with high emotional intelligence. They should appreciate the depth of your dedication while gently reminding you that your worth is not solely defined by your professional output.",idealResonance:"Intellectual Depth and Emotional Availability"},
  Fire:{ideal:"Steady Earth or nurturing Water types — individuals who can ground your energy, provide emotional stability, and prevent impulsive decisions. Professionally, you excel with Detail-Oriented partners who execute while you inspire.",lesson:"Consistency as Love — because you thrive on passion and momentum, you may undervalue the quiet, steady acts of care that sustain long-term relationships. Learning to love through reliability, not just intensity, transforms your connections.",partner:"Your ideal partner is a Calm Anchor — someone who is not threatened by your intensity but gently provides the stillness you need without competition. They should celebrate your boldness while offering a safe space to rest.",idealResonance:"Grounding Stability and Loyal Presence"},
  Air:{ideal:"Grounded Earth or passionate Fire types — individuals who can translate your ideas into action and provide the follow-through your diffuse energy sometimes lacks. Professionally, you excel with Systematic Thinkers who structure your vision.",lesson:"Commitment as Freedom — because you need variety, you may resist the depth that only sustained commitment can provide. Learning that deep relationships are the richest form of exploration transforms your view of attachment.",partner:"Your ideal partner is a Thoughtful Executor — someone who can follow your intellectual leaps, ground them in reality, and bring the warmth you sometimes intellectualise. They should be your equal in curiosity but your complement in steadiness.",idealResonance:"Intellectual Stimulation and Grounded Warmth"},
  Water:{ideal:"Structured Earth or inspiring Fire types — individuals who provide direction and energy to your depth and intuition. Professionally, you excel with Decisive Leaders who act while you sense and advise.",lesson:"Boundaries as Self-Love — because you absorb the emotions of those around you, you may find it difficult to distinguish your feelings from others'. Learning to contain your empathy without suppressing it protects your energy.",partner:"Your ideal partner is a Decisive Protector — someone who provides structure and safety for your sensitivity, who acts decisively where you hesitate, and who values depth of connection as much as you do.",idealResonance:"Emotional Safety and Directional Clarity"}
};

// ═══════════════════════════════════════════════════
// NEW: STRATEGIC ROLE MODELS
// ═══════════════════════════════════════════════════
const ROLE_MODELS = {
  Earth:{models:[{name:"Warren Buffett",tag:"The Sage of Stability",why:"Like you, Buffett is a master of Earth-element finance. His success is built on meticulous audit-style analysis and long-term grounded thinking — the exact principles you embody daily."},{name:"Ray Dalio",tag:"The Systems Architect",why:"Dalio's obsession with Principles and radical transparency mirrors your destiny to create systems of truth. His approach to governance is the evolution of your analytical skill set."},{name:"Sundar Pichai",tag:"The Methodical Executive",why:"A fellow Earth-aligned leader who rose through technical excellence and a calm, collaborative management style — proving that grounded precision scales to global leadership."},{name:"Marcus Aurelius",tag:"The Stoic Leader",why:"His philosophy of duty and internal governance provides the psychological blueprint for the Leader of Integrity archetype that your Life Path demands."},{name:"Christine Lagarde",tag:"The Institutional Reformer",why:"Her path from legal precision to global financial leadership mirrors the trajectory available to you — from technical mastery to institutional architecture."}]},
  Fire:{models:[{name:"Elon Musk",tag:"The Audacious Visionary",why:"Demonstrates what fire energy looks like fully unleashed — bold bets, relentless momentum, and the willingness to start over when necessary. Model his vision, manage his volatility."},{name:"Steve Jobs",tag:"The Creative Disruptor",why:"Showed how fire energy, when disciplined by craft, creates products that change culture. His obsession with the intersection of art and technology is your natural territory."},{name:"Richard Branson",tag:"The Joyful Risk-Taker",why:"Proves that business can be an adventure — that fire energy applied to enterprise creates both impact and aliveness. He makes boldness look like fun."},{name:"Nelson Mandela",tag:"The Resilient Flame",why:"Demonstrates how fire energy, when tempered by suffering and purpose, becomes an unstoppable force for collective transformation."},{name:"Arianna Huffington",tag:"The Reinvention Artist",why:"Her pivot from relentless ambition to wisdom-led leadership shows how fire energy evolves — burning brighter and more sustainably when aligned with inner values."}]},
  Air:{models:[{name:"Malcolm Gladwell",tag:"The Connector of Ideas",why:"A pure Air archetype — connects disparate ideas into narratives that shift how millions think. His curiosity-driven career models how intellectual restlessness becomes influence."},{name:"Reid Hoffman",tag:"The Network Architect",why:"Built LinkedIn by understanding that the future of work is relational, not transactional. His career demonstrates how Air energy applied to systems creates lasting infrastructure."},{name:"Oprah Winfrey",tag:"The Idea Catalyst",why:"Uses her Air energy to amplify the ideas and voices of others — a connector and broadcaster who creates platforms for human truth."},{name:"Richard Feynman",tag:"The Playful Genius",why:"Proved that intellectual curiosity without ego is the most powerful force in science. His delight in understanding is a model for how Air energy stays fresh."},{name:"Adam Grant",tag:"The Generous Thinker",why:"Models how intellectual generosity — sharing ideas freely and publicly — builds more influence than hoarding expertise."}]},
  Water:{models:[{name:"Carl Jung",tag:"The Depth Cartographer",why:"Mapped the terrain of the unconscious — a pure Water archetype who went where no one had gone and brought back frameworks that changed how we understand ourselves."},{name:"Maya Angelou",tag:"The Healer Through Story",why:"Used her depth of feeling to create work that healed millions. Her emotional courage — putting vulnerability on the page — is the pinnacle of Water-element expression."},{name:"Nelson Mandela",tag:"The Compassionate Strategist",why:"Combined Water-element depth and forgiveness with strategic brilliance — proving that empathy and power are not opposites."},{name:"Brene Brown",tag:"The Vulnerability Researcher",why:"Built a career on exploring what Water-element people feel most acutely: the power of being seen. Her work validates your sensitivity as your greatest professional asset."},{name:"Satya Nadella",tag:"The Empathic CEO",why:"Transformed Microsoft through Water-element leadership — empathy, patience, and deep listening — proving that softness is not weakness in boardrooms."}]}
};

// ═══════════════════════════════════════════════════
// NEW: WEALTH PSYCHOLOGY DATA
// ═══════════════════════════════════════════════════
const WEALTH_DATA = {
  C:{frequency:"Strategic Accumulator — you view money as a tool for security and a metric of professional competence. You build wealth through meticulous analysis, diversified low-to-medium risk strategies, and the continuous appreciation of your technical expertise.",block:"Scarcity of Time Mindset — you may subconsciously believe that wealth only comes through high-intensity labour. This can prevent you from exploring passive income streams or investment strategies that require patience rather than active effort.",strategy:"Focus on Tangible Appreciation. Invest in real estate or blue-chip assets with long-standing systemic presence. Continue investing in Tier-1 certifications — your highest ROI will always come from deepening specialisation in the global market."},
  D:{frequency:"Power Accumulator — you view money as a tool for leverage, influence, and freedom. You build wealth through bold moves, equity positions, and high-risk/high-reward strategies aligned with your risk appetite.",block:"Impatience with Compounding — your natural drive for visible results can cause you to exit positions too early or discount long-term compounding in favour of immediate returns. Patience is your wealth multiplier.",strategy:"Focus on Equity over Income. Your best returns come from ownership — in companies, ideas, or assets — rather than from optimising salary. Build positions in things you understand deeply and hold through the noise."},
  I:{frequency:"Relational Accumulator — you view money as a facilitator of experiences and relationships. Your wealth often comes through network effects, referrals, and opportunities that arise from genuine human connection.",block:"Generosity Before Security — your natural inclination to give freely can leave you financially exposed. Learning to distinguish between generosity from abundance and generosity from anxiety will transform your financial pattern.",strategy:"Invest in Your Network Deliberately. Every relationship you nurture is an asset. Track the ROI of your relational investments. Build a financial buffer before expanding your generosity — you can only give sustainably from a full position."},
  S:{frequency:"Steady Accumulator — you view money as a source of security and a foundation for serving others. You build wealth slowly, deliberately, and with a preference for low volatility and predictable returns.",block:"Comfort with Under-Earning — your natural modesty and aversion to conflict can prevent you from negotiating your true market value. Learning to advocate for your own worth is the most direct path to financial acceleration.",strategy:"Focus on Consistent Compounding. Automate your investments so that accumulation requires no willpower. Negotiate proactively at every career transition — your skills are worth more than your instinct tells you to ask for."}
};

// ═══════════════════════════════════════════════════
// NEW: DAILY PROTOCOL DATA
// ═══════════════════════════════════════════════════
const DAILY_PROTOCOL = {
  "1":{morning:"Spend the first 20 minutes of each day in complete silence before any screen. Set one clear intention for the day that is yours alone — not reactive to others' needs.",weekly:"Every Sunday, spend 20 minutes reviewing what you initiated this week versus what you only responded to. The ratio reveals how aligned you are with your true path.",intellectual:"Choose one problem each day to solve without assistance. Build your evidence that your own thinking is sufficient. This is the foundation of your next leadership threshold."},
  "2":{morning:"Begin each day by identifying one thing you need today — not what others need from you. Answer honestly before turning outward.",weekly:"Each week, accept one act of genuine care from someone without deflecting or immediately reciprocating. Build your capacity to receive.",intellectual:"Practice asking for help once per day — for anything, regardless of how small. This daily practice rewires the belief that self-sufficiency is your highest virtue."},
  "3":{morning:"Spend the first 15 minutes each morning on something that has no measurable outcome — reading, walking, sitting. Practice existing without producing.",weekly:"Identify one achievement from this week that no one knows about. Sit with the satisfaction of that, completely separate from external recognition.",intellectual:"Ask yourself once per day: what would I do today if no one was watching? Let that answer guide at least one decision."},
  "4":{morning:"Begin each morning with three sentences in a journal — one observation about the present moment, one feeling, one intention. Ground the depth in the day.",weekly:"Each week, complete one task that you find mundane but meaningful. Notice how ordinary execution is itself a creative act.",intellectual:"When you feel the pull toward intensity or drama, pause for 90 seconds. Ask: is this real, or is this familiar? Distinguish between depth and noise."},
  "5":{morning:"Share one piece of knowledge — a thought, an article, a perspective — with another person before 10am each morning. Build the habit of intellectual generosity before the day pulls you inward.",weekly:"Choose one insight from your private research this week and share it publicly — in a meeting, in writing, in conversation. What you know becomes more valuable when given away.",intellectual:"Choose one piece of information daily to analyse for deeper meaning. But set a timer: 20 minutes of analysis, then a decision. Practice converting insight into action."},
  "6":{morning:"Each morning before the day begins, make one decision entirely from your own instinct without seeking external validation. Record the outcome. Build your personal evidence base for self-trust.",weekly:"Every Sunday, identify one moment this week where you trusted your gut over conventional wisdom. Celebrate that act of internal authority.",intellectual:"Practice distinguishing between caution and fear. Once per day, ask: am I being careful or am I being afraid? The answer points to the action required."},
  "7":{morning:"Each morning, choose one thing and commit to engaging with it for the full day without pivoting. This single-channel focus is the practice that transforms your enthusiasm into depth.",weekly:"Each week, review your unfinished projects. Choose one to complete before starting anything new. Completion is a muscle — build it deliberately.",intellectual:"When you feel the pull toward a new idea, write it down and return to it in 72 hours. Ideas that survive the delay deserve your attention. Most will not need it."},
  "8":{morning:"Begin each day by identifying one person you will invest in today — not manage, not direct, but genuinely invest in. Ask them one real question and listen without agenda.",weekly:"Each week, share one uncertainty, one doubt, or one open question with someone you trust. Build the muscle of strategic vulnerability before you need it.",intellectual:"Ask yourself once per day: what am I trying to control today that does not require my control? Release one thing. Notice what improves."},
  "9":{morning:"Begin each morning by stating three opinions that are entirely your own. Say them out loud. This daily act of self-assertion builds the muscle your growth requires.",weekly:"Each week, identify one situation where you withheld your perspective to keep the peace. Ask: what would have happened if you had spoken? Build your evidence that your voice adds, not disrupts.",intellectual:"When you notice yourself going along with a decision you disagree with, pause and say: I want to think about this a moment. That single act of presence is your most powerful growth practice."}
};

// ═══════════════════════════════════════════════════
// RESUME CAREER INTELLIGENCE PARSER
// ═══════════════════════════════════════════════════
function parseCareerContext(text) {
  const t = text.toLowerCase();
  // Detect career level
  let level = "professional";
  if (/director|vp |vice president|partner|chief|c-suite|principal/.test(t)) level = "executive";
  else if (/manager|senior|lead |head of|associate director/.test(t)) level = "senior";
  else if (/analyst|associate|assistant|junior|graduate/.test(t)) level = "early";

  // Detect industry
  let industry = "general";
  if (/audit|assurance|pwc|ey |kpmg|deloitte|big 4/.test(t)) industry = "Big 4 Audit";
  else if (/bank|capital market|asset management|fund|investment|trading/.test(t)) industry = "Financial Services";
  else if (/tech|software|engineer|developer|product|saas/.test(t)) industry = "Technology";
  else if (/consult|advisory|strategy|mckinsey|bain|bcg/.test(t)) industry = "Consulting";
  else if (/health|hospital|medical|pharma|clinical/.test(t)) industry = "Healthcare";
  else if (/legal|law|litigation|compliance|regulatory/.test(t)) industry = "Legal & Compliance";
  else if (/market|brand|content|social media|pr |communications/.test(t)) industry = "Marketing & Comms";

  // Detect key skills from resume
  const skills = [];
  const skillMap = [
    [/ifrs|isa |gaap|accounting standard/,"IFRS/ISA/GAAP"],
    [/data analytic|alteryx|tableau|power bi|python|sql/,"Data Analytics"],
    [/risk management|internal control|risk framework/,"Risk Management"],
    [/stakeholder|client relationship|client management/,"Client Relationship Management"],
    [/project management|pmp|agile|scrum/,"Project Management"],
    [/financial model|valuation|dcf|lbo/,"Financial Modelling"],
    [/digital transform|automation|ai |machine learning/,"Digital Transformation"],
    [/esg|sustainability|climate risk/,"ESG & Sustainability"],
    [/team lead|mentoring|coaching|people management/,"Team Leadership"],
    [/international|cross-border|global|multi-jurisd/,"International Exposure"]
  ];
  skillMap.forEach(([rx, label]) => { if (rx.test(t)) skills.push(label); });

  // Detect career trajectory keywords
  const hasMultipleFirms = (t.match(/\b(ey|pwc|kpmg|deloitte|accenture|mckinsey|bain|bcg)\b/g)||[]).length > 1;
  const hasInternational = /central asia|kyrgyz|pakistan|australia|london|new york|singapore|dubai|hong kong/.test(t);
  const hasAcademic = /phd|masters|mba|acca|cpa|ca |cfa |certif/.test(t);

  // Career archetype
  let archetype = "The Technical Expert";
  let archetypeDesc = "Deep domain expertise is your primary competitive advantage. You are the person others come to when the problem is genuinely complex.";
  if (level === "executive") { archetype = "The Institutional Leader"; archetypeDesc = "You operate at the intersection of strategy and governance, making decisions that define organisational direction."; }
  else if (level === "senior" && hasInternational) { archetype = "The Global Practitioner"; archetypeDesc = "You have demonstrated that your skills transcend geography — a rare quality that opens doors to international leadership."; }
  else if (industry === "Big 4 Audit" && hasAcademic) { archetype = "The Governance Architect"; archetypeDesc = "You combine technical rigour with the ethical authority to set standards others must follow."; }

  // Next career moves based on detected context
  const nextMoves = [];
  if (industry === "Big 4 Audit" && level === "senior") {
    nextMoves.push({title:"Digital Audit Leader",desc:"Lead your firm's integration of data analytics and AI into audit methodology — the role that will define the next generation of assurance."});
    nextMoves.push({title:"Chief Risk Officer — Fintech",desc:"Combine your traditional audit discipline with your technology exposure to lead risk strategy for a fast-growing financial technology company."});
    nextMoves.push({title:"Regulatory Policy Architect",desc:"Transition into a standards-setting body (AASB, IASB, APRA) where you help write the standards you currently audit — influencing the industry globally."});
  } else if (industry === "Financial Services") {
    nextMoves.push({title:"Head of Risk & Compliance",desc:"Lead the risk governance framework for a major financial institution, operating at the intersection of regulatory expertise and strategic leadership."});
    nextMoves.push({title:"Chief Financial Officer",desc:"Your technical depth in financial reporting and risk positions you naturally for the CFO role at a growth-stage institution."});
    nextMoves.push({title:"Global Forensic Consultant",desc:"Use your cross-border experience to investigate international financial discrepancies for NGOs, regulators, or intergovernmental bodies."});
  } else if (industry === "Technology") {
    nextMoves.push({title:"Head of Product",desc:"Your analytical precision combined with user-systems thinking positions you for product leadership at a scale-stage company."});
    nextMoves.push({title:"Technical Co-Founder",desc:"Your domain expertise is a startup thesis. Partner with a commercial co-founder and build the solution you know the industry needs."});
    nextMoves.push({title:"VP Engineering",desc:"Technical mastery paired with collaborative leadership — the combination that elite engineering organisations require at the top."});
  }
  if (!nextMoves.length) {
    nextMoves.push({title:"Senior Domain Expert",desc:"Deepen your specialisation and build a personal brand around a specific sub-field. Become the undisputed authority in your niche."});
    nextMoves.push({title:"Advisory & Consulting",desc:"Transition your expertise into advisory work — serving multiple organisations with the depth you have built in one."});
    nextMoves.push({title:"Leadership Track",desc:"Step into formal people leadership. The skills that made you excellent individually become multiplied through a team."});
  }

  return {level, industry, skills: skills.slice(0, 6), archetype, archetypeDesc, nextMoves: nextMoves.slice(0, 3), hasInternational, hasMultipleFirms, hasAcademic};
}

// ═══════════════════════════════════════════════════
// NUMEROLOGY ENGINE
// ═══════════════════════════════════════════════════
function reduce(n){while(n>9&&n!==11&&n!==22&&n!==33)n=String(n).split("").reduce((a,d)=>a+(+d),0);return n;}
function lv(c){const v=[1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];const i=c.toUpperCase().charCodeAt(0)-65;return i>=0&&i<26?v[i]:0;}
function calcNums(name,dob){
  const d=new Date(dob),day=d.getDate(),mon=d.getMonth()+1,yr=d.getFullYear(),cy=new Date().getFullYear();
  const sum=s=>String(s).split("").reduce((a,x)=>a+(+x),0);
  const lp=reduce(sum(day)+sum(mon)+sum(yr)),bd=reduce(day),py=reduce(sum(day)+sum(mon)+sum(cy));
  const L=name.toUpperCase().replace(/[^A-Z]/g,"").split(""),V=["A","E","I","O","U"];
  const expr=reduce(L.reduce((a,c)=>a+lv(c),0)),soul=reduce(L.filter(c=>V.includes(c)).reduce((a,c)=>a+lv(c),0)),pers=reduce(L.filter(c=>!V.includes(c)).reduce((a,c)=>a+lv(c),0));
  const SIGNS=["Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius"],CUTS=[20,19,20,20,21,21,23,23,23,23,22,22],ELEM={Aries:"Fire",Taurus:"Earth",Gemini:"Air",Cancer:"Water",Leo:"Fire",Virgo:"Earth",Libra:"Air",Scorpio:"Water",Sagittarius:"Fire",Capricorn:"Earth",Aquarius:"Air",Pisces:"Water"};
  const sign=day<=CUTS[mon-1]?SIGNS[mon-1]:SIGNS[mon%12];
  return{lp,bd,py,expr,soul,pers,sign,element:ELEM[sign],birthYear:yr};
}

// ═══════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════
function scoreText(text){
  const t=text.toLowerCase();
  const count=words=>words.reduce((n,w)=>n+(t.split(w).length-1),0);
  const ocean={};
  Object.entries(OCEAN_KW).forEach(([d,kw])=>{const pos=count(kw.pos||[]),neg=count(kw.neg||[]),total=(kw.pos||[]).length+(kw.neg||[]).length,raw=(pos-neg*0.6)/Math.max(total*0.15,1);ocean[d]=Math.min(97,Math.max(18,Math.round(50+raw*8)));});
  const ennScores={};Object.entries(ENN_KW).forEach(([type,kw])=>{ennScores[type]=count(kw);});
  const ennType=Object.entries(ennScores).sort((a,b)=>b[1]-a[1])[0][0];
  const discScores={};Object.entries(DISC_KW).forEach(([s,kw])=>{discScores[s]=count(kw);});
  const discDom=Object.entries(discScores).sort((a,b)=>b[1]-a[1])[0][0];
  const discLabels={D:"Dominant",I:"Influential",S:"Steady",C:"Conscientious"};
  const ei=ocean.E>=53?"E":"I",ns=ocean.O>=54?"N":"S",tf=ocean.A>=52?"F":"T",jp=ocean.C>=56?"J":"P";const ennSorted=Object.entries(ennScores).sort((a,b)=>b[1]-a[1]);const ennType2=ennSorted[1]?.[0]||null;const ennRawScores=Object.fromEntries(ennSorted.map(([k,v])=>[k,v]));
  return{ocean,ennType,ennType2,ennRawScores,discDom,discLabel:discLabels[discDom],mbti:ei+ns+tf+jp};
}

// ═══════════════════════════════════════════════════
// FULL REPORT BUILDER
// ═══════════════════════════════════════════════════
function buildReport(name,role,bg,resumeText,nums){
  const combined=[name,role,bg,resumeText].filter(Boolean).join(" ");
  const scores=scoreText(combined);
  const{ocean,ennType,discDom,discLabel,mbti}=scores;
  const mbtiData=MBTI_MAP[mbti]||MBTI_MAP["ISTJ"];
  const ennData=ENN_DATA[ennType];
  const lpData=nums?LP_DATA[nums.lp]||LP_DATA[1]:null;
  const elemData=nums?ELEM_DATA[nums.element]:null;
  const careerCtx=resumeText?parseCareerContext(resumeText):parseCareerContext(combined);

  const archetypes={INTJ:"The Strategic Visionary",INTP:"The Analytical Inventor",ENTJ:"The Executive Architect",ENTP:"The Disruptive Thinker",INFJ:"The Principled Idealist",INFP:"The Authentic Creator",ENFJ:"The Inspiring Leader",ENFP:"The Passionate Connector",ISTJ:"The Grounded Executor",ISFJ:"The Loyal Guardian",ESTJ:"The Decisive Organiser",ESFJ:"The Caring Facilitator",ISTP:"The Pragmatic Craftsman",ISFP:"The Quiet Innovator",ESTP:"The Bold Opportunist",ESFP:"The Energetic Connector"};
  const headline=archetypes[mbti]||"The Analytical Professional";
  const traits=[];if(ocean.C>=70)traits.push("precision");if(ocean.E>=65)traits.push("leadership");if(ocean.O>=65)traits.push("vision");if(ocean.A>=65)traits.push("empathy");if(ocean.N<=35)traits.push("resilience");
  const tagline=traits.length>0?`${traits.slice(0,2).join(" and ")} — a ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy${nums?" and "+nums.element+" element":""}`:(`A ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy`);
  const summary=name+" is a "+mbtiData[0]+": "+mbtiData[1].toLowerCase()+" As a "+ennData.name+", their core drive centres on "+ennData.core.toLowerCase().replace("motivated by ","")+"."+( careerCtx.industry!=="general"?" Within the "+careerCtx.industry+" sector, this translates to the "+careerCtx.archetype+" archetype: "+careerCtx.archetypeDesc:"");
  const oceanText={O:ocean.O>=65?"High openness signals orientation toward strategy, innovation, and systems thinking over routine execution.":ocean.O>=50?"Balanced openness — creative thinking grounded in practicality; adapts ideas to real-world constraints.":"Preference for proven methods; consistency and reliability over experimentation.",C:ocean.C>=70?"Exceptional conscientiousness — rarely misses a detail; work product is immaculate and delivery is consistent.":ocean.C>=55?"Strong discipline; sets high standards and reliably meets them under pressure.":"Flexible and adaptive; thrives in dynamic environments that reward agility over process.",E:ocean.E>=65?"High extraversion — energised by people, leadership, and public-facing roles; a natural front-person.":ocean.E>=45?"Balanced; equally effective collaborating or working independently depending on context.":"Introversion-leaning — does best work in deep focus; prefers meaningful depth over broad social networks.",A:ocean.A>=65?"Highly collaborative; builds genuine trust and consensus without losing strategic direction.":ocean.A>=45?"Direct yet cooperative; holds positions under pressure without becoming combative.":"Task-focused; prioritises outcomes over harmony — effective where results matter more than relationships.",N:ocean.N<=35?"Emotionally stable under pressure — a calming anchor for teams in high-stakes situations.":ocean.N<=50?"Generally composed with a healthy attentiveness to risk and consequence.":"Emotionally attuned — this awareness of risk is a professional asset in compliance and advisory roles."};

  const strengths=[];if(ocean.C>=70)strengths.push("Meticulous attention to detail and quality");if(ocean.C>=60)strengths.push("Disciplined planning and consistent execution");if(ocean.E>=60)strengths.push("Natural ability to lead and influence teams");if(ocean.O>=60)strengths.push("Strategic thinking and creative problem-solving");if(ocean.A>=60)strengths.push("Builds genuine trust and loyalty with people");if(ocean.N<=40)strengths.push("Stays clear and decisive under high pressure");if(careerCtx.hasInternational)strengths.push("Cross-cultural and international competency");if(careerCtx.skills.includes("Data Analytics"))strengths.push("Data-driven analytical and insight capability");if(careerCtx.skills.includes("Client Relationship Management"))strengths.push("Strong client and stakeholder relationship management");

  const blindSpots={ISTJ:"Tendency to rely on precedent — may resist beneficial change that lacks historical justification.",INTJ:"May communicate with insufficient warmth — technical brilliance can overshadow people-first leadership.",ENTJ:"Pace of execution can outrun team capacity — slowing down occasionally improves outcome quality.",INTP:"Analysis can delay action — perfect information rarely exists; confident decisions beat paralysis.",ESTJ:"Rigidity under pressure — when rules conflict with reality, flexibility creates better outcomes.",ENFJ:"Over-investment in others growth — sustainable impact requires protecting your own energy first."};
  const blind=blindSpots[mbti]||"Depth of expertise can create blind spots about adjacent skills that unlock the next career level.";
  const wealth=WEALTH_DATA[discDom]||WEALTH_DATA["C"];
  const cy=new Date().getFullYear();
  const roadmap=[{y:String(cy),t:"Consolidate",a:"Deepen mastery in your core domain. Become the undisputed expert in your immediate team before expanding scope."},{y:String(cy+1),t:"Lead",a:"Step into formal leadership. Manage engagements, mentor juniors, and build your external brand through writing or speaking."},{y:String(cy+2),t:"Diversify",a:"Explore adjacent opportunities — board advisory, consulting, digital transformation, or sector specialisation."}];
  const growth=[ocean.E<55?"Build visibility — your expertise deserves a larger audience. Write, speak, or post consistently.":"Delegate more deeply — your growth ceiling is the size of the team you can develop.",ocean.O<55?"Experiment with one unconventional approach per quarter — innovation is a muscle, not a talent.":"Channel creative energy into fewer, deeper bets — breadth dilutes impact below a threshold."];
  const quotes={"1":"The standard you walk past is the standard you accept — and no standard is too high when it matters.","2":"The greatest leaders are remembered not for what they built, but for who they built it with.","3":"Success is not the destination. It is the habit of people who refused to stop showing up.","4":"Ordinary done with extraordinary care becomes the rarest thing in the world.","5":"The map is not the territory — but the person who draws the most accurate map changes how everyone else moves.","6":"Trust is not given or taken. It is built, brick by brick, in the moments that do not feel important.","7":"The life well-lived is not the one with the most experiences, but the one most fully experienced.","8":"Power is not the ability to command. It is the wisdom to know when to stand still.","9":"Peace is not the absence of conflict. It is the presence of someone who refuses to add to it."};
  const quote=quotes[ennType]||"Integrity is not what you do when others are watching. It is what you do when they are not.";
  const commStyle=COMM_STYLE[mbti]||"Prefers clear, direct communication with sufficient context.";

  // Life Journey phases
  const lifeJourney=nums?buildLifeJourney(nums.birthYear,cy,careerCtx):null;

  // New sections
  const soulPurpose=nums?SOUL_PURPOSE[nums.lp]||SOUL_PURPOSE[1]:null;
  const relData=nums?RELATIONSHIP_DATA[nums.element]:null;
  const roleModels=nums?ROLE_MODELS[nums.element]:null;
  const dailyProtocol=DAILY_PROTOCOL[ennType]||DAILY_PROTOCOL["1"];
  const decisionTiming=nums?elemData:null;
  const wealthPsych=wealth;
  const numSynthesis=nums&&lpData?("Life Path "+nums.lp+" ("+lpData.name+") "+(nums.element==="Earth"||ocean.C>=65?"reinforces":"complements")+" the "+mbtiData[0]+" profile — both demand "+(nums.element==="Earth"||ocean.C>=65?"structure, precision, and long-term thinking.":"impact, meaning, and transformative contribution.")+" Personal Year "+nums.py+": "+({1:"new beginnings — plant seeds now",2:"nurture relationships and partnerships",3:"express, create, and communicate",4:"build foundations and systems",5:"embrace change and new experiences",6:"serve, lead, and take responsibility",7:"reflect, study, and seek depth",8:"harvest career results and financial rewards",9:"complete old cycles and release what no longer serves"})[nums.py]||"a year of significant transition"):"";

  return{headline,tagline,summary,ocean,oceanText,mbti,mbtiData,ennType,ennData,ennType2,ennRawScores,discDom,discLabel,strengths:strengths.slice(0,5),blind,wealthPsych,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData,name,careerCtx,soulPurpose,relData,roleModels,dailyProtocol,decisionTiming,lifeJourney};
}

function buildLifeJourney(birthYear,cy,careerCtx){
  const phases=[];
  const startYear=birthYear+22; // typical career start
  // Foundation phase
  phases.push({year:String(startYear)+" – "+String(startYear+3),title:"Foundation Phase",icon:"◎",desc:"The entry point into your professional identity. The skills, habits, and standards set in this window establish the baseline from which all subsequent growth compounds."});
  if(careerCtx.hasMultipleFirms){phases.push({year:String(startYear+3)+" – "+String(startYear+6),title:"Expansion Phase",icon:"◈",desc:"Cross-institutional exposure broadened your technical range and professional network. Each firm added a layer of perspective unavailable within a single organisation."});}
  if(careerCtx.hasInternational){phases.push({year:"International Transition",title:"Global Expansion",icon:"◆",desc:"Relocating jurisdictions was a decisive act of professional ambition. It reset your ceiling and demonstrated that your skills transcend geography — a rare and compounding advantage."});}
  phases.push({year:String(cy-1)+" – "+String(cy),title:"Integration & Authority",icon:"●",desc:"You are currently establishing your reputation in your current market. This phase is about depth over breadth — becoming the trusted expert rather than the newest arrival."});
  phases.push({year:String(cy+1)+" – "+String(cy+3),title:"Leadership Threshold",icon:"◐",desc:"The natural next phase involves transitioning from technical contributor to engagement architect. Your value shifts from what you can do personally to what you can enable in others."});
  phases.push({year:String(cy+4)+" – "+String(cy+7),title:"The Master Builder Era",icon:"★",desc:"At this horizon, you will operate as a Master of Governance — whether within a major firm, in an executive role, or as a independent advisor shaping the field from the outside."});
  return phases;
}

// ═══════════════════════════════════════════════════
// RADAR CHART
// ═══════════════════════════════════════════════════
function RadarChart({ocean}){
  const dims=["O","C","E","A","N"],labels=["Open","Consc","Extra","Agree","Stable"],colors=["#7C9CBF","#C9A84C","#7DBF8A","#C97A7A","#B07DBF"];
  const cx=110,cy=110,r=75,n=dims.length;
  const angle=i=>(Math.PI*2*(i/n))-Math.PI/2;
  const pt=(i,val)=>{const a=angle(i),pct=val/100;return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)];};
  const polyPoints=dims.map((d,i)=>pt(i,ocean[d])).map(p=>p.join(",")).join(" ");
  return(
    <svg viewBox="0 0 220 220" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto"}}>
      {[0.25,0.5,0.75,1].map(pct=>{const pts=dims.map((_,i)=>{const a=angle(i);return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)].join(",")}).join(" ");return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>;})}
      {dims.map((_,i)=>{const[x,y]=pt(i,1);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>;;})}
      <polygon points={polyPoints} fill="rgba(201,168,76,0.12)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
      {dims.map((d,i)=>{const[x,y]=pt(i,ocean[d]);return <circle key={d} cx={x} cy={y} r="4" fill={colors[i]}/>;;})}
      {dims.map((d,i)=>{const a=angle(i),lx=cx+(r+22)*Math.cos(a),ly=cy+(r+22)*Math.sin(a);return <text key={d} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={colors[i]} fontFamily="DM Sans,sans-serif" fontWeight="500">{labels[i]}</text>;})}
    </svg>
  );
}

function ScoreRing({value,color,label}){
  const r=20,circ=2*Math.PI*r,dash=(value/100)*circ;
  return(
    <div style={{textAlign:"center"}}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"/>
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={dash+" "+(circ-dash)} strokeLinecap="round" transform="rotate(-90 26 26)"/>
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={color} fontFamily="DM Sans,sans-serif">{value}</text>
      </svg>
      <div style={{fontSize:8,color:"#3e5464",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{label}</div>
    </div>
  );
}

async function extractText(file){
  return new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=e=>{
      if(file.type==="text/plain"){resolve(new TextDecoder().decode(e.target.result).slice(0,5000));return;}
      const raw=new TextDecoder("latin1").decode(new Uint8Array(e.target.result));
      const m=raw.match(/\(([^)]{2,200})\)/g)||[];
      resolve(m.map(x=>x.slice(1,-1)).filter(x=>/[a-zA-Z]{3,}/.test(x)).join(" ").slice(0,5000));
    };
    reader.readAsArrayBuffer(file);
  });
}

function analyseCompatibility(r1,r2){
  const{ocean:o1,mbti:m1,ennType:e1,discDom:d1}=r1;const{ocean:o2,mbti:m2,ennType:e2,discDom:d2}=r2;
  const oDiff=Math.abs(o1.O-o2.O),cDiff=Math.abs(o1.C-o2.C),eDiff=Math.abs(o1.E-o2.E),aDiff=Math.abs(o1.A-o2.A);
  const oceanScore=Math.round(100-((oDiff+cDiff+eDiff+aDiff)/4)*0.7);
  const mbtiPairs={INTJ:["ENFP","ENTP"],INTP:["ENTJ","ENFJ"],ENTJ:["INTP","INFP"],ENTP:["INFJ","INTJ"],INFJ:["ENTP","ENFP"],INFP:["ENTJ","ENFJ"],ENFJ:["INFP","INTP"],ENFP:["INFJ","INTJ"],ISTJ:["ESFP","ESTP"],ISFJ:["ESTP","ESFP"],ESTJ:["ISFP","ISTP"],ESFJ:["ISTP","ISFP"],ISTP:["ESTJ","ESFJ"],ISFP:["ESTJ","ESFJ"],ESTP:["ISFJ","ISTJ"],ESFP:["ISFJ","ISTJ"]};
  const mbtiMatch=!!(mbtiPairs[m1]?.includes(m2)||mbtiPairs[m2]?.includes(m1));
  const mbtiScore=mbtiMatch?90:m1===m2?70:62;
  const ennGood={"1":["7","9"],"2":["4","8"],"3":["6","9"],"4":["2","9"],"5":["1","7"],"6":["9","3"],"7":["5","1"],"8":["2","4"],"9":["3","6"]};
  const ennMatch=!!(ennGood[e1]?.includes(e2)||ennGood[e2]?.includes(e1));
  const ennScore=ennMatch?88:e1===e2?65:72;
  const discComp={D:["C","S"],I:["S","C"],S:["I","D"],C:["D","I"]};
  const discMatch=!!(discComp[d1]?.includes(d2));
  const discScore=discMatch?85:d1===d2?60:70;
  const overall=Math.round(oceanScore*0.35+mbtiScore*0.25+ennScore*0.25+discScore*0.15);
  const synergies=[],tensions=[];
  if(eDiff<15)synergies.push("Matched social energy — neither drains nor overwhelms the other");
  if(aDiff<15)synergies.push("Similar communication warmth — rarely misread each other's tone");
  if(mbtiMatch)synergies.push("Complementary cognitive styles — one generates, the other refines");
  if(ennMatch)synergies.push("Enneagram compatibility — growth paths naturally support each other");
  if(discMatch)synergies.push("DISC complementarity — different strengths that combine without competing");
  if(eDiff>25)tensions.push("Social energy mismatch — one needs more time alone, the other more together");
  if(Math.abs(o1.C-o2.C)>25)tensions.push("Structure vs flexibility — different needs around planning and consistency");
  if(d1===d2&&d1==="D")tensions.push("Both Dominant — power struggles possible; clear role boundaries needed");
  if(e1===e2)tensions.push("Same Enneagram type — share blind spots and can reinforce each other's shadow");
  return{overall,oceanScore,mbtiScore,ennScore,discScore,synergies,tensions,label:overall>=85?"Exceptional":overall>=75?"Strong":overall>=65?"Compatible":"Complementary"};
}

// ═══════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════
const GOLD = "#C9A84C";
const DARK_THEME = {
  G:GOLD, DK:"#090E15", D2:"#0E1720", D3:"#131F2D", D4:"#1A2B3C",
  BR:"rgba(255,255,255,0.07)", TX:"#F0EAD6", DM:"#7a8fa0", FA:"#2e4050",
  pageBackground:"#090E15", cardBackground:"#0E1720", inputBackground:"#090E15",
  bodColor:"#8aabbb", sectionBorder:"rgba(255,255,255,0.07)", shadow:"0 32px 80px rgba(0,0,0,0.6)",
  navInactive:"#131F2D", roleModelBg:"#090E15"
};
const LIGHT_THEME = {
  G:GOLD, DK:"#F8F6F1", D2:"#FFFFFF", D3:"#F0EDE6", D4:"#E8E4DA",
  BR:"rgba(0,0,0,0.08)", TX:"#1a1a1a", DM:"#6b7280", FA:"#9ca3af",
  pageBackground:"#F0EDE6", cardBackground:"#FFFFFF", inputBackground:"#F8F6F1",
  bodColor:"#444", sectionBorder:"rgba(0,0,0,0.07)", shadow:"0 16px 48px rgba(0,0,0,0.1)",
  navInactive:"#F0EDE6", roleModelBg:"#F8F6F1"
};

// ═══════════════════════════════════════════════════
// DATA STORAGE HELPERS (anonymous, consent-gated)
// ═══════════════════════════════════════════════════
function saveAnonymousReport(report) {
  try {
    const anon = {
      ts: Date.now(),
      mbti: report.mbti,
      ennType: report.ennType,
      discDom: report.discDom,
      ocean: report.ocean,
      element: report.nums?.element || null,
      lp: report.nums?.lp || null,
    };
    const existing = JSON.parse(localStorage.getItem("pie_reports") || "[]");
    existing.push(anon);
    // Keep last 50 reports
    if (existing.length > 50) existing.shift();
    localStorage.setItem("pie_reports", JSON.stringify(existing));
  } catch(e) { /* storage unavailable */ }
}
function clearStoredData() {
  try { localStorage.removeItem("pie_reports"); } catch(e) {}
}
const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};


// ═══════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════
export default function App(){
  // ── 1. THEME ────────────────────────────────────
  const[dark,setDark]=useState(true);
  const T=dark?DARK_THEME:LIGHT_THEME;
  const{G,DK,D2,D3,BR,TX,DM,FA}=T;

  // ── 2. ALL STATE (hooks must come first) ─────────
  const[mode,setMode]=useState("main");
  const[stage,setStage]=useState("form");
  const[name,setName]=useState("");
  const[dob,setDob]=useState("");
  const[role,setRole]=useState("");
  const[bg,setBg]=useState("");
  const[file,setFile]=useState(null);
  const[rText,setRText]=useState("");
  const[report,setReport]=useState(null);
  const[error,setError]=useState(null);
  const[consent,setConsent]=useState(false);
  const[industryAnswers,setIndustryAnswers]=useState({});
  const[linkedinUrl,setLinkedinUrl]=useState("");
  const[linkedinPaste,setLinkedinPaste]=useState("");
  const[showLinkedin,setShowLinkedin]=useState(false);
  const[copied,setCopied]=useState(false);
  const[copiedId,setCopiedId]=useState(null);
  const[loading,setLoading]=useState(false);
  const[loadStep,setLoadStep]=useState(0);
  const[collapsed,setCollapsed]=useState({});
  const[rating,setRating]=useState(0);
  const[ratingDone,setRatingDone]=useState(false);
  const[activeSection,setActiveSection]=useState(0);
  const[c1,setC1]=useState({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});
  const[c2,setC2]=useState({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});
  const[compat,setCompat]=useState(null);
  const fileRef=useRef(),cf1=useRef(),cf2=useRef();

  // ── 3. DERIVED VALUES ────────────────────────────
  let liveNums=null;
  if(name&&dob){try{liveNums=calcNums(name,dob);}catch{liveNums=null;}}
  const firstName=name?name.trim().split(" ")[0]:"";
  const detectedIndustry=detectIndustryQs(role,bg);
  const industryQs=detectedIndustry?INDUSTRY_QUESTIONS[detectedIndustry]:null;
  const formProgress=Math.min(4,[name,dob,role||bg,file||rText].filter(Boolean).length);

  // ── 4. STYLES (use T which is defined above) ─────
  const pg={minHeight:"100vh",background:T.pageBackground,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",fontFamily:"'DM Sans',system-ui,sans-serif"};
  const crd={background:T.cardBackground,border:"1px solid "+BR,borderRadius:20,padding:"40px 32px",width:"100%",maxWidth:560,boxShadow:T.shadow};
  const wid={background:T.cardBackground,border:"1px solid "+BR,borderRadius:20,padding:"0 0 40px",width:"100%",maxWidth:720,boxShadow:T.shadow};
  const lbl={display:"block",fontSize:9,color:G,letterSpacing:3,textTransform:"uppercase",marginBottom:6,marginTop:18};
  const inp={width:"100%",padding:"12px 14px",background:T.inputBackground,border:"1px solid "+BR,borderRadius:9,color:TX,fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"};
  const btnG={width:"100%",padding:"15px",background:"linear-gradient(135deg,#C9A84C,#9a7030)",color:"#090E15",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"};
  const bod={color:T.bodColor,fontSize:13,lineHeight:1.9};
  const hl={background:"rgba(201,168,76,0.07)",borderLeft:"3px solid #C9A84C",borderRadius:"0 8px 8px 0",padding:"12px 16px",marginTop:12};

  // ── 5. HELPER FUNCTIONS (can reference state) ────
  function buildExtraContext(){
    const parts=[];
    Object.values(industryAnswers).forEach(kw=>{if(kw)parts.push(kw);});
    if(linkedinPaste)parts.push(linkedinPaste);
    if(linkedinUrl)parts.push("linkedin professional profile");
    return parts.join(" ");
  }

  function toggleSection(key){setCollapsed(c=>({...c,[key]:!c[key]}));}

  function copyInsight(id,text){
    if(!text)return;
    navigator.clipboard.writeText(text).then(()=>{
      setCopiedId(id);setTimeout(()=>setCopiedId(null),1800);
    }).catch(()=>{});
  }

  function copyShareLink(){
    const shareData={n:name,d:dob,r:role,b:bg,li:linkedinUrl||"",autoGen:true};
    const hash=encodeShare(shareData);
    if(!hash)return;
    const url=window.location.origin+window.location.pathname+"#"+hash;
    navigator.clipboard.writeText(url)
      .then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);})
      .catch(()=>{try{prompt("Copy this link:",url);}catch{}});
  }

  function reset(){
    setStage("form");setName("");setDob("");setRole("");setBg("");
    setFile(null);setRText("");setReport(null);setError(null);
    setConsent(false);setIndustryAnswers({});setLinkedinUrl("");
    setLinkedinPaste("");setShowLinkedin(false);setCopied(false);
    setCopiedId(null);setLoading(false);setLoadStep(0);
    setCollapsed({});setRating(0);setRatingDone(false);setActiveSection(0);
    try{window.history.replaceState(null,null,window.location.pathname);}catch{}
  }

  function runCompat(){
    if(!c1.name||!c2.name)return;
    try{
      const n1=(c1.name&&c1.dob)?calcNums(c1.name,c1.dob):null;
      const n2=(c2.name&&c2.dob)?calcNums(c2.name,c2.dob):null;
      const r1=buildReport(c1.name,c1.role,c1.bg,c1.rText,n1);
      const r2=buildReport(c2.name,c2.role,c2.bg,c2.rText,n2);
      setC1(p=>({...p,report:r1}));setC2(p=>({...p,report:r2}));
      setCompat(analyseCompatibility(r1,r2));setStage("compat");
    }catch(e){console.error(e);}
  }

  // ── 6. URL HASH (useEffect after all state) ──────
  useEffect(()=>{
    const hash=window.location.hash.slice(1);
    if(!hash)return;
    const data=decodeShare(hash);
    if(!data||!data.n)return;
    setName(data.n||"");setDob(data.d||"");setRole(data.r||"");setBg(data.b||"");setLinkedinUrl(data.li||"");
    if(data.autoGen){
      try{
        const nums=(data.n&&data.d)?calcNums(data.n,data.d):null;
        const r=buildReport(data.n,data.r||"",data.b||"","",nums);
        setReport(r);setStage("report");
      }catch(e){console.error("Auto-gen error:",e);}
    }
  },[]);

  // ── 7. GENERATE (with robust error handling) ─────
  const LOAD_STEPS=["Parsing your profile...","Scoring OCEAN dimensions...","Deriving MBTI from Big Five...","Matching Enneagram patterns...","Calculating numerology...","Building career insights...","Your report is ready ✓"];

  function generate(){
    if(!name)return;
    setLoading(true);setLoadStep(0);setError(null);
    let step=0;
    const timer=setInterval(()=>{
      step++;
      setLoadStep(step);
      if(step>=LOAD_STEPS.length-1){
        clearInterval(timer);
        try{
          const nums=(name&&dob)?calcNums(name,dob):null;
          const extra=buildExtraContext();
          const r=buildReport(name,role||"",bg||"",(rText||"")+" "+(extra||""),nums);
          if(!r)throw new Error("buildReport returned null");
          setReport(r);
          try{
            if(consent)saveAnonymousReport(r);
            const hash=encodeShare({n:name,d:dob,r:role,b:bg,li:linkedinUrl||""});
            if(hash)window.history.replaceState(null,null,"#"+hash);
          }catch{}
          setTimeout(()=>{setLoading(false);setStage("report");},500);
        }catch(err){
          console.error("Generation error:",err);
          setLoading(false);
          setError("Something went wrong: "+err.message+". Try adding more context about your role.");
          setStage("form");
        }
      }
    },380);
  }

  // ── 8. INNER COMPONENTS (after all state/functions) ──
  // These are defined here so they can access state via closure safely
  function Sec({id,title,sub,children,copyText}){
    const isCollapsed=!!collapsed[id||title];
    return(
      <div id={id?`sec-${id}`:undefined} style={{marginBottom:24,borderBottom:"1px solid "+BR,paddingBottom:isCollapsed?0:22}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,cursor:"pointer"}} onClick={()=>id&&toggleSection(id)}>
          <span style={{fontSize:9,letterSpacing:3,color:G,textTransform:"uppercase",flex:1}}>
            {title}{sub&&<span style={{color:FA,letterSpacing:0,textTransform:"none",fontSize:10,fontWeight:400}}> — {sub}</span>}
          </span>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {copyText&&<button onClick={e=>{e.stopPropagation();copyInsight(id||title,copyText);}} style={{background:"transparent",border:"1px solid "+BR,borderRadius:4,padding:"2px 7px",fontSize:9,color:copiedId===(id||title)?G:FA,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {copiedId===(id||title)?"✓ Copied":"Copy"}
            </button>}
            {id&&<span style={{fontSize:10,color:FA,display:"inline-block",transform:isCollapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</span>}
          </div>
        </div>
        {!isCollapsed&&children}
      </div>
    );
  }

  function Tag({children,c}){
    return <span style={{background:T.inputBackground,border:"1px solid rgba(201,168,76,0.4)",color:c||G,fontSize:9,letterSpacing:1.5,padding:"4px 11px",borderRadius:20,textTransform:"uppercase"}}>{children}</span>;
  }

  function InfoCard({label,text,color,copyId}){
    const isCopied=copiedId===copyId;
    return(
      <div style={{background:T.inputBackground,borderRadius:9,padding:"12px 14px",borderLeft:"3px solid "+(color||G)}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
          <div style={{fontSize:9,color:color||G,letterSpacing:1.5,textTransform:"uppercase"}}>{label}</div>
          {copyId&&text&&<button onClick={()=>copyInsight(copyId,text)} style={{background:"transparent",border:"none",fontSize:9,color:isCopied?G:FA,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>{isCopied?"✓":"⎘"}</button>}
        </div>
        <p style={{...bod,fontSize:12,color:DM,margin:0}}>{text}</p>
      </div>
    );
  }

  // ── 9. UI HELPERS ─────────────────────────────────
  const ThemeBtn=()=>(
    <button onClick={()=>setDark(d=>!d)} title={dark?"Light Mode":"Dark Mode"}
      style={{position:"fixed",top:16,right:16,background:T.cardBackground,border:"1px solid "+BR,borderRadius:40,width:40,height:40,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,boxShadow:T.shadow}}>
      {dark?"☀️":"🌙"}
    </button>
  );

  const Nav=()=>(
    <div style={{display:"flex",gap:4,marginBottom:24,background:T.inputBackground,borderRadius:10,padding:4}}>
      {[["main","Individual Report"],["compat","Compatibility"]].map(([m,l])=>(
        <button key={m} onClick={()=>{setMode(m);setStage("form");setError(null);}} style={{flex:1,padding:"9px",background:mode===m?"linear-gradient(135deg,#C9A84C,#9a7030)":T.navInactive,border:"none",borderRadius:8,color:mode===m?"#090E15":DM,fontSize:12,fontWeight:mode===m?600:400,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
      ))}
    </div>
  );

  // ── 10. LOADING SCREEN ────────────────────────────
  if(loading) return(
    <div style={{...pg,alignItems:"center"}}><ThemeBtn/>
      <div style={{...crd,textAlign:"center",padding:"52px 32px"}}>
        <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:28}}>Generating Report</div>
        <div style={{position:"relative",width:80,height:80,margin:"0 auto 28px"}}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke={dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"} strokeWidth="5"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke={G} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${(loadStep/Math.max(LOAD_STEPS.length-1,1))*213} 213`}
              transform="rotate(-90 40 40)" style={{transition:"stroke-dasharray 0.38s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:G,fontFamily:"'DM Sans',sans-serif"}}>
            {Math.round((loadStep/Math.max(LOAD_STEPS.length-1,1))*100)}%
          </div>
        </div>
        <div style={{maxWidth:280,margin:"0 auto"}}>
          {LOAD_STEPS.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,opacity:i<=loadStep?1:0.25,transition:"opacity 0.3s"}}>
              <div style={{width:16,height:16,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                background:i<loadStep?G:i===loadStep?"rgba(201,168,76,0.25)":dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"}}>
                {i<loadStep&&<span style={{fontSize:8,color:"#090E15",fontWeight:700}}>✓</span>}
                {i===loadStep&&<div style={{width:6,height:6,borderRadius:"50%",background:G}}/>}
              </div>
              <span style={{fontSize:11,color:i===loadStep?TX:FA,textAlign:"left"}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if(stage==="form") return(
    <div style={pg}><ThemeBtn/><div style={crd}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:12}}>Personal Intelligence Engine</div>
        <h1 style={{fontSize:38,color:TX,lineHeight:1.1,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300}}>Know Your<br/><em style={{color:G}}>True Self</em></h1>
        <p style={{fontSize:13,color:DM,lineHeight:1.7,marginTop:10}}>Big Five · MBTI · Enneagram · DISC · Numerology · Soul Purpose</p>
      </div>
      {error&&<div style={{background:"rgba(201,100,80,0.1)",border:"1px solid rgba(201,100,80,0.4)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:11,color:"#e07060",lineHeight:1.5}}>⚠ {error}</div>}

      {/* Progress Steps */}
      {mode==="main"&&<div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:8}}>
          {["Name","Birth date","Role","CV / Context"].map((s,i)=>{
            const done=i<formProgress,active=i===formProgress;
            return(
              <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:"none"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:done?G:active?"rgba(201,168,76,0.2)":T.inputBackground,border:`2px solid ${done||active?G:BR}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",fontSize:10,color:done?"#090E15":active?G:FA,fontWeight:700}}>
                    {done?"✓":i+1}
                  </div>
                  <span style={{fontSize:8,color:done||active?G:FA,marginTop:3,letterSpacing:0.5,whiteSpace:"nowrap"}}>{s}</span>
                </div>
                {i<3&&<div style={{flex:1,height:2,background:i<formProgress?G:BR,transition:"background 0.3s",marginBottom:14}}/>}
              </div>
            );
          })}
        </div>
      </div>}
      <Nav/>
      {mode==="main"&&<>
        <label style={lbl}>Your Full Name *</label>
        <input style={inp} placeholder="e.g. Muhammad Hammad" value={name} onChange={e=>setName(e.target.value)} autoFocus/>

        <label style={{...lbl,marginTop:18}}>
          {firstName?`${firstName}, when were you born?`:"Date of Birth"}
          <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — unlocks numerology, element, life journey</span>
        </label>
        <input style={inp} type="date" value={dob} onChange={e=>setDob(e.target.value)}/>

        {liveNums&&<div style={{background:T.inputBackground,borderRadius:10,padding:"12px 16px",marginTop:8,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center",border:"1px solid "+BR}}>
          {[["Life Path",liveNums.lp,G],["Expression",liveNums.expr,"#7C9CBF"],["Personal Year",liveNums.py,"#7DBF8A"]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:8,color:FA,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{l}</div></div>
          ))}
          <div style={{marginLeft:"auto",textAlign:"center"}}><div style={{fontSize:12,color:"#7DBF8A",fontWeight:500}}>{liveNums.element}</div><div style={{fontSize:9,color:FA}}>{liveNums.sign}</div></div>
        </div>}

        <label style={{...lbl,marginTop:18}}>{firstName?`${firstName}'s current role`:"Current Role"}</label>
        <input style={inp} placeholder="e.g. Assistant Manager, EY Melbourne" value={role} onChange={e=>setRole(e.target.value)}/>

        <label style={{...lbl,marginTop:18}}>
          {firstName?`A bit about ${firstName}'s background`:"Brief Context"}
          <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — optional</span>
        </label>
        <textarea style={{...inp,height:58,resize:"none"}} placeholder="6 years Big 4 audit, EY and PwC, IFRS specialist, building a side business..." value={bg} onChange={e=>setBg(e.target.value)}/>

        <label style={{...lbl,marginTop:18}}>
          Resume / CV
          <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — PDF or TXT, enables career-specific insights</span>
        </label>
        <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{setFile(e.target.files[0]);extractText(e.target.files[0]).then(setRText);}}/>
        <div onClick={()=>fileRef.current.click()} style={{background:T.inputBackground,border:"2px dashed "+(file?G:BR),borderRadius:10,padding:16,textAlign:"center",cursor:"pointer",marginBottom:12,transition:"border-color 0.2s"}}>
          {file?<><span style={{fontSize:14}}>✓ </span><span style={{color:G,fontSize:12,fontWeight:600}}>{file.name}</span><div style={{fontSize:10,color:FA,marginTop:2}}>Resume loaded — career section will be personalised</div></>:<><span style={{fontSize:18}}>📄</span><br/><span style={{color:FA,fontSize:12}}>Upload for career-specific insights (optional)</span></>}
        </div>

        {/* LinkedIn Import */}
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowLinkedin(s=>!s)} style={{width:"100%",padding:"10px 14px",background:T.inputBackground,border:"1px solid "+BR,borderRadius:9,color:DM,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
            <span style={{fontSize:14}}>🔗</span>
            <span>Import from LinkedIn <span style={{color:FA,fontSize:10}}>(optional — paste your About + Experience)</span></span>
            <span style={{marginLeft:"auto",color:FA}}>{showLinkedin?"▲":"▼"}</span>
          </button>
          {showLinkedin&&<div style={{background:T.inputBackground,border:"1px solid "+BR,borderRadius:"0 0 9px 9px",padding:"14px",marginTop:-1}}>
            <input style={{...inp,marginBottom:8,fontSize:12}} placeholder="LinkedIn profile URL (e.g. linkedin.com/in/yourname)" value={linkedinUrl} onChange={e=>setLinkedinUrl(e.target.value)}/>
            <p style={{fontSize:10,color:FA,lineHeight:1.6,marginBottom:8}}>
              💡 LinkedIn blocks direct fetching (CORS). To import your profile: open LinkedIn → copy your <strong style={{color:DM}}>About section + top 3 job descriptions</strong> → paste below. This improves career insight accuracy significantly.
            </p>
            <textarea style={{...inp,height:90,resize:"none",fontSize:11}} placeholder="Paste your LinkedIn About section and work experience here..." value={linkedinPaste} onChange={e=>setLinkedinPaste(e.target.value)}/>
            {linkedinPaste&&<p style={{fontSize:10,color:"#7DBF8A",marginTop:4}}>✓ {linkedinPaste.split(" ").length} words imported — career scoring will improve</p>}
          </div>}
        </div>

        {/* Industry-Specific Questions */}
        {industryQs&&(
          <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:12,border:"1px solid "+G.replace("#","rgba(").replace(/(..)(..)(..)$/,"$1,$2,$3,0.2)").replace("rgba(","rgba(")}}>
            <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>
              🎯 {industryQs.label} — Tailored Questions
            </div>
            <p style={{fontSize:10,color:FA,marginBottom:12,lineHeight:1.5}}>We detected your industry. Answer these to sharpen your report:</p>
            {industryQs.qs.map(q=>(
              <div key={q.id} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:TX,marginBottom:6,fontWeight:500}}>{q.q}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {q.opts.map(o=>(
                    <button key={o.l} onClick={()=>setIndustryAnswers(a=>({...a,[q.id]:a[q.id]===o.kw?"":o.kw}))}
                      style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+(industryAnswers[q.id]===o.kw?G:BR),background:industryAnswers[q.id]===o.kw?"rgba(201,168,76,0.12)":T.pageBackground,color:industryAnswers[q.id]===o.kw?G:DM,fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(industryAnswers).length>0&&<p style={{fontSize:10,color:G}}>✓ {Object.values(industryAnswers).filter(Boolean).length} answer{Object.values(industryAnswers).filter(Boolean).length!==1?"s":""} selected — report will be more specific</p>}
          </div>
        )}

        {/* Privacy note + Consent */}
        <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:16,border:"1px solid "+BR}}>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <span style={{fontSize:14,flexShrink:0}}>🔒</span>
            <p style={{fontSize:10,color:FA,lineHeight:1.6,margin:0}}>
              <strong style={{color:dark?"#4a9070":"#2a6a50"}}>Your data never leaves this browser.</strong> No servers, no accounts. Your CV is read once in JavaScript and discarded when you close the tab. The report is generated entirely locally.
            </p>
          </div>
          <div style={{height:"1px",background:BR,marginBottom:12}}/>
          <label style={{display:"flex",gap:10,cursor:"pointer",alignItems:"flex-start"}} onClick={()=>setConsent(c=>!c)}>
            <div style={{marginTop:2,flexShrink:0,width:16,height:16,borderRadius:4,border:"2px solid "+(consent?G:BR),background:consent?"rgba(201,168,76,0.15)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
              {consent&&<span style={{fontSize:10,color:G,fontWeight:700}}>✓</span>}
            </div>
            <span style={{fontSize:10,color:FA,lineHeight:1.65,userSelect:"none"}}>
              <strong style={{color:DM}}>Optional — help improve this engine.</strong> Store my anonymised personality patterns locally (MBTI, Enneagram, DISC, OCEAN scores only). Your name, date of birth, and CV are never saved. Data stays on your device. You can clear it anytime below.
              {consent&&<span style={{display:"block",marginTop:4,color:G,fontSize:9}}> ✓ Patterns will be saved locally when you generate your report.</span>}
            </span>
          </label>
          {consent&&<button onClick={(e)=>{e.stopPropagation();clearStoredData();alert("Stored data cleared.");}} style={{marginTop:8,fontSize:9,color:FA,background:"transparent",border:"none",cursor:"pointer",textDecoration:"underline",padding:0}}>Clear all stored data</button>}
        </div>

        <button style={{...btnG,opacity:name?1:0.35}} disabled={!name} onClick={generate}>
          {firstName?`Generate ${firstName}'s Report →`:"Generate Intelligence Report →"}
        </button>
      </>}

      {mode==="compat"&&<>
        <p style={{fontSize:12,color:DM,marginBottom:10,lineHeight:1.6}}>Enter two people to analyse personality compatibility — professionally and personally.</p>
        <p style={{fontSize:10,color:FA,marginBottom:16,lineHeight:1.6,background:T.inputBackground,padding:"8px 12px",borderRadius:8,border:"1px solid "+BR}}>
          💡 Add date of birth for both people to unlock element-based compatibility. Without DOB the analysis uses career and personality data only.
        </p>
        {[[c1,setC1,cf1,"Person 1"],[c2,setC2,cf2,"Person 2"]].map(([p,setter,ref,label])=>(
          <div key={label} style={{background:T.inputBackground,borderRadius:12,padding:16,marginBottom:12,border:"1px solid "+BR}}>
            <div style={{fontSize:10,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:14,fontWeight:600}}>{label}</div>

            <label style={{...lbl,marginTop:0}}>Full Name *</label>
            <input style={inp} placeholder="e.g. Ali Khan" value={p.name} onChange={e=>setter(x=>({...x,name:e.target.value}))}/>

            <label style={{...lbl}}>
              {p.name?p.name.split(" ")[0]+"'s date of birth":"Date of Birth"}
              <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — recommended</span>
            </label>
            <input style={inp} type="date" value={p.dob} onChange={e=>setter(x=>({...x,dob:e.target.value}))}/>
            {p.name&&p.dob&&(()=>{try{const n=calcNums(p.name,p.dob);return(<div style={{background:T.pageBackground,borderRadius:8,padding:"7px 12px",marginTop:6,display:"flex",gap:14}}><span style={{fontSize:10,color:G}}>LP {n.lp}</span><span style={{fontSize:10,color:"#7DBF8A"}}>{n.element}</span><span style={{fontSize:10,color:"#7C9CBF"}}>{n.sign}</span><span style={{fontSize:10,color:FA}}>PY {n.py}</span></div>);}catch{return null;}})()}

            <label style={{...lbl}}>
              Current Role
              <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — optional but improves accuracy</span>
            </label>
            <input style={inp} placeholder="e.g. Software Developer" value={p.role} onChange={e=>setter(x=>({...x,role:e.target.value}))}/>

            <label style={{...lbl}}>
              Resume
              <span style={{color:FA,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}> — optional</span>
            </label>
            <input ref={ref} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];extractText(f).then(t=>setter(x=>({...x,file:f,rText:t})));}}/>
            <div onClick={()=>ref.current.click()} style={{background:T.pageBackground,border:"1px dashed "+(p.file?G:BR),borderRadius:8,padding:10,textAlign:"center",cursor:"pointer",fontSize:11,color:p.file?G:FA}}>
              {p.file?"✓ "+p.file.name:"Upload Resume (optional)"}
            </div>
          </div>
        ))}
        <button style={{...btnG,marginTop:8,opacity:(c1.name&&c2.name)?1:0.35}} disabled={!c1.name||!c2.name} onClick={runCompat}>Analyse Compatibility →</button>
      </>}
    </div></div>
  );

  // ── COMPAT RESULT ────────────────────────────────
  if(stage==="compat"&&compat) return(
    <div style={pg}><ThemeBtn/><div style={crd}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:14}}>Compatibility Report</div>
        <h2 style={{fontSize:24,color:TX,fontFamily:"'Cormorant Garamond',serif",fontWeight:300,marginBottom:6}}>{c1.report.name} × {c2.report.name}</h2>
        <div style={{fontSize:52,fontWeight:700,color:G,lineHeight:1}}>{compat.overall}%</div>
        <div style={{fontSize:13,color:DM,marginTop:4}}>{compat.label} compatibility</div>
      </div>
      {c1.report.nums&&c2.report.nums&&(
        <div style={{background:T.inputBackground,borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",justifyContent:"space-around",border:"1px solid "+BR,alignItems:"center"}}>
          {[c1.report,c2.report].map((r,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:G,fontWeight:600,marginBottom:2}}>{r.name.split(" ")[0]}</div>
              <div style={{fontSize:10,color:"#7DBF8A"}}>{r.nums.element} · Life Path {r.nums.lp}</div>
              <div style={{fontSize:9,color:FA}}>{r.nums.sign}</div>
            </div>
          ))}
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:18,color:G}}>⟷</div>
            <div style={{fontSize:8,color:FA,marginTop:1,letterSpacing:1}}>element pairing</div>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:22}}>
        {[["OCEAN",compat.oceanScore,"#7C9CBF"],["MBTI",compat.mbtiScore,G],["Enn.",compat.ennScore,"#7DBF8A"],["DISC",compat.discScore,"#C97A7A"]].map(([l,v,c])=>(
          <div key={l} style={{background:T.inputBackground,borderRadius:10,padding:"12px 8px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:8,color:FA,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{l}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {[c1.report,c2.report].map((r,i)=>(
          <div key={i} style={{background:T.inputBackground,borderRadius:10,padding:14}}>
            <div style={{fontSize:11,color:G,fontWeight:600,marginBottom:5}}>{r.name}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>{[r.mbti,"E"+r.ennType,r.discLabel.slice(0,3),...(r.nums?[r.nums.element]:[])].map(t=><span key={t} style={{fontSize:9,color:DM,background:T.pageBackground,padding:"2px 7px",borderRadius:4}}>{t}</span>)}</div>
            <div style={{fontSize:10,color:FA,fontStyle:"italic"}}>{r.headline}</div>
          </div>
        ))}
      </div>
      {compat.synergies.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:9,color:"#7DBF8A",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Synergies</div>{compat.synergies.map((s,i)=><div key={i} style={{fontSize:12,color:"#7DBF8A",lineHeight:1.7,marginBottom:4}}>✓ {s}</div>)}</div>}
      {compat.tensions.length>0&&<div style={{marginBottom:18}}><div style={{fontSize:9,color:"#C97A7A",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Watch Out For</div>{compat.tensions.map((t,i)=><div key={i} style={{fontSize:12,color:"#C97A7A",lineHeight:1.7,marginBottom:4}}>△ {t}</div>)}</div>}
      <div style={hl}><p style={{...bod,fontSize:12}}><strong style={{color:G}}>Bottom line: </strong>{compat.overall>=85?"Exceptional pairing — complementary strengths with minimal friction. Rare and worth nurturing.":compat.overall>=75?"Strong compatibility. Minor tension areas are manageable with open communication.":compat.overall>=65?"Solid foundation — understanding each other's differences unlocks the full potential.":"Complementary but requires effort — the differences that create friction also create growth."}</p></div>
      <button style={{...btnG,marginTop:20}} onClick={()=>{setStage("form");setCompat(null);setC1({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});setC2({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});}}>Try Another Pair</button>
    </div></div>
  );

  // ── REPORT ───────────────────────────────────────
  if(stage==="report"&&report){
    const{headline,tagline,summary,ocean,oceanText,mbti,mbtiData,ennType,ennData,discLabel,strengths,blind,wealthPsych,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData,careerCtx,soulPurpose,relData,roleModels,dailyProtocol,decisionTiming,lifeJourney}=report;
    const headerBg=dark?"linear-gradient(160deg,#090E15 0%,#131F2D 100%)":"linear-gradient(160deg,#F0EDE6 0%,#E8E4DA 100%)";

    // TOC sections
    const TOC_ITEMS=[
      {id:"profile",label:"Who You Are"},
      {id:"ocean",label:"Big Five OCEAN"},
      {id:"mbti",label:"MBTI"},
      {id:"enneagram",label:"Enneagram"},
      {id:"comms",label:"Communication"},
      {id:"career",label:"Career"},
      {id:"roadmap",label:"Roadmap"},
      ...(nums?[{id:"numerology",label:"Numerology"}]:[]),
      ...(decisionTiming?[{id:"timing",label:"Decision Timing"}]:[]),
      ...(soulPurpose?[{id:"soul",label:"Soul Purpose"}]:[]),
      {id:"daily",label:"Daily Protocol"},
      {id:"wealth",label:"Wealth"},
      ...(relData?[{id:"relationships",label:"Relationships"}]:[]),
      ...(lifeJourney?[{id:"journey",label:"Life Journey"}]:[]),
      ...(roleModels?[{id:"rolemodels",label:"Role Models"}]:[]),
      {id:"growth",label:"Growth Edges"},
      {id:"methodology",label:"Methodology"},
    ];

    // mobile responsive grid helper
    const grid2={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8};
    const grid3={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:14};

    return(
      <div style={{...pg,position:"relative"}}>
        <ThemeBtn/>

        {/* Floating TOC — hidden on very small screens via width check */}
        <div style={{position:"fixed",left:8,top:"50%",transform:"translateY(-50%)",zIndex:50,display:"flex",flexDirection:"column",gap:3,maxHeight:"80vh",overflowY:"auto"}}>
          {TOC_ITEMS.map((item,i)=>(
            <button key={item.id} onClick={()=>{const el=document.getElementById("sec-"+item.id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});setActiveSection(i);}}
              style={{width:6,height:activeSection===i?24:8,borderRadius:3,background:activeSection===i?G:dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)",border:"none",cursor:"pointer",transition:"all 0.25s",padding:0,display:"block"}} title={item.label}/>
          ))}
        </div>

        <div style={wid}>
          {/* HEADER */}
          <div style={{background:headerBg,borderRadius:"20px 20px 0 0",padding:"clamp(32px,6vw,52px) clamp(16px,5vw,36px) 44px",textAlign:"center",borderBottom:"1px solid "+BR,marginBottom:28,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 40% 50%,rgba(201,168,76,0.05) 0%,transparent 60%)",pointerEvents:"none"}}/>
            <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:14}}>Personal Intelligence Report</div>
            <h1 style={{fontSize:"clamp(22px,5vw,28px)",color:TX,margin:"8px 0 6px",fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300}}>{name}</h1>
            <p style={{fontSize:16,color:G,fontStyle:"italic",margin:"0 0 6px",fontFamily:"'Cormorant Garamond',serif"}}>{headline}</p>
            <p style={{fontSize:12,color:DM,fontStyle:"italic",margin:"0 0 18px",lineHeight:1.6,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>{tagline}</p>
            <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:18}}>
              {[mbti,"Enneagram "+ennType,"DISC — "+discLabel,...(nums?["Life Path "+nums.lp,nums.element]:[]),...(careerCtx.industry!=="general"?[careerCtx.industry]:[])].map(t=><Tag key={t}>{t}</Tag>)}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:"clamp(8px,2vw,14px)",flexWrap:"wrap"}}>
              {Object.entries(ocean).map(([k,v])=>{
                const r=20,circ=2*Math.PI*r,dash=(v/100)*circ;
                return(
                  <div key={k} style={{textAlign:"center"}}>
                    <svg width="48" height="48" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r={r} fill="none" stroke={dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"} strokeWidth="4"/>
                      <circle cx="26" cy="26" r={r} fill="none" stroke={BC[k]} strokeWidth="4" strokeDasharray={dash+" "+(circ-dash)} strokeLinecap="round" transform="rotate(-90 26 26)"/>
                      <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={BC[k]} fontFamily="DM Sans,sans-serif">{v}</text>
                    </svg>
                    <div style={{fontSize:8,color:FA,letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{BL[k].slice(0,4)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{padding:"0 clamp(12px,4vw,28px)"}}>
            {/* Action Bar */}
            <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
              <button onClick={()=>printToPDF(report,dob)} style={{flex:"2 1 120px",padding:"12px",background:"linear-gradient(135deg,#C9A84C,#9a7030)",color:"#090E15",border:"none",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                ⬇ Download PDF
              </button>
              <button onClick={copyShareLink} style={{flex:"1 1 80px",padding:"12px",background:T.inputBackground,border:`1px solid ${copied?G:BR}`,borderRadius:10,fontSize:12,color:copied?G:DM,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
                {copied?"✓ Copied":"🔗 Share"}
              </button>
              <button onClick={reset} style={{flex:"1 1 70px",padding:"12px",background:T.inputBackground,border:"1px solid "+BR,borderRadius:10,fontSize:12,color:DM,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← New</button>
            </div>

            {/* Who You Are */}
            <Sec id="profile" title="Who You Are" copyText={summary}>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,alignItems:"center"}}>
                {(()=>{
                  const dims=["O","C","E","A","N"],labels=["Open","Consc","Extra","Agree","Stable"],colors=["#7C9CBF","#C9A84C","#7DBF8A","#C97A7A","#B07DBF"];
                  const cx=110,cy=110,r=75,n=dims.length;
                  const angle=i=>(Math.PI*2*(i/n))-Math.PI/2;
                  const pt=(i,val)=>{const a=angle(i),pct=val/100;return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)];};
                  const poly=dims.map((d,i)=>pt(i,ocean[d])).map(p=>p.join(",")).join(" ");
                  return(
                    <svg viewBox="0 0 220 220" style={{width:"clamp(140px,25vw,180px)",display:"block",flexShrink:0}}>
                      {[0.25,0.5,0.75,1].map(pct=>{const pts=dims.map((_,i)=>{const a=angle(i);return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)].join(",")}).join(" ");return <polygon key={pct} points={pts} fill="none" stroke={dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"} strokeWidth="1"/>;})}
                      {dims.map((_,i)=>{const[x,y]=pt(i,1);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"} strokeWidth="1"/>;;})}
                      <polygon points={poly} fill="rgba(201,168,76,0.12)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
                      {dims.map((d,i)=>{const[x,y]=pt(i,ocean[d]);return <circle key={d} cx={x} cy={y} r="4" fill={colors[i]}/>;;})}
                      {dims.map((d,i)=>{const a=angle(i),lx=cx+(r+22)*Math.cos(a),ly=cy+(r+22)*Math.sin(a);return <text key={d} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={colors[i]} fontFamily="DM Sans,sans-serif" fontWeight="500">{labels[i]}</text>;})}
                    </svg>
                  );
                })()}
                <div>
                  <p style={bod}>{summary}</p>
                  {careerCtx.skills.length>0&&<div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
                    {careerCtx.skills.map(s=><span key={s} style={{fontSize:9,color:"#7DBF8A",background:"rgba(125,191,138,0.07)",border:"1px solid rgba(125,191,138,0.2)",padding:"3px 9px",borderRadius:4}}>{s}</span>)}
                  </div>}
                </div>
              </div>
            </Sec>

            {/* OCEAN */}
            <Sec id="ocean" title="Big Five — OCEAN" sub="Personality Dimensions">
              {Object.entries(ocean).map(([k,v])=>(
                <div key={k} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,color:BC[k],letterSpacing:1,fontWeight:500,textTransform:"uppercase"}}>{BL[k]}</span>
                    <span style={{fontSize:12,color:BC[k],fontWeight:600}}>{v}%</span>
                  </div>
                  <div style={{height:4,background:T.inputBackground,borderRadius:2,overflow:"hidden",marginBottom:5}}><div style={{height:"100%",width:v+"%",background:BC[k],borderRadius:2,transition:"width 0.6s ease"}}/></div>
                  <p style={{...bod,fontSize:11,color:FA}}>{oceanText[k]}</p>
                </div>
              ))}
            </Sec>

            {/* MBTI */}
            <Sec id="mbti" title={"MBTI — "+mbti} sub={mbtiData[0]} copyText={`${mbti} — ${mbtiData[0]}: ${mbtiData[1]}`}>
              <p style={bod}>{mbtiData[1]}</p>
              <div style={hl}><p style={{...bod,fontStyle:"italic",fontSize:12}}>{mbtiData[2]}</p></div>
            </Sec>

            {/* Enneagram */}
            <Sec id="enneagram" title={"Enneagram — Type "+ennType} sub={ennData.name}>
              <p style={{...bod,marginBottom:12}}>{ennData.core}</p>
              <div style={grid2}>
                {[["Gift",ennData.gift,"#7DBF8A","enn-gift"],["Growth",ennData.growth,G,"enn-growth"],["Under Stress",ennData.stress,"#C97A7A","enn-stress"],["Wing",ennData.wing,"#7C9CBF","enn-wing"]].map(([l,t,c,cid])=><InfoCard key={l} label={l} text={t} color={c} copyId={cid}/>)}
              </div>
            </Sec>

            {/* Communication */}
            <Sec id="comms" title="Communication Style" sub={"How to work with "+name.split(" ")[0]} copyText={commStyle}>
              <p style={bod}>{commStyle}</p>
            </Sec>

            {/* Career */}
            <Sec id="career" title="Career Intelligence" sub={careerCtx.industry!=="general"?careerCtx.industry:undefined}>
              <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:12,borderLeft:"3px solid "+G}}>
                <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Career Archetype</div>
                <div style={{fontSize:14,color:TX,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{careerCtx.archetype}</div>
                <p style={{...bod,fontSize:12,color:FA}}>{careerCtx.archetypeDesc}</p>
              </div>
              <div style={{marginBottom:12}}>
                <p style={{fontSize:9,color:FA,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Strengths</p>
                {strengths.map((s,i)=><div key={i} style={{fontSize:12,color:T.bodColor,lineHeight:1.75,marginBottom:4}}>◆ {s}</div>)}
              </div>
              {careerCtx.nextMoves.length>0&&<div style={{marginBottom:12}}>
                <p style={{fontSize:9,color:FA,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Three Paths Forward</p>
                {careerCtx.nextMoves.map((m,i)=>(
                  <div key={i} style={{background:T.inputBackground,borderRadius:9,padding:"12px 14px",marginBottom:8,borderLeft:"2px solid "+["#7C9CBF","#7DBF8A","#C97A7A"][i]}}>
                    <div style={{fontSize:10,color:["#7C9CBF","#7DBF8A","#C97A7A"][i],fontWeight:600,marginBottom:3}}>0{i+1} — {m.title}</div>
                    <p style={{...bod,fontSize:12,color:FA}}>{m.desc}</p>
                  </div>
                ))}
              </div>}
              <div style={hl}><p style={bod}><strong style={{color:G}}>Blind spot: </strong>{blind}</p></div>
            </Sec>

            {/* Roadmap */}
            <Sec id="roadmap" title="Strategic Roadmap">
              {roadmap.map((r,i)=>(
                <div key={i} style={{marginBottom:16,paddingLeft:14,borderLeft:"2px solid "+G,position:"relative"}}>
                  <div style={{position:"absolute",left:-5,top:5,width:8,height:8,borderRadius:"50%",background:G}}/>
                  <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>{r.y} — {r.t}</div>
                  <p style={bod}>{r.a}</p>
                </div>
              ))}
            </Sec>

            {/* Numerology */}
            {nums&&lpData&&<Sec id="numerology" title="Numerology + Element">
              <div style={grid3}>
                {[["Life Path",nums.lp,G],["Expression",nums.expr,"#7C9CBF"],["Soul Urge",nums.soul,"#7DBF8A"],["Birth Day",nums.bd,"#C97A7A"],["Personality",nums.pers,"#B07DBF"],["Personal Year",nums.py,G]].map(([l,v,c])=>(
                  <div key={l} style={{background:T.inputBackground,border:"1px solid "+BR,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontSize:26,fontWeight:700,color:c,lineHeight:1,fontFamily:"'Cormorant Garamond',serif"}}>{v}</div>
                    <div style={{fontSize:8,color:FA,letterSpacing:1.5,textTransform:"uppercase",marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <InfoCard label={nums.element+" Element · "+nums.sign} text={elemData?.desc} color="#7DBF8A" copyId="elem"/>
              <div style={{marginTop:8}}><InfoCard label={"Life Path "+nums.lp+" · "+lpData.name} text={lpData.desc} color={G} copyId="lp"/></div>
              <div style={{...hl,marginTop:8}}><p style={{...bod,fontSize:12,fontStyle:"italic",color:FA}}>Shadow: {lpData.shadow}</p></div>
              {numSynthesis&&<div style={{...hl,marginTop:8}}><p style={bod}>{numSynthesis}</p></div>}
            </Sec>}

            {/* Decision Timing */}
            {decisionTiming&&<Sec id="timing" title="Element-Based Decision Timing" sub="When your energy peaks">
              <div style={grid2}>
                <InfoCard label="Peak Hours" text={decisionTiming.peak} color={G}/>
                <InfoCard label="Lucky Colours" text={decisionTiming.lucky} color="#7C9CBF" copyId="colours"/>
              </div>
              <p style={{...bod,marginTop:10}}>{decisionTiming.decision}</p>
              {elemData&&<div style={{...hl,marginTop:10}}>
                <p style={{...bod,fontSize:12}}><strong style={{color:"#7DBF8A"}}>Best seasons: </strong>{elemData.season}</p>
                <p style={{...bod,fontSize:12,marginTop:6}}><strong style={{color:"#C97A7A"}}>Watch out: </strong>{elemData.avoid}</p>
              </div>}
            </Sec>}

            {/* Soul Purpose */}
            {soulPurpose&&<Sec id="soul" title="Soul Purpose" sub={soulPurpose.missionType} copyText={soulPurpose.mission}>
              <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:12,borderLeft:"3px solid "+G}}>
                <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Core Mission</div>
                <p style={bod}>{soulPurpose.mission}</p>
              </div>
              <div style={grid2}>
                <InfoCard label="The Lesson" text={soulPurpose.lesson} color="#7C9CBF" copyId="lesson"/>
                <InfoCard label="Your Contribution" text={soulPurpose.contribution} color="#7DBF8A" copyId="contribution"/>
              </div>
              <div style={hl}><p style={{...bod,fontSize:12}}><strong style={{color:G}}>Daily alignment: </strong>{soulPurpose.daily}</p></div>
            </Sec>}

            {/* Daily Protocol */}
            <Sec id="daily" title="Daily Alignment Protocol" sub={"Enneagram Type "+ennType+" practices"}>
              <div style={grid2}>
                <InfoCard label="Morning Ritual" text={dailyProtocol.morning} color="#7DBF8A" copyId="morning"/>
                <InfoCard label="Weekly Practice" text={dailyProtocol.weekly} color={G} copyId="weekly"/>
              </div>
              <div style={{marginTop:8}}><InfoCard label="Intellectual Discernment" text={dailyProtocol.intellectual} color="#7C9CBF" copyId="intellectual"/></div>
            </Sec>

            {/* Wealth */}
            <Sec id="wealth" title="Wealth Psychology" sub={discLabel+" DISC profile"}>
              <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:8,borderLeft:"3px solid "+G}}>
                <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Core Wealth Frequency</div>
                <p style={bod}>{wealthPsych.frequency}</p>
              </div>
              <InfoCard label="Primary Block" text={wealthPsych.block} color="#C97A7A" copyId="wblock"/>
              <div style={{marginTop:8}}><InfoCard label="Tailored Strategy" text={wealthPsych.strategy} color="#7DBF8A" copyId="wstrat"/></div>
            </Sec>

            {/* Relationships */}
            {relData&&<Sec id="relationships" title="Relationship Dynamics" sub={nums?.element+" Element"}>
              <p style={{...bod,marginBottom:12}}>{relData.ideal}</p>
              <div style={grid2}>
                <InfoCard label="Love Lesson" text={relData.lesson} color="#C97A7A" copyId="lovelesson"/>
                <InfoCard label="Ideal Resonance" text={relData.idealResonance} color="#7C9CBF"/>
              </div>
              <div style={hl}><p style={{...bod,fontSize:12}}><strong style={{color:G}}>Partner profile: </strong>{relData.partner}</p></div>
            </Sec>}

            {/* Life Journey */}
            {lifeJourney&&<Sec id="journey" title="Life Journey" sub="Career phases and trajectory">
              {lifeJourney.map((p,i)=>(
                <div key={i} style={{marginBottom:14,paddingLeft:14,borderLeft:"2px solid "+G,position:"relative"}}>
                  <div style={{position:"absolute",left:-5,top:5,width:8,height:8,borderRadius:"50%",background:i===lifeJourney.length-2?G:T.inputBackground,border:"2px solid "+G}}/>
                  <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:2}}>{p.icon} {p.year}</div>
                  <div style={{fontSize:12,color:TX,marginBottom:3,fontFamily:"'Cormorant Garamond',serif"}}>{p.title}</div>
                  <p style={{...bod,fontSize:11,color:FA}}>{p.desc}</p>
                </div>
              ))}
            </Sec>}

            {/* Role Models */}
            {roleModels&&<Sec id="rolemodels" title="Strategic Role Models" sub={nums?.element+" element archetypes"}>
              <p style={{...bod,fontSize:12,color:FA,marginBottom:14}}>Model the energy of Disciplined Visionaries who used your elemental profile to build massive, enduring impact.</p>
              {roleModels.models.map((m,i)=>(
                <div key={i} style={{background:T.inputBackground,borderRadius:9,padding:"12px 14px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{fontSize:18,fontWeight:700,color:G,fontFamily:"'Cormorant Garamond',serif",lineHeight:1,minWidth:20}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,color:TX,fontWeight:600}}>{m.name}</span>
                      <span style={{fontSize:9,color:FA,fontStyle:"italic"}}>{m.tag}</span>
                    </div>
                    <p style={{...bod,fontSize:11,color:FA}}>{m.why}</p>
                  </div>
                </div>
              ))}
            </Sec>}

            {/* Growth Edges */}
            <Sec id="growth" title="Growth Edges">
              {growth.map((g,i)=><div key={i} style={{fontSize:12,color:T.bodColor,lineHeight:1.75,marginBottom:8,paddingLeft:14,borderLeft:"2px solid "+BR}}>▸ {g}</div>)}
            </Sec>

          {/* Quote */}
          {quote&&<div style={{background:dark?"linear-gradient(135deg,#090E15,#131F2D)":"linear-gradient(135deg,#F0EDE6,#E8E4DA)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:14,padding:"28px",textAlign:"center",marginBottom:22,position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:40,color:"rgba(201,168,76,0.12)",fontFamily:"Georgia,serif",position:"absolute",top:8,left:18,lineHeight:1}}>"</div>
            <p style={{fontSize:15,color:TX,fontStyle:"italic",lineHeight:1.85,margin:"0 0 10px",fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300,position:"relative",zIndex:1}}>"{quote}"</p>
            <p style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>— {headline}</p>
            <button onClick={()=>copyInsight("quote",quote)} style={{background:"transparent",border:"1px solid rgba(201,168,76,0.3)",borderRadius:6,padding:"5px 14px",fontSize:9,color:copiedId==="quote"?G:FA,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:1}}>
              {copiedId==="quote"?"✓ COPIED":"⎘ COPY QUOTE"}
            </button>
          </div>}

          {/* Methodology */}
          <Sec id="methodology" title="How This Report Was Built" sub="Methodology & Parameters">
            <p style={{...bod,fontSize:12,color:FA,marginBottom:16}}>This report is generated by a rules-based scoring engine — no AI, no server, no guesswork. Here is exactly how each section was derived from the information you provided.</p>
            <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:8,border:"1px solid "+BR}}>
              <div style={{fontSize:10,color:G,fontWeight:600,marginBottom:6}}>🧠 Big Five OCEAN — Keyword Frequency Scoring</div>
              <p style={{...bod,fontSize:11,color:FA,marginBottom:8}}>Your name, role, background context, and CV were combined into a single text corpus. Each dimension was scored by counting keyword hits from a bank of ~30 signal words per dimension.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:6}}>
                {[["O — Openness",`"innovation, creative, strategy, explore" → up. "routine, admin, procedure" → down. Your score: ${ocean.O}%`,"#7C9CBF"],["C — Conscientiousness",`"audit, compliance, accuracy, ifrs, governance, precise" → up. Your score: ${ocean.C}%`,"#C9A84C"],["E — Extraversion",`"lead, team, client, stakeholder, present, network" → up. "independent, remote, solo" → down. Your score: ${ocean.E}%`,"#7DBF8A"],["A — Agreeableness",`"mentor, support, community, empathy, collaborate" → up. "competitive, revenue" → down. Your score: ${ocean.A}%`,"#C97A7A"],["N — Emotional Stability",`"stable, resilient, high stakes" → more stable (lower N). "cautious, sensitive, verify" → higher N. Your score: ${ocean.N}%`,"#B07DBF"]].map(([t,d,c])=>(
                  <div key={t} style={{background:T.pageBackground,borderRadius:7,padding:"10px 12px",borderLeft:"2px solid "+c}}>
                    <div style={{fontSize:9,color:c,fontWeight:600,marginBottom:3}}>{t}</div>
                    <p style={{...bod,fontSize:10,color:FA}}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:8,border:"1px solid "+BR}}>
              <div style={{fontSize:10,color:G,fontWeight:600,marginBottom:6}}>🔤 MBTI {mbti} — OCEAN Crosswalk (McCrae & Costa, 1989)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:5}}>
                {[[`E vs I`,`OCEAN E ${ocean.E}% (threshold 53) → ${mbti[0]}`],[`N vs S`,`OCEAN O ${ocean.O}% (threshold 54) → ${mbti[1]}`],[`T vs F`,`OCEAN A ${ocean.A}% (threshold 52) → ${mbti[2]}`],[`J vs P`,`OCEAN C ${ocean.C}% (threshold 56) → ${mbti[3]}`]].map(([t,d])=>(
                  <div key={t} style={{background:T.pageBackground,borderRadius:7,padding:"9px 11px"}}>
                    <div style={{fontSize:9,color:G,fontWeight:600,marginBottom:2}}>{t}</div>
                    <p style={{...bod,fontSize:10,color:FA}}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:T.inputBackground,borderRadius:10,padding:"14px",marginBottom:8,border:"1px solid "+BR}}>
              <div style={{fontSize:10,color:G,fontWeight:600,marginBottom:6}}>🌀 Enneagram Type {ennType} — All 9 raw keyword scores</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                {Object.entries(report.ennRawScores||{}).sort((a,b)=>b[1]-a[1]).map(([type,score])=>(
                  <div key={type} style={{background:type===ennType?"rgba(201,168,76,0.12)":T.pageBackground,border:"1px solid "+(type===ennType?G:BR),borderRadius:6,padding:"5px 10px",textAlign:"center",minWidth:48}}>
                    <div style={{fontSize:11,color:type===ennType?G:FA,fontWeight:type===ennType?700:400}}>T{type}</div>
                    <div style={{fontSize:9,color:FA}}>{score}</div>
                  </div>
                ))}
              </div>
              {report.ennType2&&<p style={{...bod,fontSize:10,color:FA}}>Secondary type: <strong style={{color:G}}>Type {report.ennType2}</strong> — read this if Type {ennType} doesn't fully resonate.</p>}
            </div>
            <div style={{background:"rgba(201,168,76,0.05)",borderRadius:8,padding:"12px 14px",border:"1px solid rgba(201,168,76,0.15)"}}>
              <p style={{...bod,fontSize:11,color:FA}}><strong style={{color:G}}>On accuracy:</strong> This engine performs best with a CV uploaded. Without one, it uses your name, role, and context. The more specific your input, the more personalised the output. Numerology is always mathematically exact.</p>
            </div>
          </Sec>

          {/* Accuracy Rating */}
          <div style={{background:T.inputBackground,borderRadius:12,padding:"20px",marginBottom:20,border:"1px solid "+BR,textAlign:"center"}}>
            <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>How accurate was this report?</div>
            {!ratingDone?<>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:10}}>
                {[1,2,3,4,5].map(star=>(
                  <button key={star} onClick={()=>{setRating(star);setRatingDone(true);if(consent){try{const s=JSON.parse(localStorage.getItem("pie_ratings")||"[]");s.push({ts:Date.now(),r:star,mbti:mbti,enn:ennType});localStorage.setItem("pie_ratings",JSON.stringify(s.slice(-50)));}catch{}}}}
                    style={{fontSize:28,background:"transparent",border:"none",cursor:"pointer",color:star<=rating?G:"rgba(201,168,76,0.25)",transition:"color 0.1s",padding:"4px"}} onMouseEnter={()=>setRating(star)} onMouseLeave={()=>setRating(0)}>
                    ★
                  </button>
                ))}
              </div>
              <p style={{fontSize:10,color:FA}}>Your feedback helps us improve scoring accuracy</p>
            </>:<>
              <div style={{fontSize:24,marginBottom:6}}>{["😐","🙂","😊","😄","🤩"][rating-1]}</div>
              <p style={{fontSize:12,color:G,fontWeight:500}}>{["We'll keep working on it","Good to know — thanks!","Glad it resonated!","Really glad to hear that!","That's what we're here for!"][rating-1]}</p>
              <p style={{fontSize:10,color:FA,marginTop:4}}>Thanks for rating — this helps refine the engine.</p>
            </>}
          </div>

          <div style={{background:T.inputBackground,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,border:"1px solid "+BR}}>
            <span style={{fontSize:14}}>🔒</span>
            <p style={{fontSize:10,color:FA,lineHeight:1.6,margin:0}}>Your data was never sent anywhere. This report was generated entirely in your browser. Closing this tab deletes everything.{consent&&" Anonymous patterns saved locally."}</p>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>printToPDF(report,dob)} style={{flex:"2 1 140px",padding:"14px",background:"linear-gradient(135deg,#C9A84C,#9a7030)",color:"#090E15",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>⬇ Download PDF</button>
            <button onClick={copyShareLink} style={{flex:"1 1 90px",padding:"14px",background:T.inputBackground,border:`1px solid ${copied?G:BR}`,borderRadius:10,fontSize:12,color:copied?G:DM,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>{copied?"✓ Copied":"🔗 Share"}</button>
          </div>
          <button onClick={reset} style={{width:"100%",marginTop:8,padding:"12px",background:"transparent",border:"1px solid "+BR,borderRadius:10,fontSize:12,color:DM,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Generate Another Report</button>
        </div>
      </div>
      </div>
    );
  }
  return null;
}
