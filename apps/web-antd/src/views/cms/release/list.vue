<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CmsRelease } from '#/api';

import { computed, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import {
  Alert,
  Button,
  Divider,
  message,
  Modal,
  Progress,
  Space,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  cancelCmsReleaseApi,
  selectCmsReleaseApi,
  startCmsReleaseApi,
} from '#/api';
import { ButtonAdd } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import {
  LucideListTree,
  LucideRotateCcw,
  LucideSend,
} from '#/components/icons';
import { useCmsSiteStore } from '#/store';
import { buildTenantGridId } from '#/utils/tenant-grid-id';

import CreateModal from './create.vue';
import { initColumns } from './data';
import QueueDrawer from './queue-drawer.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

function handleSearch() {
  if (!hasActiveSite.value) {
    return;
  }
  gridApi.query();
}

function handleStart(row: CmsRelease) {
  Modal.confirm({
    title: '开始发布',
    content: '将根据已创建队列生成静态 HTML 文件到站点部署路径，是否继续？',
    onOk: async () => {
      await startCmsReleaseApi(row.id);
      message.success('已开始发布');
      handleSearch();
    },
  });
}

function handleCancel(row: CmsRelease) {
  Modal.confirm({
    title: '取消发布',
    content: '确定要取消当前发布任务吗？',
    onOk: async () => {
      await cancelCmsReleaseApi(row.id);
      message.success('已取消发布');
      handleSearch();
    },
  });
}

function handleQueue(row: CmsRelease) {
  baseQueueDrawerApi.setData({
    parentId: row.id,
    releaseName: row.id,
  });
  baseQueueDrawerApi.open();
}

function handleViewQueueFromCreate(parentId: string) {
  handleQueue({ id: parentId } as CmsRelease);
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'cmsReleaseStatus',
      },
    },
    {
      fieldName: 'releaseArticle',
      label: '包含文章',
      component: 'DictSelect',
      componentProps: {
        dictType: 'whether',
      },
    },
  ],
};

const gridOptions: VxeGridProps<CmsRelease> = {
  id: buildTenantGridId('cms-release'),
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!cmsSiteStore.hasActiveSite) {
          return { records: [], total: 0 };
        }
        return await selectCmsReleaseApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '网站发布',
  formOptions,
  gridOptions,
});

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    handleSearch();
  },
);

const [BaseCreateModal, baseCreateModalApi] = useVbenModal({
  connectedComponent: CreateModal,
});
const [BaseQueueDrawer, baseQueueDrawerApi] = useVbenDrawer({
  connectedComponent: QueueDrawer,
});

function handleCreate() {
  if (!hasActiveSite.value) {
    return;
  }
  baseCreateModalApi.open();
}

function getProgressStats(row: CmsRelease) {
  const total = Number(row.total || 0);
  const done = Number(row.done || 0);
  const fail = Number(row.fail || 0);
  const pending = Math.max(total - done - fail, 0);
  if (total <= 0) {
    return { total, done, fail, pending, percent: 0, successPercent: 0 };
  }
  return {
    total,
    done,
    fail,
    pending,
    percent: Math.min(100, Math.round(((done + fail) / total) * 100)),
    successPercent: Math.min(100, Math.round((done / total) * 100)),
  };
}
</script>

<template>
  <Page auto-content-height>
    <Alert
      v-if="!hasActiveSite"
      banner
      class="mb-3"
      message="请先选择当前编辑站点"
      type="warning" />
    <Alert
      v-else
      banner
      class="mb-3"
      message="创建发布任务后，系统将通过模板生成静态 HTML 到站点部署路径；生产环境请配置 Nginx 独立域名托管该目录。"
      type="info" />
    <div style="height: calc(100% - 40px)">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <ButtonAdd
              :auth-codes="['cms:release']"
              :disabled="!hasActiveSite"
              text="创建发布"
              @click="handleCreate" />
            <Divider class="h-5" type="vertical" />
          </Space>
        </template>
        <template #progress="{ row }">
          <div class="flex items-center gap-2 px-2 py-1">
            <Progress
              class="mb-0! min-w-0 flex-1"
              :percent="getProgressStats(row).percent"
              :show-info="false"
              size="small"
              stroke-color="#ef4444"
              :success="{ percent: getProgressStats(row).successPercent }" />
            <div class="shrink-0 whitespace-nowrap text-xs text-gray-500">
              <span class="text-green-600">成功 {{ getProgressStats(row).done }}</span>
              <span class="mx-1">/</span>
              <span class="text-red-500">失败 {{ getProgressStats(row).fail }}</span>
              <span class="mx-1">/</span>
              <span>待处理 {{ getProgressStats(row).pending }}</span>
              <span class="ml-1 text-gray-400">（共 {{ getProgressStats(row).total }}）</span>
            </div>
          </div>
        </template>
        <template #action="{ row }">
          <AccessControl :codes="['cms:release']">
            <Button
              v-if="row.status === '0'"
              size="small"
              type="link"
              @click="handleStart(row)">
              <template #icon>
                <LucideSend />
              </template>
              开始
            </Button>
            <Button
              v-if="row.status === '1'"
              size="small"
              type="link"
              @click="handleCancel(row)">
              <template #icon>
                <LucideRotateCcw />
              </template>
              取消
            </Button>
            <Button size="small" type="link" @click="handleQueue(row)">
              <template #icon>
                <LucideListTree />
              </template>
              队列
            </Button>
          </AccessControl>
        </template>
      </Grid>
    </div>

    <BaseCreateModal
      @success="handleSearch"
      @view-queue="handleViewQueueFromCreate" />
    <BaseQueueDrawer />
    <CmsSiteSwitcher />
  </Page>
</template>
