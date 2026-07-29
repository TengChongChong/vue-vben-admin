<script lang="ts" setup>
import type { TreeDataNode as TreeDataItem } from 'antdv-next';

import type { CmsSite, SysUserVO } from '#/api';

import { computed, ref, watch } from 'vue';

import { ColPage, useVbenModal } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Checkbox, Empty, Input, message, Space, Spin, Tag } from 'antdv-next';

import {
  getUserCmsColumnIdsApi,
  getUserCmsSiteIdsApi,
  listCmsSiteColumnsForAuthApi,
  saveUserCmsColumnsBatchApi,
  saveUserCmsSitesApi,
  selectCmsSiteApi,
  selectUsersByIdsApi,
} from '#/api';
import { ButtonSave } from '#/components/button';
import { BasicTree } from '#/components/tree';
import UserPickerModal from '#/components/user/src/components/user-picker-modal.vue';

import {
  buildUserColumnsBatchItems,
  normalizeCheckedKeys,
} from '../cms-user-auth';
import CmsUserAuthHeader from './cms-user-auth-header.vue';

const props = withDefaults(
  defineProps<{
    allowChangeUser?: boolean;
    embedded?: boolean;
    fixedUserId?: string;
    showUserPicker?: boolean;
  }>(),
  {
    allowChangeUser: undefined,
    embedded: false,
    fixedUserId: '',
    showUserPicker: true,
  },
);

const emit = defineEmits<{
  success: [];
}>();

const loading = ref(false);
const saveLoading = ref(false);
const userId = ref('');
const selectedUser = ref<null | SysUserVO>(null);
const siteOptions = ref<CmsSite[]>([]);
const siteKeyword = ref('');
const selectedSiteIds = ref<string[]>([]);
const focusSiteId = ref('');
const columnTreeData = ref<TreeDataItem[]>([]);
const checkedColumnKeys = ref<string[]>([]);
const columnSelections = ref<Map<string, string[]>>(new Map());
const columnTreeLoading = ref(false);

const [PickerModal, pickerModalApi] = useVbenModal({
  connectedComponent: UserPickerModal,
});

const effectiveUserId = computed(() => props.fixedUserId || userId.value);

const showUserHeader = computed(
  () => props.showUserPicker || Boolean(props.fixedUserId),
);

const canChangeUser = computed(() => {
  if (props.allowChangeUser !== undefined) {
    return props.allowChangeUser;
  }
  return props.showUserPicker && !props.fixedUserId;
});

const filteredSites = computed(() => {
  const keyword = siteKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return siteOptions.value;
  }
  return siteOptions.value.filter(
    (site) =>
      site.name?.toLowerCase().includes(keyword) ||
      site.domainName?.toLowerCase().includes(keyword),
  );
});

const focusSite = computed(
  () => siteOptions.value.find((site) => site.id === focusSiteId.value) ?? null,
);

const canSave = computed(() => Boolean(effectiveUserId.value));

const totalColumnCount = computed(() => {
  let count = 0;
  const selections = new Map(columnSelections.value);
  if (focusSiteId.value) {
    selections.set(focusSiteId.value, checkedColumnKeys.value);
  }
  selections.forEach((ids) => {
    count += ids.length;
  });
  return count;
});

const focusSiteColumnCount = computed(() => checkedColumnKeys.value.length);

function persistFocusColumns() {
  if (!focusSiteId.value) {
    return;
  }
  columnSelections.value.set(focusSiteId.value, [...checkedColumnKeys.value]);
}

async function loadSelectedUser(currentUserId: string) {
  const users = await selectUsersByIdsApi(currentUserId);
  selectedUser.value = users[0] ?? null;
}

async function loadSiteOptions() {
  siteOptions.value = (await selectCmsSiteApi()) ?? [];
}

async function loadColumnTree(siteId: string) {
  columnTreeLoading.value = true;
  try {
    const columns = (await listCmsSiteColumnsForAuthApi(siteId)) ?? [];
    const nodes = columns.map((item) => ({
      ...item,
      key: item.id,
      title: item.name,
      value: item.id,
    }));
    columnTreeData.value = listToTree(nodes) as TreeDataItem[];

    if (columnSelections.value.has(siteId)) {
      checkedColumnKeys.value = [...(columnSelections.value.get(siteId) ?? [])];
      return;
    }

    const boundColumnIds = effectiveUserId.value
      ? await getUserCmsColumnIdsApi(effectiveUserId.value, siteId)
      : [];
    const ids = boundColumnIds ?? [];
    columnSelections.value.set(siteId, ids);
    checkedColumnKeys.value = [...ids];
  } finally {
    columnTreeLoading.value = false;
  }
}

async function loadUserAuth(currentUserId: string) {
  loading.value = true;
  try {
    await Promise.all([loadSiteOptions(), loadSelectedUser(currentUserId)]);
    const boundSiteIds = (await getUserCmsSiteIdsApi(currentUserId)) ?? [];
    selectedSiteIds.value = [...boundSiteIds];
    columnSelections.value = new Map();
    focusSiteId.value = boundSiteIds[0] ?? '';
    checkedColumnKeys.value = [];
    columnTreeData.value = [];
    if (focusSiteId.value) {
      await loadColumnTree(focusSiteId.value);
    }
  } finally {
    loading.value = false;
  }
}

function openUserPicker() {
  pickerModalApi.setData({
    range: 'all',
    maxCount: 1,
    selectedIds: userId.value ? [userId.value] : [],
  });
  pickerModalApi.open();
}

async function handleUserPicked(users: SysUserVO[]) {
  const picked = users[0];
  if (!picked?.id) {
    return;
  }
  userId.value = picked.id;
  selectedUser.value = picked;
  await loadUserAuth(picked.id);
}

function handleChangeUser() {
  openUserPicker();
}

function resetAuthState() {
  selectedSiteIds.value = [];
  columnSelections.value = new Map();
  focusSiteId.value = '';
  checkedColumnKeys.value = [];
  columnTreeData.value = [];
}

function isSiteSelected(siteId: string) {
  return selectedSiteIds.value.includes(siteId);
}

function toggleSite(siteId: string, checked: boolean) {
  if (checked) {
    if (!selectedSiteIds.value.includes(siteId)) {
      selectedSiteIds.value = [...selectedSiteIds.value, siteId];
    }
    void selectFocusSite(siteId);
    return;
  }
  selectedSiteIds.value = selectedSiteIds.value.filter((id) => id !== siteId);
  columnSelections.value.delete(siteId);
  if (focusSiteId.value === siteId) {
    const nextSiteId = selectedSiteIds.value[0] ?? '';
    focusSiteId.value = nextSiteId;
    checkedColumnKeys.value = [];
    columnTreeData.value = [];
    if (nextSiteId) {
      void loadColumnTree(nextSiteId);
    }
  }
}

async function selectFocusSite(siteId: string) {
  if (!isSiteSelected(siteId)) {
    return;
  }
  if (focusSiteId.value === siteId) {
    return;
  }
  persistFocusColumns();
  focusSiteId.value = siteId;
  await loadColumnTree(siteId);
}

function handleColumnCheckChange(value: unknown) {
  checkedColumnKeys.value = normalizeCheckedKeys(value as never);
  if (focusSiteId.value) {
    columnSelections.value.set(focusSiteId.value, [...checkedColumnKeys.value]);
  }
}

async function handleSave() {
  if (!effectiveUserId.value) {
    message.warning('请先选择用户');
    return;
  }
  persistFocusColumns();
  try {
    saveLoading.value = true;
    await saveUserCmsSitesApi({
      userId: effectiveUserId.value,
      siteIds: selectedSiteIds.value,
    });
    const items = buildUserColumnsBatchItems(
      selectedSiteIds.value,
      columnSelections.value,
    );
    if (items.length > 0) {
      await saveUserCmsColumnsBatchApi({
        userId: effectiveUserId.value,
        items,
      });
    }
    message.success('保存成功');
    emit('success');
  } catch {
    message.error('保存失败，请稍后重试');
  } finally {
    saveLoading.value = false;
  }
}

watch(
  () => props.fixedUserId,
  (id) => {
    if (id) {
      userId.value = id;
      void loadUserAuth(id);
      return;
    }
    if (!props.showUserPicker) {
      selectedUser.value = null;
      resetAuthState();
    }
  },
  { immediate: true },
);

defineExpose({
  handleSave,
  loadUserAuth,
});
</script>

<template>
  <div>
    <CmsUserAuthHeader
      v-if="showUserHeader"
      :allow-change="canChangeUser"
      :column-count="totalColumnCount"
      :selected-user="selectedUser"
      :site-count="selectedSiteIds.length"
      @change="handleChangeUser"
      @pick="openUserPicker" />

    <Empty
      v-if="!effectiveUserId && !showUserPicker"
      class="my-12"
      description="请先选择用户，再配置站点与栏目权限" />
    <div class="-mx-4 -mt-4" v-else-if="effectiveUserId">
      <Spin :spinning="loading">
        <ColPage
          :left-collapsible="false"
          :left-min-width="22"
          :left-width="24"
          :resizable="true"
          :split-handle="true"
          :split-line="true">
          <template #left>
            <div class="mr-2 flex h-full flex-col rounded-lg bg-card">
              <div class="p-3">
                <div class="mb-3 flex items-center justify-between gap-2">
                  <span class="text-base font-semibold">可授权站点</span>
                  <Tag>
                    {{ selectedSiteIds.length }} /
                    {{ siteOptions.length }}
                  </Tag>
                </div>
                <Input
                  v-model:value="siteKeyword"
                  allow-clear
                  placeholder="搜索站点名称 / 域名" />
              </div>
              <div
                v-if="filteredSites.length === 0"
                class="flex flex-1 items-center justify-center p-4">
                <Empty description="暂无站点" />
              </div>
              <div v-else class="flex-1 overflow-y-auto p-2">
                <div
                  v-for="site in filteredSites"
                  :key="site.id"
                  class="mb-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-colors"
                  :class="[
                    focusSiteId === site.id && isSiteSelected(site.id!)
                      ? 'bg-primary/10'
                      : 'hover:bg-accent',
                  ]"
                  @click="selectFocusSite(site.id!)">
                  <Checkbox
                    :checked="isSiteSelected(site.id!)"
                    @change="(e) => toggleSite(site.id!, e.target.checked)"
                    @click.stop />
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">{{ site.name }}</div>
                    <div class="truncate text-xs text-muted-foreground">
                      {{ site.domainName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div class="flex h-full flex-col rounded-lg bg-card">
            <div class="p-3">
              <div class="flex items-center gap-2 text-base font-semibold">
                <span>栏目授权</span>
                <span
                  v-if="focusSite"
                  class="text-sm font-normal text-muted-foreground">
                  {{ focusSite.name }}
                </span>
                <Tag v-if="focusSiteId && isSiteSelected(focusSiteId)">
                  {{ focusSiteColumnCount }} 项
                </Tag>
              </div>
            </div>
            <div class="flex-1 overflow-hidden p-3">
              <Empty
                v-if="!focusSiteId || !isSiteSelected(focusSiteId)"
                description="请先勾选并选择左侧站点" />
              <BasicTree
                v-else
                :loading="columnTreeLoading"
                :show-search="true"
                :show-toolbar="true"
                :tree-data="columnTreeData"
                :value="checkedColumnKeys"
                check-strictly
                checkable
                size="small"
                title="勾选显式授权栏目"
                @update:value="handleColumnCheckChange" />
            </div>
          </div>
        </ColPage>
      </Spin>
    </div>

    <div v-if="!embedded" class="mt-4 flex justify-center">
      <Space>
        <ButtonSave
          :auth-codes="['cms:site:user:save', 'cms:column:user:save']"
          :disabled="!canSave"
          :loading="saveLoading"
          text="保存授权"
          @click="handleSave" />
      </Space>
    </div>

    <PickerModal @confirm="handleUserPicked" />
  </div>
</template>
