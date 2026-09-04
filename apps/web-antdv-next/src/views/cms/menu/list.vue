<script lang="ts" setup>
import type { CmsMenu } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

import { Alert, Button, Card, Checkbox, Empty, Spin } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  addCmsMenuApi,
  getCmsMenuApi,
  removeCmsMenuApi,
  selectCmsMenuApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import { DictTag } from '#/components/dict';
import { LucideListTree } from '#/components/icons';
import { $t } from '#/locales';
import { useCmsSiteStore } from '#/store';

import InputDrawer from './input.vue';
import ItemsDrawer from './items.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const loading = ref(false);
const records = ref<CmsMenu[]>([]);
const selectedIds = ref<string[]>([]);
let fetchSeq = 0;

const [FilterForm, filterFormApi] = useVbenForm({
  handleReset: async () => {
    filterFormApi.reset();
    await fetchList();
  },
  handleSubmit: async () => {
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
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      componentProps: { allowClear: true },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'slug',
      label: '标识',
      component: 'Input',
      componentProps: { allowClear: true },
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
const [BaseItemsDrawer, baseItemsDrawerApi] = useVbenDrawer({
  connectedComponent: ItemsDrawer,
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
  selectedIds.value = checked ? records.value.map((item) => item.id) : [];
}

async function fetchList() {
  if (!hasActiveSite.value) {
    records.value = [];
    resetSelection();
    return;
  }
  const seq = ++fetchSeq;
  try {
    loading.value = true;
    const formValues = await filterFormApi.getValues();
    const res = await selectCmsMenuApi({ ...formValues } as CmsMenu);
    if (seq !== fetchSeq) {
      return;
    }
    records.value = res ?? [];
    selectedIds.value = selectedIds.value.filter((id) =>
      records.value.some((item) => item.id === id),
    );
  } finally {
    if (seq === fetchSeq) {
      loading.value = false;
    }
  }
}

function handleCreate() {
  if (!hasActiveSite.value) {
    return;
  }
  addCmsMenuApi().then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getCmsMenuApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleItems(row: CmsMenu) {
  baseItemsDrawerApi.setData({ menuId: row.id, menuName: row.name });
  baseItemsDrawerApi.open();
}

function formatDateLabel(value?: Date) {
  return value ? formatToDateTime(value) : '-';
}

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
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
        :auth-codes="['cms:menu:save']"
        :disabled="!hasActiveSite"
        text="新增菜单"
        @click="handleCreate" />
      <ButtonRemove
        :api="removeCmsMenuApi"
        :auth-codes="['cms:menu:remove']"
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
              class="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <div class="min-w-0 flex-1">
                    <div
                      class="truncate text-[15px] font-semibold"
                      :title="item.name">
                      <DictTag :code="item.status" dict-type="commonStatus" />
                      {{ item.name }}
                    </div>
                  </div>
                </div>
                <div
                  class="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                  <span>标识：{{ item.slug || '-' }}</span>
                  <span>编辑：{{ item.editUser || '-' }}</span>
                  <span>编辑时间：{{ formatDateLabel(item.editDate) }}</span>
                </div>
              </div>
              <div
                class="mt-2 flex shrink-0 items-center gap-1 border-l border-gray-200 pl-3 md:mt-0 md:self-center">
                <AccessControl :codes="['cms:menu:select']">
                  <Button size="small" type="link" @click="handleItems(item)">
                    <template #icon><LucideListTree /></template>
                    菜单项
                  </Button>
                </AccessControl>
                <ButtonEdit
                  :auth-codes="['cms:menu:save']"
                  size="small"
                  type="link"
                  @click="handleEdit(item.id)" />
                <ButtonRemove
                  :api="removeCmsMenuApi"
                  :auth-codes="['cms:menu:remove']"
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
        <Empty class="py-14" description="暂无导航菜单" />
      </Card>
    </Spin>

    <BaseInputDrawer @success="fetchList" />
    <BaseItemsDrawer />
    <CmsSiteSwitcher />
  </Page>
</template>
