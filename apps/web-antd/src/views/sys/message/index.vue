<script lang="ts" setup>
import { ref, unref } from 'vue';
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

function handleEditMessage(id: string) {
  messageId.value = id;
  selectedKeys.value = 'edit';
}
</script>

<template>
  <Page auto-content-height>
    <Layout class="h-full">
      <LayoutSider :width="256" class="rounded-lg" theme="light">
        <Card :bordered="false" size="small" style="height: 100%">
          <!-- Nav -->
          <MessageNav v-model:selected-keys="selectedKeys" />
        </Card>
      </LayoutSider>

      <LayoutContent :style="{ marginLeft: '24px', overflow: 'initial' }">
        <!-- 写消息 -->
        <Edit v-if="'edit' === selectedKeys" :id="messageId" />

        <!-- 收信箱 -->
        <ReceiveList v-if="'receive' === selectedKeys" />

        <!-- 草稿箱 -->
        <List
          v-if="'draft' === selectedKeys"
          :page-type="SysMessageStatus.DRAFT"
          @edit-message="handleEditMessage"
        />

        <!-- 已发送 -->
        <List
          v-if="'has-been-sent' === selectedKeys"
          :page-type="SysMessageStatus.HAS_BEEN_SENT"
        />
      </LayoutContent>
    </Layout>
  </Page>
</template>

<style lang="scss" scoped></style>
