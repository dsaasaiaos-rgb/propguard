import { useState } from "react";

const CHECKLISTS = {
  Monthly: [
    "Check under-sink areas for leaks",
    "Inspect all visible pipes for moisture or corrosion",
    "Test smoke detectors (press test button)",
    "Test carbon monoxide detectors",
  ],
  Quarterly: [
    "Change HVAC air filters (16x25x1 or per unit spec)",
    "Clean gutters and downspouts",
    "Inspect roof from ground level for missing shingles",
    "Check shower and tub caulking for gaps or mold",
  ],
  Annual: [
    "Schedule professional HVAC inspection and tune-up",
    "Schedule professional roof inspection",
    "Schedule foundation inspection",
    "Schedule plumbing inspection",
    "Schedule pest control inspection",
  ],
  "🌸 Spring": [
    "Clean gutters after winter debris",
    "Check roof for winter damage (ice dam cracks, missing shingles)",
    "Test outdoor GFCI outlets",
    "Power wash decks and inspect for rot",
    "Inspect and service AC unit before summer",
  ],
  "☀️ Summer": [
    "Monitor basement for moisture and humidity",
    "Check for increased pest activity",
    "Test sump pump operation",
    "Inspect decks and wood structures for rot",
    "Check window and door caulking for gaps",
  ],
  "🍂 Fall": [
    "Clear gutters of fallen leaves",
    "Trim overhanging tree branches near roof",
    "Have furnace inspected and serviced",
    "Check and replace weatherstripping on doors/windows",
    "Drain and disconnect exterior hoses",
  ],
  "❄️ Winter": [
    "Monitor unheated pipes for freezing risk",
    "Check for ice dams forming on roof edges",
    "Monitor basement for water intrusion after thaws",
    "Keep furnace/dryer vents clear of snow blockage",
  ],
};

export default function ChecklistsSection() {
  const tabs = Object.keys(CHECKLISTS);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [checked, setChecked] = useState({});

  const toggleCheck = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        ✅ Maintenance Checklists
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
            style={
              activeTab === tab
                ? { background: "#2b6cb0", color: "white", borderColor: "#2b6cb0" }
                : { background: "white", color: "#2b6cb0", borderColor: "#2b6cb0" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {CHECKLISTS[activeTab].map((item, idx) => {
          const key = `${activeTab}-${idx}`;
          const isChecked = !!checked[key];
          return (
            <label
              key={key}
              className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 shadow-sm cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleCheck(key)}
                className="mt-0.5 flex-shrink-0 w-4 h-4 accent-blue-600"
              />
              <span className={`text-sm leading-relaxed ${isChecked ? "line-through text-slate-400" : "text-slate-700"}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}