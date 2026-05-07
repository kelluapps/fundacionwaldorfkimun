import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createSocio, formatCLP } from "@/lib/kimun-api";
import { Loader2 } from "lucide-react";

export type SocioPlan = {
  key: string;
  name: string;
  amount: number;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: SocioPlan | null;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SocioModal = ({ open, onOpenChange, plan }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      setLoading(false);
      return;
    }
    try {
      const raw = sessionStorage.getItem("kimun_socio_prefill");
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.name) setName(data.name);
        if (data?.email) setEmail(data.email);
        if (data?.phone) setPhone(data.phone);
        sessionStorage.removeItem("kimun_socio_prefill");
      }
    } catch {
      // ignore
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!plan) return;
    if (!name.trim()) return setError("Cuéntanos tu nombre.");
    if (!emailRe.test(email.trim())) return setError("Necesitamos un email válido.");
    if (!plan.amount || plan.amount <= 0) return setError("Monto inválido.");

    setLoading(true);
    try {
      const res = await createSocio({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        comment: comment.trim() || undefined,
        amount: plan.amount,
        campaignId: "socios-kimun",
      });
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      setError("No pudimos iniciar la suscripción. Inténtalo nuevamente.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(`No pudimos iniciar la suscripción. ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="bg-card border-border max-w-md rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl sm:text-3xl text-secondary text-center leading-tight">
            Estás a un paso de hacerte socio de Kimün 🌱
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/75 pt-2">
            Tu aporte mensual nos ayuda a sostener este sueño en el tiempo.
          </DialogDescription>
        </DialogHeader>

        {plan && (
          <div className="rounded-2xl bg-primary-soft/60 border border-primary/20 p-4 text-center">
            <p className="font-hand text-[11px] tracking-[0.28em] text-primary mb-1">PLAN SELECCIONADO</p>
            <p className="font-display text-xl text-secondary">{plan.name}</p>
            <p className="font-display text-2xl text-primary mt-1">
              {formatCLP(plan.amount)} <span className="text-sm text-foreground/60">/ mes</span>
            </p>
            <p className="text-[11px] tracking-widest text-foreground/60 mt-1 font-hand">
              ESTE APORTE SERÁ MENSUAL
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="socio-name">Nombre *</Label>
            <Input id="socio-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="socio-email">Email *</Label>
            <Input id="socio-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="socio-phone">Teléfono / WhatsApp (opcional)</Label>
            <Input id="socio-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} disabled={loading} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="socio-comment">Comentario (opcional)</Label>
            <Textarea id="socio-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} disabled={loading} rows={2} />
          </div>

          <p className="text-xs text-foreground/65 text-center">
            Podrás modificar o cancelar tu aporte cuando quieras.
          </p>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-full px-6 py-3 font-hand text-sm tracking-[0.22em] hover:bg-primary/90 disabled:opacity-70 inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "CONECTANDO CON FLOW…" : "CONTINUAR AL PAGO SEGURO"}
          </button>
          <p className="text-[11px] text-center text-foreground/55 font-hand tracking-widest">
            PAGO SEGURO PROCESADO POR FLOW
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SocioModal;
