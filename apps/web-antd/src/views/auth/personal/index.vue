<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import PersonalNav from './components/personal-nav.vue';
import PersonalUserInfo from './components/personal-user-info.vue';

const selectedKeys = ref('profile-overview');
</script>

<template>
  <Page>
    <Layout>
      <LayoutSider :width="360" class="rounded-lg" theme="light">
        <Card :bordered="false">
          <!-- 当前登录用户信息 -->
          <PersonalUserInfo />

          <!-- Nav -->
          <PersonalNav v-model:selectedKeys="selectedKeys" />
        </Card>
      </LayoutSider>
      <LayoutContent :style="{ marginLeft: '24px', overflow: 'initial' }">
        <Card :bordered="false"> 123 </Card>
      </LayoutContent>
    </Layout>
  </Page>
</template>

<style lang="scss" scoped>
.user-avatar {
  .ant-avatar {
    font-size: 32px !important;
    background-color: hsl(var(--primary));
    border: 0;
  }
}
</style>
