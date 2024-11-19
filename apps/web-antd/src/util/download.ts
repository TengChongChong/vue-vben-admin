import { downloadFileFromUrl } from '@vben/utils';

/**
 * 下载文件
 *
 * @param id {string} 文件下载id
 */
export function downloadFileById(id: string) {
  downloadFileFromUrl({
    source: `${import.meta.env.VITE_GLOB_API_URL}/file/download/${id}`,
  });
}
