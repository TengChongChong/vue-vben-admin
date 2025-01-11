<script setup lang="ts">
import type { SelectModel } from '#/api/base/model/select-model';

import { Select } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  value: string;
}>();

const emit = defineEmits(['update:value', 'change']);

const COMPONENT_TYPE = [
  'Input',
  'InputGroup',
  'InputPassword',
  'InputSearch',
  'InputTextArea',
  'InputNumber',
  'InputCountDown',
  'Select',
  'ApiSelect',
  'TreeSelect',
  'ApiTree',
  'ApiTreeSelect',
  'ApiRadioGroup',
  'RadioButtonGroup',
  'RadioGroup',
  'Checkbox',
  'CheckboxGroup',
  'AutoComplete',
  'ApiCascader',
  'Cascader',
  'DatePicker',
  'MonthPicker',
  'RangePicker',
  'WeekPicker',
  'TimePicker',
  'Switch',
  'StrengthMeter',
  'Upload',
  'IconPicker',
  'Render',
  'Slider',
  'Rate',
  'DictSelect',
  'DictCascader',
  'DictRadio',
  'DictCheckbox',
  'Divider',
];
const currentValue = ref();

const options = ref<SelectModel[]>([]);

watch(
  () => props.value,
  () => {
    currentValue.value = props.value;
  },
);

onMounted(() => {
  initOptions();
  currentValue.value = props.value;
});

const initOptions = () => {
  const opt: SelectModel[] = [];
  COMPONENT_TYPE.forEach((item) => {
    opt.push({
      label: item,
      value: item,
    });
  });
  options.value = opt;
};

function handleChange(value) {
  currentValue.value = value;
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <Select
    class="w-full"
    show-search
    v-bind="$attrs"
    v-model:value="currentValue"
    :options="options"
    @change="handleChange"
  />
</template>

<style scoped></style>
