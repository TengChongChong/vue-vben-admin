<script lang="ts" setup>
import type { SysTenantRemovePreview } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Alert,
  Button,
  Descriptions,
  DescriptionsItem,
  message,
  Space,
} from 'ant-design-vue';

import { removeSysTenantApi } from '#/api';

const emit = defineEmits(['success']);

interface TenantBrief {
  id: string;
  name: string;
  tenantCode: string;
}

const ids = ref<string[]>([]);
const tenants = ref<TenantBrief[]>([]);
const preview = ref<SysTenantRemovePreview>({
  memberCount: 0,
  deptCount: 0,
  roleCount: 0,
  exclusiveUserCount: 0,
});
const loading = ref(false);

const isSingle = computed(() => ids.value.length === 1);
const modalTitle = computed(() =>
  isSingle.value
    ? '确定要删除该租户吗？'
    : `确定要删除 ${ids.value.length} 个租户吗？`,
);
const singleTenant = computed(() => tenants.value[0]);

async function handleConfirm() {
  if (ids.value.length === 0) {
    return;
  }
  loading.value = true;
  try {
    const result = await removeSysTenantApi(ids.value.join(','));
    if (result) {
      message.success('删除成功');
      emit('success');
      modalApi.close();
    }
  } catch {
    message.error('删除失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<{
        ids?: string[];
        preview?: SysTenantRemovePreview;
        tenants?: TenantBrief[];
      }>();
      ids.value = data?.ids ?? [];
      tenants.value = data?.tenants ?? [];
      preview.value = data?.preview ?? {
        memberCount: 0,
        deptCount: 0,
        roleCount: 0,
        exclusiveUserCount: 0,
      };
      loading.value = false;
    }
  },
});
</script>

<template>
  <Modal :title="modalTitle" class="w-[480px]">
    <div class="space-y-4">
      <Alert
        show-icon
        type="warning"
        message="此操作不可恢复，将永久删除租户及其组织数据（部门、部门类型、角色权限）。" />

      <div>
        <div class="mb-2 text-sm font-medium mt-2">删除对象</div>
        <template v-if="isSingle && singleTenant">
          <div class="text-sm">
            {{ singleTenant.name }}
            <span class="text-muted-foreground">（{{ singleTenant.tenantCode }}）</span>
          </div>
        </template>
        <template v-else>
          <div class="text-sm">共 {{ ids.length }} 个租户</div>
          <ul
            v-if="tenants.length > 0 && tenants.length <= 5"
            class="text-muted-foreground mt-2 list-disc pl-5 text-sm">
            <li v-for="item in tenants" :key="item.id">
              {{ item.name }}
              <span v-if="item.tenantCode">（{{ item.tenantCode }}）</span>
            </li>
          </ul>
        </template>
      </div>

      <div>
        <div class="mb-2 text-sm font-medium">删除影响</div>
        <Descriptions bordered :column="1" size="small">
          <DescriptionsItem label="成员">
            <span class="font-semibold">{{ preview.memberCount }}</span> 人
          </DescriptionsItem>
          <DescriptionsItem label="删除账号">
            <span class="font-semibold">{{ preview.exclusiveUserCount }}</span>
            人
            <div class="text-muted-foreground text-xs">仅属于本租户的成员</div>
          </DescriptionsItem>
          <DescriptionsItem label="部门">
            <span class="font-semibold">{{ preview.deptCount }}</span> 个
          </DescriptionsItem>
          <DescriptionsItem label="角色">
            <span class="font-semibold">{{ preview.roleCount }}</span> 个
          </DescriptionsItem>
        </Descriptions>
      </div>

      <p class="text-muted-foreground text-xs">
        多租户用户将仅解除与本租户的关联。
      </p>
    </div>

    <template #footer>
      <Space>
        <Button @click="modalApi.close()">取消</Button>
        <Button danger :loading="loading" type="primary" @click="handleConfirm">
          确认删除
        </Button>
      </Space>
    </template>
  </Modal>
</template>
