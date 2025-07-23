<script setup lang="ts">
import type { SysQuickNavigationVO } from '#/api/sys/model/sys-quick-navigation-model';

import { ref } from 'vue';

import { Card } from 'ant-design-vue';

import { getCurrentUserQuickNavigationApi } from '#/api/auth/auth';
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
  <Card :bordered="false" title="快捷导航">
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
