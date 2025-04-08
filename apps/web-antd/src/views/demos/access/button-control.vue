<script lang="ts" setup>
import { AccessControl, useAccess } from '@vben/access';
import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, Card } from 'ant-design-vue';

const { accessMode, hasAccessByCodes } = useAccess();
const userStore = useUserStore();
</script>

<template>
  <Page
    :title="`${accessMode === 'frontend' ? '前端' : '后端'}按钮访问权限演示`"
    description="切换不同的账号，观察按钮变化。"
  >
    <Card class="mb-5">
      <template #title>
        <span class="font-semibold">当前角色:</span>
        <span class="text-primary mx-4 text-lg">
          {{ userStore.roleCodeList }}
        </span>
      </template>
    </Card>

    <Card class="mb-5" title="组件形式控制 - 权限码">
      <AccessControl :codes="['sys:role:select']" type="code">
        <Button class="mr-4"> sys:role:select 权限可见 </Button>
      </AccessControl>
      <AccessControl :codes="['sys:role:remove']" type="code">
        <Button class="mr-4"> sys:role:remove 权限可见 </Button>
      </AccessControl>
      <AccessControl :codes="['sys:role:save']" type="code">
        <Button class="mr-4"> sys:role:save 权限可见 </Button>
      </AccessControl>
      <AccessControl :codes="['sys:role:remove', 'sys:role:save']" type="code">
        <Button class="mr-4"> sys:role:remove & sys:role:save 权限可见 </Button>
      </AccessControl>
    </Card>

    <Card class="mb-5" title="组件形式控制 - 角色">
      <AccessControl :codes="['sys:admin']" type="role">
        <Button class="mr-4"> sys:admin 角色可见 </Button>
      </AccessControl>
      <AccessControl :codes="['admin']" type="role">
        <Button class="mr-4"> admin 角色可见 </Button>
      </AccessControl>
    </Card>

    <Card class="mb-5" title="函数形式控制">
      <Button v-if="hasAccessByCodes(['sys:role:select'])" class="mr-4">
        sys:role:select 权限可见
      </Button>
      <Button v-if="hasAccessByCodes(['sys:role:remove'])" class="mr-4">
        sys:role:remove 权限可见
      </Button>
      <Button v-if="hasAccessByCodes(['sys:role:save'])" class="mr-4">
        sys:role:save 权限可见
      </Button>
      <Button
        v-if="hasAccessByCodes(['sys:role:remove', 'sys:role:save'])"
        class="mr-4"
      >
        sys:role:remove & sys:role:save 权限可见
      </Button>
    </Card>

    <Card class="mb-5" title="指令方式 - 权限码">
      <Button class="mr-4" v-access:code="['sys:role:select']">
        sys:role:select 权限可见
      </Button>
      <Button class="mr-4" v-access:code="['sys:role:remove']">
        sys:role:remove 权限可见
      </Button>
      <Button class="mr-4" v-access:code="['sys:role:save']">
        sys:role:save 权限可见
      </Button>
      <Button class="mr-4" v-access:code="['sys:role:remove', 'sys:role:save']">
        sys:role:remove & sys:role:save 权限可见
      </Button>
    </Card>

    <Card class="mb-5" title="指令方式 - 角色">
      <Button class="mr-4" v-access:role="['sys:admin']">
        sys:admin 角色可见
      </Button>
      <Button class="mr-4" v-access:role="['admin']"> admin 角色可见 </Button>
    </Card>
  </Page>
</template>
