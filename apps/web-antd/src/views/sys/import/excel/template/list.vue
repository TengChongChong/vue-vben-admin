<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysImportExcelTemplate } from '#/api/sys/model/sys-import-excel-template-model';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getApi,
  removeApi,
  selectApi,
} from '#/api/sys/sys-import-excel-template';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideSquarePen } from '#/components/icons';

import { initColumns } from './data';
import DetailsConfigDrawer from './details-config/index.vue';
import InputDrawer from './input.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '模板名称',
      component: 'Input',
    },
    {
      fieldName: 'importCode',
      label: '模板代码',
      component: 'Input',
    },
    {
      fieldName: 'permissionCode',
      label: '权限代码',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysImportExcelTemplate> = {
  id: 'sys-import-excel-template-list',
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
  tableTitle: '导入模版',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
const [BaseDetailsConfigDrawer, baseDetailsConfigDrawerApi] = useVbenDrawer({
  connectedComponent: DetailsConfigDrawer,
});

async function handleCreate() {
  baseInputDrawerApi.setData({ startRow: 2 });
  baseInputDrawerApi.open();
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleDetailsConfig(row) {
  baseDetailsConfigDrawerApi.setData(row);
  baseDetailsConfigDrawerApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['sys:import:excel:template:save']"
            @click="handleCreate"
          />

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:import:excel:template:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['sys:import:excel:template:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:import:excel:template:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />

        <Button size="small" type="link" @click.stop="handleDetailsConfig(row)">
          <template #icon>
            <LucideSquarePen />
          </template>
          配置
        </Button>
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />
    <!--  配置  -->
    <BaseDetailsConfigDrawer />
  </Page>
</template>
