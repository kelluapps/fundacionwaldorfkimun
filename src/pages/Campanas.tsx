import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, CalendarDays, Lock, MousePointerClick, Leaf } from "lucide-react";
import logo from "@/assets/logo-kimun.png";
import heroImg from "@/assets/anfiteatro-hero.jpg";
import aboutImg from "@/assets/anfiteatro-about.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEAT_PRICE = 9_000;
const GOAL = 50_000_000;
const RAISED = 12_450_000;
const SUPPORTERS = 138;
const DAYS_LEFT = 62;

// Pre-donated seats (fixed for demo so it doesn't change between renders)
const PRE_DONATED = new Set<string>([
  "A-0", "A-1", "A-9", "A-10",
  "B-0", "B-11",
  "C-1", "C-12",
  "D-0", "D-13", "D-2",
  "E-0", "E-1", "E-14", "E-15",
  "F-0", "F-1", "F-2", "F-15", "F-16",
  "G-0", "G-1", "G-2", "G-3", "G-16", "G-17",
]);

// Each row has growing number of seats (semicircular look)
const ROWS = [
  { id: "A", seats: 11 },
  { id: "B", seats: 12 },
  { id: "C", seats: 13 },
  { id: "D", seats: 14 },
  { id: "E", seats: 16 },
  { id: "F", seats: 17 },
  { id: "G", seats: 18 },
];

const Leaflet = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 24" className={className} aria-hidden="true">
    <path d="M2 12 Q 15 4, 28 12 T 58 12" stroke="currentColor" strokeWidth="1" fill="none" />
    <ellipse cx="14" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-25 14 9)" />
    <ellipse cx="22" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(15 22 14)" />
    <ellipse cx="42" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-15 42 9)" />
    <ellipse cx="50" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(20 50 14)" />
  </svg>
);

const formatCLP = (n: number) =>
  "$" + n.toLocaleString("es-CL");

const Campanas = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openThanks, setOpenThanks] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const totalSeats = selected.size;
  const totalAmount = totalSeats * SEAT_PRICE;
  const progressPct = Math.round((RAISED / GOAL) * 100);

  const toggleSeat = (id: string) => {
    if (PRE_DONATED.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    if (totalSeats === 0) return;
    setOpenCheckout(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenCheckout(false);
    setOpenThanks(true);
    setSelected(new Set());
    setName("");
    setEmail("");
  };

  // Build seat rows with semicircular curvature using simple offset
  const rowsRendered = useMemo(() => {
    return ROWS.map((row) => {
      const items = Array.from({ length: row.seats }, (_, i) => `${row.id}-${i}`);
      return { ...row, items };
    });
  }, []);

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
        <Link to="/" className="lg:hidden inline-flex items-center gap-1 text-secondary font-hand text-[11px] tracking-widest mt-2">
          <ArrowLeft className="w-3.5 h-3.5" /> VOLVER
        </Link>
      </header>

      {/* HERO + GOAL PANEL */}
      <section className="px-5 lg:px-12 pb-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* Hero */}
          <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden grid sm:grid-cols-[1.15fr_1fr] gap-0">
            <div className="p-6 lg:p-10 flex flex-col justify-center min-w-0">
              <h1 className="font-display text-secondary text-3xl sm:text-[2.25rem] lg:text-[2.75rem] xl:text-5xl uppercase leading-[1.1] tracking-wide break-words">
                Construyamos juntos el anfiteatro de Kimün
              </h1>
              <Leaflet className="w-12 h-5 text-secondary mt-4" />
              <p className="mt-5 text-foreground/80 text-base lg:text-[17px] leading-relaxed">
                Dona un asiento y sé parte de este espacio donde florecerá la comunidad,
                el arte y la educación.
              </p>
              <button
                onClick={() => document.getElementById("seats")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-7 self-start bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
              >
                DONA UN ASIENTO
              </button>
            </div>
            <div className="relative min-h-[260px] sm:min-h-full">
              <img
                src={heroImg}
                alt="Anfiteatro Kimün al aire libre"
                className="absolute inset-0 w-full h-full object-cover"
                width={1280}
                height={896}
              />
            </div>
          </div>

          {/* Goal panel */}
          <aside className="bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-8 flex flex-col gap-5">
            <div>
              <p className="font-hand text-[11px] tracking-[0.22em] text-foreground/60">META DE RECAUDACIÓN</p>
              <p className="font-display text-primary text-4xl lg:text-5xl mt-1">{formatCLP(GOAL)}</p>
            </div>
            <div>
              <p className="font-hand text-[11px] tracking-[0.22em] text-foreground/60">RECAUDADO HASTA AHORA</p>
              <p className="font-display text-primary text-3xl lg:text-4xl mt-1">{formatCLP(RAISED)}</p>
            </div>
            <div>
              <div className="h-3 w-full rounded-full bg-secondary-soft overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-right font-hand text-xs text-foreground/70 mt-1">{progressPct}%</p>
            </div>
            <div className="grid gap-4 pt-2 border-t border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary-soft flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-sm text-foreground/80 leading-snug">
                  <span className="font-semibold text-foreground">{SUPPORTERS} personas</span><br />
                  ya son parte
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary-soft flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-sm text-foreground/80 leading-snug">
                  Quedan <span className="font-semibold text-foreground">{DAYS_LEFT} días</span><br />
                  para alcanzar la meta
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SEAT SELECTION + SUMMARY */}
      <section id="seats" className="px-5 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* Amphitheater */}
          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-4 sm:p-6 lg:p-10 min-w-0 overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Leaflet className="w-10 h-4 text-secondary -scale-x-100" />
              <h2 className="font-display text-secondary text-2xl lg:text-3xl uppercase tracking-wide text-center">
                Dona un asiento del anfiteatro
              </h2>
              <Leaflet className="w-10 h-4 text-secondary" />
            </div>
            <p className="text-center text-sm text-foreground/70 inline-flex items-center gap-2 justify-center w-full mb-6">
              <MousePointerClick className="w-4 h-4 text-secondary" />
              Haz clic en los asientos que quieres donar
            </p>

            {/* Rows — fluid scaling, fits any width without horizontal scroll */}
            <div className="flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5 items-stretch w-full">
              {rowsRendered.map((row) => (
                <div key={row.id} className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                  <span className="font-hand text-[9px] sm:text-[10px] lg:text-xs tracking-widest text-foreground/60 w-8 sm:w-10 lg:w-12 shrink-0">
                    FILA {row.id}
                  </span>
                  <div
                    className="flex-1 min-w-0 grid justify-center gap-[2px] sm:gap-1.5 lg:gap-2"
                    style={{ gridTemplateColumns: `repeat(${row.seats}, minmax(0, 1fr))` }}
                  >
                    {row.items.map((id) => {
                      const isDonated = PRE_DONATED.has(id);
                      const isSelected = selected.has(id);
                      const base =
                        "aspect-square w-full max-w-[24px] mx-auto rounded-full transition-all duration-200";
                      const cls = isDonated
                        ? "bg-muted-foreground/40 cursor-not-allowed"
                        : isSelected
                        ? "bg-secondary scale-110 shadow-card cursor-pointer"
                        : "bg-tier-seed hover:scale-110 hover:bg-primary-soft cursor-pointer";
                      return (
                        <button
                          key={id}
                          aria-label={`Asiento ${id}${isDonated ? " (donado)" : isSelected ? " (seleccionado)" : ""}`}
                          onClick={() => toggleSeat(id)}
                          disabled={isDonated}
                          className={`${base} ${cls}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:gap-8 text-xs lg:text-sm text-foreground/75">
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-tier-seed border border-border" />
                Disponible
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-secondary" />
                Seleccionado
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-muted-foreground/40" />
                Donado
              </span>
            </div>
          </div>

          {/* Summary */}
          <aside className="bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-soft flex items-center justify-center mb-3">
              <span className="text-2xl">🪑</span>
            </div>
            <p className="text-sm text-foreground/70">Has seleccionado</p>
            <p className="font-display text-secondary text-5xl lg:text-6xl my-1">
              {totalSeats} <span className="text-3xl lg:text-4xl">asiento{totalSeats === 1 ? "" : "s"}</span>
            </p>
            <Leaflet className="w-12 h-4 text-secondary my-3" />

            <div className="w-full border-t border-border/50 pt-5 mt-2">
              <p className="text-sm text-foreground/70">Total a donar</p>
              <p className="font-display text-primary text-5xl lg:text-6xl mt-1">{formatCLP(totalAmount)}</p>
              <p className="text-xs text-foreground/60 font-hand tracking-wider mt-1">
                {formatCLP(SEAT_PRICE)} por asiento
              </p>
            </div>

            <button
              onClick={handleContinue}
              disabled={totalSeats === 0}
              className="mt-6 w-full bg-primary text-primary-foreground rounded-full py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
            >
              CONTINUAR
            </button>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-foreground/60">
              <Lock className="w-3.5 h-3.5" />
              Pago 100% seguro
            </p>
          </aside>
        </div>
      </section>

      {/* ABOUT + IMPACT */}
      <section className="px-5 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-9">
            <h3 className="font-display text-secondary text-2xl lg:text-3xl uppercase tracking-wide">
              Sobre este proyecto
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              El Anfiteatro Kimün será un espacio al aire libre para encuentros, obras de
              teatro, música, ceremonias y clases. Un lugar donde la comunidad se reúne
              para aprender, crear y celebrar la vida.
            </p>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              Con tu aporte, construimos juntos este espacio vivo que quedará para las
              futuras generaciones.
            </p>
            <img
              src={aboutImg}
              alt="Render acuarela del anfiteatro Kimün"
              className="rounded-2xl w-full h-auto mt-6"
              loading="lazy"
              width={1024}
              height={640}
            />
          </div>

          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-9">
            <h3 className="font-display text-secondary text-2xl lg:text-3xl uppercase tracking-wide">
              Tu aporte genera impacto
            </h3>
            <ul className="mt-5 flex flex-col gap-5">
              {[
                { icon: "👥", t: "Fortalece la educación Waldorf y el aprendizaje vivencial." },
                { icon: "🌱", t: "Crea espacios para el arte, la cultura y la comunidad." },
                { icon: "❤️", t: "Deja un legado para las futuras generaciones." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-foreground/80 leading-relaxed pt-1.5">{item.t}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-secondary-soft rounded-2xl p-5 flex items-start gap-3">
              <Leaf className="w-5 h-5 text-secondary mt-1 shrink-0" />
              <p className="font-body text-foreground/85 leading-relaxed">
                Cada asiento cuenta.<br />
                Cada aporte transforma.<br />
                Gracias por ser parte de este sueño.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY BAR */}
      <section className="px-5 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Leaf className="w-6 h-6 text-secondary shrink-0 mt-1" />
            <div>
              <p className="font-hand text-xs tracking-[0.22em] text-foreground/70">TRANSPARENCIA TOTAL</p>
              <p className="text-sm text-foreground/75 mt-1">
                Te mantendremos informado del avance del proyecto y uso de los fondos.
              </p>
            </div>
          </div>
          <button className="border border-secondary/50 text-secondary rounded-full px-6 py-3 font-hand text-xs tracking-[0.22em] hover:bg-secondary-soft transition-all">
            VER AVANCE DE LA CAMPAÑA
          </button>
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl lg:text-3xl text-secondary text-center leading-tight">
              Estás donando {totalSeats} {totalSeats === 1 ? "asiento" : "asientos"} del anfiteatro
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="bg-secondary-soft rounded-2xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Asientos</span>
                <span className="font-semibold text-foreground">{totalSeats}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-foreground/70">Total a donar</span>
                <span className="font-display text-primary text-xl">{formatCLP(totalAmount)}</span>
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
            <button
              type="submit"
              className="mt-2 bg-primary text-primary-foreground rounded-full py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all"
            >
              APORTAR
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* THANKS MODAL */}
      <Dialog open={openThanks} onOpenChange={setOpenThanks}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl text-center">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-secondary leading-tight">
              Gracias por ser parte de este anfiteatro 🌳
            </DialogTitle>
          </DialogHeader>
          <p className="text-foreground/75 pt-2">
            Tu aporte ayuda a construir un espacio donde la comunidad florece.
          </p>
          <button
            onClick={() => setOpenThanks(false)}
            className="mt-3 bg-primary text-primary-foreground rounded-full px-8 py-3 font-hand text-sm tracking-[0.22em] hover:bg-primary/90 transition-all mx-auto"
          >
            VOLVER
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campanas;
