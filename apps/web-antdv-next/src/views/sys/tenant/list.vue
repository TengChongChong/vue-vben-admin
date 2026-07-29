<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysTenant } from '#/api';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, Divider, message, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSysTenantApi,
  getTenantRemovePreviewApi,
  selectSysTenantApi,
} from '#/api';
import { ButtonAdd, ButtonEdit } from '#/components/button';
import { LucideTrash, LucideUsers } from '#/components/icons';

import { initColumns } from './data';
import InputModal from './input.vue';
import TenantMembersDrawer from './tenant-members-drawer.vue';
import TenantRemoveConfirmModal from './tenant-remove-confirm-modal.vue';

function handleSearch() {
  gridApi.query();
}

async function confirmRemove(
  tenants: Pick<SysTenant, 'id' | 'name' | 'tenantCode'>[],
) {
  const ids = tenants.map((item) => item.id);
  if (ids.length === 0) {
    message.warning('请选择要删除的数据后重试');
    return;
  }
  try {
    const previews = await Promise.all(
      ids.map((id) => getTenantRemovePreviewApi(id)),
    );
    const summary = {
      memberCount: 0,
      deptCount: 0,
      roleCount: 0,
      exclusiveUserCount: 0,
    };
    for (const item of previews) {
      summary.memberCount += item.memberCount;
      summary.deptCount += item.deptCount;
      summary.roleCount += item.roleCount;
      summary.exclusiveUserCount += item.exclusiveUserCount;
    }

    removeConfirmModalApi.setData({
      ids,
      preview: summary,
      tenants: tenants.map((item) => ({
        id: item.id,
        name: item.name,
        tenantCode: item.tenantCode,
      })),
    });
    removeConfirmModalApi.open();
  } catch {
    message.error('获取删除预览失败，请稍后重试');
  }
}

function handleBatchRemove() {
  const records =
    (gridApi.grid?.getCheckboxRecords() as SysTenant[]) ?? [];
  confirmRemove(records);
}

function handleRowRemove(row: SysTenant) {
  confirmRemove([row]);
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'tenantCode',
      label: '租户编码',
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: '租户名称',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'commonStatus',
        onChange: () => handleSearch(),
      },
    },
    {
      fieldName: 'contacts',
      label: '联系人',
      component: 'Input',
    },
    {
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysTenant> = {
  id: 'sys-tenant',
  columns: initColumns(handleOpenMembers),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysTenantApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '租户管理',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

const [MembersDrawer, membersDrawerApi] = useVbenDrawer({
  connectedComponent: TenantMembersDrawer,
});

const [RemoveConfirmModal, removeConfirmModalApi] = useVbenModal({
  connectedComponent: TenantRemoveConfirmModal,
});

function handleCreate() {
  baseInputModalApi.setData({ status: '1' });
  baseInputModalApi.open();
}

function handleEdit(id: string) {
  getSysTenantApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleOpenMembers(row: SysTenant) {
  membersDrawerApi.setData({
    maxUserCount: row.maxUserCount,
    packageName: row.packageName,
    tenantId: row.id,
    tenantName: row.name,
    userCount: row.userCount,
  });
  membersDrawerApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:tenant:save']" @click="handleCreate" />

          <AccessControl :codes="['sys:tenant:remove']">
            <Button danger @click="handleBatchRemove">
              <template #icon>
                <LucideTrash />
              </template>
              删除
            </Button>
          </AccessControl>

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <AccessControl :codes="['sys:tenant:user:save']">
          <Button size="small" type="link" @click="handleOpenMembers(row)">
            <template #icon>
              <LucideUsers />
            </template>
            成员
          </Button>
        </AccessControl>

        <ButtonEdit
          :auth-codes="['sys:tenant:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)" />

        <AccessControl :codes="['sys:tenant:remove']">
          <Button
            danger
            size="small"
            type="link"
            @click="handleRowRemove(row)">
            <template #icon>
              <LucideTrash />
            </template>
            删除
          </Button>
        </AccessControl>
      </template>
    </Grid>

    <BaseInputModal @success="handleSearch" />
    <MembersDrawer @success="handleSearch" />
    <RemoveConfirmModal @success="handleSearch" />
  </Page>
</template>
