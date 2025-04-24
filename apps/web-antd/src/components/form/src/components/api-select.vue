<script lang="ts" setup>
import type { ApiSelectProps, OptionsItem } from '../props';

import { onMounted, ref, unref, watch } from 'vue';

import { cn, isFunction } from '@vben/utils';

import { get } from '@vueuse/shared';
import { Select } from 'ant-design-vue';

import { HighlightText } from '#/components/highlight-text';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ApiSelectProps>(), {
  immediate: true,
  optionFilterProp: 'label',
});

const emit = defineEmits(['optionsChange', 'change', 'update:value']);

const currentValue = ref<Array<string> | string | undefined>();
const searchValue = ref('');

const options = ref<OptionsItem[]>([]);
const isFirstLoaded = ref(false);
const loading = ref(false);

async function fetch() {
  const { api, afterFetch } = props;
  if (!api || !isFunction(api) || loading.value) return;
  options.value = [];
  try {
    loading.value = true;
    let res = await api(props.params);
    if (afterFetch && isFunction(afterFetch)) {
      res = afterFetch(res);
    }
    isFirstLoaded.value = true;
    if (Array.isArray(res)) {
      options.value = res;
      emitChange();
      return;
    }
    if (props.resultField) {
      options.value = get(res, props.resultField) || [];
    }
    emitChange();
  } catch (error) {
    console.warn(error);
  } finally {
    loading.value = false;
    isFirstLoaded.value = false;
  }
}

function emitChange() {
  emit('optionsChange', options.value);
}
watch(
  () => props.params,
  () => {
    unref(isFirstLoaded) && fetch();
  },
  { deep: true },
);

watch(
  () => props.t,
  () => {
    unref(isFirstLoaded) && fetch();
  },
);

watch(
  () => props.immediate,
  (v) => {
    v && unref(isFirstLoaded) && fetch();
  },
);

onMounted(() => {
  props.immediate && fetch();
  convertValue();
});

function convertValue() {
  currentValue.value = props.multiple
    ? (props.value ?? [])
    : (props.value ?? undefined);
}

watch(() => props.value, convertValue);

function handleSearch(value: string) {
  searchValue.value = value;
}

function handleChange() {
  const relValue = unref(currentValue) ?? (props.multiple ? [] : '');
  emit('change', relValue);
  emit('update:value', relValue);
}
</script>
<template>
  <Select
    v-bind="$attrs"
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    :mode="props.mode"
    :option-filter-prop="props.optionFilterProp"
    :options="options"
    allow-clear
    show-search
    @change="handleChange"
    @search="handleSearch"
  >
    <template #option="{ label }">
      <!-- 高亮关键字 -->
      <template v-if="label">
        <HighlightText :keyword="searchValue" :text="label" />
      </template>
    </template>
  </Select>
</template>
