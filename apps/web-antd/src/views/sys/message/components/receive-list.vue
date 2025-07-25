<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysMessage } from '#/api/sys/model/sys-message-model';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Divider, Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { infoApi, selectReceiveApi } from '#/api/sys/sys-message';
import { removeByIdsApi, setReadApi } from '#/api/sys/sys-message-detail';
import { ButtonRemove } from '#/components/button';
import { LucideMailCheck } from '#/components/icons';

import InfoModal from './info-modal.vue';

const props = withDefaults(
  defineProps<{
    params?: SysMessage;
    showQuery?: boolean;
    title?: string;
  }>(),
  {
    params: {},
    title: '消息',
    showQuery: true,
  },
);

const setReadBtnLoading = ref(false);

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

const gridOptions: VxeGridProps<SysMessage> = {
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
        return await selectReceiveApi({ ...props.params, ...formValues }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: props.title,
  formOptions: props.showQuery ? formOptions : undefined,
  gridOptions,
});

const [BaseInfoModal, baseInfoModalApi] = useVbenModal({
  connectedComponent: InfoModal,
});

/**
 * 消息全部标记为已读
 */
async function handleMakeAllAsRead() {
  try {
    setReadBtnLoading.value = true;
    await setReadApi();
    await handleSearch();
  } catch (error) {
    console.error('消息全部标记为已读失败', error);
  } finally {
    setReadBtnLoading.value = false;
  }
}

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
          <Button :loading="setReadBtnLoading" @click="handleMakeAllAsRead">
            <template #icon>
              <LucideMailCheck />
            </template>
            标记已读
          </Button>

          <ButtonRemove
            :api="removeByIdsApi"
            :grid-api="gridApi"
            @success="handleSearch"
          />

          <Divider class="h-5" type="vertical" />
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
          :api="removeByIdsApi"
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
