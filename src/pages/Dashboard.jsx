import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Home, Users, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: houses = [] } = useQuery({ queryKey: ["houses"], queryFn: () => base44.entities.House.list() });
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: () => base44.entities.Tenant.list() });
  const { data: documents = [] } = useQuery({ queryKey: ["documents"], queryFn: () => base44.entities.Document.list() });

  const occupied = houses.filter(h => h.status === "occupied").length;
  const available = houses.filter(h => h.status === "available").length;
  const activeTenants = tenants.filter(t => t.status === "active").length;

  const stats = [
    { label: "Total Houses", value: houses.length, sub: `${available} available`, icon: Home, color: "bg-blue-50 text-blue-600", link: "/houses" },
    { label: "Occupied", value: occupied, sub: "houses rented", icon: Home, color: "bg-green-50 text-green-600", link: "/houses" },
    { label: "Active Tenants", value: activeTenants, sub: `of ${tenants.length} total`, icon: Users, color: "bg-purple-50 text-purple-600", link: "/tenants" },
    { label: "Documents", value: documents.length, sub: "on file", icon: FileText, color: "bg-orange-50 text-orange-600", link: "/documents" },
  ];

  // Expiring leases in next 30 days
  const today = new Date();
  const in30 = new Date(); in30.setDate(today.getDate() + 30);
  const expiring = tenants.filter(t => {
    if (!t.lease_end) return false;
    const d = new Date(t.lease_end);
    return d >= today && d <= in30;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#1a365d" }}>📊 Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link to={s.link} key={s.label} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm font-medium text-slate-600">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      {expiring.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3 font-semibold text-orange-700">
            <AlertCircle className="w-4 h-4" /> Leases Expiring in 30 Days
          </div>
          <div className="flex flex-col gap-2">
            {expiring.map(t => (
              <div key={t.id} className="flex justify-between text-sm bg-white rounded-lg px-4 py-2">
                <span className="text-slate-700 font-medium">{t.name}</span>
                <span className="text-orange-600">{t.lease_end}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-3">Recent Houses</h3>
          {houses.slice(0, 4).map(h => (
            <div key={h.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
              <span className="text-slate-700">{h.address}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.status === "occupied" ? "bg-green-100 text-green-700" : h.status === "available" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{h.status}</span>
            </div>
          ))}
          {houses.length === 0 && <p className="text-slate-400 text-sm">No houses yet.</p>}
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-3">Recent Tenants</h3>
          {tenants.slice(0, 4).map(t => (
            <div key={t.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
              <span className="text-slate-700">{t.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{t.status}</span>
            </div>
          ))}
          {tenants.length === 0 && <p className="text-slate-400 text-sm">No tenants yet.</p>}
        </div>
      </div>
    </div>
  );
}