/** 与后端 CommonStatus.ENABLE 一致 */
export const CMS_COMMON_STATUS_ENABLE = '1';

/**
 * 从 VITE_GLOB_API_URL 解析后端根地址（用于拼 /cms/route/...）
 */
export function getCmsPreviewOrigin(): string {
  const apiUrl = import.meta.env.VITE_GLOB_API_URL?.trim() ?? '';
  if (!apiUrl) {
    return window.location.origin;
  }
  return apiUrl.replace(/\/api\/?$/, '');
}

export function buildSitePreviewUrl(siteId: string): string {
  return `${getCmsPreviewOrigin()}/cms/route/${siteId}`;
}

export function buildColumnPreviewUrl(siteId: string, slug: string): string {
  return `${getCmsPreviewOrigin()}/cms/route/${siteId}/column/${encodeURIComponent(slug)}`;
}

export function buildArticlePreviewUrl(siteId: string, articleId: string): string {
  return `${getCmsPreviewOrigin()}/cms/route/${siteId}/article/${articleId}`;
}

export function openCmsPreview(url: string): void {
  if (!url) {
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
