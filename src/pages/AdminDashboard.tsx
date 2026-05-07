import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import AdminGuard from "@/components/admin/AdminGuard";
import { useCampaigns } from "@/lib/campaigns";
import {
  fetchCampaigns,
  fetchAdminDonations,
  fetchAdminSocios,
  formatCLP,
  clearAdminToken,
  MOCK_DONATIONS,
  MOCK_SOCIOS,
  type AdminDonation,
  type AdminSocio,
  type KimunCampaign,
} from "@/lib/kimun-api";
import { useEffect, useMemo, useState } from "react";
import { Cloud, Palette, Eye, ArrowRight, HandCoins, Users, UserCheck, CalendarRange, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const local = useCampaigns();
  const [remote, setRemote] = useState<KimunCampaign[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [socios, setSocios] = useState<AdminSocio[]>([]);

  useEffect(() => {
    fetchCampaigns().then(setRemote).catch(() => setErr("No pudimos conectar con el Worker"));
    const token = getAdminToken();
    fetchAdminDonations(token).then((r) => setDonations(r.ok && r.items.length ? r.items : MOCK_DONATIONS));
    fetchAdminSocios(token).then((r) => setSocios(r.ok && r.items.length ? r.items : MOCK_SOCIOS));
  }, []);

  const active = local.find((c) => c.active);

  const summary = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const dYear = donations.filter((d) => new Date(d.date).getFullYear() === y);
    const dMonth = dYear.filter((d) => new Date(d.date).getMonth() === m);
    const seenBefore = new Set<string>();
    donations.forEach((d) => {
      const dt = new Date(d.date);
      if (dt < new Date(y, m, 1)) seenBefore.add(d.email.toLowerCase());
    });
    const newDonors = new Set(dMonth.map((d) => d.email.toLowerCase()));
    seenBefore.forEach((e) => newDonors.delete(e));
    const totalDonors = new Set(donations.map((d) => d.email.toLowerCase())).size;
    const sociosActivos = socios.filter((s) => (s.status ?? "").toLowerCase() === "activo");
    const sociosNuevosMes = socios.filter((s) => {
      const dt = new Date(s.date);
      return dt.getFullYear() === y && dt.getMonth() === m;
    }).length;
    const monthlyCommit = sociosActivos.reduce((a, s) => a + s.amount, 0);
    return {
      raisedYear: dYear.reduce((a, d) => a + d.amount, 0),
      donationsMonth: dMonth.length,
      totalDonors,
      newDonorsMonth: newDonors.size,
      sociosActivos: sociosActivos.length,
      monthlyCommit,
      sociosNuevosMes,
    };
  }, [donations, socios]);


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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Stat label="Recaudado este año" value={formatCLP(summary.raisedYear)} small />
            <Stat label="Donaciones este mes" value={String(summary.donationsMonth)} />
            <Stat label="Donantes totales" value={String(summary.totalDonors)} />
            <Stat label="Donantes nuevos este mes" value={String(summary.newDonorsMonth)} />
            <Stat label="Socios activos" value={String(summary.sociosActivos)} />
            <Stat label="Mensual comprometido" value={formatCLP(summary.monthlyCommit)} small />
            <Stat label="Socios nuevos este mes" value={String(summary.sociosNuevosMes)} />
            <Stat label="Causa activa" value={active?.title ?? "—"} small />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Card to="/admin/api" Icon={Cloud} title="Crear en API" desc="Crea campañas reales en el Worker con tu token." />
            <Card to="/admin/campanas" Icon={Palette} title="Editar visual" desc="Diseña cómo se ve la campaña pública." />
            <Card to="/admin/preview" Icon={Eye} title="Vista previa" desc="Mira /donar tal como lo verá la gente." />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card to="/admin/donaciones" Icon={HandCoins} title="Donaciones" desc="Últimas donaciones recibidas." />
            <Card to="/admin/donantes" Icon={Users} title="Donantes" desc="Control mensual por donante." />
            <Card to="/admin/socios" Icon={UserCheck} title="Socios" desc="Listado de socios mensuales." />
            <Card to="/admin/socios-control" Icon={CalendarRange} title="Control socios" desc="Seguimiento mensual anual." />
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
