export const KIMUN_API_BASE =
  "https://kimun-donaciones-worker.jorgeaguirrecanciones.workers.dev";

export const HAMMER_PRICE = 5_000;

export type KimunCampaign = {
  id: string;
  title: string;
  goal: number;
  raised: number;
};

export async function fetchCampaigns(signal?: AbortSignal): Promise<KimunCampaign[]> {
  const res = await fetch(`${KIMUN_API_BASE}/campaigns`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export type DonateInput = {
  amount: number;
  campaignId: string;
  name: string;
  email: string;
};

export async function createDonation(input: DonateInput): Promise<{ redirectUrl: string }> {
  const res = await fetch(`${KIMUN_API_BASE}/donate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Donación falló (${res.status}): ${text || "error desconocido"}`);
  }
  const data = await res.json();
  if (!data?.redirectUrl) throw new Error("Respuesta sin redirectUrl");
  return data;
}

export const formatCLP = (n: number) => "$" + (n ?? 0).toLocaleString("es-CL");

const ADMIN_TOKEN_KEY = "kimun.adminToken";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export type SaveCampaignResult =
  | { ok: true }
  | { ok: false; reason: "unauthorized" | "network" | "server"; message: string };

export async function putCampaign(
  campaignId: string,
  body: Record<string, unknown>,
  token: string,
): Promise<SaveCampaignResult> {
  if (!token) {
    return { ok: false, reason: "unauthorized", message: "Token de administrador incorrecto" };
  }
  try {
    const res = await fetch(`${KIMUN_API_BASE}/campaigns/${encodeURIComponent(campaignId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "unauthorized", message: "Token de administrador incorrecto" };
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, reason: "server", message: `Error ${res.status}: ${text || "desconocido"}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "network", message: "No pudimos conectar con el Worker" };
  }
}

