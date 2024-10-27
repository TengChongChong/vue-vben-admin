<script setup lang="ts">
import type { SysRole } from '#/api/auth/model/sysRoleModel';
import type { RoleSelectProps } from '#/components/role/src/props';

import { onMounted, ref, watch } from 'vue';

import { useUserStore } from '@vben/stores';
import { cn } from '@vben/utils';

import { Select, SelectOption } from 'ant-design-vue';

import { selectAllApi, selectRoleByDeptApi } from '#/api/auth/sysRole';
import {
  convertArrayValue,
  convertSingleValue,
} from '#/components/form/src/helper';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RoleSelectProps>(), {
  type: 'all',
});

const emit = defineEmits(['change', 'update:value']);

const userStore = useUserStore();
const currentValue = ref<Array<string> | string | undefined>();

const roleList = ref<SysRole[]>([]);

onMounted(() => {
  convertValue();
});

function convertValue() {
  currentValue.value =
    props.mode === undefined
      ? convertSingleValue(props.value as string)
      : convertArrayValue(props.value as string[]);
}

watch(() => props.value, convertValue);

watch(
  () => [props.type, props.deptId],
  () => loadOptions(),
);

function loadOptions() {
  if (props.type === 'all') {
    selectAllApi().then((res) => {
      roleList.value = res;
    });
  } else if (props.type === 'current') {
    selectRoleByDeptApi(userStore.userInfo?.deptId!).then((res) => {
      roleList.value = res;
    });
  } else {
    if (props.deptId) {
      selectRoleByDeptApi(props.deptId).then((res) => {
        roleList.value = res;
      });
    }
  }
}

loadOptions();

function handleChange(value) {
  currentValue.value = value;
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <Select
    v-model:value="currentValue"
    :class="cn(props.class, 'w-full')"
    option-filter-prop="label"
    show-search
    v-bind="$attrs"
    :mode="props.mode"
    @change="handleChange"
  >
    <SelectOption v-for="item in roleList" :key="item.id" :value="item.id">
      {{ item.name }}
    </SelectOption>
  </Select>
</template>

<style scoped></style>
