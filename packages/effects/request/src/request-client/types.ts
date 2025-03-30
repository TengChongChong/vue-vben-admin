import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type ExtendOptions<T = any> = {
  /**
   * 参数序列化方式。预置的有
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   */
  paramsSerializer?:
    | 'brackets'
    | 'comma'
    | 'indices'
    | 'repeat'
    | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};
type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

type RequestContentType =
  | 'application/json;charset=utf-8'
  | 'application/octet-stream;charset=utf-8'
  | 'application/x-www-form-urlencoded;charset=utf-8'
  | 'multipart/form-data;charset=utf-8';

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) =>
    | (ExtendOptions & InternalAxiosRequestConfig<any>)
    | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: RequestResponse<T>,
  ) => Promise<RequestResponse> | RequestResponse;
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
  RequestClientConfig,
  RequestClientOptions,
  RequestContentType,
  RequestInterceptorConfig,
  RequestResponse,
  ResponseInterceptorConfig,
  UploadFileParams,
};
