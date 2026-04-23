import { useState } from "react";
import { Menu, X, Heart, Instagram, Facebook, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo-kimun.png";
import heroTree from "@/assets/hero-tree.png";
import seedImg from "@/assets/card-seed.png";
import sproutImg from "@/assets/card-sprout.png";
import branchImg from "@/assets/card-branch.png";
import leafImg from "@/assets/card-leaf.png";
import fruitImg from "@/assets/card-fruit.png";
import communityImg from "@/assets/community.png";
import testimonialImg from "@/assets/testimonial.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type Tier = {
  key: string;
  name: string;
  description: string;
  price: string;
  cta: string;
  image: string;
  tint: string;
  titleColor: string;
  buttonVariant: "ghost" | "soft" | "solid";
};

const tiers: Tier[] = [
  {
    key: "semilla",
    name: "SEMILLA",
    description: "Todo gran sueño comienza con una semilla.",
    price: "$5.000",
    cta: "SER SEMILLA",
    image: seedImg,
    tint: "bg-tier-seed",
    titleColor: "text-primary",
    buttonVariant: "ghost",
  },
  {
    key: "brote",
    name: "BROTE",
    description: "Damos los primeros pasos y algo comienza a crecer.",
    price: "$10.000",
    cta: "SER BROTE",
    image: sproutImg,
    tint: "bg-tier-sprout",
    titleColor: "text-primary",
    buttonVariant: "soft",
  },
  {
    key: "rama",
    name: "RAMA",
    description: "Nos expandimos y fortalecemos este sueño juntos.",
    price: "$15.000",
    cta: "SER RAMA",
    image: branchImg,
    tint: "bg-tier-branch",
    titleColor: "text-primary",
    buttonVariant: "soft",
  },
  {
    key: "hoja",
    name: "HOJA",
    description: "Damos vida, energía y color a este proyecto.",
    price: "$20.000",
    cta: "SER HOJA",
    image: leafImg,
    tint: "bg-tier-leaf",
    titleColor: "text-primary",
    buttonVariant: "soft",
  },
  {
    key: "fruto",
    name: "FRUTO",
    description: "El fruto es el impacto que dejamos en la comunidad.",
    price: "$25.000+",
    cta: "SER FRUTO",
    image: fruitImg,
    tint: "bg-tier-fruit",
    titleColor: "text-primary",
    buttonVariant: "solid",
  },
];

const navItems = [
  { label: "EL SUEÑO", href: "/" },
  { label: "CAMPAÑAS", href: "/campanas" },
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

const TierButton = ({
  variant,
  children,
  onClick,
}: {
  variant: Tier["buttonVariant"];
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const base =
    "w-full rounded-full px-5 py-2.5 text-xs font-hand tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5";
  const styles = {
    ghost: "border border-secondary/40 text-secondary hover:bg-secondary-soft",
    soft: "border border-primary/30 text-primary hover:bg-primary-soft",
    solid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
  } as const;
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};

const Index = () => {
  const [open, setOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSelect = (name?: string) => {
    setSelectedTier(name ?? null);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-warm overflow-x-hidden">
      {/* HEADER */}
      <header className="relative z-20 px-5 lg:px-12 pt-5 pb-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Mobile: hamburger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger aria-label="Abrir menú" className="p-2 text-primary">
                <Menu className="w-7 h-7" strokeWidth={1.5} />
              </SheetTrigger>
              <SheetContent side="left" className="bg-background border-border">
                <nav className="flex flex-col gap-6 mt-12 font-hand text-lg tracking-wider text-foreground">
                  {navItems.map((n) => (
                    <a key={n.href} href={n.href} className="hover:text-primary transition-colors">
                      {n.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: logo left + nav */}
          <div className="hidden lg:flex items-center gap-10 flex-1">
            <a href="#" className="shrink-0">
              <img src={logo} alt="Waldorf Kimún" className="h-24 w-auto" />
            </a>
            <nav className="flex items-center gap-7 font-hand text-[13px] tracking-[0.18em] text-foreground/80">
              {navItems.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-primary transition-colors">
                  {n.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile: centered logo */}
          <a href="#" className="lg:hidden absolute left-1/2 -translate-x-1/2 top-2">
            <img src={logo} alt="Waldorf Kimún" className="h-20 w-auto" />
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="bg-accent text-accent-foreground rounded-2xl px-4 lg:px-6 py-2.5 font-hand text-[11px] lg:text-xs tracking-[0.2em] leading-tight shadow-card hover:bg-accent/90 transition-all hover:-translate-y-0.5"
            >
              QUIERO<br className="lg:hidden" /> <span className="lg:inline">SER PARTE</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="sueno" className="px-5 lg:px-12 pt-4 lg:pt-6 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-6 items-center">
          <div className="order-2 lg:order-1 lg:pr-6">
            <h1 className="font-display text-primary text-5xl sm:text-6xl lg:text-7xl leading-[1.15] tracking-wide uppercase">
              Cultivemos juntos un sueño que transforma vidas
            </h1>
            <p className="mt-6 lg:mt-8 text-foreground/80 text-base lg:text-lg leading-relaxed max-w-md">
              En <span className="font-semibold text-foreground">Algarrobo, Chile</span> estamos creando un bioparque,
              una escuela de artes y oficios, un espacio vivo para que la comunidad florezca desde la educación Waldorf.
            </p>
            <button
              onClick={() => handleSelect()}
              className="mt-7 lg:mt-9 inline-flex items-center gap-2 border border-secondary/50 text-secondary rounded-full px-6 py-3.5 font-hand text-[12px] tracking-[0.22em] hover:bg-secondary-soft transition-all hover:-translate-y-0.5"
            >
              QUIERO SER PARTE DE ESTE SUEÑO
              <span className="text-primary">🌿</span>
            </button>
          </div>
          <div className="order-1 lg:order-2 relative">
            <img
              src={heroTree}
              alt="Árbol con niños tomados de la mano alrededor del tronco"
              className="w-full h-auto max-w-2xl mx-auto"
              width={1280}
              height={1024}
            />
            {/* hand-written annotation - desktop only */}
            <div className="hidden lg:block absolute top-6 right-2 text-secondary font-display text-2xl leading-tight rotate-[-4deg]">
              Cada aporte<br />hace crecer<br />este árbol
              <svg className="block mt-1 ml-6 text-secondary" width="60" height="40" viewBox="0 0 60 40" fill="none">
                <path d="M5 5 Q 30 30, 50 35" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M50 35 L 42 32 M50 35 L 46 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ÁRBOL — CARDS */}
      <section id="arbol" className="px-5 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-10 lg:mb-14">
            <Leaflet className="w-12 lg:w-16 h-5 text-secondary -scale-x-100" />
            <h2 className="font-display text-secondary text-3xl sm:text-4xl lg:text-5xl text-center uppercase leading-tight tracking-wide max-w-2xl">
              Elige en qué parte del árbol quieres convertirte
            </h2>
            <Leaflet className="w-12 lg:w-16 h-5 text-secondary" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
            {tiers.map((t) => (
              <article
                key={t.key}
                className={`${t.tint} rounded-3xl p-6 flex flex-col items-center text-center shadow-card border border-border/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-soft`}
              >
                <h3 className={`font-display text-2xl lg:text-3xl tracking-wider ${t.titleColor}`}>{t.name}</h3>
                <p className="mt-2 text-foreground/75 text-sm lg:text-[15px] leading-snug min-h-[3.5rem]">
                  {t.description}
                </p>
                <div className="my-5 flex items-center justify-center h-28 lg:h-32">
                  <img
                    src={t.image}
                    alt={t.name.toLowerCase()}
                    className="max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="font-display text-3xl text-primary leading-none">{t.price}</p>
                <p className="text-xs tracking-widest text-foreground/60 mt-1 mb-5 font-hand">aporte mensual</p>
                <TierButton variant={t.buttonVariant} onClick={() => handleSelect(t.name)}>
                  {t.cta}
                </TierButton>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-foreground/70 font-body text-base lg:text-lg flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            Cualquier aporte, por pequeño que sea, hace crecer este bosque.
          </p>
        </div>
      </section>

      {/* GREEN BAND — Pillars (desktop visible always; mobile compact) */}
      <section className="bg-band text-band-foreground py-10 lg:py-14 px-5 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { icon: "🏡", label: "Educación Waldorf\npara toda la comunidad" },
            { icon: "🌱", label: "Artes y oficios\npara el desarrollo\nhumano integral" },
            { icon: "🌳", label: "Un bosque escuela\nen armonía con\nla naturaleza" },
            { icon: "👥", label: "Un espacio vivo\nque transforma\nterritorio y personas" },
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className="text-3xl lg:text-4xl">{p.icon}</span>
              <p className="font-hand text-sm lg:text-base whitespace-pre-line leading-snug opacity-95">
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GROWTH FLOW */}
      <section className="px-5 lg:px-12 py-14 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-secondary text-3xl lg:text-4xl text-center uppercase tracking-wide mb-10 lg:mb-14">
            Así crece nuestro árbol
          </h2>
          <div className="flex flex-wrap items-end justify-center gap-3 lg:gap-6">
            {tiers.map((t, i) => (
              <div key={t.key} className="flex items-end gap-3 lg:gap-6">
                <div className="flex flex-col items-center w-20 lg:w-28">
                  <img src={t.image} alt={t.name} className="h-16 lg:h-20 w-auto object-contain" loading="lazy" />
                  <p className="font-display text-primary text-lg lg:text-xl mt-2">{t.name}</p>
                  <p className="text-[11px] lg:text-xs text-foreground/70 text-center font-hand leading-tight mt-1">
                    {["Iniciamos\nel sueño", "Damos los\nprimeros pasos", "Nos fortalecemos\nen comunidad", "Damos vida\ny energía", "Impactamos\na la comunidad"][i]}
                  </p>
                </div>
                {i < tiers.length - 1 && (
                  <ArrowRight className="text-secondary mb-12 hidden sm:block" strokeWidth={1.2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "ESTE NO ES SOLO UN COLEGIO" */}
      <section className="px-5 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display text-secondary text-2xl lg:text-4xl uppercase leading-tight whitespace-pre-line">
              ESTE NO ES SOLO UNA ESCUELA,{"\n"}ES UN MOVIMIENTO QUE CULTIVA EL FUTURO.
            </h3>
            <p className="mt-5 text-foreground/80 leading-relaxed text-base lg:text-lg">
              Kimün es un espacio donde niños, niñas y jóvenes crecen con sentido,
              creatividad y conexión con la naturaleza, el arte y el otro.
            </p>
            <a href="#club" className="mt-6 inline-flex items-center gap-2 font-hand text-primary text-sm tracking-widest hover:gap-3 transition-all">
              CONOCE MÁS SOBRE NUESTRO SUEÑO <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <img src={communityImg} alt="Comunidad reunida en el bosque" className="rounded-2xl w-full h-auto" loading="lazy" />
        </div>
      </section>

      {/* CLUB DE AMIGOS */}
      <section id="club" className="px-5 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-secondary text-3xl lg:text-4xl uppercase tracking-wide">
            Club de Amigos de Kimún
          </h2>
          <p className="mt-4 text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Al ser parte del Club de Amigos, te unes a una comunidad de personas
            que creen en la educación como motor de cambio.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            {[
              { icon: "💬", t: "Recibes noticias\ny avances del proyecto" },
              { icon: "👨‍👩‍👧", t: "Invitaciones a actividades\ny encuentros especiales" },
              { icon: "🤝", t: "Eres parte activa\nde este sueño colectivo" },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-secondary-soft flex items-center justify-center text-2xl">
                  {b.icon}
                </div>
                <p className="font-body text-foreground/80 whitespace-pre-line leading-snug">{b.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="historias" className="px-5 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-5 lg:p-8 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <img src={testimonialImg} alt="Familia amiga de Kimün" className="rounded-2xl w-full sm:w-64 h-auto" loading="lazy" />
          <div>
            <span className="font-display text-5xl text-secondary leading-none">"</span>
            <p className="text-foreground/85 text-lg lg:text-xl italic leading-relaxed -mt-3">
              Kimün es donde mis hijos aprenden con el corazón, en libertad y en comunidad.
              Aportar es sembrar esperanza.
            </p>
            <p className="mt-3 font-hand text-sm tracking-wide text-foreground/60">— Familia amiga de Kimün</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 lg:px-12 pb-16">
        <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-3xl p-8 lg:p-12 text-center shadow-soft">
          <h3 className="font-display text-3xl lg:text-4xl uppercase tracking-wide">
            ¿Listo para ser parte de este árbol?
          </h3>
          <p className="mt-3 opacity-90 text-base lg:text-lg max-w-2xl mx-auto">
            Elige tu lugar, haz tu aporte y juntos hagamos florecer este sueño.
          </p>
          <button
            onClick={() => handleSelect()}
            className="mt-7 bg-background text-primary rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] hover:bg-background/90 transition-all hover:-translate-y-0.5 shadow-card"
          >
            QUIERO SER PARTE
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="preguntas" className="px-5 lg:px-12 pb-12 pt-4">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8 items-center">
          <img src={logo} alt="Waldorf Kimún" className="h-24 w-auto mx-auto sm:mx-0" />
          <div className="flex justify-center gap-5 text-secondary">
            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Email" className="hover:text-primary transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
          <p className="font-body italic text-foreground/70 text-sm text-center sm:text-right leading-relaxed">
            "La educación es un arte,<br />
            el arte es comunicación,<br />
            y el camino es la vida misma."<br />
            <span className="font-hand not-italic text-foreground/60">— Rudolf Steiner</span>
          </p>
        </div>
      </footer>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-secondary text-center leading-tight">
              Estás a punto de ser parte de este árbol 🌳
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/75 pt-3 text-base font-body">
              {selectedTier ? (
                <>Has elegido <span className="text-primary font-semibold">{selectedTier}</span>. </>
              ) : null}
              Este es un prototipo de la experiencia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            <button
              onClick={() => setOpen(false)}
              className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-hand text-sm tracking-[0.22em] hover:bg-primary/90 transition-all"
            >
              VOLVER
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
