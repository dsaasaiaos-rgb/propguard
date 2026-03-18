const materials = [
  { category: "Plumbing", name: "Faucet Cartridge", spec: "Match to faucet brand/model", cost: "$10–$50", url: "https://www.google.com/search?tbm=shop&q=faucet+cartridge+replacement" },
  { category: "Plumbing", name: "Braided Supply Line", spec: '3/8" compression, 12"–20"', cost: "$5–$15", url: "https://www.google.com/search?tbm=shop&q=3%2F8+braided+supply+line" },
  { category: "Plumbing", name: "PVC P-Trap", spec: '1-1/4" or 1-1/2" diameter', cost: "$5–$12", url: "https://www.google.com/search?tbm=shop&q=PVC+P-trap+1.5+inch" },
  { category: "Plumbing", name: "Wax Ring", spec: "Universal toilet wax ring with horn", cost: "$5–$15", url: "https://www.google.com/search?tbm=shop&q=universal+toilet+wax+ring" },
  { category: "Plumbing", name: "Toilet Flapper", spec: '2" universal', cost: "$5–$10", url: "https://www.google.com/search?tbm=shop&q=universal+toilet+flapper+replacement" },
  { category: "Plumbing", name: "SharkBite Fitting", spec: '1/2" or 3/4" push-to-connect', cost: "$8–$20", url: "https://www.google.com/search?tbm=shop&q=SharkBite+push+to+connect+fitting" },
  { category: "Plumbing", name: "Anode Rod", spec: "Magnesium or aluminum, match water heater", cost: "$20–$50", url: "https://www.google.com/search?tbm=shop&q=water+heater+anode+rod+replacement" },
  { category: "Electrical", name: "GFCI Outlet", spec: "15A or 20A tamper-resistant", cost: "$15–$30", url: "https://www.google.com/search?tbm=shop&q=GFCI+outlet+tamper+resistant+20A" },
  { category: "Electrical", name: "Circuit Breaker", spec: "Match panel brand (e.g. Square D, Eaton)", cost: "$10–$40", url: "https://www.google.com/search?tbm=shop&q=circuit+breaker+replacement+20A" },
  { category: "Electrical", name: "Romex Wire", spec: "12/2 or 14/2 NM-B cable", cost: "$0.50–$1/ft", url: "https://www.google.com/search?tbm=shop&q=Romex+12%2F2+NM-B+wire" },
  { category: "HVAC", name: "Air Filter", spec: "16x25x1 or 16x25x4 (check unit)", cost: "$5–$30", url: "https://www.google.com/search?tbm=shop&q=16x25x1+HVAC+air+filter+MERV+11" },
  { category: "HVAC", name: "Thermostat", spec: "24V programmable/smart", cost: "$25–$200", url: "https://www.google.com/search?tbm=shop&q=24V+programmable+thermostat" },
  { category: "HVAC", name: "Capacitor", spec: "Match µF and VAC rating on old capacitor", cost: "$10–$40", url: "https://www.google.com/search?tbm=shop&q=AC+unit+run+capacitor+replacement" },
  { category: "Roofing", name: "Asphalt Shingles", spec: "Sold per square (100 sq ft); 20–30 squares/home", cost: "$30–$80/sq", url: "https://www.google.com/search?tbm=shop&q=asphalt+shingles+architectural+per+square" },
  { category: "Roofing", name: "Roof Cement", spec: "Asphalt-based, all-weather", cost: "$10–$20", url: "https://www.google.com/search?tbm=shop&q=roof+cement+asphalt+all+weather" },
  { category: "Structural", name: "Drywall Sheet", spec: '1/2" for walls, 5/8" for ceilings, 4x8 ft', cost: "$12–$20/sheet", url: "https://www.google.com/search?tbm=shop&q=drywall+sheet+1%2F2+inch+4x8" },
  { category: "Structural", name: "Wood Epoxy Filler", spec: "2-part epoxy for rotted wood repair", cost: "$15–$40", url: "https://www.google.com/search?tbm=shop&q=wood+epoxy+filler+rot+repair" },
  { category: "Pest", name: "Termite Bait Stations", spec: "In-ground perimeter stations", cost: "$20–$60/set", url: "https://www.google.com/search?tbm=shop&q=termite+bait+stations+in-ground" },
  { category: "Pest", name: "Expanding Foam", spec: "Pest-block or fire-rated foam sealant", cost: "$8–$15", url: "https://www.google.com/search?tbm=shop&q=pest+block+expanding+foam+sealant" },
];

export default function MaterialsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pl-3 border-l-4" style={{ color: "#1a365d", borderColor: "#2b6cb0" }}>
        🔧 Common Replacement Materials
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="w-full text-sm bg-white" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2b6cb0", color: "white" }}>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Material</th>
              <th className="text-left px-4 py-3">Spec / Notes</th>
              <th className="text-left px-4 py-3">Est. Cost</th>
              <th className="text-left px-4 py-3">Shop</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3 text-slate-600">{m.category}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{m.name}</td>
                <td className="px-4 py-3 text-slate-500">{m.spec}</td>
                <td className="px-4 py-3 text-slate-600">{m.cost}</td>
                <td className="px-4 py-3">
                  <a href={m.url} target="_blank" rel="noreferrer" className="underline text-xs" style={{ color: "#2b6cb0" }}>🛒 Search</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}