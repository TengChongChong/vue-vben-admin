import type { RequestClient } from '@vben/request';

let requestClient: null | RequestClient = null;
let baseRequestClient: null | RequestClient = null;

/**
 * 注入请求客户端，应在应用入口（如 bootstrap）创建 requestClient 后调用
 * @param client 带拦截器的主请求客户端（用于业务接口）
 * @param base 可选，用于 refresh/logout 等不经过业务拦截器的客户端；未传时与 client 共用
 */
export function setRequestClient(client: RequestClient, base?: RequestClient) {
  requestClient = client;
  baseRequestClient = base ?? client;
}

/**
 * 获取已注入的请求客户端，供 API 模块内部使用
 */
export function getRequestClient(): RequestClient {
  if (!requestClient) {
    throw new Error(
      '[@vben/api] requestClient 未注入，请在应用入口调用 setRequestClient(requestClient)',
    );
  }
  return requestClient;
}

/**
 * 获取 base 请求客户端（用于 refreshToken、logout 等）
 */
export function getBaseRequestClient(): RequestClient {
  if (!baseRequestClient) {
    throw new Error(
      '[@vben/api] requestClient 未注入，请在应用入口调用 setRequestClient(requestClient)',
    );
  }
  return baseRequestClient;
}
