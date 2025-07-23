<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { WorkflowProcess } from '#/api/workflow/model/workflow-process-model';

import { AccessControl } from '@vben/access';
import { Page, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  activationApi,
  removeApi,
  selectApi,
  suspendApi,
} from '#/api/workflow/workflow-process';
import { ButtonRemove } from '#/components/button';
import {
  LucideCheck,
  LucideChevronDown,
  LucideCircleStop,
  LucideSave,
  LucideWaypoints,
} from '#/components/icons';

import { initColumns } from './data';
import InputModal from './input.vue';

// 导出按钮状态
function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<WorkflowProcess> = {
  id: 'workflow-process',
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
  tableTitle: '流程管理',
  formOptions,
  gridOptions,
});

const [BaseInputModal, baseInputModalApi] = useVbenModal({
  connectedComponent: InputModal,
});

/**
 * 流程转模型
 * @param workflowProcess
 */
function handleConvertToModel(workflowProcess: WorkflowProcess) {
  const { processDefinitionId, name, description } = workflowProcess;
  baseInputModalApi.setData({ processDefinitionId, name, description });
  baseInputModalApi.open();
}

/**
 * 挂起流程
 *
 * @param processDefinitionId     流程id
 */
function handleSuspend(processDefinitionId: string) {
  Modal.confirm({
    title: '挂起流程',
    content: '挂起流程将同时挂起流程相关的任务',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      suspendApi(processDefinitionId, true).then(() => {
        message.success('流程已挂起');
        handleSearch();
      });
    },
  });
}

/**
 * 激活流程
 *
 * @param processDefinitionId     流程id
 */
function handleActivation(processDefinitionId: string) {
  Modal.confirm({
    title: '激活流程',
    content: '激活流程将同时激活流程相关的任务',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      activationApi(processDefinitionId, true).then(() => {
        message.success('流程已激活');
        handleSearch();
      });
    },
  });
}

/**
 * 查看流程图
 *
 * @param deploymentId 部署id
 * @param dgrmResourceName 资源名
 */
function handleOpenProcessModal({ deploymentId, dgrmResourceName }) {}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonRemove
            :api="removeApi"
            :auth-codes="['sample:general:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonRemove
          :api="removeApi"
          :auth-codes="['sample:general:remove']"
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
                <MenuItem @click="handleOpenProcessModal(row.id)">
                  <template #icon>
                    <LucideWaypoints />
                  </template>
                  查看流程图
                </MenuItem>
                <MenuItem @click="handleSuspend(row.processDefinitionId)">
                  <template #icon>
                    <LucideCircleStop />
                  </template>
                  挂起流程
                </MenuItem>
                <MenuItem @click="handleActivation(row.processDefinitionId)">
                  <template #icon>
                    <LucideCheck />
                  </template>
                  激活流程
                </MenuItem>
                <MenuItem @click="handleConvertToModel(row)">
                  <template #icon>
                    <LucideSave />
                  </template>
                  另存为模型
                </MenuItem>
              </AccessControl>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputModal @success="handleSearch" />
  </Page>
</template>
