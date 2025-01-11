<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SchedulerJob } from '#/api/scheduler/model/scheduler-job-model';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addApi,
  getApi,
  immediateExecutionApi,
  pauseAllApi,
  removeApi,
  selectApi,
  startAllApi,
} from '#/api/scheduler/scheduler-job';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import {
  LucideChevronDown,
  LucideCirclePause,
  LucideCirclePlay,
  LucideLogs,
} from '#/components/icons';
import LogListModal from '#/views/scheduler/job-log/list-modal.vue';
import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  Button,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Popconfirm,
  Space,
} from 'ant-design-vue';

import { initColumns } from './data';
import InputDrawer from './input.vue';

function handleSearch() {
  gridApi.search();
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
        return await selectApi({ ...formValues }, page);
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
  addApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

const handleImmediateExecution = (id) => {
  immediateExecutionApi(id).then(() => {
    message.success('执行成功');
    handleSearch();
  });
};

const handleStartAll = () => {
  startAllApi().then(() => {
    message.success('执行成功');
    handleSearch();
  });
};

const handlePauseAll = () => {
  pauseAllApi().then(() => {
    message.success('执行成功');
    handleSearch();
  });
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
            :api="removeApi"
            :auth-codes="['scheduler:job:remove']"
            :grid-api="gridApi"
            @success="handleSearch"
          />

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
          :api="removeApi"
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
              <MenuItem key="2" @click="handleOpenRunLogModal(row.id)">
                <template #icon>
                  <LucideLogs />
                </template>
                执行日志
              </MenuItem>
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
