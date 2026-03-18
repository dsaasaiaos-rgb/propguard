import { useState } from "react";
import SystemsSection from "@/components/guide/SystemsSection";
import HazardsSection from "@/components/guide/HazardsSection";
import ChecklistsSection from "@/components/guide/ChecklistsSection";
import DiagnosisSection from "@/components/guide/DiagnosisSection";
import MaterialsSection from "@/components/guide/MaterialsSection";
import ContractorsSection from "@/components/guide/ContractorsSection";
import MultiUnitSection from "@/components/guide/MultiUnitSection";

const NAV_ITEMS = [
  { id: "systems", label: "🏗️ Systems" },
  { id: "hazards", label: "⚠️ Hazards" },
  { id: "checklists", label: "✅ Checklists" },
  { id: "diagnosis", label: "🤖 AI Diagnosis" },
  { id: "materials", label: "🔧 Materials" },
  { id: "contractors", label: "👷 Contractors" },
  { id: "multiunit", label: "🏢 Multi-Unit" },
];

export default function MainApp() {
  const [activeSection, setActiveSection] = useState("systems");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-700">
      {/* Header */}
      <header
        className="text-white text-center py-8 px-6"
        style={{ background: "linear-gradient(135deg, #1a365d, #2b6cb0)" }}
      >
        <h1 className="text-3xl font-bold mb-2">🏠 Residential Property Maintenance Guide</h1>
        <p className="text-white/85 text-base">
          Your complete reference for home systems, maintenance schedules, hazard awareness, and contractor guidance
        </p>
      </header>

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex flex-wrap justify-center gap-2 px-4 py-3 shadow-md"
        style={{ background: "#2b6cb0" }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={
              activeSection === item.id
                ? { background: "white", color: "#2b6cb0", fontWeight: 700, borderColor: "white" }
                : { background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)" }
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeSection === "systems" && <SystemsSection />}
        {activeSection === "hazards" && <HazardsSection />}
        {activeSection === "checklists" && <ChecklistsSection />}
        {activeSection === "diagnosis" && <DiagnosisSection />}
        {activeSection === "materials" && <MaterialsSection />}
        {activeSection === "contractors" && <ContractorsSection />}
        {activeSection === "multiunit" && <MultiUnitSection />}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs mt-8">
        Residential Property Maintenance Guide · Based on ASHI standards and industry best practices · Always consult licensed professionals for safety-critical work
      </footer>
    </div>
  );
}