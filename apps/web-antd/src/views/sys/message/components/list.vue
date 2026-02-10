<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { FileUploadRule } from '#/api';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, Divider, message, Popconfirm, Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  infoApi,
  removeSysMessageApi,
  selectSysMessageApi,
  sendApi,
} from '#/api';
import { ButtonEdit, ButtonRemove } from '#/components/button';
import { LucideListOrdered, LucideSend } from '#/components/icons';
import { SysMessageStatus } from '#/views/sys/message/components/data';

import InfoModal from './info-modal.vue';
import ReceiverUserDetailDrawer from './receiver-user-detail-drawer.vue';

const props = defineProps<{ pageType: string }>();

const emit = defineEmits(['editMessage']);

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
      formItemClass:
        SysMessageStatus.HAS_BEEN_SENT === props.pageType ? '' : 'hidden',
    },
  ],
};

const gridOptions: VxeGridProps<FileUploadRule> = {
  id: 'message-list',
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
      title: '发送时间',
      field: 'sendDate',
      sortable: true,
      width: 160,
      formatter: 'dateTime',
    },
    {
      title: '创建时间',
      field: 'createDate',
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
      width: 260,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysMessageApi(
          { ...formValues, status: props.pageType },
          page,
        );
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

const [BaseReceiverUserDetailDrawer, baseReceiverUserDetailDrawerApi] =
  useVbenDrawer({
    connectedComponent: ReceiverUserDetailDrawer,
  });

function handleSend(id: string) {
  sendApi(id).then(() => {
    message.success('发送成功');
    handleSearch();
  });
}

function handleEdit(id: string) {
  emit('editMessage', id);
}

/**
 * 显示用户接收情况
 *
 * @param messageId 消息id
 */
function handleOpenReceiverUserDetailDrawer(messageId: string) {
  baseReceiverUserDetailDrawerApi.setData({ messageId });
  baseReceiverUserDetailDrawerApi.open();
}

function handleOpenInfoModel(id: string) {
  infoApi(null, id).then((res) => {
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
            :api="removeSysMessageApi"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
        </Space>
      </template>

      <template #title="{ row }">
        <span class="message-title" @click="handleOpenInfoModel(row.id)">
          {{ row.title }}
        </span>
      </template>

      <template #action="{ row }">
        <template v-if="SysMessageStatus.HAS_BEEN_SENT === props.pageType">
          <Button
            size="small"
            type="link"
            @click="handleOpenReceiverUserDetailDrawer(row.id)"
          >
            <template #icon>
              <LucideListOrdered />
            </template>
            用户接收情况
          </Button>
        </template>

        <template v-if="SysMessageStatus.DRAFT === props.pageType">
          <ButtonRemove
            :api="removeSysMessageApi"
            :ids="[row.id]"
            size="small"
            type="link"
            @success="handleSearch"
          />

          <ButtonEdit size="small" type="link" @click="handleEdit(row.id)" />

          <Popconfirm
            cancel-text="否"
            ok-text="是"
            title="发送后无法修改或删除，确定要立即发送吗？"
            @confirm="handleSend(row.id)"
          >
            <Button size="small" type="link">
              <template #icon>
                <LucideSend />
              </template>
              发送
            </Button>
          </Popconfirm>
        </template>
      </template>
    </Grid>

    <BaseInfoModal />

    <BaseReceiverUserDetailDrawer />
  </div>
</template>
<style lang="scss" scoped>
.message-title {
  cursor: pointer;
}
</style>
