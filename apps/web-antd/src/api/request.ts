/**
 * 该文件可自行根据业务逻辑进行调整
 */

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
  type ResponseInterceptorConfig,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
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

  /**
   * 通用的错误处理
   */
  const easyVbenErrorMessageResponseInterceptor =
    (): ResponseInterceptorConfig => {
      return {
        rejected: (error: any) => {
          // eslint-disable-next-line no-unsafe-optional-chaining
          const { errorMessage, showType } = error?.response?.data;
          if (errorMessage) {
            // 如果后端有响应错误消息
            message.open({
              type: showType || 'error',
              content: errorMessage,
            });
            return Promise.reject(error);
          }

          // 使用通用错误消息提示
          return errorMessageResponseInterceptor((msg: string) =>
            message.error(msg),
          );
        },
      };
    };

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // response数据解构
  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { data: responseData, status } = response;

      const { success, data, errorMessage } = responseData;
      if (success) {
        return data;
      }
      throw new Error(`Error ${status}: ${errorMessage}`);
    },
  });

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

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(easyVbenErrorMessageResponseInterceptor());

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
