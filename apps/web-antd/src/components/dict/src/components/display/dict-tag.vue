<script lang="ts" setup>
import type { SysDict } from '#/api';
import type { DictTagProps } from '#/components/dict/src/props';

import { computed } from 'vue';

import { isNumber, isString } from '@vben/utils';

import { Tag } from 'ant-design-vue';

import { useDictStore } from '#/store';

const props = withDefaults(defineProps<DictTagProps>(), {
  useTag: true,
  separator: ' /',
});

const dictStore = useDictStore();

const dictArray = computed(() => {
  const dictCodeArray = convertDictCode();
  const dictionaryArray: SysDict[] = [];
  dictCodeArray.forEach((item) => {
    const code = isNumber(item)
      ? (item as number).toString()
      : (item as string);
    const dictionary = dictStore.getDict(props.dictType, code);
    if (dictionary) {
      dictionaryArray.push(dictionary);
    }
  });
  return dictionaryArray;
});

/**
 * 处理传入的字典编码，转为['1', '2', '3']数据
 */
function convertDictCode() {
  let dictCodeArray: string[] = [];
  if (isNumber(props.code)) {
    dictCodeArray = [props.code.toString()];
  } else if (isString(props.code)) {
    dictCodeArray = props.code.includes(',')
      ? props.code.split(',')
      : [props.code];
  } else if (Array.isArray(props.code)) {
    props.code.forEach((item) => {
      dictCodeArray.push(isString(item) ? item : item.toString());
    });
  } else {
    console.warn(`不支持的字典编码类型：${props.code}`);
  }

  return dictCodeArray;
}
</script>
<template>
  <template v-if="dictArray.length > 0">
    <template v-for="(dict, index) in dictArray" :key="dict.code">
      <Tag
        v-if="dict.color && props.useTag"
        :bordered="false"
        :color="dict.color"
      >
        {{ dict.name }}
      </Tag>
      <span v-else>{{ dict.name }}</span>
      {{ index < dictArray.length - 1 ? props.separator : '' }}
    </template>
  </template>
</template>
