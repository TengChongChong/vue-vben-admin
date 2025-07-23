<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Space } from 'ant-design-vue';

import { ButtonClose, ButtonSave } from '#/components/button';

const emit = defineEmits(['success']);

const accessStore = useAccessStore();

const saveBtnLoading = ref(false);

const id = ref();

async function handleSave() {
  try {
    saveBtnLoading.value = true;
    // const { valid } = await baseFormApi.validate();
    // if (!valid) {
    //   return;
    // }
    // const values: SampleGeneral = await baseFormApi.getValues();
    // await saveApi(values);
    // message.success('保存成功');
    emit('success');
    drawerApi.close();
  } catch (error) {
    console.error('保存失败', error);
  } finally {
    saveBtnLoading.value = false;
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      id.value = data.id;
    }
  },
});
</script>
<template>
  <Drawer class="w-full" title="流程设计">
    <iframe
      class="size-full"
      :src="`/static/activiti-editor/modeler.html?modelId=${id}&token=${accessStore.accessToken}`"
    ></iframe>

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <!-- todo: 后续升级方案 -->
        <ButtonSave
          v-if="false"
          :loading="saveBtnLoading"
          @click="handleSave"
        />
      </Space>
    </template>
  </Drawer>
</template>
