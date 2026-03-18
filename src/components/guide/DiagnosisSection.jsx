import { useState } from "react";

const issueDB = {
  Plumbing: {
    keywords: {
      "leak|drip|burst|pipe": { urgency: "emergency", urgencyLabel: "EMERGENCY", type: "pro", typeLabel: "Professional Required", action: "Shut off water supply immediately. Call a licensed plumber.", materials: [{ name: "SharkBite Repair Fitting", spec: '1/2" push-to-connect', url: "https://www.google.com/search?tbm=shop&q=SharkBite+1%2F2+inch+repair+fitting" }, { name: "Pipe Repair Clamp", spec: "Match pipe diameter", url: "https://www.google.com/search?tbm=shop&q=pipe+repair+clamp+1%2F2+inch" }] },
      "slow drain|clog": { urgency: "medium", urgencyLabel: "MEDIUM", type: "diy", typeLabel: "DIY Possible", action: "Try a drain snake or enzymatic cleaner. Check P-trap for blockage.", materials: [{ name: "PVC P-Trap", spec: '1-1/2" standard', url: "https://www.google.com/search?tbm=shop&q=PVC+P-trap+1.5+inch" }, { name: "Drain Snake", spec: "25 ft hand auger", url: "https://www.google.com/search?tbm=shop&q=25+ft+drain+snake+hand+auger" }] },
      "faucet|dripping": { urgency: "low", urgencyLabel: "LOW", type: "diy", typeLabel: "DIY Possible", action: "Replace faucet cartridge or washers. Turn off supply valve first.", materials: [{ name: "Faucet Cartridge", spec: "Match brand/model", url: "https://www.google.com/search?tbm=shop&q=faucet+cartridge+replacement" }, { name: "Supply Line", spec: '3/8" braided stainless', url: "https://www.google.com/search?tbm=shop&q=3%2F8+braided+supply+line" }] },
      "toilet|flush": { urgency: "medium", urgencyLabel: "MEDIUM", type: "diy", typeLabel: "DIY Possible", action: "Inspect flapper, fill valve, and supply line. Most toilet internals are DIY-replaceable.", materials: [{ name: "Universal Toilet Flapper", spec: '2" standard', url: "https://www.google.com/search?tbm=shop&q=universal+toilet+flapper+2+inch" }, { name: "Wax Ring", spec: "Universal with horn", url: "https://www.google.com/search?tbm=shop&q=universal+toilet+wax+ring" }] },
    },
    default: { urgency: "medium", urgencyLabel: "MEDIUM", type: "pro", typeLabel: "Professional Recommended", action: "Describe the issue to a licensed plumber for proper diagnosis.", materials: [{ name: "SharkBite Fitting", spec: '1/2" push-to-connect', url: "https://www.google.com/search?tbm=shop&q=SharkBite+push+to+connect+fitting" }] },
  },
  Electrical: {
    keywords: {
      "spark|shock|smoke|burning": { urgency: "emergency", urgencyLabel: "EMERGENCY", type: "pro", typeLabel: "Professional Required", action: "Turn off power at the breaker immediately. Do NOT attempt DIY. Call a licensed electrician.", materials: [] },
      "outlet|gfci|trip": { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Recommended", action: "Reset GFCI outlet. If tripping persists, call an electrician.", materials: [{ name: "GFCI Outlet", spec: "20A tamper-resistant", url: "https://www.google.com/search?tbm=shop&q=GFCI+outlet+20A+tamper+resistant" }] },
      "light|switch|flicker": { urgency: "medium", urgencyLabel: "MEDIUM", type: "diy", typeLabel: "DIY Possible (with caution)", action: "Turn off breaker before replacing. Check wire connections for looseness.", materials: [{ name: "Light Switch", spec: "15A single-pole", url: "https://www.google.com/search?tbm=shop&q=15A+single+pole+light+switch" }] },
    },
    default: { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Electrical issues should be evaluated by a licensed electrician.", materials: [] },
  },
  HVAC: {
    keywords: {
      "no heat|no heating": { urgency: "emergency", urgencyLabel: "EMERGENCY (Winter)", type: "pro", typeLabel: "Professional Required", action: "Check thermostat settings and filter first. If no resolution, call HVAC technician immediately.", materials: [{ name: "Air Filter", spec: "16x25x1 MERV 8+", url: "https://www.google.com/search?tbm=shop&q=16x25x1+air+filter+MERV+8" }, { name: "Thermostat", spec: "24V programmable", url: "https://www.google.com/search?tbm=shop&q=24V+programmable+thermostat" }] },
      "no ac|no cooling|no air": { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Check filter and thermostat. AC capacitor or refrigerant may need service.", materials: [{ name: "AC Capacitor", spec: "Match µF/VAC on unit", url: "https://www.google.com/search?tbm=shop&q=AC+run+capacitor+replacement" }, { name: "Air Filter", spec: "16x25x1 MERV 8+", url: "https://www.google.com/search?tbm=shop&q=16x25x1+air+filter+MERV+8" }] },
      "filter|airflow|dirty": { urgency: "low", urgencyLabel: "LOW", type: "diy", typeLabel: "DIY — Easy", action: "Replace air filter. Check filter size printed on current filter frame.", materials: [{ name: "Air Filter", spec: "16x25x1 or 20x25x1", url: "https://www.google.com/search?tbm=shop&q=HVAC+air+filter+16x25x1+MERV+11" }] },
    },
    default: { urgency: "medium", urgencyLabel: "MEDIUM", type: "pro", typeLabel: "Professional Recommended", action: "Schedule an HVAC technician for diagnosis and service.", materials: [{ name: "Air Filter", spec: "Match unit size", url: "https://www.google.com/search?tbm=shop&q=HVAC+air+filter+replacement" }] },
  },
  Roofing: {
    keywords: {
      "leak|water|intrusion": { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Place buckets to contain water. Apply roof cement as temporary fix. Call a roofer.", materials: [{ name: "Roof Cement", spec: "All-weather asphalt", url: "https://www.google.com/search?tbm=shop&q=roof+cement+all+weather+asphalt" }, { name: "Asphalt Shingles", spec: "3-tab or architectural", url: "https://www.google.com/search?tbm=shop&q=asphalt+shingles+architectural+per+bundle" }] },
      "shingle|missing|damage": { urgency: "medium", urgencyLabel: "MEDIUM", type: "pro", typeLabel: "Professional Recommended", action: "Document damage with photos. Schedule a roofer for assessment and repair.", materials: [{ name: "Asphalt Shingles", spec: "Match existing color/style", url: "https://www.google.com/search?tbm=shop&q=asphalt+shingles+architectural+replacement" }, { name: "Roofing Nails", spec: '1-3/4" galvanized', url: "https://www.google.com/search?tbm=shop&q=roofing+nails+galvanized+1.75+inch" }] },
    },
    default: { urgency: "medium", urgencyLabel: "MEDIUM", type: "pro", typeLabel: "Professional Required", action: "Roof work is dangerous and should be handled by a licensed roofer.", materials: [{ name: "Roof Cement", spec: "All-weather", url: "https://www.google.com/search?tbm=shop&q=roof+cement+all+weather" }] },
  },
  Structural: {
    keywords: {
      "crack|foundation|settle": { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Monitor crack size with tape markers. Call a structural engineer or foundation specialist.", materials: [] },
      "rot|wood|soft": { urgency: "medium", urgencyLabel: "MEDIUM", type: "diy", typeLabel: "DIY for minor; Pro for structural", action: "For cosmetic wood rot, use epoxy filler. For structural members, call a contractor.", materials: [{ name: "Wood Epoxy Filler", spec: "2-part repair kit", url: "https://www.google.com/search?tbm=shop&q=wood+epoxy+filler+rot+repair+kit" }] },
      "drywall|hole|patch": { urgency: "low", urgencyLabel: "LOW", type: "diy", typeLabel: "DIY — Easy", action: "Use drywall patch kit for small holes. Cut and replace panel for large damage.", materials: [{ name: "Drywall Sheet", spec: '1/2" 4x8 ft', url: "https://www.google.com/search?tbm=shop&q=drywall+sheet+1%2F2+inch+4x8" }, { name: "Joint Compound", spec: "All-purpose", url: "https://www.google.com/search?tbm=shop&q=all+purpose+joint+compound+drywall" }] },
    },
    default: { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Structural issues require evaluation by a licensed contractor or structural engineer.", materials: [] },
  },
  Pest: {
    keywords: {
      "termite|ant|carpenter": { urgency: "high", urgencyLabel: "HIGH", type: "pro", typeLabel: "Professional Required", action: "Call a licensed pest control company. Termite damage requires professional treatment and may need structural repair.", materials: [{ name: "Termite Bait Stations", spec: "In-ground perimeter", url: "https://www.google.com/search?tbm=shop&q=termite+bait+stations+in-ground" }] },
      "rodent|mouse|rat": { urgency: "medium", urgencyLabel: "MEDIUM", type: "diy", typeLabel: "DIY Possible", action: "Seal entry points with copper mesh and expanding foam. Set traps. Call exterminator for large infestations.", materials: [{ name: "Rodent Traps", spec: "Snap or live traps", url: "https://www.google.com/search?tbm=shop&q=rodent+snap+traps" }, { name: "Copper Mesh", spec: '20 gauge, 5" wide', url: "https://www.google.com/search?tbm=shop&q=copper+mesh+pest+control+seal" }, { name: "Expanding Foam", spec: "Pest-block formula", url: "https://www.google.com/search?tbm=shop&q=pest+block+expanding+foam" }] },
    },
    default: { urgency: "medium", urgencyLabel: "MEDIUM", type: "pro", typeLabel: "Professional Recommended", action: "Contact a licensed pest control company for inspection and treatment plan.", materials: [] },
  },
  Other: {
    keywords: {},
    default: { urgency: "low", urgencyLabel: "LOW", type: "diy", typeLabel: "Assess Individually", action: "Document the issue with photos. Consult a professional if unsure of severity.", materials: [] },
  },
};

const urgencyColors = { emergency: "#c53030", high: "#c05621", medium: "#975a16", low: "#276749" };

function diagnose(category, desc) {
  const catData = issueDB[category];
  for (const [pattern, data] of Object.entries(catData.keywords || {})) {
    if (new RegExp(pattern, "i").test(desc)) return data;
  }
  return catData.default;
}

export default function DiagnosisSection() {
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [homeAge, setHomeAge] = useState("new");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDiagnose = () => {
    if (!category) { setError("Please select an issue category."); return; }
    setError("");
    setResult(diagnose(category, desc.toLowerCase()));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        🤖 AI Issue Diagnosis Tool
      </h2>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-sm" style={{ color: "#2c5282" }}>Issue Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50">
            <option value="">-- Select Category --</option>
            <option value="Plumbing">🚰 Plumbing</option>
            <option value="Electrical">⚡ Electrical</option>
            <option value="HVAC">🌡️ HVAC</option>
            <option value="Roofing">🏠 Roofing</option>
            <option value="Structural">🏛️ Structural</option>
            <option value="Pest">🐛 Pest</option>
            <option value="Other">🔧 Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-sm" style={{ color: "#2c5282" }}>Describe the Issue</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="e.g. Slow draining bathroom sink, dripping faucet, no heat..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 resize-none" />
        </div>
        <div className="mb-5">
          <label className="block font-semibold mb-1 text-sm" style={{ color: "#2c5282" }}>Home Age (approximate)</label>
          <select value={homeAge} onChange={(e) => setHomeAge(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50">
            <option value="new">Built after 2000</option>
            <option value="mid">1980–2000</option>
            <option value="old">1960–1979</option>
            <option value="vintage">Before 1960</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={handleDiagnose} className="px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors" style={{ background: "#2b6cb0" }}>
          🔍 Diagnose Issue
        </button>

        {result && (
          <div className="mt-6 rounded-xl p-5 border" style={{ background: "#ebf8ff", borderColor: "#bee3f8" }}>
            <h3 className="font-bold mb-3" style={{ color: "#2b6cb0" }}>🔍 Diagnosis Result</h3>
            <div className="text-sm mb-2"><strong>Category:</strong> {category}</div>
            <div className="text-sm mb-2 flex items-center gap-2 flex-wrap">
              <strong>Urgency:</strong>
              <span className="px-3 py-0.5 rounded-full text-white text-xs font-bold" style={{ background: urgencyColors[result.urgency] }}>{result.urgencyLabel}</span>
            </div>
            <div className="text-sm mb-3 flex items-center gap-2 flex-wrap">
              <strong>Resolution:</strong>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold" style={result.type === "pro" ? { background: "#e9d8fd", color: "#553c9a" } : { background: "#bee3f8", color: "#2c5282" }}>{result.typeLabel}</span>
            </div>
            <div className="text-sm mb-4">
              <strong>📋 Recommended Action:</strong>
              <p className="text-slate-500 mt-1">{result.action}</p>
            </div>
            {result.materials.length > 0 ? (
              <div className="text-sm">
                <strong>🔧 Suggested Materials:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {result.materials.map((m) => (
                    <li key={m.name}>
                      {m.name} <em>({m.spec})</em> —{" "}
                      <a href={m.url} target="_blank" rel="noreferrer" className="underline" style={{ color: "#2b6cb0" }}>🛒 Shop on Google</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-sm"><strong>🔧 Materials:</strong> No specific materials needed — professional assessment required first.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}