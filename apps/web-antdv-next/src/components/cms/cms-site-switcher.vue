<script lang="ts" setup>
import type { MenuProps } from 'antdv-next';

import { computed, onMounted } from 'vue';

import { Dropdown, Menu, message, Tooltip } from 'antdv-next';

import Icon from '#/components/icons/iconify/icon.vue';
import { useCmsSiteStore } from '#/store';

defineOptions({
  name: 'CmsSiteSwitcher',
});

const cmsSiteStore = useCmsSiteStore();

const visible = computed(
  () => cmsSiteStore.initialized || cmsSiteStore.loading,
);

const currentLabel = computed(
  () => cmsSiteStore.activeSiteName || '未选择站点',
);

const spinning = computed(() => cmsSiteStore.loading || cmsSiteStore.switching);

const menuItems = computed(() =>
  cmsSiteStore.siteList.map((site) => ({
    key: site.id,
    label: site.name,
    disabled: site.id === cmsSiteStore.activeSiteId,
  })),
);

const canSwitch = computed(
  () => cmsSiteStore.switchable && menuItems.value.length > 1,
);

const handleSelect: MenuProps['onClick'] = async ({ key }) => {
  const siteId = String(key);
  if (siteId === cmsSiteStore.activeSiteId || cmsSiteStore.switching) {
    return;
  }
  try {
    await cmsSiteStore.switchSite(siteId);
    message.success('站点切换成功');
  } catch {
    // 错误由请求拦截器提示
  }
};

onMounted(() => {
  void cmsSiteStore.ensureLoaded();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="cms-site-fab fixed bottom-24 right-6 z-[1000]">
      <Dropdown v-if="canSwitch" :trigger="['click']" placement="topRight">
        <Tooltip :title="currentLabel" placement="left">
          <button
            class="cms-site-fab__btn"
            :class="{ 'cms-site-fab__btn--loading': spinning }"
            type="button"
            :disabled="spinning">
            <Icon class="cms-site-fab__icon" icon="lucide:globe" />
          </button>
        </Tooltip>
        <template #popupRender>
          <Menu :items="menuItems" @click="handleSelect" />
        </template>
      </Dropdown>
      <Tooltip v-else :title="currentLabel" placement="left">
        <button
          class="cms-site-fab__btn"
          :class="{ 'cms-site-fab__btn--loading': spinning }"
          type="button"
          :disabled="spinning">
          <Icon class="cms-site-fab__icon" icon="lucide:globe" />
        </button>
      </Tooltip>
    </div>
  </Teleport>
</template>

<style scoped>
.cms-site-fab__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  color: hsl(var(--primary-foreground));
  cursor: pointer;
  background-color: hsl(var(--primary));
  border: none;
  border-radius: 9999px;
  box-shadow:
    0 6px 16px rgb(0 0 0 / 12%),
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.cms-site-fab__btn:hover:not(:disabled) {
  box-shadow:
    0 8px 20px rgb(0 0 0 / 16%),
    0 4px 8px -4px rgb(0 0 0 / 14%),
    0 12px 32px 8px rgb(0 0 0 / 6%);
  transform: translateY(-2px);
}

.cms-site-fab__btn:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.cms-site-fab__btn--loading {
  animation: cms-site-fab-pulse 1.2s ease-in-out infinite;
}

.cms-site-fab__icon {
  font-size: 22px;
}

@keyframes cms-site-fab-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.55;
  }
}
</style>
