import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import {
  useCampaigns,
  setActiveCampaign,
  deleteCampaign,
  upsertCampaign,
  ICON_REGISTRY,
  slugify,
  type Campaign,
} from "@/lib/campaigns";
import { fetchCampaigns, formatCLP, type KimunCampaign } from "@/lib/kimun-api";
import { CheckCircle2, Plus, Pencil, Trash2, Eye, Star, RefreshCw, Download, Palette } from "lucide-react";

const blankFromRemote = (r: KimunCampaign): Campaign => ({
  id: slugify(r.id) || `causa-${Date.now()}`,
  active: false,
  title: r.title,
  badge: "Campaña del mes",
  preTitle: "Creemos juntos un",
  subtitle: "",
  shortDescription: "",
  longDescription: "",
  goal: r.goal,
  raised: r.raised,
  unitSingular: "aporte",
  unitPlural: "aportes",
  unitPublicName: "Aportes solidarios",
  unitAmount: 5000,
  unitIcon: "heart",
  imageUrl: "",
  videoUrl: "",
  remoteCampaignId: r.id,
  updatedAt: new Date().toISOString(),
});

export default function AdminCampanas() {
  const items = useCampaigns();
  const [remote, setRemote] = useState<KimunCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);

  const loadRemote = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const list = await fetchCampaigns();
      setRemote(list);
      if (list.length === 0) setMsg({ kind: "info", text: "No hay causas disponibles en la API" });
    } catch {
      setMsg({ kind: "err", text: "No pudimos conectar con el Worker" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemote();
  }, []);

  const handleEditFromRemote = () => {
    const found = remote.find((x) => x.id === selected);
    if (!found) return;
    // ¿Ya existe local con remoteCampaignId == found.id?
    const existing = items.find((c) => c.remoteCampaignId === found.id);
    if (existing) {
      window.location.href = `/admin/campanas/${existing.id}`;
      return;
    }
    const draft = blankFromRemote(found);
    upsertCampaign(draft);
    window.location.href = `/admin/campanas/${draft.id}`;
  };

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
          <h1 className="font-display text-secondary text-3xl uppercase mb-6">Campañas</h1>
          <AdminNav />

          <section className="bg-card rounded-2xl border border-border/50 shadow-card p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-secondary uppercase text-lg">Editar campaña visual</h2>
            </div>
            <p className="text-xs text-foreground/60 mb-5">
              Selecciona una campaña existente en la API y configura cómo se verá en la página pública.
            </p>

            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={loadRemote}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Cargando…" : "Cargar campañas desde API"}
                </button>
                <Link
                  to="/admin/api"
                  className="text-xs px-4 py-2 rounded-full border border-border hover:bg-secondary-soft"
                >
                  ¿No existe? Crear en API →
                </Link>
              </div>

              {remote.length > 0 && (
                <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
                  <label className="block">
                    <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5">
                      SELECCIONA UNA CAMPAÑA CREADA EN LA API
                    </span>
                    <select
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                      className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">— Elegir causa —</option>
                      {remote.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.title} ({it.id})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={handleEditFromRemote}
                    disabled={!selected}
                    className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" /> Editar diseño
                  </button>
                </div>
              )}

              {msg && (
                <p
                  className={`text-xs ${
                    msg.kind === "ok" ? "text-primary" : msg.kind === "err" ? "text-destructive" : "text-foreground/60"
                  }`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          </section>

          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-secondary uppercase text-sm tracking-wide">
              Tus diseños guardados
            </h2>
            <button
              onClick={() => {
                const draft = blankFromRemote({
                  id: `nueva-${Date.now()}`,
                  title: "Nueva campaña",
                  goal: 1_000_000,
                  raised: 0,
                });
                draft.remoteCampaignId = undefined;
                upsertCampaign(draft);
                window.location.href = `/admin/campanas/${draft.id}`;
              }}
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-border hover:bg-secondary-soft"
            >
              <Plus className="w-3.5 h-3.5" /> Diseño en blanco
            </button>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 shadow-card divide-y divide-border/40">
            {items.length === 0 && (
              <div className="p-6 text-sm text-foreground/60">No hay diseños todavía.</div>
            )}
            {items.map((c) => {
              const Icon = ICON_REGISTRY[c.unitIcon]?.Icon ?? ICON_REGISTRY.heart.Icon;
              return (
                <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-soft flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display text-secondary text-lg leading-tight truncate">{c.title || c.id}</p>
                      {c.active && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-hand tracking-[0.18em] bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 mt-0.5">
                      /{c.id} · meta {formatCLP(c.goal)} · {formatCLP(c.unitAmount)} por {c.unitSingular}
                      {c.remoteCampaignId && (
                        <>
                          {" · API: "}
                          <code className="font-mono">{c.remoteCampaignId}</code>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {!c.active && (
                      <button
                        onClick={() => setActiveCampaign(c.id)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-border hover:bg-secondary-soft"
                      >
                        <Star className="w-3.5 h-3.5" /> Activar
                      </button>
                    )}
                    <Link
                      to="/donar"
                      className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-border hover:bg-secondary-soft"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </Link>
                    <Link
                      to={`/admin/campanas/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar "${c.title}"?`)) deleteCampaign(c.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
