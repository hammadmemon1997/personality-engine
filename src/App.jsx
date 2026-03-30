import { useState, useRef } from "react";
import "./index.css";

const OCEAN_KW = {
  O:{pos:["creative","innovation","research","design","strategy","explore","concept","idea","vision","develop","invent","curious","learning","experiment","novel","diverse","art","write","philosophy","theory","architect","plan","imagine","discover","build","startup","entrepreneurship","digital","technology","transform","launch","initiative","reimagine","pioneered"],neg:["routine","compliance","process","standard","procedure","maintain","operations","admin","clerical","entry","repetitive","support","assist","coordinate"]},
  C:{pos:["audit","compliance","accuracy","detail","deadline","report","analysis","review","manage","organise","plan","implement","deliver","quality","control","improve","monitor","measure","track","complete","precise","thorough","systematic","structured","efficient","certif","accounting","finance","tax","legal","engineer","schedule","budget","forecast","reconcil","ifrs","isa","gaap","framework","governance","oversight","assurance"],neg:["flexible","adapt","spontaneous","informal","casual","freelance","varied"]},
  E:{pos:["lead","manage","team","client","present","stakeholder","collaborate","communicate","negotiate","train","mentor","coach","public","speak","network","partner","engage","relationship","business development","sales","marketing","customer","community","event","conference","workshop","facilitate","coordinate","executive","director","head","chief"],neg:["independent","solo","remote","individual","analyst","research","technical","data","model","code","program","backend","internal"]},
  A:{pos:["team","support","help","mentor","coach","develop","community","volunteer","charity","nonprofit","collaborate","assist","care","empathy","patient","teach","train","people","culture","wellbeing","diversity","inclusion","service","humanitarian","social"],neg:["negotiate","competitive","target","performance","revenue","sales","commercial","drive","aggressive","push","challenge","critical","evaluate"]},
  N:{neg:["stable","consistent","reliable","calm","confident","resilient","composed","steady","manage pressure","deliver under","deadline","high stakes","crisis","volatile","uncertainty","complex","challenging","adapt","flexible"],pos:["concern","risk","careful","cautious","sensitive","aware","detail","thorough","check","verify","validate","monitor","oversight","safeguard"]}
};
const ENN_KW = {"1":["quality","standard","compliance","correct","improve","error","accuracy","ethics","integrity","principle","perfect","right","responsibility","audit","legal","policy","procedure","excellence","precise"],"2":["help","support","mentor","coach","team","collaborate","assist","care","develop people","training","hr","counsell","social work","volunteer","community","teach","guide"],"3":["achieve","target","performance","award","recognition","promot","success","result","deliver","milestone","lead","executive","career","objective","goal","efficient"],"4":["creative","design","art","unique","authentic","express","identity","brand","culture","diversity","write","narrative","vision","meaning","craft"],"5":["research","analysis","data","model","investigate","expert","knowledge","technical","academic","publish","study","insight","analytics","science","engineer","program"],"6":["security","risk","compliance","safety","reliable","loyal","policy","procedure","team","protect","contingency","audit","review","check","verify","due diligence"],"7":["diverse","varied","new","exciting","opportunities","travel","project","startup","growth","entrepreneurship","creative","innovation","launch","explore","experience"],"8":["lead","director","executive","ceo","founder","head","chief","senior","authority","decision","control","power","drive","challenge","bold","impact","transform"],"9":["mediator","balance","consensus","harmony","stable","maintain","coordinate","support","bridge","peace","relationship","collaborative","steady","culture","community"]};
const DISC_KW = {D:["director","executive","vp","head","chief","ceo","coo","cfo","lead","senior","manager","principal","partner","founder","president","drive","deliver","target","revenue","competitive","growth","strategy","commercial","authority","decision","transform"],I:["sales","marketing","business development","brand","client","customer","present","pitch","network","engage","communicate","partner","public","event","social","media","creative","collaborate","inspire","train","coach","facilitate"],S:["support","assist","coordinate","admin","operations","hr","team","service","maintain","process","consistent","reliable","stable","steady","patient","care","help","long-term","loyalty","continuity"],C:["audit","analysis","data","research","compliance","quality","accounting","finance","tax","engineer","technical","model","report","review","accuracy","detail","standard","procedure","system","measure","monitor","control","verify","reconcil"]};

const MBTI_MAP = {INTJ:["Architect","Strategic, independent visionary who builds long-term frameworks. Makes decisions by internalising complex patterns.","Driven by mastery and systemic improvement — values competence above all."],INTP:["Logician","Analytical, inventive thinker who seeks to understand the underlying principles behind every system.","Motivated by truth and elegant solutions to complex problems."],ENTJ:["Commander","Bold, decisive, natural executive who builds efficient systems at scale. Sees the strategic picture and moves toward it.","Driven by achievement, leadership, and transformative impact."],ENTP:["Debater","Quick-witted innovator who thrives on intellectual challenge and disruption. Generates ideas faster than they can be executed.","Motivated by novel ideas and challenging the status quo."],INFJ:["Advocate","Insightful, principled, deeply empathetic with a long-term vision. Senses patterns in people and systems others miss.","Driven by meaningful contribution to something larger than themselves."],INFP:["Mediator","Idealistic, creative, deeply values-driven and authentic. Brings unusual depth of feeling to work and relationships.","Motivated by personal meaning, creativity, and helping others grow."],ENFJ:["Protagonist","Charismatic, inspiring leader focused on developing people. Reads the room intuitively and moves groups toward a shared vision.","Driven by enabling others to reach their full potential."],ENFP:["Campaigner","Enthusiastic, imaginative, energised by possibility and human connection. Sees potential everywhere.","Motivated by freedom, creativity, and making a positive difference."],ISTJ:["Logistician","Reliable, meticulous, duty-driven executor of structured systems. Builds trust through consistency, precision, and follow-through.","Driven by responsibility, accuracy, and proven methodologies."],ISFJ:["Defender","Warm, loyal, deeply committed to protecting and serving others. Remembers details about people and uses them to help.","Motivated by stability, helpfulness, and maintaining trusted structures."],ESTJ:["Executive","Organised, decisive, natural administrator who creates order from chaos. Sets clear expectations and holds to them.","Driven by efficiency, clear hierarchies, and tangible results."],ESFJ:["Consul","Caring, socially aware, focused on group harmony. Takes responsibility for the emotional climate of a team.","Motivated by belonging, helpfulness, and maintaining strong relationships."],ISTP:["Virtuoso","Pragmatic, observant, master of practical problem-solving. Engages fully when there's a real problem to solve.","Driven by understanding how things work and fixing them efficiently."],ISFP:["Adventurer","Flexible, charming, quietly creative and deeply values-aligned. Expresses identity through actions and aesthetics.","Motivated by authentic self-expression and present-moment engagement."],ESTP:["Entrepreneur","Bold, perceptive, action-oriented, thrives in dynamic environments. Negotiates and acts faster than most think.","Driven by immediate results, excitement, and practical impact."],ESFP:["Entertainer","Spontaneous, fun-loving, energises groups with warmth and enthusiasm. Fully present and generous in every interaction.","Motivated by enjoyment, social connection, and bringing joy to others."]};

const ENN_DATA = {"1":{name:"The Reformer",core:"Motivated by doing things right — fears being corrupt, flawed, or wrong",gift:"Brings integrity, precision, and principled standards to every environment",growth:"Learn that imperfection is not failure — good enough is sometimes perfect",stress:"Under stress, becomes critical, rigid, and self-righteous",wing:"Leans toward Type 9 (calm idealist) or Type 2 (principled helper)"},"2":{name:"The Helper",core:"Motivated by being needed — fears being unloved or unwanted",gift:"Creates belonging and genuine care wherever they go",growth:"Receive help as readily as you give it — your needs matter equally",stress:"Under stress, becomes controlling, possessive, and resentful",wing:"Leans toward Type 1 (orderly helper) or Type 3 (ambitious helper)"},"3":{name:"The Achiever",core:"Motivated by success and recognition — fears being worthless or a failure",gift:"Turns vision into tangible results with remarkable efficiency",growth:"Your value exists independent of your achievements — rest is not regression",stress:"Under stress, becomes image-obsessed, deceptive, and workaholic",wing:"Leans toward Type 2 (charming achiever) or Type 4 (artistic achiever)"},"4":{name:"The Individualist",core:"Motivated by authenticity and depth — fears being ordinary or without identity",gift:"Brings creative depth, emotional intelligence, and originality",growth:"Ordinary moments contain extraordinary meaning — presence over drama",stress:"Under stress, becomes self-absorbed, moody, and withdrawn",wing:"Leans toward Type 3 (expressive achiever) or Type 5 (introspective artist)"},"5":{name:"The Investigator",core:"Motivated by knowledge and competence — fears being useless or overwhelmed",gift:"Provides the deepest expertise and most thorough analysis in any field",growth:"Share your knowledge before it is complete — connection requires vulnerability",stress:"Under stress, becomes detached, hoarding, and isolated",wing:"Leans toward Type 4 (imaginative investigator) or Type 6 (loyal analyst)"},"6":{name:"The Loyalist",core:"Motivated by security and support — fears being abandoned or without guidance",gift:"The most reliable, thorough, and trustworthy presence in any team",growth:"Your inner guidance is as trustworthy as external authority — trust it",stress:"Under stress, becomes anxious, suspicious, and reactive",wing:"Leans toward Type 5 (intellectual guardian) or Type 7 (optimistic loyalist)"},"7":{name:"The Enthusiast",core:"Motivated by freedom and possibility — fears pain, limitation, or missing out",gift:"Brings contagious optimism and the ability to see opportunity everywhere",growth:"Depth over breadth — staying with discomfort reveals what scattered energy misses",stress:"Under stress, becomes scattered, impulsive, and escapist",wing:"Leans toward Type 6 (grounded enthusiast) or Type 8 (assertive visionary)"},"8":{name:"The Challenger",core:"Motivated by control and strength — fears being controlled or appearing weak",gift:"Protects the vulnerable and creates change at a scale others cannot imagine",growth:"Vulnerability is strength — letting people in multiplies your impact",stress:"Under stress, becomes domineering, confrontational, and destructive",wing:"Leans toward Type 7 (bold expansionist) or Type 9 (calm protector)"},"9":{name:"The Peacemaker",core:"Motivated by harmony and peace — fears conflict and separation",gift:"Creates consensus and an environment where everyone feels included",growth:"Your presence and opinion matter — showing up fully is an act of love",stress:"Under stress, becomes disengaged, stubborn, and avoidant",wing:"Leans toward Type 8 (assertive mediator) or Type 1 (principled peacemaker)"}};

const LP_DATA = {1:{name:"The Leader",desc:"Independent, pioneering drive — here to initiate and lead",shadow:"Lone wolf tendency; struggles to delegate or accept help"},2:{name:"The Peacemaker",desc:"Diplomatic, cooperative, partnership-oriented energy",shadow:"Over-accommodates others; avoids necessary conflict"},3:{name:"The Achiever",desc:"Success-driven, adaptable, image-conscious high performer",shadow:"Defines worth by accomplishments; workaholic tendencies"},4:{name:"The Builder",desc:"Disciplined, methodical, creates lasting structures",shadow:"Rigidity; struggles with rapid change or ambiguity"},5:{name:"The Freedom Seeker",desc:"Adventurous, versatile, craves variety and new experience",shadow:"Commitment avoidance; scattered energy"},6:{name:"The Nurturer",desc:"Responsible, caring, deepest fulfilment through service",shadow:"Self-neglect; difficulty receiving help from others"},7:{name:"The Seeker",desc:"Analytical, introspective, truth-oriented deep thinker",shadow:"Over-analysis paralysis; withdraws when overwhelmed"},8:{name:"The Powerhouse",desc:"Ambitious, authoritative, built for material mastery",shadow:"Control issues; struggles to show vulnerability"},9:{name:"The Humanitarian",desc:"Compassionate, wise, service to something larger",shadow:"Martyr complex; gives too much, burns out silently"},11:{name:"Master 11 — The Illuminator",desc:"Highly intuitive visionary; inspires without trying",shadow:"Intense nervous energy when vision is not being lived"},22:{name:"Master 22 — The Master Builder",desc:"Visionary and practical; built to create at generational scale",shadow:"Collapses under own weight; pressure turns to anxiety"},33:{name:"Master 33 — The Teacher",desc:"Healing, inspiration, compassionate leadership at scale",shadow:"Carries everyone's pain; forgets their own needs"}};

const ELEM_DATA = {Fire:{desc:"Passionate, bold, charismatic — leads with energy and inspires others naturally",lucky:"Crimson Red, Burnt Orange, Deep Gold",peak:"10:00 AM – 1:00 PM"},Earth:{desc:"Stable, practical, grounded — builds lasting things with precision and patience",lucky:"Emerald Green, Royal Blue, Soft Silver",peak:"8:00 AM – 11:00 AM"},Water:{desc:"Intuitive, empathetic, deep — reads the room before thinking it, flows around obstacles",lucky:"Deep Blue, Sea Green, Pearl White",peak:"7:00 AM – 10:00 AM"},Air:{desc:"Quick-minded, social, idea-rich — connects everything to everything, thrives on variety",lucky:"Sky Blue, Lavender, Bright Yellow",peak:"9:00 AM – 12:00 PM"}};

const COMM_STYLE = {ISTJ:"Direct and precise. Give them data, structure, and clear timelines — not emotion. Allow processing time before expecting a decision.",INTJ:"Skip small talk and get to the point. Respect their autonomy. Disagree with logic, not emotion. They respect confidence.",ENTJ:"Match their pace and be direct. Disagree with logic, not feeling. They respect those who push back intelligently.",INTP:"Engage through intellectual discussion. Present problems as puzzles to solve together. Do not rush conclusions.",INFJ:"Needs authenticity above all. They sense inauthenticity instantly. Have meaningful conversations, not transactional ones.",INFP:"Needs emotional safety before opening up. Validate feelings first, solutions second. Never dismiss their values.",ENFJ:"Check in personally before getting to business. Express appreciation explicitly. They give freely and need to feel that is noticed.",ENFP:"Match their energy and enthusiasm for ideas. Give space to brainstorm without immediate critique.",ISFJ:"Warm, personal communication. Show genuine appreciation for their contributions. Avoid sudden changes without explanation.",ESFJ:"Acknowledge their efforts publicly. Address issues privately and gently. They value harmony above most things.",ESTJ:"Be punctual, prepared, and professional. Respect hierarchy. Get to the point with a clear structure.",ESFP:"Be present and engaged. Match their warmth. Avoid heavy structure or rigid timelines — they lose interest quickly.",ISTP:"Keep it brief and competent. Show, do not tell. Respect their need for space and autonomy.",ISFP:"Be patient and non-confrontational. Appreciate their sensitivity as a strength, not a weakness.",ESTP:"Be direct and action-oriented. Skip lengthy processes. Make it energetic and tangible.",ENTP:"Challenge them intellectually. They love a good debate — do not take their devil's advocate personally."};

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
  return{lp,bd,py,expr,soul,pers,sign,element:ELEM[sign]};
}

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
  const ei=ocean.E>=55?"E":"I",ns=ocean.O>=55?"N":"S",tf=ocean.A>=55?"F":"T",jp=ocean.C>=55?"J":"P";
  return{ocean,ennType,discDom,discLabel:discLabels[discDom],mbti:ei+ns+tf+jp};
}

function buildReport(name,role,bg,resumeText,nums){
  const combined=[name,role,bg,resumeText].filter(Boolean).join(" ");
  const scores=scoreText(combined);
  const{ocean,ennType,discDom,discLabel,mbti}=scores;
  const mbtiData=MBTI_MAP[mbti]||MBTI_MAP["ISTJ"];
  const ennData=ENN_DATA[ennType];
  const lpData=nums?LP_DATA[nums.lp]||LP_DATA[1]:null;
  const elemData=nums?ELEM_DATA[nums.element]:null;
  const archetypes={INTJ:"The Strategic Visionary",INTP:"The Analytical Inventor",ENTJ:"The Executive Architect",ENTP:"The Disruptive Thinker",INFJ:"The Principled Idealist",INFP:"The Authentic Creator",ENFJ:"The Inspiring Leader",ENFP:"The Passionate Connector",ISTJ:"The Grounded Executor",ISFJ:"The Loyal Guardian",ESTJ:"The Decisive Organiser",ESFJ:"The Caring Facilitator",ISTP:"The Pragmatic Craftsman",ISFP:"The Quiet Innovator",ESTP:"The Bold Opportunist",ESFP:"The Energetic Connector"};
  const headline=archetypes[mbti]||"The Analytical Professional";
  const traits=[];if(ocean.C>=70)traits.push("precision");if(ocean.E>=65)traits.push("leadership");if(ocean.O>=65)traits.push("vision");if(ocean.A>=65)traits.push("empathy");if(ocean.N<=35)traits.push("resilience");
  const tagline=traits.length>0?`${traits.slice(0,2).join(" and ")} — a ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy${nums?" and "+nums.element+" element":""}`:(`A ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy`);
  const summary=name+" is a "+mbtiData[0]+": "+mbtiData[1].toLowerCase()+" As a "+ennData.name+", their core drive centres on: "+ennData.core.toLowerCase().replace("motivated by ","");
  const oceanText={O:ocean.O>=65?"High openness signals an orientation toward strategy, innovation, and systems thinking over routine execution.":ocean.O>=50?"Balanced openness — creative thinking grounded in practicality; adapts ideas to real-world constraints.":"Preference for proven methods; consistency and reliability over experimentation.",C:ocean.C>=70?"Exceptional conscientiousness — rarely misses a detail; work product is immaculate and delivery is consistent.":ocean.C>=55?"Strong discipline; sets high standards and reliably meets them under pressure.":"Flexible and adaptive; thrives in dynamic environments that reward agility over process.",E:ocean.E>=65?"High extraversion — energised by people, leadership, and public-facing roles; a natural front-person.":ocean.E>=45?"Balanced; equally effective collaborating or working independently depending on context.":"Introversion-leaning — does best work in deep focus; prefers meaningful depth over broad social networks.",A:ocean.A>=65?"Highly collaborative; builds genuine trust and consensus without losing strategic direction.":ocean.A>=45?"Direct yet cooperative; holds positions under pressure without becoming combative.":"Task-focused; prioritises outcomes over harmony — effective where results matter more than relationships.",N:ocean.N<=35?"Emotionally stable under pressure — a calming anchor for teams in high-stakes situations.":ocean.N<=50?"Generally composed with a healthy attentiveness to risk and consequence.":"Emotionally attuned — this awareness of risk is a professional asset in compliance and advisory roles."};
  const strengths=[];if(ocean.C>=70)strengths.push("Meticulous attention to detail and quality");if(ocean.C>=60)strengths.push("Disciplined planning and consistent execution");if(ocean.E>=60)strengths.push("Natural ability to lead and influence teams");if(ocean.O>=60)strengths.push("Strategic thinking and creative problem-solving");if(ocean.A>=60)strengths.push("Builds genuine trust and loyalty with people");if(ocean.N<=40)strengths.push("Stays clear and decisive under high pressure");if(combined.toLowerCase().includes("international")||combined.toLowerCase().includes("cross-border"))strengths.push("Cross-cultural and international competency");if(combined.toLowerCase().includes("data")||combined.toLowerCase().includes("analytic"))strengths.push("Data-driven analytical and insight capability");
  const roles=[];if(ocean.C>=70&&ocean.O<=60)roles.push("Senior Auditor / Assurance Director");if(ocean.C>=65)roles.push("Chief Financial Officer (CFO)");if(ocean.O>=65&&ocean.C>=60)roles.push("Strategy & Transformation Lead");if(ocean.E>=65&&discDom==="D")roles.push("Managing Director / Executive Leader");if(ennType==="5"||ennType==="1")roles.push("Risk & Governance Advisor");if(ocean.O>=65)roles.push("Innovation & Digital Transformation Lead");if(ennType==="3"||discDom==="D")roles.push("Chief Risk Officer (CRO)");
  const blindSpots={ISTJ:"Tendency to rely on precedent — may resist beneficial change that lacks historical justification.",INTJ:"May communicate with insufficient warmth — technical brilliance can overshadow people-first leadership.",ENTJ:"Pace of execution can outrun team capacity — slowing down occasionally improves outcome quality.",INTP:"Analysis can delay action — perfect information rarely exists; confident decisions beat paralysis.",ESTJ:"Rigidity under pressure — when rules conflict with reality, flexibility creates better outcomes.",ENFJ:"Over-investment in others growth — sustainable impact requires protecting your own energy first."};
  const blind=blindSpots[mbti]||"Depth of expertise can create blind spots about adjacent skills that unlock the next career level.";
  const wealthMap={D:"Wealth through bold moves — you build fast but must guard against overconfidence in high-stakes decisions.",I:"Wealth through relationships and opportunities — your network is your net worth; invest in people deliberately.",S:"Wealth through consistency — slow, diversified accumulation outperforms speculation for your psychological profile.",C:"Wealth through expertise — your highest ROI always comes from deepening specialisation; certifications compound."};
  const wealth=wealthMap[discDom]||"Wealth comes through disciplined long-term strategy aligned with your professional expertise.";
  const cy=new Date().getFullYear();
  const roadmap=[{y:String(cy),t:"Consolidate",a:"Deepen mastery in your core domain. Become the undisputed expert in your immediate team before expanding scope."},{y:String(cy+1),t:"Lead",a:"Step into formal leadership. Manage engagements, mentor juniors, and build your external brand through writing or speaking."},{y:String(cy+2),t:"Diversify",a:"Explore adjacent opportunities — board advisory, consulting, digital transformation, or sector specialisation."}];
  const growth=[ocean.E<55?"Build visibility — your expertise deserves a larger audience. Write, speak, or post consistently.":"Delegate more deeply — your growth ceiling is the size of the team you can develop.",ocean.O<55?"Experiment with one unconventional approach per quarter — innovation is a muscle, not a talent.":"Channel creative energy into fewer, deeper bets — breadth dilutes impact below a threshold."];
  const quotes={"1":"The standard you walk past is the standard you accept — and no standard is too high when it matters.","2":"The greatest leaders are remembered not for what they built, but for who they built it with.","3":"Success is not the destination. It is the habit of people who refused to stop showing up.","4":"Ordinary done with extraordinary care becomes the rarest thing in the world.","5":"The map is not the territory — but the person who draws the most accurate map changes how everyone else moves.","6":"Trust is not given or taken. It is built, brick by brick, in the moments that do not feel important.","7":"The life well-lived is not the one with the most experiences, but the one most fully experienced.","8":"Power is not the ability to command. It is the wisdom to know when to stand still.","9":"Peace is not the absence of conflict. It is the presence of someone who refuses to add to it."};
  const quote=quotes[ennType]||"Integrity is not what you do when others are watching. It is what you do when they are not.";
  const commStyle=COMM_STYLE[mbti]||"Prefers clear, direct communication with sufficient context.";
  const numSynthesis=nums&&lpData?("Life Path "+nums.lp+" ("+lpData.name+") "+(nums.element==="Earth"||ocean.C>=65?"reinforces":"complements")+" the "+mbtiData[0]+" profile — both demand "+(nums.element==="Earth"||ocean.C>=65?"structure, precision, and long-term thinking.":"impact, meaning, and transformative contribution.")+" Personal Year "+nums.py+": "+({1:"new beginnings — plant seeds now",2:"nurture relationships",3:"express and create",4:"build foundations",5:"embrace change",6:"serve and lead",7:"reflect and study",8:"harvest career results",9:"complete old cycles"})[nums.py]||"a year of transition"):"";
  return{headline,tagline,summary,ocean,oceanText,mbti,mbtiData,ennType,ennData,discDom,discLabel,strengths:strengths.slice(0,4),roles:[...new Set(roles)].slice(0,3),blind,wealth,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData,name};
}

function RadarChart({ocean}){
  const dims=["O","C","E","A","N"],labels=["Open","Consc","Extra","Agree","Stable"],colors=["#7C9CBF","#C9A84C","#7DBF8A","#C97A7A","#B07DBF"];
  const cx=110,cy=110,r=75,n=dims.length;
  const angle=i=>(Math.PI*2*(i/n))-Math.PI/2;
  const pt=(i,val)=>{const a=angle(i),pct=val/100;return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)];};
  const polyPoints=dims.map((d,i)=>pt(i,ocean[d])).map(p=>p.join(",")).join(" ");
  return(
    <svg viewBox="0 0 220 220" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto"}}>
      {[0.25,0.5,0.75,1].map(pct=>{
        const pts=dims.map((_,i)=>{const a=angle(i);return[cx+r*pct*Math.cos(a),cy+r*pct*Math.sin(a)].join(",")}).join(" ");
        return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>;
      })}
      {dims.map((_,i)=>{const[x,y]=pt(i,1);return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>;;})}
      <polygon points={polyPoints} fill="rgba(201,168,76,0.12)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
      {dims.map((d,i)=>{const[x,y]=pt(i,ocean[d]);return <circle key={d} cx={x} cy={y} r="4" fill={colors[i]}/>;;})}
      {dims.map((d,i)=>{
        const a=angle(i),lx=cx+(r+22)*Math.cos(a),ly=cy+(r+22)*Math.sin(a);
        return <text key={d} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={colors[i]} fontFamily="DM Sans,sans-serif" fontWeight="500">{labels[i]}</text>;
      })}
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
      if(file.type==="text/plain"){resolve(new TextDecoder().decode(e.target.result).slice(0,4000));return;}
      const raw=new TextDecoder("latin1").decode(new Uint8Array(e.target.result));
      const m=raw.match(/\(([^)]{2,150})\)/g)||[];
      resolve(m.map(x=>x.slice(1,-1)).filter(x=>/[a-zA-Z]{3,}/.test(x)).join(" ").slice(0,4000));
    };
    reader.readAsArrayBuffer(file);
  });
}

function analyseCompatibility(r1,r2){
  const{ocean:o1,mbti:m1,ennType:e1,discDom:d1}=r1;
  const{ocean:o2,mbti:m2,ennType:e2,discDom:d2}=r2;
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
  if(discMatch)synergies.push("DISC complementarity — different strengths combine without competing");
  if(eDiff>25)tensions.push("Social energy mismatch — one needs more time alone, the other more together");
  if(Math.abs(o1.C-o2.C)>25)tensions.push("Structure vs flexibility — different needs around planning and consistency");
  if(d1===d2&&d1==="D")tensions.push("Both Dominant — power struggles possible; clear role boundaries needed");
  if(e1===e2)tensions.push("Same Enneagram type — share blind spots and can reinforce each other's shadow");
  return{overall,oceanScore,mbtiScore,ennScore,discScore,synergies,tensions,label:overall>=85?"Exceptional":overall>=75?"Strong":overall>=65?"Compatible":"Complementary"};
}

function exportPDF(report){
  const{headline,tagline,summary,ocean,oceanText,mbti,mbtiData,ennType,ennData,discLabel,strengths,roles,blind,wealth,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData,name}=report;
  const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
  const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};
  const bars=Object.entries(ocean).map(([k,v])=>`<div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:10px;color:#888;letter-spacing:1.5px;text-transform:uppercase">${BL[k]}</span><span style="font-size:12px;color:${BC[k]};font-weight:600">${v}%</span></div><div style="height:4px;background:#f0ece4;border-radius:2px"><div style="height:100%;width:${v}%;background:${BC[k]};border-radius:2px"></div></div><p style="font-size:11px;color:#666;margin:5px 0 0;line-height:1.6">${oceanText[k]}</p></div>`).join("");
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Personal Intelligence Report - ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:"DM Sans",sans-serif;background:#FAFAF8;color:#1a1a1a;font-size:12px;line-height:1.7}
.cover{background:#090E15;color:#F0EAD6;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px 60px;page-break-after:always}
.eyebrow{font-size:9px;letter-spacing:5px;color:#C9A84C;text-transform:uppercase;margin-bottom:32px}
.cname{font-family:"Cormorant Garamond",serif;font-size:52px;font-weight:300;margin-bottom:14px;letter-spacing:1px}
.arch{font-family:"Cormorant Garamond",serif;font-size:22px;font-style:italic;color:#C9A84C;margin-bottom:12px}
.ctag{font-size:13px;color:#6a8090;max-width:480px;margin:0 auto 28px;line-height:1.8}
.chips{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.chip{border:1px solid rgba(201,168,76,0.5);color:#C9A84C;font-size:9px;letter-spacing:2px;padding:6px 18px;border-radius:20px;text-transform:uppercase}
.privacy{font-size:9px;color:#2a3a44;letter-spacing:1px;margin-top:32px}
.page{max-width:800px;margin:0 auto;padding:0 56px}
.sec{padding:36px 0;border-bottom:1px solid #e8e4dc}
.sl{font-size:8px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-bottom:8px}
.st{font-family:"Cormorant Garamond",serif;font-size:26px;font-weight:400;color:#0a0e14;margin-bottom:18px}
p{color:#444;line-height:1.85}
.two{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.cl{font-size:8px;letter-spacing:3px;color:#aaa;text-transform:uppercase;margin-bottom:10px}
.li{font-size:11px;color:#555;line-height:1.8;margin-bottom:4px}
.hl{background:#FBF7EE;border-left:3px solid #C9A84C;padding:14px 18px;margin-top:14px;border-radius:0 4px 4px 0}
.rm{padding-left:16px;border-left:2px solid #C9A84C;margin-bottom:16px}
.ry{font-size:8px;color:#C9A84C;letter-spacing:3px;font-weight:500;margin-bottom:4px;text-transform:uppercase}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.gc{background:#F0ECE6;border-radius:8px;padding:12px 8px;text-align:center}
.gv{font-family:"Cormorant Garamond",serif;font-size:22px;color:#C9A84C;font-weight:400}
.gl{font-size:8px;letter-spacing:2px;color:#999;text-transform:uppercase;margin-top:3px}
${nums?`.ngrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}.nc{background:#F5F2EC;border:1px solid #e8e4dc;border-radius:8px;padding:14px;text-align:center}.nn{font-family:"Cormorant Garamond",serif;font-size:34px;font-weight:300;color:#C9A84C}.nl{font-size:8px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:4px}`:""}
.qsec{background:#090E15;padding:60px 56px;text-align:center}
.qt{font-family:"Cormorant Garamond",serif;font-size:22px;font-style:italic;font-weight:300;color:#F0EAD6;line-height:1.7;max-width:580px;margin:0 auto 14px}
.qa{font-size:8px;color:#C9A84C;letter-spacing:4px;text-transform:uppercase}
.ft{text-align:center;padding:18px 56px;font-size:8px;color:#aaa;letter-spacing:1.5px}
@media print{.cover{page-break-after:always}}
</style></head><body>
<div class="cover">
<div class="eyebrow">Personal Intelligence Report · ${new Date().toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</div>
<div class="cname">${name}</div><div class="arch">${headline}</div><p class="ctag">${tagline}</p>
<div class="chips"><span class="chip">${mbti}</span><span class="chip">Enneagram ${ennType}</span><span class="chip">DISC — ${discLabel}</span>${nums?"<span class=\"chip\">Life Path "+nums.lp+"</span><span class=\"chip\">"+nums.element+"</span>":""}</div>
<div class="privacy">🔒 Generated locally in your browser — no data was stored or transmitted</div>
</div>
<div class="page">
<div class="sec"><div class="sl">01 — Profile</div><div class="st">Who You Are</div><p>${summary}</p></div>
<div class="sec"><div class="sl">02 — Big Five</div><div class="st">OCEAN Personality Dimensions</div>${bars}</div>
<div class="sec"><div class="sl">03 — MBTI</div><div class="st">${mbti} · ${mbtiData[0]}</div><p style="margin-bottom:12px">${mbtiData[1]}</p><div class="hl"><p><em>${mbtiData[2]}</em></p></div></div>
<div class="sec"><div class="sl">04 — Enneagram</div><div class="st">Type ${ennType} · ${ennData.name}</div><p style="margin-bottom:10px">${ennData.core}</p><div class="grid4"><div class="gc"><div class="gv">Gift</div><p style="font-size:10px;color:#555;margin-top:4px">${ennData.gift}</p></div><div class="gc"><div class="gv">Growth</div><p style="font-size:10px;color:#555;margin-top:4px">${ennData.growth}</p></div><div class="gc"><div class="gv">Stress</div><p style="font-size:10px;color:#555;margin-top:4px">${ennData.stress}</p></div><div class="gc"><div class="gv">Wing</div><p style="font-size:10px;color:#555;margin-top:4px">${ennData.wing}</p></div></div></div>
<div class="sec"><div class="sl">05 — Communication</div><div class="st">How to Work With ${name.split(" ")[0]}</div><p>${commStyle}</p></div>
${nums&&lpData?`<div class="sec"><div class="sl">06 — Numerology</div><div class="st">Numeric Patterns</div><div class="ngrid">${[["Life Path",nums.lp],["Expression",nums.expr],["Soul Urge",nums.soul],["Birth Day",nums.bd],["Personality",nums.pers],["Personal Year",nums.py]].map(([l,n])=>`<div class="nc"><div class="nn">${n}</div><div class="nl">${l}</div></div>`).join("")}</div><p style="margin-bottom:8px"><strong>Life Path ${nums.lp} — ${lpData.name}:</strong> ${lpData.desc}</p><p style="margin-bottom:8px"><strong>${nums.element} Element (${nums.sign}):</strong> ${elemData?.desc}</p><div class="hl"><p>${numSynthesis}</p></div></div>`:""}
<div class="sec"><div class="sl">07 — Career</div><div class="st">Career Intelligence</div><div class="two"><div><div class="cl">Strengths</div>${strengths.map(s=>`<div class="li">◆ ${s}</div>`).join("")}</div><div><div class="cl">Ideal Roles</div>${roles.map(r=>`<div class="li">→ ${r}</div>`).join("")}</div></div><div class="hl"><p><strong>Blind spot:</strong> ${blind}</p></div></div>
<div class="sec"><div class="sl">08 — Roadmap</div><div class="st">3-Year Strategy</div>${roadmap.map(r=>`<div class="rm"><div class="ry">${r.y} — ${r.t}</div><p>${r.a}</p></div>`).join("")}</div>
<div class="sec"><div class="sl">09 — Wealth and Growth</div><div class="st">Financial Psychology and Growth Edges</div><p style="margin-bottom:12px">${wealth}</p>${growth.map(g=>`<div class="li" style="margin-bottom:8px">▸ ${g}</div>`).join("")}</div>
</div>
<div class="qsec"><p class="qt">"${quote}"</p><div class="qa">— ${headline}</div></div>
<div class="ft">PERSONAL INTELLIGENCE REPORT · ${name.toUpperCase()} · BIG FIVE · MBTI · ENNEAGRAM · DISC${nums?" · NUMEROLOGY · "+nums.element.toUpperCase():""} · 🔒 ZERO DATA STORED</div>
</body></html>`;
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name.replace(/\s+/g,"-")+"-Intelligence-Report.html";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
}

const G="#C9A84C",DK="#090E15",D2="#0E1720",D3="#131F2D",BR="rgba(255,255,255,0.07)",TX="#F0EAD6",DM="#7a8fa0",FA="#2e4050";
const pg={minHeight:"100vh",background:DK,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",fontFamily:"'DM Sans',system-ui,sans-serif"};
const crd={background:D2,border:"1px solid "+BR,borderRadius:20,padding:"40px 32px",width:"100%",maxWidth:560,boxShadow:"0 32px 80px rgba(0,0,0,0.6)"};
const wid={background:D2,border:"1px solid "+BR,borderRadius:20,padding:"0 0 40px",width:"100%",maxWidth:720,boxShadow:"0 32px 80px rgba(0,0,0,0.6)"};
const lbl={display:"block",fontSize:9,color:G,letterSpacing:3,textTransform:"uppercase",marginBottom:6,marginTop:18};
const inp={width:"100%",padding:"12px 14px",background:DK,border:"1px solid "+BR,borderRadius:9,color:TX,fontSize:13,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"};
const btnG={width:"100%",padding:"15px",background:"linear-gradient(135deg,#C9A84C,#9a7030)",color:DK,border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"};
const btnL={width:"100%",padding:"13px",background:"transparent",color:G,border:"1px solid "+G,borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:20};
const btnS={padding:"11px 16px",background:D3,border:"1px solid "+BR,color:DM,borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"};
const bod={color:"#8aabbb",fontSize:13,lineHeight:1.9};
const hl={background:"rgba(201,168,76,0.07)",borderLeft:"3px solid #C9A84C",borderRadius:"0 8px 8px 0",padding:"12px 16px",marginTop:12};
const BC={O:"#7C9CBF",C:"#C9A84C",E:"#7DBF8A",A:"#C97A7A",N:"#B07DBF"};
const BL={O:"Openness",C:"Conscientiousness",E:"Extraversion",A:"Agreeableness",N:"Neuroticism"};

function Sec({title,sub,children}){return <div style={{marginBottom:24,borderBottom:"1px solid "+BR,paddingBottom:22}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:12}}><span style={{fontSize:9,letterSpacing:3,color:G,textTransform:"uppercase"}}>{title}</span>{sub&&<span style={{fontSize:11,color:FA}}>— {sub}</span>}</div>{children}</div>;}
function Tag({children}){return <span style={{background:D3,border:"1px solid rgba(201,168,76,0.4)",color:G,fontSize:9,letterSpacing:1.5,padding:"4px 11px",borderRadius:20,textTransform:"uppercase"}}>{children}</span>;}

export default function App(){
  const[mode,setMode]=useState("main");
  const[stage,setStage]=useState("form");
  const[name,setName]=useState(""),  [dob,setDob]=useState(""),  [role,setRole]=useState(""),  [bg,setBg]=useState("");
  const[file,setFile]=useState(null),[rText,setRText]=useState("");
  const[report,setReport]=useState(null);
  const[c1,setC1]=useState({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});
  const[c2,setC2]=useState({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});
  const[compat,setCompat]=useState(null);
  const fileRef=useRef(),cf1=useRef(),cf2=useRef();
  let liveNums=null;if(name&&dob){try{liveNums=calcNums(name,dob);}catch{liveNums=null;}}

  function generate(){
    if(!name)return;
    const nums=(name&&dob)?calcNums(name,dob):null;
    setReport(buildReport(name,role,bg,rText,nums));setStage("report");
  }
  function runCompat(){
    if(!c1.name||!c2.name)return;
    const n1=(c1.name&&c1.dob)?calcNums(c1.name,c1.dob):null;
    const n2=(c2.name&&c2.dob)?calcNums(c2.name,c2.dob):null;
    const r1=buildReport(c1.name,c1.role,c1.bg,c1.rText,n1);
    const r2=buildReport(c2.name,c2.role,c2.bg,c2.rText,n2);
    setC1(p=>({...p,report:r1}));setC2(p=>({...p,report:r2}));
    setCompat(analyseCompatibility(r1,r2));setStage("compat");
  }
  function reset(){setStage("form");setName("");setDob("");setRole("");setBg("");setFile(null);setRText("");setReport(null);}

  const Nav=()=>(
    <div style={{display:"flex",gap:4,marginBottom:24,background:DK,borderRadius:10,padding:4}}>
      {[["main","Individual Report"],["compat","Compatibility"]].map(([m,l])=>(
        <button key={m} onClick={()=>{setMode(m);setStage("form");}} style={{flex:1,padding:"9px",background:mode===m?"linear-gradient(135deg,#C9A84C,#9a7030)":D3,border:"none",borderRadius:8,color:mode===m?DK:DM,fontSize:12,fontWeight:mode===m?600:400,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
      ))}
    </div>
  );

  if(stage==="form") return(
    <div style={pg}><div style={crd}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:12}}>Personal Intelligence Engine</div>
        <h1 style={{fontSize:38,color:TX,lineHeight:1.1,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300}}>Know Your<br/><em style={{color:G}}>True Self</em></h1>
        <p style={{fontSize:13,color:DM,lineHeight:1.7,marginTop:10}}>Big Five · MBTI · Enneagram · DISC · Numerology</p>
      </div>
      <Nav/>
      {mode==="main"&&<>
        <label style={lbl}>Full Name *</label>
        <input style={inp} placeholder="Muhammad Hammad" value={name} onChange={e=>setName(e.target.value)}/>
        <label style={lbl}>Date of Birth <span style={{color:FA,fontWeight:400}}>(unlocks numerology)</span></label>
        <input style={inp} type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
        {liveNums&&<div style={{background:DK,borderRadius:10,padding:"12px 16px",marginTop:8,display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
          {[["Life Path",liveNums.lp,G],["Expression",liveNums.expr,"#7C9CBF"],["Personal Year",liveNums.py,"#7DBF8A"]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:8,color:FA,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{l}</div></div>
          ))}
          <div style={{marginLeft:"auto",textAlign:"center"}}><div style={{fontSize:12,color:"#7DBF8A",fontWeight:500}}>{liveNums.element}</div><div style={{fontSize:9,color:FA}}>{liveNums.sign}</div></div>
        </div>}
        <label style={lbl}>Current Role</label>
        <input style={inp} placeholder="Assistant Manager, EY Melbourne" value={role} onChange={e=>setRole(e.target.value)}/>
        <label style={lbl}>Brief Context <span style={{color:FA,fontWeight:400}}>(optional)</span></label>
        <textarea style={{...inp,height:58,resize:"none"}} placeholder="6 years Big 4 audit, building a consulting side-business..." value={bg} onChange={e=>setBg(e.target.value)}/>
        <label style={lbl}>Resume / CV <span style={{color:FA,fontWeight:400}}>(PDF or TXT)</span></label>
        <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{setFile(e.target.files[0]);extractText(e.target.files[0]).then(setRText);}}/>
        <div onClick={()=>fileRef.current.click()} style={{background:DK,border:"2px dashed "+(file?G:BR),borderRadius:10,padding:16,textAlign:"center",cursor:"pointer",marginBottom:6}}>
          {file?<><span style={{fontSize:14}}>✓ </span><span style={{color:G,fontSize:12,fontWeight:600}}>{file.name}</span></>:<><span style={{fontSize:18}}>📄</span><br/><span style={{color:FA,fontSize:12}}>Click to upload (optional but improves accuracy)</span></>}
        </div>
        <div style={{background:DK,borderRadius:8,padding:"10px 14px",marginBottom:20,display:"flex",gap:8}}>
          <span style={{fontSize:14,marginTop:1}}>🔒</span>
          <p style={{fontSize:10,color:FA,lineHeight:1.6,margin:0}}><strong style={{color:"#4a7060"}}>Your data never leaves this browser.</strong> No servers, no storage, no accounts. Your CV is read once and discarded when you close the tab.</p>
        </div>
        <button style={{...btnG,opacity:name?1:0.35}} disabled={!name} onClick={generate}>Generate Intelligence Report →</button>
      </>}
      {mode==="compat"&&<>
        <p style={{fontSize:12,color:DM,marginBottom:20,lineHeight:1.6}}>Enter two people to analyse personality compatibility — professionally and personally.</p>
        {[[c1,setC1,cf1,"Person 1"],[c2,setC2,cf2,"Person 2"]].map(([p,setter,ref,label])=>(
          <div key={label} style={{background:DK,borderRadius:10,padding:16,marginBottom:10}}>
            <div style={{fontSize:10,color:G,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{label}</div>
            <input style={{...inp,marginBottom:8}} placeholder="Full Name *" value={p.name} onChange={e=>setter(x=>({...x,name:e.target.value}))}/>
            <input style={{...inp,marginBottom:8}} type="date" value={p.dob} onChange={e=>setter(x=>({...x,dob:e.target.value}))}/>
            <input style={{...inp,marginBottom:8}} placeholder="Role (optional)" value={p.role} onChange={e=>setter(x=>({...x,role:e.target.value}))}/>
            <input ref={ref} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];extractText(f).then(t=>setter(x=>({...x,file:f,rText:t})));}}/>
            <div onClick={()=>ref.current.click()} style={{background:D2,border:"1px dashed "+(p.file?G:BR),borderRadius:8,padding:10,textAlign:"center",cursor:"pointer",fontSize:11,color:p.file?G:FA}}>
              {p.file?"✓ "+p.file.name:"Upload Resume (optional)"}
            </div>
          </div>
        ))}
        <button style={{...btnG,marginTop:8,opacity:(c1.name&&c2.name)?1:0.35}} disabled={!c1.name||!c2.name} onClick={runCompat}>Analyse Compatibility →</button>
      </>}
    </div></div>
  );

  if(stage==="compat"&&compat) return(
    <div style={pg}><div style={crd}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:14}}>Compatibility Report</div>
        <h2 style={{fontSize:24,color:TX,fontFamily:"'Cormorant Garamond',serif",fontWeight:300,marginBottom:6}}>{c1.report.name} × {c2.report.name}</h2>
        <div style={{fontSize:52,fontWeight:700,color:G,fontFamily:"'DM Sans',sans-serif",lineHeight:1}}>{compat.overall}%</div>
        <div style={{fontSize:13,color:DM,marginTop:4}}>{compat.label} compatibility</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:22}}>
        {[["OCEAN",compat.oceanScore,"#7C9CBF"],["MBTI",compat.mbtiScore,G],["Enn.",compat.ennScore,"#7DBF8A"],["DISC",compat.discScore,"#C97A7A"]].map(([l,v,c])=>(
          <div key={l} style={{background:DK,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div>
            <div style={{fontSize:8,color:FA,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {[c1.report,c2.report].map((r,i)=>(
          <div key={i} style={{background:DK,borderRadius:10,padding:14}}>
            <div style={{fontSize:11,color:G,fontWeight:600,marginBottom:5}}>{r.name}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>
              {[r.mbti,"E"+r.ennType,r.discLabel.slice(0,3)].map(t=><span key={t} style={{fontSize:9,color:DM,background:D2,padding:"2px 7px",borderRadius:4}}>{t}</span>)}
            </div>
            <div style={{fontSize:10,color:FA,fontStyle:"italic"}}>{r.headline}</div>
          </div>
        ))}
      </div>
      {compat.synergies.length>0&&<div style={{marginBottom:14}}>
        <div style={{fontSize:9,color:"#7DBF8A",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Synergies</div>
        {compat.synergies.map((s,i)=><div key={i} style={{fontSize:12,color:"#7DBF8A",lineHeight:1.7,marginBottom:4}}>✓ {s}</div>)}
      </div>}
      {compat.tensions.length>0&&<div style={{marginBottom:18}}>
        <div style={{fontSize:9,color:"#C97A7A",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Watch Out For</div>
        {compat.tensions.map((t,i)=><div key={i} style={{fontSize:12,color:"#C97A7A",lineHeight:1.7,marginBottom:4}}>△ {t}</div>)}
      </div>}
      <div style={hl}><p style={{...bod,fontSize:12}}><strong style={{color:G}}>Bottom line: </strong>{compat.overall>=85?"Exceptional pairing — complementary strengths with minimal friction. Rare and worth nurturing.":compat.overall>=75?"Strong compatibility with natural synergies. Minor tension areas are manageable with open communication.":compat.overall>=65?"Solid foundation — understanding each other's differences will unlock the relationship's full potential.":"Complementary but requires effort — the differences that create friction also create growth when channelled well."}</p></div>
      <button style={{...btnG,marginTop:20}} onClick={()=>{setStage("form");setCompat(null);setC1({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});setC2({name:"",dob:"",role:"",bg:"",file:null,rText:"",report:null});}}>Try Another Pair</button>
    </div></div>
  );

  if(stage==="report"&&report){
    const{headline,tagline,summary,ocean,oceanText,mbti,mbtiData,ennType,ennData,discLabel,strengths,roles,blind,wealth,roadmap,growth,quote,commStyle,numSynthesis,nums,lpData,elemData}=report;
    return(
      <div style={pg}><div style={wid}>
        <div style={{background:"linear-gradient(160deg,"+DK+" 0%,"+D3+" 100%)",borderRadius:"20px 20px 0 0",padding:"52px 36px 44px",textAlign:"center",borderBottom:"1px solid "+BR,marginBottom:28,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 40% 50%,rgba(201,168,76,0.05) 0%,transparent 60%)",pointerEvents:"none"}}/>
          <div style={{fontSize:9,letterSpacing:4,color:G,textTransform:"uppercase",marginBottom:14}}>Personal Intelligence Report</div>
          <h1 style={{fontSize:28,color:TX,margin:"8px 0 6px",fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300}}>{name}</h1>
          <p style={{fontSize:16,color:G,fontStyle:"italic",margin:"0 0 6px",fontFamily:"'Cormorant Garamond',serif"}}>{headline}</p>
          <p style={{fontSize:12,color:DM,fontStyle:"italic",margin:"0 0 18px",lineHeight:1.6,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>{tagline}</p>
          <div style={{display:"flex",justifyContent:"center",gap:7,flexWrap:"wrap",marginBottom:18}}>
            {[mbti,"Enneagram "+ennType,"DISC — "+discLabel,...(nums?["Life Path "+nums.lp,nums.element]:[])].map(t=><Tag key={t}>{t}</Tag>)}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap"}}>
            {Object.entries(ocean).map(([k,v])=><ScoreRing key={k} value={v} color={BC[k]} label={BL[k].slice(0,4)}/>)}
          </div>
        </div>

        <div style={{padding:"0 28px"}}>
          <button style={btnL} onClick={()=>exportPDF(report)}>↓ Download Full Report — Open HTML → Ctrl+P → Save as PDF</button>

          <Sec title="Who You Are">
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:22,alignItems:"center"}}>
              <RadarChart ocean={ocean}/>
              <p style={bod}>{summary}</p>
            </div>
          </Sec>

          <Sec title="Big Five — OCEAN" sub="Personality Dimensions">
            {Object.entries(ocean).map(([k,v])=>(
              <div key={k} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:10,color:BC[k],letterSpacing:1,fontWeight:500,textTransform:"uppercase"}}>{BL[k]}</span>
                  <span style={{fontSize:12,color:BC[k],fontWeight:600}}>{v}%</span>
                </div>
                <div style={{height:4,background:DK,borderRadius:2,overflow:"hidden",marginBottom:5}}>
                  <div style={{height:"100%",width:v+"%",background:BC[k],borderRadius:2}}/>
                </div>
                <p style={{...bod,fontSize:11,color:FA}}>{oceanText[k]}</p>
              </div>
            ))}
          </Sec>

          <Sec title={"MBTI — "+mbti} sub={mbtiData[0]}>
            <p style={bod}>{mbtiData[1]}</p>
            <div style={hl}><p style={{...bod,fontStyle:"italic",fontSize:12}}>{mbtiData[2]}</p></div>
          </Sec>

          <Sec title={"Enneagram — Type "+ennType} sub={ennData.name}>
            <p style={{...bod,marginBottom:12}}>{ennData.core}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Gift",ennData.gift,"#7DBF8A"],["Growth",ennData.growth,G],["Under Stress",ennData.stress,"#C97A7A"],["Wing",ennData.wing,"#7C9CBF"]].map(([l,t,c])=>(
                <div key={l} style={{background:DK,borderRadius:9,padding:"12px 14px",borderLeft:"3px solid "+c}}>
                  <div style={{fontSize:9,color:c,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <p style={{...bod,fontSize:11,color:DM}}>{t}</p>
                </div>
              ))}
            </div>
          </Sec>

          <Sec title={"DISC — "+discLabel}>
            <p style={bod}>{wealth}</p>
          </Sec>

          <Sec title="Communication Style" sub={"How to work with "+name.split(" ")[0]}>
            <p style={bod}>{commStyle}</p>
          </Sec>

          {nums&&lpData&&<Sec title="Numerology + Element">
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[["Life Path",nums.lp,G],["Expression",nums.expr,"#7C9CBF"],["Soul Urge",nums.soul,"#7DBF8A"],["Birth Day",nums.bd,"#C97A7A"],["Personality",nums.pers,"#B07DBF"],["Personal Year",nums.py,G]].map(([l,v,c])=>(
                <div key={l} style={{background:DK,border:"1px solid "+BR,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:26,fontWeight:700,color:c,lineHeight:1,fontFamily:"'Cormorant Garamond',serif"}}>{v}</div>
                  <div style={{fontSize:8,color:FA,letterSpacing:1.5,textTransform:"uppercase",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:DK,borderRadius:10,padding:"12px 14px",marginBottom:8,borderLeft:"3px solid #7DBF8A"}}>
              <div style={{fontSize:11,color:"#7DBF8A",fontWeight:600,marginBottom:3}}>{nums.element} Element · {nums.sign}</div>
              <p style={{...bod,fontSize:12,color:FA}}>{elemData?.desc}</p>
            </div>
            <div style={{background:DK,borderRadius:10,padding:"12px 14px",borderLeft:"3px solid "+G}}>
              <div style={{fontSize:11,color:G,fontWeight:600,marginBottom:3}}>Life Path {nums.lp} · {lpData.name}</div>
              <p style={{...bod,fontSize:12,color:FA}}>{lpData.desc}</p>
              <p style={{...bod,fontSize:11,color:FA,marginTop:5,fontStyle:"italic"}}>Shadow: {lpData.shadow}</p>
            </div>
            {numSynthesis&&<div style={{...hl,marginTop:10}}><p style={bod}>{numSynthesis}</p></div>}
          </Sec>}

          <Sec title="Career Intelligence">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div><p style={{fontSize:9,color:FA,letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Strengths</p>{strengths.map((s,i)=><div key={i} style={{fontSize:12,color:"#8aabbb",lineHeight:1.75,marginBottom:4}}>◆ {s}</div>)}</div>
              <div><p style={{fontSize:9,color:FA,letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Ideal Roles</p>{roles.map((r,i)=><div key={i} style={{fontSize:12,color:"#8aabbb",lineHeight:1.75,marginBottom:4}}>→ {r}</div>)}</div>
            </div>
            <div style={hl}><p style={bod}><strong style={{color:G}}>Blind spot: </strong>{blind}</p></div>
          </Sec>

          <Sec title="Strategic Roadmap">
            {roadmap.map((r,i)=>(
              <div key={i} style={{marginBottom:16,paddingLeft:14,borderLeft:"2px solid "+G,position:"relative"}}>
                <div style={{position:"absolute",left:-5,top:5,width:8,height:8,borderRadius:"50%",background:G}}/>
                <div style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>{r.y} — {r.t}</div>
                <p style={bod}>{r.a}</p>
              </div>
            ))}
          </Sec>

          <Sec title="Growth Edges">
            {growth.map((g,i)=><div key={i} style={{fontSize:12,color:"#8aabbb",lineHeight:1.75,marginBottom:8,paddingLeft:14,borderLeft:"2px solid "+BR}}>▸ {g}</div>)}
          </Sec>

          {quote&&<div style={{background:"linear-gradient(135deg,"+DK+","+D3+")",border:"1px solid rgba(201,168,76,0.25)",borderRadius:14,padding:"28px 28px",textAlign:"center",marginBottom:22,position:"relative",overflow:"hidden"}}>
            <div style={{fontSize:40,color:"rgba(201,168,76,0.12)",fontFamily:"Georgia,serif",position:"absolute",top:8,left:18,lineHeight:1}}>"</div>
            <p style={{fontSize:15,color:TX,fontStyle:"italic",lineHeight:1.85,margin:"0 0 10px",fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:300,position:"relative",zIndex:1}}>"{quote}"</p>
            <p style={{fontSize:9,color:G,letterSpacing:2,textTransform:"uppercase"}}>— {headline}</p>
          </div>}

          <div style={{background:DK,borderRadius:8,padding:"10px 14px",marginBottom:20,display:"flex",gap:8}}>
            <span style={{fontSize:14}}>🔒</span>
            <p style={{fontSize:10,color:FA,lineHeight:1.6,margin:0}}>Your data was never sent anywhere. This entire report was generated locally in your browser. Closing this tab deletes everything permanently.</p>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button style={{...btnG,flex:2}} onClick={()=>exportPDF(report)}>↓ Download Report</button>
            <button style={{...btnS}} onClick={reset}>New Report</button>
          </div>
        </div>
      </div></div>
    );
  }
  return null;
}
