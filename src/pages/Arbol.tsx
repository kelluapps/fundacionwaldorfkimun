import { useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
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

const tiers: Tier[] = [
  { key: "semilla", name: "SEMILLA", description: "Todo gran sueño comienza con una semilla.", price: "$5.000", cta: "SER SEMILLA", image: seedImg, tint: "bg-tier-seed", buttonVariant: "ghost" },
  { key: "brote", name: "BROTE", description: "Damos los primeros pasos y algo comienza a crecer.", price: "$10.000", cta: "SER BROTE", image: sproutImg, tint: "bg-tier-sprout", buttonVariant: "soft" },
  { key: "rama", name: "RAMA", description: "Nos expandimos y fortalecemos este sueño juntos.", price: "$15.000", cta: "SER RAMA", image: branchImg, tint: "bg-tier-branch", buttonVariant: "soft" },
  { key: "hoja", name: "HOJA", description: "Damos vida, energía y color a este proyecto.", price: "$20.000", cta: "SER HOJA", image: leafImg, tint: "bg-tier-leaf", buttonVariant: "soft" },
  { key: "fruto", name: "FRUTO", description: "El fruto es el impacto que dejamos en la comunidad.", price: "$25.000+", cta: "SER FRUTO", image: fruitImg, tint: "bg-tier-fruit", buttonVariant: "solid" },
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

const Arbol = () => {
  const [open, setOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const handleSelect = (name?: string) => { setSelectedTier(name ?? null); setOpen(true); };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-5 lg:px-12 pt-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-hand text-xs tracking-[0.3em] text-primary mb-3">🌱 HAZTE SOCIO</p>
            <h1 className="font-display text-secondary text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight max-w-3xl mx-auto">
              Elige en qué parte del árbol quieres convertirte
            </h1>
            <p className="mt-5 text-foreground/75 max-w-xl mx-auto">
              Tu aporte mensual sostiene la educación, la naturaleza y la comunidad de Kimün.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {tiers.map((t) => (
              <article key={t.key} className={`${t.tint} rounded-3xl p-6 flex flex-col items-center text-center shadow-card border border-border/40 hover:-translate-y-1 transition-all`}>
                <h3 className="font-display text-2xl lg:text-3xl text-primary tracking-wider">{t.name}</h3>
                <p className="mt-2 text-foreground/75 text-sm leading-snug min-h-[3.5rem]">{t.description}</p>
                <div className="my-5 flex items-center justify-center h-28">
                  <img src={t.image} alt={t.name.toLowerCase()} className="max-h-full w-auto object-contain" loading="lazy" />
                </div>
                <p className="font-display text-3xl text-primary leading-none">{t.price}</p>
                <p className="text-xs tracking-widest text-foreground/60 mt-1 mb-5 font-hand">aporte mensual</p>
                <TierButton variant={t.buttonVariant} onClick={() => handleSelect(t.name)}>{t.cta}</TierButton>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-foreground/70 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            Cualquier aporte, por pequeño que sea, hace crecer este bosque.
          </p>

          <div className="mt-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-hand text-sm tracking-widest">
              <ArrowRight className="w-4 h-4 rotate-180" /> VOLVER AL INICIO
            </Link>
          </div>
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

export default Arbol;
