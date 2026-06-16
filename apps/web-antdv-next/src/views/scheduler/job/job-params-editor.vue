<script lang="ts" setup>
import type { SchedulerJobParam, SchedulerJobParamType } from '#/api';

import { computed, watch } from 'vue';

import { Button, DatePicker, Input, Select, Space, Textarea } from 'antdv-next';
import dayjs from 'dayjs';

import { LucidePlus, LucideTrash } from '#/components/icons';

const props = defineProps<{
  value?: string;
}>();

const emit = defineEmits<{
  'update:value': [string];
}>();

const PARAM_TYPE_OPTIONS: { label: string; value: SchedulerJobParamType }[] = [
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Long', value: 'Long' },
  { label: 'Double', value: 'Double' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Date', value: 'Date' },
  { label: 'JSON', value: 'JSON' },
];

const BOOLEAN_OPTIONS = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
];

const paramList = computed<SchedulerJobParam[]>({
  get() {
    if (!props.value || props.value.trim() === '') {
      return [];
    }
    try {
      const parsed = JSON.parse(props.value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  set(list) {
    if (!list.length) {
      emit('update:value', '');
      return;
    }
    emit('update:value', JSON.stringify(list));
  },
});

const jsonErrors = computed(() => {
  const errors: Record<number, boolean> = {};
  paramList.value.forEach((item, index) => {
    if (item.type === 'JSON' && item.value) {
      try {
        JSON.parse(item.value);
      } catch {
        errors[index] = true;
      }
    }
  });
  return errors;
});

function updateParamList(list: SchedulerJobParam[]) {
  paramList.value = list;
}

function handleAdd() {
  updateParamList([...paramList.value, { type: 'String', value: '' }]);
}

function handleRemove(index: number) {
  const list = [...paramList.value];
  list.splice(index, 1);
  updateParamList(list);
}

function handleTypeChange(index: number, type: SchedulerJobParamType) {
  const list = [...paramList.value];
  const current = list[index];
  if (!current) {
    return;
  }
  let value = current.value;
  if (type === 'Boolean') {
    value = 'true';
  } else if (type === 'JSON') {
    value = '{}';
  } else if (type === 'Date') {
    value = dayjs().format('YYYY-MM-DD HH:mm:ss');
  } else {
    value = '';
  }
  list[index] = { type, value };
  updateParamList(list);
}

function handleValueChange(index: number, value: string) {
  const list = [...paramList.value];
  const current = list[index];
  if (!current) {
    return;
  }
  list[index] = { ...current, value };
  updateParamList(list);
}

function handleDateChange(index: number, date: dayjs.Dayjs | null) {
  handleValueChange(index, date ? date.format('YYYY-MM-DD HH:mm:ss') : '');
}

watch(
  () => props.value,
  (value) => {
    if (value === '[]') {
      emit('update:value', '');
    }
  },
);
</script>

<template>
  <div class="w-full space-y-2">
    <div
      v-for="(item, index) in paramList"
      :key="index"
      class="flex items-start gap-2"
    >
      <Select
        :options="PARAM_TYPE_OPTIONS"
        :value="item.type"
        class="w-[120px]"
        placeholder="类型"
        @change="(val) => handleTypeChange(index, val as SchedulerJobParamType)"
      />
      <div class="min-w-0 flex-1">
        <Select
          v-if="item.type === 'Boolean'"
          :options="BOOLEAN_OPTIONS"
          :value="item.value"
          class="w-full"
          @change="(val) => handleValueChange(index, val as string)"
        />
        <DatePicker
          v-else-if="item.type === 'Date'"
          :show-time="{ format: 'HH:mm:ss' }"
          :value="item.value ? dayjs(item.value) : undefined"
          class="w-full"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="(val) => handleDateChange(index, val as dayjs.Dayjs | null)"
        />
        <Textarea
          v-else-if="item.type === 'JSON'"
          :status="jsonErrors[index] ? 'error' : undefined"
          :value="item.value"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          placeholder='请输入合法 JSON，如 {"key":"value"} 或 [1,2,3]'
          @change="(e) => handleValueChange(index, e.target.value ?? '')"
        />
        <Input
          v-else
          :value="item.value"
          placeholder="参数值"
          @change="(e) => handleValueChange(index, e.target.value ?? '')"
        />
      </div>
      <Button danger type="text" @click="handleRemove(index)">
        <LucideTrash class="size-4" />
      </Button>
    </div>
    <Button block type="dashed" @click="handleAdd">
      <Space>
        <LucidePlus class="size-4" />
        添加参数
      </Space>
    </Button>
  </div>
</template>
