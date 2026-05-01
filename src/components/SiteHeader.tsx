import { Menu, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-kimun.png";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { label: "INICIO", to: "/" },
  { label: "CAUSA DEL MES", to: "/donar" },
  { label: "HACERME SOCIO", to: "/socios" },
  { label: "CONTACTO", to: "/contacto" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="Fundación Waldorf Kimün" className="h-14 sm:h-16 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-hand text-[12px] tracking-[0.18em] text-foreground/80">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-primary transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/campanas/carpinteria"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 sm:px-6 py-2.5 font-hand text-[11px] sm:text-xs tracking-[0.18em] shadow-card hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            DONAR
          </Link>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger aria-label="Abrir menú" className="p-2 text-foreground/80">
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border">
                <nav className="flex flex-col gap-5 mt-12 font-hand text-base tracking-wider text-foreground">
                  {navItems.map((n) => (
                    <SheetClose asChild key={n.to}>
                      <Link to={n.to} className="hover:text-primary transition-colors">
                        {n.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
