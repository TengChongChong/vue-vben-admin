<script setup lang="ts">
import { Button, Card, List, ListItem, ListItemMeta } from 'ant-design-vue';

import { LucideLink, LucideMail, LucideSmartphone } from '#/components/icons';

const props = defineProps<{ email: string; phoneNumber: string }>();
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
          <ListItemMeta
            description="账号绑定手机号可用于提升账号安全性，如身份验证、密码找回；方便账号登录与管理，包括便捷登录、接收重要通知与信息。"
          >
            <template #title>
              <span class="font-medium">
                手机：{{ props.phoneNumber || '未绑定' }}
              </span>
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
          <ListItemMeta
            description="账号绑定手机号可用于提升账号安全性，如身份验证、密码找回。"
          >
            <template #title>
              <span class="font-medium">
                邮箱： {{ props.email || '未绑定' }}
              </span>
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
