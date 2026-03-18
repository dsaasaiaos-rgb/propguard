const SectionTitle = ({ children, mt }) => (
  <h2
    className="text-2xl font-bold mb-4 pl-3 border-l-4"
    style={{ color: "#1a365d", borderColor: "#2b6cb0", marginTop: mt ? 24 : 0 }}
  >
    {children}
  </h2>
);

const Card = ({ title, children, borderColor }) => (
  <div
    className="bg-white rounded-xl p-5 shadow-sm"
    style={{ borderTop: `4px solid ${borderColor || "#2b6cb0"}` }}
  >
    <h3 className="text-base font-semibold mb-2" style={{ color: "#2c5282" }}>{title}</h3>
    {children}
  </div>
);

const systems = [
  { title: "🏛️ Structural", items: ["Foundation: Slab, crawlspace, or basement", "Framing: Wood, steel, or post-and-beam", "Load-bearing walls support upper floors & roof", "Lifespan: 50+ years with maintenance"] },
  { title: "🏠 Roof & Exterior", items: ["Asphalt shingles: 15–20 years", "Wood shakes: 20–40 years", "Metal roofing: 40–70 years", "Tile: 50+ years", "Siding: Vinyl, wood, fiber cement, brick, stone"] },
  { title: "🚰 Plumbing", items: ["Supply lines (pressurized potable water)", "DWV system (drain-waste-vent)", "Copper: 50+ yrs (pinhole leak risk)", "PVC: Modern standard (cold water only)", "PEX: Flexible, newer technology", "Galvanized steel: 15–50 yrs (corrosion prone)"] },
  { title: "⚡ Electrical", items: ["Service panel: 100–200 amps typical", "Circuit breakers with grounding protection", "GFCI outlets in wet areas required", "Romex wiring (12/2 or 14/2)"] },
  { title: "🌡️ HVAC", items: ["Furnace/Boiler: 15–20 years", "Air conditioning: 10–15 years", "Ductwork, vents, and thermostats", "Filters: Change every 1–3 months"] },
  { title: "🌧️ Water Management", items: ["Gutters & downspouts direct water away", "Flashing prevents roof intrusion", "Sump pumps for basement moisture", "Grading slopes away from foundation"] },
];

const issues = [
  { title: "💧 Water Damage", text: "Roof, foundation, or plumbing leaks leading to mold, structural decay, and electrical hazards.", color: "#e53e3e" },
  { title: "🏚️ Structural Issues", text: "Foundation settlement, sagging floors from failing joists, rotting wood from moisture or pests.", color: "#dd6b20" },
  { title: "🐛 Pest Damage", text: "Termites & carpenter ants destroy wood; rodents chew wires and ruin insulation.", color: "#d69e2e" },
  { title: "❄️ HVAC Problems", text: "Lack of heat, poor airflow from dirty filters or blocked ducts, high energy bills from inefficiency.", color: "#38a169" },
];

export default function SystemsSection() {
  return (
    <div>
      <SectionTitle>Home Systems Overview</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {systems.map((s) => (
          <Card key={s.title} title={s.title}>
            <ul className="list-disc pl-5 text-sm leading-7 text-slate-600">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
        ))}
      </div>

      <SectionTitle mt>Common Issues</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {issues.map((i) => (
          <Card key={i.title} title={i.title} borderColor={i.color}>
            <p className="text-sm leading-relaxed text-slate-600">{i.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}