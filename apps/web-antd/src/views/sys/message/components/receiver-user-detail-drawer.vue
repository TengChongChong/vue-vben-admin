<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FileUploadRule } from '#/api/file/model/file-upload-rule-model';

import { ref, unref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectMessageReceiverUserDetailApi } from '#/api/sys/sys-message-detail';
import { ButtonClose } from '#/components/button';

const messageId = ref();

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      fieldName: 'receiverUserDeptName',
      label: '接收人部门',
      component: 'Input',
    },
    {
      fieldName: 'receiverUser',
      label: '接收人',
      component: 'Input',
    },
  ],
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
};

const gridOptions: VxeGridProps<FileUploadRule> = {
  id: 'receiver-user-detail',
  columns: [
    {
      title: '接收人部门',
      field: 'receiverUserDeptName',
      sortField: 'sd.name',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '接收人',
      field: 'receiverUser',
      sortField: 'su.nickname',
      sortable: true,
      minWidth: 200,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 120,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'messageStatus' },
      },
    },
    {
      title: '阅读时间',
      field: 'readDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectMessageReceiverUserDetailApi(
          { ...formValues, messageId: unref(messageId) },
          page,
        );
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = drawerApi.getData<Record<string, any>>();
      messageId.value = data.messageId;
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  },
});
</script>
<template>
  <Drawer class="w-[1080px]" title="用户接收情况">
    <div class="receiver-user-detail h-full">
      <Grid />
    </div>

    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
      </Space>
    </template>
  </Drawer>
</template>
<style lang="scss" scoped>
:deep(.vxe-grid) {
  .bg-background-deep {
    height: 1px;
  }
  .vxe-tools--operate {
    display: none;
  }
}
</style>
