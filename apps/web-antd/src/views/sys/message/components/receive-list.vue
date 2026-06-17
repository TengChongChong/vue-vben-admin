<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import type { SysMessage } from '#/api';

import { computed, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Empty,
  Input,
  Pagination,
  Segmented,
  Spin,
} from 'ant-design-vue';

import { removeByIdsApi } from '#/api';
import { ButtonRemove } from '#/components/button';
import { LucideMailCheck, LucideSearch } from '#/components/icons';
import { useMessageReceiveList } from '#/views/sys/message/composables/use-message-receive-list';

import InfoModal from './info-modal.vue';
import MessageDetailPanel from './message-detail-panel.vue';
import MessageListItem from './message-list-item.vue';

const props = withDefaults(
  defineProps<{
    onUnreadChange?: () => void;
    params?: SysMessage;
    showQuery?: boolean;
    title?: string;
  }>(),
  {
    onUnreadChange: undefined,
    params: () => ({}),
    title: '消息',
    showQuery: true,
  },
);

const emit = defineEmits<{
  unreadChange: [];
}>();

const compact = computed(() => !props.showQuery);
const detailDrawerOpen = ref(false);

const inboxBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  padding: 0,
};

const listBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  padding: 0,
};

const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
  { label: '已读', value: 'read' },
] as const;

function handleUnreadChange() {
  props.onUnreadChange?.();
  emit('unreadChange');
}

const {
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
  selectedIds,
  setReadBtnLoading,
  toggleSelect,
  total,
} = useMessageReceiveList({
  params: props.params,
  onUnreadChange: handleUnreadChange,
});

const [BaseInfoModal, baseInfoModalApi] = useVbenModal({
  connectedComponent: InfoModal,
});

const debouncedSearch = useDebounceFn(() => {
  handleSearch();
}, 300);

function handleFilterChange(value: number | string) {
  query.filter = value as typeof query.filter;
  handleSearch();
}

async function handleItemClick(message: SysMessage) {
  if (!message.id || !message.messageId) {
    return;
  }
  const detail = await openMessage(message.id, message.messageId);
  if (compact.value) {
    baseInfoModalApi.setData(detail);
    baseInfoModalApi.open();
    return;
  }
  if (window.innerWidth < 1024) {
    detailDrawerOpen.value = true;
  }
}

function handleMarkRead() {
  if (selectedIds.value.length > 0) {
    markSelectedAsRead();
    return;
  }
  markAllAsRead();
}

onMounted(() => {
  fetchList();
});
</script>

<template>
  <Card
    :bordered="compact"
    :body-style="inboxBodyStyle"
    class="h-full"
    :title="title"
  >
    <div
      v-if="showQuery"
      class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"
    >
      <div class="flex min-w-[200px] flex-1 flex-wrap items-center gap-3">
        <span class="text-base font-semibold whitespace-nowrap">{{
          title
        }}</span>
        <Input
          v-model:value="query.title"
          allow-clear
          class="max-w-xs"
          placeholder="搜索标题"
          @change="debouncedSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <LucideSearch class="size-4 text-muted-foreground" />
          </template>
        </Input>
        <Segmented
          :options="[...filterOptions]"
          :value="query.filter"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Checkbox
          v-if="records.length > 0"
          v-model:checked="allChecked"
          :indeterminate="indeterminate"
        >
          全选
        </Checkbox>
        <Button :loading="setReadBtnLoading" @click="handleMarkRead">
          <template #icon>
            <LucideMailCheck />
          </template>
          {{ selectedIds.length > 0 ? '标记选中已读' : '全部已读' }}
        </Button>
        <ButtonRemove
          :api="removeByIdsApi"
          :disabled="selectedIds.length === 0"
          :ids="selectedIds"
          @success="
            () => {
              handleUnreadChange();
              fetchList();
            }
          "
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1 overflow-hidden">
      <Card
        :body-style="listBodyStyle"
        :bordered="false"
        class="flex min-h-0 flex-col overflow-hidden rounded-none"
        :class="[
          compact
            ? 'w-full flex-1'
            : 'w-full lg:w-[38%] lg:min-w-[280px] lg:flex-none lg:border-r lg:border-border',
        ]"
        size="small"
      >
        <div class="min-h-0 flex-1 overflow-y-auto">
          <Spin :spinning="loading">
            <template v-if="records.length > 0">
              <MessageListItem
                v-for="item in records"
                :key="item.id"
                :active="activeReceiveId === item.id"
                :checked="isSelected(item.id)"
                :message="item"
                :show-checkbox="showQuery"
                @check="(checked) => toggleSelect(item.id!, checked)"
                @click="handleItemClick(item)"
              />
            </template>
            <Empty v-else class="py-12" description="暂无消息" />
          </Spin>
        </div>

        <div
          v-if="total > 0"
          class="shrink-0 border-t border-border px-3 py-2 text-right"
        >
          <Pagination
            :current="current"
            :page-size="pageSize"
            :show-size-changer="!compact"
            :simple="compact"
            :total="total"
            size="small"
            @change="handlePageChange"
          />
        </div>
      </Card>

      <div v-if="!compact" class="hidden min-w-0 flex-1 overflow-auto lg:block">
        <MessageDetailPanel :loading="detailLoading" :message="currentDetail" />
      </div>
    </div>

    <Drawer
      v-if="!compact"
      v-model:open="detailDrawerOpen"
      :body-style="{ padding: 0 }"
      class="lg:hidden"
      placement="right"
      title="消息详情"
      width="100%"
    >
      <MessageDetailPanel :loading="detailLoading" :message="currentDetail" />
    </Drawer>

    <BaseInfoModal />
  </Card>
</template>
