import { Link } from "react-router-dom";

const footerLinks = [
  { label: "INICIO", to: "/" },
  { label: "CAUSA DEL MES", to: "/donar" },
  { label: "HACERME SOCIO", to: "/socios" },
  { label: "CONTACTO", to: "/contacto" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-band text-band-foreground py-10 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between text-sm">
        <p className="font-hand tracking-widest opacity-90 text-center sm:text-left">
          FUNDACIÓN WALDORF KIMÜN · ALGARROBO, CHILE
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-hand text-[11px] tracking-[0.22em]">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:opacity-80">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
