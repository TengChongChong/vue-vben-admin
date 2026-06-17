import type { Page } from '#/api/base/model/page-model';
import type { SysMessage } from '#/api';

import { computed, reactive, ref } from 'vue';

import { infoApi, removeByIdsApi, selectReceiveApi, setReadApi } from '#/api';

export type MessageReceiveFilter = 'all' | 'read' | 'unread';

const FILTER_STATUS_MAP: Record<MessageReceiveFilter, string | undefined> = {
  all: undefined,
  unread: '0',
  read: '1',
};

export function useMessageReceiveList(
  options: {
    onUnreadChange?: () => void;
    params?: SysMessage;
  } = {},
) {
  const loading = ref(false);
  const detailLoading = ref(false);
  const setReadBtnLoading = ref(false);
  const records = ref<SysMessage[]>([]);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(15);

  const query = reactive({
    title: '',
    filter: 'all' as MessageReceiveFilter,
    startSendDate: undefined as string | undefined,
    endSendDate: undefined as string | undefined,
  });

  const selectedIds = ref<string[]>([]);
  const activeReceiveId = ref<string>();
  const currentDetail = ref<SysMessage>();

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
        ...options.params,
        title: query.title || undefined,
        detailsStatus: FILTER_STATUS_MAP[query.filter],
        startSendDate: query.startSendDate,
        endSendDate: query.endSendDate,
      };
      const res = await selectReceiveApi(params, page);
      records.value = res.records ?? [];
      total.value = res.total ?? 0;

      if (
        activeReceiveId.value &&
        !records.value.some((item) => item.id === activeReceiveId.value)
      ) {
        activeReceiveId.value = undefined;
        currentDetail.value = undefined;
      }
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

  async function openMessage(id: string, messageId: string) {
    activeReceiveId.value = id;
    detailLoading.value = true;
    try {
      const res = await infoApi(id, messageId);
      currentDetail.value = res;
      if (!res.readDate) {
        options.onUnreadChange?.();
        await fetchList();
      }
      return res;
    } finally {
      detailLoading.value = false;
    }
  }

  async function markAllAsRead() {
    try {
      setReadBtnLoading.value = true;
      await setReadApi();
      options.onUnreadChange?.();
      await fetchList();
    } finally {
      setReadBtnLoading.value = false;
    }
  }

  async function markSelectedAsRead() {
    if (selectedIds.value.length === 0) {
      return;
    }
    try {
      setReadBtnLoading.value = true;
      await setReadApi(selectedIds.value.join(','));
      options.onUnreadChange?.();
      selectedIds.value = [];
      await fetchList();
    } finally {
      setReadBtnLoading.value = false;
    }
  }

  async function removeSelected() {
    if (selectedIds.value.length === 0) {
      return false;
    }
    const result = await removeByIdsApi(selectedIds.value.join(','));
    if (result) {
      if (
        activeReceiveId.value &&
        selectedIds.value.includes(activeReceiveId.value)
      ) {
        activeReceiveId.value = undefined;
        currentDetail.value = undefined;
      }
      selectedIds.value = [];
      await fetchList();
    }
    return result;
  }

  return {
    activeReceiveId,
    allChecked,
    current,
    currentDetail,
    detailLoading,
    fetchList,
    handlePageChange,
    handleSearch,
    indeterminate,
    isSelected,
    loading,
    markAllAsRead,
    markSelectedAsRead,
    openMessage,
    pageSize,
    query,
    records,
    removeSelected,
    selectedIds,
    setReadBtnLoading,
    toggleSelect,
    total,
  };
}
