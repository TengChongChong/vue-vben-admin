import type { CmsResource } from '#/api';

export const OBJECT_TYPE_LABEL: Record<string, string> = {
  'article-cover': '封面',
  'content-image': '正文图片',
  'content-video': '正文视频',
  'content-audio': '正文音频',
  'content-doc': '正文文档',
  'content-attachment': '正文附件',
};

export function getDisplayName(item: CmsResource) {
  return item.originalFilename || item.filename || item.id;
}

export function getSourceLabel(objectType?: string) {
  if (!objectType) {
    return '未知';
  }
  return OBJECT_TYPE_LABEL[objectType] || objectType;
}

export function isImage(item: CmsResource) {
  return (
    item.objectType === 'article-cover' ||
    item.objectType === 'content-image' ||
    !!item.contentType?.startsWith('image/')
  );
}

export function isVideo(item: CmsResource) {
  return (
    item.objectType === 'content-video' ||
    !!item.contentType?.startsWith('video/')
  );
}

export function isAudio(item: CmsResource) {
  return (
    item.objectType === 'content-audio' ||
    !!item.contentType?.startsWith('audio/')
  );
}
