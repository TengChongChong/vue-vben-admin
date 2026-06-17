<script setup lang="ts">
import type { TableField } from '#/api';

import { Popover, TypographyLink } from 'ant-design-vue';

defineProps<{
  field: TableField & {
    comment?: string;
    format?: string;
    dictType?: string;
    sorter?: boolean;
    width?: number;
  };
  showExtra?: boolean;
}>();
</script>

<template>
  <Popover>
    <template #content>
      <div>列名：{{ field.name }}</div>
      <div>
        类型：{{ field.metaInfo.jdbcType?.toLowerCase() }}
        {{ field.metaInfo.length > 0 ? `(${field.metaInfo.length})` : '' }}
      </div>
      <div>属性：{{ field.propertyName }}</div>
      <div>注释：{{ field.comment ? field.comment : '-' }}</div>
      <template v-if="showExtra">
        <div>格式：{{ field.format ? field.format : '-' }}</div>
        <div>字典：{{ field.dictType ? field.dictType : '-' }}</div>
        <div>排序：{{ field.sorter ? '支持' : '不支持' }}</div>
        <div>宽度：{{ field.width ? field.width : '-' }}</div>
      </template>
    </template>
    <TypographyLink v-if="$slots.default">
      <slot />
    </TypographyLink>
    <TypographyLink v-else>{{ field.propertyName }}</TypographyLink>
  </Popover>
</template>
