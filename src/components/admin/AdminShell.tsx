import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import AdminGuard from "@/components/admin/AdminGuard";
import { LogOut } from "lucide-react";
import { clearAdminToken } from "@/lib/kimun-api";

export default function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    clearAdminToken();
    window.location.href = "/admin";
  };
  return (
    <AdminGuard>
      <div className="min-h-screen bg-warm flex flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
                <h1 className="font-display text-secondary text-3xl uppercase">{title}</h1>
                {description && <p className="text-sm text-foreground/70 mt-1 mb-5">{description}</p>}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[11px] font-hand tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border border-border hover:bg-secondary-soft text-foreground/70"
              >
                <LogOut className="w-3 h-3" /> Cerrar sesión
              </button>
            </div>
            <div className="mt-4">
              <AdminNav />
            </div>
            {children}
          </div>
        </main>
        <SiteFooter />
      </div>
    </AdminGuard>
  );
}
