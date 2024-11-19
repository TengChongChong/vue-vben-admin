<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysException } from '#/api/sys/model/sys-exception-model';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApi, removeApi, selectApi } from '#/api/sys/sys-exception';
import { ButtonInfo, ButtonRemove } from '#/components/button';

import { initColumns } from './data';
import InfoDrawer from './info.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  fieldMappingTime: [
    [
      'triggerTimeRange',
      ['startTriggerTime', 'endTriggerTime'],
      'YYYY-MM-DD HH:mm:ss',
    ],
  ],
  schema: [
    {
      fieldName: 'id',
      label: '错误ID',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: 'Http Status',
      component: 'Input',
    },
    {
      fieldName: 'type',
      label: '异常类型',
      component: 'Input',
    },
    {
      fieldName: 'message',
      label: '错误信息',
      component: 'Input',
    },
    {
      fieldName: 'nickname',
      label: '触发用户',
      component: 'Input',
    },
    {
      fieldName: 'url',
      label: 'Url',
      component: 'Input',
    },
    {
      fieldName: 'triggerTimeRange',
      label: '触发时间',
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
      colProps: { xxl: 12, xl: 16, md: 24 },
    },
  ],
};

const gridOptions: VxeGridProps<SysException> = {
  id: 'sys-exception',
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

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '异常日志',
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
      <template #toolbar-tools>
        <Space>
          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:exception:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonInfo size="small" type="link" @click="handleInfo(row.id)" />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:exception:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>

    <!--  详情  -->
    <BaseInfoDrawer />
  </Page>
</template>
