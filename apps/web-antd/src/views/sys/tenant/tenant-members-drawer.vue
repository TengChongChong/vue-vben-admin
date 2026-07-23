<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysTenantMember, SysUserVO } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, message, Modal, Popconfirm, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addTenantMembersApi,
  removeTenantMembersApi,
  selectTenantMembersApi,
} from '#/api';
import UserPickerModal from '#/components/user/src/components/user-picker-modal.vue';

const emit = defineEmits(['success']);

const tenantId = ref('');
const tenantName = ref('');
const packageName = ref('');
const maxUserCount = ref<number | undefined>();
const userCount = ref(0);

const quotaText = computed(() => {
  const current = userCount.value ?? 0;
  const max =
    maxUserCount.value && maxUserCount.value > 0 ? maxUserCount.value : null;
  return max ? `${current}/${max}` : `${current}/不限`;
});

const isQuotaReached = computed(() => {
  const max = maxUserCount.value;
  if (!max || max <= 0) {
    return false;
  }
  return (userCount.value ?? 0) >= max;
});

const drawerTitle = computed(() =>
  tenantName.value ? `${tenantName.value} · 成员管理` : '成员管理',
);

const formOptions: VbenFormProps = {
  collapsed: false,
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'keyword',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '用户名 / 昵称 / 部门',
      },
    },
  ],
};

const gridOptions: VxeGridProps<SysTenantMember> = {
  id: 'sys-tenant-members',
  rowConfig: {
    keyField: 'userId',
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { title: '用户名', field: 'username', minWidth: 120 },
    { title: '昵称', field: 'nickname', minWidth: 120 },
    { title: '部门', field: 'deptName', minWidth: 140 },
    {
      title: '绑定时间',
      field: 'createDate',
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      width: 160,
      slots: { default: 'action' },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!tenantId.value) {
          return { records: [], total: 0 };
        }
        return await selectTenantMembersApi(tenantId.value, formValues, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  separator: false,
});

const [PickerModal, pickerModalApi] = useVbenModal({
  connectedComponent: UserPickerModal,
});

function handleSearch() {
  gridApi.query();
}

function handleAddMembers() {
  if (isQuotaReached.value) {
    message.warning(`租户用户数已达上限（${quotaText.value}）`);
    return;
  }
  pickerModalApi.setData({
    range: 'all',
    selectedIds: [],
  });
  pickerModalApi.open();
}

async function handlePickerConfirm(users: SysUserVO[]) {
  const userIds = users.map((user) => user.id).filter(Boolean);
  if (userIds.length === 0) {
    return;
  }
  try {
    await addTenantMembersApi(tenantId.value, userIds);
    message.success('添加成功');
    userCount.value += userIds.length;
    handleSearch();
    emit('success');
  } catch {
    message.error('添加失败，请稍后重试');
  }
}

async function handleRemoveMember(row: SysTenantMember) {
  await removeTenantMembersApi(tenantId.value, row.userId);
  message.success('移除成功');
  userCount.value = Math.max(0, userCount.value - 1);
  handleSearch();
  emit('success');
}

function handleBatchRemove() {
  const records =
    (gridApi.grid?.getCheckboxRecords() as SysTenantMember[]) ?? [];
  if (records.length === 0) {
    message.warning('请选择要移除的成员');
    return;
  }
  Modal.confirm({
    title: `确定移除选中的 ${records.length} 名成员吗？`,
    onOk: async () => {
      try {
        const userIds = records.map((item) => item.userId).join(',');
        await removeTenantMembersApi(tenantId.value, userIds);
        message.success('移除成功');
        handleSearch();
        emit('success');
      } catch {
        message.error('移除失败，请稍后重试');
      }
    },
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{
        maxUserCount?: number;
        packageName?: string;
        tenantId?: string;
        tenantName?: string;
        userCount?: number;
      }>();
      tenantId.value = data?.tenantId ?? '';
      tenantName.value = data?.tenantName ?? '';
      packageName.value = data?.packageName ?? '';
      maxUserCount.value = data?.maxUserCount;
      userCount.value = data?.userCount ?? 0;
    }
  },
});
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[960px]">
    <div class="text-muted-foreground mb-3 text-sm">
      <span v-if="packageName">套餐：{{ packageName }} · </span>
      成员数：{{ quotaText }}
      <span v-if="isQuotaReached" class="text-destructive ml-2">已达上限</span>
    </div>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <Button
            :disabled="isQuotaReached"
            type="primary"
            @click="handleAddMembers">
            添加成员
          </Button>
          <Button danger @click="handleBatchRemove">批量移除</Button>
        </Space>
      </template>
      <template #action="{ row }">
        <Popconfirm
          cancel-text="取消"
          ok-text="确定"
          title="确定移出该成员吗？"
          @confirm="handleRemoveMember(row)">
          <Button danger size="small" type="link">移除</Button>
        </Popconfirm>
      </template>
    </Grid>
    <PickerModal @confirm="handlePickerConfirm" />
  </Drawer>
</template>
