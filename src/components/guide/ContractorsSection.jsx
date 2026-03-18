import { useState } from "react";

const rates = [
  { icon: "🚰", label: "Plumber", value: "$175–$450/hr" },
  { icon: "⚡", label: "Electrician", value: "$50–$130/hr" },
  { icon: "🌡️", label: "HVAC Tech", value: "$75–$150/hr" },
  { icon: "🏠", label: "Roofer", value: "$150–$300/hr" },
  { icon: "🔨", label: "General Contractor", value: "Project-based" },
];

const projectCosts = [
  ["Roof Replacement", "$5,000–$15,000"],
  ["HVAC Replacement", "$4,000–$10,000"],
  ["Water Heater (Gas, 40–60 gal)", "$800–$2,000 installed"],
  ["Electrical Panel Upgrade", "$3,000–$5,000"],
  ["Foundation Repair", "$5,000–$25,000+"],
];

const hiringChecklist = [
  "Verify state contractor license",
  "Confirm minimum $1 million general liability insurance",
  "Confirm workers' compensation coverage",
  "Request at least 3 references and check them",
  "Get a written, itemized estimate",
  "Never pay more than 30% upfront",
];

const directories = [
  { name: "Angi", url: "https://www.angi.com", desc: "Vetted local pros with reviews" },
  { name: "HomeAdvisor", url: "https://www.homeadvisor.com", desc: "Cost estimates & matching" },
  { name: "Thumbtack", url: "https://www.thumbtack.com", desc: "Get quotes from local pros" },
  { name: "Yelp", url: "https://www.yelp.com", desc: "Community reviews & ratings" },
];

export default function ContractorsSection() {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        👷 Contractor Guide
      </h2>

      {/* Rate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {rates.map((r) => (
          <div key={r.label} className="bg-white rounded-xl p-4 text-center shadow-sm border-b-4" style={{ borderColor: "#2b6cb0" }}>
            <div className="text-3xl mb-2">{r.icon}</div>
            <div className="text-xs text-slate-400 mb-1">{r.label}</div>
            <div className="text-sm font-bold" style={{ color: "#1a365d" }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Project Costs */}
      <h3 className="text-base font-semibold mb-3" style={{ color: "#2c5282" }}>Typical Project Costs</h3>
      <div className="overflow-x-auto rounded-xl shadow-sm mb-6">
        <table className="w-full text-sm bg-white" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2b6cb0", color: "white" }}>
              <th className="text-left px-4 py-3">Project</th>
              <th className="text-left px-4 py-3">Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            {projectCosts.map(([project, cost]) => (
              <tr key={project} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3 text-slate-700">{project}</td>
                <td className="px-4 py-3 text-slate-600">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hiring Checklist */}
      <h3 className="text-base font-semibold mb-3" style={{ color: "#2c5282" }}>Before Hiring — Verification Checklist</h3>
      <div className="flex flex-col gap-2 mb-6">
        {hiringChecklist.map((item, i) => (
          <label key={i} className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 shadow-sm cursor-pointer select-none">
            <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} className="mt-0.5 flex-shrink-0 w-4 h-4 accent-blue-600" />
            <span className={`text-sm leading-relaxed ${checked[i] ? "line-through text-slate-400" : "text-slate-700"}`}>{item}</span>
          </label>
        ))}
      </div>

      {/* Directories */}
      <h3 className="text-base font-semibold mb-3" style={{ color: "#2c5282" }}>Find Contractors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {directories.map((d) => (
          <div key={d.name} className="bg-white rounded-xl p-4 shadow-sm border-t-4" style={{ borderColor: "#2b6cb0" }}>
            <h4 className="font-semibold text-sm mb-1" style={{ color: "#2c5282" }}>{d.name}</h4>
            <p className="text-sm text-slate-500">
              <a href={d.url} target="_blank" rel="noreferrer" className="underline" style={{ color: "#2b6cb0" }}>{d.url.replace("https://www.", "")}</a>
              {" "}— {d.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}