import { useEffect, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ADMIN_UNAUTHORIZED_EVENT, getAdminToken, setAdminToken } from "@/lib/kimun-api";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => getAdminToken());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "ok" | "err"; text?: string }>({
    kind: token ? "ok" : "idle",
  });

  useEffect(() => {
    const onUnauth = () => {
      setAdminToken("");
      setToken("");
      setStatus({ kind: "err", text: "La clave secreta no es correcta o expiró. Vuelve a ingresarla." });
    };
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauth);
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauth);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setStatus({ kind: "loading", text: "Conectando con la API…" });
    setAdminToken(t);
    setToken(t);
    setInput("");
    setStatus({ kind: "ok", text: "Conectado a la API correctamente." });
  };

  if (token) return <>{children}</>;

  return (
    <div className="min-h-screen bg-warm flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border/50 shadow-card p-7 sm:p-9">
          <p className="font-hand text-[11px] tracking-[0.22em] text-secondary text-center">ADMIN KIMÜN</p>
          <h1 className="font-display text-secondary text-2xl sm:text-3xl uppercase text-center mt-1">
            Bienvenido al Admin Kimün
          </h1>
          <p className="text-sm text-foreground/70 text-center mt-3">
            Introduce tu clave secreta para conectarte con la API.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
            <label className="block">
              <span className="font-hand text-[11px] tracking-[0.2em] text-foreground/60 block mb-1.5">
                CLAVE SECRETA
              </span>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="password"
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ingresa tu clave de administrador"
                  className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={!input.trim() || status.kind === "loading"}
              className="inline-flex items-center justify-center gap-2 text-xs px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {status.kind === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Conectar con la API
            </button>

            {status.kind === "err" && (
              <p className="text-xs text-destructive text-center">{status.text}</p>
            )}
            {status.kind === "idle" && (
              <p className="text-xs text-foreground/60 text-center">
                Introduce tu clave secreta para conectarte con la API.
              </p>
            )}

            <p className="text-[11px] text-foreground/50 text-center">
              La clave se guarda solo mientras tengas esta sesión abierta.
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
