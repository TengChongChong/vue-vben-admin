<script setup lang="ts">
import type { SessionUser } from '@vben/types';

import {
  Avatar,
  Descriptions,
  DescriptionsItem,
  Flex,
  Tag,
} from 'ant-design-vue';

import { DictTag } from '#/components/dict';

const props = defineProps<{ currentUser: SessionUser }>();
</script>

<template>
  <!-- 用户头像 -->
  <Flex v-if="props.currentUser" class="mb-8">
    <div class="user-avatar">
      <Avatar
        v-if="props.currentUser.avatar"
        :size="100"
        :src="props.currentUser.avatar"
      />
      <Avatar v-else :size="100">
        {{ props.currentUser.nickname.substring(0, 2) }}
      </Avatar>
    </div>
    <div class="user-info p-2 pl-6">
      <div class="mb-1 text-lg font-medium">
        {{ props.currentUser.nickname }}
      </div>
      <div class="mb-1 text-gray-500">
        {{ props.currentUser.dept.name }}
      </div>
      <div class="user-tag">
        <DictTag :code="props.currentUser.sex!" dict-type="sex" />
        <Tag v-if="props.currentUser.age" :bordered="false">
          {{ props.currentUser.age }} 岁
        </Tag>
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
      {{ props.currentUser?.email }}
    </DescriptionsItem>
    <DescriptionsItem label="手机号">
      {{ props.currentUser?.phoneNumber }}
    </DescriptionsItem>
    <DescriptionsItem label="角色">
      <Tag
        v-for="role in props.currentUser?.roleList"
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
