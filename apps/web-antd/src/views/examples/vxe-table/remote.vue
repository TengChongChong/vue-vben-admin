<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SampleGeneral } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Divider, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportSampleGeneralDataApi,
  removeSampleGeneralApi,
  selectSampleGeneralApi,
} from '#/api';
import { ButtonExport, ButtonImport, ButtonRemove } from '#/components/button';
import { downloadFileById } from '#/util/download';

// 导出按钮状态
const exportBtnLoading = ref<boolean>(false);
function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
    },
    {
      fieldName: 'sex',
      label: '性别',
      component: 'DictSelect',
      componentProps: {
        dictType: 'sex',
      },
    },
    {
      fieldName: 'phone',
      label: '手机号码',
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
      fieldName: 'address',
      label: '地址',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SampleGeneral> = {
  id: 'sample-general',
  columns: [
    { type: 'checkbox', minWidth: 50, fixed: 'left' },
    { title: '序号', type: 'seq', minWidth: 50, fixed: 'left' },
    {
      title: '姓名',
      field: 'name',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '性别',
      field: 'sex',
      sortable: true,
      minWidth: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'sex' },
      },
    },
    {
      title: '年龄',
      field: 'age',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '手机号码',
      field: 'phone',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      minWidth: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'commonStatus' },
      },
    },
    {
      title: '排序值',
      field: 'orderNo',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '部门Id',
      field: 'deptId',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '编辑人',
      field: 'editUser',
      sortable: true,
      minWidth: 160,
    },
    {
      title: '编辑时间',
      field: 'editDate',
      sortable: true,
      minWidth: 160,
      formatter: 'dateTime',
    },
    {
      title: '操作',
      field: 'action',
      minWidth: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSampleGeneralApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '远程加载',
  formOptions,
  gridOptions,
});

const handelExportData = async () => {
  exportBtnLoading.value = true;
  try {
    await exportSampleGeneralDataApi(await gridApi.formApi.getValues()).then(
      (id) => {
        downloadFileById(id);
      },
    );
  } catch (error) {
    console.error('导出数据错误', error);
  } finally {
    exportBtnLoading.value = false;
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonRemove
            :api="removeSampleGeneralApi"
            :auth-codes="['sample:general:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
          <ButtonImport
            import-code="sample:general"
            :auth-codes="['sample:general:import:data']"
          />
          <ButtonExport :loading="exportBtnLoading" @click="handelExportData" />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonRemove
          :api="removeSampleGeneralApi"
          :auth-codes="['sample:general:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>
  </Page>
</template>
