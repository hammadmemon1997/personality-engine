import { OCEAN_KW, ENN_KW, DISC_KW } from '../data/constants';

export function scoreText(text) {
  const t = text.toLowerCase();
  const count = (words) => words.reduce((n, w) => n + (t.split(w).length - 1), 0);
  
  const ocean = {};
  Object.entries(OCEAN_KW).forEach(([d, kw]) => {
    const pos = count(kw.pos || []);
    const neg = count(kw.neg || []);
    const total = (kw.pos || []).length + (kw.neg || []).length;
    const raw = (pos - neg * 0.6) / Math.max(total * 0.15, 1);
    ocean[d] = Math.min(97, Math.max(18, Math.round(50 + raw * 8)));
  });

  const ennScores = {};
  Object.entries(ENN_KW).forEach(([type, kw]) => {
    ennScores[type] = count(kw);
  });
  const ennSorted = Object.entries(ennScores).sort((a, b) => b[1] - a[1]);
  const ennType = ennSorted[0][0];
  const ennType2 = ennSorted[1]?.[0] || null;
  const ennRawScores = Object.fromEntries(ennSorted.map(([k, v]) => [k, v]));

  const discScores = {};
  Object.entries(DISC_KW).forEach(([s, kw]) => {
    discScores[s] = count(kw);
  });
  const discDom = Object.entries(discScores).sort((a, b) => b[1] - a[1])[0][0];
  const discLabels = { D: "Dominant", I: "Influential", S: "Steady", C: "Conscientious" };

  const ei = ocean.E >= 53 ? "E" : "I";
  const ns = ocean.O >= 54 ? "N" : "S";
  const tf = ocean.A >= 52 ? "F" : "T";
  const jp = ocean.C >= 56 ? "J" : "P";

  return {
    ocean,
    ennType,
    ennType2,
    ennRawScores,
    discDom,
    discLabel: discLabels[discDom],
    mbti: ei + ns + tf + jp
  };
}

export function analyseCompatibility(r1, r2) {
  const { ocean: o1, mbti: m1, ennType: e1, discDom: d1 } = r1;
  const { ocean: o2, mbti: m2, ennType: e2, discDom: d2 } = r2;
  
  const oDiff = Math.abs(o1.O - o2.O), cDiff = Math.abs(o1.C - o2.C), eDiff = Math.abs(o1.E - o2.E), aDiff = Math.abs(o1.A - o2.A);
  const oceanScore = Math.round(100 - ((oDiff + cDiff + eDiff + aDiff) / 4) * 0.7);
  
  const mbtiPairs = { INTJ: ["ENFP", "ENTP"], INTP: ["ENTJ", "ENFJ"], ENTJ: ["INTP", "INFP"], ENTP: ["INFJ", "INTJ"], INFJ: ["ENTP", "ENFP"], INFP: ["ENTJ", "ENFJ"], ENFJ: ["INFP", "INTP"], ENFP: ["INFJ", "INTJ"], ISTJ: ["ESFP", "ESTP"], ISFJ: ["ESTP", "ESFP"], ESTJ: ["ISFP", "ISTP"], ESFJ: ["ISTP", "ISFP"], ISTP: ["ESTJ", "ESFJ"], ISFP: ["ESTJ", "ESFJ"], ESTP: ["ISFJ", "ISTJ"], ESFP: ["ISFJ", "ISTJ"] };
  const mbtiMatch = !!(mbtiPairs[m1]?.includes(m2) || mbtiPairs[m2]?.includes(m1));
  const mbtiScore = mbtiMatch ? 90 : m1 === m2 ? 70 : 62;
  
  const ennGood = { "1": ["7", "9"], "2": ["4", "8"], "3": ["6", "9"], "4": ["2", "9"], "5": ["1", "7"], "6": ["9", "3"], "7": ["5", "1"], "8": ["2", "4"], "9": ["3", "6"] };
  const ennMatch = !!(ennGood[e1]?.includes(e2) || ennGood[e2]?.includes(e1));
  const ennScore = ennMatch ? 88 : e1 === e2 ? 65 : 72;
  
  const discComp = { D: ["C", "S"], I: ["S", "C"], S: ["I", "D"], C: ["D", "I"] };
  const discMatch = !!(discComp[d1]?.includes(d2));
  const discScore = discMatch ? 85 : d1 === d2 ? 60 : 70;
  
  const overall = Math.round(oceanScore * 0.35 + mbtiScore * 0.25 + ennScore * 0.25 + discScore * 0.15);
  
  const synergies = [], tensions = [];
  if (eDiff < 15) synergies.push("Matched social energy — neither drains nor overwhelms the other");
  if (aDiff < 15) synergies.push("Similar communication warmth — rarely misread each other's tone");
  if (mbtiMatch) synergies.push("Complementary cognitive styles — one generates, the other refines");
  if (ennMatch) synergies.push("Enneagram compatibility — growth paths naturally support each other");
  if (discMatch) synergies.push("DISC complementarity — different strengths that combine without competing");
  
  if (eDiff > 25) tensions.push("Social energy mismatch — one needs more time alone, the other more together");
  if (Math.abs(o1.C - o2.C) > 25) tensions.push("Structure vs flexibility — different needs around planning and consistency");
  if (d1 === d2 && d1 === "D") tensions.push("Both Dominant — power struggles possible; clear role boundaries needed");
  if (e1 === e2) tensions.push("Same Enneagram type — share blind spots and can reinforce each other's shadow");
  
  return { overall, oceanScore, mbtiScore, ennScore, discScore, synergies, tensions, label: overall >= 85 ? "Exceptional" : overall >= 75 ? "Strong" : overall >= 65 ? "Compatible" : "Complementary" };
}
