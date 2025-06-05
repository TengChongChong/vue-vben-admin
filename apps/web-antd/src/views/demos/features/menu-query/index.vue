<script lang="ts" setup>
import { unref } from 'vue';
import { useRouter } from 'vue-router';

import { Fallback } from '@vben/common-ui';

const { currentRoute } = useRouter();

const query = unref(currentRoute).query;
</script>

<template>
  <Fallback
    description="点击菜单，将会带上参数"
    status="coming-soon"
    title="菜单带参示例"
  >
    <template #describe>
      <div class="mt-6">
        当前路由参数：
        <pre>{{ query }}</pre>
      </div>
    </template>
  </Fallback>
</template>
