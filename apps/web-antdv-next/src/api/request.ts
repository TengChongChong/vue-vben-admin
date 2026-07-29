/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { refreshTokenApi, setRequestClient } from '@vben/api';
import {
  shouldAttachTenantHeader,
  TENANT_HEADER,
  TENANT_NOT_ASSIGNED_ERROR_CODE,
} from '@vben/constants';
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore, useTenantStore } from '@vben/stores';

import { message } from 'antdv-next';

import { useAuthStore } from '#/store';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

/** 防止并发 05005 重复触发 logout */
let tenantNotAssignedLoggingOut = false;

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();
      const tenantStore = useTenantStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;

      const tenantId = tenantStore.headerTenantId;
      const url = config.url ?? '';
      if (tenantId && shouldAttachTenantHeader(url)) {
        config.headers[TENANT_HEADER] = tenantId;
      }

      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'success',
      dataField: 'data',
      successCode: true,
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      if (error.config.errorMessageMode === 'silent') {
        return Promise.reject(error);
      }

      if (error?.response) {
        const { errorCode, errorMessage, showType } = error.response.data;
        if (errorMessage) {
          // 如果后端有响应错误消息
          message.open({
            type: showType || 'error',
            content: errorMessage,
          });
          // 账号未分配租户：提示后退出会话
          if (
            errorCode === TENANT_NOT_ASSIGNED_ERROR_CODE &&
            !tenantNotAssignedLoggingOut
          ) {
            tenantNotAssignedLoggingOut = true;
            const authStore = useAuthStore();
            void authStore.logout(false).finally(() => {
              tenantNotAssignedLoggingOut = false;
            });
          }
          return Promise.reject(error);
        }
      }

      if (msg) {
        // 使用通用错误消息提示
        message.error(msg);
      }
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });

setRequestClient(requestClient, baseRequestClient);
