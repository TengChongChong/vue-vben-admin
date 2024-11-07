<script lang="ts" setup>
import type { SysException } from '#/api/sys/model/sys-exception-model';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Descriptions, DescriptionsItem, TypographyText } from 'ant-design-vue';

import { formatToDateTime } from '#/util/date';

const exceptionInfo = ref<SysException>();

const trace = ref<string[]>([]);

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      exceptionInfo.value = data;
      trace.value = [];
      // 栈转为数组
      data.trace.split('\n\t').forEach((item) => {
        trace.value.push(item);
      });
    }
  },
});
</script>
<template>
  <Drawer class="w-[1440px]" title="异常信息">
    <Descriptions
      :column="2"
      :label-style="{ width: `140px` }"
      bordered
      class="p-2"
    >
      <DescriptionsItem :span="2" label="错误ID">
        {{ exceptionInfo?.id }}
      </DescriptionsItem>
      <DescriptionsItem label="异常类型">
        {{ exceptionInfo?.type }}
      </DescriptionsItem>
      <DescriptionsItem label="Http Status">
        {{ exceptionInfo?.code }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="url">
        {{ exceptionInfo?.url }}
      </DescriptionsItem>
      <DescriptionsItem label="触发用户">
        {{ exceptionInfo?.nickname }}
      </DescriptionsItem>
      <DescriptionsItem label="触发时间">
        {{ formatToDateTime(exceptionInfo?.triggerTime) }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="错误信息">
        {{ exceptionInfo?.message }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="调用栈">
        <div v-for="(item, index) in trace" :key="index">
          <TypographyText
            :type="item.startsWith('com.easy.admin') ? 'danger' : ''"
          >
            {{ item }}
          </TypographyText>
        </div>
      </DescriptionsItem>
    </Descriptions>
  </Drawer>
</template>
