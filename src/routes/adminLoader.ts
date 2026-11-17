let adminPrefetchPromise: Promise<unknown> | null = null;

export const loadAdminPage = () => import("../pages/Admin");

export const prefetchAdminPage = (): Promise<unknown> => {
  if (!adminPrefetchPromise) {
    adminPrefetchPromise = loadAdminPage().catch((err) => {
      adminPrefetchPromise = null;
      throw err;
    });
  }
  return adminPrefetchPromise;
};
