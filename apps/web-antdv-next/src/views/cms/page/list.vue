<script lang="ts" setup>
import type { CmsPage } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

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
} from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  buildPageSizeOptions,
  DEFAULT_TABLE_PAGE_SIZE,
} from '#/adapter/vxe-table';
import {
  addCmsPageApi,
  getCmsPageApi,
  removeCmsPageApi,
  selectCmsPageApi,
} from '#/api';
import { ButtonAdd, ButtonEdit } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import { DictTag } from '#/components/dict';
import { LucideTrash } from '#/components/icons';
import { $t } from '#/locales';
import { useCmsSiteStore } from '#/store';

import InputDrawer from './input.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const loading = ref(false);
const records = ref<CmsPage[]>([]);
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
      fieldName: 'slug',
      label: '别名',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'template',
      label: '模板',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        allowClear: true,
        dictType: 'commonStatus',
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
    const res = await selectCmsPageApi(
      {
        ...formValues,
      } as CmsPage,
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

function handleRemove(ids?: string[]) {
  const targetIds = getTargetIds(ids);
  if (targetIds.length === 0) {
    message.warning('请选择要删除的数据后重试');
    return;
  }
  Modal.confirm({
    title: `确定要删除选中的 ${targetIds.length} 个页面吗？`,
    content: '删除后无法恢复，请谨慎操作',
    onOk: async () => {
      await removeCmsPageApi(targetIds.join(','));
      message.success('删除成功');
      fetchList();
    },
  });
}

function handleCreate() {
  if (!hasActiveSite.value) {
    return;
  }
  addCmsPageApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getCmsPageApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
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

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <Checkbox
        :checked="allChecked"
        :indeterminate="indeterminate"
        @change="(e) => handleToggleSelectAll(e.target.checked)">
        全选
      </Checkbox>
      <span class="text-sm text-gray-500">已选 {{ selectedIds.length }} 个</span>
      <ButtonAdd
        :auth-codes="['cms:page:save']"
        :disabled="!hasActiveSite"
        text="新增页面"
        @click="handleCreate" />
      <AccessControl :codes="['cms:page:remove']">
        <Button
          danger
          :disabled="!hasActiveSite || selectedIds.length === 0"
          @click="handleRemove()">
          <template #icon><LucideTrash /></template>
          批量删除
        </Button>
      </AccessControl>
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
              class="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <div class="min-w-0 flex-1">
                    <div
                      class="truncate text-[15px] font-semibold"
                      :title="item.title">
                      <DictTag :code="item.status" dict-type="commonStatus" />
                      {{ item.title }}
                    </div>
                  </div>
                </div>

                <div
                  class="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                  <span>别名：{{ item.slug || '-' }}</span>
                  <span>模板：{{ item.template || '-' }}</span>
                  <span>编辑：{{ item.editUser || '-' }}</span>
                  <span>编辑时间：{{ formatDateLabel(item.editDate) }}</span>
                </div>
              </div>
              <div
                class="mt-2 flex shrink-0 items-center gap-1 border-l border-gray-200 pl-3 md:mt-0 md:self-center">
                <ButtonEdit
                  :auth-codes="['cms:page:save']"
                  size="small"
                  type="link"
                  @click="handleEdit(item.id)" />
                <AccessControl :codes="['cms:page:remove']">
                  <Button
                    danger
                    size="small"
                    type="link"
                    @click="handleRemove([item.id])">
                    删除
                  </Button>
                </AccessControl>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card v-else :bordered="false">
        <Empty class="py-14" description="暂无页面" />
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
