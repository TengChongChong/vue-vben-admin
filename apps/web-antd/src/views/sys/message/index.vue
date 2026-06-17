<script lang="ts" setup>
import { ref, unref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card, Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import { SysMessageStatus } from '#/views/sys/message/components/data';
import List from '#/views/sys/message/components/list.vue';
import ReceiveList from '#/views/sys/message/components/receive-list.vue';

import Edit from './components/edit.vue';
import MessageNav from './components/message-nav.vue';

const { currentRoute } = useRouter();

const selectedKeys = ref(unref(currentRoute).params?.key || 'receive');

const messageId = ref();
const messageNavRef = ref<InstanceType<typeof MessageNav>>();

function handleEditMessage(id: string) {
  messageId.value = id;
  selectedKeys.value = 'edit';
}

function handleUnreadChange() {
  messageNavRef.value?.refreshUnreadCount();
}

watch(selectedKeys, (key) => {
  if (key === 'receive') {
    handleUnreadChange();
  }
});
</script>

<template>
  <Page auto-content-height>
    <Layout class="h-full">
      <LayoutSider :width="256" class="rounded-lg" theme="light">
        <Card :bordered="false" size="small" style="height: 100%">
          <MessageNav
            ref="messageNavRef"
            v-model:selected-keys="selectedKeys"
          />
        </Card>
      </LayoutSider>

      <LayoutContent :style="{ marginLeft: '24px', overflow: 'initial' }">
        <Card
          :bordered="false"
          class="message-page-content h-full"
          size="small"
        >
          <Edit v-if="'edit' === selectedKeys" :id="messageId" />

          <ReceiveList
            v-if="'receive' === selectedKeys"
            @unread-change="handleUnreadChange"
          />

          <List
            v-if="'draft' === selectedKeys"
            :page-type="SysMessageStatus.DRAFT"
            @edit-message="handleEditMessage"
          />

          <List
            v-if="'has-been-sent' === selectedKeys"
            :page-type="SysMessageStatus.HAS_BEEN_SENT"
          />
        </Card>
      </LayoutContent>
    </Layout>
  </Page>
</template>

<style lang="scss" scoped>
@import './style/message.scss';
</style>
