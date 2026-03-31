import { useState } from "react";
import "./index.css";
import { DARK_THEME, LIGHT_THEME } from "./theme/themes";
import { RadarChart } from "./components/RadarChart";
import { extractText } from "./utils/textExtraction";
import { buildReport } from "./utils/reportBuilder";
import { scoreText } from "./utils/analysis";

export default function App() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK_THEME : LIGHT_THEME;

  const [stage, setStage] = useState("form");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bg, setBg] = useState("");
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!name) return;
    setLoading(true);
    try {
      let resumeText = "";
      if (file) {
        resumeText = await extractText(file);
      }
      
      const combinedText = `${name} ${role} ${bg} ${resumeText}`;
      const scores = scoreText(combinedText);
      const result = buildReport(name, role, bg, resumeText, null, scores);
      
      setReport(result);
      setStage("report");
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: T.pageBackground, 
      color: T.TX, 
      minHeight: "100vh", 
      fontFamily: "'DM Sans', sans-serif",
      transition: "background-color 0.3s ease"
    }}>
      <header style={{ 
        padding: "2rem", 
        textAlign: "center", 
        borderBottom: `1px solid ${T.BR}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ color: T.G, fontSize: "1.8rem", margin: 0 }}>
            Personality Intelligence Engine
          </h1>
          <p style={{ color: T.DM, margin: 0, fontSize: "0.9rem" }}>Refined Professional Analysis</p>
        </div>
        <button 
          onClick={() => setDark(!dark)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: `1px solid ${T.G}`,
            background: "none",
            color: T.G,
            cursor: "pointer",
            fontSize: "0.8rem"
          }}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        {stage === "form" ? (
          <div style={{ 
            backgroundColor: T.cardBackground, 
            padding: "2.5rem", 
            borderRadius: "16px",
            boxShadow: T.shadow,
            border: `1px solid ${T.BR}`
          }}>
            <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>Profile Analysis</h2>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: T.G, fontSize: "0.9rem", fontWeight: "600" }}>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: `1px solid ${T.BR}`,
                    backgroundColor: T.inputBackground,
                    color: T.TX,
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: T.G, fontSize: "0.9rem", fontWeight: "600" }}>Current Role / Title</label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Strategist"
                  style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: `1px solid ${T.BR}`,
                    backgroundColor: T.inputBackground,
                    color: T.TX,
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: T.G, fontSize: "0.9rem", fontWeight: "600" }}>Professional Context</label>
                <textarea 
                  value={bg} 
                  onChange={(e) => setBg(e.target.value)}
                  placeholder="Describe your career focus and key achievements..."
                  rows="4"
                  style={{ 
                    width: "100%", 
                    padding: "1rem", 
                    borderRadius: "10px", 
                    border: `1px solid ${T.BR}`,
                    backgroundColor: T.inputBackground,
                    color: T.TX,
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: T.G, fontSize: "0.9rem", fontWeight: "600" }}>Resume / CV (Optional)</label>
                <div style={{
                  border: `2px dashed ${T.BR}`,
                  padding: "1.5rem",
                  borderRadius: "10px",
                  textAlign: "center",
                  cursor: "pointer"
                }}>
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ color: T.DM, fontSize: "0.8rem" }}
                  />
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: T.FA }}>
                    Supports PDF and TXT formats
                  </p>
                </div>
              </div>

              <button 
                onClick={handleAnalyse}
                disabled={loading || !name}
                style={{
                  marginTop: "1rem",
                  padding: "1.2rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: T.G,
                  color: "#000",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "transform 0.2s ease"
                }}
              >
                {loading ? "Processing Engine..." : "Generate Intelligence Report"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: T.cardBackground, 
            padding: "3rem", 
            borderRadius: "20px",
            boxShadow: T.shadow,
            border: `1px solid ${T.BR}`
          }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ color: T.G, fontSize: "0.9rem", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Professional Archetype
              </div>
              <h2 style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}>{report.headline}</h2>
              <div style={{ 
                display: "inline-block", 
                padding: "0.5rem 1.5rem", 
                backgroundColor: T.D3, 
                borderRadius: "30px",
                fontSize: "0.9rem",
                color: T.DM,
                border: `1px solid ${T.BR}`
              }}>
                {report.tagline}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1rem", color: T.G, marginBottom: "1.5rem", textTransform: "uppercase" }}>OCEAN Dynamics</h3>
                <RadarChart ocean={report.ocean} />
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", color: T.G, marginBottom: "1.5rem", textTransform: "uppercase" }}>Strategic Strengths</h3>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {report.strengths.map((s, i) => (
                    <li key={i} style={{ 
                      marginBottom: "1rem", 
                      padding: "0.8rem", 
                      backgroundColor: T.D3, 
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      borderLeft: `3px solid ${T.G}`
                    }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontSize: "1rem", color: T.G, marginBottom: "1rem", textTransform: "uppercase" }}>Executive Summary</h3>
              <p style={{ lineHeight: "1.8", fontSize: "1.05rem", color: T.bodColor }}>
                {report.summary}
              </p>
            </div>

            <div style={{ 
              padding: "2rem", 
              backgroundColor: T.D4, 
              borderRadius: "12px", 
              border: `1px solid ${T.BR}`,
              textAlign: "center",
              position: "relative"
            }}>
              <span style={{ 
                position: "absolute", 
                top: "-10px", 
                left: "20px", 
                backgroundColor: T.G, 
                color: "#000", 
                padding: "2px 10px", 
                fontSize: "0.7rem", 
                fontWeight: "bold",
                borderRadius: "4px"
              }}>CORE PHILOSOPHY</span>
              <p style={{ fontStyle: "italic", fontSize: "1.2rem", margin: 0 }}>"{report.quote}"</p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
              <button 
                onClick={() => setStage("form")}
                style={{
                  padding: "0.8rem 2rem",
                  borderRadius: "30px",
                  border: `1px solid ${T.BR}`,
                  background: "none",
                  color: T.DM,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease"
                }}
              >
                ← Create New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={{ 
        padding: "4rem 2rem", 
        textAlign: "center", 
        color: T.FA, 
        fontSize: "0.75rem",
        borderTop: `1px solid ${T.BR}`,
        marginTop: "4rem"
      }}>
        <p style={{ margin: "0 0 0.5rem" }}>PERSONALITY INTELLIGENCE ENGINE v2.0</p>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Hammad Memon. Refined Professional Insights.</p>
      </footer>
    </div>
  );
}
