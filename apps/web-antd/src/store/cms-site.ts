import type { CmsSite } from '#/api';

import { defineStore } from 'pinia';

import {
  getUserActiveSiteApi,
  selectCmsSiteApi,
  setUserActiveSiteApi,
} from '#/api';

interface CmsSiteState {
  /** 是否已完成首次加载 */
  initialized: boolean;
  loading: boolean;
  switching: boolean;
  activeSite: CmsSite | null;
  siteList: CmsSite[];
}

/**
 * CMS 当前编辑站点上下文
 */
export const useCmsSiteStore = defineStore('cms-site', {
  state: (): CmsSiteState => ({
    initialized: false,
    loading: false,
    switching: false,
    activeSite: null,
    siteList: [],
  }),
  getters: {
    hasActiveSite(state): boolean {
      return !!state.activeSite?.id;
    },
    activeSiteId(state): string {
      return state.activeSite?.id ?? '';
    },
    activeSiteName(state): string {
      return state.activeSite?.name ?? '';
    },
    /** 可切换（启用站点超过 1 个） */
    switchable(state): boolean {
      return state.siteList.filter((item) => item.status === '1').length > 1;
    },
  },
  actions: {
    reset() {
      this.initialized = false;
      this.loading = false;
      this.switching = false;
      this.activeSite = null;
      this.siteList = [];
    },
    async ensureLoaded() {
      if (this.initialized || this.loading) {
        return;
      }
      await this.refresh();
    },
    async refresh() {
      this.loading = true;
      try {
        const [activeSite, siteList] = await Promise.all([
          getUserActiveSiteApi(),
          selectCmsSiteApi(),
        ]);
        this.activeSite = activeSite ?? null;
        this.siteList = (siteList ?? []).filter((item) => item.status === '1');
        this.initialized = true;
      } finally {
        this.loading = false;
      }
    },
    async switchSite(siteId: string) {
      if (!siteId || siteId === this.activeSiteId) {
        return;
      }
      this.switching = true;
      try {
        await setUserActiveSiteApi({ id: siteId });
        const activeSite = await getUserActiveSiteApi();
        this.activeSite = activeSite ?? null;
        if (!this.siteList.some((item) => item.id === siteId)) {
          await this.refresh();
        }
      } finally {
        this.switching = false;
      }
    },
  },
});
