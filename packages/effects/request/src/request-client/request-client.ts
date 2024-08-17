import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

import type {
  HttpResponse,
  MakeAuthorizationFn,
  MakeErrorMessageFn,
  MakeMessageFn,
  MakeRequestHeadersFn,
  RequestClientOptions,
} from './types';

import { $t } from '@vben/locales';
import { merge } from '@vben/utils';

import axios from 'axios';

import { ErrorCodeEnum } from './enum';
import { FileDownloader } from './modules/downloader';
import { InterceptorManager } from './modules/interceptor';
import { FileUploader } from './modules/uploader';

class RequestClient {
  private instance: AxiosInstance;
  private makeAuthorization: MakeAuthorizationFn | undefined;
  private makeErrorMessage: MakeErrorMessageFn | undefined;
  private makeMessage: MakeMessageFn | undefined;
  private makeRequestHeaders: MakeRequestHeadersFn | undefined;

  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public download: FileDownloader['download'];
  public upload: FileUploader['upload'];

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    this.bindMethods();
    // 合并默认配置和传入的配置
    const defaultConfig: CreateAxiosDefaults = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      // 默认超时时间
      timeout: 10_000,
    };
    const {
      makeAuthorization,
      makeErrorMessage,
      makeMessage,
      makeRequestHeaders,
      ...axiosConfig
    } = options;
    const requestConfig = merge(axiosConfig, defaultConfig);

    this.instance = axios.create(requestConfig);
    this.makeAuthorization = makeAuthorization;
    this.makeRequestHeaders = makeRequestHeaders;
    this.makeErrorMessage = makeErrorMessage;
    this.makeMessage = makeMessage;

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);

    // 设置默认的拦截器
    this.setupInterceptors();
  }

  private bindMethods() {
    const propertyNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    );
    propertyNames.forEach((propertyName) => {
      const propertyValue = (this as any)[propertyName];
      if (
        typeof propertyValue === 'function' &&
        propertyName !== 'constructor'
      ) {
        (this as any)[propertyName] = propertyValue.bind(this);
      }
    });
  }

  private setupDefaultResponseInterceptor() {
    this.addRequestInterceptor(
      (config: InternalAxiosRequestConfig) => {
        const authorization = this.makeAuthorization?.(config);
        if (authorization) {
          const { token } = authorization.tokenHandler?.() ?? {};
          config.headers[authorization.key || 'Authorization'] = token;
        }

        const requestHeader = this.makeRequestHeaders?.(config);

        if (requestHeader) {
          for (const [key, value] of Object.entries(requestHeader)) {
            config.headers[key] = value;
          }
        }

        return config;
      },
      (error: any) => Promise.reject(error),
    );
    this.addResponseInterceptor(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        // 自定义Error处理
        const { response } = error || {};
        const responseData: HttpResponse = response?.data;
        let errMsg = '';
        let errorShowType: string = 'error';

        if (responseData) {
          // 后端业务有响应数据
          const { showType, errorMessage, errorCode } = responseData;
          if (showType) {
            errorShowType = showType;
          }
          // 错误提示内容
          if (errorMessage) {
            errMsg = errorMessage;
          }

          if (ErrorCodeEnum.SESSION_INVALID_CODE === errorCode) {
            // 会话失效
            this.makeAuthorization?.().unAuthorizedHandler?.();
          }
        }

        const err: string = error?.toString?.() ?? '';
        if (err?.includes('Network Error')) {
          errMsg = $t('fallback.http.networkError');
        } else if (error?.message?.includes?.('timeout')) {
          errMsg = $t('fallback.http.requestTimeout');
        }
        if (errMsg) {
          this.makeMessage?.(errorShowType, errMsg);
          return Promise.reject(error);
        }

        let errorMessage: string;
        const status = error?.response?.status;

        switch (status) {
          case 400: {
            errorMessage = $t('fallback.http.badRequest');
            break;
          }

          case 401: {
            errorMessage = $t('fallback.http.unauthorized');
            this.makeAuthorization?.().unAuthorizedHandler?.();
            break;
          }
          case 403: {
            errorMessage = $t('fallback.http.forbidden');
            break;
          }
          // 404请求不存在
          case 404: {
            errorMessage = $t('fallback.http.notFound');
            break;
          }
          case 408: {
            errorMessage = $t('fallback.http.requestTimeout');

            break;
          }
          default: {
            errorMessage = $t('fallback.http.internalServerError');
          }
        }

        this.makeErrorMessage?.(errorMessage);
        return Promise.reject(error);
      },
    );
  }

  private setupInterceptors() {
    // 默认拦截器
    this.setupDefaultResponseInterceptor();
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
      });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
}

export { RequestClient };
