import React from 'react';

export function RadarChart({ ocean }) {
  const dims = ["O", "C", "E", "A", "N"],
    labels = ["Open", "Consc", "Extra", "Agree", "Stable"],
    colors = ["#7C9CBF", "#C9A84C", "#7DBF8A", "#C97A7A", "#B07DBF"];
  const cx = 110, cy = 110, r = 75, n = dims.length;
  const angle = i => (Math.PI * 2 * (i / n)) - Math.PI / 2;
  const pt = (i, val) => {
    const a = angle(i), pct = val / 100;
    return [cx + r * pct * Math.cos(a), cy + r * pct * Math.sin(a)];
  };
  const polyPoints = dims.map((d, i) => pt(i, ocean[d])).map(p => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 200, display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map(pct => {
        const pts = dims.map((_, i) => {
          const a = angle(i);
          return [cx + r * pct * Math.cos(a), cy + r * pct * Math.sin(a)].join(",")
        }).join(" ");
        return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
      })}
      {dims.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
      })}
      <polygon points={polyPoints} fill="rgba(201,168,76,0.12)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" />
      {dims.map((d, i) => {
        const [x, y] = pt(i, ocean[d]);
        return <circle key={d} cx={x} cy={y} r="4" fill={colors[i]} />;
      })}
      {dims.map((d, i) => {
        const a = angle(i), lx = cx + (r + 22) * Math.cos(a), ly = cy + (r + 22) * Math.sin(a);
        return <text key={d} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fill={colors[i]} fontFamily="DM Sans,sans-serif" fontWeight="500">{labels[i]}</text>;
      })}
    </svg>
  );
}
