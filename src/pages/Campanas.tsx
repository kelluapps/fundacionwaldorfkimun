import { Link } from "react-router-dom";
import { Users, CalendarDays, Leaf } from "lucide-react";
import ActiveChallenge from "@/components/ActiveChallenge";
import logo from "@/assets/logo-kimun.png";
import heroImg from "@/assets/campanas-hero.jpg";
import anfiteatroImg from "@/assets/anfiteatro-hero.jpg";
import carpinteriaImg from "@/assets/carpinteria-hero.jpg";
import reforestacionImg from "@/assets/campana-reforestacion.jpg";
import huertoImg from "@/assets/campana-huerto.jpg";

type Campaign = {
  key: string;
  name: string;
  description: string;
  image: string;
  status: "active" | "soon";
  href?: string;
  raised?: number;
  goal?: number;
  supporters?: number;
  daysLeft?: number;
};

const campaigns: Campaign[] = [
  {
    key: "anfiteatro",
    name: "Anfiteatro Kimün",
    description: "Un espacio al aire libre para encuentros, arte, ceremonias y aprendizaje en comunidad.",
    image: anfiteatroImg,
    status: "active",
    href: "/campanas/anfiteatro",
    raised: 12_450_000,
    goal: 50_000_000,
    supporters: 138,
    daysLeft: 62,
  },
  {
    key: "carpinteria",
    name: "Taller de Carpintería",
    description: "Un taller para aprender, crear y compartir oficios que perduran generaciones.",
    image: carpinteriaImg,
    status: "active",
    href: "/campanas/carpinteria",
    raised: 1_250_000,
    goal: 5_000_000,
    supporters: 47,
    daysLeft: 30,
  },
  {
    key: "reforestacion",
    name: "Reforestación Kimün",
    description: "Planta un árbol, regala vida y ayuda a restaurar nuestros bosques nativos.",
    image: reforestacionImg,
    status: "soon",
  },
  {
    key: "huerto",
    name: "Huerto Kimün",
    description: "Un huerto educativo para cultivar alimentos sanos, conexión y aprendizaje vivo.",
    image: huertoImg,
    status: "soon",
  },
];

const formatCLP = (n: number) => "$" + n.toLocaleString("es-CL");

const Leaflet = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 24" className={className} aria-hidden="true">
    <path d="M2 12 Q 15 4, 28 12 T 58 12" stroke="currentColor" strokeWidth="1" fill="none" />
    <ellipse cx="14" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-25 14 9)" />
    <ellipse cx="22" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(15 22 14)" />
    <ellipse cx="42" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-15 42 9)" />
    <ellipse cx="50" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(20 50 14)" />
  </svg>
);

const CampaignCard = ({ c }: { c: Campaign }) => {
  const isActive = c.status === "active";
  const progressPct = isActive && c.raised && c.goal ? Math.round((c.raised / c.goal) * 100) : 0;

  return (
    <article className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden flex flex-col">
      <div className="relative p-3">
        <div className="rounded-2xl overflow-hidden aspect-[16/10]">
          <img
            src={c.image}
            alt={c.name}
            className={`w-full h-full object-cover ${isActive ? "" : "opacity-80"}`}
            loading="lazy"
          />
        </div>
        {!isActive && (
          <span className="absolute top-5 right-5 bg-secondary text-secondary-foreground rounded-full px-4 py-1.5 font-hand text-[10px] tracking-[0.22em] shadow-card">
            PRONTO
          </span>
        )}
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        <h3 className="font-display text-secondary text-2xl uppercase tracking-wide text-center">
          {c.name}
        </h3>
        <p className="mt-3 text-sm text-foreground/75 text-center leading-relaxed">
          {c.description}
        </p>

        {isActive ? (
          <>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">RECAUDADO</p>
                <p className="font-display text-primary text-2xl mt-0.5">{formatCLP(c.raised!)}</p>
              </div>
              <div className="text-right">
                <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">META</p>
                <p className="text-foreground/80 text-base mt-0.5">{formatCLP(c.goal!)}</p>
              </div>
            </div>
            <div className="mt-3 h-2.5 w-full rounded-full bg-secondary-soft overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground/75">
              <span className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                <span><span className="font-semibold text-foreground">{c.supporters}</span> personas ya son parte</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-secondary" />
                <span><span className="font-semibold text-foreground">{c.daysLeft}</span> días restantes</span>
              </span>
            </div>
            <Link
              to={c.href!}
              className="mt-5 self-stretch text-center border border-secondary/50 text-secondary rounded-full px-6 py-3 font-hand text-xs tracking-[0.22em] hover:bg-secondary-soft transition-all"
            >
              VER CAMPAÑA
            </Link>
          </>
        ) : (
          <div className="mt-auto pt-6">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full text-center border border-border text-foreground/50 bg-muted/40 rounded-full px-6 py-3 font-hand text-xs tracking-[0.22em] cursor-not-allowed"
            >
              PRÓXIMAMENTE
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

const Campanas = () => {
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
            <span className="text-primary border-b-2 border-primary pb-1">CAMPAÑAS</span>
          </nav>
          <a
            href="/"
            className="bg-primary text-primary-foreground rounded-full px-5 lg:px-7 py-2.5 lg:py-3 font-hand text-[11px] lg:text-xs tracking-[0.2em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          >
            QUIERO SER PARTE
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden grid sm:grid-cols-[1fr_1.4fr] gap-0">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <h1 className="font-display text-secondary text-5xl lg:text-6xl uppercase tracking-wide leading-none">
              Campañas
            </h1>
            <Leaflet className="w-14 h-5 text-secondary mt-4" />
            <p className="mt-6 text-foreground/80 text-base lg:text-lg leading-relaxed max-w-md">
              Cada aporte siembra futuro. Elige una campaña y sé parte de los proyectos
              que transforman vidas y construyen comunidad.
            </p>
          </div>
          <div className="relative min-h-[240px] sm:min-h-full">
            <img
              src={heroImg}
              alt="Niños en círculo alrededor de un gran árbol"
              className="absolute inset-0 w-full h-full object-cover"
              width={1280}
              height={576}
            />
          </div>
        </div>
      </section>

      {/* PROYECTOS ACTIVOS */}
      <section className="px-5 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Leaflet className="w-12 h-5 text-secondary -scale-x-100" />
            <h2 className="font-display text-secondary text-3xl lg:text-4xl uppercase tracking-wide text-center">
              Proyectos activos
            </h2>
            <Leaflet className="w-12 h-5 text-secondary" />
          </div>
          <p className="text-center text-foreground/75 max-w-3xl mx-auto leading-relaxed mb-10">
            Con tu apoyo, hacemos posible espacios donde la educación, la naturaleza y
            la comunidad florecen juntas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
            {campaigns.map((c) => (
              <CampaignCard key={c.key} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <section className="px-5 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Leaf className="w-6 h-6 text-secondary shrink-0 mt-1" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              Cada campaña es una semilla de cambio.<br />
              Tu aporte hoy, florece en el futuro.
            </p>
          </div>
          <a
            href="/"
            className="bg-primary text-primary-foreground rounded-full px-7 py-3 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            QUIERO SER PARTE
          </a>
        </div>
      </section>
    </div>
  );
};

export default Campanas;
