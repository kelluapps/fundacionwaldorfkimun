import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Hammer,
  Heart,
  Loader2,
  Lock,
  Minus,
  Plus,
  Sprout,
  TreePine,
  Users,
  Wrench,
} from "lucide-react";
import logo from "@/assets/logo-kimun.png";
import heroImg from "@/assets/carpinteria-hero.jpg";
import hoyImg from "@/assets/carpinteria-hoy.jpg";
import mananaImg from "@/assets/carpinteria-manana.jpg";
import comunidadImg from "@/assets/carpinteria-comunidad.jpg";
import toolboxImg from "@/assets/carpinteria-toolbox.png";
import plantTagImg from "@/assets/carpinteria-plant-tag.png";
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
  const [hammers, setHammers] = useState(2);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [campaign, setCampaign] = useState<KimunCampaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCampaigns(ctrl.signal)
      .then((items) => {
        const found =
          items.find((c) => c.id === CAMPAIGN_ID) ?? items[0] ?? null;
        if (!found) throw new Error("Sin desafíos");
        setCampaign(found);
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError")
          setCampaignError("No pudimos cargar el cómputo. Intenta nuevamente.");
      })
      .finally(() => setLoadingCampaign(false));
    return () => ctrl.abort();
  }, []);

  const total = hammers * HAMMER_PRICE;
  const goal = campaign?.goal ?? 0;
  const raised = campaign?.raised ?? 0;
  const progressPct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const remaining = Math.max(0, goal - raised);
  const totalHammers = goal > 0 ? Math.ceil(goal / HAMMER_PRICE) : 0;
  const hammersLeft = Math.ceil(remaining / HAMMER_PRICE);

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
    } catch (err) {
      setDonating(false);
      setDonateError("No pudimos iniciar el pago. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-warm overflow-x-hidden">
      {/* HEADER */}
      <header className="relative z-20 px-5 lg:px-12 pt-5 pb-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Waldorf Kimún" className="h-20 lg:h-24 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-7 font-hand text-[13px] tracking-[0.18em] text-foreground/80">
            <Link to="/" className="hover:text-primary transition-colors">EL SUEÑO</Link>
            <Link to="/campanas" className="text-primary border-b-2 border-primary pb-1">CAMPAÑAS</Link>
          </nav>
          <a
            href="/"
            className="bg-primary text-primary-foreground rounded-full px-5 lg:px-7 py-2.5 lg:py-3 font-hand text-[11px] lg:text-xs tracking-[0.2em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          >
            QUIERO SER PARTE
          </a>
        </div>
        <Link
          to="/campanas"
          className="inline-flex items-center gap-1 text-secondary font-hand text-[11px] tracking-widest mt-3 lg:mt-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> VOLVER A CAMPAÑAS
        </Link>
      </header>

      {/* HERO */}
      <section className="px-5 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden grid lg:grid-cols-[1fr_1.1fr]">
          <div className="p-6 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div className="self-start bg-primary text-primary-foreground rounded-full px-5 py-1.5 font-hand text-[10px] lg:text-[11px] tracking-[0.22em] shadow-card">
              CAMPAÑA DEL MES DE MAYO
            </div>
            <p className="font-display text-secondary uppercase text-2xl lg:text-3xl mt-4 tracking-wide">
              Creemos juntos un
            </p>
            <h1 className="font-display text-secondary text-5xl sm:text-6xl lg:text-[5.5rem] uppercase leading-[0.95] tracking-wide mt-1">
              Taller de<br />Carpintería
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <Leaflet className="w-8 h-4 text-secondary -scale-x-100" />
              <p className="font-display text-primary text-xl lg:text-2xl uppercase tracking-wide">
                Para toda la comunidad
              </p>
              <Leaflet className="w-8 h-4 text-secondary" />
            </div>
            <p className="mt-6 text-foreground/85 text-base lg:text-lg leading-relaxed max-w-md">
              Un espacio para aprender, crear, compartir y construir juntos.
            </p>
            <p className="mt-4 text-sm lg:text-[15px] text-foreground/75 leading-relaxed max-w-lg">
              Este taller será para los niños de Kimün, y en las tardes estará abierto
              para toda la comunidad, especialmente para personas adultas mayores que
              quieran iniciarse o seguir creciendo en el oficio de la carpintería.
            </p>
          </div>
          <div className="relative min-h-[260px] lg:min-h-full order-1 lg:order-2">
            <img
              src={heroImg}
              alt="Taller de carpintería bajo un gran árbol"
              className="absolute inset-0 w-full h-full object-cover"
              width={1280}
              height={960}
            />
            {/* Badge esquina */}
            <div className="hidden lg:flex absolute bottom-5 right-5 w-32 h-32 rounded-full bg-card/95 backdrop-blur shadow-card border border-border/50 flex-col items-center justify-center text-center font-hand text-[10px] tracking-[0.18em] text-secondary p-3">
              <span>SÉ PARTE DE</span>
              <Leaflet className="w-7 h-3 text-secondary my-1" />
              <span className="font-display text-primary text-base tracking-wide normal-case">NUESTRO<br />SUEÑO</span>
              <Heart className="w-3 h-3 text-primary mt-1 fill-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* META + HOY/MAÑANA */}
      <section className="px-5 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-5 lg:p-8 grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-8 items-center">
          {/* Meta */}
          <div>
            <h3 className="font-display text-secondary text-2xl lg:text-3xl uppercase tracking-wide">
              Nuestro sueño
            </h3>
            <p className="mt-3 text-sm lg:text-[15px] text-foreground/80 leading-relaxed">
              Transformemos este espacio en un taller de carpintería seguro, hermoso
              y equipado para el aprendizaje y la creación.
            </p>
            <p className="font-hand text-[11px] tracking-[0.22em] text-foreground/60 mt-5">META</p>
            <p className="font-display text-primary text-4xl lg:text-5xl mt-1">
              {loadingCampaign ? "—" : formatCLP(goal)}
            </p>
            <div className="mt-3 h-2.5 w-full rounded-full bg-secondary-soft overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-foreground/75">
              <span>
                {loadingCampaign ? "Cargando último cómputo…" : `${formatCLP(raised)} recaudado`}
              </span>
              {!loadingCampaign && (
                <span className="font-semibold text-primary">{progressPct}% de la meta</span>
              )}
            </div>
            {campaignError && (
              <p className="mt-2 text-xs text-destructive">{campaignError}</p>
            )}
          </div>

          {/* Hoy / Mañana */}
          <div className="grid grid-cols-2 gap-3 lg:gap-5 relative">
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-secondary text-secondary-foreground rounded-full px-5 py-1 font-hand text-[10px] tracking-[0.22em] shadow-card">
                HOY
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/50">
                <img
                  src={hoyImg}
                  alt="Taller actualmente"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-secondary text-secondary-foreground rounded-full px-5 py-1 font-hand text-[10px] tracking-[0.22em] shadow-card">
                MAÑANA
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-border/50">
                <img
                  src={mananaImg}
                  alt="Taller transformado"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>
            {/* Flecha de transformación */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-card rounded-full p-1.5 shadow-card border border-border/50">
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* MARTILLOS — INFO */}
      <section className="px-5 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-5 lg:p-7 grid md:grid-cols-3 gap-5 lg:gap-7">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary-soft flex items-center justify-center shrink-0">
              <Hammer className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pt-1">
              <span className="font-semibold text-foreground">Cada martillo suma</span> para construir este sueño.
              Con tu aporte, equipamos, mejoramos y damos vida a un taller que formará, conectará y transformará.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-primary fill-primary" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pt-1">
              Cada martillo solidario<br />
              vale <span className="font-display text-primary text-lg">{formatCLP(HAMMER_PRICE)}</span>
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary-soft flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pt-1">
              Para alcanzar la meta necesitamos{" "}
              <span className="font-display text-primary text-lg">
                {totalHammers > 0 ? totalHammers.toLocaleString("es-CL") : "—"}
              </span>
              <br />
              <span className="text-primary">martillos solidarios</span>
              {hammersLeft > 0 && totalHammers > 0 && (
                <span className="block text-xs text-foreground/60 mt-1">
                  Faltan {hammersLeft.toLocaleString("es-CL")}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* CONTADOR */}
      <section className="px-5 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-5 lg:p-7 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
          <div className="hidden md:block">
            <img src={toolboxImg} alt="Caja de herramientas" className="w-32 lg:w-40 h-auto" />
          </div>

          <div className="text-center">
            <h3 className="font-display text-secondary text-xl lg:text-2xl uppercase tracking-wide">
              Elige cuántos martillos quieres aportar
            </h3>
            <div className="mt-5 inline-flex items-center gap-5 lg:gap-7 bg-background/60 rounded-full px-4 py-2 border border-border/50">
              <button
                onClick={dec}
                aria-label="Quitar martillo"
                className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Hammer className="w-7 h-7 text-secondary" />
                <span className="font-display text-secondary text-4xl lg:text-5xl tabular-nums">{hammers}</span>
              </div>
              <button
                onClick={inc}
                aria-label="Agregar martillo"
                className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-3 text-sm lg:text-base text-foreground/80">
              Estás aportando: <span className="font-display text-primary text-xl lg:text-2xl">{formatCLP(total)}</span>
            </p>
          </div>

          <div className="bg-primary-soft/60 rounded-2xl p-5 text-center md:max-w-[220px]">
            <Heart className="w-6 h-6 text-primary fill-primary mx-auto mb-2" />
            <p className="font-hand text-[11px] tracking-[0.22em] text-primary">TU APORTE HACE POSIBLE</p>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
              este espacio de aprendizaje, creación y comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* CON TU APORTE */}
      <section className="px-5 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-5 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="flex items-center justify-center gap-3">
              <Leaflet className="w-10 h-4 text-secondary -scale-x-100" />
              <h3 className="font-display text-secondary text-xl lg:text-2xl uppercase tracking-wide text-center">
                Con tu aporte, esto será posible
              </h3>
              <Leaflet className="w-10 h-4 text-secondary" />
            </div>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {[
                { icon: <TreePine className="w-7 h-7 text-secondary" />, t: "Un espacio seguro y acogedor para aprender y crear." },
                { icon: <Wrench className="w-7 h-7 text-primary" />, t: "Herramientas y materiales de calidad para todos." },
                { icon: <Users className="w-7 h-7 text-secondary" />, t: "Talleres para niños, jóvenes y adultos mayores." },
                { icon: <Heart className="w-7 h-7 text-primary fill-primary" />, t: "Comunidad, encuentro y crecimiento a través del hacer." },
              ].map((it, i) => (
                <li key={i} className="text-center flex flex-col items-center gap-2">
                  {it.icon}
                  <p className="text-xs lg:text-sm text-foreground/80 leading-snug">{it.t}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block bg-secondary-soft/60 rounded-2xl p-5 max-w-[220px] text-center border border-secondary/20">
            <p className="font-display text-secondary italic text-lg leading-snug">
              "Cuando construimos juntos, construimos futuro."
            </p>
            <Heart className="w-5 h-5 text-primary fill-primary mx-auto mt-3" />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto rounded-3xl shadow-card border border-border/50 overflow-hidden bg-secondary text-secondary-foreground relative grid lg:grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-6 p-5 lg:p-7">
          <img
            src={comunidadImg}
            alt="Comunidad creando juntos"
            className="hidden lg:block w-44 h-44 object-cover rounded-2xl border-4 border-secondary-foreground/10"
            loading="lazy"
            width={400}
            height={400}
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-secondary-foreground/70">»</span>
              <p className="font-display text-secondary-foreground text-2xl lg:text-3xl uppercase tracking-wide">
                Haz tu aporte hoy
              </p>
              <span className="text-secondary-foreground/70">«</span>
            </div>
            <p className="text-sm lg:text-base text-secondary-foreground/85 mb-4">
              Cada martillo nos acerca a construir este taller para toda la comunidad.
            </p>
            <button
              onClick={() => setOpenCheckout(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 lg:px-9 py-3.5 font-hand text-xs lg:text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
            >
              <Heart className="w-4 h-4 fill-primary-foreground" />
              DONA MARTILLOS SOLIDARIOS
            </button>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-secondary-foreground/75">
              <Lock className="w-3.5 h-3.5" /> Aporte seguro y transparente
            </p>
          </div>
          <img
            src={plantTagImg}
            alt="Pequeño brote"
            className="hidden lg:block w-32 h-32 object-contain"
            loading="lazy"
            width={300}
            height={300}
          />
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl lg:text-3xl text-secondary text-center leading-tight">
              Estás donando {hammers} {hammers === 1 ? "martillo" : "martillos"} solidario{hammers === 1 ? "" : "s"}
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
              {donating ? "REDIRIGIENDO…" : "APORTAR"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampanaCarpinteria;
