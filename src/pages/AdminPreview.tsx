import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import { useActiveCampaign } from "@/lib/campaigns";
import { ExternalLink } from "lucide-react";

export default function AdminPreview() {
  const active = useActiveCampaign();
  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
          <h1 className="font-display text-secondary text-3xl uppercase mb-6">Vista previa</h1>
          <AdminNav />

          <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 sm:p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-foreground/70">
              Mostrando la campaña activa:{" "}
              <strong className="text-secondary">{active?.title ?? "—"}</strong>
            </p>
            <Link
              to="/donar"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Abrir /donar <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-card bg-card">
            <iframe
              src="/donar"
              title="Vista previa /donar"
              className="w-full h-[80vh] bg-background"
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
