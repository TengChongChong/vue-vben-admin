<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysConfig } from '#/api/sys/model/sys-config-model';

import { useAccess } from '@vben/access';
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApi, refreshApi, removeApi, selectApi } from '#/api/sys/sys-config';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideRefreshCw } from '#/components/icons';
import { RoleEnum } from '#/enums/roleEnum';

import { initColumns } from './data';
import InputModal from './input.vue';

const { hasAccessByRoles } = useAccess();

function handleSearch() {
  gridApi.search();
}

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
      fieldName: 'sys',
      label: '系统',
      component: 'DictSelect',
      componentProps: {
        dictType: 'whether',
      },
      ifShow: hasAccessByRoles([RoleEnum.SYS_ADMIN]),
      onChange: () => handleSearch(),
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
  tableTitle: '定时任务',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

async function handleCreate() {
  // 将部分查询条件作为默认值
  const { category, type, sys } = await gridApi.formApi.getValues();
  baseInputModalApi.setData({
    category,
    type: type || 'text',
    sys: sys || '0',
  });
  baseInputModalApi.open();
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
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
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:config:save']" @click="handleCreate" />

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:config:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Button @click="handleReloadCache">
            <template #icon> <LucideRefreshCw /> </template>
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
          @success="handleSearch"
        />
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
