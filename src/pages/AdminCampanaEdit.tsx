import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  loadCampaigns,
  upsertCampaign,
  setActiveCampaign,
  ICON_REGISTRY,
  slugify,
  DEFAULT_UPSELL,
  type Campaign,
  type CampaignIconKey,
} from "@/lib/campaigns";
import { formatCLP, fetchCampaigns, type KimunCampaign } from "@/lib/kimun-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Eye, Save, Star, Image as ImageIcon } from "lucide-react";

function AdminCampanaEditInner() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [remoteItems, setRemoteItems] = useState<KimunCampaign[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(true);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  useEffect(() => {
    const found = loadCampaigns().find((c) => c.id === id) ?? null;
    setCampaign(found);
  }, [id]);

  useEffect(() => {
    const ctrl = new AbortController();
    setRemoteLoading(true);
    fetchCampaigns(ctrl.signal)
      .then((items) => {
        setRemoteItems(items);
        setRemoteError(null);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setRemoteError("No hay causas disponibles en la API");
      })
      .finally(() => setRemoteLoading(false));
    return () => ctrl.abort();
  }, []);

  const set = <K extends keyof Campaign>(k: K, v: Campaign[K]) =>
    setCampaign((c) => (c ? { ...c, [k]: v } : c));

  const goalUnits = useMemo(() => {
    if (!campaign || !campaign.unitAmount) return 0;
    return Math.ceil(campaign.goal / campaign.unitAmount);
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-warm flex flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-10 max-w-3xl mx-auto">
          <p className="text-foreground/60">Campaña no encontrada.</p>
          <Link to="/admin/campanas" className="text-primary underline text-sm">Volver al listado</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const SelectedIcon = ICON_REGISTRY[campaign.unitIcon]?.Icon ?? ICON_REGISTRY.heart.Icon;

  const handleSave = () => {
    const finalSlug = slugify(campaign.id || campaign.title) || `campana-${Date.now()}`;
    const updated: Campaign = { ...campaign, id: finalSlug };
    upsertCampaign(updated);
    if (finalSlug !== id) nav(`/admin/campanas/${finalSlug}`, { replace: true });
    alert("Campaña guardada");
  };

  const handlePublish = () => {
    handleSave();
    setActiveCampaign(slugify(campaign.id || campaign.title));
    alert("Campaña publicada como activa");
  };

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/admin/campanas" className="inline-flex items-center gap-2 text-xs font-hand tracking-[0.2em] text-foreground/60 hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> CAMPAÑAS
          </Link>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="font-display text-secondary text-3xl uppercase">Editar campaña</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/donar" className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-border hover:bg-secondary-soft">
                <Eye className="w-3.5 h-3.5" /> Vista previa
              </Link>
              <button onClick={handleSave} className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Save className="w-3.5 h-3.5" /> Guardar
              </button>
              <button onClick={handlePublish} className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Star className="w-3.5 h-3.5" /> Publicar como activa
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <Block title="Conexión con la API">
              <Field label="Selecciona tu causa (campaña real en el Worker)">
                {remoteLoading ? (
                  <p className="text-xs text-foreground/60">Cargando causas desde la API…</p>
                ) : remoteError ? (
                  <p className="text-xs text-destructive">{remoteError}. Puedes seguir editando en modo local.</p>
                ) : remoteItems.length === 0 ? (
                  <p className="text-xs text-destructive">No hay causas disponibles en la API</p>
                ) : (
                  <select
                    value={campaign.remoteCampaignId ?? ""}
                    onChange={(e) => {
                      const rid = e.target.value;
                      const found = remoteItems.find((x) => x.id === rid);
                      setCampaign((c) =>
                        c
                          ? {
                              ...c,
                              remoteCampaignId: rid || undefined,
                              ...(found
                                ? {
                                    title: c.title || found.title,
                                    goal: c.goal || found.goal,
                                    raised: found.raised,
                                  }
                                : {}),
                            }
                          : c,
                      );
                    }}
                    className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">— Sin conectar —</option>
                    {remoteItems.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.title} ({it.id})
                      </option>
                    ))}
                  </select>
                )}
                {campaign.remoteCampaignId && (
                  <p className="text-[11px] text-foreground/60 mt-2">
                    Conectada a <code className="font-mono">{campaign.remoteCampaignId}</code>. Las donaciones usarán este ID en el Worker.
                  </p>
                )}
              </Field>

              <p className="text-[11px] text-foreground/50">Para crear o actualizar campañas en la API, ve a <Link to="/admin/api" className="underline text-primary">Admin · API</Link>.</p>
            </Block>

            <Block title="Datos generales">
              <Field label="Nombre de la campaña">
                <Input value={campaign.title} onChange={(v) => set("title", v)} />
              </Field>
              <Field label="Slug / ID (URL)">
                <Input value={campaign.id} onChange={(v) => set("id", slugify(v))} placeholder="taller-carpinteria" />
              </Field>
              <Field label="Estado">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={campaign.active}
                    onChange={(e) => set("active", e.target.checked)}
                  />
                  Marcar como campaña activa (causa del mes)
                </label>
              </Field>
            </Block>

            <Block title="Textos del hero">
              <Field label="Badge"><Input value={campaign.badge} onChange={(v) => set("badge", v)} /></Field>
              <Field label="Pretítulo"><Input value={campaign.preTitle} onChange={(v) => set("preTitle", v)} /></Field>
              <Field label="Subtítulo"><Input value={campaign.subtitle} onChange={(v) => set("subtitle", v)} /></Field>
              <Field label="Descripción corta">
                <Input value={campaign.shortDescription} onChange={(v) => set("shortDescription", v)} />
              </Field>
              <Field label="Descripción larga">
                <textarea
                  value={campaign.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </Field>
            </Block>

            <Block title="Meta">
              <Field label="Meta en dinero (CLP)">
                <Input
                  type="number"
                  value={String(campaign.goal)}
                  onChange={(v) => set("goal", Number(v) || 0)}
                />
                <p className="text-xs text-foreground/60 mt-1">{formatCLP(campaign.goal)}</p>
              </Field>
              <p className="text-xs text-foreground/60">
                Meta en unidades (calculada): <strong>{goalUnits.toLocaleString("es-CL")}</strong> {campaign.unitPlural}
              </p>
            </Block>

            <Block title="Unidad solidaria">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Singular"><Input value={campaign.unitSingular} onChange={(v) => set("unitSingular", v)} /></Field>
                <Field label="Plural"><Input value={campaign.unitPlural} onChange={(v) => set("unitPlural", v)} /></Field>
              </div>
              <Field label="Nombre público"><Input value={campaign.unitPublicName} onChange={(v) => set("unitPublicName", v)} /></Field>
              <Field label="Monto por unidad (CLP)">
                <Input
                  type="number"
                  value={String(campaign.unitAmount)}
                  onChange={(v) => set("unitAmount", Number(v) || 0)}
                />
              </Field>
              <Field label="Icono">
                <button
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2.5 hover:bg-secondary-soft"
                >
                  <SelectedIcon className="w-5 h-5 text-secondary" />
                  <span className="text-sm">{ICON_REGISTRY[campaign.unitIcon]?.label}</span>
                  <span className="text-xs text-foreground/50">Cambiar</span>
                </button>
              </Field>
            </Block>

            <Block title="Imagen y video">
              <Field label="Imagen principal (URL)">
                <Input value={campaign.imageUrl} onChange={(v) => set("imageUrl", v)} placeholder="https://..." />
                {campaign.imageUrl && (
                  <img src={campaign.imageUrl} alt="" className="mt-3 rounded-xl max-h-48 object-cover" />
                )}
              </Field>
              <Field label="Video (URL opcional)">
                <Input value={campaign.videoUrl ?? ""} onChange={(v) => set("videoUrl", v)} placeholder="https://..." />
              </Field>
              <p className="text-[11px] text-foreground/50 inline-flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Si dejas la URL vacía, se usa la imagen por defecto.
              </p>
            </Block>

            <Block title="Upsell mensual">
              <p className="text-xs text-foreground/60 -mt-2">
                Después del paso 1 del modal, ofrece a la persona transformar su donación en un aporte mensual.
              </p>
              <Field label="Activar upsell mensual">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={campaign.upsellMonthlyEnabled !== false}
                    onChange={(e) => set("upsellMonthlyEnabled", e.target.checked)}
                  />
                  Mostrar paso 2 con propuesta de hacerse socio mensual
                </label>
              </Field>
              <Field label="Título del upsell">
                <Input
                  value={campaign.upsellTitle ?? ""}
                  onChange={(v) => set("upsellTitle", v)}
                  placeholder={DEFAULT_UPSELL.upsellTitle}
                />
              </Field>
              <Field label="Mensaje del upsell">
                <textarea
                  value={campaign.upsellMessage ?? ""}
                  onChange={(e) => set("upsellMessage", e.target.value)}
                  rows={4}
                  placeholder={DEFAULT_UPSELL.upsellMessage}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Botón principal (sí, hacerme socio)">
                  <Input
                    value={campaign.upsellPrimaryButtonText ?? ""}
                    onChange={(v) => set("upsellPrimaryButtonText", v)}
                    placeholder={DEFAULT_UPSELL.upsellPrimaryButtonText}
                  />
                </Field>
                <Field label="Botón secundario (solo donación única)">
                  <Input
                    value={campaign.upsellSecondaryButtonText ?? ""}
                    onChange={(v) => set("upsellSecondaryButtonText", v)}
                    placeholder={DEFAULT_UPSELL.upsellSecondaryButtonText}
                  />
                </Field>
              </div>
              <Field label="Ruta del botón principal">
                <Input
                  value={campaign.upsellPrimaryAction ?? ""}
                  onChange={(v) => set("upsellPrimaryAction", v)}
                  placeholder={DEFAULT_UPSELL.upsellPrimaryAction}
                />
              </Field>
            </Block>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="bg-card border-border max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-secondary">Elegir icono</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
            {(Object.keys(ICON_REGISTRY) as CampaignIconKey[]).map((key) => {
              const { Icon, label } = ICON_REGISTRY[key];
              const selected = key === campaign.unitIcon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    set("unitIcon", key);
                    setPickerOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    selected
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-secondary-soft"
                  }`}
                >
                  <Icon className="w-7 h-7 text-secondary" />
                  <span className="text-xs text-foreground/80 text-center">{label}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl border border-border/50 shadow-card p-5 sm:p-6">
      <h2 className="font-display text-secondary uppercase text-sm tracking-wide mb-4">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5">
        {label.toUpperCase()}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
    />
  );
}

export default function AdminCampanaEdit() {
  return (
    <AdminGuard>
      <AdminCampanaEditInner />
    </AdminGuard>
  );
}
