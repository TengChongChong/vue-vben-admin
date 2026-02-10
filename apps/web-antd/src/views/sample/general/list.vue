<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SampleGeneral } from '#/api';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Divider, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSampleGeneralApi,
  exportSampleGeneralDataApi,
  getSampleGeneralApi,
  removeSampleGeneralApi,
  selectSampleGeneralApi,
} from '#/api';
import {
  ButtonAdd,
  ButtonEdit,
  ButtonExport,
  ButtonImport,
  ButtonRemove,
} from '#/components/button';
import { downloadFileById } from '#/util/download';

import { initColumns } from './data';
import InputDrawer from './input.vue';
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
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSampleGeneralApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '代码生成示例',
  formOptions,
  gridOptions,
});
const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
async function handleCreate() {
  addSampleGeneralApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
function handleEdit(id: string) {
  getSampleGeneralApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
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
          <ButtonAdd
            :auth-codes="['sample:general:save']"
            @click="handleCreate"
          />
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
        <ButtonEdit
          :auth-codes="['sample:general:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />
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

    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />
  </Page>
</template>
