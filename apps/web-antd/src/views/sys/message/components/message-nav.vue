<script setup lang="ts">
import { onMounted, ref, unref, watch } from 'vue';

import { Badge, Menu, MenuItem } from 'ant-design-vue';

import {
  LucideFilePen,
  LucideMailbox,
  LucideMailCheck,
  LucideMails,
} from '#/components/icons';
import { useMessageUnreadCount } from '#/views/sys/message/composables/use-message-unread-count';

const prop = defineProps({
  selectedKeys: {
    type: String,
    default: () => {
      return 'receive';
    },
  },
});

const emit = defineEmits(['update:selectedKeys']);
const selectedKeys = ref([prop.selectedKeys]);

const { refreshUnreadCount, unreadCount } = useMessageUnreadCount();

watch(
  () => prop.selectedKeys,
  () => (selectedKeys.value = [prop.selectedKeys]),
);

function handleSelect() {
  emit('update:selectedKeys', unref(selectedKeys)[0]);
}

onMounted(() => {
  refreshUnreadCount();
});

defineExpose({
  refreshUnreadCount,
});
</script>

<template>
  <div class="personal-nav-wrapper">
    <Menu
      v-model:selected-keys="selectedKeys"
      class="personal-nav"
      mode="inline"
      @select="handleSelect"
    >
      <MenuItem key="edit">
        <template #icon>
          <LucideFilePen />
        </template>
        写消息
      </MenuItem>
      <MenuItem key="receive">
        <template #icon>
          <LucideMailbox />
        </template>
        <Badge :count="unreadCount" :offset="[16, 6]">
          <span>收信箱</span>
        </Badge>
      </MenuItem>
      <MenuItem key="draft">
        <template #icon>
          <LucideMails />
        </template>
        草稿箱
      </MenuItem>
      <MenuItem key="has-been-sent">
        <template #icon>
          <LucideMailCheck />
        </template>
        已发送
      </MenuItem>
    </Menu>
  </div>
</template>

<style lang="scss" scoped>
.personal-nav-wrapper {
  :deep(.ant-menu) {
    border-inline-end: 0;

    .ant-menu-item {
      margin: 6px 0;

      .ant-menu-item-icon {
        width: 1rem;
      }
    }
  }
}
</style>
