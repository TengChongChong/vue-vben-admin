<script setup lang="ts">
import type { SysUser } from '#/api';
import type { UserSelect } from '#/components/user/src/type';

import { onMounted, ref, unref, watch } from 'vue';

import { cn } from '@vben/utils';

import { useDebounceFn } from '@vueuse/shared';
import { Select, SelectOption, Spin } from 'ant-design-vue';

import { searchApi, selectUsersByIdsApi } from '#/api';
import {
  convertArrayValue,
  convertSingleValue,
} from '#/components/form/src/helper';
import { HighlightText } from '#/components/highlight-text';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UserSelect>(), {
  range: 'all',
  deptIds: [],
});

const emit = defineEmits(['change', 'update:value']);

const loading = ref<boolean>(false);
let lastFetchId = 0;

const options = ref<SysUser[]>([]);
let searchValue = '';
const currentValue = ref<Array<string> | null | string>();

onMounted(() => {
  convertValue();
});

function convertValue() {
  currentValue.value = props.mode
    ? convertArrayValue(props.value as string[])
    : convertSingleValue(props.value as string);
}

watch(
  () => props.value,
  () => {
    convertValue();
    initSelectValue();
  },
);

const initSelectValue = () => {
  if (props.value && props.value.length > 0) {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    options.value = [];
    loading.value = true;
    selectUsersByIdsApi(props.value).then((res) => {
      if (fetchId !== lastFetchId) {
        return;
      }
      options.value = res;
      loading.value = false;
    });
  }
};

initSelectValue();

const fetchUser = useDebounceFn(async (value: null | string) => {
  try {
    searchValue = value;
    lastFetchId += 1;
    const fetchId = lastFetchId;
    options.value = [];
    loading.value = true;
    if (value === null || value === '') {
      return;
    }
    const res = await searchApi(value, props.range, props.deptId, {
      current: 1,
      pageSize: 20,
    });
    if (fetchId !== lastFetchId) {
      return;
    }
    options.value = res.records as SysUser[];
  } catch (error) {
    console.error('获取用户数据失败，', error);
  } finally {
    loading.value = false;
  }
}, 300);

function handleChange() {
  let relValue = unref(currentValue);
  if (unref(currentValue) === null) {
    relValue = props.mode ? [] : '';
  }
  emit('change', relValue);
  emit('update:value', relValue);
}
</script>

<template>
  <Select
    :allow-clear="true"
    :filter-option="false"
    :mode="props.mode"
    option-filter-prop="label"
    show-search
    v-bind="$attrs"
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    @change="handleChange"
    @search="fetchUser"
  >
    <SelectOption
      v-for="item in options"
      :key="item.id"
      :label="item.nickname"
      :value="item.id"
    >
      <HighlightText
        :keyword="searchValue"
        :text="`${item.username} - ${item.nickname} - ${item.deptName}`"
      />
    </SelectOption>

    <template v-if="loading" #notFoundContent>
      <Spin class="mr-2" size="small" /> loading...
    </template>
  </Select>
</template>

<style scoped></style>
