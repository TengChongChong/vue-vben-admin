<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SchedulerJob } from '#/api';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Popconfirm,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addSchedulerJobApi,
  getSchedulerJobApi,
  immediateExecutionSchedulerJobApi,
  pauseAllSchedulerJobApi,
  removeSchedulerJobApi,
  selectSchedulerJobApi,
  startAllSchedulerJobApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import {
  LucideChevronDown,
  LucideCirclePause,
  LucideCirclePlay,
  LucideLogs,
} from '#/components/icons';
import LogListModal from '#/views/scheduler/job-log/list-modal.vue';

import { initColumns } from './data';
import InputDrawer from './input.vue';

function handleSearch() {
  gridApi.query();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
    },
    {
      fieldName: 'code',
      label: '代码',
      component: 'Input',
    },
    {
      fieldName: 'bean',
      label: '类（Bean）',
      component: 'Input',
    },
    {
      fieldName: 'method',
      label: '方法',
      component: 'Input',
    },
  ],
};

const gridOptions: VxeGridProps<SchedulerJob> = {
  id: 'scheduler-job',
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSchedulerJobApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '定时任务',
  formOptions,
  gridOptions,
});

const [BaseLogListModal, baseLogListModalApi] = useVbenModal({
  connectedComponent: LogListModal,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

async function handleCreate() {
  try {
    const res = await addSchedulerJobApi();
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  } catch (error) {
    message.error('初始化新增任务失败，请稍后重试');
  }
}

async function handleEdit(id: string) {
  try {
    const res = await getSchedulerJobApi(id);
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  } catch (error) {
    message.error('加载任务详情失败，请稍后重试');
  }
}

const handleImmediateExecution = async (id: string) => {
  try {
    await immediateExecutionSchedulerJobApi(id);
    message.success('执行成功');
    handleSearch();
  } catch (error) {
    message.error('执行失败，请稍后重试');
  }
};

const handleStartAll = async () => {
  try {
    await startAllSchedulerJobApi();
    message.success('执行成功');
    handleSearch();
  } catch (error) {
    message.error('操作失败，请稍后重试');
  }
};

const handlePauseAll = async () => {
  try {
    await pauseAllSchedulerJobApi();
    message.success('执行成功');
    handleSearch();
  } catch (error) {
    message.error('操作失败，请稍后重试');
  }
};

async function handleOpenRunLogModal(id: string) {
  baseLogListModalApi.setData({ schedulerJobId: id });
  baseLogListModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['scheduler:job:save']"
            @click="handleCreate"
          />

          <ButtonRemove
            :api="removeSchedulerJobApi"
            :auth-codes="['scheduler:job:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <AccessControl :codes="['scheduler:job:save']">
            <Popconfirm
              cancel-text="否"
              ok-text="是"
              title="确定要全部开始吗？"
              @confirm="handleStartAll()"
            >
              <Button danger type="primary">
                <template #icon>
                  <LucideCirclePlay />
                </template>
                全部开始
              </Button>
            </Popconfirm>
          </AccessControl>
          <AccessControl :codes="['scheduler:job:save']">
            <Popconfirm
              cancel-text="否"
              ok-text="是"
              title="确定要全部暂停吗？"
              @confirm="handlePauseAll()"
            >
              <Button danger type="primary">
                <template #icon>
                  <LucideCirclePause />
                </template>
                全部暂停
              </Button>
            </Popconfirm>
          </AccessControl>

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonEdit
          :auth-codes="['scheduler:job:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)"
        />

        <ButtonRemove
          :api="removeSchedulerJobApi"
          :auth-codes="['scheduler:job:remove']"
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
              <AccessControl :codes="['scheduler:job:save']">
                <Popconfirm
                  cancel-text="否"
                  ok-text="是"
                  title="确定要立即执行吗？"
                  @confirm="handleImmediateExecution(row.id)"
                >
                  <MenuItem key="1">
                    <template #icon>
                      <LucideCirclePlay />
                    </template>
                    立即执行
                  </MenuItem>
                </Popconfirm>
              </AccessControl>
              <AccessControl :codes="['scheduler:job:select']">
                <MenuItem key="2" @click="handleOpenRunLogModal(row.id)">
                  <template #icon>
                    <LucideLogs />
                  </template>
                  执行日志
                </MenuItem>
              </AccessControl>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
    <!--  编辑  -->
    <BaseInputDrawer @success="handleSearch" />

    <!--  执行日志  -->
    <BaseLogListModal />
  </Page>
</template>
