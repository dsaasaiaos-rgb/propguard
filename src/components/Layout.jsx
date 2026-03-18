import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Users, FileText, LayoutDashboard, BookOpen } from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/houses", label: "Houses", icon: Home },
  { to: "/tenants", label: "Tenants", icon: Users },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/guide", label: "Maintenance Guide", icon: BookOpen },
];

export default function Layout() {
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Header */}
      <header className="text-white px-6 py-4 flex items-center justify-between shadow" style={{ background: "linear-gradient(135deg, #1a365d, #2b6cb0)" }}>
        <span className="font-bold text-lg">🏠 HomeGuard</span>
        <span className="text-white/70 text-sm hidden sm:block">Property Management</span>
      </header>

      {/* Bottom Nav (mobile) / Side Nav (desktop) */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-56px)] bg-white shadow-sm pt-6 px-3 gap-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${loc.pathname.startsWith(n.to) ? "text-white" : "text-slate-500 hover:bg-slate-100"}`}
              style={loc.pathname.startsWith(n.to) ? { background: "#2b6cb0" } : {}}>
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-50">
        {NAV.map(n => (
          <Link key={n.to} to={n.to}
            className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${loc.pathname.startsWith(n.to) ? "text-blue-600" : "text-slate-400"}`}>
            <n.icon className="w-5 h-5" />
            <span className="hidden sm:block">{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}