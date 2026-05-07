import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const GraciasSocio = () => {
  const [params] = useSearchParams();
  const hasError = params.get("error") || params.get("status") === "error";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <section className="flex-1 px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20 pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          {hasError ? (
            <>
              <p className="font-hand text-xs tracking-[0.3em] text-primary mb-4">UN MOMENTO</p>
              <h1 className="font-display text-secondary text-3xl sm:text-5xl uppercase leading-tight">
                No pudimos confirmar tu suscripción
              </h1>
              <p className="mt-6 text-foreground/80 text-base sm:text-lg leading-relaxed">
                Si crees que hubo un problema, contáctanos y te ayudamos personalmente.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contacto" className="bg-primary text-primary-foreground rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all">
                  CONTACTAR
                </Link>
                <Link to="/socios" className="border border-primary/30 text-primary rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] hover:bg-primary-soft transition-all">
                  VOLVER A INTENTAR
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="font-hand text-xs tracking-[0.3em] text-primary mb-4">¡BIENVENIDO/A!</p>
              <h1 className="font-display text-secondary text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight">
                Gracias por hacerte socio de Kimün <span className="inline-block">🌱</span>
              </h1>
              <p className="mt-6 text-foreground/80 text-base sm:text-lg leading-relaxed">
                Tu aporte mensual ya está ayudando a sostener este sueño.
              </p>
              <div className="mt-8 max-w-xl mx-auto bg-card/70 border border-border/50 rounded-3xl p-7 sm:p-9 text-center shadow-card">
                <p className="font-hand text-[11px] tracking-[0.28em] text-primary mb-3">UNA COMUNIDAD QUE CRECE</p>
                <p className="text-foreground/80 leading-relaxed">
                  Te enviaremos novedades del proyecto, avances de cada causa y momentos especiales de la comunidad Kimün directo a tu correo.
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link to="/donar" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all">
                  <Heart className="w-4 h-4" fill="currentColor" /> VER CAUSA DEL MES
                </Link>
                <Link to="/" className="border border-primary/30 text-primary rounded-full px-8 py-3.5 font-hand text-sm tracking-[0.22em] hover:bg-primary-soft transition-all">
                  VOLVER AL INICIO
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default GraciasSocio;
