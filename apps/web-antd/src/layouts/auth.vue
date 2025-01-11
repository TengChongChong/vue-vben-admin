<script lang="ts" setup>
import { $t } from '#/locales';
import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { computed } from 'vue';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
