import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import { useCampaigns } from "@/lib/campaigns";
import { fetchCampaigns, formatCLP, type KimunCampaign } from "@/lib/kimun-api";
import { useEffect, useState } from "react";
import { Cloud, Palette, Eye, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const local = useCampaigns();
  const [remote, setRemote] = useState<KimunCampaign[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns()
      .then(setRemote)
      .catch(() => setErr("No pudimos conectar con el Worker"));
  }, []);

  const active = local.find((c) => c.active);

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
          <h1 className="font-display text-secondary text-3xl uppercase mb-6">Panel</h1>
          <AdminNav />

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Stat label="Campañas en API" value={remote ? String(remote.length) : err ? "—" : "…"} />
            <Stat label="Campañas visuales" value={String(local.length)} />
            <Stat label="Causa activa" value={active?.title ?? "—"} small />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card to="/admin/api" Icon={Cloud} title="Crear en API" desc="Crea campañas reales en el Worker con tu token." />
            <Card to="/admin/campanas" Icon={Palette} title="Editar visual" desc="Diseña cómo se ve la campaña pública." />
            <Card to="/admin/preview" Icon={Eye} title="Vista previa" desc="Mira /donar tal como lo verá la gente." />
          </div>

          {active && (
            <p className="mt-8 text-xs text-foreground/60">
              Causa activa: <strong>{active.title}</strong> · meta {formatCLP(active.goal)}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4">
      <p className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 uppercase">{label}</p>
      <p className={`font-display text-secondary mt-1 ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function Card({
  to,
  Icon,
  title,
  desc,
}: {
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-card rounded-2xl border border-border/50 shadow-card p-5 hover:border-primary transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-secondary-soft flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-secondary" />
      </div>
      <p className="font-display text-secondary text-lg">{title}</p>
      <p className="text-xs text-foreground/60 mt-1">{desc}</p>
      <span className="inline-flex items-center gap-1 mt-3 text-xs font-hand tracking-[0.18em] text-primary group-hover:gap-2 transition-all">
        ABRIR <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}
