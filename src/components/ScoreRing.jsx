import React from 'react';

export function ScoreRing({ value, color, label }) {
  const r = 20, circ = 2 * Math.PI * r, dash = (value / 100) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={dash + " " + (circ - dash)} strokeLinecap="round" transform="rotate(-90 26 26)" />
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="600" fill={color} fontFamily="DM Sans,sans-serif">{value}</text>
      </svg>
      <div style={{ fontSize: 8, color: "#3e5464", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
    </div>
  );
}
