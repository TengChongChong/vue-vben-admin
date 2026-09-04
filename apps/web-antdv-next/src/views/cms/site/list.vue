<script lang="ts" setup>
import type { CmsSite } from '#/api';

import { computed, onMounted, ref } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Menu,
  MenuItem,
  message,
  Modal,
  Spin,
  Tag,
} from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  addCmsSiteApi,
  getCmsSiteApi,
  removeCmsSiteApi,
  selectCmsSiteApi,
} from '#/api';
import { ButtonAdd, ButtonEdit } from '#/components/button';
import { DictTag } from '#/components/dict';
import {
  LucideChevronDown,
  LucideEye,
  LucideFolder,
  LucideGlobe,
  LucideHash,
  LucideListOrdered,
  LucidePalette,
  LucideSettings,
  LucideTrash,
} from '#/components/icons';
import { $t } from '#/locales';
import { useCmsSiteStore } from '#/store';

import {
  buildSitePreviewUrl,
  CMS_COMMON_STATUS_ENABLE,
  openCmsPreview,
} from '../utils/cms-preview';
import InputDrawer from './input.vue';
import NginxConfigModal from './nginx-config-modal.vue';
import OrderDrawer from './order.vue';

const cmsSiteStore = useCmsSiteStore();

const loading = ref(false);
const records = ref<CmsSite[]>([]);
const selectedIds = ref<string[]>([]);

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
      label: '站点名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'domainName',
      label: '域名',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'theme',
      label: '主题',
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
const [BaseOrderDrawer, baseOrderDrawerApi] = useVbenDrawer({
  connectedComponent: OrderDrawer,
});
const [BaseNginxConfigModal, baseNginxConfigModalApi] = useVbenModal({
  connectedComponent: NginxConfigModal,
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
  try {
    loading.value = true;
    const formValues = await filterFormApi.getValues();
    const res = await selectCmsSiteApi({ ...formValues } as CmsSite);
    records.value = res ?? [];
    selectedIds.value = selectedIds.value.filter((id) =>
      records.value.some((item) => item.id === id),
    );
  } finally {
    loading.value = false;
  }
}

async function handleSearch() {
  await fetchList();
  void cmsSiteStore.refresh();
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
    title: `确定要删除选中的 ${targetIds.length} 个站点吗？`,
    content: '删除后无法恢复，请谨慎操作',
    onOk: async () => {
      await removeCmsSiteApi(targetIds.join(','));
      message.success('删除成功');
      resetSelection();
      await handleSearch();
    },
  });
}

function handleCreate(parentId?: string) {
  addCmsSiteApi(parentId).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleEdit(id: string) {
  getCmsSiteApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handlePreview(item: CmsSite) {
  if (item.status !== CMS_COMMON_STATUS_ENABLE) {
    message.warning('站点未启用，无法预览');
    return;
  }
  openCmsPreview(buildSitePreviewUrl(item.id));
}

function handleOrder() {
  baseOrderDrawerApi.open();
}

function formatDateLabel(value?: Date) {
  return value ? formatToDateTime(value) : '-';
}

function getSiteSummary(item: CmsSite) {
  return item.description || item.keyword || '暂无描述';
}

function isActiveSite(id: string) {
  return cmsSiteStore.activeSiteId === id;
}

function handleViewNginx(item: CmsSite) {
  baseNginxConfigModalApi.setData(item);
  baseNginxConfigModalApi.open();
}

onMounted(async () => {
  await fetchList();
});
</script>

<template>
  <Page auto-content-height>
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
      <span class="text-sm text-gray-500">
        已选 {{ selectedIds.length }} 个
      </span>
      <ButtonAdd
        :auth-codes="['cms:site:save']"
        text="新增站点"
        @click="handleCreate()" />
      <AccessControl :codes="['cms:site:save']">
        <Button @click="handleOrder">
          <template #icon>
            <LucideListOrdered />
          </template>
          排序
        </Button>
      </AccessControl>
      <AccessControl :codes="['cms:site:remove']">
        <Button
          danger
          :disabled="selectedIds.length === 0"
          @click="handleRemove()">
          <template #icon>
            <LucideTrash />
          </template>
          批量删除
        </Button>
      </AccessControl>
    </div>

    <Spin :spinning="loading">
      <div
        v-if="records.length > 0"
        class="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        <Card
          v-for="item in records"
          :key="item.id"
          class="group flex h-full overflow-hidden rounded-2xl border transition-all duration-200"
          :class="[
            selectedIds.includes(item.id)
              ? 'border-primary shadow-md shadow-primary/10'
              : 'hover:border-primary/40 hover:shadow-md',
          ]"
          :body-style="{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '14px',
            width: '100%',
          }">
          <div class="flex min-h-0 flex-1 flex-col gap-2.5">
            <div class="flex items-start gap-2.5">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LucideGlobe class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <div
                      class="truncate text-[15px] font-semibold leading-6"
                      :title="item.name">
                      {{ item.name }}

                      <DictTag :code="item.status" dict-type="commonStatus" />
                      <Tag v-if="isActiveSite(item.id)" color="processing">
                        当前编辑
                      </Tag>
                    </div>
                    <div
                      class="mt-0.5 truncate text-xs text-gray-400"
                      :title="item.domainName">
                      {{ item.domainName || '-' }}
                    </div>
                  </div>
                  <Checkbox
                    class="mt-0.5 shrink-0"
                    :checked="selectedIds.includes(item.id)"
                    @change="
                      (e) => handleToggleSelect(item.id, e.target.checked)
                    " />
                </div>
              </div>
            </div>

            <div
              class="line-clamp-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs leading-5 text-gray-500 dark:bg-gray-800/60"
              :title="getSiteSummary(item)">
              {{ getSiteSummary(item) }}
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div
                class="col-span-2 min-w-0 rounded-lg border border-gray-100 px-2.5 py-2 dark:border-gray-800">
                <div
                  class="mb-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <LucideFolder class="size-3.5 shrink-0" />
                  <span class="truncate">部署路径</span>
                </div>
                <div
                  class="truncate text-xs font-medium"
                  :title="item.deploymentPath">
                  {{ item.deploymentPath || '-' }}
                </div>
              </div>
              <div
                class="min-w-0 rounded-lg border border-gray-100 px-2.5 py-2 dark:border-gray-800">
                <div
                  class="mb-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <LucidePalette class="size-3.5 shrink-0" />
                  <span class="truncate">主题</span>
                </div>
                <div class="truncate text-xs font-medium" :title="item.theme">
                  {{ item.theme || '-' }}
                </div>
              </div>
              <div
                class="min-w-0 rounded-lg border border-gray-100 px-2.5 py-2 dark:border-gray-800">
                <div
                  class="mb-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <LucideHash class="size-3.5 shrink-0" />
                  <span class="truncate">排序</span>
                </div>
                <div class="truncate text-xs font-medium">
                  {{ item.orderNo ?? '-' }}
                </div>
              </div>
            </div>

            <div
              class="mt-auto border-t border-gray-100 pt-2.5 dark:border-gray-800 flex justify-between items-center">
              <div
                class="truncate text-xs text-gray-400"
                :title="`${item.editUser || '-'} · ${formatDateLabel(item.editDate)}`">
                {{ item.editUser || '-' }} ·
                {{ formatDateLabel(item.editDate) }}
              </div>
              <div class="flex flex-wrap items-center justify-end gap-0.5">
                <ButtonEdit
                  :auth-codes="['cms:site:save']"
                  size="small"
                  type="link"
                  @click="handleEdit(item.id)" />
                <AccessControl :codes="['cms:site:select']">
                  <Button size="small" type="link" @click="handlePreview(item)">
                    <template #icon><LucideEye /></template>
                    预览
                  </Button>
                </AccessControl>
                <Dropdown>
                  <Button size="small" type="link" @click.prevent>
                    更多
                    <LucideChevronDown />
                  </Button>
                  <template #popupRender>
                    <Menu>
                      <MenuItem key="nginx" @click="handleViewNginx(item)">
                        <template #icon>
                          <LucideSettings />
                        </template>
                        查看 Nginx 配置
                      </MenuItem>
                      <AccessControl :codes="['cms:site:remove']">
                        <MenuItem
                          key="remove"
                          danger
                          @click="handleRemove([item.id])">
                          <template #icon>
                            <LucideTrash />
                          </template>
                          删除
                        </MenuItem>
                      </AccessControl>
                    </Menu>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card v-else :bordered="false">
        <Empty class="py-14" description="暂无站点" />
      </Card>
    </Spin>

    <BaseInputDrawer @success="handleSearch" />
    <BaseOrderDrawer @success="handleSearch" />
    <BaseNginxConfigModal />
  </Page>
</template>
