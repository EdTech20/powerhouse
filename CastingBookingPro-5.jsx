import { useState, useEffect, useMemo } from "react";
import { hasSupabaseEnv, supabase } from "./src/lib/supabase";

const C = {
  bg: "#f5f5f7", surface: "#ffffff", card: "#ffffff", sidebar: "#1d1d1f",
  border: "#d2d2d7", borderLight: "#e8e8ed",
  gold: "#f0b429", green: "#34c759", red: "#ff3b30", orange: "#ff9500",
  yellow: "#ffcc00", blue: "#007aff", text: "#1d1d1f", textSec: "#6e6e73",
  textTert: "#aeaeb2", white: "#ffffff", purple: "#5e5ce6",
};
const CD = {
  bg: "#0a0a0f", surface: "#12121a", card: "#1a1a26", sidebar: "#0d0d14",
  border: "#2a2a3d", borderLight: "#222233",
  gold: "#f0b429", green: "#34c759", red: "#ff3b30", orange: "#ff9500",
  yellow: "#ffcc00", blue: "#0a84ff", text: "#f0f0f8", textSec: "#8080a0",
  textTert: "#4a4a6a", white: "#ffffff", purple: "#7c7aff",
};

function makeS(c) { return {
  app: { minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "-apple-system,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif", display: "flex", fontSize: 16 },
  sidebar: { width: 260, minHeight: "100vh", background: c.sidebar, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, overflowY: "auto" },
  sidebarTop: { padding: "40px 28px 28px", borderBottom: `1px solid ${c.border}` },
  logoLabel: { fontSize: 10, letterSpacing: 3, color: c.gold, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 },
  logoTitle: { fontSize: 22, fontWeight: 800, color: c.white, letterSpacing: "-0.5px" },
  logoSub: { fontSize: 12, color: c.textSec, marginTop: 4 },
  navSection: { padding: "16px 16px 8px" },
  navLabel: { fontSize: 10, fontWeight: 700, color: c.textTert, textTransform: "uppercase", letterSpacing: 2, padding: "0 12px", marginBottom: 4 },
  nav: (a) => ({ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", cursor: "pointer", background: a ? "#007aff" : "transparent", borderRadius: 10, color: a ? c.white : c.textSec, fontWeight: a ? 600 : 400, fontSize: 15, margin: "1px 0" }),
  navIcon: { fontSize: 17, width: 22, textAlign: "center" },
  main: { marginLeft: 260, flex: 1, padding: "44px 52px", maxWidth: "calc(100vw - 260px)", boxSizing: "border-box" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  pageTitle: { fontSize: 32, fontWeight: 700, color: c.text, marginBottom: 4, letterSpacing: "-0.5px" },
  pageSub: { fontSize: 15, color: c.textSec },
  btn: { background: c.blue, color: c.white, border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnSm: { background: c.blue, color: c.white, border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnGhost: { background: "transparent", color: c.textSec, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnGhostSm: { background: "transparent", color: c.textSec, border: `1.5px solid ${c.border}`, borderRadius: 8, padding: "6px 13px", fontWeight: 500, fontSize: 13, cursor: "pointer" },
  btnDanger: { background: "transparent", color: c.red, border: `1.5px solid ${c.red}40`, borderRadius: 8, padding: "6px 13px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  btnGold: { background: c.gold, color: "#000", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  btnGreen: { background: c.green, color: c.white, border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  btnPurple: { background: c.purple, color: c.white, border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  statCard: (col) => ({ background: c.card, border: `1px solid ${c.borderLight}`, borderRadius: 16, padding: "22px 26px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${col}` }),
  statNum: { fontSize: 38, fontWeight: 700, color: c.text, lineHeight: 1, marginBottom: 6, letterSpacing: "-1px" },
  statLabel: { fontSize: 13, color: c.textSec, fontWeight: 500 },
  card: { background: c.card, border: `1px solid ${c.borderLight}`, borderRadius: 16, padding: 26, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  cardTitle: { fontSize: 17, fontWeight: 600, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", color: c.text },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "11px 14px", fontSize: 11, fontWeight: 700, color: c.textSec, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1.5px solid ${c.borderLight}`, whiteSpace: "nowrap" },
  td: { padding: "13px 14px", fontSize: 14, borderBottom: `1px solid ${c.borderLight}`, verticalAlign: "middle", color: c.text },
  badge: (col) => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${col}20`, color: col, whiteSpace: "nowrap" }),
  input: { width: "100%", background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "12px 15px", color: c.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  label: { fontSize: 12, fontWeight: 600, color: c.textSec, marginBottom: 7, display: "block", letterSpacing: "0.1px" },
  fg: { marginBottom: 18 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 },
  modalBox: { background: c.card, borderRadius: 18, padding: 36, width: "100%", maxWidth: 640, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", border: `1px solid ${c.border}` },
  modalTitle: { fontSize: 22, fontWeight: 700, marginBottom: 6, color: c.text, letterSpacing: "-0.3px" },
  modalSub: { fontSize: 14, color: c.textSec, marginBottom: 26 },
  sec: { fontSize: 11, fontWeight: 700, color: c.blue, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, paddingBottom: 9, borderBottom: `1.5px solid ${c.borderLight}`, marginTop: 6 },
  legalScroll: { background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: 18, fontSize: 13, color: c.textSec, lineHeight: 1.9, marginBottom: 14, maxHeight: 200, overflowY: "auto" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, cursor: "pointer" },
  checkText: { fontSize: 14, color: c.text, lineHeight: 1.6 },
  hr: { border: "none", borderTop: `1.5px solid ${c.borderLight}`, margin: "22px 0" },
  timer: (col) => ({ fontFamily: "'SF Mono','Courier New',monospace", fontSize: 14, fontWeight: 700, color: col, background: `${col}15`, padding: "3px 9px", borderRadius: 7 }),
  empty: { textAlign: "center", padding: "56px 24px", color: c.textSec },
  agentHeader: { background: `linear-gradient(135deg,${c.blue}18,${c.purple}18)`, border: `1.5px solid ${c.blue}30`, borderRadius: 14, padding: 26, marginBottom: 26, textAlign: "center" },
  warnBox: { background: c === C ? "#fff5f5" : "#2a1010", border: `1.5px solid #ffcdd0`, borderRadius: 10, padding: 16, marginBottom: 14, fontSize: 14, color: c.text, lineHeight: 1.7 },
  infoBox: { background: c === C ? "#f0f7ff" : "#0a1a2a", border: `1.5px solid ${c.blue}40`, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: c === C ? "#3a6ea8" : c.blue, lineHeight: 1.6 },
  stepBar: { display: "flex", marginBottom: 30, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${c.borderLight}` },
  step: (a, d) => ({ flex: 1, textAlign: "center", padding: "11px 4px", fontSize: 11, fontWeight: 700, background: a ? c.blue : d ? (c === C ? "#f0fff4" : "#0a2010") : c.bg, color: a ? c.white : d ? c.green : c.textTert, borderRight: `1px solid ${c.borderLight}` }),
  rowActions: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" },
  pill: (col) => ({ background: `${col}15`, border: `1px solid ${col}40`, borderRadius: 9, padding: "7px 16px", fontSize: 13, color: col, fontWeight: 600 }),
  toggle: (on) => ({ width: 42, height: 24, borderRadius: 12, background: on ? c.blue : c.border, position: "relative", transition: "background 0.2s", flexShrink: 0, cursor: "pointer" }),
  toggleKnob: (on) => ({ position: "absolute", top: 2, left: on ? 19 : 2, width: 20, height: 20, borderRadius: 10, background: c.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }),
  sheetGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: 22 },
  actorCard: (status) => ({ background: c.card, border: `1.5px solid ${status === "submitted" ? c.green : status === "overdue" ? c.red : c.borderLight}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }),
  actorCardHeader: (status) => ({ background: status === "submitted" ? (c === C ? "#f0fff4" : "#0a1f10") : status === "overdue" ? (c === C ? "#fff5f5" : "#1f0a0a") : c.bg, padding: "18px 22px", borderBottom: `1px solid ${status === "submitted" ? "#c8f0d4" : status === "overdue" ? "#ffd0ce" : c.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }),
  actorName: { fontSize: 19, fontWeight: 700, color: c.text, letterSpacing: "-0.3px", marginBottom: 2 },
  actorMeta: { fontSize: 12, color: c.textSec },
  actorCardBody: { padding: "18px 22px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 },
  infoRow: { padding: "9px 0", borderBottom: `1px solid ${c.borderLight}` },
  infoLabel: { fontSize: 10, fontWeight: 700, color: c.textTert, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  infoVal: { fontSize: 14, color: c.text, fontWeight: 500 },
  infoValMuted: { fontSize: 14, color: c.textTert, fontStyle: "italic" },
  sectionDivider: { fontSize: 10, fontWeight: 700, color: c.blue, textTransform: "uppercase", letterSpacing: 1.5, padding: "13px 0 6px", borderBottom: `1.5px solid ${c.borderLight}`, marginBottom: 6 },
  signatureBox: { background: c === C ? "#f0f7ff" : "#0a1225", border: `1px solid ${c.blue}40`, borderRadius: 9, padding: "11px 15px", marginTop: 11 },
  conflictRow: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },
  conflictPill: (ok) => ({ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: ok ? (c === C ? "#f0fff4" : "#0a1f10") : c.bg, color: ok ? c.green : c.textTert, border: `1px solid ${ok ? "#c8f0d4" : c.borderLight}` }),
  pendingCard: { background: c === C ? "#fffbf0" : "#1a1500", border: `1.5px dashed ${c.orange}`, borderRadius: 18, padding: "28px 22px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180 },
  wardrobeRow: { display: "flex", gap: 7, flexWrap: "wrap", marginTop: 5 },
  wardrobePill: { background: c.bg, border: `1px solid ${c.border}`, borderRadius: 7, padding: "3px 10px", fontSize: 12, color: c.text, fontWeight: 500 },
  noteBox: { background: c === C ? "#fffbf0" : "#1a1500", border: "1px solid #ffe8a0", borderRadius: 9, padding: "11px 15px", marginBottom: 7 },
  noteBoxBlue: { background: c === C ? "#f0f7ff" : "#0a1225", border: `1px solid ${c.blue}40`, borderRadius: 9, padding: "11px 15px" },
  noteLabel: (col) => ({ fontSize: 10, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }),
  noteText: { fontSize: 13, color: c.text, lineHeight: 1.6 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "10px 16px", marginBottom: 22 },
  historyItem: { display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${c.borderLight}`, fontSize: 13 },
  archiveBadge: { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${c.textTert}20`, color: c.textTert },
}; }

let S = makeS(C);

// ── Countdown ──────────────────────────────────────────────────────
function useCountdown(deadline) {
  const [r, setR] = useState(Math.max(0, (deadline || 0) - Date.now()));
  useEffect(() => { const id = setInterval(() => setR(Math.max(0, (deadline || 0) - Date.now())), 1000); return () => clearInterval(id); }, [deadline]);
  return r;
}

function Timer({ deadline, submitted, countdownEnabled }) {
  const r = useCountdown(deadline);
  if (submitted) return <span style={S.badge(S.green || C.green)}>Submitted ✓</span>;
  if (!countdownEnabled || !deadline) return <span style={S.badge(C.textTert)}>No Deadline</span>;
  if (r <= 0) return <span style={S.badge(C.red)}>OVERDUE</span>;
  const h = Math.floor(r / 3600000), m = Math.floor((r % 3600000) / 60000), sc = Math.floor((r % 60000) / 1000);
  const col = r < 3600000 ? C.red : r < 14400000 ? C.orange : C.yellow;
  return <span style={S.timer(col)}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(sc).padStart(2,"0")}</span>;
}

function Toggle({ on, onChange, label, sub }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => onChange(!on)}>
      <div style={S.toggle(on)}><div style={S.toggleKnob(on)} /></div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
        {sub && <div style={{ fontSize: 13, color: C.textSec, marginTop: 2 }}>{sub}</div>}
      </div>
    </label>
  );
}

function Field({ label, val, onChange, placeholder, type = "text", span }) {
  return (
    <div style={{ ...S.fg, ...(span ? { gridColumn: `span ${span}` } : {}) }}>
      <label style={S.label}>{label}</label>
      <input style={S.input} type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""} />
    </div>
  );
}
function Sel({ label, val, onChange, opts, span }) {
  return (
    <div style={{ ...S.fg, ...(span ? { gridColumn: `span ${span}` } : {}) }}>
      <label style={S.label}>{label}</label>
      <select style={S.input} value={val} onChange={e => onChange(e.target.value)}>
        <option value="">Select...</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Check({ checked, onChange, children }) {
  return (
    <label style={S.checkRow} onClick={() => onChange(!checked)}>
      <div style={{ width: 20, height: 20, borderRadius: 6, border: checked ? "none" : `2px solid ${C.border}`, background: checked ? C.blue : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        {checked && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={S.checkText}>{children}</span>
    </label>
  );
}
function InfoRow({ label, val, full }) {
  return (
    <div style={{ ...S.infoRow, ...(full ? { gridColumn: "span 2" } : {}) }}>
      <div style={S.infoLabel}>{label}</div>
      <div style={val ? S.infoVal : S.infoValMuted}>{val || "Not provided"}</div>
    </div>
  );
}

// ── Status History Log ─────────────────────────────────────────────
function StatusHistory({ actor }) {
  const log = actor.statusLog || [];
  if (log.length === 0) return <div style={{ fontSize: 13, color: C.textTert, padding: "8px 0" }}>No history yet</div>;
  return (
    <div>
      {log.map((e, i) => (
        <div key={i} style={S.historyItem}>
          <span style={{ color: C.textTert, minWidth: 140, fontSize: 12 }}>{new Date(e.time).toLocaleString()}</span>
          <span style={{ color: C.text }}>{e.event}</span>
        </div>
      ))}
    </div>
  );
}

// ── Reminder Modal ─────────────────────────────────────────────────
function ReminderModal({ actor, job, onClose, onSend }) {
  const [msg, setMsg] = useState(`Hi ${actor.agentName},\n\nThis is a friendly reminder that we are still awaiting your submission for ${actor.name} on ${job.title} for ${job.client}.\n\nThis production is moving quickly — please fill out the form at your earliest convenience.\n\nThank you,\nPowerhouse Casting`);
  return (
    <div style={S.modal}>
      <div style={{ ...S.modalBox, maxWidth: 520 }}>
        <div style={S.modalTitle}>Send Reminder</div>
        <div style={S.modalSub}>To: {actor.agentName} · {actor.agentEmail}</div>
        <div style={S.fg}>
          <label style={S.label}>Message</label>
          <textarea style={{ ...S.input, minHeight: 200, resize: "vertical" }} value={msg} onChange={e => setMsg(e.target.value)} />
        </div>
        <div style={S.infoBox}>In the live app this will send directly to the agent's inbox. For now, copy and paste it into your email.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          <button style={S.btn} onClick={() => { navigator.clipboard?.writeText(msg); onSend(actor.id); onClose(); }}>Copy & Mark Sent</button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk Add Modal ─────────────────────────────────────────────────
function BulkAddModal({ onClose, onSave }) {
  const [text, setText] = useState("");
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [parsed, setParsed] = useState([]);
  const [error, setError] = useState("");

  function parse() {
    setError("");
    const lines = text.trim().split("\n").filter(l => l.trim());
    const results = [];
    for (const line of lines) {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length < 3) { setError(`Line "${line}" needs: Actor Name, Agent Name, Agent Email`); return; }
      results.push({ name: parts[0], role: parts[1] || "", agentName: parts[2], agentEmail: parts[3] || "", rate: parts[4] || "", callTime: "", fittingDate: "", castingNotes: "" });
    }
    setParsed(results);
  }

  function handleSave() {
    const now = Date.now();
    const actors = parsed.map((a, i) => ({ ...a, id: now + i, sentAt: now, deadline: countdownEnabled ? now + 86400000 : null, countdownEnabled, submitted: false, submissionData: null, statusLog: [{ time: now, event: "Actor added via bulk import" }] }));
    onSave(actors);
    onClose();
  }

  return (
    <div style={S.modal}>
      <div style={S.modalBox}>
        <div style={S.modalTitle}>Bulk Add Actors</div>
        <div style={S.modalSub}>Paste one actor per line in this format:</div>
        <div style={{ ...S.infoBox, marginBottom: 16, fontFamily: "monospace", fontSize: 13 }}>
          Actor Name, Role, Agent Name, Agent Email, Rate (optional)
        </div>
        <div style={S.fg}>
          <label style={S.label}>Paste Actor List</label>
          <textarea style={{ ...S.input, minHeight: 180, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} value={text} onChange={e => { setText(e.target.value); setParsed([]); }} placeholder={"Monica Skipper, Jenny, Aaron, aaron@triskotalent.com, $600\nFilipe Dimas, Marcus, Shelley, shelley@ambitiontalent.com\nMark Curtin, Dave, Candace, cfulton@integralartists.com"} />
        </div>
        {error && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠ {error}</div>}
        {parsed.length > 0 && (
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>✓ {parsed.length} actors ready to add:</div>
            {parsed.map((a, i) => <div key={i} style={{ fontSize: 13, color: C.text, padding: "4px 0", borderBottom: `1px solid ${C.borderLight}` }}>{a.name} · {a.role} · {a.agentName}</div>)}
          </div>
        )}
        <div style={{ background: countdownEnabled ? "#f0f7ff" : C.bg, border: `1.5px solid ${countdownEnabled ? "#c0d8ff" : C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
          <Toggle on={countdownEnabled} onChange={setCountdownEnabled} label="Enable 24-Hour Countdown for All" sub={countdownEnabled ? "⏱ Timer starts now for all actors" : "No deadline — agents respond at any time"} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          {parsed.length === 0 ? <button style={S.btn} onClick={parse}>Preview</button> : <button style={S.btn} onClick={handleSave}>Add {parsed.length} Actors</button>}
        </div>
      </div>
    </div>
  );
}

// ── Hold Status Badge ──────────────────────────────────────────────
const HOLD_STATUSES = ["Booked", "1st Hold", "2nd Hold", "Callback", "Released"];
const HOLD_COLORS = { "Booked": C.green, "1st Hold": C.blue, "2nd Hold": C.purple, "Callback": C.orange, "Released": C.textTert };

function HoldBadge({ status }) {
  const col = HOLD_COLORS[status] || C.textTert;
  return <span style={{ ...C && {}, display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${col}20`, color: col, border: `1px solid ${col}40` }}>{status || "Booked"}</span>;
}

// ── Agent Autocomplete Field ───────────────────────────────────────
function AgentAutoField({ label, nameVal, emailVal, phoneVal, onName, onEmail, onPhone, agentBook }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);

  function handleNameChange(v) {
    onName(v);
    if (v.length > 1 && agentBook?.length) {
      const matches = agentBook.filter(a =>
        a.agentName.toLowerCase().includes(v.toLowerCase()) ||
        a.agencyName?.toLowerCase().includes(v.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSug(matches.length > 0);
    } else {
      setShowSug(false);
    }
  }

  function selectAgent(a) {
    onName(a.agentName);
    onEmail(a.agentEmail || "");
    onPhone(a.agentPhone || "");
    setShowSug(false);
  }

  return (
    <div style={{ position: "relative", gridColumn: "span 2" }}>
      <div style={S.grid2}>
        <div style={S.fg}>
          <label style={S.label}>{label} *</label>
          <input style={S.input} value={nameVal} onChange={e => handleNameChange(e.target.value)} placeholder="Agent name or agency..." onBlur={() => setTimeout(() => setShowSug(false), 200)} />
          {showSug && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: "50%", background: C.white, border: `1.5px solid ${C.blue}`, borderRadius: 10, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden" }}>
              {suggestions.map((a, i) => (
                <div key={i} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13 }}
                  onMouseDown={() => selectAgent(a)}>
                  <div style={{ fontWeight: 600, color: C.text }}>{a.agentName}</div>
                  <div style={{ color: C.textSec, fontSize: 11 }}>{a.agencyName} · {a.agentEmail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Field label="Agent Email *" val={emailVal} onChange={onEmail} type="email" />
      </div>
      {phoneVal !== undefined && <Field label="Agent Phone" val={phoneVal} onChange={onPhone} placeholder="+1 416 000 0000" />}
    </div>
  );
}

// ── Smart Paste Modal ──────────────────────────────────────────────
function SmartPasteModal({ onClose, onSave }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdownEnabled, setCountdownEnabled] = useState(false);

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setParsed([]);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Extract actor booking information from the following text. Return ONLY a JSON array with no preamble, no markdown, no backticks. Each object must have these keys: name (actor full name), role (character/role name or empty string), agentName (agent full name), agentEmail (email or empty string), rate (rate or empty string). If a field is not found, use empty string. Text:\n\n${text}`
          }]
        })
      });
      const data = await response.json();
      const raw = data.content?.map(i => i.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      if (!Array.isArray(result) || result.length === 0) throw new Error("No actors found");
      setParsed(result);
    } catch (e) {
      setError("Could not parse — try reformatting or use Bulk Add instead.");
    }
    setLoading(false);
  }

  function handleSave() {
    const now = Date.now();
    const actors = parsed.map((a, i) => ({
      ...a,
      id: now + i,
      sentAt: now,
      deadline: countdownEnabled ? now + 86400000 : null,
      countdownEnabled,
      submitted: false,
      submissionData: null,
      holdStatus: "Booked",
      wardrobeOnly: false,
      statusLog: [{ time: now, event: "Actor added via Smart Paste" }]
    }));
    onSave(actors);
    onClose();
  }

  return (
    <div style={S.modal}>
      <div style={S.modalBox}>
        <div style={S.modalTitle}>✨ Smart Paste</div>
        <div style={S.modalSub}>Paste your cast list in any format — email, notes, breakdown, spreadsheet copy. AI will extract the details.</div>
        <div style={S.fg}>
          <label style={S.label}>Paste anything</label>
          <textarea
            style={{ ...S.input, minHeight: 180, resize: "vertical", fontSize: 13 }}
            value={text}
            onChange={e => { setText(e.target.value); setParsed([]); setError(""); }}
            placeholder={"Examples of formats that work:\n\nMonica Skipper — Jenny. Agent: Aaron at Trisko (aaron@triskotalent.com). Rate $600 session.\n\nFilipe Dimas / Marcus / Shelley Ambition / shelley@ambitiontalent.com\n\nMark Curtin, Dave, Candace Fulton, cfulton@integralartists.com, $850+$2400 buyout"}
          />
        </div>
        {error && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠ {error}</div>}
        {loading && <div style={{ color: C.blue, fontSize: 13, marginBottom: 12 }}>✨ Parsing with AI...</div>}
        {parsed.length > 0 && (
          <div style={{ background: C.bg, border: `1.5px solid ${C.green}40`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 10 }}>✓ {parsed.length} actor{parsed.length > 1 ? "s" : ""} found — review before saving:</div>
            <table style={{ ...S.table, fontSize: 12 }}>
              <thead><tr>{["Actor", "Role", "Agent", "Email", "Rate"].map(h => <th key={h} style={{ ...S.th, fontSize: 10 }}>{h}</th>)}</tr></thead>
              <tbody>
                {parsed.map((a, i) => (
                  <tr key={i}>
                    <td style={S.td}>{a.name || <span style={{ color: C.red }}>⚠ Missing</span>}</td>
                    <td style={S.td}>{a.role || <span style={{ color: C.textTert }}>—</span>}</td>
                    <td style={S.td}>{a.agentName || <span style={{ color: C.red }}>⚠ Missing</span>}</td>
                    <td style={S.td}>{a.agentEmail || <span style={{ color: C.orange }}>Not found</span>}</td>
                    <td style={S.td}>{a.rate || <span style={{ color: C.textTert }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ background: countdownEnabled ? "#f0f7ff" : C.bg, border: `1.5px solid ${countdownEnabled ? "#c0d8ff" : C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
          <Toggle on={countdownEnabled} onChange={setCountdownEnabled} label="Enable 24-Hour Countdown for All" sub={countdownEnabled ? "⏱ Timer starts now for all actors" : "No deadline — agents respond at any time"} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          {parsed.length === 0
            ? <button style={{ ...S.btn, opacity: text.trim() ? 1 : 0.35 }} onClick={handleParse} disabled={loading}>
                {loading ? "Parsing..." : "✨ Parse with AI"}
              </button>
            : <button style={S.btn} onClick={handleSave}>Add {parsed.length} Actor{parsed.length > 1 ? "s" : ""}</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── Job Template Modal ─────────────────────────────────────────────
function TemplateModal({ onClose, onSave, templates }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [unionType, setUnionType] = useState("");
  const [usageTerms, setUsageTerms] = useState("");

  return (
    <div style={S.modal}>
      <div style={{ ...S.modalBox, maxWidth: 480 }}>
        <div style={S.modalTitle}>Save Job Template</div>
        <div style={S.modalSub}>Save current job settings as a reusable template.</div>
        <Field label="Template Name *" val={name} onChange={setName} placeholder="e.g. ACTRA National Broadcast" />
        <Field label="Client / Brand" val={client} onChange={setClient} placeholder="e.g. Rogers" />
        <Field label="Brand Category" val={category} onChange={setCategory} placeholder="e.g. Telecom" />
        <Sel label="Union Type" val={unionType} onChange={setUnionType} opts={["ACTRA", "Non-Union", "Mixed", "UBCP/ACTRA", "UDA"]} />
        <Field label="Default Usage Terms" val={usageTerms} onChange={setUsageTerms} placeholder="e.g. National Broadcast + Digital, Canada, 1 year" />
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, opacity: name ? 1 : 0.35 }} onClick={() => { if (name) { onSave({ id: Date.now(), name, client, category, unionType, usageTerms }); onClose(); } }}>Save Template</button>
        </div>
      </div>
    </div>
  );
}

// ── Actor Booking Card ─────────────────────────────────────────────
function ActorBookingCard({ actor, job, darkMode }) {
  const [showHistory, setShowHistory] = useState(false);
  const d = actor.submissionData || {};
  const now = Date.now();
  const isOverdue = actor.countdownEnabled && actor.deadline && now > actor.deadline;
  const status = actor.submitted ? "submitted" : isOverdue ? "overdue" : "pending";
  const address = d.street ? `${d.street}, ${d.city}, ${d.province} ${d.postal}` : null;
  const socials = [d.instagram && `IG: ${d.instagram}`, d.tiktok && `TT: ${d.tiktok}`, d.twitter && `X: ${d.twitter}`].filter(Boolean).join("  ·  ");
  const wardrobe = [d.shirtSize && `Shirt: ${d.shirtSize}`, d.pantsSize && `Pants: ${d.pantsSize}`, d.shoeSize && `Shoes: ${d.shoeSize}`, d.dressSize && `Dress: ${d.dressSize}`].filter(Boolean);

  if (status === "pending") {
    return (
      <div style={S.pendingCard}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 3 }}>{actor.name}</div>
        {actor.role && <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Role: {actor.role}</div>}
        <div style={{ fontSize: 13, color: C.textSec, marginBottom: 14 }}>Agent: {actor.agentName}</div>
        <Timer deadline={actor.deadline} submitted={false} countdownEnabled={actor.countdownEnabled} />
        <div style={{ fontSize: 12, color: C.textTert, marginTop: 8 }}>Awaiting agent submission</div>
        {actor.castingNotes && <div style={{ ...S.noteBox, marginTop: 14, textAlign: "left", width: "100%" }}><div style={S.noteLabel("#b8860b")}>Casting Notes</div><div style={S.noteText}>{actor.castingNotes}</div></div>}
      </div>
    );
  }
  if (status === "overdue") {
    return (
      <div style={{ ...S.actorCard("overdue"), padding: 0 }}>
        <div style={S.actorCardHeader("overdue")}>
          <div><div style={S.actorName}>{actor.name}</div>{actor.role && <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Role: {actor.role}</div>}<div style={S.actorMeta}>{actor.agentName} · {actor.agentEmail}</div></div>
          <span style={S.badge(C.red)}>OVERDUE</span>
        </div>
        <div style={{ padding: "20px 22px", textAlign: "center", color: C.textSec, fontSize: 14 }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>⚠️</div>
          Agent has not submitted. <span style={{ color: C.red, fontWeight: 600 }}>Follow up immediately.</span>
        </div>
        {actor.castingNotes && <div style={{ padding: "0 22px 18px" }}><div style={S.noteBox}><div style={S.noteLabel("#b8860b")}>Casting Notes</div><div style={S.noteText}>{actor.castingNotes}</div></div></div>}
      </div>
    );
  }

  return (
    <div style={{ ...S.actorCard("submitted"), padding: 0 }}>
      <div style={S.actorCardHeader("submitted")}>
        <div>
          <div style={S.actorName}>{actor.name}</div>
          {actor.role && <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Role: {actor.role}</div>}
          <div style={S.actorMeta}>{d.unionStatus || "Union TBD"}{d.actraNumber ? ` · #${d.actraNumber}` : ""} · {d.citizenship || ""}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={S.badge(C.green)}>Submitted ✓</span>
          <div style={{ fontSize: 11, color: C.textTert, marginTop: 3 }}>{d.submittedAt ? new Date(d.submittedAt).toLocaleString() : ""}</div>
          <button style={{ ...S.btnGhostSm, fontSize: 11, marginTop: 6 }} onClick={() => setShowHistory(!showHistory)}>{showHistory ? "Hide" : "History"}</button>
        </div>
      </div>
      {showHistory && (
        <div style={{ padding: "12px 22px", background: C.bg, borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textTert, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Status History</div>
          <StatusHistory actor={actor} />
        </div>
      )}
      <div style={S.actorCardBody}>
        <div style={S.sectionDivider}>Production</div>
        <div style={S.infoGrid}>
          <InfoRow label="Production" val={job.title} />
          <InfoRow label="Client / Brand" val={job.client} />
          <InfoRow label="Shoot Date" val={job.shootDate} />
          <InfoRow label="Call Time" val={actor.callTime} />
          <InfoRow label="Fitting Date" val={actor.fittingDate} />
          <InfoRow label="Union Type" val={job.isActra} />
        </div>
        <div style={S.sectionDivider}>Rate & Market / Usage</div>
        <div style={S.infoGrid}>
          <InfoRow label="Session Rate" val={d.rate || actor.rate} />
          <InfoRow label="Buyout / Usage Fee" val={d.buyout} />
          <InfoRow label="Market / Usage Terms" val={d.usageTerms || job.usageTerms} full />
        </div>
        <div style={S.sectionDivider}>Wardrobe</div>
        {wardrobe.length > 0 ? <div style={S.wardrobeRow}>{wardrobe.map(w => <div key={w} style={S.wardrobePill}>{w}</div>)}</div> : <div style={{ fontSize: 13, color: C.textTert, padding: "6px 0" }}>Not provided</div>}
        <div style={S.sectionDivider}>Contact</div>
        <div style={S.infoGrid}>
          <InfoRow label="Actor Email" val={d.actorEmail} />
          <InfoRow label="Actor Phone" val={d.actorPhone} />
          <InfoRow label="Address" val={address} full />
          <InfoRow label="Social Media" val={socials || null} full />
          <InfoRow label="Emergency Contact" val={d.emergencyName ? `${d.emergencyName} (${d.emergencyRelation}) · ${d.emergencyPhone}` : null} full />
        </div>
        <div style={S.sectionDivider}>Agent</div>
        <div style={S.infoGrid}>
          <InfoRow label="Agent" val={d.agentName} />
          <InfoRow label="Agency" val={d.agencyName} />
          <InfoRow label="Agent Email" val={d.agentEmail} />
          <InfoRow label="Agent Phone" val={d.agentPhone} />
        </div>
        <div style={S.sectionDivider}>Conflicts & Legal</div>
        <div style={S.conflictRow}>
          <div style={S.conflictPill(d.conflictConfirmed)}>{d.conflictConfirmed ? "✓" : "✗"} No Conflict</div>
          <div style={S.conflictPill(d.bookingAccepted)}>{d.bookingAccepted ? "✓" : "✗"} Booking Accepted</div>
          <div style={S.conflictPill(d.legalChecked)}>{d.legalChecked ? "✓" : "✗"} Legal Signed</div>
        </div>
        {d.signature && <div style={S.signatureBox}><div style={{ fontSize: 10, color: C.blue, marginBottom: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>E-Signature</div><div style={{ fontSize: 16, fontStyle: "italic", color: C.blue, fontWeight: 500 }}>{d.signature}</div><div style={{ fontSize: 11, color: C.textSec, marginTop: 3 }}>Signed {d.submittedAt ? new Date(d.submittedAt).toLocaleString() : ""}</div></div>}
        {(actor.castingNotes || d.notes) && (
          <div style={{ marginTop: 14 }}>
            <div style={S.sectionDivider}>Notes</div>
            {actor.castingNotes && <div style={S.noteBox}><div style={S.noteLabel("#b8860b")}>Casting Notes (Internal)</div><div style={S.noteText}>{actor.castingNotes}</div></div>}
            {d.notes && <div style={S.noteBoxBlue}><div style={S.noteLabel(C.blue)}>Agent Notes</div><div style={S.noteText}>{d.notes}</div></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Agent Form ─────────────────────────────────────────────────────
function AgentForm({ actor, job, onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const STEPS = ["Agreement", "Talent", "Agent & Pay", "Legal", "Done"];
  const [f, setF] = useState({
    actorLegalName: actor.name, actorEmail: "", actorPhone: "",
    street: "", city: "", province: "", postal: "", citizenship: "",
    instagram: "", tiktok: "", twitter: "",
    shirtSize: "", pantsSize: "", shoeSize: "", dressSize: "",
    unionStatus: "", actraNumber: "",
    emergencyName: "", emergencyPhone: "", emergencyRelation: "",
    notes: "",
    agentName: actor.agentName || "", agentPhone: "", agentEmail: actor.agentEmail || "", agencyName: "",
    rate: actor.rate || "", buyout: "", usageTerms: job.usageTerms || "",
    agreementRead: false, conflictConfirmed: false, bookingAccepted: false,
    responsibilityAccepted: false, legalChecked: false, signature: "",
    currentCampaigns: "",
  });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const ok0 = f.agreementRead;
  const ok1 = f.actorEmail && f.actorPhone && f.street && f.city && f.shirtSize && f.pantsSize && f.shoeSize && f.citizenship && f.unionStatus;
  const ok2 = f.agentName && f.agentPhone && f.agencyName;
  const ok3 = f.conflictConfirmed && f.bookingAccepted && f.responsibilityAccepted && f.legalChecked && f.signature.trim().length > 3 && f.currentCampaigns.trim().length > 0;
  function handleSubmit() { onSubmit(actor.id, { ...f, submittedAt: Date.now() }); setStep(4); }

  return (
    <div style={S.modal}>
      <div style={S.modalBox}>
        <div style={S.agentHeader}>
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAB2qADAAQAAAABAAABnAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgBnAHaAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAHv/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooA8a/aCt/izdfCHV4PgaVHilvs/wBiLsqLxNH5mS5Cj91v6n9ag/4aK+Df/C1f+FJf2x/xU/8Az5fZ5/TP+s8vyun+3XtlFAHif/DRXwb/AOFq/wDCkv7Y/wCKn/58vs8/pn/WeX5XT/bo/wCGivg3/wALV/4Ul/bH/FT/APPl9nn9M/6zy/K6f7de2UUAeJ/8NFfBv/hav/Ckv7Y/4qf/AJ8vs8/pn/WeX5XT/bqD4fXPxPuvjB48l8TNu8LBtOTQTgD5kiZbwevEwxz+HFe50UAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9H+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAor51+Nf7Xv7Kn7Ntm99+0B8SPDPgxEBYjWdUtrNyB12pK6s30ANfkZ8X/APg57/4ItfCGaSyPxZ/4Se6jJBi8P6Ze3y5HpL5KwHPqJCKAP39or+OH4j/8Hqn/AATv8PTPbfDX4d+O/EhQkCSeGysIW9wTdSv+aCvk7xL/AMHxPgWNiPCH7PF/MOxvPEUcefwSzf8AnQB/efRX+e9P/wAHyHjASH7L+zdZlc8bvFL5x+GnVuaR/wAHx160g/t/9nFETPP2fxOWOP8AgWnigD/QFor+Hjwj/wAHvf7M15Ki+O/gZ4n05Djc1hqdreEfQSLb/wA6+7fhf/weCf8ABITx2I08YXHi/wAGSOQD/aujeeq57lrGa54/CgD+pqivyz+CX/Bbf/gk3+0NLDafDL49eEnubj7ltqV5/ZM5PoI74W757dOtfptomvaF4m0yLWvDd7BqFnMN0c9tIssTg91ZSQfwNAGtRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/9L+/iiikoAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiivwm/4KW/8ABw7/AME8/wDgmx9t8F+I9dPj74h22U/4RXw3Ik88Mo7Xk+fJtQM8q5MuORGaAP3Zr8x/22/+Cxn/AATm/wCCfVvc2v7SPxM02012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LjTf2dvAKODkFtDtn/8AQkNAH+V14x/4L7f8Fj/HQddb/aD8VQrJkEWE0VgMH0+yxxYr5c1T42f8FF/2urz7Fqviv4ifEqW4faIDealq24+ioGkH4AV/s1+Dv2Cv2HPh7Ik3gX4N+CNIkj5WS08P2MLgj/aWEN+tfTuk6Joug2wstCs4LKEdI4I1jXj2UAUAf4z3wS/4IG/8Fg/2grqAeDvgR4lsIrk5+06/EmiRAH+Im/eA+/AJr9wP2cP+DK79tnxtLBqH7TPxI8MeA7NiDJbaWk2tXoXuMYt4AfcSsM9jX+lrRQB/Lr+yb/waPf8ABKr9nqa1174s2es/FzWLf5mPiC68jT9/qLS0EQK/7Mryj1zX9HXwj+CPwb+AXhGHwB8DvCukeD9EtwBHY6NZxWVuMcZ2Qqqk+pIye9eoUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//1v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9f+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==" alt="Powerhouse Casting" style={{ width: 56, height: 56, filter: "invert(0.8)", marginBottom: 10, display: "block", margin: "0 auto 10px", objectFit: "contain" }} />
          <div style={{ fontSize: 11, letterSpacing: 2, color: C.blue, textTransform: "uppercase", marginBottom: 5, fontWeight: 600 }}>Powerhouse Casting · Agent Submission</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>{actor.name}</div>
          {actor.role && <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>Role: {actor.role}</div>}
          <div style={{ fontSize: 14, color: C.textSec, marginTop: 3 }}>{job.title} — {job.client} · {job.category}</div>
          {actor.countdownEnabled && actor.deadline ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, color: C.orange, fontWeight: 600 }}>⏱ Deadline: {new Date(actor.deadline).toLocaleString()}</div>
              <div style={{ fontSize: 13, color: C.textSec, marginTop: 4, fontStyle: "italic" }}>This production is moving quickly — please fill out this form within 24 hours.</div>
            </div>
          ) : <div style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>📅 Shoot: {job.shootDate}</div>}
        </div>
        <div style={S.stepBar}>{STEPS.map((label, i) => <div key={label} style={S.step(i === step, i < step)}>{i < step ? "✓ " : ""}{label}</div>)}</div>

        {step === 0 && <>
          <div style={S.sec}>📄 Booking Agreement</div>
          <div style={S.infoBox}>Please read the full agreement carefully and accept all terms before proceeding.</div>
          <div style={S.legalScroll}>
            <strong style={{ color: C.text }}>BOOKING AGREEMENT & TERMS OF ENGAGEMENT</strong><br /><br />
            This agreement is between Powerhouse Casting / Production Company ("Production") and the undersigned Talent Agent ("Agent") on behalf of the booked performer ("Talent").<br /><br />
            <strong style={{ color: C.text }}>1. BOOKING CONFIRMATION</strong><br />Talent is available and committed to shoot date(s) for <strong>{job.title}</strong> for <strong>{job.client}</strong>. Cancellation after confirmation may result in financial penalties.<br /><br />
            <strong style={{ color: C.text }}>2. EXCLUSIVITY & CONFLICTS</strong><br />Talent is not contracted for any campaign competing with <strong>{job.client}</strong> in the <strong>{job.category}</strong> category. Agent accepts full responsibility for any undisclosed conflict.<br /><br />
            <strong style={{ color: C.text }}>3. USAGE & RIGHTS</strong><br />Usage: <strong>{job.usageTerms || "as agreed"}</strong>. Any usage beyond agreed terms requires separate negotiation.<br /><br />
            <strong style={{ color: C.text }}>4. RATE & PAYMENT</strong><br />{job.isActra ? `${job.isActra} production — all applicable union rates and residuals apply.` : "Non-union rates apply."} Invoices within 30 days of shoot.<br /><br />
            <strong style={{ color: C.text }}>5. LEGAL RESPONSIBILITY</strong><br />Agent accepts full legal responsibility for accuracy of all information. Any misrepresentation is the sole liability of the Agent and agency.<br /><br />
            <strong style={{ color: C.text }}>6. CONFIDENTIALITY</strong><br />All booking terms including rates are strictly confidential.
          </div>
          <Check checked={f.agreementRead} onChange={s("agreementRead")}>I have read, understood, and agree to all terms on behalf of myself and my agency.</Check>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={onClose}>Cancel</button>
            <button style={{ ...S.btn, opacity: ok0 ? 1 : 0.35 }} onClick={() => ok0 && setStep(1)}>I Agree — Continue →</button>
          </div>
        </>}

        {step === 1 && <>
          <div style={S.sec}>Talent Information</div>
          <div style={S.grid2}>
            <Field label="Actor Legal Name *" val={f.actorLegalName} onChange={s("actorLegalName")} />
            <Field label="Actor Email *" val={f.actorEmail} onChange={s("actorEmail")} type="email" />
            <Field label="Actor Phone *" val={f.actorPhone} onChange={s("actorPhone")} placeholder="+1 416 000 0000" />
            <Sel label="Citizenship / Work Status *" val={f.citizenship} onChange={s("citizenship")} opts={["Canadian Citizen","Permanent Resident","Work Permit Holder","US Citizen","Other"]} />
          </div>
          <div style={S.sec}>Union Status</div>
          <div style={S.grid2}>
            <Sel label="Union Status *" val={f.unionStatus} onChange={s("unionStatus")} opts={["ACTRA","Non-Union","UBCP/ACTRA","UDA","SAG-AFTRA","Other"]} />
            {(f.unionStatus === "ACTRA" || f.unionStatus === "UBCP/ACTRA" || f.unionStatus === "UDA") && <Field label="Union Member Number *" val={f.actraNumber} onChange={s("actraNumber")} placeholder="e.g. 05-12345" />}
          </div>
          <div style={S.sec}>Mailing Address</div>
          <Field label="Street Address *" val={f.street} onChange={s("street")} placeholder="123 Main St" />
          <div style={S.grid3}><Field label="City *" val={f.city} onChange={s("city")} /><Field label="Province / State *" val={f.province} onChange={s("province")} /><Field label="Postal / Zip *" val={f.postal} onChange={s("postal")} /></div>
          <div style={S.sec}>Social Media</div>
          <div style={S.grid3}><Field label="Instagram" val={f.instagram} onChange={s("instagram")} placeholder="@handle" /><Field label="TikTok" val={f.tiktok} onChange={s("tiktok")} placeholder="@handle" /><Field label="Twitter / X" val={f.twitter} onChange={s("twitter")} placeholder="@handle" /></div>
          <div style={S.sec}>Wardrobe Sizes</div>
          <div style={S.grid3}><Sel label="Shirt / Top *" val={f.shirtSize} onChange={s("shirtSize")} opts={["XS","S","M","L","XL","XXL","XXXL"]} /><Field label="Pants Size *" val={f.pantsSize} onChange={s("pantsSize")} placeholder="e.g. 32x30" /><Field label="Shoe Size *" val={f.shoeSize} onChange={s("shoeSize")} placeholder="e.g. 10 US" /><Field label="Dress Size (if applicable)" val={f.dressSize} onChange={s("dressSize")} placeholder="e.g. 6" /></div>
          <div style={S.sec}>Emergency Contact</div>
          <div style={S.grid3}><Field label="Contact Name" val={f.emergencyName} onChange={s("emergencyName")} /><Field label="Contact Phone" val={f.emergencyPhone} onChange={s("emergencyPhone")} /><Field label="Relationship" val={f.emergencyRelation} onChange={s("emergencyRelation")} placeholder="e.g. Spouse" /></div>
          <div style={S.fg}><label style={S.label}>Notes from Agent</label><textarea style={{ ...S.input, minHeight: 72, resize: "vertical" }} value={f.notes} onChange={e => s("notes")(e.target.value)} placeholder="Any special notes, concerns, or requests" /></div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setStep(0)}>← Back</button>
            <button style={{ ...S.btn, opacity: ok1 ? 1 : 0.35 }} onClick={() => ok1 && setStep(2)}>Next: Agent & Pay →</button>
          </div>
        </>}

        {step === 2 && <>
          <div style={S.sec}>Agent & Agency Details</div>
          <div style={S.grid2}><Field label="Agent Full Name *" val={f.agentName} onChange={s("agentName")} /><Field label="Agent Phone *" val={f.agentPhone} onChange={s("agentPhone")} /><Field label="Agent Email *" val={f.agentEmail} onChange={s("agentEmail")} type="email" /><Field label="Agency Name *" val={f.agencyName} onChange={s("agencyName")} /></div>
          <div style={S.sec}>Rate & Payment</div>
          <div style={S.grid2}><Field label="Session Rate" val={f.rate} onChange={s("rate")} placeholder="e.g. $850 + 15% agency" /><Field label="Buyout / Usage Fee" val={f.buyout} onChange={s("buyout")} placeholder="e.g. $2,400 flat" /></div>
          <Field label="Market / Usage Terms" val={f.usageTerms} onChange={s("usageTerms")} placeholder="e.g. National Broadcast + Digital, Canada, 1 year" />
          <div style={S.infoBox}>💡 Rate information is stored securely and visible only to production.</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...S.btn, opacity: ok2 ? 1 : 0.35 }} onClick={() => ok2 && setStep(3)}>Next: Legal Sign →</button>
          </div>
        </>}

        {step === 3 && <>
          <div style={S.sec}>⚠️ Conflict of Interest Declaration</div>
          <div style={S.warnBox}><strong>MANDATORY — </strong>Confirm {actor.name} has no competing brand conflict. Failure to disclose makes you solely legally liable.</div>
          <Check checked={f.conflictConfirmed} onChange={s("conflictConfirmed")}>I confirm that <strong>{actor.name}</strong> is NOT currently appearing in, contracted for, or negotiating any campaign competing with <strong>{job.client}</strong> in the <strong>{job.category}</strong> category.</Check>
          <Check checked={f.bookingAccepted} onChange={s("bookingAccepted")}>I confirm <strong>{actor.name}</strong> accepts this booking for <strong>{job.title}</strong> (shoot: <strong>{job.shootDate}</strong>) and agrees to all terms, rates, and usage.</Check>
          <hr style={S.hr} />
          <div style={S.sec}>Legal Indemnification & Hold Harmless</div>
          <div style={S.legalScroll}>
            <strong style={{ color: C.text }}>LEGAL RESPONSIBILITY, INDEMNIFICATION & HOLD HARMLESS</strong><br /><br />
            By signing below, I, the agent of record for {actor.name}, personally and on behalf of {f.agencyName || "[Agency Name]"}, accept full and sole legal responsibility for any claims, damages, losses, costs, or liabilities — including legal fees — arising from:<br /><br />
            (a) Any undisclosed conflict of interest; (b) Any inaccurate or misleading information submitted; (c) Any breach of exclusivity from undisclosed bookings; (d) Any misrepresentation of union status or work eligibility.<br /><br />
            The Casting Director, Production Company, Client, and all affiliated parties shall bear NO legal responsibility for any conflict or liability from withheld or misrepresented information. I agree to indemnify and hold harmless all production parties at my sole expense. This is legally binding under applicable Canadian and provincial law.
          </div>
          <Check checked={f.responsibilityAccepted} onChange={s("responsibilityAccepted")}>I personally and on behalf of <strong>{f.agencyName || "my agency"}</strong> accept full legal responsibility and agree to indemnify and hold harmless the Casting Director and all Production parties.</Check>
          <Check checked={f.legalChecked} onChange={s("legalChecked")}>I have read the full Legal Indemnification & Hold Harmless agreement and accept all terms.</Check>
          <div style={S.fg}>
            <label style={{ ...S.label, color: C.red }}>⚠ Current Brand Campaigns — Mandatory Disclosure *</label>
            <textarea
              style={{ ...S.input, minHeight: 72, resize: "vertical", border: `1.5px solid ${C.red}40` }}
              value={f.currentCampaigns}
              onChange={e => s("currentCampaigns")(e.target.value)}
              placeholder={`List ALL brand campaigns ${actor.name} is currently appearing in or contracted for — including campaigns in post-production. If none, type "None".`}
            />
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>This disclosure is legally required. Failure to list a conflicting campaign is the sole legal liability of the agent and agency.</div>
          </div>
          <div style={S.fg}>
            <label style={S.label}>Electronic Signature — Type Your Full Legal Name *</label>
            <input style={{ ...S.input, fontStyle: "italic", fontSize: 17 }} value={f.signature} onChange={e => s("signature")(e.target.value)} placeholder="Your full legal name as it appears on government-issued ID" />
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 6 }}>Typing your name constitutes a legally binding electronic signature. IP address and timestamp are automatically recorded.</div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={S.btnGhost} onClick={() => setStep(2)}>← Back</button>
            <button style={{ ...S.btnGreen, opacity: ok3 ? 1 : 0.35 }} onClick={() => ok3 && handleSubmit()}>✓ Sign & Submit</button>
          </div>
        </>}

        {step === 4 && (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Submission Complete</div>
            <div style={{ color: C.textSec, fontSize: 15, lineHeight: 1.8, maxWidth: 400, margin: "0 auto 28px" }}>
              Submission for <strong style={{ color: C.text }}>{actor.name}</strong> received.<br />Legal record with e-signature and timestamp stored permanently.
            </div>
            <button style={S.btn} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function JobModal({ onClose, onSave, existing, templates, onSaveTemplate }) {
  const [f, setF] = useState(existing || { title: "", client: "", category: "", shootDateStart: "", shootDateEnd: "", usageTerms: "", isActra: "" });
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const isValidDateRange = !f.shootDateEnd || f.shootDateEnd >= f.shootDateStart;
  const ok = f.title && f.client && f.category && f.shootDateStart && isValidDateRange;
  const shootDate = f.shootDateEnd && f.shootDateEnd !== f.shootDateStart ? `${f.shootDateStart} – ${f.shootDateEnd}` : f.shootDateStart;

  function applyTemplate(t) {
    setF(p => ({ ...p, client: t.client || p.client, category: t.category || p.category, isActra: t.unionType || p.isActra, usageTerms: t.usageTerms || p.usageTerms }));
  }

  return (
    <div style={S.modal}>
      <div style={S.modalBox}>
        <div style={S.modalTitle}>{existing ? "Edit Job" : "New Booking Job"}</div>
        <div style={S.modalSub}>{existing ? "Update production details." : "Enter production details to create a new booking."}</div>
        {templates && templates.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Load from Template</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {templates.map(t => (
                <button key={t.id} style={S.btnGhostSm} onClick={() => applyTemplate(t)}>{t.name}</button>
              ))}
            </div>
          </div>
        )}
        <Field label="Production Title *" val={f.title} onChange={s("title")} placeholder="e.g. Spring TVC — Nike" />
        <div style={S.grid2}>
          <Field label="Client / Brand *" val={f.client} onChange={s("client")} placeholder="e.g. Nike" />
          <Field label="Brand Category *" val={f.category} onChange={s("category")} placeholder="e.g. Athletic Footwear" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div style={S.fg}><label style={S.label}>Shoot Start Date *</label><input style={S.input} type="date" value={f.shootDateStart || ""} onChange={e => s("shootDateStart")(e.target.value)} /></div>
          <div style={S.fg}><label style={S.label}>Shoot End Date</label><input style={{...S.input, borderColor: isValidDateRange ? S.input.borderColor : "#ff3b30"}} type="date" value={f.shootDateEnd || ""} onChange={e => s("shootDateEnd")(e.target.value)} /></div>
          <Sel label="Union Type" val={f.isActra} onChange={s("isActra")} opts={["ACTRA","Non-Union","Mixed","UBCP/ACTRA","UDA"]} />
        </div>
        {!isValidDateRange && <div style={{color: "#ff3b30", fontSize: 13, marginTop: -12, marginBottom: 16}}>End date cannot be before start date.</div>}
        <Field label="Market / Usage Terms" val={f.usageTerms} onChange={s("usageTerms")} placeholder="e.g. National Broadcast + Digital, Canada, 1 year" />
        {onSaveTemplate && (
          <div style={{ marginBottom: 16 }}>
            <button style={S.btnGhostSm} onClick={() => setShowSaveTemplate(!showSaveTemplate)}>
              {showSaveTemplate ? "Cancel" : "💾 Save as Template"}
            </button>
            {showSaveTemplate && (
              <div style={{ marginTop: 10 }}>
                <div style={S.infoBox}>Template will save: client, category, union type, and usage terms for reuse on future jobs.</div>
                <button style={S.btnGold} onClick={() => {
                  if (onSaveTemplate && f.client) {
                    onSaveTemplate({ id: Date.now(), name: `${f.client} — ${f.category || "Template"}`, client: f.client, category: f.category, unionType: f.isActra, usageTerms: f.usageTerms });
                    setShowSaveTemplate(false);
                  }
                }}>Save Template</button>
              </div>
            )}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, opacity: ok ? 1 : 0.35 }} onClick={() => ok && (onSave({ ...f, shootDate, id: existing?.id || Date.now(), createdAt: existing?.createdAt || Date.now(), actors: existing?.actors || [], archived: existing?.archived || false }), onClose())}>{existing ? "Save Changes" : "Create Job"}</button>
        </div>
      </div>
    </div>
  );
}

function AddActorModal({ onClose, onSave, agentBook }) {
  const [f, setF] = useState({ name: "", role: "", agentName: "", agentEmail: "", agentPhone: "", sessionRate: "", buyoutFee: "", callTime: "", fittingDate: "", castingNotes: "" });
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [holdStatus, setHoldStatus] = useState("Booked");
  const [wardrobeOnly, setWardrobeOnly] = useState(false);
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const ok = f.name && f.agentName && f.agentEmail;
  function handleSave() {
    if (!ok) return;
    const now = Date.now();
    onSave({ ...f, id: now, sentAt: now, deadline: countdownEnabled ? now + 86400000 : null, countdownEnabled, submitted: false, submissionData: null, holdStatus, wardrobeOnly, statusLog: [{ time: now, event: "Actor added & form sent" }] });
    onClose();
  }
  return (
    <div style={S.modal}>
      <div style={S.modalBox}>
        <div style={S.modalTitle}>Add Booked Actor</div>
        <div style={S.modalSub}>Enter talent and agent details for this booking.</div>
        <div style={S.grid2}>
          <Field label="Actor Name *" val={f.name} onChange={s("name")} />
          <Field label="Role *" val={f.role} onChange={s("role")} placeholder="e.g. Jenny, Hero Dad, Team" />
        </div>
        <div style={S.fg}>
          <label style={S.label}>Hold Status</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            {HOLD_STATUSES.map(hs => (
              <button key={hs} style={{ ...S.btnGhostSm, background: holdStatus === hs ? HOLD_COLORS[hs] : "transparent", color: holdStatus === hs ? C.white : HOLD_COLORS[hs] || C.textSec, border: `1.5px solid ${HOLD_COLORS[hs] || C.border}40` }} onClick={() => setHoldStatus(hs)}>{hs}</button>
            ))}
          </div>
        </div>
        <div style={S.grid2}>
          <Field label="Agent Name *" val={f.agentName} onChange={v => { s("agentName")(v); if (agentBook) { const m = agentBook.find(a => a.agentName.toLowerCase() === v.toLowerCase()); if (m) { s("agentEmail")(m.agentEmail || ""); s("agentPhone")(m.agentPhone || ""); } } }} />
          <Field label="Agent Email *" val={f.agentEmail} onChange={s("agentEmail")} type="email" />
          <Field label="Agent Phone" val={f.agentPhone} onChange={s("agentPhone")} placeholder="+1 416 000 0000" />
          <div />
          <Field label="Call Time" val={f.callTime} onChange={s("callTime")} placeholder="e.g. 7:00 AM" />
          <Field label="Fitting Date / Time" val={f.fittingDate} onChange={s("fittingDate")} placeholder="e.g. May 7, 2:00 PM" />
          <Field label="Session Rate" val={f.sessionRate} onChange={s("sessionRate")} placeholder="e.g. $850 session" />
          <Field label="Buyout / Usage Fee" val={f.buyoutFee} onChange={s("buyoutFee")} placeholder="e.g. $2,400 flat" />
        </div>
        <div style={S.fg}><label style={S.label}>Casting Notes (internal)</label><textarea style={{ ...S.input, minHeight: 64, resize: "vertical" }} value={f.castingNotes} onChange={e => s("castingNotes")(e.target.value)} placeholder="Internal notes — visible on booking sheet to your team only" /></div>
        <div style={{ background: wardrobeOnly ? "#fff8f0" : C.bg, border: `1.5px solid ${wardrobeOnly ? C.orange : C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
          <Toggle on={wardrobeOnly} onChange={setWardrobeOnly} label="Wardrobe / Sizes Only" sub={wardrobeOnly ? "Agent will only see wardrobe fields — legal block suppressed" : "Full form including legal indemnification"} />
        </div>
        <div style={{ background: countdownEnabled ? "#f0f7ff" : C.bg, border: `1.5px solid ${countdownEnabled ? "#c0d8ff" : C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 22 }}>
          <Toggle on={countdownEnabled} onChange={setCountdownEnabled} label="Enable 24-Hour Response Countdown" sub={countdownEnabled ? "⏱ Timer starts now — agent has 24 hours to submit" : "No deadline — agent responds at any time"} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btn, opacity: ok ? 1 : 0.35 }} onClick={handleSave}>{countdownEnabled ? "Add Actor & Start Timer" : "Add Actor"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Booking Sheet ──────────────────────────────────────────────────
function BookingSheet({ jobs, darkMode }) {
  const [filterJob, setFilterJob] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const now = Date.now();
  const activeJobs = jobs.filter(j => !j.archived);
  const allActors = activeJobs.flatMap(j => j.actors.map(a => ({ ...a, job: j })));
  const isOverdue = a => !a.submitted && a.countdownEnabled && a.deadline && now > a.deadline;
  const isPending = a => !a.submitted && !isOverdue(a);
  const filtered = allActors
    .filter(a => filterJob === "all" || a.job.id === parseInt(filterJob))
    .filter(a => { if (filterStatus === "all") return true; if (filterStatus === "submitted") return a.submitted; if (filterStatus === "pending") return isPending(a); if (filterStatus === "overdue") return isOverdue(a); return true; })
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.agentName.toLowerCase().includes(search.toLowerCase()) || (a.role || "").toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Live Booking Sheet</div><div style={S.pageSub}>Real-time talent info — share with production</div></div>
        <button style={S.btn} onClick={() => window.print()}>🖨 Print / Save PDF</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {[[allActors.length,"Total",C.blue],[allActors.filter(a=>a.submitted).length,"Submitted",C.green],[allActors.filter(isPending).length,"Pending",C.orange],[allActors.filter(isOverdue).length,"Overdue",C.red]].map(([n,l,c]) => <div key={l} style={S.pill(c)}>{n} {l}</div>)}
      </div>
      <div style={S.searchBox}>
        <span style={{ color: C.textTert, fontSize: 16 }}>🔍</span>
        <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: C.text, fontFamily: "inherit" }} placeholder="Search by actor, role, or agent..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textTert, fontSize: 16 }} onClick={() => setSearch("")}>✕</button>}
      </div>
      {activeJobs.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <select style={{ ...S.input, width: "auto", minWidth: 190, fontSize: 14, padding: "9px 13px" }} value={filterJob} onChange={e => setFilterJob(e.target.value)}>
            <option value="all">All Productions</option>
            {activeJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <select style={{ ...S.input, width: "auto", minWidth: 150, fontSize: 14, padding: "9px 13px" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      )}
      {filtered.length === 0 ? (
        <div style={{ ...S.card, ...S.empty }}><div style={{ fontSize: 36, marginBottom: 10 }}>📋</div><div style={{ fontSize: 16 }}>{search ? "No results found." : "No bookings yet."}</div></div>
      ) : (
        <div style={S.sheetGrid}>{filtered.map(a => <ActorBookingCard key={a.id} actor={a} job={a.job} darkMode={darkMode} />)}</div>
      )}
    </div>
  );
}

// ── Job Detail ─────────────────────────────────────────────────────
function JobDetail({ job, onBack, onAddActor, onBulkAdd, onSmartPaste, onOpenForm, onDeleteActor, onReminder, onEdit, onSendAll }) {
  const now = Date.now();
  const sub = job.actors.filter(a => a.submitted).length;
  const over = job.actors.filter(a => !a.submitted && a.countdownEnabled && a.deadline && now > a.deadline).length;
  const pend = job.actors.filter(a => !a.submitted && !(a.countdownEnabled && a.deadline && now > a.deadline)).length;
  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <button style={{ ...S.btnGhostSm, marginBottom: 14 }} onClick={onBack}>← All Jobs</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={S.pageTitle}>{job.title}</div>
            {job.archived && <span style={S.archiveBadge}>Archived</span>}
          </div>
          <div style={S.pageSub}>{job.client} · {job.category}{job.isActra ? ` · ${job.isActra}` : ""} · Shoot: {job.shootDate}</div>
          {job.usageTerms && <div style={{ fontSize: 13, color: C.textTert, marginTop: 3 }}>Usage: {job.usageTerms}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button style={S.btnGhostSm} onClick={onEdit}>✏️ Edit</button>
          <button style={S.btnGhostSm} onClick={onBulkAdd}>📋 Bulk Add</button>
          <button style={S.btnPurple} onClick={onSmartPaste}>✨ Smart Paste</button>
          <button style={S.btn} onClick={onAddActor}>+ Add Actor</button>
          {job.actors.length > 0 && <button style={S.btnGreen} onClick={onSendAll}>📧 Send All Requests</button>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 26 }}>
        {[[sub,"Submitted",C.green],[pend,"Awaiting Response",C.orange],[over,"Overdue",C.red]].map(([n,l,c]) => <div key={l} style={S.statCard(c)}><div style={S.statNum}>{n}</div><div style={S.statLabel}>{l}</div></div>)}
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}><span>Booked Talent ({job.actors.length})</span></div>
        {job.actors.length === 0 ? (
          <div style={S.empty}><div style={{ fontSize: 32, marginBottom: 10 }}>🎬</div><div>No actors yet — click "+ Add Actor" to begin.</div></div>
        ) : (
          <table style={S.table}>
            <thead><tr>{["Actor","Role","Agent","Email","Call","Fitting","Deadline","Status",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {job.actors.map(a => {
                const overdue = !a.submitted && a.countdownEnabled && a.deadline && Date.now() > a.deadline;
                return (
                  <tr key={a.id}>
                    <td style={{ ...S.td, fontWeight: 600 }}>{a.name}{a.castingNotes && <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, fontStyle: "italic" }}>📝 {a.castingNotes.slice(0,36)}{a.castingNotes.length > 36 ? "…" : ""}</div>}</td>
                    <td style={{ ...S.td, color: C.gold, fontWeight: 600 }}>{a.role || "—"}</td>
                    <td style={S.td}>{a.agentName}</td>
                    <td style={S.td}>{a.agentEmail}</td>
                    <td style={S.td}>{a.callTime || "—"}</td>
                    <td style={S.td}>{a.fittingDate || "—"}</td>
                    <td style={S.td}><Timer deadline={a.deadline} submitted={a.submitted} countdownEnabled={a.countdownEnabled} /></td>
                    <td style={S.td}>{a.submitted ? <span style={S.badge(C.green)}>Submitted</span> : overdue ? <span style={S.badge(C.red)}>Overdue</span> : <span style={S.badge(C.orange)}>Awaiting</span>}</td>
                    <td style={S.td}>
                      <div style={S.rowActions}>
                        {!a.submitted && <button style={S.btnSm} onClick={() => onOpenForm(a)}>Form</button>}
                        {!a.submitted && <button style={S.btnGold} onClick={() => onReminder(a)}>Remind</button>}
                        {a.submitted && <span style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>✓ Done</span>}
                        <button style={S.btnDanger} onClick={() => onDeleteActor(a.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Jobs List ──────────────────────────────────────────────────────
function JobsList({ jobs, onSelect, onNewJob, onDelete, onDuplicate, onArchive, onUnarchive }) {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const filtered = jobs
    .filter(j => showArchived ? j.archived : !j.archived)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.client.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Booking Jobs</div><div style={S.pageSub}>All productions</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btnGhostSm} onClick={() => setShowArchived(!showArchived)}>{showArchived ? "Active Jobs" : "Archived"}</button>
          <button style={S.btn} onClick={onNewJob}>+ New Job</button>
        </div>
      </div>
      <div style={S.searchBox}>
        <span style={{ color: C.textTert, fontSize: 16 }}>🔍</span>
        <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: C.text, fontFamily: "inherit" }} placeholder="Search productions or clients..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textTert, fontSize: 16 }} onClick={() => setSearch("")}>✕</button>}
      </div>
      {filtered.length === 0 ? (
        <div style={{ ...S.card, ...S.empty }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🎬</div>
          <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{showArchived ? "No archived jobs" : "No jobs yet"}</div>
          {!showArchived && <><div style={{ color: C.textSec, marginBottom: 22 }}>Create your first booking job to get started</div><button style={S.btn} onClick={onNewJob}>+ New Job</button></>}
        </div>
      ) : (
        <div style={S.card}>
          <table style={S.table}>
            <thead><tr>{["Production","Client","Category","Union","Shoot Date","Actors","Submitted","Overdue",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(j => {
                const sub = j.actors.filter(a => a.submitted).length;
                const over = j.actors.filter(a => !a.submitted && a.countdownEnabled && a.deadline && Date.now() > a.deadline).length;
                return (
                  <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => onSelect(j.id)}>
                    <td style={{ ...S.td, fontWeight: 600 }}>{j.title}{j.archived && <span style={{ ...S.archiveBadge, marginLeft: 8 }}>Archived</span>}</td>
                    <td style={S.td}>{j.client}</td>
                    <td style={S.td}>{j.category}</td>
                    <td style={S.td}>{j.isActra || "—"}</td>
                    <td style={S.td}>{j.shootDate}</td>
                    <td style={S.td}>{j.actors.length}</td>
                    <td style={S.td}><span style={S.badge(C.green)}>{sub}</span></td>
                    <td style={S.td}>{over > 0 ? <span style={S.badge(C.red)}>{over}</span> : <span style={{ color: C.textTert }}>—</span>}</td>
                    <td style={S.td} onClick={e => e.stopPropagation()}>
                      <div style={S.rowActions}>
                        <button style={S.btnGhostSm} onClick={() => onDuplicate(j.id, false)}>⧉ Dupe</button>
                        <button style={S.btnGhostSm} onClick={() => onDuplicate(j.id, true)}>⧉ +Cast</button>
                        <button style={S.btnGhostSm} onClick={() => j.archived ? onUnarchive(j.id) : onArchive(j.id)}>{j.archived ? "Restore" : "Archive"}</button>
                        <button style={S.btnDanger} onClick={() => onDelete(j.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────
function Dashboard({ jobs, onNav, darkMode, setDarkMode }) {
  const activeJobs = jobs.filter(j => !j.archived);
  const all = activeJobs.flatMap(j => j.actors);
  const now = Date.now();
  const stats = [
    [all.length,"Total Bookings",C.blue],
    [all.filter(a=>!a.submitted&&!(a.countdownEnabled&&a.deadline&&now>a.deadline)).length,"Awaiting Response",C.orange],
    [all.filter(a=>a.submitted).length,"Confirmed",C.green],
    [all.filter(a=>!a.submitted&&a.countdownEnabled&&a.deadline&&now>a.deadline).length,"Overdue",C.red],
  ];
  return (
    <div>
      <div style={S.pageHeader}>
        <div><div style={S.pageTitle}>Dashboard</div><div style={S.pageSub}>Powerhouse Casting · Talent Management</div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={S.btnGhostSm} onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light" : "🌙 Dark"}</button>
          <button style={S.btn} onClick={() => onNav("newjob")}>+ New Job</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 28 }}>
        {stats.map(([n,l,c]) => <div key={l} style={S.statCard(c)}><div style={S.statNum}>{n}</div><div style={S.statLabel}>{l}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <div style={S.card}>
          <div style={S.cardTitle}><span>Active Jobs</span><span style={{ fontSize: 14, color: C.blue, cursor: "pointer", fontWeight: 500 }} onClick={() => onNav("jobs")}>View all →</span></div>
          {activeJobs.length === 0 ? <div style={{ color: C.textSec, fontSize: 14, textAlign: "center", padding: "24px 0" }}>No active jobs</div>
            : activeJobs.slice(0, 6).map(j => (
              <div key={j.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <div><div style={{ fontWeight: 600, fontSize: 15 }}>{j.title}</div><div style={{ color: C.textSec, fontSize: 12, marginTop: 2 }}>{j.client} · {j.actors.length} actors{j.isActra ? ` · ${j.isActra}` : ""}</div></div>
                <div style={{ fontSize: 12, color: C.textTert }}>{j.shootDate}</div>
              </div>
            ))}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}><span>Recent Bookings</span><span style={{ fontSize: 14, color: C.blue, cursor: "pointer", fontWeight: 500 }} onClick={() => onNav("sheet")}>Live sheet →</span></div>
          {all.length === 0 ? <div style={{ color: C.textSec, fontSize: 14, textAlign: "center", padding: "24px 0" }}>No bookings yet</div>
            : all.slice(-6).reverse().map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <div><div style={{ fontWeight: 600, fontSize: 15 }}>{a.name}</div>{a.role && <div style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{a.role}</div>}</div>
                <Timer deadline={a.deadline} submitted={a.submitted} countdownEnabled={a.countdownEnabled} />
              </div>
            ))}
        </div>
      </div>
      {jobs.filter(j=>j.archived).length > 0 && (
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <span style={{ fontSize: 13, color: C.textTert, cursor: "pointer" }} onClick={() => onNav("jobs")}>{jobs.filter(j=>j.archived).length} archived job{jobs.filter(j=>j.archived).length > 1 ? "s" : ""} →</span>
        </div>
      )}
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [selJobId, setSelJobId] = useState(null);
  const [showNewJob, setShowNewJob] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [showAddActor, setShowAddActor] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showSmartPaste, setShowSmartPaste] = useState(false);
  const [formActor, setFormActor] = useState(null);
  const [reminderActor, setReminderActor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [agentBook, setAgentBook] = useState([]);
  const [supabaseReady, setSupabaseReady] = useState(hasSupabaseEnv);

  useEffect(() => { S = makeS(darkMode ? CD : C); }, [darkMode]);
  useEffect(() => { 
    setSupabaseReady(hasSupabaseEnv);
    if (hasSupabaseEnv) fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching jobs:", error);
      return;
    }

    // Map database names back to frontend names
    const mappedJobs = data.map(j => ({
      id: j.id,
      title: j.title,
      client: j.client,
      category: j.category,
      shootDateStart: j.shoot_date_start,
      shootDateEnd: j.shoot_date_end,
      shootDate: j.shoot_date,
      isActra: j.union_type,
      usageTerms: j.usage_terms,
      archived: j.archived,
      createdAt: new Date(j.created_at).getTime(),
      actors: [] // Actors would ideally be in a separate table
    }));
    setJobs(mappedJobs);
  }

  const selJob = jobs.find(j => j.id === selJobId);

  const addJob = async (j) => {
    if (!hasSupabaseEnv) {
      setJobs(p => [...p, j]);
      return;
    }

    const dbJob = {
      title: j.title,
      client: j.client,
      category: j.category,
      shoot_date_start: j.shootDateStart,
      shoot_date_end: j.shootDateEnd || null,
      shoot_date: j.shootDate,
      union_type: j.isActra,
      usage_terms: j.usageTerms,
      archived: j.archived || false
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert([dbJob])
      .select();

    if (error) {
      alert("Error saving to Supabase: " + error.message);
    } else if (data) {
      const newJob = { ...j, id: data[0].id };
      setJobs(p => [...p, newJob]);
    }
  };

  const updateJob = async (j) => {
    if (!hasSupabaseEnv) {
      setJobs(p => p.map(x => x.id === j.id ? j : x));
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .update({
        title: j.title,
        client: j.client,
        category: j.category,
        shoot_date_start: j.shootDateStart,
        shoot_date_end: j.shootDateEnd || null,
        shoot_date: j.shootDate,
        union_type: j.isActra,
        usage_terms: j.usageTerms,
        archived: j.archived
      })
      .eq("id", j.id);

    if (error) {
      alert("Error updating Supabase: " + error.message);
    } else {
      setJobs(p => p.map(x => x.id === j.id ? j : x));
    }
  };

  const delJob = async (id) => {
    if (hasSupabaseEnv && typeof id === "string") {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) {
        alert("Error deleting from Supabase: " + error.message);
        return;
      }
    }
    setJobs(p => p.filter(j => j.id !== id));
    if (selJobId === id) { setSelJobId(null); setPage("jobs"); }
  };

  const archiveJob = async (id) => {
    if (hasSupabaseEnv && typeof id === "string") {
      await supabase.from("jobs").update({ archived: true }).eq("id", id);
    }
    setJobs(p => p.map(j => j.id === id ? { ...j, archived: true } : j));
  };

  const unarchiveJob = async (id) => {
    if (hasSupabaseEnv && typeof id === "string") {
      await supabase.from("jobs").update({ archived: false }).eq("id", id);
    }
    setJobs(p => p.map(j => j.id === id ? { ...j, archived: false } : j));
  };
  const duplicateJob = async (id, withActors = false) => {
    const j = jobs.find(x => x.id === id);
    if (!j) return;
    const now = Date.now();
    const newActors = withActors ? j.actors.map((a, i) => ({ ...a, id: now + i + 1, submitted: false, submissionData: null, sentAt: now, deadline: null, statusLog: [{ time: now, event: "Copied from duplicate job" }] })) : [];
    await addJob({ ...j, title: `${j.title} (Copy)`, createdAt: now, actors: newActors, archived: false });
  };
  const addActor = async (a) => {
    const updatedJobs = jobs.map(j => j.id === selJobId ? { ...j, actors: [...j.actors, a] } : j);
    setJobs(updatedJobs);
    
    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }

    if (a.agentName && a.agentEmail) {
      setAgentBook(prev => prev.find(x => x.agentEmail === a.agentEmail) ? prev : [...prev, { agentName: a.agentName, agentEmail: a.agentEmail, agentPhone: a.agentPhone || "", agencyName: "" }]);
    }
  };

  const addActors = async (actors) => {
    const updatedJobs = jobs.map(j => j.id === selJobId ? { ...j, actors: [...j.actors, ...actors] } : j);
    setJobs(updatedJobs);

    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }

    actors.forEach(a => {
      if (a.agentName && a.agentEmail) {
        setAgentBook(prev => prev.find(x => x.agentEmail === a.agentEmail) ? prev : [...prev, { agentName: a.agentName, agentEmail: a.agentEmail, agentPhone: "", agencyName: "" }]);
      }
    });
  };

  const delActor = async (id) => {
    const updatedJobs = jobs.map(j => j.id === selJobId ? { ...j, actors: j.actors.filter(a => a.id !== id) } : j);
    setJobs(updatedJobs);

    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }
  };

  const submitForm = async (actorId, data) => {
    const updatedJobs = jobs.map(j => ({ ...j, actors: j.actors.map(a => a.id === actorId ? { ...a, submitted: true, submissionData: data, statusLog: [...(a.statusLog||[]), { time: Date.now(), event: "Form submitted by agent" }] } : a) }));
    setJobs(updatedJobs);

    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }

    if (data.agentName && data.agentEmail) {
      setAgentBook(prev => {
        const exists = prev.find(x => x.agentEmail === data.agentEmail);
        if (exists) return prev.map(x => x.agentEmail === data.agentEmail ? { ...x, agentName: data.agentName, agentPhone: data.agentPhone || x.agentPhone, agencyName: data.agencyName || x.agencyName } : x);
        return [...prev, { agentName: data.agentName, agentEmail: data.agentEmail, agentPhone: data.agentPhone || "", agencyName: data.agencyName || "" }];
      });
    }
  };

  const markReminderSent = async (actorId) => {
    const updatedJobs = jobs.map(j => ({ ...j, actors: j.actors.map(a => a.id === actorId ? { ...a, statusLog: [...(a.statusLog||[]), { time: Date.now(), event: "Reminder sent to agent" }] } : a) }));
    setJobs(updatedJobs);

    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }
  };

  const sendAllRequests = async () => {
    const now = Date.now();
    const updatedJobs = jobs.map(j => j.id === selJobId ? { ...j, actors: j.actors.map(a => !a.submitted ? { ...a, sentAll: true, sentAt: now, deadline: a.countdownEnabled ? now + 86400000 : a.deadline, statusLog: [...(a.statusLog||[]), { time: now, event: "Booking request sent" }] } : a) } : j);
    setJobs(updatedJobs);

    if (hasSupabaseEnv && selJobId && typeof selJobId === "string") {
      const j = updatedJobs.find(x => x.id === selJobId);
      await supabase.from("jobs").update({ actors: j.actors }).eq("id", selJobId);
    }
  };

  function handleNav(t) {
    if (t === "newjob") { setPage("jobs"); setShowNewJob(true); }
    else { setPage(t); setSelJobId(null); }
  }

  const bg = darkMode ? CD.bg : C.bg;
  const sidebarBg = darkMode ? CD.sidebar : C.sidebar;
  const textCol = darkMode ? CD.text : C.text;

  return (
    <div style={{ ...S.app, background: bg, color: textCol }}>
      <div style={{ ...S.sidebar, background: sidebarBg }}>
        <div style={{ ...S.sidebarTop, borderBottom: `1px solid #2d2d2f` }}>
          <div style={{...S.logoLabel}}>Casting</div>
          <div style={{...S.logoTitle}}>BookingPro</div>
          <div style={{ ...S.logoSub, color: "#86868b" }}>Powerhouse Casting</div>
          <div style={{ marginTop: 12 }}>
            <span style={S.badge(supabaseReady ? C.green : C.orange)}>
              {supabaseReady ? "Supabase Connected" : "Supabase Not Configured"}
            </span>
          </div>
        </div>
        <div style={S.navSection}>
          <div style={S.navLabel}>Navigation</div>
          {[{id:"dashboard",label:"Dashboard",icon:"⊞"},{id:"jobs",label:"Jobs",icon:"🎬"},{id:"sheet",label:"Booking Sheet",icon:"📋"}].map(n => (
            <div key={n.id} style={S.nav(page === n.id)} onClick={() => handleNav(n.id)}>
              <span style={S.navIcon}>{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...S.main, background: bg }}>
        {page === "dashboard" && <Dashboard jobs={jobs} onNav={handleNav} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {page === "jobs" && !selJobId && <JobsList jobs={jobs} onSelect={id => setSelJobId(id)} onNewJob={() => setShowNewJob(true)} onDelete={delJob} onDuplicate={duplicateJob} onArchive={archiveJob} onUnarchive={unarchiveJob} />}
        {page === "jobs" && selJobId && selJob && <JobDetail job={selJob} onBack={() => setSelJobId(null)} onAddActor={() => setShowAddActor(true)} onBulkAdd={() => setShowBulkAdd(true)} onSmartPaste={() => setShowSmartPaste(true)} onOpenForm={a => setFormActor(a)} onDeleteActor={delActor} onReminder={a => setReminderActor(a)} onEdit={() => setEditJob(selJob)} onSendAll={sendAllRequests} />}
        {page === "sheet" && <BookingSheet jobs={jobs} darkMode={darkMode} />}
      </div>

      {showNewJob && <JobModal onClose={() => setShowNewJob(false)} onSave={j => { addJob(j); setShowNewJob(false); }} templates={templates} onSaveTemplate={t => setTemplates(p => [...p, t])} />}
      {editJob && <JobModal existing={editJob} onClose={() => setEditJob(null)} onSave={j => { updateJob(j); setEditJob(null); }} templates={templates} onSaveTemplate={t => setTemplates(p => [...p, t])} />}
      {showAddActor && <AddActorModal onClose={() => setShowAddActor(false)} onSave={a => { addActor(a); setShowAddActor(false); }} agentBook={agentBook} />}
      {showBulkAdd && <BulkAddModal onClose={() => setShowBulkAdd(false)} onSave={actors => { addActors(actors); setShowBulkAdd(false); }} />}
      {showSmartPaste && <SmartPasteModal onClose={() => setShowSmartPaste(false)} onSave={actors => { addActors(actors); setShowSmartPaste(false); }} />}
      {formActor && selJob && <AgentForm actor={formActor} job={selJob} onClose={() => setFormActor(null)} onSubmit={(id, data) => { submitForm(id, data); setFormActor(null); }} />}
      {reminderActor && selJob && <ReminderModal actor={reminderActor} job={selJob} onClose={() => setReminderActor(null)} onSend={markReminderSent} />}
    </div>
  );
}
