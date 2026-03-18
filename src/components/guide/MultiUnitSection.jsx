const cards = [
  {
    title: "🏢 Apartments & Condos",
    items: [
      "Shared systems (plumbing, electrical risers)",
      "Noise transmission between units",
      "HOA responsible for: elevator, shared roof, common areas",
      "Owner responsible for: interior unit systems",
    ],
  },
  {
    title: "🏘️ Townhomes",
    items: [
      "Individual responsibility for own roof & foundation",
      "Shared party walls with neighbors",
      "HOA approval often required for exterior work",
      "Shared landscaping and common areas",
    ],
  },
  {
    title: "📋 ASHI Inspection Standards",
    items: [
      "Structural framing & exteriors",
      "Basements & crawlspaces",
      "Electrical panels & plumbing fixtures",
      "HVAC distribution & appliances",
      "Interior walls, insulation, safety detectors",
    ],
  },
  {
    title: "📁 Documentation to Keep",
    items: [
      "Appliance warranties & manuals",
      "Maintenance receipts & service histories",
      "Inspection reports",
      "Permit records",
      "Contractor contacts",
      "Condition photos from purchase date",
    ],
  },
];

export default function MultiUnitSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        🏢 Multi-Unit & Documentation
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="bg-white rounded-xl p-5 shadow-sm border-t-4" style={{ borderColor: "#2b6cb0" }}>
            <h3 className="text-base font-semibold mb-3" style={{ color: "#2c5282" }}>{c.title}</h3>
            <ul className="list-disc pl-5 text-sm leading-7 text-slate-600">
              {c.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}