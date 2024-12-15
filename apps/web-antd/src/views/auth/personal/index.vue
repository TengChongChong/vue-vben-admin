<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import AccountSecurity from '#/views/auth/personal/components/account-security.vue';
import ChangePassword from '#/views/auth/personal/components/change-password.vue';
import PersonalInformation from '#/views/auth/personal/components/personal-information.vue';
import ProfileOverview from '#/views/auth/personal/components/profile-overview.vue';

import PersonalNav from './components/personal-nav.vue';
import PersonalUserInfo from './components/personal-user-info.vue';

const selectedKeys = ref('profile-overview');

const userStore = useUserStore();

const currentUser = computed(() => {
  return userStore.userInfo;
});
</script>

<template>
  <Page>
    <Layout>
      <LayoutSider :width="360" class="rounded-lg" theme="light">
        <Card :bordered="false" style="height: 100%">
          <!-- 当前登录用户信息 -->
          <PersonalUserInfo :current-user="currentUser!" />

          <!-- Nav -->
          <PersonalNav v-model:selected-keys="selectedKeys" />
        </Card>
      </LayoutSider>
      <LayoutContent :style="{ marginLeft: '24px', overflow: 'initial' }">
        <!-- 概览 -->
        <ProfileOverview v-if="'profile-overview' === selectedKeys" />
        <!-- 安全设置 -->
        <AccountSecurity
          v-if="'account-security' === selectedKeys"
          :email="currentUser?.email"
          :phone-number="currentUser?.phoneNumber"
        />
        <!-- 修改密码 -->
        <ChangePassword v-if="'change-password' === selectedKeys" />
        <!-- 用户信息 -->
        <PersonalInformation v-if="'personal-information' === selectedKeys" />
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
