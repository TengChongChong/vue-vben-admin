<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import List from './list.vue';

const schedulerJobId = ref();
const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      schedulerJobId.value = data.schedulerJobId;
    }
  },
});
</script>
<template>
  <Modal class="w-[720px]" title="任务执行日志">
    <List :scheduler-job-id="schedulerJobId" />
  </Modal>
</template>
