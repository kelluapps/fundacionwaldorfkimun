import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  useCampaigns,
  setActiveCampaign,
  deleteCampaign,
  upsertCampaign,
  ICON_REGISTRY,
  type Campaign,
} from "@/lib/campaigns";
import { formatCLP } from "@/lib/kimun-api";
import { CheckCircle2, Plus, Pencil, Trash2, Eye, Star } from "lucide-react";

const blank = (): Campaign => ({
  id: "",
  active: false,
  title: "",
  badge: "Campaña del mes",
  preTitle: "Creemos juntos un",
  subtitle: "",
  shortDescription: "",
  longDescription: "",
  goal: 1_000_000,
  raised: 0,
  unitSingular: "aporte",
  unitPlural: "aportes",
  unitPublicName: "Aportes solidarios",
  unitAmount: 5000,
  unitIcon: "heart",
  imageUrl: "",
  videoUrl: "",
  updatedAt: new Date().toISOString(),
});

export default function AdminCampanas() {
  const items = useCampaigns();

  const handleNew = () => {
    const draft = blank();
    draft.id = `nueva-${Date.now()}`;
    draft.title = "Nueva campaña";
    upsertCampaign(draft);
    window.location.href = `/admin/campanas/${draft.id}`;
  };

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
              <h1 className="font-display text-secondary text-3xl uppercase">Campañas</h1>
            </div>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 font-hand text-xs tracking-[0.18em] shadow-card hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> NUEVA CAMPAÑA
            </button>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 shadow-card divide-y divide-border/40">
            {items.length === 0 && (
              <div className="p-6 text-sm text-foreground/60">No hay campañas todavía.</div>
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
                      <Eye className="w-3.5 h-3.5" /> Vista previa
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

          <p className="mt-6 text-xs text-foreground/50">
            Datos guardados localmente. Listo para conectar al Worker externo.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
