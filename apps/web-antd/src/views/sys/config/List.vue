<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';
import type { SysConfig } from '#/api/sys/model/sysConfigModel';

import { Page, useVbenModal } from '@vben/common-ui';

import { ReloadOutlined } from '@ant-design/icons-vue';
import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter';
import { refreshApi, removeApi, selectApi } from '#/api/sys/sysConfig';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { columns } from '#/views/sys/config/config.data';

import InputModal from './input.vue';

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'category',
      label: '所属分类',
      component: 'DictSelect',
      componentProps: {
        dictType: 'configCategory',
      },
      onChange: () => handleSearch(),
    },
    {
      fieldName: 'sysKey',
      label: 'Key',
      component: 'Input',
    },
    {
      fieldName: 'value',
      label: 'Value',
      component: 'Input',
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictSelect',
      componentProps: {
        dictType: 'dataType',
      },
      onChange: () => handleSearch(),
    },
    {
      fieldName: 'remarks',
      label: '备注',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysConfig> = {
  id: 'sys-config',
  columns,
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page, sort }, formValues) => {
        return await selectApi(
          { ...formValues },
          {
            current: page.currentPage,
            pageSize: page.pageSize,
            sortField: sort.field,
            sortOrder: sort.order,
          },
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function handleSearch() {
  gridApi.search();
}

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

async function handleAdd() {
  // 将部分查询条件作为默认值
  const { category, type, sys } = await gridApi.formApi.getValues();
  baseInputModalApi.setData({ category, type, sys });
  baseInputModalApi.open();
}

function handleEdit(id: string) {
  baseInputModalApi.setData({ id });
  baseInputModalApi.open();
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
        <span class="table-title">系统参数</span>
      </template>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:config:save']" @click="handleAdd" />

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:config:remove']"
            :grid-api="gridApi"
          />

          <Button @click="handleReloadCache">
            <template #icon> <ReloadOutlined /> </template>
            刷新缓存
          </Button>
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['sys:config:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:config:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
        />
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
