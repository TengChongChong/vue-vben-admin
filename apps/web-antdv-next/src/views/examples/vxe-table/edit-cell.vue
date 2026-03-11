<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectSampleGeneralApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { type: 'checkbox', minWidth: 50, fixed: 'left' },
    { title: '序号', type: 'seq', minWidth: 50, fixed: 'left' },
    {
      title: '姓名',
      field: 'name',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
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
      editRender: { name: 'input' },
    },
    {
      title: '年龄',
      field: 'age',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
    },
    {
      title: '手机号码',
      field: 'phone',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
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
      editRender: { name: 'input' },
    },
    {
      title: '排序值',
      field: 'orderNo',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
    },
    {
      title: '部门Id',
      field: 'deptId',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
    },
    {
      title: '编辑人',
      field: 'editUser',
      sortable: true,
      minWidth: 160,
      editRender: { name: 'input' },
    },
    {
      title: '编辑时间',
      field: 'editDate',
      sortable: true,
      minWidth: 160,
      formatter: 'dateTime',
      editRender: { name: 'input' },
    },
    {
      title: '操作',
      field: 'action',
      minWidth: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await selectSampleGeneralApi({}, page);
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
