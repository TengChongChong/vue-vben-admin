<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysLog } from '#/api/sys/model/sys-log-model';

import { Page, useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApi, selectApi } from '#/api/sys/sys-log';
import { ButtonInfo } from '#/components/button';

import { initColumns } from './data';
import InfoDrawer from './info.vue';

const formOptions: VbenFormProps = {
  collapsed: true,
  fieldMappingTime: [
    [
      'operationDateRange',
      ['startOperationDate', 'endOperationDate'],
      'YYYY-MM-DD HH:mm:ss',
    ],
  ],
  schema: [
    {
      fieldName: 'modular',
      label: '模块',
      component: 'Input',
    },
    {
      fieldName: 'method',
      label: '方法',
      component: 'Input',
    },
    {
      fieldName: 'ip',
      label: 'ip',
      component: 'Input',
    },
    {
      fieldName: 'uri',
      label: 'Uri',
      component: 'Input',
    },
    {
      fieldName: 'clazz',
      label: '类',
      component: 'Input',
    },
    {
      fieldName: 'params',
      label: '参数',
      component: 'Input',
    },
    {
      fieldName: 'operationUser',
      label: '操作人',
      component: 'Input',
    },
    {
      fieldName: 'operationDateRange',
      label: '操作时间',
      component: 'RangePicker',
      componentProps: {
        allowEmpty: [true, true],
        showTime: true,
        presets: [
          {
            label: '今天',
            value: [dayjs().startOf('day'), dayjs().endOf('day')],
          },
          {
            label: '本周',
            value: [dayjs().startOf('week'), dayjs().endOf('week')],
          },
          {
            label: '本月',
            value: [dayjs().startOf('month'), dayjs().endOf('month')],
          },
        ],
      },
    },
  ],
};

const gridOptions: VxeGridProps<SysLog> = {
  id: 'sys-log',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        try {
          return await selectApi({ ...formValues }, page);
        } catch (error) {
          console.error(error);
        }
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({
  tableTitle: '访问日志',
  formOptions,
  gridOptions,
});

const [BaseInfoDrawer, baseInfoDrawerApi] = useVbenDrawer({
  connectedComponent: InfoDrawer,
});

async function handleInfo(id: string) {
  getApi(id).then((res) => {
    baseInfoDrawerApi.setData(res);
    baseInfoDrawerApi.open();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <ButtonInfo size="small" type="link" @click="handleInfo(row.id)" />
      </template>
    </Grid>

    <!--  详情  -->
    <BaseInfoDrawer />
  </Page>
</template>
