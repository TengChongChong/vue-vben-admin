<script lang="ts" setup>
import type { CmsArticle, TreeNode } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { formatToDateTime, listToTree } from '@vben/utils';

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  message,
  Modal,
  Pagination,
  Spin,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  buildPageSizeOptions,
  DEFAULT_TABLE_PAGE_SIZE,
} from '#/adapter/vxe-table';
import {
  addCmsArticleApi,
  getCmsArticleApi,
  rebuildCmsArticleSearchIndexApi,
  releaseCmsArticleApi,
  removeCmsArticleApi,
  revokeCmsArticleApi,
  selectAllCmsColumnApi,
  selectCmsArticleApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import { DictTag } from '#/components/dict';
import {
  LucideEye,
  LucideRefreshCw,
  LucideRotateCcw,
  LucideSend,
} from '#/components/icons';
import { $t } from '#/locales';
import { useCmsSiteStore } from '#/store';

import {
  buildArticlePreviewUrl,
  openCmsPreview,
} from '../utils/cms-preview';
import InputDrawer from './input.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const loading = ref(false);
const records = ref<CmsArticle[]>([]);
const current = ref(1);
const pageSize = ref(DEFAULT_TABLE_PAGE_SIZE);
const pageSizeOptions = buildPageSizeOptions();
const total = ref(0);
const selectedIds = ref<string[]>([]);
let fetchSeq = 0;

function showTotal(t: number) {
  return `共 ${t} 条记录`;
}

const [FilterForm, filterFormApi] = useVbenForm({
  handleReset: async () => {
    filterFormApi.resetForm();
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
      'releaseDateRange',
      ['startReleaseDate', 'endReleaseDate'],
      'YYYY-MM-DD HH:mm:ss',
    ],
    [
      'offlineDateRange',
      ['startOfflineDate', 'endOfflineDate'],
      'YYYY-MM-DD HH:mm:ss',
    ],
  ],
  submitButtonOptions: {
    content: computed(() => $t('common.search')),
  },
  schema: [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'columnId',
      label: '栏目',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: selectAllCmsColumnApi,
        afterFetch: (res) => {
          const treeNodes: TreeNode[] = [];
          (res ?? []).forEach((item) => {
            const { id, parentId, title, label } = item;
            treeNodes.push({
              id,
              parentId,
              key: id,
              label: title ?? label ?? '',
              value: id,
            });
          });
          return listToTree(treeNodes);
        },
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        allowClear: true,
        dictType: 'cmsArticleStatus',
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'subtitle',
      label: '副标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'author',
      label: '作者',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'source',
      label: '来源',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'tags',
      label: '标签',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'keyword',
      label: '关键词',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'releaseDateRange',
      label: '发布时间',
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
    {
      fieldName: 'offlineDateRange',
      label: '下线时间',
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

const allChecked = computed(() => {
  if (records.value.length === 0) {
    return false;
  }
  return records.value.every((item) => selectedIds.value.includes(item.id));
});

const indeterminate = computed(() => {
  if (records.value.length === 0) {
    return false;
  }
  const selectedCount = records.value.filter((item) =>
    selectedIds.value.includes(item.id),
  ).length;
  return selectedCount > 0 && selectedCount < records.value.length;
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

function resetSelection() {
  selectedIds.value = [];
}

function handleToggleSelect(id: string, checked: boolean) {
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id];
    }
    return;
  }
  selectedIds.value = selectedIds.value.filter((item) => item !== id);
}

function handleToggleSelectAll(checked: boolean) {
  if (checked) {
    selectedIds.value = records.value.map((item) => item.id);
    return;
  }
  selectedIds.value = [];
}

async function fetchList() {
  if (!hasActiveSite.value) {
    records.value = [];
    total.value = 0;
    resetSelection();
    return;
  }
  const seq = ++fetchSeq;
  try {
    loading.value = true;
    const formValues = await filterFormApi.getValues();
    const res = await selectCmsArticleApi(
      {
        ...formValues,
      } as CmsArticle,
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
    selectedIds.value = selectedIds.value.filter((id) =>
      records.value.some((item) => item.id === id),
    );
  } finally {
    if (seq === fetchSeq) {
      loading.value = false;
    }
  }
}

function getTargetIds(ids?: string[]) {
  if (ids?.length) {
    return ids;
  }
  return selectedIds.value;
}

function handleRelease(ids?: string[]) {
  const targetIds = getTargetIds(ids);
  if (targetIds.length === 0) {
    message.warning('请选择要发布的数据后重试');
    return;
  }
  Modal.confirm({
    title: `确定要发布选中的 ${targetIds.length} 篇文章吗？`,
    onOk: async () => {
      await releaseCmsArticleApi(targetIds.join(','));
      message.success('发布成功');
      fetchList();
    },
  });
}

function handleRevoke(ids?: string[]) {
  const targetIds = getTargetIds(ids);
  if (targetIds.length === 0) {
    message.warning('请选择要撤销的数据后重试');
    return;
  }
  Modal.confirm({
    title: `确定要撤销选中的 ${targetIds.length} 篇文章吗？`,
    onOk: async () => {
      await revokeCmsArticleApi(targetIds.join(','));
      message.success('撤销成功');
      fetchList();
    },
  });
}

function handleRebuildSearchIndex() {
  if (!hasActiveSite.value) {
    message.warning('请先选择当前编辑站点');
    return;
  }
  Modal.confirm({
    title: '确定要重建当前站点的搜索索引吗？',
    content: '将重新同步该站点已发布文章到 Elasticsearch，期间可能短暂影响前台搜索。',
    onOk: async () => {
      await rebuildCmsArticleSearchIndexApi(cmsSiteStore.activeSiteId);
      message.success('搜索索引重建成功');
    },
  });
}

function handleCreate() {
  if (!hasActiveSite.value) {
    return;
  }
  addCmsArticleApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getCmsArticleApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handlePreview(item: CmsArticle) {
  const siteId = cmsSiteStore.activeSiteId;
  if (!siteId) {
    message.warning('请先选择当前编辑站点');
    return;
  }
  openCmsPreview(buildArticlePreviewUrl(siteId, item.id));
}

function handlePageChange(page: number, size: number) {
  current.value = page;
  pageSize.value = size;
  fetchList();
}

function formatDateLabel(value?: Date) {
  return value ? formatToDateTime(value) : '-';
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

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <Checkbox
        :checked="allChecked"
        :indeterminate="indeterminate"
        @change="(e) => handleToggleSelectAll(e.target.checked)">
        全选
      </Checkbox>
      <span class="text-sm text-gray-500">已选 {{ selectedIds.length }} 篇</span>
      <ButtonAdd
        :auth-codes="['cms:article:save']"
        :disabled="!hasActiveSite"
        text="新增文章"
        @click="handleCreate" />
      <AccessControl :codes="['cms:article:status']">
        <Button
          :disabled="!hasActiveSite || selectedIds.length === 0"
          @click="handleRelease()">
          <template #icon><LucideSend /></template>
          批量发布
        </Button>
        <Button
          :disabled="!hasActiveSite || selectedIds.length === 0"
          @click="handleRevoke()">
          <template #icon><LucideRotateCcw /></template>
          批量撤销
        </Button>
        <Button :disabled="!hasActiveSite" @click="handleRebuildSearchIndex">
          <template #icon><LucideRefreshCw /></template>
          重建搜索索引
        </Button>
      </AccessControl>
      <ButtonRemove
        :api="removeCmsArticleApi"
        :auth-codes="['cms:article:remove']"
        :disabled="!hasActiveSite || selectedIds.length === 0"
        :ids="selectedIds"
        text="批量删除"
        @success="fetchList" />
    </div>

    <Spin :spinning="loading">
      <div v-if="records.length > 0" class="grid grid-cols-1 gap-2">
        <Card
          v-for="item in records"
          :key="item.id"
          class="overflow-hidden rounded-xl transition-all duration-200"
          :class="[
            selectedIds.includes(item.id)
              ? 'border-primary shadow-sm shadow-primary/10'
              : 'hover:border-primary/50 hover:shadow-sm',
          ]"
          :body-style="{ padding: '10px 14px' }">
          <div class="flex flex-col gap-2 md:flex-row md:items-stretch">
            <Checkbox
              class="shrink-0 self-start md:self-center"
              :checked="selectedIds.includes(item.id)"
              @change="(e) => handleToggleSelect(item.id, e.target.checked)" />
            <div
              class="h-16 w-full shrink-0 overflow-hidden rounded-lg border border-dashed border-gray-200 bg-gray-50 md:w-28">
              <img
                v-if="item.coverUrl"
                :alt="item.title"
                :src="item.coverUrl"
                class="h-full w-full object-cover" />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-xs text-gray-400">
                暂无封面
              </div>
            </div>
            <div
              class="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <div class="min-w-0 flex-1">
                    <div
                      class="truncate text-[15px] font-semibold"
                      :title="item.title">
                      <DictTag :code="item.status" dict-type="cmsArticleStatus" />
                      {{ item.title }}
                    </div>
                  </div>
                </div>

                <div
                  class="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                  <span>栏目：{{ item.columnName || '-' }}</span>
                  <span>作者：{{ item.author || '-' }}</span>
                  <span>发布时间：{{ formatDateLabel(item.releaseDate) }}</span>
                  <span>编辑：{{ item.editUser || '-' }}</span>
                  <span>编辑时间：{{ formatDateLabel(item.editDate) }}</span>
                </div>
              </div>
              <div
                class="mt-2 flex shrink-0 items-center gap-1 border-l border-gray-200 pl-3 md:mt-0 md:self-center">
                <ButtonEdit
                  :auth-codes="['cms:article:save']"
                  size="small"
                  type="link"
                  @click="handleEdit(item.id)" />
                <Button
                  size="small"
                  type="link"
                  @click="handlePreview(item)">
                  <template #icon><LucideEye /></template>
                  预览
                </Button>
                <AccessControl :codes="['cms:article:status']">
                  <Button
                    v-if="item.status !== '1'"
                    size="small"
                    type="link"
                    @click="handleRelease([item.id])">
                    <template #icon><LucideSend /></template>
                    发布
                  </Button>
                  <Button
                    v-else
                    size="small"
                    type="link"
                    @click="handleRevoke([item.id])">
                    <template #icon><LucideRotateCcw /></template>
                    撤销
                  </Button>
                </AccessControl>
                <ButtonRemove
                  :api="removeCmsArticleApi"
                  :auth-codes="['cms:article:remove']"
                  :ids="[item.id]"
                  size="small"
                  type="link"
                  @success="fetchList" />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card v-else :bordered="false">
        <Empty class="py-14" description="暂无文章" />
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

    <BaseInputDrawer @success="fetchList" />
    <CmsSiteSwitcher />
  </Page>
</template>
