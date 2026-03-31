import { MBTI_MAP, ENN_DATA, LP_DATA, ELEM_DATA, SHADOW_DATA, COMM_STYLE } from '../data/personalityData';

export function buildLifeJourney(birthYear, cy, careerCtx) {
  const phases = [];
  const startYear = birthYear + 22; // typical career start
  
  phases.push({
    year: String(startYear) + " – " + String(startYear + 3),
    title: "Foundation Phase",
    icon: "◎",
    desc: "The entry point into your professional identity. The skills, habits, and standards set in this window establish the baseline from which all subsequent growth compounds."
  });
  
  if (careerCtx.hasMultipleFirms) {
    phases.push({
      year: String(startYear + 3) + " – " + String(startYear + 6),
      title: "Expansion Phase",
      icon: "◈",
      desc: "Cross-institutional exposure broadened your technical range and professional network. Each firm added a layer of perspective unavailable within a single organisation."
    });
  }
  
  if (careerCtx.hasInternational) {
    phases.push({
      year: "International Transition",
      title: "Global Expansion",
      icon: "◆",
      desc: "Relocating jurisdictions was a decisive act of professional ambition. It reset your ceiling and demonstrated that your skills transcend geography — a rare and compounding advantage."
    });
  }
  
  phases.push({
    year: String(cy - 1) + " – " + String(cy),
    title: "Integration & Authority",
    icon: "●",
    desc: "You are currently establishing your reputation in your current market. This phase is about depth over breadth — becoming the trusted expert rather than the newest arrival."
  });
  
  phases.push({
    year: String(cy + 1) + " – " + String(cy + 3),
    title: "Leadership Threshold",
    icon: "◐",
    desc: "The natural next phase involves transitioning from technical contributor to engagement architect. Your value shifts from what you can do personally to what you can enable in others."
  });
  
  phases.push({
    year: String(cy + 4) + " – " + String(cy + 7),
    title: "The Master Builder Era",
    icon: "★",
    desc: "At this horizon, you will operate as a Master of Governance — whether within a major firm, in an executive role, or as a independent advisor shaping the field from the outside."
  });
  
  return phases;
}

export function buildReport(name, role, bg, resumeText, nums, scores) {
  const { ocean, ennType, discDom, mbti } = scores;
  const mbtiData = MBTI_MAP[mbti] || MBTI_MAP["ISTJ"];
  const ennData = ENN_DATA[ennType];
  const lpData = nums ? LP_DATA[nums.lp] || LP_DATA[1] : null;
  const elemData = nums ? ELEM_DATA[nums.element] : null;
  
  // Placeholder for career context parsing
  const careerCtx = { industry: "general", archetype: "Professional", archetypeDesc: "Analytical professional", skills: [], hasInternational: false, hasMultipleFirms: false };
  
  const archetypes = { INTJ: "The Strategic Visionary", INTP: "The Analytical Inventor", ENTJ: "The Executive Architect", ENTP: "The Disruptive Thinker", INFJ: "The Principled Idealist", INFP: "The Authentic Creator", ENFJ: "The Inspiring Leader", ENFP: "The Passionate Connector", ISTJ: "The Grounded Executor", ISFJ: "The Loyal Guardian", ESTJ: "The Decisive Organiser", ESFJ: "The Caring Facilitator", ISTP: "The Pragmatic Craftsman", ISFP: "The Quiet Innovator", ESTP: "The Bold Opportunist", ESFP: "The Energetic Connector" };
  const headline = archetypes[mbti] || "The Analytical Professional";
  
  const traits = [];
  if (ocean.C >= 70) traits.push("precision");
  if (ocean.E >= 65) traits.push("leadership");
  if (ocean.O >= 65) traits.push("vision");
  if (ocean.A >= 65) traits.push("empathy");
  if (ocean.N <= 35) traits.push("resilience");
  
  const tagline = traits.length > 0 ? `${traits.slice(0, 2).join(" and ")} — a ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy${nums ? " and " + nums.element + " element" : ""}` : (`A ${mbtiData[0]} shaped by ${ennData.name.toLowerCase()} energy`);
  
  const summary = name + " is a " + mbtiData[0] + ": " + mbtiData[1].toLowerCase() + " As a " + ennData.name + ", their core drive centres on " + ennData.core.toLowerCase().replace("motivated by ", "") + ".";
  
  const oceanText = {
    O: ocean.O >= 65 ? "High openness signals orientation toward strategy, innovation, and systems thinking over routine execution." : ocean.O >= 50 ? "Balanced openness — creative thinking grounded in practicality; adapts ideas to real-world constraints." : "Preference for proven methods; consistency and reliability over experimentation.",
    C: ocean.C >= 70 ? "Exceptional conscientiousness — rarely misses a detail; work product is immaculate and delivery is consistent." : ocean.C >= 55 ? "Strong discipline; sets high standards and reliably meets them under pressure." : "Flexible and adaptive; thrives in dynamic environments that reward agility over process.",
    E: ocean.E >= 65 ? "High extraversion — energised by people, leadership, and public-facing roles; a natural front-person." : ocean.E >= 45 ? "Balanced; equally effective collaborating or working independently depending on context." : "Introversion-leaning — does best work in deep focus; prefers meaningful depth over broad social networks.",
    A: ocean.A >= 65 ? "Highly collaborative; builds genuine trust and consensus without losing strategic direction." : ocean.A >= 45 ? "Direct yet cooperative; holds positions under pressure without becoming combative." : "Task-focused; prioritises outcomes over harmony — effective where results matter more than relationships.",
    N: ocean.N <= 35 ? "Emotionally stable under pressure — a calming anchor for teams in high-stakes situations." : ocean.N <= 50 ? "Generally composed with a healthy attentiveness to risk and consequence." : "Emotionally attuned — this awareness of risk is a professional asset in compliance and advisory roles."
  };

  const strengths = [];
  if (ocean.C >= 70) strengths.push("Meticulous attention to detail and quality");
  if (ocean.C >= 60) strengths.push("Disciplined planning and consistent execution");
  if (ocean.E >= 60) strengths.push("Natural ability to lead and influence teams");
  if (ocean.O >= 60) strengths.push("Strategic thinking and creative problem-solving");
  if (ocean.A >= 60) strengths.push("Builds genuine trust and loyalty with people");
  if (ocean.N <= 40) strengths.push("Stays clear and decisive under high pressure");

  const cy = new Date().getFullYear();
  const quote = "Integrity is not what you do when others are watching. It is what you do when they are not.";
  const commStyle = COMM_STYLE[mbti] || "Prefers clear, direct communication with sufficient context.";
  const lifeJourney = nums ? buildLifeJourney(nums.birthYear, cy, careerCtx) : null;
  const shadowData = SHADOW_DATA[ennType] || null;

  return {
    headline, tagline, summary, ocean, oceanText, mbti, mbtiData, ennType, ennData, discDom, strengths: strengths.slice(0, 5),
    quote, commStyle, name, careerCtx, lifeJourney, shadowData
  };
}
