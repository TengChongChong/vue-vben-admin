import { nextTick, onMounted, type Ref } from 'vue';

import { useSortable } from '@vben/hooks';
import { isNullOrUnDef } from '@vben/utils';

export function useFieldConfigSortable<T>(
  containerClass: string,
  configRef: Ref<T[]>,
) {
  async function initSortable() {
    await nextTick();
    const el = document.querySelector(
      `.${containerClass}`,
    ) as HTMLElement | null;
    if (!el) {
      return;
    }

    const { initializeSortable } = useSortable(el, {
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (
          isNullOrUnDef(oldIndex) ||
          isNullOrUnDef(newIndex) ||
          oldIndex === newIndex
        ) {
          return;
        }
        const enabledItems = configRef.value.filter(
          (item) => (item as { isEnable?: boolean }).isEnable,
        );
        const movedItem = enabledItems[oldIndex];
        if (!movedItem) {
          return;
        }
        enabledItems.splice(oldIndex, 1);
        enabledItems.splice(newIndex, 0, movedItem);

        const disabledItems = configRef.value.filter(
          (item) => !(item as { isEnable?: boolean }).isEnable,
        );
        configRef.value = [...enabledItems, ...disabledItems] as T[];
      },
    });

    await initializeSortable();
  }

  onMounted(() => {
    initSortable();
  });

  return { initSortable };
}
