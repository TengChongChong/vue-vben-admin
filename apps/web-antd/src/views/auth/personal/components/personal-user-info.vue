<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Avatar,
  Descriptions,
  DescriptionsItem,
  Flex,
  Tag,
} from 'ant-design-vue';

import { DictTag } from '#/components/dict';

const userStore = useUserStore();

const currentUser = computed(() => {
  return userStore.userInfo;
});
</script>

<template>
  <!-- 用户头像 -->
  <Flex class="mb-8">
    <div class="user-avatar">
      <Avatar
        v-if="currentUser?.avatar"
        :size="100"
        :src="currentUser?.avatar"
      />
      <Avatar v-else :size="100">
        {{ currentUser?.nickname.substring(0, 2) }}
      </Avatar>
    </div>
    <div class="user-info p-2 pl-6">
      <div class="mb-1 text-lg font-medium">
        {{ currentUser?.nickname }}
      </div>
      <div class="mb-1 text-gray-500">
        {{ currentUser?.dept.name }}
      </div>
      <div class="user-tag">
        <DictTag :code="currentUser?.sex!" dict-type="sex" />
        <Tag :bordered="false">18 岁</Tag>
      </div>
    </div>
  </Flex>

  <!-- 用户详情 -->
  <Descriptions
    :column="1"
    :content-style="{ justifyContent: 'end' }"
    :label-style="{ width: '80px' }"
    class="mb-4"
    size="small"
  >
    <DescriptionsItem label="邮箱">
      {{ currentUser?.email }}
    </DescriptionsItem>
    <DescriptionsItem label="手机号">
      {{ currentUser?.phoneNumber }}
    </DescriptionsItem>
    <DescriptionsItem label="角色">
      <Tag
        v-for="role in currentUser?.roleList"
        :key="role.id"
        :bordered="false"
      >
        {{ role.name }}
      </Tag>
    </DescriptionsItem>
  </Descriptions>
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
