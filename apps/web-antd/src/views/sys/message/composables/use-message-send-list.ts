import type { Page } from '#/api/base/model/page-model';
import type { SysMessage } from '#/api';

import { computed, reactive, ref } from 'vue';

import { selectSysMessageApi } from '#/api';

export function useMessageSendList(pageType: string) {
  const loading = ref(false);
  const records = ref<SysMessage[]>([]);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(15);

  const query = reactive({
    title: '',
    startSendDate: undefined as string | undefined,
    endSendDate: undefined as string | undefined,
  });

  const selectedIds = ref<string[]>([]);

  const allChecked = computed({
    get() {
      return (
        records.value.length > 0 &&
        records.value.every(
          (item) => !!item.id && selectedIds.value.includes(item.id),
        )
      );
    },
    set(checked: boolean) {
      selectedIds.value = checked
        ? records.value
            .map((item) => item.id)
            .filter((id): id is string => !!id)
        : [];
    },
  });

  const indeterminate = computed(() => {
    const count = records.value.filter(
      (item) => !!item.id && selectedIds.value.includes(item.id),
    ).length;
    return count > 0 && count < records.value.length;
  });

  async function fetchList() {
    loading.value = true;
    try {
      const page: Page<SysMessage> = {
        current: current.value,
        pageSize: pageSize.value,
      };
      const params: SysMessage = {
        title: query.title || undefined,
        startSendDate: query.startSendDate,
        endSendDate: query.endSendDate,
        status: pageType,
      };
      const res = await selectSysMessageApi(params, page);
      records.value = res.records ?? [];
      total.value = res.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  function handleSearch() {
    current.value = 1;
    selectedIds.value = [];
    return fetchList();
  }

  function handlePageChange(page: number, size: number) {
    current.value = page;
    pageSize.value = size;
    return fetchList();
  }

  function toggleSelect(id: string, checked: boolean) {
    if (checked) {
      if (!selectedIds.value.includes(id)) {
        selectedIds.value = [...selectedIds.value, id];
      }
    } else {
      selectedIds.value = selectedIds.value.filter((item) => item !== id);
    }
  }

  function isSelected(id?: string) {
    return !!id && selectedIds.value.includes(id);
  }

  function clearSelection() {
    selectedIds.value = [];
  }

  return {
    allChecked,
    clearSelection,
    current,
    fetchList,
    handlePageChange,
    handleSearch,
    indeterminate,
    isSelected,
    loading,
    pageSize,
    query,
    records,
    selectedIds,
    toggleSelect,
    total,
  };
}
