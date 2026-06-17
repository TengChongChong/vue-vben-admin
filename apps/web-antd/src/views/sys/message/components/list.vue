<script lang="ts" setup>
import { onMounted } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { formatToDateTime } from '@vben/utils';

import {
  Button,
  Checkbox,
  Empty,
  Input,
  message,
  Pagination,
  Popconfirm,
  RangePicker,
  Spin,
} from 'ant-design-vue';
import dayjs from 'dayjs';
import { useDebounceFn } from '@vueuse/core';

import { infoApi, removeSysMessageApi, sendApi } from '#/api';
import { ButtonEdit, ButtonRemove } from '#/components/button';
import { DictTag } from '#/components/dict';
import {
  LucideListOrdered,
  LucideSearch,
  LucideSend,
} from '#/components/icons';
import { SysMessageStatus } from '#/views/sys/message/components/data';
import { useMessageSendList } from '#/views/sys/message/composables/use-message-send-list';

import InfoModal from './info-modal.vue';
import ReceiverUserDetailDrawer from './receiver-user-detail-drawer.vue';

const props = defineProps<{ pageType: string }>();

const emit = defineEmits(['editMessage']);

const isSent = () => props.pageType === SysMessageStatus.HAS_BEEN_SENT;

const {
  allChecked,
  clearSelection,
  current,
  fetchList,
  handlePageChange,
  handleSearch,
  indeterminate,
  isSelected,
  loading,
  pageSize,
  query,
  records,
  selectedIds,
  toggleSelect,
  total,
} = useMessageSendList(props.pageType);

const [BaseInfoModal, baseInfoModalApi] = useVbenModal({
  connectedComponent: InfoModal,
});

const [BaseReceiverUserDetailDrawer, baseReceiverUserDetailDrawerApi] =
  useVbenDrawer({
    connectedComponent: ReceiverUserDetailDrawer,
  });

const debouncedSearch = useDebounceFn(() => {
  handleSearch();
}, 300);

function handleSend(id: string) {
  sendApi(id).then(() => {
    message.success('发送成功');
    fetchList();
  });
}

function handleEdit(id: string) {
  emit('editMessage', id);
}

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

function handleDateChange(_: unknown, dateStrings: [string, string]) {
  query.startSendDate = dateStrings[0] || undefined;
  query.endSendDate = dateStrings[1] || undefined;
  handleSearch();
}

onMounted(() => {
  fetchList();
});
</script>

<template>
  <div class="message-send-list">
    <div class="message-send-list__toolbar">
      <div class="message-send-list__toolbar-left">
        <Input
          v-model:value="query.title"
          allow-clear
          class="max-w-xs"
          placeholder="搜索标题"
          @change="debouncedSearch"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <LucideSearch class="size-4 text-muted-foreground" />
          </template>
        </Input>
        <RangePicker
          v-if="isSent()"
          :presets="[
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
          ]"
          @change="handleDateChange"
        />
      </div>
      <div class="message-send-list__toolbar-right">
        <Checkbox
          v-if="records.length > 0"
          v-model:checked="allChecked"
          :indeterminate="indeterminate"
        >
          全选
        </Checkbox>
        <ButtonRemove
          :api="removeSysMessageApi"
          :disabled="selectedIds.length === 0"
          :ids="selectedIds"
          @success="
            () => {
              clearSelection();
              fetchList();
            }
          "
        />
      </div>
    </div>

    <Spin :spinning="loading" class="message-send-list__cards">
      <template v-if="records.length > 0">
        <div
          v-for="item in records"
          :key="item.id"
          :class="{ 'message-send-card--selected': isSelected(item.id) }"
          class="message-send-card"
        >
          <div class="message-send-card__checkbox">
            <Checkbox
              :checked="isSelected(item.id)"
              @change="(e) => toggleSelect(item.id!, e.target.checked)"
            />
          </div>
          <div class="message-send-card__main">
            <div
              class="message-send-card__title"
              @click="handleOpenInfoModel(item.id!)"
            >
              {{ item.title }}
            </div>
            <div class="message-send-card__meta">
              <DictTag
                v-if="item.type"
                :code="item.type"
                dict-type="messageType"
              />
              <span v-if="isSent() && item.sendDate">
                发送：{{ formatToDateTime(item.sendDate) }}
              </span>
              <span v-if="item.createDate">
                创建：{{ formatToDateTime(item.createDate) }}
              </span>
            </div>
          </div>
          <div class="message-send-card__actions">
            <template v-if="isSent()">
              <Button
                size="small"
                type="link"
                @click="handleOpenReceiverUserDetailDrawer(item.id!)"
              >
                <template #icon>
                  <LucideListOrdered />
                </template>
                接收情况
              </Button>
            </template>
            <template v-else>
              <ButtonEdit
                size="small"
                type="link"
                @click="handleEdit(item.id!)"
              />
              <ButtonRemove
                :api="removeSysMessageApi"
                :ids="[item.id!]"
                size="small"
                type="link"
                @success="fetchList()"
              />
              <Popconfirm
                cancel-text="否"
                ok-text="是"
                title="发送后无法修改或删除，确定要立即发送吗？"
                @confirm="handleSend(item.id!)"
              >
                <Button size="small" type="link">
                  <template #icon>
                    <LucideSend />
                  </template>
                  发送
                </Button>
              </Popconfirm>
            </template>
          </div>
        </div>
      </template>
      <Empty v-else class="py-16" description="暂无消息" />
    </Spin>

    <div v-if="total > 0" class="message-send-list__pagination">
      <Pagination
        :current="current"
        :page-size="pageSize"
        :show-size-changer="true"
        :total="total"
        @change="handlePageChange"
      />
    </div>

    <BaseInfoModal />
    <BaseReceiverUserDetailDrawer />
  </div>
</template>

<style lang="scss" scoped>
@import '../style/message.scss';
</style>
