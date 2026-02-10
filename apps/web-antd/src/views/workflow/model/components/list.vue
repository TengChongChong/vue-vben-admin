<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { WorkflowModelVO } from '#/api';

import { watch } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deploymentProcessApi,
  getWorkflowModelApi,
  removeWorkflowModelApi,
  selectWorkflowModelApi,
} from '#/api';
import { ButtonAdd, ButtonRemove } from '#/components/button';
import {
  LucideCheck,
  LucideChevronDown,
  LucideCircleStop,
  LucideSquarePen,
} from '#/components/icons';

import { initColumns } from './data';
import InputModal from './input.vue';
import ModelDesign from './model-design.vue';

const props = defineProps<{
  categoryId?: string;
}>();

function handleSearch() {
  gridApi.search();
}

watch(
  () => props.categoryId,
  () => handleSearch(),
);

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'key',
      label: '流程标识',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<WorkflowModelVO> = {
  id: 'workflow-model',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectWorkflowModelApi(
          { ...formValues, category: props.categoryId },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '流程模型',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

const [BaseModelDesignDrawer, baseModelDesignDrawerApi] = useVbenDrawer({
  connectedComponent: ModelDesign,
});

async function handleCreate() {
  // 将部分查询条件作为默认值
  baseInputModalApi.setData({
    category: props.categoryId,
  });
  baseInputModalApi.open();
}

function handleEdit(id: string) {
  getWorkflowModelApi(id).then((res) => {
    baseInputModalApi.setData(res);
    baseInputModalApi.open();
  });
}
function handleModelDesign(id: string) {
  baseModelDesignDrawerApi.setData({ id });
  baseModelDesignDrawerApi.open();
}

function handleDeploymentProcess(id: string) {
  deploymentProcessApi(id).then((res) => {
    if (res) {
      message.success('部署成功');
    }
  });
}
</script>

<template>
  <Grid>
    <template #toolbar-tools>
      <Space>
        <ButtonAdd
          :auth-codes="['workflow:model:save']"
          @click="handleCreate"
        />

        <ButtonRemove
          :api="removeWorkflowModelApi"
          :auth-codes="['workflow:model:remove']"
          :grid-api="gridApi"
          @success="handleSearch"
        />

        <Divider class="h-5" type="vertical" />
      </Space>
    </template>
    <template #action="{ row }">
      <AccessControl :codes="['workflow:model:save']">
        <Button type="link" size="small" @click="handleModelDesign(row.id)">
          <template #icon>
            <LucideSquarePen />
          </template>
          流程设计
        </Button>
      </AccessControl>

      <ButtonRemove
        :api="removeWorkflowModelApi"
        :auth-codes="['workflow:model:remove']"
        :ids="[row.id]"
        size="small"
        type="link"
        @success="handleSearch"
      />

      <Dropdown>
        <Button size="small" type="link" @click.prevent>
          更多
          <LucideChevronDown />
        </Button>
        <template #overlay>
          <Menu>
            <AccessControl :codes="['workflow:model:save']">
              <MenuItem @click="handleEdit(row.id)">
                <template #icon>
                  <LucideSquarePen />
                </template>
                编辑
              </MenuItem>
              <MenuItem @click="handleDeploymentProcess(row.id)">
                <template #icon>
                  <LucideCheck />
                </template>
                发布
              </MenuItem>
              <MenuItem>
                <template #icon>
                  <LucideCircleStop />
                </template>
                停用
              </MenuItem>
            </AccessControl>
          </Menu>
        </template>
      </Dropdown>
    </template>
  </Grid>
  <!--  编辑  -->
  <BaseInputModal @success="handleSearch" />

  <!--  流程设计  -->
  <BaseModelDesignDrawer @success="handleSearch" />
</template>
