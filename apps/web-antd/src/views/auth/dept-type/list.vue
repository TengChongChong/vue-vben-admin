<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDeptType } from '#/api/auth/model/sys-dept-type-model';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Divider, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  removeApi,
  selectApi,
} from '#/api/auth/sys-dept-type.ts';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideListOrdered, LucideMinus, LucidePlus } from '#/components/icons';

import { initColumns } from './data';
import InputDrawer from './input.vue';
import OrderDrawer from './order.vue';

function handleSearch() {
  gridApi.query();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'title',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: '代码',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysDeptType> = {
  id: 'auth-dept-type',
  columns: initColumns(),
  pagerConfig: {
    enabled: false,
  },
  checkboxConfig: {
    range: false,
  },
  treeConfig: {
    // 是否保留展开状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前展开的状态（需要有 row-config.keyField）
    reserve: true,
    // 自动将列表转为树结构（支持虚拟滚动）
    transform: true,
    // 用于 tree-config.transform，树节点的字段名
    rowField: 'id',
    // 用于 tree-config.transform，树父节点的字段名
    parentField: 'parentId',
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return await selectApi({ ...formValues });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '部门类型管理',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
const [BaseOrderDrawer, baseOrderDrawerApi] = useVbenDrawer({
  connectedComponent: OrderDrawer,
});

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleCreate(id: string) {
  baseInputDrawerApi.setData({ id });
  addApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleOrder() {
  baseOrderDrawerApi.open();
}

function handleExpandAll() {
  gridApi.grid?.setAllTreeExpand(true);
}
function handleCollapseAll() {
  gridApi.grid?.clearTreeExpand();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['sys:dept:type:save']"
            @click="handleCreate"
          />
          <Button @click="handleOrder">
            <template #icon>
              <LucideListOrdered />
            </template>
            排序
          </Button>
          <Button @click="handleExpandAll">
            <template #icon>
              <LucidePlus />
            </template>
            展开全部
          </Button>
          <Button @click="handleCollapseAll">
            <template #icon>
              <LucideMinus />
            </template>
            折叠全部
          </Button>

          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sys:dept:type:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonAdd
          :auth-codes="['sys:dept:type:save']"
          size="small"
          text="新增下级"
          type="link"
          @click="handleCreate(row.id)"
        />

        <ButtonEdit
          :auth-codes="['sys:dept:type:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:dept:type:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />
    <!--  排序  -->
    <BaseOrderDrawer @success="handleSearch" />
  </Page>
</template>
