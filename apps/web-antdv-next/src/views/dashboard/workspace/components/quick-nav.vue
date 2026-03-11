<script setup lang="ts">
import type { SysQuickNavigationVO } from '#/api';

import { ref } from 'vue';

import { Card } from 'antdv-next';

import { getCurrentUserQuickNavigationApi } from '#/api';
import Navigation from '#/views/sys/quick/navigation/navigation.vue';

const sysQuickNavigationList = ref<SysQuickNavigationVO[]>([]);

function loadQuickNavigation() {
  getCurrentUserQuickNavigationApi().then((res) => {
    sysQuickNavigationList.value = res;
  });
}

loadQuickNavigation();
</script>

<template>
  <Card variant="outlined" title="快捷导航">
    <div class="grid grid-cols-4 gap-2" v-if="sysQuickNavigationList">
      <Navigation
        v-for="navigation in sysQuickNavigationList"
        :key="navigation.id"
        :quick-navigation="navigation"
      />
    </div>
  </Card>
</template>

<style scoped lang="scss"></style>
