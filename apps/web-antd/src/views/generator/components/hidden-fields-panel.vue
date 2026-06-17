<script setup lang="ts">
import { ref } from 'vue';

import { Collapse, CollapsePanel, Tag } from 'ant-design-vue';

export interface HiddenFieldItem {
  comment?: string;
  label?: string;
  propertyName: string;
  title?: string;
}

const props = defineProps<{
  fields: HiddenFieldItem[];
  nameField?: 'label' | 'title';
}>();

const emit = defineEmits<{
  restore: [propertyName: string];
}>();

const activeKey = ref<string[]>([]);

function displayName(item: HiddenFieldItem) {
  if (props.nameField === 'title') {
    return item.title || item.comment || item.propertyName;
  }
  return item.label || item.comment || item.propertyName;
}
</script>

<template>
  <Collapse
    v-if="fields.length > 0"
    v-model:active-key="activeKey"
    class="mt-4"
    ghost
  >
    <CollapsePanel key="hidden">
      <template #header> 已隐藏字段 ({{ fields.length }}) </template>
      <div class="flex flex-wrap gap-2">
        <Tag
          v-for="item in fields"
          :key="item.propertyName"
          class="cursor-pointer"
          @click="emit('restore', item.propertyName)"
        >
          {{ displayName(item) }}
          <span class="ml-1 text-primary">恢复</span>
        </Tag>
      </div>
    </CollapsePanel>
  </Collapse>
</template>
