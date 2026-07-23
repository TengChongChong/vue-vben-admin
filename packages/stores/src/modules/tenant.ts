import type { SessionTenant, SessionUser } from '@vben-core/typings';

import { acceptHMRUpdate, defineStore } from 'pinia';

/** 登录/切换租户时用于初始化 tenantStore 的载荷 */
export interface TenantBootstrapPayload {
  currentTenantId?: string;
  defaultTenantId?: string;
  enableMultiTenant?: boolean;
  tenantList?: SessionTenant[];
  tenantSwitchable?: boolean;
}

interface TenantState {
  /** 当前租户 ID */
  currentTenantId: string;
  /** 默认租户 ID */
  defaultTenantId: string;
  /** 是否启用多租户（后端 sys_config.enableMultiTenant） */
  enabled: boolean;
  /** 是否可切换租户 */
  switchable: boolean;
  /** 可访问租户列表 */
  tenantList: SessionTenant[];
}

const initialState = (): TenantState => ({
  enabled: false,
  currentTenantId: '',
  defaultTenantId: '',
  tenantList: [],
  switchable: false,
});

/**
 * 多租户运行时状态（以登录响应 / 会话用户为准，不读 preferences.tenantMode）
 */
export const useTenantStore = defineStore('core-tenant', {
  actions: {
    applyLoginResult(loginResult: TenantBootstrapPayload) {
      this.enabled = loginResult.enableMultiTenant === true;
      this.currentTenantId = loginResult.currentTenantId ?? '';
      this.defaultTenantId = loginResult.defaultTenantId ?? '';
      this.tenantList = (loginResult.tenantList ?? []) as SessionTenant[];
      this.switchable = loginResult.tenantSwitchable === true;
    },
    applySessionUser(user: null | Partial<SessionUser>) {
      if (!user) {
        return;
      }
      if (user.enableMultiTenant !== undefined) {
        this.enabled = user.enableMultiTenant === true;
      }
      if (user.currentTenantId !== undefined) {
        this.currentTenantId = user.currentTenantId ?? '';
      }
      if (user.defaultTenantId !== undefined) {
        this.defaultTenantId = user.defaultTenantId ?? '';
      }
      if (user.tenantList !== undefined) {
        this.tenantList = user.tenantList ?? [];
      }
      if (user.tenantSwitchable !== undefined) {
        this.switchable = user.tenantSwitchable === true;
      }
    },
    setCurrentTenantId(tenantId: string) {
      this.currentTenantId = tenantId;
    },
  },
  getters: {
    /** 当前应写入请求头的租户 ID */
    headerTenantId(state): string | undefined {
      if (!state.enabled || !state.currentTenantId) {
        return undefined;
      }
      return state.currentTenantId;
    },
  },
  state: initialState,
});

const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useTenantStore, hot));
}
