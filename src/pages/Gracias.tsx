import { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import seedImg from "@/assets/card-seed.png";
import sproutImg from "@/assets/card-sprout.png";
import branchImg from "@/assets/card-branch.png";
import leafImg from "@/assets/card-leaf.png";
import fruitImg from "@/assets/card-fruit.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Tier = {
  key: string;
  name: string;
  description: string;
  price: string;
  cta: string;
  image: string;
  tint: string;
  buttonVariant: "ghost" | "soft" | "solid";
};

// Mismos tiers que /arbol — fuente única de verdad visual
const tiers: Tier[] = [
  { key: "semilla", name: "SEMILLA", description: "Todo gran sueño comienza con una semilla.", price: "$5.000", cta: "QUIERO SER PARTE", image: seedImg, tint: "bg-tier-seed", buttonVariant: "ghost" },
  { key: "brote", name: "BROTE", description: "Damos los primeros pasos y algo comienza a crecer.", price: "$10.000", cta: "QUIERO SER PARTE", image: sproutImg, tint: "bg-tier-sprout", buttonVariant: "soft" },
  { key: "rama", name: "RAMA", description: "Nos expandimos y fortalecemos este sueño juntos.", price: "$15.000", cta: "QUIERO SER PARTE", image: branchImg, tint: "bg-tier-branch", buttonVariant: "soft" },
  { key: "hoja", name: "HOJA", description: "Damos vida, energía y color a este proyecto.", price: "$20.000", cta: "QUIERO SER PARTE", image: leafImg, tint: "bg-tier-leaf", buttonVariant: "soft" },
  { key: "fruto", name: "FRUTO", description: "El fruto es el impacto que dejamos en la comunidad.", price: "$25.000+", cta: "QUIERO SER PARTE", image: fruitImg, tint: "bg-tier-fruit", buttonVariant: "solid" },
];

const TierButton = ({ variant, children, onClick }: { variant: Tier["buttonVariant"]; children: React.ReactNode; onClick: () => void }) => {
  const base = "w-full rounded-full px-5 py-2.5 text-xs font-hand tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5";
  const styles = {
    ghost: "border border-secondary/40 text-secondary hover:bg-secondary-soft",
    soft: "border border-primary/30 text-primary hover:bg-primary-soft",
    solid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
  } as const;
  return <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>;
};

const Gracias = () => {
  const [open, setOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const handleSelect = (name?: string) => { setSelectedTier(name ?? null); setOpen(true); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* HERO de agradecimiento */}
      <section className="px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-10 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-hand text-[11px] sm:text-xs tracking-[0.3em] text-primary mb-4">
            DONACIÓN RECIBIDA
          </p>
          <h1 className="font-display text-secondary text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight">
            Gracias por tu aporte <span className="inline-block">💛</span>
          </h1>
          <p className="mt-6 text-foreground/80 text-base sm:text-lg leading-relaxed">
            Juntos haremos posible este taller de carpintería para toda la comunidad.
          </p>
          <p className="mt-3 text-foreground/65 text-sm sm:text-base">
            Te iremos contando cada avance.
          </p>
        </div>
      </section>

      {/* Transición emocional */}
      <section className="px-5 sm:px-8 lg:px-12 pb-10">
        <div className="max-w-2xl mx-auto bg-card/70 border border-border/50 rounded-3xl p-7 sm:p-9 text-center shadow-card">
          <p className="font-hand text-[11px] tracking-[0.28em] text-primary mb-3">
            UNA INVITACIÓN ESPECIAL
          </p>
          <h2 className="font-display text-secondary text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Queremos hacerte una invitación especial…
          </h2>
          <p className="mt-5 text-foreground/75 text-base leading-relaxed max-w-xl mx-auto">
            Hazte socio de Fundación Waldorf Kimün y ayúdanos a sostener este sueño en el tiempo.
          </p>
        </div>
      </section>

      {/* Bloque de socios — mismo sistema que /arbol */}
      <section className="px-5 sm:px-8 lg:px-12 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="font-hand text-xs tracking-[0.3em] text-primary mb-3">🌱 ELIGE TU APORTE MENSUAL</p>
            <h2 className="font-display text-secondary text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight max-w-3xl mx-auto">
              Conviértete en parte del árbol
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {tiers.map((t) => (
              <article key={t.key} className={`${t.tint} rounded-3xl p-6 flex flex-col items-center text-center shadow-card border border-border/40 hover:-translate-y-1 transition-all`}>
                <h3 className="font-display text-2xl lg:text-3xl text-primary tracking-wider">{t.name}</h3>
                <p className="mt-2 text-foreground/75 text-sm leading-snug min-h-[3.5rem]">{t.description}</p>
                <div className="my-5 flex items-center justify-center h-28">
                  <img src={t.image} alt={t.name.toLowerCase()} className="max-h-full w-auto object-contain" loading="lazy" />
                </div>
                <p className="font-display text-3xl text-primary leading-none">
                  {t.price} <span className="text-base text-foreground/60">/ mes</span>
                </p>
                <p className="text-[11px] tracking-widest text-foreground/60 mt-1 mb-5 font-hand">aporte mensual</p>
                <TierButton variant={t.buttonVariant} onClick={() => handleSelect(t.name)}>{t.cta}</TierButton>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-foreground/65 text-sm max-w-xl mx-auto">
            Tu aporte es mensual y puedes modificarlo o cancelarlo cuando quieras.
          </p>
        </div>
      </section>

      {/* CTA principal */}
      <section className="px-5 sm:px-8 lg:px-12 pb-16">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
          <Link
            to="/arbol"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            HAZTE SOCIO AHORA
          </Link>
          <Link
            to="/"
            className="font-hand text-xs tracking-[0.22em] text-foreground/60 hover:text-primary transition-colors"
          >
            PREFIERO QUEDARME SOLO CON MI DONACIÓN
          </Link>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-secondary text-center">
              Estás a punto de ser parte de este árbol 🌳
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/75 pt-3">
              {selectedTier && <>Has elegido <span className="text-primary font-semibold">{selectedTier}</span>. </>}
              Pronto podrás completar tu aporte mensual.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            <button onClick={() => setOpen(false)} className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-hand text-sm tracking-[0.22em] hover:bg-primary/90">
              VOLVER
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
};

export default Gracias;
