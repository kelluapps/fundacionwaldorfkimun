import { NavLink } from "react-router-dom";
import { LayoutDashboard, Cloud, Palette, Eye, HandCoins, Users, UserCheck, CalendarRange } from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/api", label: "API", Icon: Cloud },
  { to: "/admin/campanas", label: "Campañas", Icon: Palette },
  { to: "/admin/preview", label: "Vista previa", Icon: Eye },
  { to: "/admin/donaciones", label: "Donaciones", Icon: HandCoins },
  { to: "/admin/donantes", label: "Donantes", Icon: Users },
  { to: "/admin/socios", label: "Socios", Icon: UserCheck },
  { to: "/admin/socios-control", label: "Control socios", Icon: CalendarRange },
];

export default function AdminNav() {
  return (
    <nav className="bg-card border border-border/50 rounded-full shadow-card p-1.5 flex flex-wrap gap-1 mb-6">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-hand tracking-[0.18em] uppercase transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-secondary-soft"
            }`
          }
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
