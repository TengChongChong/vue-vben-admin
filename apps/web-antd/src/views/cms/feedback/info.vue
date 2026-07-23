<script lang="ts" setup>
import type { CmsFeedback } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

import { Descriptions, DescriptionsItem, Space } from 'ant-design-vue';

import { ButtonClose } from '#/components/button';
import { DictTag } from '#/components/dict';

const feedback = ref<CmsFeedback>();

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      feedback.value = drawerApi.getData<CmsFeedback>();
    }
  },
});
</script>

<template>
  <Drawer class="w-[720px]" title="反馈详情">
    <Descriptions
      :column="2"
      :label-style="{ width: '120px' }"
      bordered
      class="p-2">
      <DescriptionsItem label="昵称">
        {{ feedback?.nickname }}
      </DescriptionsItem>
      <DescriptionsItem label="状态">
        <DictTag :code="feedback?.status" dict-type="commonStatus" />
      </DescriptionsItem>
      <DescriptionsItem label="邮箱">
        {{ feedback?.email || '-' }}
      </DescriptionsItem>
      <DescriptionsItem label="手机号">
        {{ feedback?.phoneNumber || '-' }}
      </DescriptionsItem>
      <DescriptionsItem :span="2" label="内容">
        <div class="whitespace-pre-wrap">{{ feedback?.content }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="提交时间">
        {{ formatToDateTime(feedback?.createDate) }}
      </DescriptionsItem>
      <DescriptionsItem label="站点 ID">
        {{ feedback?.siteId || '-' }}
      </DescriptionsItem>
    </Descriptions>
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
      </Space>
    </template>
  </Drawer>
</template>
