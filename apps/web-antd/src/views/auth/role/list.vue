<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';
import type { SysRole } from '#/api/auth/model/sysRoleModel';

import { useAccess } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';

import { ReloadOutlined } from '@ant-design/icons-vue';
import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApi, refreshApi, removeApi, selectApi } from '#/api/auth/sysRole';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
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
      },
      ifShow: hasAccessByRoles([RoleEnum.SYS_ADMIN]),
      onChange: () => handleSearch(),
    },
  ],
};

const gridOptions: VxeGridProps<SysRole> = {
  id: 'sys-role',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

async function handleCreate() {
  // 将部分查询条件作为默认值
  const { category, type, sys } = await gridApi.formApi.getValues();
  baseInputDrawerApi.setData({
    category,
    type: type || 'text',
    sys: sys || '0',
  });
  baseInputDrawerApi.open();
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleReloadCache() {
  refreshApi().then(() => {
    message.success('刷新成功');
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <span class="table-title">角色管理</span>
      </template>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:role:save']" @click="handleCreate" />

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:role:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Button @click="handleReloadCache">
            <template #icon> <ReloadOutlined /> </template>
            刷新缓存
          </Button>
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
          :api="removeApi"
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
