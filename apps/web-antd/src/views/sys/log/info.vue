<script lang="ts" setup>
import type { SysLog } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Descriptions, DescriptionsItem } from 'ant-design-vue';

import { formatToDateTime } from '#/util/date';

const logInfo = ref<SysLog>();

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      logInfo.value = drawerApi.getData<SysLog>();
    }
  },
});
</script>
<template>
  <Drawer class="w-[1200px]" title="日志信息">
    <Descriptions
      :column="2"
      :label-style="{ width: `140px` }"
      bordered
      class="p-2"
    >
      <DescriptionsItem label="模块">
        {{ logInfo?.modular }}
      </DescriptionsItem>
      <DescriptionsItem label="方法">
        {{ logInfo?.method }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="url">
        {{ logInfo?.url }}
      </DescriptionsItem>
      <DescriptionsItem label="操作人">
        {{ logInfo?.operationUser }}
      </DescriptionsItem>
      <DescriptionsItem label="操作时间">
        {{ formatToDateTime(logInfo?.operationDate) }}
      </DescriptionsItem>
      <DescriptionsItem label="ip">{{ logInfo?.ip }}</DescriptionsItem>
      <DescriptionsItem label="class">
        {{ logInfo?.clazz }}.{{ logInfo?.methodName }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="参数">
        {{ logInfo?.params }}
      </DescriptionsItem>
    </Descriptions>
  </Drawer>
</template>
