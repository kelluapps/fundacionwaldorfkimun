import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Sprout, Lock, ArrowLeft } from "lucide-react";
import { createDonation, createSocio, formatCLP } from "@/lib/kimun-api";
import { DEFAULT_UPSELL, type Campaign } from "@/lib/campaigns";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  campaign: Campaign;
  units: number;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DonationModal = ({ open, onOpenChange, campaign, units }: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const upsellEnabled = campaign.upsellMonthlyEnabled !== false;
  const totalSteps = upsellEnabled ? 2 : 1;
  const total = units * campaign.unitAmount;
  const unitWord = units === 1 ? campaign.unitSingular : campaign.unitPlural;
  const remoteId = campaign.remoteCampaignId || campaign.id;

  const upsellTitle = campaign.upsellTitle || DEFAULT_UPSELL.upsellTitle;
  const upsellMessage = campaign.upsellMessage || DEFAULT_UPSELL.upsellMessage;
  const upsellPrimary = campaign.upsellPrimaryButtonText || DEFAULT_UPSELL.upsellPrimaryButtonText;
  const upsellSecondary = campaign.upsellSecondaryButtonText || DEFAULT_UPSELL.upsellSecondaryButtonText;
  const upsellAction = campaign.upsellPrimaryAction || DEFAULT_UPSELL.upsellPrimaryAction;

  useEffect(() => {
    if (!open) {
      setStep(1);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const submitDonation = async () => {
    setError(null);
    setLoading(true);
    try {
      const { redirectUrl } = await createDonation({
        amount: total,
        campaignId: remoteId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      window.location.href = redirectUrl;
    } catch {
      setLoading(false);
      setError("No pudimos iniciar el pago. Inténtalo nuevamente.");
    }
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Cuéntanos tu nombre.");
    if (!emailRe.test(email.trim())) return setError("Necesitamos un email válido.");
    if (upsellEnabled) {
      setStep(2);
    } else {
      submitDonation();
    }
  };

  const handleYesSocio = () => {
    // Pasar datos precargados a /socios via sessionStorage
    try {
      sessionStorage.setItem(
        "kimun_socio_prefill",
        JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      );
    } catch {
      // ignore
    }
    onOpenChange(false);
    navigate(upsellAction);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="bg-card border-border max-w-md rounded-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <p className="font-hand text-[10px] tracking-[0.3em] text-foreground/50 text-center">
            PASO {step} DE {totalSteps}
          </p>
          <DialogTitle className="font-display text-2xl text-secondary text-center leading-tight">
            {step === 1 ? "Confirma tu donación" : upsellTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/70 text-sm">
            {step === 1
              ? "Estás a un paso de apoyar este proyecto."
              : "Una decisión que siembra futuro."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-4 pt-1">
            <div className="bg-secondary-soft rounded-2xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">Campaña</span>
                <span className="font-semibold text-foreground text-right">{campaign.title}</span>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-foreground/70 capitalize">{unitWord}</span>
                <span className="font-semibold text-foreground">
                  {units} {unitWord} solidarios
                </span>
              </div>
              <div className="flex justify-between mt-1.5 pt-1.5 border-t border-border/60">
                <span className="text-foreground/70">Total</span>
                <span className="font-display text-primary text-xl">{formatCLP(total)}</span>
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-hand text-xs tracking-widest text-foreground/70">NOMBRE *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="rounded-full border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
                placeholder="Tu nombre"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-hand text-xs tracking-widest text-foreground/70">EMAIL *</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="rounded-full border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
                placeholder="tu@email.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-hand text-xs tracking-widest text-foreground/70">TELÉFONO (OPCIONAL)</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                className="rounded-full border border-border bg-background px-4 py-2.5 outline-none focus:border-primary"
                placeholder="+56 9 ..."
              />
            </label>

            {error && <p className="text-xs text-destructive text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-primary text-primary-foreground rounded-full py-3.5 font-hand text-sm tracking-[0.22em] shadow-card hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-wait inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "CONECTANDO CON FLOW…" : "CONTINUAR"}
            </button>
            <p className="text-[11px] text-foreground/60 text-center inline-flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" /> Pago seguro procesado por Flow
            </p>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="rounded-2xl border border-primary/25 bg-primary-soft/50 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{upsellMessage}</p>
            </div>

            {error && <p className="text-xs text-destructive text-center">{error}</p>}

            <button
              type="button"
              onClick={handleYesSocio}
              disabled={loading}
              className="bg-primary text-primary-foreground rounded-full py-3.5 px-4 font-hand text-sm tracking-[0.18em] shadow-card hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {upsellPrimary}
            </button>
            <button
              type="button"
              onClick={submitDonation}
              disabled={loading}
              className="rounded-full border border-border bg-background py-3 px-4 text-sm hover:bg-secondary-soft transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "CONECTANDO CON FLOW…" : upsellSecondary}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1 text-xs text-foreground/60 hover:text-primary"
            >
              <ArrowLeft className="w-3 h-3" /> Volver
            </button>

            <p className="text-[11px] text-foreground/55 text-center font-hand tracking-widest">
              TU APORTE MENSUAL NOS AYUDA A SOSTENER ESTE SUEÑO EN EL TIEMPO.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
