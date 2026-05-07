import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Leaf, Sparkles, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fetchCampaigns, formatCLP, type KimunCampaign } from "@/lib/kimun-api";
import { useCampaigns, getStatus } from "@/lib/campaigns";
import heroImg from "@/assets/campanas-hero.jpg";
import carpinteriaImg from "@/assets/carpinteria-hero.jpg";
import anfiteatroImg from "@/assets/anfiteatro-hero.jpg";
import huertoImg from "@/assets/campana-huerto.jpg";
import reforestacionImg from "@/assets/campana-reforestacion.jpg";

type ApiCampaign = KimunCampaign & { isActive?: boolean; active?: boolean };

const fallbackImages: Record<string, string> = {
  "taller-carpinteria": carpinteriaImg,
  carpinteria: carpinteriaImg,
  anfiteatro: anfiteatroImg,
  huerto: huertoImg,
  reforestacion: reforestacionImg,
};

const pickImage = (id: string, idx: number) => {
  if (fallbackImages[id]) return fallbackImages[id];
  const pool = [carpinteriaImg, anfiteatroImg, huertoImg, reforestacionImg];
  return pool[idx % pool.length];
};

const Leaflet = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 24" className={className} aria-hidden="true">
    <path d="M2 12 Q 15 4, 28 12 T 58 12" stroke="currentColor" strokeWidth="1" fill="none" />
    <ellipse cx="14" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-25 14 9)" />
    <ellipse cx="22" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(15 22 14)" />
    <ellipse cx="42" cy="9" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(-15 42 9)" />
    <ellipse cx="50" cy="14" rx="4" ry="2" fill="currentColor" opacity="0.7" transform="rotate(20 50 14)" />
  </svg>
);

const pct = (raised: number, goal: number) =>
  goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

export default function CampanasPublic() {
  const [items, setItems] = useState<ApiCampaign[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const localCampaigns = useCampaigns();

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCampaigns(ctrl.signal)
      .then((data) => setItems(data as ApiCampaign[]))
      .catch((e) => {
        if (e.name !== "AbortError") setError("No pudimos cargar las campañas en este momento. Inténtalo nuevamente.");
      });
    return () => ctrl.abort();
  }, []);

  // Mapa de configuraciones locales por remoteCampaignId
  const localByRemote = new Map(
    localCampaigns
      .filter((l) => l.remoteCampaignId)
      .map((l) => [l.remoteCampaignId as string, l]),
  );
  // También por id local
  const localById = new Map(localCampaigns.map((l) => [l.id, l]));

  const mainLocal = localCampaigns.find((c) => getStatus(c) === "principal");
  const mainRemoteId = mainLocal?.remoteCampaignId ?? mainLocal?.id ?? "taller-carpinteria";

  // Filtrar las campañas API: ocultar las que tienen status local "inactive".
  // Si no hay local asociada, se muestra como "active" por defecto.
  const visible = (items ?? []).filter((c) => {
    const local = localByRemote.get(c.id) ?? localById.get(c.id);
    if (!local) return true;
    return getStatus(local) !== "inactive";
  });

  const sorted = visible.slice().sort((a, b) => {
    if (a.id === mainRemoteId) return -1;
    if (b.id === mainRemoteId) return 1;
    return 0;
  });

  const featured = sorted.find((c) => c.id === mainRemoteId) ?? sorted[0];
  const others = sorted.filter((c) => c !== featured);

  const hrefFor = (c: ApiCampaign) => {
    if (c.id === mainRemoteId) return "/donar";
    const local = localByRemote.get(c.id) ?? localById.get(c.id);
    const slug = local?.id ?? c.id;
    return `/campanas/${slug}`;
  };

  const titleFor = (c: ApiCampaign) => {
    const local = localByRemote.get(c.id) ?? localById.get(c.id);
    return local?.title ?? c.title;
  };

  return (
    <div className="min-h-screen bg-warm overflow-x-hidden flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="px-5 lg:px-12 pt-6 pb-10">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden grid sm:grid-cols-[1fr_1.3fr]">
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 self-start bg-secondary-soft text-secondary rounded-full px-3 py-1 font-hand text-[10px] tracking-[0.22em]">
              <Sparkles className="w-3.5 h-3.5" /> KIMÜN
            </span>
            <h1 className="font-display text-secondary text-5xl lg:text-6xl uppercase tracking-wide leading-none mt-4">
              Campañas
            </h1>
            <Leaflet className="w-14 h-5 text-secondary mt-4" />
            <p className="mt-5 text-foreground/80 text-base lg:text-lg leading-relaxed max-w-md">
              Cada campaña es una forma concreta de construir juntos el sueño de
              Fundación Waldorf Kimün.
            </p>
          </div>
          <div className="relative min-h-[220px] sm:min-h-full">
            <img
              src={heroImg}
              alt="Comunidad Kimün"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* STATES */}
      {error && (
        <section className="px-5 lg:px-12 pb-10">
          <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-3xl p-8 text-center">
            <p className="text-foreground/80">{error}</p>
          </div>
        </section>
      )}

      {!items && !error && (
        <section className="px-5 lg:px-12 pb-10">
          <div className="max-w-3xl mx-auto text-center text-foreground/70 font-hand tracking-widest text-sm">
            CARGANDO CAMPAÑAS…
          </div>
        </section>
      )}

      {items && items.length === 0 && (
        <section className="px-5 lg:px-12 pb-10">
          <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-3xl p-10 text-center">
            <Leaf className="w-8 h-8 mx-auto text-secondary" />
            <p className="mt-3 text-foreground/80">
              Pronto tendremos nuevas campañas para construir juntos.
            </p>
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featured && (
        <section className="px-5 lg:px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Leaflet className="w-12 h-5 text-secondary -scale-x-100" />
              <h2 className="font-display text-secondary text-3xl lg:text-4xl uppercase tracking-wide text-center">
                Campaña del mes
              </h2>
              <Leaflet className="w-12 h-5 text-secondary" />
            </div>

            <article className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden grid lg:grid-cols-[1.2fr_1fr]">
              <div className="relative min-h-[240px] lg:min-h-full">
                <img
                  src={pickImage(featured.id, 0)}
                  alt={titleFor(featured)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-1.5 font-hand text-[10px] tracking-[0.22em] shadow-card">
                  <Heart className="w-3 h-3" fill="currentColor" /> CAMPAÑA DEL MES
                </span>
              </div>
              <div className="p-7 lg:p-10 flex flex-col">
                <h3 className="font-display text-secondary text-3xl lg:text-4xl uppercase tracking-wide">
                  {titleFor(featured)}
                </h3>
                <p className="mt-3 text-foreground/75 leading-relaxed">
                  Cada aporte nos acerca a completar este sueño.
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">RECAUDADO</p>
                    <p className="font-display text-primary text-2xl mt-0.5">{formatCLP(featured.raised)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">META</p>
                    <p className="text-foreground/80 text-base mt-0.5">{formatCLP(featured.goal)}</p>
                  </div>
                </div>
                <div className="mt-3 h-2.5 w-full rounded-full bg-secondary-soft overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct(featured.raised, featured.goal)}%` }}
                  />
                </div>
                <p className="mt-2 font-hand text-[11px] tracking-[0.22em] text-foreground/60">
                  {pct(featured.raised, featured.goal)}% COMPLETADO
                </p>

                <Link
                  to={hrefFor(featured)}
                  className="mt-7 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all self-start"
                >
                  <Heart className="w-4 h-4" fill="currentColor" /> VER CAUSA DEL MES
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* OTHERS */}
      {others.length > 0 && (
        <section className="px-5 lg:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Leaflet className="w-10 h-4 text-secondary -scale-x-100" />
              <h2 className="font-display text-secondary text-2xl lg:text-3xl uppercase tracking-wide text-center">
                Otras campañas activas
              </h2>
              <Leaflet className="w-10 h-4 text-secondary" />
            </div>
            <p className="text-center text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-9">
              Conoce todos los proyectos en los que estamos trabajando como comunidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((c, i) => {
                const p = pct(c.raised, c.goal);
                const isActive = c.isActive || c.active;
                return (
                  <article
                    key={c.id}
                    className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden flex flex-col"
                  >
                    <div className="p-3">
                      <div className="rounded-2xl overflow-hidden aspect-[16/10]">
                        <img
                          src={pickImage(c.id, i + 1)}
                          alt={titleFor(c)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-1 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-secondary text-xl uppercase tracking-wide">
                          {titleFor(c)}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 font-hand text-[9px] tracking-[0.22em] ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary-soft text-secondary"
                          }`}
                        >
                          {isActive ? "ACTIVA" : "EN PREPARACIÓN"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between text-sm">
                        <div>
                          <p className="font-hand text-[9px] tracking-[0.22em] text-foreground/60">RECAUDADO</p>
                          <p className="font-display text-primary text-lg mt-0.5">{formatCLP(c.raised)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-hand text-[9px] tracking-[0.22em] text-foreground/60">META</p>
                          <p className="text-foreground/80">{formatCLP(c.goal)}</p>
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary-soft overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p}%` }} />
                      </div>
                      <p className="mt-1.5 font-hand text-[10px] tracking-[0.22em] text-foreground/60">
                        {p}% COMPLETADO
                      </p>

                      <Link
                        to={hrefFor(c)}
                        className="mt-5 self-stretch text-center border border-secondary/50 text-secondary rounded-full px-6 py-3 font-hand text-xs tracking-[0.22em] hover:bg-secondary-soft transition-all"
                      >
                        VER CAMPAÑA
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-5 lg:px-12 pb-14">
        <div className="max-w-7xl mx-auto bg-card rounded-3xl shadow-card border border-border/50 p-6 lg:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-secondary shrink-0 mt-1" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              Cada campaña es una semilla de cambio.<br />
              Tu aporte hoy florece en el futuro.
            </p>
          </div>
          <Link
            to="/socios"
            className="bg-primary text-primary-foreground rounded-full px-7 py-3 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            HAZTE SOCIO
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
