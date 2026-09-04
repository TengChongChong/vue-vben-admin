<script lang="ts" setup>
import type { CmsResource } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { formatSize, formatToDateTime } from '@vben/utils';

import {
  Alert,
  Button,
  Card,
  Empty,
  message,
  Pagination,
  Spin,
  Tabs,
  Tag,
} from 'antdv-next';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { buildPageSizeOptions } from '#/adapter/vxe-table';
import {
  getCmsResourceDownloadIdApi,
  removeCmsResourceApi,
  selectCmsResourceApi,
} from '#/api';
import { ButtonRemove } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import {
  LucideCopy,
  LucideDownload,
  LucideEye,
  LucideFile,
  LucideFileAudio,
  LucideFileText,
  LucideFileVideo,
} from '#/components/icons';
import { $t } from '#/locales';
import { useCmsSiteStore } from '#/store';
import { downloadFileById } from '#/util/download';

import {
  getDisplayName,
  getSourceLabel,
  isAudio,
  isImage,
  isVideo,
} from './data';
import PreviewDrawer from './preview.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const loading = ref(false);
const records = ref<CmsResource[]>([]);
const current = ref(1);
const pageSize = ref(24);
const pageSizeOptions = buildPageSizeOptions(24);
const total = ref(0);
const activeType = ref('');
let fetchSeq = 0;

function showTotal(t: number) {
  return `共 ${t} 条记录`;
}

const [FilterForm, filterFormApi] = useVbenForm({
  handleReset: async () => {
    filterFormApi.reset();
    current.value = 1;
    await fetchList();
  },
  handleSubmit: async () => {
    current.value = 1;
    await fetchList();
  },
  collapsed: true,
  collapsedRows: 1,
  showCollapseButton: true,
  fieldMappingTime: [
    [
      'createDateRange',
      ['startCreateDate', 'endCreateDate'],
      'YYYY-MM-DD HH:mm:ss',
    ],
  ],
  submitButtonOptions: {
    content: computed(() => $t('common.search')),
  },
  schema: [
    {
      fieldName: 'keyword',
      label: '文件名',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'createDateRange',
      label: '上传时间',
      component: 'RangePicker',
      componentProps: {
        allowEmpty: [true, true],
        format: 'YYYY-MM-DD HH:mm',
        showTime: { format: 'HH:mm' },
        presets: [
          {
            label: '今天',
            value: [dayjs().startOf('day'), dayjs().endOf('day')],
          },
          {
            label: '本周',
            value: [dayjs().startOf('week'), dayjs().endOf('week')],
          },
          {
            label: '本月',
            value: [dayjs().startOf('month'), dayjs().endOf('month')],
          },
        ],
      },
      formItemClass: 'col-span-1',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const [BasePreviewDrawer, basePreviewDrawerApi] = useVbenDrawer({
  connectedComponent: PreviewDrawer,
});

const typeTabs = [
  { key: '', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'doc', label: '文档' },
  { key: 'attachment', label: '附件' },
];

async function fetchList() {
  if (!hasActiveSite.value) {
    records.value = [];
    total.value = 0;
    return;
  }
  const seq = ++fetchSeq;
  try {
    loading.value = true;
    const formValues = await filterFormApi.getValues();
    const res = await selectCmsResourceApi(
      {
        keyword: formValues.keyword,
        startCreateDate: formValues.startCreateDate,
        endCreateDate: formValues.endCreateDate,
        type: activeType.value || undefined,
      },
      {
        current: current.value,
        pageSize: pageSize.value,
      },
    );
    if (seq !== fetchSeq) {
      return;
    }
    records.value = res.records ?? [];
    total.value = res.total ?? 0;
  } finally {
    if (seq === fetchSeq) {
      loading.value = false;
    }
  }
}

function handleTypeChange(key: number | string) {
  activeType.value = key ? String(key) : '';
  current.value = 1;
  fetchList();
}

function handlePageChange(page: number, size: number) {
  current.value = page;
  pageSize.value = size;
  fetchList();
}

function handlePreview(item: CmsResource) {
  if (!item.id) {
    return;
  }
  basePreviewDrawerApi.setData(item);
  basePreviewDrawerApi.open();
}

async function handleCopyUrl(item: CmsResource) {
  if (!item.url) {
    message.warning('暂无可用链接');
    return;
  }
  try {
    await navigator.clipboard.writeText(item.url);
    message.success('链接已复制');
  } catch {
    message.error('复制失败，请手动复制');
  }
}

async function handleDownload(item: CmsResource) {
  if (!item.id) {
    return;
  }
  const downloadId = await getCmsResourceDownloadIdApi(item.id);
  downloadFileById(downloadId);
}

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    current.value = 1;
    fetchList();
  },
);

onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <Page auto-content-height>
    <Alert
      v-if="!hasActiveSite"
      banner
      class="mb-4!"
      message="请先选择当前编辑站点"
      type="warning" />

    <Card :bordered="false" class="mb-4!">
      <FilterForm />
    </Card>

    <Tabs :active-key="activeType" class="mb-3" @change="handleTypeChange">
      <Tabs.TabPane v-for="tab in typeTabs" :key="tab.key" :tab="tab.label" />
    </Tabs>

    <Spin :spinning="loading">
      <div
        v-if="records.length > 0"
        class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <Card
          v-for="item in records"
          :key="item.id"
          class="overflow-hidden transition-shadow hover:shadow-md"
          :body-style="{ padding: '12px' }">
          <div
            class="relative mb-2 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
            <img
              v-if="isImage(item) && item.url"
              :alt="getDisplayName(item)"
              class="h-full w-full object-contain"
              :src="item.thUrl || item.url" />
            <LucideFileVideo
              v-else-if="isVideo(item)"
              class="size-10 text-gray-400" />
            <LucideFileAudio
              v-else-if="isAudio(item)"
              class="size-10 text-gray-400" />
            <LucideFileText
              v-else-if="item.objectType === 'content-doc'"
              class="size-10 text-gray-400" />
            <LucideFile v-else class="size-10 text-gray-400" />
            <Tag class="absolute left-2 top-2" color="blue">
              {{ getSourceLabel(item.objectType) }}
            </Tag>
          </div>

          <div
            class="mb-1 truncate text-sm font-medium"
            :title="getDisplayName(item)">
            {{ getDisplayName(item) }}
          </div>
          <div class="mb-2 text-xs text-gray-400">
            <div>
              {{ item.createDate ? formatToDateTime(item.createDate) : '-' }} ·
              {{ item.size == null ? '-' : formatSize(item.size) }}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-evenly gap-1">
            <Button size="small" type="link" @click="handlePreview(item)">
              <template #icon><LucideEye /></template>
              预览
            </Button>
            <Button size="small" type="link" @click="handleCopyUrl(item)">
              <template #icon><LucideCopy /></template>
              复制
            </Button>
            <Button size="small" type="link" @click="handleDownload(item)">
              <template #icon><LucideDownload /></template>
              下载
            </Button>
            <ButtonRemove
              v-if="item.id"
              :api="removeCmsResourceApi"
              :auth-codes="['cms:media:remove']"
              :ids="[item.id]"
              size="small"
              type="link"
              @success="fetchList" />
          </div>
        </Card>
      </div>
      <Card v-else :bordered="false">
        <Empty class="py-14" description="暂无资源" />
      </Card>
    </Spin>

    <div v-if="total > 0" class="mt-4 flex justify-end">
      <Pagination
        :current="current"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        :show-quick-jumper="true"
        :show-size-changer="true"
        :show-total="showTotal"
        :total="total"
        @change="handlePageChange" />
    </div>

    <BasePreviewDrawer @success="fetchList" />
    <CmsSiteSwitcher />
  </Page>
</template>
