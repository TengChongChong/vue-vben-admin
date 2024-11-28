<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FileUploadRule } from '#/api/file/model/file-upload-rule-model';

import { useVbenModal } from '@vben/common-ui';

import { Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { infoApi, removeApi, selectReceiveApi } from '#/api/sys/sys-message';
import { ButtonRemove } from '#/components/button';

import InfoModal from './info-modal.vue';

function handleSearch() {
  gridApi.search();
}

const formOptions: VbenFormProps = {
  collapsed: true,
  fieldMappingTime: [
    ['sendDate', ['startSendDate', 'endSendDate'], 'YYYY-MM-DD'],
  ],
  schema: [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
    },
    {
      fieldName: 'sendDate',
      label: '发送时间',
      component: 'RangePicker',
      componentProps: {
        allowEmpty: [true, true],
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
    },
    {
      fieldName: 'detailsStatus',
      label: '状态',
      component: 'DictSelect',
      componentProps: {
        dictType: 'messageStatus',
      },
    },
  ],
};

const gridOptions: VxeGridProps<FileUploadRule> = {
  id: 'message-receive-list',
  columns: [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '标题',
      field: 'title',
      sortable: true,
      minWidth: 400,
      slots: { default: 'title' },
    },
    {
      title: '状态',
      field: 'detailsStatus',
      sortable: true,
      width: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'messageStatus' },
      },
    },
    {
      title: '发送人',
      field: 'nickname',
      sortable: true,
      width: 160,
    },
    {
      title: '收信时间',
      field: 'sendDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '类型',
      field: 'type',
      sortable: true,
      width: 150,
      cellRender: {
        name: 'DictTag',
        props: { dictType: 'messageType' },
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 160,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectReceiveApi({ ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '消息',
  formOptions,
  gridOptions,
});

const [BaseInfoModal, baseInfoModalApi] = useVbenModal({
  connectedComponent: InfoModal,
});

function handleOpenInfoModel(id: string, messageId: string) {
  infoApi(id, messageId).then((res) => {
    if (!res.readDate) {
      // 未读消息，更新列表页消息状态
      handleSearch();
    }

    baseInfoModalApi.setData(res);
    baseInfoModalApi.open();
  });
}
</script>

<template>
  <div class="h-full">
    <Grid>
      <template #toolbar-tools>
        <Space>
          <ButtonRemove
            :api="removeApi"
            :grid-api="gridApi"
            @success="handleSearch"
          />
        </Space>
      </template>

      <template #title="{ row }">
        <span
          :class="[row.readDate == null ? 'unread' : '']"
          class="message-title"
          @click="handleOpenInfoModel(row.id, row.messageId)"
        >
          {{ row.title }}
        </span>
      </template>

      <template #action="{ row }">
        <ButtonRemove
          :api="removeApi"
          :ids="[row.id]"
          size="small"
          type="link"
          @success="handleSearch"
        />
      </template>
    </Grid>

    <BaseInfoModal />
  </div>
</template>
<style lang="scss" scoped>
.message-title {
  cursor: pointer;

  &.unread {
    font-weight: bold;
  }
}
</style>
