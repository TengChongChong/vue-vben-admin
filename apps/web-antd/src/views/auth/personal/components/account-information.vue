<script setup lang="ts">
import { Button, Card, List, ListItem, ListItemMeta } from 'ant-design-vue';

import { LucideLink, LucideMail, LucideSmartphone } from '#/components/icons';
</script>

<template>
  <Card :bordered="false" title="安全设置">
    <div class="account-information-wrapper">
      <List item-layout="horizontal">
        <ListItem>
          <template #actions>
            <Button size="small" type="link">
              <template #icon>
                <LucideLink />
              </template>
              绑定
            </Button>
          </template>
          <ListItemMeta description="用于账号登录与找回密码">
            <template #title>
              <span class="font-medium">手机：173****2808</span>
            </template>
            <template #avatar>
              <LucideSmartphone />
            </template>
          </ListItemMeta>
        </ListItem>
        <ListItem>
          <template #actions>
            <Button size="small" type="link">
              <template #icon>
                <LucideLink />
              </template>
              绑定
            </Button>
          </template>
          <ListItemMeta description="用于账号登录与找回密码">
            <template #title>
              <span class="font-medium">邮箱： easyframe@sina.com</span>
            </template>
            <template #avatar>
              <LucideMail />
            </template>
          </ListItemMeta>
        </ListItem>
      </List>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.account-information-wrapper {
  :deep(.ant-list) {
    .ant-list-item {
      .ant-list-item-meta {
        .ant-list-item-meta-avatar {
          font-size: 1.9rem;
        }
      }
    }
  }
}
</style>
