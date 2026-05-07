import { useEffect, useMemo, useState } from "react";
import {
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
import { formatCLP, fetchCampaigns } from "@/lib/kimun-api";
import { useActiveCampaign, ICON_REGISTRY } from "@/lib/campaigns";
import DonationModal from "@/components/DonationModal";

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
  const campaign = useActiveCampaign();
  const [units, setUnits] = useState(1);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [remoteRaised, setRemoteRaised] = useState<number | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(true);

  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);

  const UnitIcon = useMemo(
    () => (campaign ? ICON_REGISTRY[campaign.unitIcon]?.Icon ?? ICON_REGISTRY.heart.Icon : ICON_REGISTRY.heart.Icon),
    [campaign],
  );

  const loadRemote = (signal?: AbortSignal) =>
    fetchCampaigns(signal)
      .then((items) => {
        if (!campaign) return;
        const remoteId = campaign.remoteCampaignId || campaign.id;
        const found = items.find((c) => c.id === remoteId);
        setRemoteRaised(found?.raised ?? campaign.raised);
      })
      .catch(() => {
        if (campaign) setRemoteRaised(campaign.raised);
      })
      .finally(() => setLoadingRemote(false));

  useEffect(() => {
    setLoadingRemote(true);
    const ctrl = new AbortController();
    loadRemote(ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id]);

  // Refresh tras volver de Flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1") return;
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      await loadRemote();
      if (attempts < 6 && !cancelled) setTimeout(tick, 2500);
    };
    tick();
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-warm flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center text-foreground/60">
          No hay campaña activa.
        </div>
        <SiteFooter />
      </div>
    );
  }

  const unitAmount = campaign.unitAmount;
  const total = units * unitAmount;
  const goal = campaign.goal;
  const raised = remoteRaised ?? campaign.raised;
  const progressPct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const totalUnits = unitAmount > 0 ? Math.ceil(goal / unitAmount) : 0;
  const unitsAchieved = unitAmount > 0 ? Math.floor(raised / unitAmount) : 0;
  const unitsLeft = Math.max(0, totalUnits - unitsAchieved);

  const unitWord = (n: number) => (n === 1 ? campaign.unitSingular : campaign.unitPlural);
  const heroSrc = campaign.imageUrl || heroImg;

  const dec = () => setUnits((h) => Math.max(1, h - 1));
  const inc = () => setUnits((h) => h + 1);


  return (
    <div className="min-h-screen bg-warm overflow-x-hidden flex flex-col">
      <SiteHeader />

      <section className="px-4 sm:px-6 lg:px-10 pt-5">
        <div className="max-w-3xl mx-auto bg-card rounded-[28px] shadow-card border border-border/50 overflow-hidden">
          <div className="p-5 sm:p-7">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-1.5 font-hand text-[11px] tracking-[0.22em] shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-primary-foreground" />
              {campaign.badge.toUpperCase()}
            </div>

            <div className="mt-4">
              <p className="font-display text-secondary uppercase text-xs sm:text-sm tracking-wide leading-tight">
                {campaign.preTitle}
              </p>
              <h1
                className="font-display text-secondary uppercase tracking-wide leading-[0.95] mt-1"
                style={{ fontSize: "clamp(28px, 8vw, 56px)", fontWeight: 700 }}
              >
                {campaign.title}
              </h1>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <Leaflet className="w-6 h-3 text-secondary -scale-x-100" />
              <p
                className="font-display text-primary uppercase tracking-wide text-center"
                style={{ fontSize: "clamp(13px, 3.5vw, 18px)", fontWeight: 600 }}
              >
                {campaign.subtitle}
              </p>
              <Leaflet className="w-6 h-3 text-secondary" />
            </div>
          </div>

          <div className="px-5 sm:px-7">
            <div className="rounded-[20px] overflow-hidden">
              <img
                src={heroSrc}
                alt={campaign.title}
                className="w-full h-auto object-cover aspect-[16/10]"
                width={1280}
                height={800}
              />
            </div>
          </div>

          <div className="p-5 sm:p-7 pt-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-start">
              <div className="min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">META</p>
                <p
                  className="font-display text-primary mt-1 leading-none"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  {formatCLP(goal)}
                </p>
              </div>
              <div className="border-l border-border/60 pl-2 sm:pl-4 min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">RECAUDADO</p>
                <p
                  className="font-display text-secondary mt-1 leading-none"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  {loadingRemote ? "—" : formatCLP(raised)}
                </p>
              </div>
              <div className="border-l border-border/60 pl-2 sm:pl-4 min-w-0">
                <p className="font-hand text-[10px] tracking-[0.18em] text-foreground/60">
                  {campaign.unitPlural.toUpperCase()}
                </p>
                <p
                  className="font-display text-primary mt-1 leading-none flex items-center gap-1"
                  style={{ fontSize: "clamp(15px, 4.2vw, 26px)", fontWeight: 700 }}
                >
                  <UnitIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>{loadingRemote ? "—" : unitsAchieved.toLocaleString("es-CL")}</span>
                </p>
                <p className="text-[11px] text-foreground/60 mt-1">
                  de {totalUnits.toLocaleString("es-CL")}
                </p>
              </div>
            </div>

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
              {unitsLeft > 0
                ? `Faltan ${unitsLeft.toLocaleString("es-CL")} ${campaign.unitPlural} para alcanzar el sueño`
                : "¡Sueño alcanzado! Gracias por tu aporte"}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10 mt-5">
        <div className="max-w-3xl mx-auto bg-primary-soft/70 rounded-[28px] shadow-card border border-primary/15 p-5 sm:p-7">
          <h2
            className="font-display text-secondary uppercase tracking-wide flex items-center gap-2"
            style={{ fontSize: "clamp(20px, 5.2vw, 30px)", fontWeight: 700 }}
          >
            Dona {campaign.unitPlural} solidarios
            <UnitIcon className="w-6 h-6 text-primary" />
          </h2>
          <p className="mt-2 text-sm text-foreground/80">
            {campaign.shortDescription}
          </p>

          <div className="mt-5 grid grid-cols-[auto_1fr] gap-4 sm:gap-5 items-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-card rounded-full px-2.5 py-2 border border-border/50 shadow-sm shrink-0">
              <button
                onClick={dec}
                aria-label={`Quitar ${campaign.unitSingular}`}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span
                className="font-display text-secondary tabular-nums w-8 sm:w-10 text-center"
                style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, lineHeight: 1 }}
              >
                {units}
              </span>
              <button
                onClick={inc}
                aria-label={`Agregar ${campaign.unitSingular}`}
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
                {units} {unitWord(units)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-4 font-hand text-sm sm:text-base tracking-[0.2em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            <Heart className="w-5 h-5 fill-primary-foreground" />
            DONA {campaign.unitPlural.toUpperCase()} SOLIDARIOS
          </button>
          <p className="mt-3 inline-flex items-center justify-center gap-2 text-xs text-foreground/70 w-full">
            <Lock className="w-3.5 h-3.5" /> Pago seguro con Flow
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10 mt-5 pb-12 flex-1">
        <div className="max-w-3xl mx-auto bg-card rounded-[28px] shadow-card border border-border/50 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-secondary text-xl sm:text-2xl uppercase tracking-wide">
              Sobre esta campaña
            </h2>
          </div>
          <p className="font-display text-secondary text-lg sm:text-xl mt-3">
            {campaign.shortDescription}
          </p>
          <p className="mt-3 text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
            {campaign.longDescription}
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
                Una causa que transforma y conecta.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <DonationModal
        open={openCheckout}
        onOpenChange={setOpenCheckout}
        campaign={campaign}
        units={units}
      />

      <SiteFooter />
    </div>
  );
};

export default CampanaCarpinteria;
