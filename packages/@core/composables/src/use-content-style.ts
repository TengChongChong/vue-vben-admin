import type { CSSProperties } from 'vue';
import { computed, nextTick, onMounted, ref } from 'vue';

import {
  CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
  CSS_VARIABLE_LAYOUT_CONTENT_WIDTH,
} from '@vben-core/shared/constants';
import {
  getElementVisibleRect,
  type VisibleDomRect,
} from '@vben-core/shared/utils';

import { useCssVar, useDebounceFn } from '@vueuse/core';

/**
 * @zh_CN content style
 */
function useContentStyle() {
  const contentElement = ref<HTMLDivElement | null>(null);
  const visibleDomRect = ref<null | VisibleDomRect>(null);
  const contentHeight = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT);
  const contentWidth = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_WIDTH);

  const overlayStyle = computed((): CSSProperties => {
    const { height, left, top, width } = visibleDomRect.value ?? {};
    return {
      height: `${height}px`,
      left: `${left}px`,
      position: 'fixed',
      top: `${top}px`,
      width: `${width}px`,
      zIndex: 150,
    };
  });

  const debouncedCalcHeight = useDebounceFn(
    (_entries: ResizeObserverEntry[]) => {
      visibleDomRect.value = getElementVisibleRect(contentElement.value);
      contentHeight.value = `${visibleDomRect.value.height}px`;
      contentWidth.value = `${visibleDomRect.value.width}px`;
    },
    100,
  );

  onMounted(() => {
    nextTick(() => {
      if (contentElement.value) {
        const observer = new ResizeObserver(debouncedCalcHeight);
        observer.observe(contentElement.value);
      }
    });
  });

  return { contentElement, overlayStyle, visibleDomRect };
}

export { useContentStyle };
