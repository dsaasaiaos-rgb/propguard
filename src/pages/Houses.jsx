import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Home } from "lucide-react";
import { Link } from "react-router-dom";

const EMPTY = { address: "", city: "", state: "", zip: "", num_rooms: "", monthly_rent: "", status: "available", notes: "" };

export default function Houses() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null); // null=closed, {}=new, {id,...}=edit
  const { data: houses = [], isLoading } = useQuery({ queryKey: ["houses"], queryFn: () => base44.entities.House.list("-created_date") });
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: () => base44.entities.Tenant.list() });

  const save = useMutation({
    mutationFn: (data) => data.id ? base44.entities.House.update(data.id, data) : base44.entities.House.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["houses"] }); setForm(null); }
  });
  const del = useMutation({
    mutationFn: (id) => base44.entities.House.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["houses"] })
  });

  const tenantCount = (houseId) => tenants.filter(t => t.house_id === houseId && t.status === "active").length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1a365d" }}>🏠 Houses</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "#2b6cb0" }}>
          <Plus className="w-4 h-4" /> Add House
        </button>
      </div>

      {isLoading ? <p className="text-slate-400">Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {houses.map(h => (
            <div key={h.id} className="bg-white rounded-xl p-5 shadow-sm border-t-4" style={{ borderColor: "#2b6cb0" }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800">{h.address}</h3>
                  <p className="text-sm text-slate-400">{[h.city, h.state, h.zip].filter(Boolean).join(", ")}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${h.status === "occupied" ? "bg-green-100 text-green-700" : h.status === "available" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{h.status}</span>
              </div>
              <div className="flex gap-4 text-sm text-slate-500 mb-3">
                {h.num_rooms && <span>🛏 {h.num_rooms} rooms</span>}
                {h.monthly_rent && <span>💵 ${Number(h.monthly_rent).toLocaleString()}/mo</span>}
                <span>👤 {tenantCount(h.id)} tenant(s)</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/houses/${h.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50">View Details</Link>
                <button onClick={() => setForm(h)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => { if (confirm("Delete this house?")) del.mutate(h.id); }} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
          {houses.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-400">
              <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No houses yet. Add your first property.</p>
            </div>
          )}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800">{form.id ? "Edit House" : "Add House"}</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {[["address", "Address *"], ["city", "City"], ["state", "State"], ["zip", "ZIP Code"]].map(([k, label]) => (
                <input key={k} placeholder={label} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              ))}
              <div className="flex gap-2">
                <input placeholder="Rooms" type="number" value={form.num_rooms || ""} onChange={e => setForm({ ...form, num_rooms: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-1/2" />
                <input placeholder="Monthly Rent ($)" type="number" value={form.monthly_rent || ""} onChange={e => setForm({ ...form, monthly_rent: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-1/2" />
              </div>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <textarea placeholder="Notes" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setForm(null)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={!form.address} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50" style={{ background: "#2b6cb0" }}>
                {save.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}