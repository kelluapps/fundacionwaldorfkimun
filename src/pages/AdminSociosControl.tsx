import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { fetchAdminSociosControl, fetchAdminSocios, formatCLP, MOCK_SOCIOS, type AdminSocio } from "@/lib/kimun-api";
import { LoadingBox, Notice } from "./AdminDonaciones";

const MES_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

type CellState = "paid" | "pending" | "canceled" | "na";

export default function AdminSociosControl() {
  const [items, setItems] = useState<AdminSocio[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = async () => {
    setLoading(true); setError(null); setNote(null);
    const r = await fetchAdminSociosControl();
    if (r.ok && r.items.length) {
      setItems(r.items);
    } else {
      const r2 = await fetchAdminSocios();
      if (r2.ok) setItems(r2.items);
      else if (r2.reason === "missing" || r2.reason === "server") {
        setItems(MOCK_SOCIOS);
        setNote("Endpoint de control de socios pendiente de conectar en Worker. Mostrando datos de ejemplo.");
      } else if (!r.ok) { setItems([]); setError(r.message); }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    const now = new Date();
    return items.map((s) => {
      const start = new Date(s.date);
      const isCanceled = (s.status ?? "").toLowerCase() === "cancelado";
      const months: CellState[] = Array(12).fill("na");
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        const key = `${year}-${String(m + 1).padStart(2, "0")}`;
        const explicit = s.monthlyPayments?.[key];
        if (explicit === "paid" || typeof explicit === "number") months[m] = "paid";
        else if (explicit === "canceled") months[m] = "canceled";
        else if (explicit === "pending" || explicit === "failed") months[m] = "pending";
        else if (d < new Date(start.getFullYear(), start.getMonth(), 1)) months[m] = "na";
        else if (d > now) months[m] = "na";
        else if (isCanceled) months[m] = "canceled";
        else months[m] = "pending";
      }
      const total = months.reduce((acc, st) => acc + (st === "paid" ? s.amount : 0), 0);
      return { socio: s, months, total };
    });
  }, [items, year]);

  return (
    <AdminShell title="Control mensual de socios" description="Seguimiento anual de aportes mensuales por socio.">
      <AdminTokenBar onChange={setToken} />

      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 mb-4 flex items-center gap-3">
        <label className="text-[11px] font-hand tracking-[0.18em] text-foreground/60">AÑO</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {[year + 1, year, year - 1, year - 2].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <Legend />
      </div>

      {loading && <LoadingBox text="Conectando a Flow y cargando control de socios…" />}
      {note && <Notice text={note} />}
      {error && <Notice kind="err" text={error} />}

      {!loading && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary-soft text-foreground/70 text-[10px] uppercase tracking-[0.14em]">
              <tr>
                <th className="text-left px-3 py-3 sticky left-0 bg-secondary-soft">Socio</th>
                <th className="text-right px-3 py-3">Mensual</th>
                {MES_LABELS.map((m) => <th key={m} className="text-center px-2 py-3">{m}</th>)}
                <th className="text-right px-3 py-3">Total</th>
                <th className="text-left px-3 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={16} className="text-center py-10 text-foreground/50">Sin socios para {year}.</td></tr>
              )}
              {rows.map(({ socio, months, total }) => (
                <tr key={socio.email} className="border-t border-border/50 hover:bg-warm/40">
                  <td className="px-3 py-2 sticky left-0 bg-card">
                    <div className="font-medium text-sm">{socio.name}</div>
                    <div className="text-[10px] text-foreground/50">{socio.email}</div>
                    {socio.phone && <div className="text-[10px] text-foreground/40">{socio.phone}</div>}
                  </td>
                  <td className="text-right px-3 py-2 tabular-nums">{formatCLP(socio.amount)}</td>
                  {months.map((st, i) => <td key={i} className="text-center px-2 py-2"><Cell state={st} amount={socio.amount} /></td>)}
                  <td className="text-right px-3 py-2 font-semibold text-primary tabular-nums">{formatCLP(total)}</td>
                  <td className="px-3 py-2"><span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-foreground/70">{socio.status ?? "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function Cell({ state, amount }: { state: CellState; amount: number }) {
  if (state === "paid") return <span className="inline-block min-w-[64px] text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{formatCLP(amount)}</span>;
  if (state === "pending") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">Pendiente</span>;
  if (state === "canceled") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Cancelado</span>;
  return <span className="text-foreground/25">—</span>;
}

function Legend() {
  return (
    <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-foreground/60">
      <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">Pagado</span>
      <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-700">Pendiente</span>
      <span className="px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive">Cancelado</span>
      <span className="px-1.5 py-0.5 rounded-full bg-muted">No aplica</span>
    </div>
  );
}
