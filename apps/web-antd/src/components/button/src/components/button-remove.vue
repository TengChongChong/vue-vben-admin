<script setup lang="ts">
import type { ButtonRemoveProps } from '../props';

import { createVNode, ref } from 'vue';

import { AccessControl } from '@vben/access';
import { cn, isFunction } from '@vben/utils';

import {
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { Button, Modal } from 'ant-design-vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonRemoveProps>(), {
  authType: 'code',
  text: '删除',
  danger: true,
  disabled: false,
  type: 'primary',
  size: 'middle',
});

const emit = defineEmits(['click', 'success', 'fail']);

const loading = ref(false);

function handleClick() {
  Modal.confirm({
    title: `确定要删除选中 ${props.id.length} 条数据吗?`,
    icon: createVNode(ExclamationCircleOutlined),
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
        result = await api(props.id.join(','));
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
      if (result) {
        emit('success', props.id);
      } else {
        emit('fail', props.id);
      }
    },
  });
}
</script>

<template>
  <AccessControl :codes="props.codes" :type="props.authType">
    <Button
      v-if="props.id.length > 0"
      v-bind="$attrs"
      :class="cn(props.class)"
      :danger="props.danger"
      :disabled="props.disabled"
      :loading="loading"
      :size="props.size"
      :type="props.type"
      @click="handleClick"
    >
      <template #icon>
        <DeleteOutlined />
      </template>
      {{ props.text }}
    </Button>
  </AccessControl>
</template>

<style scoped></style>
