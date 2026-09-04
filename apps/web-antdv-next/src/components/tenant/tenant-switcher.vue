<script lang="ts" setup>
import type { MenuProps } from 'antdv-next';

import { computed } from 'vue';

import { useTenantStore } from '@vben/stores';

import { Dropdown, Menu, Spin } from 'antdv-next';

import { LucideChevronDown } from '#/components/icons';
import Icon from '#/components/icons/iconify/icon.vue';
import { useAuthStore } from '#/store';

defineOptions({
  name: 'TenantSwitcher',
});

const tenantStore = useTenantStore();
const authStore = useAuthStore();

const visible = computed(() => tenantStore.enabled);

const switchable = computed(
  () => tenantStore.switchable && tenantStore.tenantList.length > 1,
);

const currentTenant = computed(() =>
  tenantStore.tenantList.find(
    (item) => item.id === tenantStore.currentTenantId,
  ),
);

const currentLabel = computed(
  () => currentTenant.value?.name || tenantStore.currentTenantId || '未知租户',
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
  if (
    tenantId === tenantStore.currentTenantId ||
    authStore.tenantSwitchLoading
  ) {
    return;
  }
  void authStore.switchTenant(tenantId);
};
</script>

<template>
  <div v-if="visible" class="mr-2 flex items-center">
    <Spin :spinning="authStore.tenantSwitchLoading" size="small">
      <Dropdown v-if="switchable" :trigger="['click']">
        <div
          class="group flex h-8 max-w-48 cursor-pointer select-none items-center gap-1.5 px-1 outline-hidden">
          <Icon
            icon="ph:buildings"
            class="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
          <span
            class="truncate text-xs text-muted-foreground duration-300 group-hover:text-foreground">
            {{ currentLabel }}
          </span>
          <LucideChevronDown
            class="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
        </div>
        <template #popupRender>
          <Menu :items="menuItems" @click="handleSelect" />
        </template>
      </Dropdown>
      <div
        v-else
        class="group flex h-8 max-w-48 select-none items-center gap-1.5 px-1 outline-hidden">
        <Icon
          icon="ph:buildings"
          class="size-4 shrink-0 text-muted-foreground" />
        <span class="truncate text-xs text-muted-foreground">
          {{ currentLabel }}
        </span>
      </div>
    </Spin>
  </div>
</template>
