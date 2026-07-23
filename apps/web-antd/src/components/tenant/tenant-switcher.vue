<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';

import { computed } from 'vue';

import { useTenantStore } from '@vben/stores';

import { Dropdown, Menu, Spin, Tag } from 'ant-design-vue';

import Icon from '#/components/icons/iconify/icon.vue';
import { useAuthStore } from '#/store';

defineOptions({
  name: 'TenantSwitcher',
});

const tenantStore = useTenantStore();
const authStore = useAuthStore();

const visible = computed(() => tenantStore.enabled);

const currentTenant = computed(() =>
  tenantStore.tenantList.find((item) => item.id === tenantStore.currentTenantId),
);

const currentLabel = computed(
  () =>
    currentTenant.value?.name ||
    tenantStore.currentTenantId ||
    '未知租户',
);

const menuItems = computed(() =>
  tenantStore.tenantList.map((tenant) => ({
    key: tenant.id,
    label: tenant.name,
    disabled: tenant.id === tenantStore.currentTenantId,
  })),
);

const handleSelect: MenuProps['onClick'] = ({ key }) => {
  const tenantId = String(key);
  if (tenantId === tenantStore.currentTenantId || authStore.tenantSwitchLoading) {
    return;
  }
  void authStore.switchTenant(tenantId);
};
</script>

<template>
  <div v-if="visible" class="mr-2 flex items-center">
    <Spin :spinning="authStore.tenantSwitchLoading" size="small">
      <Dropdown v-if="tenantStore.switchable && menuItems.length > 1" trigger="click">
        <Tag class="tenant-switcher-tag cursor-pointer select-none" color="processing">
          <span class="inline-flex items-center gap-1">
            <Icon icon="lucide:building-2" />
            <span>{{ currentLabel }}</span>
          </span>
        </Tag>
        <template #overlay>
          <Menu :items="menuItems" @click="handleSelect" />
        </template>
      </Dropdown>
      <Tag v-else class="tenant-switcher-tag select-none" color="processing">
        <span class="inline-flex items-center gap-1">
          <Icon icon="lucide:building-2" />
          <span>{{ currentLabel }}</span>
        </span>
      </Tag>
    </Spin>
  </div>
</template>

<style scoped>
.tenant-switcher-tag {
  margin-inline-end: 0;
}
</style>
