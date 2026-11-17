import api from "../lib/api";
import { Category, Nominee } from "../@types/NomineeType";

export interface NomineeWithStatus extends Nominee {
  Winner?: boolean;
  winner?: boolean;
}

export interface CategoryWithNominees extends Category {
  nominees: NomineeWithStatus[];
}

export interface WinnerItem {
  category: Category;
  winnerNominee: NomineeWithStatus | null;
}

export interface WinnersResponse {
  year: number;
  years: number[];
  categories: WinnerItem[];
}

export interface EventConfigResponse {
  eventDate: string | null;
}

const DEFAULT_TTL_MS = 300_000;

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();
let catalogEpoch = 0;
let eventEpoch = 0;

async function cachedGet<T>(
  key: string,
  loader: () => Promise<T>,
  options: { ttlMs?: number; force?: boolean; domain?: "catalog" | "event" } = {}
): Promise<T> {
  const { ttlMs = DEFAULT_TTL_MS, force = false, domain = "catalog" } = options;

  if (!force) {
    const existing = cache.get(key);
    if (existing && existing.expiresAt > Date.now()) {
      return existing.value as T;
    }

    const pending = inFlight.get(key);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  const startEpoch = domain === "event" ? eventEpoch : catalogEpoch;
  const promise = (async () => {
    try {
      const value = await loader();
      const currentEpoch = domain === "event" ? eventEpoch : catalogEpoch;
      if (currentEpoch === startEpoch) {
        cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      }
      return value;
    } finally {
      inFlight.delete(key);
    }
  })();

  if (!force) {
    inFlight.set(key, promise);
  }
  return promise;
}

function invalidateByPrefix(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export const dataService = {
  invalidateCatalogCache: () => {
    catalogEpoch += 1;
    invalidateByPrefix("catalog:");
  },

  invalidateEventCache: () => {
    eventEpoch += 1;
    invalidateByPrefix("event:");
  },

  getYears: async (force = false) => {
    return cachedGet<number[]>(
      "catalog:years",
      async () => {
        const { data } = await api.get<number[]>("/categories/years");
        return data;
      },
      { ttlMs: 60_000, force }
    );
  },

  getCategories: async (year?: number, force = false) => {
    const query = year ? `?year=${year}` : "";
    return cachedGet<Category[]>(
      `catalog:categories:${year ?? "latest"}`,
      async () => {
        const { data } = await api.get<Category[]>(`/categories${query}`);
        return data;
      },
      { force }
    );
  },

  getCategoriesWithNominees: async (year?: number, force = false) => {
    const query = year ? `?include=nominees&year=${year}` : "?include=nominees";
    return cachedGet<CategoryWithNominees[]>(
      `catalog:categoriesWithNominees:${year ?? "latest"}`,
      async () => {
        const { data } = await api.get<CategoryWithNominees[]>(
          `/categories${query}`
        );
        return data;
      },
      { force }
    );
  },

  getNomineesByCategory: async (categoryId: number, force = false) => {
    return cachedGet<NomineeWithStatus[]>(
      `catalog:nominees:${categoryId}`,
      async () => {
        const { data } = await api.get<NomineeWithStatus[]>(
          `/categories/${categoryId}/nominees`
        );
        return data;
      },
      { force }
    );
  },

  getAllNominees: async () => {
    const categories = await dataService.getCategoriesWithNominees();
    return categories.flatMap((category) => category.nominees ?? []);
  },

  getCachedWinners: (year?: number): WinnersResponse | null => {
    const key = `catalog:winners:${year ?? "latest"}`;
    const existing = cache.get(key);
    if (existing && existing.expiresAt > Date.now()) {
      return existing.value as WinnersResponse;
    }
    return null;
  },

  getWinners: async (year?: number, force = false) => {
    const query = year ? `?year=${year}` : "";
    const result = await cachedGet<WinnersResponse>(
      `catalog:winners:${year ?? "latest"}`,
      async () => {
        const { data } = await api.get<WinnersResponse>(
          `/categories/winners${query}`
        );
        return data;
      },
      { force }
    );
    if (!year && result.year) {
      cache.set(`catalog:winners:${result.year}`, {
        value: result,
        expiresAt: Date.now() + DEFAULT_TTL_MS,
      });
    }
    return result;
  },

  getEvent: async (force = false) => {
    return cachedGet<EventConfigResponse>(
      "event:config",
      async () => {
        const { data } = await api.get<EventConfigResponse>("/event");
        return data;
      },
      { force, domain: "event" }
    );
  },
};
