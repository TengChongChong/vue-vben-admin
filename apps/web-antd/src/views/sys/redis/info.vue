<script lang="ts" setup>
import type { SysRedisVO } from '#/api';

import { ref } from 'vue';

import { JsonViewer, useVbenModal, VbenScrollbar } from '@vben/common-ui';

import {
  Button,
  Descriptions,
  DescriptionsItem,
  message,
  Space,
} from 'ant-design-vue';

import { removeSysRedisApi } from '#/api';
import { ButtonClose } from '#/components/button';
import { LucideTrash } from '#/components/icons';

const emit = defineEmits(['success']);

const removeBtnLoading = ref(false);

const sysRedis = ref<SysRedisVO>();

async function handleRemove() {
  try {
    removeBtnLoading.value = true;
    await removeSysRedisApi(sysRedis.value?.key);
    message.success('删除成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('删除失败', error);
  } finally {
    removeBtnLoading.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      sysRedis.value = modalApi.getData();
    }
  },
});
</script>
<template>
  <Modal class="w-[600px]" title="缓存信息">
    <Descriptions
      :column="1"
      :label-style="{ width: `140px` }"
      bordered
      class="p-2"
    >
      <DescriptionsItem label="Key">
        {{ sysRedis?.key }}
      </DescriptionsItem>
      <DescriptionsItem label="有效期">
        {{ sysRedis?.expire === -1 ? '永不过期' : `${sysRedis?.expire}秒` }}
      </DescriptionsItem>
      <DescriptionsItem label="Value">
        <VbenScrollbar shadow>
          <div class="h-full max-h-[450px]">
            <JsonViewer :value="sysRedis?.value" copyable :sort="false" boxed />
          </div>
        </VbenScrollbar>
      </DescriptionsItem>
    </Descriptions>
    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <Button
          :loading="removeBtnLoading"
          danger
          type="primary"
          @click.stop="handleRemove"
        >
          <template #icon>
            <LucideTrash />
          </template>
          删除
        </Button>
      </Space>
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.vjs-tree {
  position: relative;
}
</style>
