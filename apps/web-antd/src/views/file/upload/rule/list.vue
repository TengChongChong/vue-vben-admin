<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FileUploadRule } from '#/api/file/model/file-upload-rule-model';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  getFileStorageListApi,
  removeApi,
  selectApi,
} from '#/api/file/file-upload-rule';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { formatSize } from '#/util/format';

import { initColumns } from './data';
import InputDrawer from './input.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'category',
      label: '策略分类',
      component: 'DictSelect',
      componentProps: {
        dictType: 'sysFileUploadRuleCategory',
        onChange: () => {
          handleSearch();
        },
      },
    },
    {
      fieldName: 'name',
      label: '策略名称',
      component: 'Input',
    },
    {
      fieldName: 'ruleKey',
      label: '策略Key',
      component: 'Input',
    },
    {
      fieldName: 'platform',
      label: '存储平台',
      component: 'ApiSelect',
      componentProps: {
        api: getFileStorageListApi,
        afterFetch: (data) => {
          return data.map((item) => {
            return {
              label: item.platform,
              value: item.platform,
            };
          });
        },
      },
    },
    {
      fieldName: 'accessControl',
      label: '访问控制',
      component: 'DictSelect',
      componentProps: {
        dictType: 'accessControl',
      },
    },
    {
      fieldName: 'suffix',
      label: '文件后缀',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<FileUploadRule> = {
  id: 'file-upload-rule',
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
  tableTitle: '文件上传规则',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

async function handleCreate() {
  addApi().then(async (res) => {
    const formValues = await gridApi.formApi.getValues();
    baseInputDrawerApi.setData({
      ...res,
      category: formValues.category,
    });
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['file:upload:rule:save']"
            @click="handleCreate"
          />

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['file:upload:rule:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #upperLimit="{ row }">
        {{ formatSize(row.lowerLimit * 1024, 1) }} ~
        {{ formatSize(row.upperLimit * 1024, 1) }}
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['file:upload:rule:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['file:upload:rule:remove']"
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
