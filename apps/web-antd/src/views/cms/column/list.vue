<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CmsColumn } from '#/api';

import { computed, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { Page, useVbenDrawer } from '@vben/common-ui';

import { Alert, Button, Divider, message, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addCmsColumnApi,
  getCmsColumnApi,
  removeCmsColumnApi,
  selectCmsColumnApi,
} from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import {
  LucideEye,
  LucideListOrdered,
  LucideMinus,
  LucidePlus,
} from '#/components/icons';
import { useCmsSiteStore } from '#/store';
import { buildTenantGridId } from '#/utils/tenant-grid-id';

import {
  buildColumnPreviewUrl,
  CMS_COMMON_STATUS_ENABLE,
  openCmsPreview,
} from '../utils/cms-preview';
import { initColumns } from './data';
import InputDrawer from './input.vue';
import OrderDrawer from './order.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

function handleSearch() {
  if (!hasActiveSite.value) {
    return;
  }
  gridApi.query();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'name',
      label: '栏目名称',
      component: 'Input',
    },
    {
      fieldName: 'slug',
      label: '别名',
      component: 'Input',
    },
    {
      fieldName: 'isRelease',
      label: '可发布文章',
      component: 'DictSelect',
      componentProps: {
        dictType: 'whether',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'commonStatus',
      },
    },
  ],
};

const gridOptions: VxeGridProps<CmsColumn> = {
  id: buildTenantGridId('cms-column'),
  columns: initColumns(),
  pagerConfig: {
    enabled: false,
  },
  checkboxConfig: {
    range: false,
  },
  treeConfig: {
    reserve: true,
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        if (!cmsSiteStore.hasActiveSite) {
          return [];
        }
        return await selectCmsColumnApi({ ...formValues });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '栏目管理',
  formOptions,
  gridOptions,
});

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    handleSearch();
  },
);

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});
const [BaseOrderDrawer, baseOrderDrawerApi] = useVbenDrawer({
  connectedComponent: OrderDrawer,
});

function handleEdit(id: string) {
  getCmsColumnApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleCreate(parentId?: string) {
  if (!hasActiveSite.value) {
    return;
  }
  addCmsColumnApi(parentId).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}

function handleOrder() {
  if (!hasActiveSite.value) {
    return;
  }
  baseOrderDrawerApi.open();
}

function handleExpandAll() {
  gridApi.grid?.setAllTreeExpand(true);
}

function handleCollapseAll() {
  gridApi.grid?.clearTreeExpand();
}

function handlePreview(row: CmsColumn) {
  const siteId = cmsSiteStore.activeSiteId;
  if (!siteId) {
    message.warning('请先选择当前编辑站点');
    return;
  }
  if (!row.slug?.trim()) {
    message.warning('栏目缺少 slug，无法预览');
    return;
  }
  if (row.status !== CMS_COMMON_STATUS_ENABLE) {
    message.warning('栏目未启用，无法预览');
    return;
  }
  openCmsPreview(buildColumnPreviewUrl(siteId, row.slug.trim()));
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
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonAdd
            :auth-codes="['cms:column:save']"
            :disabled="!hasActiveSite"
            @click="handleCreate()" />
          <AccessControl :codes="['cms:column:save']">
            <Button :disabled="!hasActiveSite" @click="handleOrder">
              <template #icon>
                <LucideListOrdered />
              </template>
              排序
            </Button>
          </AccessControl>
          <Button @click="handleExpandAll">
            <template #icon>
              <LucidePlus />
            </template>
            展开全部
          </Button>
          <Button @click="handleCollapseAll">
            <template #icon>
              <LucideMinus />
            </template>
            折叠全部
          </Button>
          <ButtonRemove
            :api="removeCmsColumnApi"
            :auth-codes="['cms:column:remove']"
            :disabled="!hasActiveSite"
            :grid-api="gridApi"
            @success="handleSearch" />
          <Divider class="h-5" type="vertical" />
        </Space>
      </template>
      <template #action="{ row }">
        <ButtonAdd
          :auth-codes="['cms:column:save']"
          size="small"
          text="新增下级"
          type="link"
          @click="handleCreate(row.id)" />
        <ButtonEdit
          :auth-codes="['cms:column:save']"
          size="small"
          type="link"
          @click="handleEdit(row.id)" />
        <Button size="small" type="link" @click="handlePreview(row)">
          <template #icon><LucideEye /></template>
          预览
        </Button>
        <ButtonRemove
          :api="removeCmsColumnApi"
          :auth-codes="['cms:column:remove']"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch" />
      </template>
    </Grid>
    <BaseInputDrawer @success="handleSearch" />
    <BaseOrderDrawer @success="handleSearch" />
    <CmsSiteSwitcher />
  </Page>
</template>
