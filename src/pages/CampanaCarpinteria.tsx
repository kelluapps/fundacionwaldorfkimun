import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Hammer,
  Heart,
  Leaf,
  Loader2,
  Lock,
  Minus,
  Plus,
  Sprout,
  Users,
} from "lucide-react";
import heroImg from "@/assets/carpinteria-hero.jpg";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HAMMER_PRICE,
  formatCLP,
  fetchCampaigns,
  createDonation,
  type KimunCampaign,
} from "@/lib/kimun-api";

const CAMPAIGN_ID = "taller-carpinteria";

const Leaflet = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 24" className={className} aria-hidden="true">
    <path d="M2 12 Q 15 4, 28 12 T 58 12" stroke="currentColor" strokeWidth="1" fill="none" />
    <ellipse cx="14" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-25 14 9)" />
    <ellipse cx="22" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(15 22 14)" />
    <ellipse cx="42" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-15 42 9)" />
    <ellipse cx="50" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(20 50 14)" />
  </svg>
);

const CampanaCarpinteria = () => {
  const [hammers, setHammers] = useState(1);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [campaign, setCampaign] = useState<KimunCampaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);

  const loadCampaign = (signal?: AbortSignal) =>
    fetchCampaigns(signal)
      .then((items) => {
        const found = items.find((c) => c.id === CAMPAIGN_ID) ?? items[0] ?? null;
        if (!found) throw new Error("Sin desafíos");
        setCampaign(found);
        setCampaignError(null);
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError")
          setCampaignError("No pudimos cargar el cómputo. Intenta nuevamente.");
      })
      .finally(() => setLoadingCampaign(false));

  useEffect(() => {
    const ctrl = new AbortController();
    loadCampaign(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  // Refresh tras volver de Flow (?paid=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1") return;
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      await loadCampaign();
      if (attempts < 6 && !cancelled) setTimeout(tick, 2500);
    };
    tick();
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    return () => {
      cancelled = true;
    };
  }, []);

  const total = hammers * HAMMER_PRICE;
  const goal = campaign?.goal ?? 0;
  const raised = campaign?.raised ?? 0;
  const progressPct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const totalHammers = goal > 0 ? Math.ceil(goal / HAMMER_PRICE) : 0;
  const hammersAchieved = Math.floor(raised / HAMMER_PRICE);
  const hammersLeft = Math.max(0, totalHammers - hammersAchieved);

  const dec = () => setHammers((h) => Math.max(1, h - 1));
  const inc = () => setHammers((h) => h + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (donating) return;
    setDonating(true);
    setDonateError(null);
    try {
      const { redirectUrl } = await createDonation({
        amount: total,
        campaignId: campaign?.id ?? CAMPAIGN_ID,
        name: name || "Donante",
        email: email || "donante@email.com",
      });
      window.location.href = redirectUrl;
    } catch {
      setDonating(false);
      setDonateError("No pudimos iniciar el pago. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-warm overflow-x-hidden flex flex-col">
      <SiteHeader />

      {/* Breadcrumb / volver */}
      <div className="px-4 sm:px-6 lg:px-10 pt-5 pb-1">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/campanas"
            className="inline-flex items-center gap-1.5 text-secondary font-hand text-[11px] tracking-widest hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CAMPAÑAS
          </Link>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: Header + Imagen + Métricas */}
      <section className="px-4 sm:px-6 lg:px-10 pt-3">
        <div className="max-w-3xl mx-auto bg-card rounded-[28px] shadow-card border border-border/50 overflow-hidden">
          {/* HEADER INTERNO */}
          <div className="p-5 sm:p-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-1.5 font-hand text-[11px] tracking-[0.22em] shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-primary-foreground" />
              CAMPAÑA DEL MES
            </div>

            {/* Título */}
            <div className="mt-4">
              <p className="font-display text-secondary uppercase text-xs sm:text-sm tracking-wide leading-tight">
                Creemos juntos un
              </p>
              <h1
                className="font-display text-secondary uppercase tracking-wide leading-[0.95] mt-1"
                style={{ fontSize: "clamp(28px, 8vw, 56px)", fontWeight: 700 }}
              >
                Taller de Carpintería
              </h1>
            </div>

            {/* Subtítulo con hojitas */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Leaflet className="w-6 h-3 text-secondary -scale-x-100" />
              <p
                className="font-display text-primary uppercase tracking-wide text-center"
                style={{ fontSize: "clamp(13px, 3.5vw, 18px)", fontWeight: 600 }}
              >
                Para toda la comunidad
              </p>
              <Leaflet className="w-6 h-3 text-secondary" />
            </div>
          </div>

          {/* IMAGEN */}
          <div className="px-5 sm:px-7">
            <div className="rounded-[20px] overflow-hidden">
              <img
                src={heroImg}
                alt="Taller de carpintería bajo un gran árbol"
                className="w-full h-auto object-cover aspect-[16/10]"
                width={1280}
                height={800}
              />
            </div>
          </div>

          {/* MÉTRICAS */}
          <div className="p-5 sm:p-7 pt-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-start">
              <div className="min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">META</p>
                <p
                  className="font-display text-primary mt-1 leading-none"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  {loadingCampaign ? "—" : formatCLP(goal)}
                </p>
              </div>
              <div className="border-l border-border/60 pl-2 sm:pl-4 min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">RECAUDADO</p>
                <p
                  className="font-display text-secondary mt-1 leading-none"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  {loadingCampaign ? "—" : formatCLP(raised)}
                </p>
              </div>
              <div className="border-l border-border/60 pl-2 sm:pl-4 min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">MARTILLOS</p>
                <p
                  className="font-display text-primary mt-1 leading-none flex items-center gap-1"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  <Hammer className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>{loadingCampaign ? "—" : hammersAchieved.toLocaleString("es-CL")}</span>
                </p>
                <p className="text-[11px] text-foreground/60 mt-1">
                  de {totalHammers.toLocaleString("es-CL")}
                </p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-5 flex items-center gap-3">
              <div className="relative flex-1 rounded-full bg-secondary-soft overflow-hidden" style={{ height: 14 }}>
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(progressPct, 4)}%` }}
                />
              </div>
              <span className="font-display text-secondary text-sm font-semibold tabular-nums shrink-0">
                {progressPct}%
              </span>
            </div>

            <p className="mt-3 text-center text-xs sm:text-sm text-foreground/75 inline-flex items-center justify-center gap-2 w-full">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
              {hammersLeft > 0
                ? `Faltan ${hammersLeft.toLocaleString("es-CL")} martillos para alcanzar el sueño`
                : "¡Sueño alcanzado! Gracias por tu aporte"}
            </p>
            {campaignError && (
              <p className="mt-2 text-xs text-destructive text-center">{campaignError}</p>
            )}
          </div>
        </div>
      </section>

      {/* MÓDULO DE DONACIÓN (inmediatamente después) */}
      <section className="px-4 sm:px-6 lg:px-10 mt-5">
        <div className="max-w-3xl mx-auto bg-primary-soft/70 rounded-[28px] shadow-card border border-primary/15 p-5 sm:p-7">
          <h2
            className="font-display text-secondary uppercase tracking-wide flex items-center gap-2"
            style={{ fontSize: "clamp(20px, 5.2vw, 30px)", fontWeight: 700 }}
          >
            Dona martillos solidarios
            <Hammer className="w-6 h-6 text-primary" />
          </h2>
          <p className="mt-2 text-sm text-foreground/80">
            Tu aporte hace posible este taller para niños, adultos y toda la comunidad.
          </p>

          <div className="mt-5 grid grid-cols-[auto_1fr] gap-4 sm:gap-5 items-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-card rounded-full px-2.5 py-2 border border-border/50 shadow-sm shrink-0">
              <button
                onClick={dec}
                aria-label="Quitar martillo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span
                className="font-display text-secondary tabular-nums w-8 sm:w-10 text-center"
                style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, lineHeight: 1 }}
              >
                {hammers}
              </span>
              <button
                onClick={inc}
                aria-label="Agregar martillo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="border-l border-border/50 pl-3 sm:pl-4 min-w-0">
              <p className="text-xs text-foreground/70">Estás aportando:</p>
              <p
                className="font-display text-primary leading-none mt-1"
                style={{ fontSize: "clamp(20px, 5.5vw, 32px)", fontWeight: 700 }}
              >
                {formatCLP(total)}
              </p>
              <p className="text-[11px] text-foreground/60 mt-1">
                {hammers} {hammers === 1 ? "martillo" : "martillos"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-4 font-hand text-sm sm:text-base tracking-[0.2em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            <Heart className="w-5 h-5 fill-primary-foreground" />
            DONA MARTILLOS SOLIDARIOS
          </button>
          <p className="mt-3 inline-flex items-center justify-center gap-2 text-xs text-foreground/70 w-full">
            <Lock className="w-3.5 h-3.5" /> Pago seguro con Flow
          </p>
        </div>
      </section>

      {/* CONTENIDO ADICIONAL */}
      <section className="px-4 sm:px-5 lg:px-12 mt-5 pb-10">
        <div className="max-w-3xl mx-auto bg-card rounded-[28px] shadow-card border border-border/50 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-secondary text-xl sm:text-2xl uppercase tracking-wide">
              Sobre este taller
            </h2>
          </div>
          <p className="font-display text-secondary text-lg sm:text-xl mt-3">
            Un espacio para aprender, crear, compartir y construir juntos.
          </p>
          <p className="mt-3 text-sm sm:text-base text-foreground/80 leading-relaxed">
            Este taller será para los niños de Kimün, y en las tardes estará abierto
            para toda la comunidad, especialmente para personas adultas mayores que
            quieran iniciarse o seguir creciendo en el oficio de la carpintería.
          </p>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <li className="flex flex-col items-start gap-2">
              <Heart className="w-7 h-7 text-primary" />
              <p className="font-hand text-xs tracking-widest text-secondary">PARA LOS NIÑOS</p>
              <p className="text-sm text-foreground/75 leading-snug">
                Aprender haciendo, desde pequeños.
              </p>
            </li>
            <li className="flex flex-col items-start gap-2">
              <Users className="w-7 h-7 text-primary" />
              <p className="font-hand text-xs tracking-widest text-secondary">PARA LA COMUNIDAD</p>
              <p className="text-sm text-foreground/75 leading-snug">
                Abierto a todas las edades.
              </p>
            </li>
            <li className="flex flex-col items-start gap-2">
              <Sprout className="w-7 h-7 text-secondary" />
              <p className="font-hand text-xs tracking-widest text-secondary">PARA EL FUTURO</p>
              <p className="text-sm text-foreground/75 leading-snug">
                Un oficio que transforma y conecta.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-secondary text-center leading-tight">
              Estás a un paso de donar tus martillos solidarios
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="bg-secondary-soft rounded-2xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Martillos</span>
                <span className="font-semibold text-foreground">{hammers}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-foreground/70">Total a donar</span>
                <span className="font-display text-primary text-xl">{formatCLP(total)}</span>
              </div>
            </div>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-hand text-xs tracking-widest text-foreground/70">NOMBRE</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-full border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
                placeholder="Tu nombre"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-hand text-xs tracking-widest text-foreground/70">EMAIL</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
                placeholder="tu@email.com"
              />
            </label>
            {donateError && (
              <p className="text-xs text-destructive text-center">{donateError}</p>
            )}
            <button
              type="submit"
              disabled={donating}
              className="mt-2 bg-primary text-primary-foreground rounded-full py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2"
            >
              {donating && <Loader2 className="w-4 h-4 animate-spin" />}
              {donating ? "REDIRIGIENDO…" : "CONTINUAR AL PAGO"}
            </button>
            <p className="text-[11px] text-foreground/60 text-center inline-flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" /> Pago seguro procesado por Flow
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampanaCarpinteria;
