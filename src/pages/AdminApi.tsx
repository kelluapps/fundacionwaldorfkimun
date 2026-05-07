import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdminNav from "@/components/admin/AdminNav";
import {
  KIMUN_API_BASE,
  fetchCampaigns,
  getAdminToken,
  setAdminToken,
  putCampaign,
  formatCLP,
  type KimunCampaign,
} from "@/lib/kimun-api";
import { slugify } from "@/lib/campaigns";
import { Cloud, KeyRound, RefreshCw, Save } from "lucide-react";

export default function AdminApi() {
  const [token, setTokenState] = useState<string>(() => getAdminToken());
  const [items, setItems] = useState<KimunCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);

  // form
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState<number>(5_000_000);
  const [raised, setRaised] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAdminToken(token);
  }, [token]);

  const loadList = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const list = await fetchCampaigns();
      setItems(list);
      if (list.length === 0) setMsg({ kind: "info", text: "No hay causas disponibles en la API" });
    } catch {
      setMsg({ kind: "err", text: "No pudimos conectar con el Worker" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (c: KimunCampaign) => {
    setId(c.id);
    setTitle(c.title);
    setGoal(c.goal);
    setRaised(c.raised);
    setActive(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    setMsg(null);
    if (!token) {
      setMsg({ kind: "err", text: "Token de administrador incorrecto" });
      return;
    }
    const slug = slugify(id);
    if (!slug) {
      setMsg({ kind: "err", text: "Debes ingresar un ID de campaña" });
      return;
    }
    setSaving(true);
    const body = {
      id: slug,
      title: title || slug,
      goal: Number(goal) || 0,
      raised: Number(raised) || 0,
      isActive: active,
      active,
    };
    const result = await putCampaign(slug, body, token);
    setSaving(false);
    if (result.ok === true) {
      setMsg({ kind: "ok", text: "Campaña creada correctamente en la API" });
      loadList();
    } else {
      setMsg({ kind: "err", text: (result as { ok: false; message: string }).message });
    }
  };

  const resetForm = () => {
    setId("");
    setTitle("");
    setGoal(5_000_000);
    setRaised(0);
    setActive(true);
  };

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary">ADMIN</p>
          <h1 className="font-display text-secondary text-3xl uppercase mb-6">API</h1>
          <AdminNav />

          <section className="bg-card rounded-2xl border border-border/50 shadow-card p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-secondary uppercase text-lg">Crear campaña en API</h2>
            </div>
            <p className="text-xs text-foreground/60 mb-5">
              Crea aquí la campaña real en el Worker. Esta campaña tendrá el ID, meta y recaudación oficial que usará el cómputo.
            </p>

            <div className="grid gap-4">
              <Field label="Token de administrador">
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setTokenState(e.target.value)}
                    placeholder="Pega aquí tu ADMIN_TOKEN"
                    className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <p className="text-[11px] text-foreground/50 mt-1">Solo se guarda en esta sesión del navegador.</p>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="ID / Slug de campaña">
                  <Input value={id} onChange={(v) => setId(slugify(v))} placeholder="taller-carpinteria" />
                </Field>
                <Field label="Nombre de campaña">
                  <Input value={title} onChange={setTitle} placeholder="Taller de Carpintería Kimün" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Meta en pesos (CLP)">
                  <Input type="number" value={String(goal)} onChange={(v) => setGoal(Number(v) || 0)} />
                  <p className="text-xs text-foreground/60 mt-1">{formatCLP(goal)}</p>
                </Field>
                <Field label="Recaudado inicial (CLP)">
                  <Input type="number" value={String(raised)} onChange={(v) => setRaised(Number(v) || 0)} />
                  <p className="text-xs text-foreground/60 mt-1">{formatCLP(raised)}</p>
                </Field>
              </div>

              <Field label="Estado">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                  Marcar como campaña activa / causa del mes
                </label>
              </Field>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1 text-xs px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Guardando…" : "Crear campaña en API"}
                </button>
                <button
                  onClick={resetForm}
                  className="text-xs px-4 py-2 rounded-full border border-border hover:bg-secondary-soft"
                >
                  Limpiar formulario
                </button>
              </div>

              {msg && (
                <p
                  className={`text-xs ${
                    msg.kind === "ok" ? "text-primary" : msg.kind === "err" ? "text-destructive" : "text-foreground/60"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <p className="text-[11px] text-foreground/50 break-all">
                Endpoint: <code className="font-mono">{KIMUN_API_BASE}/campaigns/{id || "{slug}"}</code>
              </p>
            </div>
          </section>

          <section className="bg-card rounded-2xl border border-border/50 shadow-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-secondary uppercase text-sm tracking-wide">Campañas en la API</h2>
              <button
                onClick={loadList}
                disabled={loading}
                className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-border hover:bg-secondary-soft disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Cargando…" : "Recargar"}
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-foreground/60">{loading ? "Cargando…" : "Sin campañas todavía."}</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {items.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-secondary truncate">{c.title}</p>
                      <p className="text-[11px] text-foreground/60">
                        {c.id} · meta {formatCLP(c.goal)} · recaudado {formatCLP(c.raised)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-secondary-soft"
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5">{label.toUpperCase()}</span>
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
