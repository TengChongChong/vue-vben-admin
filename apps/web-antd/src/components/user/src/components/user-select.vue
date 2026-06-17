<script setup lang="ts">
import type { UserSelectProps } from '#/components/user/src/type';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { cn } from '@vben/utils';

import type { SelectValue } from 'ant-design-vue/es/select';

import { Select, SelectOption, Spin } from 'ant-design-vue';

import {
  convertArrayValue,
  convertSingleValue,
} from '#/components/form/src/helper';
import UserOptionItem from '#/components/user/src/components/user-option-item.vue';
import { useUserSelect } from '#/components/user/src/composables/use-user-select';
import { formatUserLabel } from '#/components/user/src/util/user-helpers';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<UserSelectProps>(), {
  range: 'all',
});

const emit = defineEmits(['change', 'update:value']);

const filterOptions = computed(() => ({
  deptId: props.deptId,
  range: props.range,
  roleCode: props.roleCode,
}));

const {
  debouncedFetchUsers,
  fetchUsers,
  loading,
  options,
  resolveLabels,
  searchKeyword,
} = useUserSelect(filterOptions);

const currentValue = ref<SelectValue>();

onMounted(() => {
  convertValue();
  initSelectValue();
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

watch(filterOptions, () => {
  fetchUsers(searchKeyword.value);
});

function initSelectValue() {
  if (props.value && props.value.length > 0) {
    resolveLabels(props.value);
  }
}

function handleDropdownVisibleChange(open: boolean) {
  if (open && options.value.length === 0) {
    fetchUsers('');
  }
}

function handleSearch(value: string) {
  debouncedFetchUsers(value);
}

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
    :loading="loading"
    :mode="props.mode"
    :not-found-content="loading ? undefined : '输入关键字进一步筛选'"
    option-filter-prop="label"
    show-search
    v-bind="$attrs"
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    @change="handleChange"
    @dropdown-visible-change="handleDropdownVisibleChange"
    @search="handleSearch"
  >
    <SelectOption
      v-for="item in options"
      :key="item.id"
      :label="formatUserLabel(item)"
      :value="item.id"
    >
      <UserOptionItem :keyword="searchKeyword" :user="item" />
    </SelectOption>

    <template v-if="loading" #notFoundContent>
      <Spin class="mr-2" size="small" /> loading...
    </template>
  </Select>
</template>
