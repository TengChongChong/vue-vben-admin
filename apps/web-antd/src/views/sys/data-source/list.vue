<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDataSource } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSysDataSourceApi,
  getSysDataSourceApi,
  removeSysDataSourceApi,
  selectSysDataSourceApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';

import { initColumns } from './data';
import InputModal from './input.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '数据源名称',
      component: 'Input',
    },
    {
      fieldName: 'url',
      label: 'Url',
      component: 'Input',
    },
    {
      fieldName: 'username',
      label: '账号',
      component: 'Input',
    },
    {
      fieldName: 'remarks',
      label: '备注',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysDataSource> = {
  id: 'sys-data-source',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysDataSourceApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '数据源',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

async function handleCreate() {
  addSysDataSourceApi().then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleEdit(id: string) {
  getSysDataSourceApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['sys:data:source:save']"
            @click="handleCreate"
          />

          <ButtonRemove
            :api="removeSysDataSourceApi"
            :auth-codes="['sys:data:source:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['sys:data:source:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeSysDataSourceApi"
          :auth-codes="['sys:data:source:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
