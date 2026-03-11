<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Card } from 'antdv-next';

import { getCurrentUserApi } from '#/api';
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
  const userInfo = await getCurrentUserApi();
  userStore.setUserInfo(userInfo);
}
</script>

<template>
  <Card variant="outlined" title="安全设置">
    <div class="flex flex-col gap-4">
      <div
        class="flex items-start justify-between border-b py-3 last:border-b-0"
      >
        <div class="flex items-start gap-3">
          <div class="text-[1.9rem] leading-none">
            <LucideSmartphone />
          </div>
          <div>
            <div class="mb-1 font-medium">
              手机：{{ props.phoneNumber || '未绑定' }}
            </div>
            <div class="text-[13px] text-(--vben-text-color-secondary)">
              账号绑定手机号可用于提升账号安全性，如身份验证、密码找回；方便账号登录与管理，包括便捷登录、接收重要通知与信息。
            </div>
          </div>
        </div>
        <div class="shrink-0">
          <Button
            size="small"
            type="link"
            class="px-0"
            @click="handleChangePhone"
          >
            <template #icon>
              <LucideLink />
            </template>
            {{ props.phoneNumber ? '修改' : '绑定' }}
          </Button>
        </div>
      </div>

      <div
        class="flex items-start justify-between border-b py-3 last:border-b-0"
      >
        <div class="flex items-start gap-3">
          <div class="text-[1.9rem] leading-none">
            <LucideMail />
          </div>
          <div>
            <div class="mb-1 font-medium">
              邮箱： {{ props.email || '未绑定' }}
            </div>
            <div class="text-[13px] text-(--vben-text-color-secondary)">
              账号绑定邮箱可用于提升账号安全性，如身份验证、密码找回。
            </div>
          </div>
        </div>
        <div class="shrink-0">
          <Button
            size="small"
            type="link"
            class="px-0"
            @click="handleChangeEmail"
          >
            <template #icon>
              <LucideLink />
            </template>
            {{ props.email ? '修改' : '绑定' }}
          </Button>
        </div>
      </div>
    </div>

    <BaseChangeEmailModal @success="handleSuccess" />

    <BaseChangePhoneModal @success="handleSuccess" />
  </Card>
</template>

<style lang="scss" scoped></style>
