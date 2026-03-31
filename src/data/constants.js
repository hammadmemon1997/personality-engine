export const OCEAN_KW = {
  O: {
    pos: [
      "creative", "innovation", "research", "design", "strategy", "explore", "concept", "idea", "vision", "develop", "invent", "curious", "learning", "experiment", "novel", "diverse", "art", "write", "philosophy", "theory", "architect", "plan", "imagine", "discover", "build", "startup", "entrepreneurship", "digital", "technology", "transform", "launch", "initiative", "reimagine", "pioneered"
    ],
    neg: [
      "routine", "compliance", "process", "standard", "procedure", "maintain", "operations", "admin", "clerical", "entry", "repetitive", "support", "coordinate"
    ]
  },
  C: {
    pos: [
      "audit", "compliance", "accuracy", "detail", "deadline", "report", "analysis", "review", "manage", "organise", "plan", "implement", "deliver", "quality", "control", "improve", "monitor", "measure", "track", "complete", "precise", "thorough", "systematic", "structured", "efficient", "certif", "accounting", "finance", "tax", "legal", "engineer", "schedule", "budget", "forecast", "reconcil", "ifrs", "isa", "gaap", "framework", "governance", "oversight", "assurance"
    ],
    neg: [
      "flexible", "adapt", "spontaneous", "informal", "casual", "freelance", "varied"
    ]
  },
  E: {
    pos: [
      "lead", "manage", "team", "client", "present", "stakeholder", "collaborate", "communicate", "negotiate", "train", "mentor", "coach", "public", "speak", "network", "partner", "engage", "relationship", "business development", "sales", "marketing", "customer", "community", "event", "conference", "workshop", "facilitate", "coordinate", "executive", "director", "head", "chief"
    ],
    neg: [
      "independent", "solo", "remote", "individual", "analyst", "research", "technical", "data", "model", "code", "program", "backend", "internal"
    ]
  },
  A: {
    pos: [
      "team", "support", "help", "mentor", "coach", "develop", "community", "volunteer", "charity", "nonprofit", "collaborate", "assist", "care", "empathy", "patient", "teach", "train", "people", "culture", "wellbeing", "diversity", "inclusion", "service", "humanitarian", "social"
    ],
    neg: [
      "negotiate", "competitive", "target", "performance", "revenue", "sales", "commercial", "drive", "aggressive", "push", "challenge", "critical", "evaluate"
    ]
  },
  N: {
    neg: [
      "stable", "consistent", "reliable", "calm", "confident", "resilient", "composed", "steady", "manage pressure", "deliver under", "high stakes", "crisis", "volatile", "uncertainty", "complex", "challenging", "adapt", "flexible"
    ],
    pos: [
      "concern", "risk", "careful", "cautious", "sensitive", "aware", "thorough", "check", "verify", "validate", "monitor", "oversight", "safeguard"
    ]
  }
};

export const ENN_KW = {
  "1": ["quality", "standard", "compliance", "correct", "improve", "error", "accuracy", "ethics", "integrity", "principle", "perfect", "right", "responsibility", "audit", "legal", "policy", "procedure", "excellence", "precise"],
  "2": ["help", "support", "mentor", "coach", "team", "collaborate", "assist", "care", "develop people", "training", "hr", "counsell", "social work", "volunteer", "community", "teach", "guide"],
  "3": ["achieve", "target", "performance", "award", "recognition", "promot", "success", "result", "deliver", "milestone", "lead", "executive", "career", "objective", "goal", "efficient"],
  "4": ["creative", "design", "art", "unique", "authentic", "express", "identity", "brand", "culture", "diversity", "write", "narrative", "vision", "meaning", "craft"],
  "5": ["research", "analysis", "data", "model", "investigate", "expert", "knowledge", "technical", "academic", "publish", "study", "insight", "analytics", "science", "engineer", "program"],
  "6": ["security", "risk", "compliance", "safety", "reliable", "loyal", "policy", "procedure", "team", "protect", "contingency", "audit", "review", "check", "verify", "due diligence"],
  "7": ["diverse", "varied", "new", "exciting", "opportunities", "travel", "project", "startup", "growth", "entrepreneurship", "creative", "innovation", "launch", "explore", "experience"],
  "8": ["lead", "director", "executive", "ceo", "founder", "head", "chief", "senior", "authority", "decision", "control", "power", "drive", "challenge", "bold", "impact", "transform"],
  "9": ["mediator", "balance", "consensus", "harmony", "stable", "maintain", "coordinate", "support", "bridge", "peace", "relationship", "collaborative", "steady", "culture", "community"]
};

export const DISC_KW = {
  D: ["director", "executive", "vp", "head", "chief", "ceo", "coo", "cfo", "lead", "senior", "manager", "principal", "partner", "founder", "president", "drive", "deliver", "target", "revenue", "competitive", "growth", "strategy", "commercial", "authority", "decision", "transform"],
  I: ["sales", "marketing", "business development", "brand", "client", "customer", "present", "pitch", "network", "engage", "communicate", "partner", "public", "event", "social", "media", "creative", "collaborate", "inspire", "train", "coach", "facilitate"],
  S: ["support", "assist", "coordinate", "admin", "operations", "hr", "team", "service", "maintain", "process", "consistent", "reliable", "stable", "steady", "patient", "care", "help", "long-term", "loyalty", "continuity"],
  C: ["audit", "analysis", "data", "research", "compliance", "quality", "accounting", "finance", "tax", "engineer", "technical", "model", "report", "review", "accuracy", "detail", "standard", "procedure", "system", "measure", "monitor", "control", "verify", "reconcil"]
};

export const INDUSTRY_QUESTIONS = {
  "audit": {
    label: "Audit & Assurance",
    qs: [
      { id: "sector", q: "Primary sector you audit?", opts: [{ l: "Banking & Capital Markets", kw: "banking capital markets investment financial instruments credit risk ecl" }, { l: "Insurance & Asset Management", kw: "insurance actuarial asset management fund investment risk" }, { l: "Corporate & General", kw: "corporate manufacturing retail general industry" }, { l: "Public Sector / NFP", kw: "government nonprofit public sector regulatory compliance social" }] },
      { id: "scale", q: "Typical client size?", opts: [{ l: "ASX/Listed entities", kw: "listed asx public reporting disclosure continuous disclosure materiality" }, { l: "Large private / MNC", kw: "multinational large private complex cross-border consolidation" }, { l: "Mid-market", kw: "mid-market private growing business owner-managed" }, { l: "Small business / SME", kw: "small business sme owner advisory practical" }] },
      { id: "focus", q: "Specialist focus area?", opts: [{ l: "Digital Audit & Analytics", kw: "data analytics alteryx halo digital audit automation ai machine learning continuous monitoring" }, { l: "IFRS Technical", kw: "ifrs 9 ifrs 16 ifrs 15 technical accounting complex judgement ecl impairment" }, { l: "Risk & Internal Controls", kw: "internal controls risk framework sox icfr governance process improvement" }, { l: "ESG & Sustainability", kw: "esg sustainability climate risk reporting greenwashing assurance" }] }
    ]
  },
  "tech": {
    label: "Technology",
    qs: [
      { id: "stack", q: "Your primary stack?", opts: [{ l: "Frontend / Product", kw: "react ui ux frontend product design user experience interface" }, { l: "Backend / Infrastructure", kw: "backend api database infrastructure cloud aws devops systems architecture" }, { l: "Data / ML / AI", kw: "data science machine learning artificial intelligence model training analytics python" }, { l: "Full-stack", kw: "full stack end to end product build deploy scale" }] },
      { id: "env", q: "Environment?", opts: [{ l: "Startup / Early-stage", kw: "startup early stage founder zero to one build fast iterate pivot" }, { l: "Scale-up / Growth", kw: "scale growth series b product market fit team building rapid expansion" }, { l: "Enterprise / Big Tech", kw: "enterprise large scale distributed systems reliability governance process" }, { l: "Consulting / Agency", kw: "consulting client delivery multiple projects diverse technology advisory" }] },
      { id: "role_type", q: "Role type?", opts: [{ l: "Individual Contributor", kw: "individual contributor deep technical expert specialist craft quality" }, { l: "Tech Lead / Manager", kw: "technical lead manager team engineering leadership mentoring architecture decisions" }, { l: "Product / Strategy", kw: "product strategy roadmap stakeholder prioritisation outcome metrics" }] }
    ]
  },
  "finance": {
    label: "Financial Services",
    qs: [
      { id: "domain", q: "Your domain?", opts: [{ l: "Banking & Lending", kw: "banking lending credit risk retail commercial corporate treasury" }, { l: "Investment & Markets", kw: "investment portfolio trading markets equity fixed income derivatives funds" }, { l: "Insurance", kw: "insurance underwriting claims actuarial risk product pricing" }, { l: "Fintech / Payments", kw: "fintech payments digital banking embedded finance api technology regulation" }] },
      { id: "function", q: "Primary function?", opts: [{ l: "Risk & Compliance", kw: "risk compliance regulatory apra asic governance oversight framework" }, { l: "Finance & Reporting", kw: "financial reporting ifrs accounting close consolidation management accounts" }, { l: "Advisory & Strategy", kw: "advisory strategy transformation consulting stakeholder executive" }, { l: "Operations / Delivery", kw: "operations delivery process improvement efficiency client service" }] }
    ]
  },
  "consulting": {
    label: "Consulting & Advisory",
    qs: [
      { id: "type", q: "Consulting type?", opts: [{ l: "Strategy", kw: "strategy growth transformation corporate advisory c-suite board" }, { l: "Operations", kw: "operations process improvement lean six sigma efficiency delivery" }, { l: "Technology / Digital", kw: "digital transformation technology implementation change management erp cloud" }, { l: "Specialist / Boutique", kw: "specialist niche domain expert boutique independent advisory" }] },
      { id: "clients", q: "Client base?", opts: [{ l: "Corporate / Enterprise", kw: "corporate large enterprise asx listed complex stakeholder" }, { l: "Government / Public", kw: "government public sector policy regulatory tender procurement" }, { l: "SME / Mid-market", kw: "sme mid market private owner managed practical implementation" }, { l: "Startup / Scale-up", kw: "startup venture growth scale advisory board mentor" }] }
    ]
  },
  "health": {
    label: "Healthcare & Life Sciences",
    qs: [
      { id: "domain", q: "Your area?", opts: [{ l: "Clinical / Patient Care", kw: "clinical patient care treatment outcomes health wellbeing therapeutic" }, { l: "Health Administration", kw: "health administration hospital management operations system policy" }, { l: "Pharmaceutical / Research", kw: "pharmaceutical clinical trials research regulatory tga fda drug development" }, { l: "Allied Health", kw: "allied health physio psychology occupational therapy community care" }] }
    ]
  },
  "marketing": {
    label: "Marketing & Communications",
    qs: [
      { id: "channel", q: "Primary channel focus?", opts: [{ l: "Digital / Performance", kw: "digital performance seo sem paid social analytics conversion roi" }, { l: "Brand & Creative", kw: "brand creative storytelling design visual identity campaign" }, { l: "Content & PR", kw: "content editorial pr communications media relations thought leadership" }, { l: "Strategy & Insights", kw: "strategy insights data research market audience segmentation" }] },
      { id: "sector_focus", q: "B2B or B2C?", opts: [{ l: "B2B", kw: "b2b business enterprise account based sales enablement demand generation" }, { l: "B2C", kw: "b2c consumer retail mass market loyalty engagement" }, { l: "Both", kw: "cross market multi channel integrated campaign broad" }] }
    ]
  },
  "legal": {
    label: "Legal & Compliance",
    qs: [
      { id: "practice", q: "Practice area?", opts: [{ l: "Corporate & Commercial", kw: "corporate commercial M&A transactions due diligence contracts negotiation" }, { l: "Litigation & Disputes", kw: "litigation dispute resolution advocacy court proceedings mediation" }, { l: "Regulatory & Compliance", kw: "regulatory compliance financial services apra asic policy governance risk" }, { l: "In-house Counsel", kw: "in-house general counsel corporate governance board risk commercial" }] }
    ]
  }
};
