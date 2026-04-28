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
