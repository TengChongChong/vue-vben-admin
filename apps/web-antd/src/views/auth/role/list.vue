<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysRole } from '#/api';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Divider, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysRoleApi,
  getSysRoleApi,
  refreshSysRoleCacheApi,
  removeSysRoleApi,
  selectSysRoleApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideRefreshCw } from '#/components/icons';
import { RoleEnum } from '#/enums/roleEnum';

import { initColumns } from './data';
import InputDrawer from './input.vue';

const { hasAccessByRoles } = useAccess();

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: '标识',
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
    {
      fieldName: 'sys',
      label: '系统',
      component: 'DictSelect',
      componentProps: {
        dictType: 'whether',
        onChange: () => handleSearch(),
      },
      ifShow: hasAccessByRoles([RoleEnum.SYS_ADMIN]),
    },
  ],
};

const gridOptions: VxeGridProps<SysRole> = {
  id: 'sys-role',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysRoleApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '角色管理',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

async function handleCreate() {
  addSysRoleApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getSysRoleApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleReloadCache() {
  refreshSysRoleCacheApi().then(() => {
    message.success('刷新成功');
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:role:save']" @click="handleCreate" />

          <ButtonRemove
            :api="removeSysRoleApi"
            :auth-codes="['sys:role:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Button @click="handleReloadCache">
            <template #icon> <LucideRefreshCw /> </template>
            刷新缓存
          </Button>

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['sys:role:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeSysRoleApi"
          :auth-codes="['sys:role:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />
  </Page>
</template>
