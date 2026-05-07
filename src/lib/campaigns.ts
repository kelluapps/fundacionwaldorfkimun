// Store local de campañas (mock) preparado para conectar al Worker externo.
// No usa Lovable Cloud ni Supabase. Persistencia: localStorage.

import {
  Hammer,
  Armchair,
  Music2,
  BookOpen,
  TreePine,
  Heart,
  Smile,
  Droplets,
  Plus as CrossIcon,
  Eye,
  HandHeart,
  Brain,
  type LucideIcon,
} from "lucide-react";

export type CampaignIconKey =
  | "hammer"
  | "armchair"
  | "piano"
  | "books"
  | "tree"
  | "heart"
  | "smile"
  | "droplet"
  | "cross"
  | "eye"
  | "hands"
  | "brain";

export const ICON_REGISTRY: Record<CampaignIconKey, { label: string; Icon: LucideIcon }> = {
  hammer:   { label: "Martillos",        Icon: Hammer },
  armchair: { label: "Asientos",         Icon: Armchair },
  piano:    { label: "Teclas de piano",  Icon: Music2 },
  books:    { label: "Libros",           Icon: BookOpen },
  tree:     { label: "Árboles",          Icon: TreePine },
  heart:    { label: "Corazones",        Icon: Heart },
  smile:    { label: "Caritas felices",  Icon: Smile },
  droplet:  { label: "Gotas de lluvia",  Icon: Droplets },
  cross:    { label: "Cruz de salud",    Icon: CrossIcon },
  eye:      { label: "Ojos",             Icon: Eye },
  hands:    { label: "Manos",            Icon: HandHeart },
  brain:    { label: "Cabeza",           Icon: Brain },
};

export type CampaignStatus = "principal" | "active" | "inactive";

export type Campaign = {
  id: string;
  /** Estado público de la campaña. "principal" se muestra en /donar, "active" en /campanas/{id}, "inactive" oculta. */
  status?: CampaignStatus;
  /** @deprecated Mantener por compatibilidad. Si true equivale a principal. */
  active: boolean;
  title: string;
  badge: string;
  preTitle: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  goal: number;
  raised: number;
  unitSingular: string;
  unitPlural: string;
  unitPublicName: string;
  unitAmount: number;
  unitIcon: CampaignIconKey;
  imageUrl: string;
  videoUrl?: string;
  /** ID real de la campaña en el Worker (API externa). Si está presente, se usa para fetch + donación. */
  remoteCampaignId?: string;
  // Upsell mensual (configurable por campaña)
  upsellMonthlyEnabled?: boolean;
  upsellTitle?: string;
  upsellMessage?: string;
  upsellPrimaryButtonText?: string;
  upsellSecondaryButtonText?: string;
  upsellPrimaryAction?: string;
  updatedAt: string;
};

export const DEFAULT_UPSELL = {
  upsellMonthlyEnabled: true,
  upsellTitle: "¿Te gustaría que tu donación sea mensual?",
  upsellMessage:
    "Con un aporte mensual nos ayudas a sostener en el tiempo el sueño de Kimün: talleres, espacios de aprendizaje y oportunidades reales para niñas, niños, jóvenes y adultos de nuestra comunidad. Es un gesto pequeño que se convierte en raíz profunda.",
  upsellPrimaryButtonText: "Sííí, quiero hacerme socio 🌱",
  upsellSecondaryButtonText: "No, por ahora solo donaré a este proyecto",
  upsellPrimaryAction: "/socios",
};

const STORAGE_KEY = "kimun.campaigns.v1";

const defaultSeed = (): Campaign[] => [
  {
    id: "taller-carpinteria",
    active: true,
    status: "principal",
    title: "Taller de Carpintería",
    badge: "Campaña del mes",
    preTitle: "Creemos juntos un",
    subtitle: "Para toda la comunidad",
    shortDescription: "Un espacio para aprender, crear, compartir y construir juntos.",
    longDescription:
      "Este taller será para los niños de Kimün, y en las tardes estará abierto para toda la comunidad, especialmente para personas adultas mayores que quieran iniciarse o seguir creciendo en el oficio de la carpintería.",
    goal: 5_000_000,
    raised: 0,
    unitSingular: "martillo",
    unitPlural: "martillos",
    unitPublicName: "Martillos solidarios",
    unitAmount: 5000,
    unitIcon: "hammer",
    imageUrl: "",
    videoUrl: "",
    remoteCampaignId: "taller-carpinteria",
    updatedAt: new Date().toISOString(),
  },
];

export function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return defaultSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = defaultSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Campaign[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultSeed();
    return parsed;
  } catch {
    return defaultSeed();
  }
}

export function saveCampaigns(items: Campaign[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("kimun:campaigns-updated"));
}

/** Normaliza el status leyendo `status` o derivándolo del legacy `active`. */
export function getStatus(c: Campaign): CampaignStatus {
  if (c.status) return c.status;
  return c.active ? "principal" : "inactive";
}

export function upsertCampaign(c: Campaign) {
  const items = loadCampaigns();
  const idx = items.findIndex((x) => x.id === c.id);
  // Sincronizar legacy `active` con `status`
  const status = c.status ?? (c.active ? "principal" : "inactive");
  const updated: Campaign = {
    ...c,
    status,
    active: status === "principal",
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) items[idx] = updated;
  else items.unshift(updated);
  // Solo puede haber UNA campaña principal
  if (status === "principal") {
    items.forEach((x) => {
      if (x.id !== updated.id && getStatus(x) === "principal") {
        x.status = "active";
        x.active = false;
      }
    });
  }
  saveCampaigns(items);
}

export function deleteCampaign(id: string) {
  const items = loadCampaigns().filter((x) => x.id !== id);
  saveCampaigns(items);
}

/** Define la campaña principal (causa del mes). Las otras principales pasan a "active". */
export function setMainCampaign(id: string) {
  const items = loadCampaigns().map((x) => {
    if (x.id === id) return { ...x, status: "principal" as CampaignStatus, active: true };
    if (getStatus(x) === "principal") return { ...x, status: "active" as CampaignStatus, active: false };
    return { ...x, active: false };
  });
  saveCampaigns(items);
}

/** @deprecated usar setMainCampaign */
export const setActiveCampaign = setMainCampaign;

export function setCampaignStatus(id: string, status: CampaignStatus) {
  if (status === "principal") return setMainCampaign(id);
  const items = loadCampaigns().map((x) =>
    x.id === id ? { ...x, status, active: false } : x,
  );
  saveCampaigns(items);
}

export function getMainCampaign(): Campaign | null {
  const items = loadCampaigns();
  return items.find((x) => getStatus(x) === "principal") ?? items[0] ?? null;
}

/** @deprecated usar getMainCampaign */
export const getActiveCampaign = getMainCampaign;

export function getCampaignById(id: string): Campaign | null {
  return loadCampaigns().find((x) => x.id === id) ?? null;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

import { useEffect, useState } from "react";

export function useCampaigns() {
  const [items, setItems] = useState<Campaign[]>(() => loadCampaigns());
  useEffect(() => {
    const handler = () => setItems(loadCampaigns());
    window.addEventListener("kimun:campaigns-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kimun:campaigns-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return items;
}

export function useMainCampaign() {
  const items = useCampaigns();
  return items.find((x) => getStatus(x) === "principal") ?? items[0] ?? null;
}

/** @deprecated usar useMainCampaign */
export const useActiveCampaign = useMainCampaign;

export function useCampaignById(id: string | undefined) {
  const items = useCampaigns();
  if (!id) return null;
  return items.find((x) => x.id === id) ?? null;
}
