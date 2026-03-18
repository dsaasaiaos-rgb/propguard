const hazards = [
  { icon: "🧱", title: "Asbestos", text: "Found in pre-1980 insulation and flooring. Inhalation causes serious lung disease. Requires licensed abatement contractor." },
  { icon: "🎨", title: "Lead Paint", text: "Present in pre-1978 homes. Dangerous especially to children. Requires EPA-certified RRP contractor for disturbance." },
  { icon: "☢️", title: "Radon Gas", text: "Colorless, odorless gas seeping from soil. Leading cause of lung cancer in non-smokers. Test with kit; mitigate with sub-slab depressurization." },
  { icon: "🦠", title: "Toxic Black Mold", text: "Stachybotrys chartarum grows in water-damaged areas. Causes respiratory issues. Requires professional remediation for large areas (>10 sq ft)." },
  { icon: "💨", title: "Carbon Monoxide", text: "Emitted from gas appliances, furnaces, and attached garages. Install CO detectors on every level. Requires immediate evacuation if detected." },
];

export default function HazardsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        ⚠️ Safety Hazards (Older Homes)
      </h2>
      <p className="text-sm text-slate-400 mb-5">These hazards require professional remediation. Do not attempt DIY removal.</p>
      <div className="flex flex-col gap-3">
        {hazards.map((h) => (
          <div key={h.title} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderColor: "#e53e3e" }}>
            <span className="text-2xl flex-shrink-0">{h.icon}</span>
            <div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "#c53030" }}>{h.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{h.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}