<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CmsSite, CmsSiteMember, SysUserVO } from '#/api';

import { computed, onMounted, ref } from 'vue';

import { AccessControl } from '@vben/access';
import { ColPage, useVbenModal } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

import { Button, Empty, Input, message, Modal, Popconfirm, Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addCmsSiteMembersApi,
  removeCmsSiteMembersApi,
  selectCmsSiteApi,
  selectCmsSiteMembersApi,
} from '#/api';
import { ButtonAdd } from '#/components/button';
import UserPickerModal from '#/components/user/src/components/user-picker-modal.vue';

const siteOptions = ref<CmsSite[]>([]);
const activeSiteId = ref('');
const siteKeyword = ref('');

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

const activeSite = computed(
  () => siteOptions.value.find((site) => site.id === activeSiteId.value) ?? null,
);

const formOptions: VbenFormProps = {
  collapsed: false,
  showCollapseButton: false,
  schema: [
    {
      fieldName: 'keyword',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '用户名 / 昵称 / 部门',
      },
    },
  ],
};

const gridOptions: VxeGridProps<CmsSiteMember> = {
  id: 'cms-site-user',
  rowConfig: {
    keyField: 'userId',
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { title: '用户名', field: 'username', minWidth: 120 },
    { title: '昵称', field: 'nickname', minWidth: 120 },
    { title: '部门', field: 'deptName', minWidth: 160 },
    {
      title: '授权时间',
      field: 'createDate',
      minWidth: 160,
      formatter: ({ cellValue }) => formatToDateTime(cellValue) || '-',
    },
    { title: '操作', field: 'action', width: 140, slots: { default: 'action' } },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!activeSiteId.value) {
          return { records: [], total: 0 };
        }
        return await selectCmsSiteMembersApi(activeSiteId.value, formValues, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '站点成员权限',
  formOptions,
  gridOptions,
});

const [PickerModal, pickerModalApi] = useVbenModal({
  connectedComponent: UserPickerModal,
});

function refresh() {
  gridApi.query();
}

function selectSite(siteId: string) {
  if (activeSiteId.value === siteId) {
    return;
  }
  activeSiteId.value = siteId;
  refresh();
}

function openPicker() {
  if (!activeSiteId.value) {
    message.warning('请先选择站点');
    return;
  }
  pickerModalApi.setData({
    range: 'all',
    selectedIds: [],
  });
  pickerModalApi.open();
}

async function handlePickerConfirm(users: SysUserVO[]) {
  if (!activeSiteId.value) {
    return;
  }
  const userIds = users.map((user) => user.id).filter(Boolean);
  if (userIds.length === 0) {
    return;
  }
  await addCmsSiteMembersApi(activeSiteId.value, userIds);
  message.success('添加成功');
  refresh();
}

async function removeOne(row: CmsSiteMember) {
  if (!activeSiteId.value) {
    return;
  }
  await removeCmsSiteMembersApi(activeSiteId.value, row.userId);
  message.success('移除成功');
  refresh();
}

function batchRemove() {
  if (!activeSiteId.value) {
    return;
  }
  const rows = (gridApi.grid?.getCheckboxRecords() as CmsSiteMember[]) ?? [];
  if (rows.length === 0) {
    message.warning('请选择要移除的用户');
    return;
  }
  Modal.confirm({
    title: `确定移除选中的 ${rows.length} 位用户吗？`,
    onOk: async () => {
      const userIds = rows.map((item) => item.userId).join(',');
      await removeCmsSiteMembersApi(activeSiteId.value, userIds);
      message.success('移除成功');
      refresh();
    },
  });
}

async function loadSiteOptions() {
  const list = await selectCmsSiteApi();
  siteOptions.value = list ?? [];
  if (!activeSiteId.value && siteOptions.value.length > 0) {
    activeSiteId.value = siteOptions.value[0]?.id ?? '';
  }
  refresh();
}

onMounted(async () => {
  await loadSiteOptions();
});
</script>

<template>
  <ColPage
    :left-collapsible="false"
    :left-min-width="22"
    :left-width="24"
    :resizable="true"
    :split-handle="true"
    :split-line="true"
    auto-content-height>
    <template #left>
      <div class="mr-2 flex h-full flex-col rounded-lg border bg-card">
        <div class="border-b p-3">
          <div class="mb-3 text-base font-semibold">站点清单</div>
          <Input
            v-model:value="siteKeyword"
            allow-clear
            placeholder="搜索站点名称 / 域名" />
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto p-2">
          <button
            v-for="site in filteredSites"
            :key="site.id"
            class="mb-1 w-full rounded-md px-3 py-2.5 text-left transition-colors"
            :class="
              activeSiteId === site.id
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent'
            "
            type="button"
            @click="selectSite(site.id)">
            <div class="flex items-center justify-between gap-2">
              <span class="truncate font-medium">{{ site.name }}</span>
              <Tag v-if="activeSiteId === site.id" color="processing">
                已选
              </Tag>
            </div>
            <div class="mt-1 truncate text-xs text-muted-foreground">
              {{ site.domainName || '未配置域名' }}
            </div>
          </button>
          <Empty
            v-if="filteredSites.length === 0"
            class="mt-12"
            description="暂无站点"
            :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </div>
      </div>
    </template>

    <div class="ml-2 h-full">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <span class="text-muted-foreground">
              {{ activeSite ? `当前站点：${activeSite.name}` : '请选择站点' }}
            </span>
            <ButtonAdd
              :auth-codes="['cms:site:user:save']"
              :disabled="!activeSiteId"
              text="添加成员"
              @click="openPicker" />
            <AccessControl :codes="['cms:site:user:remove']">
              <Button :disabled="!activeSiteId" danger @click="batchRemove">
                批量移除
              </Button>
            </AccessControl>
          </Space>
        </template>
        <template #action="{ row }">
          <Popconfirm
            title="确定移除该用户吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="removeOne(row)">
            <AccessControl :codes="['cms:site:user:remove']">
              <Button danger size="small" type="link"> 移除 </Button>
            </AccessControl>
          </Popconfirm>
        </template>
      </Grid>
    </div>
    <PickerModal @confirm="handlePickerConfirm" />
  </ColPage>
</template>
