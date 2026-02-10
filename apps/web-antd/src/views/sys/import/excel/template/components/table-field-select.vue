<script setup lang="ts">
import type { OptionsItem } from '#/components/form/src/props';

import { onMounted, ref, watch } from 'vue';

import { Select } from 'ant-design-vue';

import { getTableInfoApi } from '#/api';
import { HighlightText } from '#/components/highlight-text';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    dataSource?: string;
    table?: string;
  }>(),
  {
    dataSource: 'master',
    table: undefined,
  },
);

const value = defineModel<string>();
const searchValue = ref('');

const options = ref<OptionsItem[]>([]);
const loading = ref(false);

async function fetch() {
  options.value = [];
  if (!props.table) {
    return;
  }

  try {
    loading.value = true;
    const res = await getTableInfoApi(props.dataSource, props.table);

    res.fields.forEach((item) => {
      options.value.push({
        value: item.name,
        label: `${item.name} - ${item.comment}`,
      });
    });
  } catch (error) {
    console.warn(error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.table,
  () => {
    fetch();
  },
);

onMounted(() => {
  fetch();
});
</script>

<template>
  <Select
    v-bind="$attrs"
    v-model:search-value="searchValue"
    v-model:value="value"
    :options="options"
    allow-clear
    class="w-full"
    option-filter-prop="label"
    show-search
  >
    <template #title="{ label }">
      <!-- 高亮关键字 -->
      <template v-if="label">
        <HighlightText :keyword="searchValue" :text="label" />
      </template>
    </template>
  </Select>
</template>

<style scoped></style>
