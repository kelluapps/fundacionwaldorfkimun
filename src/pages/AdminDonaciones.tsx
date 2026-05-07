import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminTokenBar from "@/components/admin/AdminTokenBar";
import { fetchAdminDonations, formatCLP, getAdminToken, MOCK_DONATIONS, type AdminDonation } from "@/lib/kimun-api";
import { Loader2, Search } from "lucide-react";

const MESES = ["Todos", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function AdminDonaciones() {
  const [token, setToken] = useState(getAdminToken());
  const [items, setItems] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [campaign, setCampaign] = useState("all");
  const [status, setStatus] = useState("all");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(0);

  const load = async (t: string) => {
    setLoading(true);
    setError(null);
    setNote(null);
    const r = await fetchAdminDonations(t);
    if (r.ok) {
      setItems(r.items);
    } else if (r.reason === "missing" || r.reason === "server") {
      setItems(MOCK_DONATIONS);
      setNote("Endpoint de donaciones pendiente de conectar en Worker. Mostrando datos de ejemplo.");
    } else {
      setItems([]);
      setError(r.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campaigns = useMemo(() => {
    const m = new Map<string, string>();
    items.forEach((i) => i.campaignId && m.set(i.campaignId, i.campaignTitle ?? i.campaignId));
    return Array.from(m, ([id, title]) => ({ id, title }));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((d) => {
      const dt = new Date(d.date);
      if (dt.getFullYear() !== year) return false;
      if (month > 0 && dt.getMonth() + 1 !== month) return false;
      if (campaign !== "all" && d.campaignId !== campaign) return false;
      if (status !== "all" && (d.status ?? "").toLowerCase() !== status) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!d.name.toLowerCase().includes(s) && !d.email.toLowerCase().includes(s)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [items, year, month, campaign, status, q]);

  return (
    <AdminShell title="Últimas donaciones" description="Revisa las últimas donaciones recibidas por campaña.">
      <AdminTokenBar onChange={(t) => setToken(t)} />

      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 mb-4 grid gap-2 sm:grid-cols-6">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre o email…" className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-border bg-background focus:outline-none focus:border-primary" />
        </div>
        <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          <option value="all">Todas las campañas</option>
          {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          <option value="all">Todos los estados</option>
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
          <option value="failed">Fallido</option>
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {[year + 1, year, year - 1, year - 2].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
      </div>

      {loading && <LoadingBox text="Conectando a Flow y cargando últimas donaciones…" />}
      {note && <Notice text={note} />}
      {error && <Notice kind="err" text={`No pudimos cargar la información. ${error}`} />}

      {!loading && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-soft text-foreground/70 text-[11px] uppercase tracking-[0.16em]">
              <tr>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Donante</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="text-right px-4 py-3">Monto</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Campaña</th>
                <th className="text-left px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-foreground/50 text-sm">Sin donaciones para los filtros aplicados.</td></tr>
              )}
              {filtered.map((d, i) => (
                <tr key={d.id ?? i} className="border-t border-border/50">
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{new Date(d.date).toLocaleDateString("es-CL")}</td>
                  <td className="px-4 py-3">{d.name}</td>
                  <td className="px-4 py-3 text-xs text-foreground/70 hidden sm:table-cell">{d.email}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCLP(d.amount)}</td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">{d.campaignTitle ?? d.campaignId ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "").toLowerCase();
  const map: Record<string, string> = {
    paid: "bg-primary/15 text-primary",
    pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    failed: "bg-destructive/15 text-destructive",
    canceled: "bg-destructive/15 text-destructive",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${map[s] ?? "bg-muted text-foreground/60"}`}>{status ?? "—"}</span>;
}

export function LoadingBox({ text }: { text: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-8 text-center mb-4">
      <Loader2 className="w-5 h-5 animate-spin mx-auto text-secondary mb-2" />
      <p className="text-sm text-foreground/70">{text}</p>
      <p className="text-[11px] text-foreground/40 mt-1">Esto puede tardar unos segundos mientras sincronizamos la información.</p>
    </div>
  );
}

export function Notice({ text, kind = "info" }: { text: string; kind?: "info" | "err" }) {
  return (
    <div className={`mb-4 rounded-2xl px-4 py-3 text-xs ${kind === "err" ? "bg-destructive/10 text-destructive" : "bg-secondary-soft text-foreground/70"}`}>
      {text}
    </div>
  );
}
