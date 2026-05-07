import { useEffect, useState } from "react";
import { fetchCampaigns, getAdminToken, setAdminToken, type KimunCampaign } from "@/lib/kimun-api";
import { upsertCampaign, slugify, type Campaign } from "@/lib/campaigns";
import { Cloud, Download, KeyRound, RefreshCw } from "lucide-react";

export default function ApiConnectPanel() {
  const [token, setToken] = useState<string>(() => getAdminToken());
  const [items, setItems] = useState<KimunCampaign[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);

  useEffect(() => {
    setAdminToken(token);
  }, [token]);

  const handleLoad = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const list = await fetchCampaigns();
      setItems(list);
      if (list.length === 0) setMsg({ kind: "info", text: "No hay causas disponibles en la API" });
      else setMsg({ kind: "ok", text: `${list.length} causas cargadas desde la API` });
    } catch {
      setMsg({ kind: "err", text: "No pudimos conectar con el Worker" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const found = items.find((x) => x.id === selected);
    if (!found) return;
    const slug = slugify(found.id) || `causa-${Date.now()}`;
    const draft: Campaign = {
      id: slug,
      active: false,
      title: found.title,
      badge: "Campaña del mes",
      preTitle: "Creemos juntos un",
      subtitle: "",
      shortDescription: "",
      longDescription: "",
      goal: found.goal,
      raised: found.raised,
      unitSingular: "aporte",
      unitPlural: "aportes",
      unitPublicName: "Aportes solidarios",
      unitAmount: 5000,
      unitIcon: "heart",
      imageUrl: "",
      videoUrl: "",
      remoteCampaignId: found.id,
      updatedAt: new Date().toISOString(),
    };
    upsertCampaign(draft);
    window.location.href = `/admin/campanas/${slug}`;
  };

  return (
    <section className="bg-card rounded-2xl border border-border/50 shadow-card p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="w-5 h-5 text-secondary" />
        <h2 className="font-display text-secondary uppercase text-sm tracking-wide">Conectar con API</h2>
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5 inline-flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> TOKEN DE ADMINISTRADOR
          </span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pega aquí tu ADMIN_TOKEN"
            className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-[11px] text-foreground/50 mt-1">
            Se guarda solo en esta sesión del navegador. No se envía a ningún otro servicio.
          </p>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoad}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Cargando…" : "Cargar campañas desde API"}
          </button>
        </div>

        {items.length > 0 && (
          <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
            <label className="block">
              <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5">
                SELECCIONA TU CAUSA
              </span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="">— Elegir causa —</option>
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.title} ({it.id})
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleImport}
              disabled={!selected}
              className="inline-flex items-center gap-1 text-xs px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Editar esta causa
            </button>
          </div>
        )}

        {msg && (
          <p
            className={`text-xs ${
              msg.kind === "ok"
                ? "text-primary"
                : msg.kind === "err"
                  ? "text-destructive"
                  : "text-foreground/60"
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
}
