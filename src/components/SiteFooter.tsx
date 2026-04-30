import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="bg-band text-band-foreground py-10 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between text-sm">
        <p className="font-hand tracking-widest opacity-90">
          FUNDACIÓN WALDORF KIMÜN · ALGARROBO, CHILE
        </p>
        <div className="flex gap-5 font-hand text-[11px] tracking-[0.22em]">
          <Link to="/campanas" className="hover:opacity-80">CAMPAÑAS</Link>
          <Link to="/arbol" className="hover:opacity-80">HACERME SOCIO</Link>
          <Link to="/campanas/carpinteria" className="hover:opacity-80">DONAR</Link>
        </div>
      </div>
    </footer>
  );
}
