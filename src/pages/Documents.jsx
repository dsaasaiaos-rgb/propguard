import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, X, FileText, Download, Upload } from "lucide-react";

const EMPTY = { name: "", doc_type: "Other", linked_to: "house", house_id: "", tenant_id: "", notes: "", file_url: "" };

export default function Documents() {
  const qc = useQueryClient();
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");

  const { data: documents = [], isLoading } = useQuery({ queryKey: ["documents"], queryFn: () => base44.entities.Document.list("-created_date") });
  const { data: houses = [] } = useQuery({ queryKey: ["houses"], queryFn: () => base44.entities.House.list() });
  const { data: tenants = [] } = useQuery({ queryKey: ["tenants"], queryFn: () => base44.entities.Tenant.list() });

  const save = useMutation({
    mutationFn: (data) => data.id ? base44.entities.Document.update(data.id, data) : base44.entities.Document.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["documents"] }); setForm(null); }
  });
  const del = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] })
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, file_url, name: f.name || file.name }));
    setUploading(false);
  };

  const getLinkedName = (doc) => {
    if (doc.linked_to === "house") return houses.find(h => h.id === doc.house_id)?.address || "—";
    return tenants.find(t => t.id === doc.tenant_id)?.name || "—";
  };

  const filtered = filter === "all" ? documents : documents.filter(d => d.linked_to === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1a365d" }}>📁 Documents</h1>
        <button onClick={() => setForm(EMPTY)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "#2b6cb0" }}>
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {[["all", "All"], ["house", "Houses"], ["tenant", "Tenants"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
            style={filter === val ? { background: "#2b6cb0", color: "white", borderColor: "#2b6cb0" } : { background: "white", color: "#2b6cb0", borderColor: "#2b6cb0" }}>
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <p className="text-slate-400">Loading...</p> : (
        <div className="flex flex-col gap-3">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{doc.name}</div>
                <div className="text-sm text-slate-400 mt-0.5 flex flex-wrap gap-3">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{doc.doc_type}</span>
                  <span>{doc.linked_to === "house" ? "🏠" : "👤"} {getLinkedName(doc)}</span>
                  {doc.notes && <span>{doc.notes}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-1">
                    <Download className="w-3 h-3" /> View
                  </a>
                )}
                <button onClick={() => { if (confirm("Delete this document?")) del.mutate(doc.id); }} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No documents yet.</p>
            </div>
          )}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800">Upload Document</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input placeholder="Document Name *" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              <select value={form.doc_type} onChange={e => setForm({ ...form, doc_type: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {["Lease Agreement", "ID Proof", "Utility Bill", "Inspection Report", "Insurance", "Other"].map(t => <option key={t}>{t}</option>)}
              </select>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Link to:</label>
                <div className="flex gap-2">
                  {["house", "tenant"].map(v => (
                    <button key={v} onClick={() => setForm({ ...form, linked_to: v, house_id: "", tenant_id: "" })}
                      className="flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all"
                      style={form.linked_to === v ? { borderColor: "#2b6cb0", color: "#2b6cb0", background: "#ebf8ff" } : { borderColor: "#e2e8f0", color: "#64748b" }}>
                      {v === "house" ? "🏠 House" : "👤 Tenant"}
                    </button>
                  ))}
                </div>
              </div>
              {form.linked_to === "house" ? (
                <select value={form.house_id || ""} onChange={e => setForm({ ...form, house_id: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option value="">-- Select House --</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.address}</option>)}
                </select>
              ) : (
                <select value={form.tenant_id || ""} onChange={e => setForm({ ...form, tenant_id: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option value="">-- Select Tenant --</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              )}
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                {form.file_url ? (
                  <div className="text-green-600 text-sm font-medium">✅ File uploaded successfully</div>
                ) : uploading ? (
                  <div className="text-slate-400 text-sm">Uploading...</div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span className="text-sm text-slate-400">Click to select a file</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>
              <textarea placeholder="Notes" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setForm(null)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={!form.name || uploading} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50" style={{ background: "#2b6cb0" }}>
                {save.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}