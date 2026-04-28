import { useEffect, useState } from "react";
import { Loader2, Sprout } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  goal: number;
  raised: number;
};

const API_URL =
  "https://kimun-donaciones-worker.jorgeaguirrecanciones.workers.dev/campaigns";

const formatCLP = (n: number) => "$" + (n ?? 0).toLocaleString("es-CL");

const ActiveChallenge = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API_URL, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("No pudimos cargar el desafío.");
        return r.json();
      })
      .then((data) => {
        const first: Campaign | undefined = data?.items?.[0];
        if (!first) throw new Error("No hay desafíos disponibles.");
        setCampaign(first);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message ?? "Error de red.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <section className="px-5 lg:px-12 pt-2 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="w-4 h-4 text-secondary" />
            <span className="font-hand text-[11px] tracking-[0.22em] text-secondary">
              DESAFÍO ACTIVO
            </span>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-foreground/60 py-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando desafío…</span>
            </div>
          )}

          {error && !loading && (
            <p className="text-sm text-destructive py-4">{error}</p>
          )}

          {campaign && !loading && !error && (
            <ChallengeContent campaign={campaign} />
          )}
        </div>
      </div>
    </section>
  );
};

const ChallengeContent = ({ campaign }: { campaign: Campaign }) => {
  const pct = campaign.goal > 0
    ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div>
        <h2 className="font-display text-secondary text-3xl sm:text-4xl uppercase tracking-wide leading-tight">
          {campaign.title}
        </h2>
        <p className="mt-3 text-foreground/75 leading-relaxed text-sm sm:text-base">
          Cada aporte siembra futuro. Sé parte de este desafío y ayúdanos a
          hacerlo realidad.
        </p>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">
              RECAUDADO
            </p>
            <p className="font-display text-primary text-2xl sm:text-3xl mt-0.5">
              {formatCLP(campaign.raised)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-hand text-[10px] tracking-[0.22em] text-foreground/60">
              META
            </p>
            <p className="text-foreground/80 text-base sm:text-lg mt-0.5">
              {formatCLP(campaign.goal)}
            </p>
          </div>
        </div>

        <div
          className="mt-3 h-3 w-full rounded-full bg-secondary-soft overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Avance ${pct}%`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/60 font-hand tracking-[0.18em]">
          {pct}% COMPLETADO
        </p>

        <button
          type="button"
          className="mt-5 w-full sm:w-auto bg-primary text-primary-foreground rounded-full px-8 py-3 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
        >
          DONAR
        </button>
      </div>
    </div>
  );
};

export default ActiveChallenge;
