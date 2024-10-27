<script setup lang="ts">
import type { ButtonRemoveProps } from '../props';

import { createVNode, ref } from 'vue';

import { AccessControl } from '@vben/access';
import { cn, isFunction } from '@vben/utils';

import { Button, message, Modal } from 'ant-design-vue';

import { LucideTrash } from '#/components/icons';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonRemoveProps>(), {
  ids: [],
  authType: 'code',
  text: '删除',
  type: 'primary',
  size: 'middle',
});

const emit = defineEmits(['click', 'success', 'fail']);

const loading = ref(false);

function handleClick() {
  let selectRecordIds: string = props.ids;
  if (!selectRecordIds?.length) {
    selectRecordIds = props.gridApi.getCheckboxRecordIds();
    if (selectRecordIds.length === 0) {
      message.warning('请选择要删除的数据后重试');
      return;
    }
  }

  Modal.confirm({
    title: props.ids?.length
      ? ` 确定要删除吗?`
      : ` 确定要删除选中 ${selectRecordIds.length} 条数据吗?`,
    content: createVNode(
      'div',
      { class: 'danger-tip' },
      '删除后无法恢复，请谨慎操作',
    ),
    onOk: async () => {
      const { api } = props;
      if (!api || !isFunction(api)) return;

      loading.value = true;
      let result;
      try {
        result = await api(selectRecordIds.join(','));
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
      if (result) {
        message.success('删除成功');
        emit('success', selectRecordIds);
      } else {
        emit('fail', selectRecordIds);
      }
    },
  });
}
</script>

<template>
  <AccessControl :codes="props.authCodes" :type="props.authType">
    <Button
      v-bind="$attrs"
      :class="cn(props.class)"
      :loading="loading"
      :size="props.size"
      :type="props.type"
      danger
      @click.stop="handleClick"
    >
      <template #icon>
        <LucideTrash />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
