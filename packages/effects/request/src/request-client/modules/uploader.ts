import type { AxiosRequestConfig } from 'axios';

import type { RequestClient } from '../request-client';
import type { FileUploadResponse, UploadFileParams } from '../types';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async upload(
    url: string,
    uploadFileParams: UploadFileParams,
    config?: AxiosRequestConfig,
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append(
      uploadFileParams.name || 'file',
      uploadFileParams.file,
      uploadFileParams.filename,
    );

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post(url, formData, finalConfig);
  }
}

export { FileUploader };
