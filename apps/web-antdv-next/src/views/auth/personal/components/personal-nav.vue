<script setup lang="ts">
import { computed, h, nextTick, ref, unref, watch } from 'vue';

import { Menu } from 'antdv-next';

import {
  LockKeyhole,
  LucideLayers,
  LucideShieldCheck,
  LucideUserRound,
} from '#/components/icons';

const prop = defineProps({
  selectedKeys: {
    type: String,
    default: () => {
      return 'profile-overview';
    },
  },
});

const emit = defineEmits(['update:selectedKeys']);
const selectedKeys = ref([prop.selectedKeys]);

const menuItems = computed(() => [
  {
    key: 'profile-overview',
    icon: () => h(LucideLayers),
    label: '概览',
  },
  {
    key: 'personal-information',
    icon: () => h(LucideUserRound),
    label: '我的资料',
  },
  {
    key: 'account-security',
    icon: () => h(LucideShieldCheck),
    label: '安全设置',
  },
  {
    key: 'change-password',
    icon: () => h(LockKeyhole),
    label: '修改密码',
  },
]);

watch(
  () => prop.selectedKeys,
  () => (selectedKeys.value = [prop.selectedKeys]),
);

function handleSelect() {
  nextTick(() => {
    emit('update:selectedKeys', unref(selectedKeys)[0]);
  });
}
</script>

<template>
  <!-- 导航 -->
  <div class="personal-nav-wrapper">
    <Menu
      v-model:selected-keys="selectedKeys"
      class="personal-nav"
      :items="menuItems"
      mode="inline"
      @select="handleSelect"
    />
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
