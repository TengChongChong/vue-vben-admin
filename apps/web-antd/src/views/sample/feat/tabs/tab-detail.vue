<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { setTabTitle } = useTabs();

const index = computed(() => {
  return route.params?.id ?? -1;
});

setTabTitle(`No.${index.value} - 详情信息`);
</script>

<template>
  <Page :title="`标签页${index}详情页`">
    <template #description> {{ index }} - 详情页内容在此 </template>
  </Page>
</template>
