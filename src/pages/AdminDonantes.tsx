import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { fetchAdminDonantes, fetchAdminDonations, formatCLP, MOCK_DONATIONS, type AdminDonation } from "@/lib/kimun-api";
import { LoadingBox, Notice } from "./AdminDonaciones";

const MES_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

type DonorRow = {
  email: string;
  name: string;
  months: number[]; // 12
  count: number;
  total: number;
  last: string;
  campaigns: Set<string>;
};

export default function AdminDonantes() {
  const [items, setItems] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true); setError(null); setNote(null);
    const r = await fetchAdminDonantes();
    if (r.ok && r.items.length) {
      setItems(r.items);
    } else {
      const r2 = await fetchAdminDonations();
      if (r2.ok) {
        setItems(r2.items);
      } else if (r2.reason === "missing" || r2.reason === "server") {
        setItems(MOCK_DONATIONS);
        setNote("Endpoint de donantes pendiente de conectar en Worker. Mostrando datos de ejemplo.");
      } else if (!r.ok) {
        setItems([]); setError(r.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const rows: DonorRow[] = useMemo(() => {
    const map = new Map<string, DonorRow>();
    items.forEach((d) => {
      const dt = new Date(d.date);
      if (dt.getFullYear() !== year) return;
      const key = d.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { email: d.email, name: d.name, months: Array(12).fill(0), count: 0, total: 0, last: d.date, campaigns: new Set() });
      }
      const r = map.get(key)!;
      r.months[dt.getMonth()] += d.amount;
      r.count += 1;
      r.total += d.amount;
      if (+new Date(r.last) < +dt) r.last = d.date;
      if (d.campaignTitle) r.campaigns.add(d.campaignTitle);
    });
    return Array.from(map.values())
      .filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [items, year, q]);

  return (
    <AdminShell title="Base de datos de donantes" description="Control mensual de donaciones por donante.">
      <AdminTokenBar onChange={setToken} />

      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 mb-4 flex flex-wrap gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar donante…" className="flex-1 min-w-[180px] text-xs rounded-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-primary" />
        <label className="text-[11px] font-hand tracking-[0.18em] text-foreground/60">AÑO</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-xs rounded-full border border-border bg-background px-3 py-2">
          {[year + 1, year, year - 1, year - 2].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading && <LoadingBox text="Conectando a Flow y cargando donantes…" />}
      {note && <Notice text={note} />}
      {error && <Notice kind="err" text={error} />}

      {!loading && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary-soft text-foreground/70 text-[10px] uppercase tracking-[0.14em]">
              <tr>
                <th className="text-left px-3 py-3 sticky left-0 bg-secondary-soft">Donante</th>
                {MES_LABELS.map((m) => <th key={m} className="text-right px-2 py-3">{m}</th>)}
                <th className="text-right px-3 py-3">Total</th>
                <th className="text-right px-3 py-3">Nº</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={15} className="text-center py-10 text-foreground/50">Sin donantes para {year}.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.email} className="border-t border-border/50 hover:bg-warm/40">
                  <td className="px-3 py-2 sticky left-0 bg-card">
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {r.name}
                      {r.count >= 3 && <span className="text-[9px] uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">recurrente</span>}
                      {r.count === 1 && <span className="text-[9px] uppercase tracking-wider bg-secondary-soft text-secondary px-1.5 py-0.5 rounded-full">nuevo</span>}
                    </div>
                    <div className="text-[10px] text-foreground/50">{r.email}</div>
                    {r.campaigns.size > 0 && (
                      <div className="text-[10px] text-foreground/40 mt-0.5">{Array.from(r.campaigns).join(" · ")}</div>
                    )}
                  </td>
                  {r.months.map((v, i) => (
                    <td key={i} className={`text-right px-2 py-2 tabular-nums ${v ? "text-foreground" : "text-foreground/25"}`}>
                      {v ? formatCLP(v) : "—"}
                    </td>
                  ))}
                  <td className="text-right px-3 py-2 font-semibold text-primary tabular-nums">{formatCLP(r.total)}</td>
                  <td className="text-right px-3 py-2 tabular-nums">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
