<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { WorkflowCategory } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addWorkflowCategoryApi,
  getWorkflowCategoryApi,
  removeWorkflowCategoryApi,
  selectWorkflowCategoryApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideListOrdered, LucideMinus, LucidePlus } from '#/components/icons';

import { initColumns } from './data';
import InputModal from './input.vue';
import OrderModal from './order.vue';

function handleSearch() {
  gridApi.query();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '分类名称',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: '分类编码',
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
  ],
};

const gridOptions: VxeGridProps<WorkflowCategory> = {
  id: 'workflow-category',
  columns: initColumns(),
  pagerConfig: {
    enabled: false,
  },
  checkboxConfig: {
    range: false,
  },
  treeConfig: {
    // 是否保留展开状态，对于某些场景可能会用到，比如数据被刷新之后还保留之前展开的状态
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
      query: async ({ page }, formValues) => {
        return await selectWorkflowCategoryApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '流程分类',
  formOptions,
  gridOptions,
});
const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});
const [BaseOrderModal, baseOrderModalApi] = useVbenModal({
  connectedComponent: OrderModal,
});
async function handleCreate(id: string) {
  addWorkflowCategoryApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}
function handleEdit(id: string) {
  getWorkflowCategoryApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}

function handleOrder() {
  baseOrderModalApi.open();
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
            :auth-codes="['workflow:category:save']"
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
            :api="removeWorkflowCategoryApi"
            :auth-codes="['workflow:category:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonAdd
          :auth-codes="['workflow:category:save']"
          size="small"
          text="新增下级"
          type="link"
          @click="handleCreate(row.id)"
        />
        <ButtonEdit
          :auth-codes="['workflow:category:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />
        <ButtonRemove
          :api="removeWorkflowCategoryApi"
          :auth-codes="['workflow:category:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>

    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
    <!--  排序  -->
    <BaseOrderModal @success="handleSearch" />
  </Page>
</template>
