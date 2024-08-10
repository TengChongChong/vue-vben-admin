import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

interface MakeAuthorization {
  key?: string;
  tokenHandler: () => { refreshToken: string; token: string } | null;
  unAuthorizedHandler?: () => Promise<void>;
}

interface MakeRequestHeaders {
  'Accept-Language'?: string;
}

type MakeAuthorizationFn = (
  config?: InternalAxiosRequestConfig,
) => MakeAuthorization;

type MakeRequestHeadersFn = (
  config?: InternalAxiosRequestConfig,
) => MakeRequestHeaders;

type MakeErrorMessageFn = (message: string) => void;
type MakeMessageFn = (type: string, message: string) => void;

interface RequestClientOptions extends CreateAxiosDefaults {
  /**
   * 用于生成Authorization
   */
  makeAuthorization?: MakeAuthorizationFn;
  /**
   * 用于生成错误消息
   */
  makeErrorMessage?: MakeErrorMessageFn;
  /**
   * 用于生成消息
   */
  makeMessage?: MakeMessageFn;
  /**
   * 用于生成请求头
   */
  makeRequestHeaders?: MakeRequestHeadersFn;
}

interface HttpResponse<T = any> {
  // 请求是否成功
  success: boolean;
  // 响应数据
  data?: T;
  // 错误码
  errorCode?: string;
  // 错误提示，用于显示给用户
  errorMessage?: string;
  // 错误显示方式
  showType?: string;
  // 唯一请求Id，方便后端排查故障
  traceId?: string;
  // 当前访问服务节点，方便后端排查故障
  host?: string;
}

export type {
  HttpResponse,
  MakeAuthorizationFn,
  MakeErrorMessageFn,
  MakeMessageFn,
  MakeRequestHeadersFn,
  RequestClientOptions,
  RequestContentType,
};
