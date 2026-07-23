<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysTenantPackage } from '#/api';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, Divider, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSysTenantPackageApi,
  removeSysTenantPackageApi,
  selectSysTenantPackageApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';

import { initColumns } from './data';
import InputDrawer from './input.vue';
import SyncMenuModal from './sync-menu-modal.vue';

function handleSearch() {
  gridApi.query();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'code',
      label: '套餐编码',
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: '套餐名称',
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
  ],
};

const gridOptions: VxeGridProps<SysTenantPackage> = {
  id: 'sys-tenant-package',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysTenantPackageApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '租户套餐',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

const [SyncModal, syncModalApi] = useVbenModal({
  connectedComponent: SyncMenuModal,
});

function handleCreate() {
  baseInputDrawerApi.setData({ status: '1' });
  baseInputDrawerApi.open();
}

function handleEdit(id: string) {
  getSysTenantPackageApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleSyncMenus(row: SysTenantPackage) {
  syncModalApi.setData({
    packageId: row.id,
    packageName: row.name,
  });
  syncModalApi.open();
}

function handleOpenSyncFromDrawer(data: {
  id: string;
  menuChanged?: boolean;
  name?: string;
}) {
  if (!data.menuChanged) {
    return;
  }
  syncModalApi.setData({
    packageId: data.id,
    packageName: data.name,
  });
  syncModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['sys:tenant:package:save']"
            @click="handleCreate" />

          <ButtonRemove
            :api="removeSysTenantPackageApi"
            :auth-codes="['sys:tenant:package:remove']"
            :grid-api="gridApi"
            @success="handleSearch" />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <Button
          v-access:code="['sys:tenant:package:save']"
          size="small"
          type="link"
          @click="handleSyncMenus(row)">
          同步菜单
        </Button>

        <ButtonEdit
          :auth-codes="['sys:tenant:package:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)" />

        <ButtonRemove
          :api="removeSysTenantPackageApi"
          :auth-codes="['sys:tenant:package:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch" />
      </template>
    </Grid>

    <BaseInputDrawer
      @success="handleSearch"
      @sync-prompt="handleOpenSyncFromDrawer" />
    <SyncModal />
  </Page>
</template>
