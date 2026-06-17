<script setup lang="ts">
import type { SysUserVO } from '#/api';
import type { UserPickerProps } from '#/components/user/src/type';

import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { cn } from '@vben/utils';

import { Button } from 'ant-design-vue';

import { selectUsersByIdsApi } from '#/api';
import UserPickerModal from '#/components/user/src/components/user-picker-modal.vue';
import UserSelectedTags from '#/components/user/src/components/user-selected-tags.vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UserPickerProps>(), {
  range: 'all',
  value: () => [],
});

const emit = defineEmits(['change', 'update:value']);

const selectedUsers = ref<SysUserVO[]>([]);

const [BaseModal, modalApi] = useVbenModal({
  connectedComponent: UserPickerModal,
});

async function loadSelectedUsers(ids?: string[]) {
  if (!ids || ids.length === 0) {
    selectedUsers.value = [];
    return;
  }
  selectedUsers.value = await selectUsersByIdsApi(ids);
}

watch(
  () => props.value,
  (ids) => {
    loadSelectedUsers(ids);
  },
  { immediate: true },
);

function openPicker() {
  if (props.disabled) {
    return;
  }
  modalApi.setData({
    deptId: props.deptId,
    maxCount: props.maxCount,
    range: props.range,
    roleCode: props.roleCode,
    selectedIds: props.value ?? [],
  });
  modalApi.open();
}

function handleConfirm(users: SysUserVO[]) {
  const ids = users.map((user) => user.id).filter(Boolean) as string[];
  selectedUsers.value = users;
  emit('update:value', ids);
  emit('change', ids);
}

function handleRemove(id: string) {
  if (props.disabled) {
    return;
  }
  const nextUsers = selectedUsers.value.filter((user) => user.id !== id);
  const ids = nextUsers.map((user) => user.id).filter(Boolean) as string[];
  selectedUsers.value = nextUsers;
  emit('update:value', ids);
  emit('change', ids);
}

function handleClear() {
  if (props.disabled) {
    return;
  }
  selectedUsers.value = [];
  emit('update:value', []);
  emit('change', []);
}
</script>

<template>
  <div :class="cn(props.class, 'user-picker w-full')">
    <UserSelectedTags
      :disabled="disabled"
      :users="selectedUsers"
      @clear="handleClear"
      @remove="handleRemove"
    />
    <Button
      :disabled="disabled"
      class="user-picker__trigger"
      type="default"
      @click="openPicker"
    >
      选择用户
    </Button>
    <BaseModal @confirm="handleConfirm" />
  </div>
</template>

<style lang="scss" scoped>
.user-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__trigger {
    align-self: flex-start;
  }
}
</style>
