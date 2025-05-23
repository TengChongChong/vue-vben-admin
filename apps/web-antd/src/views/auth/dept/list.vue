<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDept } from '#/api/auth/model/sys-dept-model';

import { ref, unref } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Divider, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { addApi, getApi, removeApi, selectApi } from '#/api/auth/sys-dept';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import {
  LucideListOrdered,
  LucideListTree,
  LucideMinus,
  LucidePlus,
} from '#/components/icons';
import { router } from '#/router';

import { initColumns } from './data';
import InputDrawer from './input.vue';
import OrderDrawer from './order.vue';

const expandRecords = ref([]);

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'title',
      label: '部门名称',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: '部门编码',
      component: 'Input',
    },
    {
      fieldName: 'typeName',
      label: '部门类型',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SysDept> = {
  id: 'auth-dept',
  columns: initColumns(),
  pagerConfig: {
    enabled: false,
  },
  checkboxConfig: {
    range: false,
  },
  treeConfig: {
    transform: true,
    // 用于 tree-config.transform，树节点的字段名
    rowField: 'id',
    // 用于 tree-config.transform，树父节点的字段名
    parentField: 'parentId',
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        // 保持展开状态
        await gridApi.grid.setTreeExpand(unref(expandRecords), true);
        return await selectApi({ ...formValues });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '部门管理',
  formOptions,
  gridOptions,
  gridEvents: {
    toggleTreeExpand: () => {
      expandRecords.value = gridApi.grid.getTreeExpandRecords();
    },
  },
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

function handleDeptTypeList() {
  router.push('/auth/dept-type/list');
}

function handleExpandAll() {
  gridApi.grid?.setAllTreeExpand(true);
  expandRecords.value = gridApi.grid.getTreeExpandRecords();
}
function handleCollapseAll() {
  gridApi.grid?.clearTreeExpand();
  expandRecords.value = gridApi.grid.getTreeExpandRecords();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd :auth-codes="['sys:dept:save']" @click="handleCreate" />
          <AccessControl :codes="['sys:dept:type:save']">
            <Button @click="handleDeptTypeList">
              <template #icon>
                <LucideListTree />
              </template>
              部门类型管理
            </Button>
          </AccessControl>

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
            :auth-codes="['sys:dept:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonAdd
          :auth-codes="['sys:dept:save']"
          size="small"
          text="新增下级"
          type="link"
          @click="handleCreate(row.id)"
        />

        <ButtonEdit
          :auth-codes="['sys:dept:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sys:dept:remove']"
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
