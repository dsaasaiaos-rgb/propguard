import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

const EMPTY = { name: "", email: "", phone: "", house_id: "", lease_start: "", lease_end: "", status: "active", notes: "" };

export default function Tenants() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState("");

  const { data: tenants = [], isLoading } = useQuery({ queryKey: ["tenants"], queryFn: () => base44.entities.Tenant.list("-created_date") });
  const { data: houses = [] } = useQuery({ queryKey: ["houses"], queryFn: () => base44.entities.House.list() });

  const save = useMutation({
    mutationFn: (data) => data.id ? base44.entities.Tenant.update(data.id, data) : base44.entities.Tenant.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tenants"] }); setForm(null); }
  });
  const del = useMutation({
    mutationFn: (id) => base44.entities.Tenant.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tenants"] })
  });

  const getHouseAddress = (hId) => houses.find(h => h.id === hId)?.address || "—";
  const filtered = tenants.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1a365d" }}>👤 Tenants</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "#2b6cb0" }}>
          <Plus className="w-4 h-4" /> Add Tenant
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm mb-5 bg-white" />

      {isLoading ? <p className="text-slate-400">Loading...</p> : (
        <div className="flex flex-col gap-3">
          {filtered.map(t => {
            const house = houses.find(h => h.id === t.house_id);
            return (
              <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{t.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "active" ? "bg-green-100 text-green-700" : t.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>{t.status}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1 flex flex-wrap gap-3">
                    {t.email && <span>📧 {t.email}</span>}
                    {t.phone && <span>📞 {t.phone}</span>}
                    {t.house_id && <span>🏠 {getHouseAddress(t.house_id)}</span>}
                    {t.lease_end && <span>📅 Lease ends: {t.lease_end}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setForm(t)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                  <button onClick={() => { if (confirm("Delete this tenant?")) del.mutate(t.id); }} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No tenants found.</p>
            </div>
          )}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800">{form.id ? "Edit Tenant" : "Add Tenant"}</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Full Name *" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Phone" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              <select value={form.house_id || ""} onChange={e => setForm({ ...form, house_id: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="">-- Assign to House --</option>
                {houses.map(h => <option key={h.id} value={h.id}>{h.address}</option>)}
              </select>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">Lease Start</label>
                  <input type="date" value={form.lease_start || ""} onChange={e => setForm({ ...form, lease_start: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-full" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">Lease End</label>
                  <input type="date" value={form.lease_end || ""} onChange={e => setForm({ ...form, lease_end: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-full" />
                </div>
              </div>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <textarea placeholder="Notes" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setForm(null)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={!form.name} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50" style={{ background: "#2b6cb0" }}>
                {save.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}