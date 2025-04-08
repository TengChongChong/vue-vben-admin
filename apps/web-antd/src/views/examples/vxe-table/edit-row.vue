<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectApi } from '#/api/sample/sample-general';

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
    mode: 'row',
    trigger: 'click',
  },
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await selectApi({}, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function hasEditStatus(row: RowType) {
  return gridApi.grid?.isEditByRow(row);
}

function editRowEvent(row: RowType) {
  gridApi.grid?.setEditRow(row);
}

async function saveRowEvent(row: RowType) {
  await gridApi.grid?.clearEdit();

  gridApi.setLoading(true);
  setTimeout(() => {
    gridApi.setLoading(false);
    message.success({
      content: `保存成功！category=${row.category}`,
    });
  }, 600);
}

const cancelRowEvent = (_row: RowType) => {
  gridApi.grid?.clearEdit();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <template v-if="hasEditStatus(row)">
          <Button type="link" @click="saveRowEvent(row)">保存</Button>
          <Button type="link" @click="cancelRowEvent(row)">取消</Button>
        </template>
        <template v-else>
          <Button type="link" @click="editRowEvent(row)">编辑</Button>
        </template>
      </template>
    </Grid>
  </Page>
</template>
