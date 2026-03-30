import { useState, useRef } from "react";
import "./index.css";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA TABLES
// ═══════════════════════════════════════════════════════════════════════════════

const OCEAN_KEYWORDS = {
  O: { pos: ["creative","innovation","research","design","strategy","explore","concept","idea","vision","develop","invent","curious","learning","experiment","novel","diverse","art","write","philosophy","theory","architect","plan","imagine","discover","build","startup","entrepreneurship","digital","technology","transform"],
       neg: ["routine","compliance","process","standard","procedure","maintain","operations","admin","clerical","entry","repetitive","support","assist","coordinate"] },
  C: { pos: ["audit","compliance","accuracy","detail","deadline","report","analysis","review","manage","organise","plan","implement","deliver","quality","control","improve","monitor","measure","track","complete","precise","thorough","systematic","structured","efficient","certif","accounting","finance","tax","legal","engineer","schedule","budget","forecast","reconcil","ifrs","isa","gaap"],
       neg: ["flexible","adapt","spontaneous","informal","casual","freelance","varied","diverse"] },
  E: { pos: ["lead","manage","team","client","present","stakeholder","collaborate","communicate","negotiate","train","mentor","coach","public","speak","network","partner","engage","relationship","business development","sales","marketing","customer","community","event","conference","workshop","facilitate","coordinate","executive"],
       neg: ["independent","solo","remote","individual","analyst","research","technical","data","model","code","program","backend","internal"] },
  A: { pos: ["team","support","help","mentor","coach","develop","community","volunteer","charity","nonprofit","collaborate","assist","care","empathy","patient","teach","train","people","culture","wellbeing","diversity","inclusion","service","humanitarian","social"],
       neg: ["negotiate","competitive","target","performance","revenue","sales","commercial","drive","aggressive","push","challenge","critical","evaluate","assess"] },
  N: { neg: ["stable","consistent","reliable","calm","confident","resilient","composed","steady","manage pressure","deliver under","deadline","high stakes","crisis","volatile","uncertainty","complex","challenging environment","adapt","flexible","stress"],
       pos: ["concern","risk","careful","cautious","sensitive","aware","detail","thorough","check","verify","validate","monitor","oversight","safeguard"] }
};

const ENNEAGRAM_KEYWORDS = {
  "1": ["quality","standard","compliance","correct","improve","error","accuracy","ethics","integrity","principle","perfect","right","responsibility","audit","legal","policy","procedure","excellence","precise","thorough"],
  "2": ["help","support","mentor","coach","team","collaborate","assist","care","develop people","training","hr","counsell","social work","volunteer","community","teach","guide","nurture","service"],
  "3": ["achieve","target","performance","award","recognition","promot","success","result","deliver","milestone","lead","executive","career","objective","goal","efficient","impress","brand","image"],
  "4": ["creative","design","art","unique","authentic","express","identity","brand","culture","diversity","write","narrative","vision","meaning","craft","aesthetic","innovation","original"],
  "5": ["research","analysis","data","model","investigate","expert","knowledge","technical","academic","publish","study","insight","analytics","science","engineer","program","architect","specialist"],
  "6": ["security","risk","compliance","safety","reliable","loyal","policy","procedure","team","protect","contingency","audit","review","check","verify","due diligence","governance","control","oversight"],
  "7": ["diverse","varied","new","exciting","opportunities","travel","project","startup","growth","entrepreneurship","creative","innovation","launch","explore","experience","multi","international","flexible"],
  "8": ["lead","director","executive","ceo","founder","head","chief","senior","authority","decision","control","power","drive","challenge","bold","impact","transform","commercial","revenue","competitive"],
  "9": ["mediator","balance","consensus","harmony","stable","maintain","coordinate","support","bridge","peace","relationship","collaborative","steady","culture","community","continuity","service"]
};

const DISC_KEYWORDS = {
  D: ["director","executive","vp","head","chief","ceo","coo","cfo","lead","senior","manager","principal","partner","founder","president","drive","deliver","target","revenue","competitive","aggressive","growth","strategy","commercial","authority","decision","transform","challenge"],
  I: ["sales","marketing","business development","brand","client","customer","present","pitch","network","engage","communicate","partner","public","event","social","media","creative","storytell","collaborate","inspire","train","coach","facilitate","relationship","community"],
  S: ["support","assist","coordinate","admin","operations","hr","team","service","maintain","process","consistent","reliable","stable","steady","patient","care","help","long-term","loyalty","continuity","routine","manage"],
  C: ["audit","analysis","data","research","compliance","quality","accounting","finance","tax","engineer","technical","model","report","review","accuracy","detail","standard","procedure","system","process","measure","monitor","control","verify","validate","reconcil","ifrs","isa","gaap"]
};

const MBTI_MAP = {
  INTJ:["Architect","Strategic, independent, visionary thinker who builds long-term frameworks","Driven by mastery and systemic improvement"],
  INTP:["Logician","Analytical, inventive, loves theoretical exploration and problem-solving","Motivated by understanding how things fundamentally work"],
  ENTJ:["Commander","Bold, decisive, natural executive who builds efficient systems at scale","Driven by achievement, leadership, and transformative impact"],
  ENTP:["Debater","Quick-witted, innovative, thrives on intellectual challenge and disruption","Motivated by generating novel ideas and challenging the status quo"],
  INFJ:["Advocate","Insightful, principled, deeply empathetic with a long-term vision","Driven by meaningful contribution to something larger than themselves"],
  INFP:["Mediator","Idealistic, creative, deeply values-driven and authentic","Motivated by personal meaning, creativity, and helping others grow"],
  ENFJ:["Protagonist","Charismatic, inspiring leader focused on developing people","Driven by enabling others to reach their full potential"],
  ENFP:["Campaigner","Enthusiastic, imaginative, energised by possibility and human connection","Motivated by freedom, creativity, and making a positive difference"],
  ISTJ:["Logistician","Reliable, meticulous, duty-driven executor of structured systems","Driven by responsibility, accuracy, and proven methodologies"],
  ISFJ:["Defender","Warm, loyal, deeply committed to protecting and serving others","Motivated by stability, helpfulness, and maintaining trusted structures"],
  ESTJ:["Executive","Organised, decisive, natural administrator who creates order","Driven by efficiency, clear hierarchies, and tangible results"],
  ESFJ:["Consul","Caring, socially aware, focused on group harmony and people's needs","Motivated by belonging, helpfulness, and maintaining strong relationships"],
  ISTP:["Virtuoso","Pragmatic, observant, masters of practical problem-solving","Driven by understanding how things work and fixing them efficiently"],
  ISFP:["Adventurer","Flexible, charming, quietly creative and values-aligned","Motivated by authentic self-expression and present-moment engagement"],
  ESTP:["Entrepreneur","Bold, perceptive, action-oriented, thrives in dynamic environments","Driven by immediate results, excitement, and practical impact"],
  ESFP:["Entertainer","Spontaneous, fun-loving, energises groups with warmth and enthusiasm","Motivated by enjoyment, social connection, and bringing joy to others"],
};

const LP_DATA = {
  1:{name:"The Leader",desc:"Independent, pioneering drive — here to initiate and lead",shadow:"Lone wolf tendency; struggles to delegate or accept help"},
  2:{name:"The Peacemaker",desc:"Diplomatic, cooperative, partnership-oriented energy",shadow:"Over-accommodates others; avoids necessary conflict"},
  3:{name:"The Achiever",desc:"Success-driven, adaptable, image-conscious high performer",shadow:"Defines worth by accomplishments; workaholic tendencies"},
  4:{name:"The Builder",desc:"Disciplined, methodical, creates lasting structures",shadow:"Rigidity; struggles with rapid change or ambiguity"},
  5:{name:"The Freedom Seeker",desc:"Adventurous, versatile, craves variety and new experience",shadow:"Commitment avoidance; scattered energy across too many things"},
  6:{name:"The Nurturer",desc:"Responsible, caring, deepest fulfilment through service",shadow:"Self-neglect; difficulty receiving help from others"},
  7:{name:"The Seeker",desc:"Analytical, introspective, truth-oriented deep thinker",shadow:"Over-analysis paralysis; withdraws when overwhelmed"},
  8:{name:"The Powerhouse",desc:"Ambitious, authoritative, built for material mastery",shadow:"Control issues; struggles to show vulnerability or ask for help"},
  9:{name:"The Humanitarian",desc:"Compassionate, wise, service to something larger",shadow:"Martyr complex; gives too much, burns out silently"},
  11:{name:"Master 11 — The Illuminator",desc:"Highly intuitive visionary; inspires without trying",shadow:"Intense nervous energy when vision isn't being lived"},
  22:{name:"Master 22 — The Master Builder",desc:"Visionary + practical; built to create at generational scale",shadow:"Collapses under own weight; pressure turns to anxiety"},
  33:{name:"Master 33 — The Teacher",desc:"Healing, inspiration, compassionate leadership at scale",shadow:"Carries everyone's pain; forgets their own needs"},
};

const ENN_DATA = {
  "1":{name:"The Reformer",core:"Motivated by doing things right — fears being corrupt, flawed, or wrong",gift:"Brings integrity, precision, and principled standards to every environment",growth:"Learn that imperfection is not failure — good enough is sometimes perfect"},
  "2":{name:"The Helper",core:"Motivated by being needed — fears being unloved or unwanted",gift:"Creates belonging and genuine care wherever they go",growth:"Receive help as readily as you give it — your needs matter equally"},
  "3":{name:"The Achiever",core:"Motivated by success and recognition — fears being worthless or a failure",gift:"Turns vision into tangible results with remarkable efficiency",growth:"Your value exists independent of your achievements — rest is not regression"},
  "4":{name:"The Individualist",core:"Motivated by authenticity and depth — fears being ordinary or without identity",gift:"Brings creative depth, emotional intelligence, and originality",growth:"Ordinary moments contain extraordinary meaning — presence over drama"},
  "5":{name:"The Investigator",core:"Motivated by knowledge and competence — fears being useless or overwhelmed",gift:"Provides the deepest expertise and most thorough analysis in any field",growth:"Share your knowledge before it's 'complete' — connection requires vulnerability"},
  "6":{name:"The Loyalist",core:"Motivated by security and support — fears being abandoned or without guidance",gift:"The most reliable, thorough, and trustworthy presence in any team",growth:"Your inner guidance is as trustworthy as external authority — trust it"},
  "7":{name:"The Enthusiast",core:"Motivated by freedom and possibility — fears pain, limitation, or missing out",gift:"Brings contagious optimism, creativity, and the ability to see opportunity everywhere",growth:"Depth over breadth — staying with discomfort reveals what scattered energy misses"},
  "8":{name:"The Challenger",core:"Motivated by control and strength — fears being controlled or appearing weak",gift:"Protects the vulnerable and creates change at a scale others can't imagine",growth:"Vulnerability is strength — letting people in multiplies your impact"},
  "9":{name:"The Peacemaker",core:"Motivated by harmony and peace — fears conflict and separation",gift:"Creates consensus, calm, and an environment where everyone feels included",growth:"Your presence and opinion matter — showing up fully is an act of love"},
};

const ELEM_DATA = {
  Fire:{desc:"Passionate, bold, charismatic — leads with energy and inspires others naturally",lucky:"Crimson Red, Burnt Orange, Deep Gold",day:"Sunday",peak:"10:00 AM – 1:00 PM"},
  Earth:{desc:"Stable, practical, grounded — builds lasting things with precision and patience",lucky:"Emerald Green, Royal Blue, Soft Silver",day:"Saturday",peak:"8:00 AM – 11:00 AM"},
  Water:{desc:"Intuitive, empathetic, deep — reads the room before thinking it, flows around obstacles",lucky:"Deep Blue, Sea Green, Pearl White",day:"Monday",peak:"7:00 AM – 10:00 AM"},
  Air:{desc:"Quick-minded, social, idea-rich — connects everything to everything, thrives on variety",lucky:"Sky Blue, Lavender, Bright Yellow",day:"Wednesday",peak:"9:00 AM – 12:00 PM"},
};

const PY_DATA = {
  1:"Brand new 9-year cycle beginning — the most important year to start things. Whatever launched now shapes the next decade.",
  2:"Year of patience and partnership — nurture key relationships, avoid forcing outcomes. Trust builds quietly.",
  3:"Year of expression — create, communicate, expand. Put yourself out there; visibility is the theme.",
  4:"Year of foundation — build, organise, work hard. Not glamorous but essential; the structures built now last.",
  5:"Year of change — embrace shifts, travel, new experiences. Resistance is futile; flow with transformation.",
  6:"Year of responsibility — family, home, service. Others need your stability; give generously but guard energy.",
  7:"Year of reflection — go inward, study, spiritual growth. Answers come from within, not from external noise.",
  8:"Year of abundance — career power, financial harvests. Effort from past cycles returns now; be bold.",
  9:"Year of completion — release old patterns, close cycles, prepare for the new. Let go gracefully.",
  11:"Year of illumination — trust intuition deeply. Synchronicities are messages; pay close attention.",
  22:"Master year — build something that outlasts you. Once-in-a-lifetime window for generational work.",
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function scoreText(text) {
  const t = text.toLowerCase();
  const count = (words) => words.reduce((n, w) => n + (t.split(w).length - 1), 0);

  // OCEAN scores (0-100)
  const ocean = {};
  Object.entries(OCEAN_KEYWORDS).forEach(([dim, kw]) => {
    const pos = count(kw.pos || []);
    const neg = count(kw.neg || []);
    // Normalise: base 50, +/- up to 45 based on keyword density
    const total = (kw.pos || []).length + (kw.neg || []).length;
    const raw = (pos - neg * 0.6) / Math.max(total * 0.15, 1);
    ocean[dim] = Math.min(97, Math.max(20, Math.round(50 + raw * 8)));
  });

  // Enneagram — find top type by keyword hits
  const ennScores = {};
  Object.entries(ENNEAGRAM_KEYWORDS).forEach(([type, kw]) => {
    ennScores[type] = count(kw);
  });
  const ennType = Object.entries(ennScores).sort((a,b)=>b[1]-a[1])[0][0];

  // DISC — find dominant style
  const discScores = {};
  Object.entries(DISC_KEYWORDS).forEach(([style, kw]) => {
    discScores[style] = count(kw);
  });
  const discDom = Object.entries(discScores).sort((a,b)=>b[1]-a[1])[0][0];
  const discLabels = {D:"Dominant",I:"Influential",S:"Steady",C:"Conscientious"};

  // MBTI from OCEAN crosswalk (research-based mapping)
  const ei = ocean.E >= 55 ? "E" : "I";
  const ns = ocean.O >= 55 ? "N" : "S";
  const tf = ocean.A >= 55 ? "F" : "T";
  const jp = ocean.C >= 55 ? "J" : "P";
  const mbti = ei + ns + tf + jp;

  return { ocean, ennType, discDom, discLabel: discLabels[discDom], mbti };
}

// Generate career strengths from scores
function deriveStrengths(scores, resumeText) {
  const t = resumeText.toLowerCase();
  const strengths = [];
  if (scores.ocean.C >= 70) strengths.push("Meticulous attention to detail and quality");
  if (scores.ocean.C >= 60) strengths.push("Strong organisation and execution discipline");
  if (scores.ocean.E >= 60) strengths.push("Natural ability to lead and influence teams");
  if (scores.ocean.O >= 60) strengths.push("Strategic thinking and creative problem-solving");
  if (scores.ocean.A >= 60) strengths.push("Builds genuine trust and loyalty with people");
  if (scores.ocean.N <= 40) strengths.push("Remains calm and clear under high pressure");
  if (t.includes("international") || t.includes("global") || t.includes("cross-border")) strengths.push("Cross-cultural and international competency");
  if (t.includes("data") || t.includes("analytics") || t.includes("analysis")) strengths.push("Data-driven analytical and insight capability");
  if (t.includes("client") || t.includes("stakeholder")) strengths.push("Strong client and stakeholder relationship management");
  if (t.includes("mentor") || t.includes("coach") || t.includes("train")) strengths.push("Develops and elevates people around them");
  return strengths.slice(0, 4);
}

function deriveRoles(scores, ennType) {
  const roles = [];
  const { ocean, discDom } = scores;
  if (ocean.C >= 70 && ocean.O <= 60) roles.push("Senior Auditor / Assurance Director");
  if (ocean.C >= 65) roles.push("Chief Financial Officer (CFO)");
  if (ocean.O >= 65 && ocean.C >= 60) roles.push("Strategy & Transformation Lead");
  if (ocean.E >= 65 && discDom === "D") roles.push("Managing Director / Executive Leader");
  if (ocean.O >= 60 && discDom === "I") roles.push("Business Development Director");
  if (ennType === "5" || ennType === "1") roles.push("Risk & Governance Advisor");
  if (ocean.O >= 65) roles.push("Innovation & Digital Audit Lead");
  if (ennType === "3" || discDom === "D") roles.push("Chief Risk Officer (CRO)");
  if (ocean.A >= 65) roles.push("People & Culture Lead");
  return [...new Set(roles)].slice(0, 3);
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUMEROLOGY (unchanged pure math)
// ═══════════════════════════════════════════════════════════════════════════════

function reduce(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33)
    n = String(n).split("").reduce((a,d) => a + +d, 0);
  return n;
}
function letterVal(c) {
  const v = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];
  const i = c.toUpperCase().charCodeAt(0) - 65;
  return i >= 0 && i < 26 ? v[i] : 0;
}
function calcNumerology(name, dob) {
  const d = new Date(dob);
  const day = d.getDate(), mon = d.getMonth()+1, yr = d.getFullYear();
  const cy = new Date().getFullYear();
  const sum = s => String(s).split("").reduce((a,x) => a + +x, 0);
  const lp = reduce(sum(day)+sum(mon)+sum(yr));
  const bd = reduce(day);
  const py = reduce(sum(day)+sum(mon)+sum(cy));
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"").split("");
  const VOW = ["A","E","I","O","U"];
  const expr = reduce(letters.reduce((a,c) => a+letterVal(c), 0));
  const soul = reduce(letters.filter(c=>VOW.includes(c)).reduce((a,c) => a+letterVal(c), 0));
  const pers = reduce(letters.filter(c=>!VOW.includes(c)).reduce((a,c) => a+letterVal(c), 0));
  const SIGNS = ["Capricorn","Aquarius","Pisces","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius"];
  const CUTS  = [20,19,20,20,21,21,23,23,23,23,22,22];
  const ELEM  = {Aries:"Fire",Taurus:"Earth",Gemini:"Air",Cancer:"Water",Leo:"Fire",Virgo:"Earth",Libra:"Air",Scorpio:"Water",Sagittarius:"Fire",Capricorn:"Earth",Aquarius:"Air",Pisces:"Water"};
  const sign  = day <= CUTS[mon-1] ? SIGNS[mon-1] : SIGNS[mon%12];
  return { lp, bd, py, expr, soul, pers, sign, element: ELEM[sign] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FULL REPORT BUILDER (pure logic, instant)
// ═══════════════════════════════════════════════════════════════════════════════

function buildReport(name, role, bg, resumeText, nums) {
  const combined = [name, role, bg, resumeText].filter(Boolean).join(" ");
  const scores   = scoreText(combined);
  const { ocean, ennType, discDom, discLabel, mbti } = scores;
  const mbtiData = MBTI_MAP[mbti] || MBTI_MAP["ISTJ"];
  const ennData  = ENN_DATA[ennType];
  const lpData   = nums ? LP_DATA[nums.lp] || LP_DATA[1] : null;
  const elemData = nums ? ELEM_DATA[nums.element] : null;

  // Headline archetype
  const archetypes = {
    INTJ:"The Strategic Visionary", INTP:"The Analytical Inventor", ENTJ:"The Executive Architect",
    ENTP:"The Disruptive Thinker",  INFJ:"The Principled Idealist", INFP:"The Authentic Creator",
    ENFJ:"The Inspiring Leader",    ENFP:"The Passionate Connector",ISTJ:"The Grounded Executor",
    ISFJ:"The Loyal Guardian",      ESTJ:"The Decisive Organiser",  ESFJ:"The Caring Facilitator",
    ISTP:"The Pragmatic Craftsman", ISFP:"The Quiet Innovator",     ESTP:"The Bold Opportunist",
    ESFP:"The Energetic Connector",
  };
  const headline = archetypes[mbti] || "The Analytical Professional";

  // Tagline from top traits
  const traits = [];
  if (ocean.C >= 70) traits.push("precision");
  if (ocean.E >= 65) traits.push("leadership");
  if (ocean.O >= 65) traits.push("vision");
  if (ocean.A >= 65) traits.push("empathy");
  if (ocean.N <= 35) traits.push("resilience");
  const tagline = `Defined by ${traits.slice(0,3).join(", ")} — built to create lasting impact through ${discLabel.toLowerCase()} excellence.`;

  // Summary
  const summary = `${name} operates as a ${mbtiData[0]} — ${mbtiData[1].toLowerCase()}. As a ${ennData.name}, their career is powered by a core drive to ${ennData.core.toLowerCase().replace("motivated by ","")}`;

  // OCEAN interpretations
  const oceanText = {
    O: ocean.O >= 65 ? "High openness — gravitates toward strategy, innovation, and abstract problem-solving over routine execution." : ocean.O >= 50 ? "Moderate openness — balances creativity with practicality; adapts ideas to real-world constraints effectively." : "Lower openness — prefers proven methods and established processes; consistency over experimentation.",
    C: ocean.C >= 70 ? "Exceptionally conscientious — the kind of professional who never misses a detail; audit trails are immaculate." : ocean.C >= 55 ? "Strong conscientiousness — reliable deliverer; sets high standards and generally meets them." : "Moderate conscientiousness — flexible approach to process; thrives in dynamic rather than structured environments.",
    E: ocean.E >= 65 ? "High extraversion — energised by client interaction, presentations, and team leadership; a natural front-person." : ocean.E >= 45 ? "Balanced extraversion — comfortable in both collaborative and independent settings; adapts to context." : "Introversion-leaning — does best work in focused, autonomous conditions; prefers depth of connection over breadth.",
    A: ocean.A >= 65 ? "High agreeableness — naturally collaborative and trusted by teams; builds consensus without losing direction." : ocean.A >= 45 ? "Moderate agreeableness — cooperative but direct; holds positions under pressure without being combative." : "Task-focused directness — prioritises outcomes over harmony; effective in environments that reward results over relationships.",
    N: ocean.N <= 35 ? "Low neuroticism — emotionally stable anchor under pressure; clients and teams feel safe in their presence." : ocean.N <= 50 ? "Moderate emotional stability — generally composed with a healthy awareness of risk and consequences." : "Emotionally aware — deeply attentive to risk and potential problems; this carefulness is a professional asset.",
  };

  const strengths = deriveStrengths(scores, combined);
  const roles_arr = deriveRoles(scores, ennType);

  // Blind spot
  const blindSpots = {
    ISTJ:"Tendency to over-rely on precedent — can resist beneficial change that lacks historical justification.",
    INTJ:"May communicate with insufficient warmth — technical brilliance can overshadow people-first leadership.",
    ENTJ:"Pace of execution can outrun team capacity — slowing down occasionally increases quality of outcomes.",
    INTP:"Analysis can delay action — perfect information rarely exists; confident 80% decisions beat paralysis.",
    ESTJ:"Rigidity under pressure — when rules conflict with reality, flexibility creates better outcomes than compliance.",
    ENFJ:"Over-investment in others' growth — sustainable impact requires protecting your own energy first.",
  };
  const blind = blindSpots[mbti] || "Depth of expertise can create blind spots about adjacent skills that unlock the next level.";

  // Wealth
  const wealthMap = {
    D:"Wealth through bold moves — you build fast but must guard against overconfidence in high-stakes decisions.",
    I:"Wealth through relationships and opportunities — your network is your net worth; invest in people deliberately.",
    S:"Wealth through consistency — slow, diversified accumulation outperforms speculation for your psychological profile.",
    C:"Wealth through expertise — your highest ROI always comes from deepening specialisation; certifications compound.",
  };
  const wealth = wealthMap[discDom] || "Wealth comes through disciplined long-term strategy aligned with your professional expertise.";

  // Roadmap
  const cy = new Date().getFullYear();
  const roadmap = [
    {y:String(cy),   t:"Consolidate",  a:`Deepen technical mastery in your core domain and become the undisputed expert in your immediate team.`},
    {y:String(cy+1), t:"Lead",         a:`Step into formal leadership — manage engagements, mentor juniors, and build your external professional brand.`},
    {y:String(cy+2), t:"Diversify",    a:`Explore adjacent opportunities: board advisory, consulting, digital transformation, or sector specialisation.`},
  ];

  // Growth edges
  const growth = [
    ocean.E < 55 ? "Build visibility — your expertise deserves a larger audience; write, speak, or post consistently." : "Delegate more deeply — your growth ceiling is the size of the team you can develop.",
    ocean.O < 55 ? "Experiment with one unconventional approach per quarter — innovation is a muscle, not a talent." : "Channel creative energy into fewer, deeper bets — breadth dilutes impact below a threshold.",
  ];

  // Quote
  const quotes = {
    "1":"The standard you walk past is the standard you accept — and no standard is too high when it matters.",
    "2":"The greatest leaders are remembered not for what they built, but for who they built it with.",
    "3":"Success is not the destination. It is the habit of people who refused to stop showing up.",
    "4":"Ordinary done with extraordinary care becomes the rarest thing in the world.",
    "5":"The map is not the territory — but the person who draws the most accurate map changes how everyone else moves.",
    "6":"Trust is not given or taken. It is built, brick by brick, in the moments that don't feel important.",
    "7":"The life well-lived is not the one with the most experiences, but the one most fully experienced.",
    "8":"Power is not the ability to command. It is the wisdom to know when to stand still.",
    "9":"Peace is not the absence of conflict. It is the presence of someone who refuses to add to it.",
  };
  const quote = quotes[ennType] || "Integrity is not what you do when others are watching. It is what you do when they are not.";

  // Numerology synthesis
  let numSynthesis = null;
  if (nums && lpData) {
    numSynthesis = `Life Path ${nums.lp} (${lpData.name}) ${nums.element === "Earth" ? "perfectly reinforces" : "creatively contrasts with"} the ${mbtiData[0]} psychological type — both ${nums.element === "Earth" || ocean.C >= 65 ? "demand structure, precision, and long-term thinking." : "chase impact, meaning, and transformative contribution."} Personal Year ${nums.py}: ${PY_DATA[nums.py] || "a year of significant transition and opportunity."}`;
  }

  return {
    headline, tagline, summary, ocean, oceanText,
    mbti, mbtiData, ennType, ennData, discDom, discLabel,
    strengths, roles: roles_arr, blind, wealth, roadmap, growth, quote,
    nums, lpData, elemData, numSynthesis,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME EXTRACTOR
// ═══════════════════════════════════════════════════════════════════════════════

async function extractText(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      if (file.type === "text/plain") { resolve(new TextDecoder().decode(e.target.result).slice(0,4000)); return; }
      const raw = new TextDecoder("latin1").decode(new Uint8Array(e.target.result));
      const m = raw.match(/\(([^)]{2,150})\)/g) || [];
      resolve(m.map(x=>x.slice(1,-1)).filter(x=>/[a-zA-Z]{3,}/.test(x)).join(" ").slice(0,4000));
    };
    reader.readAsArrayBuffer(file);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

function exportPDF(report) {
  const { headline, tagline, summary, ocean, oceanText, mbti, mbtiData, ennType, ennData,
          discLabel, strengths, roles, blind, wealth, roadmap, growth, quote, nums, lpData, elemData, numSynthesis } = report;
  const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
  const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};
  const name = report.name || "";

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${name} — Personal Intelligence Report</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#FAF8F4;color:#333;font-size:12px}
.cover{background:#0F1E2D;color:#F0EAD6;padding:80px 60px;text-align:center;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;page-break-after:always}
.badge{font-size:9px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-bottom:28px}
.nm{font-size:46px;margin-bottom:14px}.arch{font-size:20px;color:#C9A84C;font-style:italic;margin-bottom:12px}
.tg{font-size:13px;color:#7a8fa0;max-width:500px;margin:0 auto 28px;line-height:1.8}
.chips{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.chip{border:1px solid #C9A84C;color:#C9A84C;font-size:10px;letter-spacing:2px;padding:6px 16px;border-radius:20px}
.sec{padding:32px 60px;border-bottom:1px solid #e8e4dc;max-width:800px;margin:0 auto;width:100%}
.sl{font-size:9px;letter-spacing:3px;color:#C9A84C;text-transform:uppercase;margin-bottom:8px}
.st{font-size:22px;color:#0F1E2D;margin-bottom:16px}p{line-height:1.85;color:#444}
.bar-wrap{margin-bottom:14px}.bar-row{display:flex;justify-content:space-between;margin-bottom:4px}
.bar-track{height:6px;background:#e8e4dc;border-radius:3px;overflow:hidden}
.hl{background:#FBF6EC;border-left:3px solid #C9A84C;padding:12px 18px;margin-top:12px;border-radius:0 4px 4px 0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:14px}
.cl{font-size:9px;letter-spacing:2px;color:#999;text-transform:uppercase;margin-bottom:8px}
.li{font-size:11px;color:#555;line-height:1.8;margin-bottom:3px}
.rm{padding-left:16px;border-left:3px solid #C9A84C;margin-bottom:14px}
.num-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.num-card{background:#F5F1E8;border:1px solid #e2ddd3;border-radius:8px;padding:14px;text-align:center}
.num-n{font-size:30px;font-weight:700;color:#C9A84C}.num-l{font-size:8px;letter-spacing:2px;color:#888;text-transform:uppercase;margin-top:3px}
.qb{background:#0F1E2D;padding:50px 60px;text-align:center}
.qt{font-size:18px;font-style:italic;color:#F0EAD6;line-height:1.7;max-width:560px;margin:0 auto 12px}
.qa{font-size:9px;color:#C9A84C;letter-spacing:3px;text-transform:uppercase}
.ft{text-align:center;padding:20px;font-size:9px;color:#aaa;letter-spacing:1px}
@media print{.cover{page-break-after:always}}</style></head><body>
<div class="cover">
  <div class="badge">Personal Intelligence Report · ${new Date().toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</div>
  <div class="nm">${name}</div><div class="arch">${headline}</div>
  <div class="tg">"${tagline}"</div>
  <div class="chips">
    <span class="chip">${mbti}</span><span class="chip">Enneagram ${ennType}</span><span class="chip">DISC — ${discLabel}</span>
    ${nums?`<span class="chip">Life Path ${nums.lp}</span><span class="chip">${nums.element}</span>`:""}
  </div>
</div>
<div class="sec"><div class="sl">01</div><div class="st">Who You Are</div><p>${summary}</p></div>
<div class="sec"><div class="sl">02 — Big Five</div><div class="st">OCEAN Profile</div>
${Object.entries(ocean).map(([k,v])=>`<div class="bar-wrap"><div class="bar-row"><span style="font-size:10px;color:#888;letter-spacing:1px">${BL[k].toUpperCase()}</span><span style="font-size:11px;color:${BC[k]};font-weight:700">${v}%</span></div><div class="bar-track"><div style="height:100%;width:${v}%;background:${BC[k]};border-radius:3px"></div></div><p style="font-size:11px;color:#666;margin-top:4px">${oceanText[k]}</p></div>`).join("")}</div>
<div class="sec"><div class="sl">03 — MBTI</div><div class="st">${mbti} — ${mbtiData[0]}</div><p>${mbtiData[1]}</p><div class="hl"><p>${mbtiData[2]}</p></div></div>
<div class="sec"><div class="sl">04 — Enneagram</div><div class="st">Type ${ennType} — ${ennData.name}</div><p>${ennData.core}</p><div class="hl"><p><strong>Gift:</strong> ${ennData.gift}</p><p style="margin-top:8px"><strong>Growth:</strong> ${ennData.growth}</p></div></div>
<div class="sec"><div class="sl">05 — DISC</div><div class="st">${discLabel}</div><p>${wealth}</p></div>
${nums&&lpData?`<div class="sec"><div class="sl">06 — Numerology</div><div class="st">Numeric Patterns</div>
<div class="num-grid">${[["Life Path",nums.lp],["Expression",nums.expr],["Soul Urge",nums.soul],["Birth Day",nums.bd],["Personality",nums.pers],["Personal Year",nums.py]].map(([l,n])=>`<div class="num-card"><div class="num-n">${n}</div><div class="num-l">${l}</div></div>`).join("")}</div>
<p><strong>Life Path ${nums.lp}:</strong> ${lpData.name} — ${lpData.desc}</p>
<p style="margin-top:8px"><strong>${nums.element} Element (${nums.sign}):</strong> ${elemData?.desc}</p>
<div class="hl"><p>${numSynthesis}</p></div></div>`:""}
<div class="sec"><div class="sl">07 — Career</div><div class="st">Career Intelligence</div>
<div class="two"><div><div class="cl">Strengths</div>${strengths.map(s=>`<div class="li">◆ ${s}</div>`).join("")}</div>
<div><div class="cl">Ideal Roles</div>${roles.map(r=>`<div class="li">→ ${r}</div>`).join("")}</div></div>
<div class="hl"><p><strong>Watch out:</strong> ${blind}</p></div></div>
<div class="sec"><div class="sl">08 — Roadmap</div><div class="st">3-Year Strategy</div>
${roadmap.map(r=>`<div class="rm"><div style="font-size:9px;color:#C9A84C;letter-spacing:2px;font-weight:700;margin-bottom:3px">${r.y} — ${r.t}</div><p>${r.a}</p></div>`).join("")}</div>
<div class="sec"><div class="sl">09 — Growth</div><div class="st">Growth Edges</div>${growth.map(g=>`<div class="li" style="margin-bottom:8px">▸ ${g}</div>`).join("")}</div>
<div class="qb"><p class="qt">"${quote}"</p><div class="qa">— ${headline}</div></div>
<div class="ft">PERSONAL INTELLIGENCE REPORT · ${name} · Big Five · MBTI · Enneagram · DISC${nums?" · Numerology · "+nums.element:""}</div>
</body></html>`;

  const blob = new Blob([html], {type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${name.replace(/\s+/g,"-")}-Report.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  page: {minHeight:"100vh",background:"#0B1520",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"32px 16px",fontFamily:"Georgia,serif"},
  card: {background:"#111E2B",border:"1px solid #1a2d3e",borderRadius:16,padding:"32px 28px",width:"100%",maxWidth:560,boxShadow:"0 24px 64px rgba(0,0,0,0.5)"},
  wide: {background:"#111E2B",border:"1px solid #1a2d3e",borderRadius:16,padding:"0 0 32px",width:"100%",maxWidth:700,boxShadow:"0 24px 64px rgba(0,0,0,0.5)"},
  lbl:  {display:"block",fontSize:9,color:"#C9A84C",letterSpacing:2,textTransform:"uppercase",marginBottom:5,marginTop:14},
  inp:  {width:"100%",padding:"11px 13px",background:"#0d1a25",border:"1px solid #1a2d3e",borderRadius:7,color:"#F0EAD6",fontSize:13,fontFamily:"Georgia,serif",boxSizing:"border-box",outline:"none"},
  btnG: {width:"100%",padding:"14px",background:"linear-gradient(135deg,#C9A84C,#a8862e)",color:"#0B1520",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Georgia,serif"},
  btnL: {width:"100%",padding:"12px",background:"transparent",color:"#C9A84C",border:"1px solid #C9A84C",borderRadius:9,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif",marginBottom:18},
  body: {color:"#8aabbb",fontSize:13,lineHeight:1.85},
  hl:   {background:"rgba(201,168,76,0.07)",borderLeft:"3px solid #C9A84C",borderRadius:"0 6px 6px 0",padding:"10px 14px",marginTop:10},
};
function Sec({t,children}){return(<div style={{marginBottom:20,borderBottom:"1px solid #0d1520",paddingBottom:18}}><div style={{fontSize:9,letterSpacing:3,color:"#C9A84C",textTransform:"uppercase",marginBottom:10}}>{t}</div>{children}</div>);}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [stage, setStage]   = useState("form");
  const [name, setName]     = useState("");
  const [dob,  setDob]      = useState("");
  const [role, setRole]     = useState("");
  const [bg,   setBg]       = useState("");
  const [file, setFile]     = useState(null);
  const [rText, setRText]   = useState("");
  const [report, setReport] = useState(null);
  const fileRef = useRef();

  const liveNums = (name && dob) ? (() => { try { return calcNumerology(name,dob); } catch{return null;} })() : null;

  async function onFile(f) { if(!f)return; setFile(f); setRText(await extractText(f)); }

  function generate() {
    if (!name) return;
    const nums = (name && dob) ? calcNumerology(name, dob) : null;
    const r = buildReport(name, role, bg, rText, nums);
    r.name = name;
    setReport(r);
    setStage("report");
  }

  function reset() { setStage("form"); setName(""); setDob(""); setRole(""); setBg(""); setFile(null); setRText(""); setReport(null); }

  // ── FORM ───────────────────────────────────────────────────────────────────
  if (stage === "form") return (
    <div style={S.page}><div style={S.card}>
      <div style={{fontSize:9,letterSpacing:3,color:"#C9A84C",textTransform:"uppercase",marginBottom:12}}>Personal Intelligence Engine</div>
      <h1 style={{fontSize:34,color:"#F0EAD6",lineHeight:1.15,margin:"0 0 8px",fontFamily:"Georgia,serif"}}>Know Your<br/><em style={{color:"#C9A84C"}}>True Self</em></h1>
      <p style={{fontSize:12,color:"#5a7080",lineHeight:1.7,marginBottom:16}}>
        100% offline — instant results. No AI waiting. Pure logic on your career data and birth numbers.
      </p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {["🧠 Big Five","🔤 MBTI","🌀 Enneagram","📊 DISC","🔢 Numerology","🌍 Element"].map(f=>(
          <span key={f} style={{background:"#0d1a25",border:"1px solid #1a2d3e",borderRadius:20,padding:"4px 10px",fontSize:10,color:"#C9A84C"}}>{f}</span>
        ))}
      </div>

      <label style={S.lbl}>Full Name *</label>
      <input style={S.inp} placeholder="Muhammad Hammad" value={name} onChange={e=>setName(e.target.value)}/>

      <label style={S.lbl}>Date of Birth (unlocks numerology + element)</label>
      <input style={S.inp} type="date" value={dob} onChange={e=>setDob(e.target.value)}/>

      {liveNums && (
        <div style={{background:"#0d1a25",borderRadius:9,padding:"12px 14px",marginTop:8,animation:"fadeIn 0.3s ease"}}>
          <div style={{fontSize:9,letterSpacing:2,color:"#C9A84C",textTransform:"uppercase",marginBottom:8}}>Numerology Preview</div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
            {[["Life Path",liveNums.lp],["Expression",liveNums.expr],["Soul Urge",liveNums.soul],["Personal Year",liveNums.py]].map(([l,v])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:700,color:"#C9A84C",lineHeight:1}}>{v}</div>
                <div style={{fontSize:8,color:"#3a5060",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{l}</div>
              </div>
            ))}
            <div style={{textAlign:"center",marginLeft:4}}>
              <div style={{fontSize:13,color:"#7DBF8A",fontWeight:700}}>{liveNums.element}</div>
              <div style={{fontSize:8,color:"#3a5060",marginTop:2}}>{liveNums.sign}</div>
            </div>
          </div>
        </div>
      )}

      <label style={S.lbl}>Current Role / Field</label>
      <input style={S.inp} placeholder="Assistant Manager, EY Melbourne" value={role} onChange={e=>setRole(e.target.value)}/>

      <label style={S.lbl}>Brief Background (optional)</label>
      <textarea style={{...S.inp,height:58,resize:"none"}} placeholder="6 years audit, Big 4, building a consulting side-business..." value={bg} onChange={e=>setBg(e.target.value)}/>

      <label style={S.lbl}>Resume / CV — PDF or TXT (optional but recommended)</label>
      <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>onFile(e.target.files[0])}/>
      <div onClick={()=>fileRef.current.click()} style={{background:"#0d1a25",border:`2px dashed ${file?"#C9A84C":"#1a2d3e"}`,borderRadius:9,padding:16,textAlign:"center",cursor:"pointer",marginBottom:5}}>
        {file
          ? <><span style={{fontSize:16}}>✓ </span><span style={{color:"#C9A84C",fontSize:12,fontWeight:700}}>{file.name}</span><div style={{color:"#3a5060",fontSize:10,marginTop:2}}>Resume loaded — improves scoring accuracy</div></>
          : <><span style={{fontSize:20}}>📄</span><br/><span style={{color:"#3a5060",fontSize:12}}>Click to upload PDF or TXT</span></>}
      </div>
      <p style={{fontSize:10,color:"#2a3a44",marginBottom:18,textAlign:"center"}}>No resume? Just add context above — still generates a full report.</p>
      <button style={{...S.btnG,opacity:name?1:0.3}} disabled={!name} onClick={generate}>
        Generate My Intelligence Report — Instant →
      </button>
    </div></div>
  );

  // ── REPORT ─────────────────────────────────────────────────────────────────
  if (stage === "report" && report) {
    const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
    const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};
    const { headline, tagline, summary, ocean, oceanText, mbti, mbtiData, ennType, ennData,
            discLabel, strengths, roles, blind, wealth, roadmap, growth, quote,
            nums, lpData, elemData, numSynthesis } = report;

    return (
      <div style={S.page}><div style={S.wide}>

        {/* Cover */}
        <div style={{background:"linear-gradient(160deg,#08121c,#0e1c2b)",borderRadius:"16px 16px 0 0",padding:"40px 32px 34px",textAlign:"center",borderBottom:"1px solid #1a2d3e",marginBottom:24}}>
          <div style={{fontSize:9,letterSpacing:3,color:"#C9A84C",textTransform:"uppercase",marginBottom:12}}>Personal Intelligence Report</div>
          <h1 style={{fontSize:26,color:"#F0EAD6",margin:"6px 0 5px",fontFamily:"Georgia,serif"}}>{name}</h1>
          <p style={{fontSize:15,color:"#C9A84C",fontStyle:"italic",margin:"0 0 5px"}}>{headline}</p>
          <p style={{fontSize:12,color:"#3a5070",fontStyle:"italic",margin:"0 0 16px",lineHeight:1.6}}>"{tagline}"</p>
          <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
            {[mbti, `Enneagram ${ennType}`, `DISC — ${discLabel}`, ...(nums?[`Life Path ${nums.lp}`, nums.element]:[])].map(t=>(
              <span key={t} style={{background:"#0d1a25",border:"1px solid #C9A84C",color:"#C9A84C",fontSize:9,letterSpacing:1.5,padding:"4px 10px",borderRadius:20}}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{padding:"0 26px"}}>
          <button style={S.btnL} onClick={()=>exportPDF(report)}>
            ↓ Download Report — Open HTML → Ctrl+P → Save as PDF
          </button>

          <Sec t="Who You Are"><p style={S.body}>{summary}</p></Sec>

          <Sec t="Big Five — OCEAN Profile">
            {Object.entries(ocean).map(([k,v])=>(
              <div key={k} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:9,color:"#3a5060",letterSpacing:1}}>{BL[k].toUpperCase()}</span>
                  <span style={{fontSize:11,color:BC[k],fontWeight:700}}>{v}%</span>
                </div>
                <div style={{height:5,background:"#0d1a25",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${v}%`,background:BC[k],borderRadius:3,transition:"width 1s ease"}}/>
                </div>
                <p style={{...S.body,fontSize:11,color:"#3a5060",marginTop:3}}>{oceanText[k]}</p>
              </div>
            ))}
          </Sec>

          <Sec t={`MBTI — ${mbti} · ${mbtiData[0]}`}>
            <p style={S.body}>{mbtiData[1]}</p>
            <div style={S.hl}><p style={{...S.body,fontSize:12,fontStyle:"italic"}}>{mbtiData[2]}</p></div>
          </Sec>

          <Sec t={`Enneagram — Type ${ennType} · ${ennData.name}`}>
            <p style={S.body}>{ennData.core}</p>
            <div style={S.hl}>
              <p style={S.body}><strong style={{color:"#C9A84C"}}>Gift: </strong>{ennData.gift}</p>
              <p style={{...S.body,marginTop:6}}><strong style={{color:"#C9A84C"}}>Growth: </strong>{ennData.growth}</p>
            </div>
          </Sec>

          <Sec t={`DISC — ${discLabel}`}><p style={S.body}>{wealth}</p></Sec>

          {nums && lpData && (
            <Sec t="Numerology + Element">
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[["Life Path",nums.lp],["Expression",nums.expr],["Soul Urge",nums.soul],["Birth Day",nums.bd],["Personality",nums.pers],["Personal Year",nums.py]].map(([l,v])=>(
                  <div key={l} style={{background:"#0d1a25",border:"1px solid #1a2d3e",borderRadius:9,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontSize:26,fontWeight:700,color:"#C9A84C",lineHeight:1}}>{v}</div>
                    <div style={{fontSize:8,color:"#3a5060",letterSpacing:1,textTransform:"uppercase",marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#0d1a25",border:"1px solid #1a2d3e",borderRadius:9,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontSize:11,color:"#7DBF8A",fontWeight:700,marginBottom:4}}>{nums.element} Element · {nums.sign}</div>
                <p style={{...S.body,fontSize:12,color:"#4a6070"}}>{elemData?.desc}</p>
              </div>
              <div style={{background:"#0d1a25",border:"1px solid #1a2d3e",borderRadius:9,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontSize:11,color:"#C9A84C",fontWeight:700,marginBottom:4}}>Life Path {nums.lp} · {lpData.name}</div>
                <p style={{...S.body,fontSize:12,color:"#4a6070"}}>{lpData.desc}</p>
                <p style={{...S.body,fontSize:11,color:"#3a4050",marginTop:6,fontStyle:"italic"}}>Shadow: {lpData.shadow}</p>
              </div>
              <div style={S.hl}><p style={S.body}>{numSynthesis}</p></div>
            </Sec>
          )}

          <Sec t="Career Intelligence">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <p style={{fontSize:9,color:"#2a4050",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Strengths</p>
                {strengths.map((s,i)=><div key={i} style={{fontSize:12,color:"#7a9aaa",lineHeight:1.7,marginBottom:3}}>◆ {s}</div>)}
              </div>
              <div>
                <p style={{fontSize:9,color:"#2a4050",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Ideal Roles</p>
                {roles.map((r,i)=><div key={i} style={{fontSize:12,color:"#7a9aaa",lineHeight:1.7,marginBottom:3}}>→ {r}</div>)}
              </div>
            </div>
            <div style={S.hl}><p style={S.body}><strong style={{color:"#C9A84C"}}>Watch out: </strong>{blind}</p></div>
          </Sec>

          <Sec t="3-Year Strategic Roadmap">
            {roadmap.map((r,i)=>(
              <div key={i} style={{marginBottom:14,paddingLeft:12,borderLeft:"2px solid #C9A84C"}}>
                <div style={{fontSize:9,color:"#C9A84C",letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:3}}>{r.y} — {r.t}</div>
                <p style={S.body}>{r.a}</p>
              </div>
            ))}
          </Sec>

          <Sec t="Growth Edges">
            {growth.map((g,i)=><div key={i} style={{fontSize:12,color:"#7a9aaa",lineHeight:1.7,marginBottom:8}}>▸ {g}</div>)}
          </Sec>

          <div style={{background:"linear-gradient(135deg,#0d1a25,#111E2B)",border:"1px solid #C9A84C",borderRadius:11,padding:"22px 24px",textAlign:"center",marginBottom:20}}>
            <p style={{fontSize:14,color:"#F0EAD6",fontStyle:"italic",lineHeight:1.8,margin:"0 0 8px",fontFamily:"Georgia,serif"}}>"{quote}"</p>
            <p style={{fontSize:9,color:"#C9A84C",letterSpacing:2,textTransform:"uppercase"}}>— {headline}</p>
          </div>

          <button style={S.btnG} onClick={reset}>Analyse Another Profile</button>
        </div>
      </div></div>
    );
  }

  return null;
}
