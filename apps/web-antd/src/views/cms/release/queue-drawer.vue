<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CmsReleaseQueue } from '#/api';

import { computed, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer } from '@vben/common-ui';
import { formatToDuration } from '@vben/utils';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { releaseCmsQueueItemApi, selectCmsReleaseQueueApi } from '#/api';
import { ButtonClose } from '#/components/button';
import { LucideSend } from '#/components/icons';
import { useCmsSiteStore } from '#/store';
import { buildTenantGridId } from '#/utils/tenant-grid-id';

const cmsSiteStore = useCmsSiteStore();
const parentId = ref('');
const releaseName = ref('');
const hasActiveSite = computed(() => cmsSiteStore.hasActiveSite);

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      parentId.value = '';
      releaseName.value = '';
      return;
    }
    const data = drawerApi.getData<{
      parentId?: string;
      releaseName?: string;
    }>();
    parentId.value = data?.parentId || '';
    releaseName.value = data?.releaseName || '';
    handleSearch();
  },
});

function handleSearch() {
  if (!hasActiveSite.value || !parentId.value) {
    return;
  }
  gridApi.query();
}

function handleReleaseItem(row: CmsReleaseQueue) {
  Modal.confirm({
    title: '重新发布',
    content: `确定要发布「${row.title}」吗？`,
    onOk: async () => {
      await releaseCmsQueueItemApi(row.id);
      message.success('已提交发布');
      handleSearch();
    },
  });
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'DictSelect',
      componentProps: {
        dictType: 'cmsReleaseType',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'cmsReleaseStatus',
      },
    },
  ],
};

const gridOptions: VxeGridProps<CmsReleaseQueue> = {
  id: buildTenantGridId('cms-release-queue'),
  columns: [
    { type: 'seq', width: 70 },
    {
      title: '类型',
      field: 'type',
      width: 110,
      cellRender: { name: 'DictTag', props: { dictType: 'cmsReleaseType' } },
    },
    {
      title: '标题',
      field: 'title',
      minWidth: 500,
      showOverflow: true,
    },
    {
      title: '状态',
      field: 'status',
      width: 110,
      cellRender: { name: 'DictTag', props: { dictType: 'cmsReleaseStatus' } },
    },
    {
      title: '耗时',
      field: 'duration',
      width: 110,
      slots: {
        default: ({ row }) => {
          if (row.duration === null || row.duration === undefined) {
            return '';
          }
          return formatToDuration(row.duration / 1000);
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 160,
      slots: { default: 'action' },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!cmsSiteStore.hasActiveSite || !parentId.value) {
          return { records: [], total: 0 };
        }
        return await selectCmsReleaseQueueApi(
          { ...formValues, parentId: parentId.value },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '发布队列详情',
  formOptions,
  gridOptions,
});

watch(
  () => cmsSiteStore.activeSiteId,
  () => {
    handleSearch();
  },
);
</script>

<template>
  <Drawer class="w-[1200px]" title="队列明细">
    <Grid>
      <template #action="{ row }">
        <AccessControl :codes="['cms:release']">
          <Button
            v-if="row.status !== '1' && row.status !== '2'"
            size="small"
            type="link"
            @click="handleReleaseItem(row)">
            <template #icon>
              <LucideSend />
            </template>
            发布
          </Button>
        </AccessControl>
      </template>
    </Grid>
    <template #footer>
      <ButtonClose @click="drawerApi.close()" />
    </template>
  </Drawer>
</template>
