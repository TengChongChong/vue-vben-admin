<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Space } from 'antdv-next';

import { ButtonClose, ButtonSave } from '#/components/button';

import CmsUserAuthPanel from './components/cms-user-auth-panel.vue';

const emit = defineEmits(['success']);

const userId = ref('');
const saveLoading = ref(false);
const panelRef = ref<InstanceType<typeof CmsUserAuthPanel>>();

async function handleSave() {
  saveLoading.value = true;
  try {
    await panelRef.value?.handleSave();
  } finally {
    saveLoading.value = false;
  }
}

function handleSuccess() {
  emit('success');
  drawerApi.close();
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ userId?: string }>();
      userId.value = data?.userId ?? '';
    }
  },
});
</script>

<template>
  <Drawer class="w-[960px]" title="CMS 权限">
    <CmsUserAuthPanel
      ref="panelRef"
      :allow-change-user="false"
      :fixed-user-id="userId"
      embedded
      :show-user-picker="false"
      @success="handleSuccess" />

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave :loading="saveLoading" text="保存" @click="handleSave" />
      </Space>
    </template>
  </Drawer>
</template>
