import { computed, unref } from 'vue';

import { formatSize } from '#/util/format';

export function useUploadType({
  acceptRef,
  helpTextRef,
  maxCountRef,
  maxSizeRef,
}) {
  /**
   * 文件类型限制
   */
  const getAccept = computed(() => {
    const accept = unref(acceptRef);
    if (accept && accept.length > 0) {
      return accept;
    }
    return [];
  });

  const getStringAccept = computed(() => {
    return unref(getAccept)
      .map((item: string) => {
        return item.indexOf('/') > 0 || item.startsWith('.')
          ? item
          : `.${item}`;
      })
      .join(',');
  });

  /**
   * 获取帮助提示（支持{0}格式，单个文件不超过{0}MB，最多只能上传{0}个文件。）
   */
  const getHelpText = computed(() => {
    const helpText = unref(helpTextRef);
    if (helpText) {
      return helpText;
    }
    const helpTexts: string[] = [];

    const accept = unref(acceptRef);
    if (accept?.length > 0) {
      helpTexts.push(`支持上传${accept.join('、')}格式文件`);
    }

    const maxSize = unref(maxSizeRef);
    if (maxSize) {
      helpTexts.push(`单个文件不超过${formatSize(maxSize * 1024, 1)}`);
    }

    const maxCount = unref(maxCountRef);
    if (maxCount && maxCount !== Infinity) {
      helpTexts.push(`最多支持上传${maxCount}个文件`);
    }
    return helpTexts.join('，');
  });
  return { getAccept, getStringAccept, getHelpText };
}
