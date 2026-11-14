export type UseProfileCatalogRefreshResult = {
  refreshing: boolean;
  handleRefreshCatalog: () => Promise<void>;
};
