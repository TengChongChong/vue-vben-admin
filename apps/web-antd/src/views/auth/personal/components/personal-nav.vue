<script setup lang="ts">
import { ref, unref, watch } from 'vue';

import { Menu, MenuItem } from 'ant-design-vue';

import {
  Layers,
  LockKeyhole,
  ShieldCheck,
  UserRound,
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

watch(
  () => prop.selectedKeys,
  () => (selectedKeys.value = [prop.selectedKeys]),
);

function handleSelect() {
  emit('update:selectedKeys', unref(selectedKeys)[0]);
}
</script>

<template>
  <!-- 导航 -->
  <div class="personal-nav-wrapper">
    <Menu
      v-model:selected-keys="selectedKeys"
      class="personal-nav"
      mode="inline"
      @select="handleSelect"
    >
      <MenuItem key="profile-overview">
        <template #icon>
          <Layers />
        </template>
        概览
      </MenuItem>
      <MenuItem key="personal-information">
        <template #icon>
          <UserRound />
        </template>
        我的资料
      </MenuItem>
      <MenuItem key="account-security">
        <template #icon>
          <ShieldCheck />
        </template>
        安全设置
      </MenuItem>
      <MenuItem key="change-password">
        <template #icon>
          <LockKeyhole />
        </template>
        修改密码
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
