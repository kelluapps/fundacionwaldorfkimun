import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { fetchAdminSocios, formatCLP, MOCK_SOCIOS, type AdminSocio } from "@/lib/kimun-api";
import { LoadingBox, Notice } from "./AdminDonaciones";

const MESES = ["Todos", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function AdminSocios() {
  const [items, setItems] = useState<AdminSocio[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [amount, setAmount] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);

  const load = async () => {
    setLoading(true); setError(null); setNote(null);
    const r = await fetchAdminSocios();
    if (r.ok) {
      setItems(r.items);
    } else if (r.reason === "missing" || r.reason === "server") {
      setItems(MOCK_SOCIOS);
      setNote("Endpoint de socios pendiente de conectar en Worker. Mostrando datos de ejemplo.");
    } else {
      setItems([]); setError(r.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const dt = new Date(s.date);
      if (dt.getFullYear() !== year) return false;
      if (month > 0 && dt.getMonth() + 1 !== month) return false;
      if (status !== "all" && (s.status ?? "").toLowerCase() !== status) return false;
      if (amount !== "all" && String(s.amount) !== amount) return false;
      if (q) {
        const ss = q.toLowerCase();
        if (!s.name.toLowerCase().includes(ss) && !s.email.toLowerCase().includes(ss)) return false;
      }
      return true;
    }).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [items, year, month, status, amount, q]);

  const amounts = useMemo(() => Array.from(new Set(items.map((i) => i.amount))).sort((a, b) => a - b), [items]);

  return (
    <AdminShell title="Socios mensuales" description="Revisa las personas que se han inscrito como socios mensuales.">
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 mb-4 grid gap-2 sm:grid-cols-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre o email…" className="sm:col-span-2 text-xs rounded-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-primary" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          <option value="all">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="fallido">Fallido</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          <option value="all">Todos los montos</option>
          {amounts.map((a) => <option key={a} value={a}>{formatCLP(a)}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {[year + 1, year, year - 1, year - 2].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
      </div>

      {loading && <LoadingBox text="Conectando a Flow y cargando socios mensuales…" />}
      {note && <Notice text={note} />}
      {error && <Notice kind="err" text={error} />}

      {!loading && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-soft text-foreground/70 text-[11px] uppercase tracking-[0.16em]">
              <tr>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Socio</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Teléfono</th>
                <th className="text-right px-4 py-3">Mensual</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-foreground/50 text-sm">Sin socios para los filtros aplicados.</td></tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.id ?? i} className="border-t border-border/50">
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{new Date(s.date).toLocaleDateString("es-CL")}</td>
                  <td className="px-4 py-3">
                    <div>{s.name}</div>
                    {s.comment && <div className="text-[10px] text-foreground/50 italic mt-0.5">"{s.comment}"</div>}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/70 hidden sm:table-cell">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-foreground/70 hidden md:table-cell">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCLP(s.amount)}</td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">{s.plan ?? "—"}</td>
                  <td className="px-4 py-3"><SocioBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function SocioBadge({ status }: { status?: string }) {
  const s = (status ?? "").toLowerCase();
  const map: Record<string, string> = {
    activo: "bg-primary/15 text-primary",
    pendiente: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    fallido: "bg-destructive/15 text-destructive",
    cancelado: "bg-destructive/15 text-destructive",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${map[s] ?? "bg-muted text-foreground/60"}`}>{status ?? "—"}</span>;
}
