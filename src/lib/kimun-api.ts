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

export type SocioInput = {
  name: string;
  email: string;
  phone?: string;
  comment?: string;
  amount: number;
  campaignId?: string;
};

export async function createSocio(input: SocioInput): Promise<{ redirectUrl: string; intentId?: string }> {
  const res = await fetch(`${KIMUN_API_BASE}/socio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId: "socios-kimun", ...input }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Suscripción falló (${res.status}): ${text || "error desconocido"}`);
  }
  const data = await res.json();
  if (!data?.redirectUrl) throw new Error("Respuesta sin redirectUrl");
  return data;
}

const ADMIN_TOKEN_KEY = "kimun_admin_token";
export const ADMIN_UNAUTHORIZED_EVENT = "kimun:admin-unauthorized";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  setAdminToken("");
}

function notifyUnauthorized() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(ADMIN_UNAUTHORIZED_EVENT));
}

// =============================================================
// Admin: donaciones y socios
// =============================================================

export type AdminDonation = {
  id?: string;
  date: string; // ISO
  name: string;
  email: string;
  amount: number;
  campaignId?: string;
  campaignTitle?: string;
  status?: string;
};

export type AdminSocio = {
  id?: string;
  subscriptionId?: string;
  date: string; // ISO inscripción
  name: string;
  email: string;
  phone?: string;
  amount: number;
  plan?: string;
  status?: string;
  comment?: string;
  /** Pagos por mes del año actual: { "2026-01": 5000, ... } */
  monthlyPayments?: Record<string, number | "paid" | "pending" | "failed" | "canceled">;
};

export type AdminFetchResult<T> = {
  ok: boolean;
  items: T[];
  reason?: "unauthorized" | "network" | "server" | "missing";
  message?: string;
};

async function adminGet<T>(path: string, tokenArg?: string): Promise<AdminFetchResult<T>> {
  const token = tokenArg ?? getAdminToken();
  if (!token) {
    return { ok: false, items: [], reason: "unauthorized", message: "La clave secreta no es correcta o expiró. Vuelve a ingresarla." };
  }
  try {
    const res = await fetch(`${KIMUN_API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401 || res.status === 403) {
      notifyUnauthorized();
      return { ok: false, items: [], reason: "unauthorized", message: "La clave secreta no es correcta o expiró. Vuelve a ingresarla." };
    }
    if (res.status === 404) {
      return { ok: false, items: [], reason: "missing", message: "Endpoint pendiente de conectar en Worker" };
    }
    if (!res.ok) {
      return { ok: false, items: [], reason: "server", message: `Error ${res.status}` };
    }
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return { ok: true, items: items as T[] };
  } catch {
    return { ok: false, items: [], reason: "network", message: "No pudimos conectarnos con la API. Revisa tu clave." };
  }
}

export const fetchAdminDonations = (token?: string) => adminGet<AdminDonation>("/admin/donations", token);
export const fetchAdminDonantes = (token?: string) => adminGet<AdminDonation>("/admin/donantes", token);
export const fetchAdminSocios = (token?: string) => adminGet<AdminSocio>("/admin/socios", token);
export const fetchAdminSociosControl = (token?: string) => adminGet<AdminSocio>("/admin/socios-control", token);

// =============================================================
// Mocks de respaldo cuando los endpoints aún no existen
// =============================================================

export const MOCK_DONATIONS: AdminDonation[] = [
  { id: "d_001", date: "2026-05-02T10:30:00Z", name: "Jorge Aguirre", email: "jorge@ejemplo.cl", amount: 5000, campaignId: "taller-carpinteria", campaignTitle: "Taller de Carpintería", status: "paid" },
  { id: "d_002", date: "2026-05-01T15:12:00Z", name: "María Pérez", email: "maria@ejemplo.cl", amount: 10000, campaignId: "taller-carpinteria", campaignTitle: "Taller de Carpintería", status: "paid" },
  { id: "d_003", date: "2026-04-22T09:05:00Z", name: "Jorge Aguirre", email: "jorge@ejemplo.cl", amount: 10000, campaignId: "arboles", campaignTitle: "Árboles", status: "paid" },
  { id: "d_004", date: "2026-03-10T18:40:00Z", name: "Camila Soto", email: "camila@ejemplo.cl", amount: 20000, campaignId: "taller-carpinteria", campaignTitle: "Taller de Carpintería", status: "pending" },
  { id: "d_005", date: "2026-02-14T12:00:00Z", name: "Pedro Núñez", email: "pedro@ejemplo.cl", amount: 5000, campaignId: "arboles", campaignTitle: "Árboles", status: "paid" },
  { id: "d_006", date: "2026-01-20T20:00:00Z", name: "María Pérez", email: "maria@ejemplo.cl", amount: 5000, campaignId: "taller-carpinteria", campaignTitle: "Taller de Carpintería", status: "paid" },
];

export const MOCK_SOCIOS: AdminSocio[] = [
  { id: "s_001", subscriptionId: "sub_aaa", date: "2026-01-10T10:00:00Z", name: "Ana Rivera", email: "ana@ejemplo.cl", phone: "+56 9 1234 5678", amount: 5000, plan: "Brote", status: "activo", monthlyPayments: { "2026-01": "paid", "2026-02": "paid", "2026-03": "paid", "2026-04": "paid", "2026-05": "pending" } },
  { id: "s_002", subscriptionId: "sub_bbb", date: "2026-02-04T11:00:00Z", name: "Luis Fuentes", email: "luis@ejemplo.cl", phone: "+56 9 8765 4321", amount: 10000, plan: "Tronco", status: "activo", monthlyPayments: { "2026-02": "paid", "2026-03": "paid", "2026-04": "paid", "2026-05": "paid" } },
  { id: "s_003", subscriptionId: "sub_ccc", date: "2026-03-15T09:30:00Z", name: "Sofía Lagos", email: "sofia@ejemplo.cl", phone: "+56 9 4444 3333", amount: 20000, plan: "Copa", status: "activo", monthlyPayments: { "2026-03": "paid", "2026-04": "paid", "2026-05": "paid" } },
  { id: "s_004", subscriptionId: "sub_ddd", date: "2025-11-01T08:00:00Z", name: "Diego Vargas", email: "diego@ejemplo.cl", phone: "+56 9 5555 6666", amount: 5000, plan: "Brote", status: "cancelado", monthlyPayments: { "2026-01": "paid", "2026-02": "canceled" } },
];

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

