import { useEffect, useState } from "react";
import { Loader2, Sprout, Hammer } from "lucide-react";
import {
  fetchCampaigns,
  createDonation,
  formatCLP,
  HAMMER_PRICE,
  type KimunCampaign,
} from "@/lib/kimun-api";

const ActiveChallenge = () => {
  const [campaign, setCampaign] = useState<KimunCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donating, setDonating] = useState(false);

  const loadCampaign = (signal?: AbortSignal) =>
    fetchCampaigns(signal)
      .then((items) => {
        const first = items[0];
        if (!first) throw new Error("No hay desafíos disponibles.");
        setCampaign(first);
        setError(null);
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError")
          setError("No pudimos cargar el desafío. Intenta nuevamente.");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    const ctrl = new AbortController();
    loadCampaign(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  // Refresco automático al volver de Flow (?paid=1).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1") return;

    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      await loadCampaign();
      if (attempts < 6 && !cancelled) setTimeout(tick, 2500);
    };
    tick();

    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, "", cleanUrl);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDonate = async () => {
    if (!campaign || donating) return;
    setDonating(true);
    try {
      const { redirectUrl } = await createDonation({
        amount: HAMMER_PRICE,
        campaignId: campaign.id,
        name: "Donante",
        email: "donante@email.com",
      });
      window.location.href = redirectUrl;
    } catch (e) {
      setDonating(false);
      setError("No pudimos iniciar la donación. Intenta nuevamente.");
    }
  };

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
              <span className="text-sm">Cargando último cómputo…</span>
            </div>
          )}

          {error && !loading && (
            <p className="text-sm text-destructive py-4">{error}</p>
          )}

          {campaign && !loading && !error && (
            <ChallengeContent
              campaign={campaign}
              donating={donating}
              onDonate={handleDonate}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const ChallengeContent = ({
  campaign,
  donating,
  onDonate,
}: {
  campaign: KimunCampaign;
  donating: boolean;
  onDonate: () => void;
}) => {
  const pct = campaign.goal > 0
    ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
    : 0;
  const remaining = Math.max(0, campaign.goal - campaign.raised);
  const hammersFunded = Math.floor(campaign.raised / HAMMER_PRICE);
  const hammersLeft = Math.ceil(remaining / HAMMER_PRICE);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div>
        <h2 className="font-display text-secondary text-3xl sm:text-4xl uppercase tracking-wide leading-tight">
          {campaign.title}
        </h2>
        <p className="mt-3 text-foreground/75 leading-relaxed text-sm sm:text-base">
          Ayúdanos a completar este desafío. Cada aporte siembra futuro.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-foreground/80">
            <Hammer className="w-4 h-4 text-secondary" />
            <span>
              <span className="font-semibold text-foreground">{hammersFunded.toLocaleString("es-CL")}</span> martillos financiados
            </span>
          </div>
          <div className="flex items-center gap-2 text-foreground/80">
            <Hammer className="w-4 h-4 text-primary" />
            <span>
              <span className="font-semibold text-foreground">{hammersLeft.toLocaleString("es-CL")}</span> martillos restantes
            </span>
          </div>
        </div>
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
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/60 font-hand tracking-[0.18em]">
          {pct}% COMPLETADO · FALTAN {formatCLP(remaining)}
        </p>

        <button
          type="button"
          onClick={onDonate}
          disabled={donating}
          className="mt-5 w-full sm:w-auto bg-primary text-primary-foreground rounded-full px-8 py-3 font-hand text-xs tracking-[0.22em] shadow-card hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2"
        >
          {donating && <Loader2 className="w-4 h-4 animate-spin" />}
          {donating ? "PROCESANDO…" : "DONAR"}
        </button>
      </div>
    </div>
  );
};

export default ActiveChallenge;
