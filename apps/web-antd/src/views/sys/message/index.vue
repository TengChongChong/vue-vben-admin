<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import Edit from './components/edit.vue';
import MessageNav from './components/message-nav.vue';

const selectedKeys = ref('edit');
</script>

<template>
  <Page>
    <Layout>
      <LayoutSider :width="256" class="rounded-lg" theme="light">
        <Card :bordered="false" size="small" style="height: 100%">
          <!-- Nav -->
          <MessageNav v-model:selected-keys="selectedKeys" />
        </Card>
      </LayoutSider>
      <LayoutContent :style="{ marginLeft: '24px', overflow: 'initial' }">
        <!-- 概览 -->
        <Edit v-if="'edit' === selectedKeys" />
      </LayoutContent>
    </Layout>
  </Page>
</template>

<style lang="scss" scoped></style>
