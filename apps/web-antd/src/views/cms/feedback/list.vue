<script lang="ts" setup>
import type {VbenFormProps} from '#/adapter/form';
import type {VxeGridProps} from '#/adapter/vxe-table';
import type {CmsFeedback} from '#/api';

import {computed, ref, watch} from 'vue';

import {Page, useVbenDrawer} from '@vben/common-ui';

import {Alert, Divider, Space} from 'ant-design-vue';

import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {
  exportCmsFeedbackDataApi,
  getCmsFeedbackApi,
  removeCmsFeedbackApi,
  selectCmsFeedbackApi,
} from '#/api';
import {
  ButtonExport,
  ButtonInfo,
  ButtonRemove,
} from '#/components/button';
import CmsSiteSwitcher from '#/components/cms/cms-site-switcher.vue';
import {useCmsSiteStore} from '#/store';
import {downloadFileById} from '#/util/download';
import {buildTenantGridId} from '#/utils/tenant-grid-id';

import {initColumns} from './data';
import InfoDrawer from './info.vue';

const cmsSiteStore = useCmsSiteStore();
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);
const exportBtnLoading = ref(false);

function handleSearch() {
  if (!hasActiveSite.value) {
    return;
  }
  gridApi.query();
}

async function handleExport() {
  exportBtnLoading.value = true;
  try {
    const id = await exportCmsFeedbackDataApi(
      await gridApi.formApi.getValues(),
    );
    downloadFileById(id);
  } catch (error) {
    console.error('导出数据错误', error);
  } finally {
    exportBtnLoading.value = false;
  }
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
    },
    {
      fieldName: 'phoneNumber',
      label: '手机号',
      component: 'Input',
    },
    {
      fieldName: 'content',
      label: '内容',
      component: 'Input',
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

const gridOptions: VxeGridProps<CmsFeedback> = {
  id: buildTenantGridId('cms-feedback'),
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({page}, formValues) => {
        if (!cmsSiteStore.hasActiveSite) {
          return {records: [], total: 0};
        }
        return await selectCmsFeedbackApi({...formValues}, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '用户反馈',
  formOptions,
  gridOptions,
});

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    handleSearch();
  },
);

const [BaseInfoDrawer, baseInfoDrawerApi] = useVbenDrawer({
  connectedComponent: InfoDrawer,
});

function handleInfo(id: string) {
  getCmsFeedbackApi(id).then((res) => {
    baseInfoDrawerApi.setData(res);
    baseInfoDrawerApi.open();
  });
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
    <div :style="{height: hasActiveSite ? '100%' : 'calc(100% - 40px)'}">
      <Grid>
        <template #toolbar-tools>
          <Space>
            <ButtonExport
              :auth-codes="['cms:feedback:select']"
              :disabled="!hasActiveSite"
              :loading="exportBtnLoading"
              @click="handleExport" />
            <ButtonRemove
              :api="removeCmsFeedbackApi"
              :auth-codes="['cms:feedback:remove']"
              :disabled="!hasActiveSite"
              :grid-api="gridApi"
              @success="handleSearch" />
            <Divider class="h-5" type="vertical" />
          </Space>
        </template>
        <template #action="{ row }">
          <ButtonInfo
            :auth-codes="['cms:feedback:select']"
            size="small"
            type="link"
            @click="handleInfo(row.id)" />
          <ButtonRemove
            :api="removeCmsFeedbackApi"
            :auth-codes="['cms:feedback:remove']"
            :ids="[row.id]"
            size="small"
            type="link"
            @success="handleSearch" />
        </template>
      </Grid>
    </div>
    <BaseInfoDrawer />
    <CmsSiteSwitcher />
  </Page>
</template>
