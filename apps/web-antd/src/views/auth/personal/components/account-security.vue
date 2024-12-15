<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Card, List, ListItem, ListItemMeta } from 'ant-design-vue';

import { getUserInfoApi } from '#/api/auth/auth';
import { LucideLink, LucideMail, LucideSmartphone } from '#/components/icons';

import ChangeEmailModal from './modal/change-email-modal.vue';
import ChangePhoneModal from './modal/change-phone-modal.vue';

const props = defineProps<{ email: string; phoneNumber: string }>();

const [BaseChangeEmailModal, baseChangeEmailModalApi] = useVbenModal({
  connectedComponent: ChangeEmailModal,
});

const [BaseChangePhoneModal, baseChangePhoneModalApi] = useVbenModal({
  connectedComponent: ChangePhoneModal,
});

function handleChangeEmail() {
  baseChangeEmailModalApi.open();
}

function handleChangePhone() {
  baseChangePhoneModalApi.open();
}

async function handleSuccess() {
  const userStore = useUserStore();
  const userInfo = await getUserInfoApi();
  userStore.setUserInfo(userInfo);
}
</script>

<template>
  <Card :bordered="false" title="安全设置">
    <div class="account-security-wrapper">
      <List item-layout="horizontal">
        <ListItem>
          <template #actions>
            <Button size="small" type="link" @click="handleChangePhone">
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
            <Button size="small" type="link" @click="handleChangeEmail">
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

    <BaseChangeEmailModal @success="handleSuccess" />

    <BaseChangePhoneModal @success="handleSuccess" />
  </Card>
</template>

<style lang="scss" scoped>
.account-security-wrapper {
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
