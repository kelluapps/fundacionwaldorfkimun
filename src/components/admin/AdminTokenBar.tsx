import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminToken, setAdminToken } from "@/lib/kimun-api";

export default function AdminTokenBar({ onChange }: { onChange?: (t: string) => void }) {
  const [token, setToken] = useState<string>(() => getAdminToken());
  useEffect(() => {
    setAdminToken(token);
    onChange?.(token);
  }, [token, onChange]);
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-4 mb-4 flex items-center gap-3">
      <KeyRound className="w-4 h-4 text-secondary shrink-0" />
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="ADMIN_TOKEN (sólo en esta sesión)"
        className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
      />
    </div>
  );
}
