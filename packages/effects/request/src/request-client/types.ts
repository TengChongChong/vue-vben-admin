import type {
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type RequestResponse<T = any> = AxiosResponse<T>;

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: InternalAxiosRequestConfig,
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: AxiosResponse<T>,
  ) => AxiosResponse | Promise<AxiosResponse>;
  rejected?: (error: any) => any;
}

type MakeErrorMessageFn = (message: string, error: any) => void;

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

// multipart/form-data: upload file
interface UploadFileParams {
  // Other parameters
  data?: any;
  // File parameter interface field name
  name?: string;
  // file name
  file: Blob | File;
  // file name
  filename?: string;
  [key: string]: any;
}

/**
 * 上传文件响应对象
 */
interface FileUploadResponse {
  // 显示名称
  displayName: string;
  // 文件名称
  name: string;
  // 根目录（local - 文件夹名称 / oss - bucket名称）
  bucketName: string;
  // local - 文件路径 /  oss - objectName
  objectName: string;
  // url
  url: string;
  // 大小
  size: number;
  // 后缀
  suffix: string;
  // 内容类型
  contentType: string;
}

export type {
  FileUploadResponse,
  HttpResponse,
  MakeErrorMessageFn,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
  UploadFileParams,
};
