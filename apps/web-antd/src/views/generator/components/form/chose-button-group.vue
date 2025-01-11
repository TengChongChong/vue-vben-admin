<script setup lang="ts">
import { Tooltip } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';

type OptionsItem = {
  label: string;
  name: string;
  show?: boolean;
  tips?: string;
  value: string;
};

const props = defineProps<{
  options?: OptionsItem[];
  value?: string;
}>();

const emit = defineEmits(['change', 'update:value']);

const currentValue = ref();

watch(
  () => props.value,
  () => {
    currentValue.value = props.value;
  },
);

onMounted(() => {
  currentValue.value = props.value;
});

function handleChange(value) {
  currentValue.value = value;
  emit('change', value);
  emit('update:value', value);
}
</script>

<template>
  <div class="chose-button-group">
    <template v-for="item in options" :key="item.value">
      <template v-if="item.show !== false">
        <Tooltip v-if="item.tips">
          <template #title>{{ item.tips }}</template>
          <div
            :class="[
              value === item.value ? 'chose-button-group-item-active' : '',
            ]"
            class="chose-button-group-item"
            @click="handleChange(item.value)"
          >
            <span class="chose-button-group-item-name">{{ item.name }}</span>
            <span class="chose-button-group-item-label">{{ item.label }}</span>
          </div>
        </Tooltip>
        <div
          v-else
          :class="[
            value === item.value ? 'chose-button-group-item-active' : '',
          ]"
          class="chose-button-group-item"
          @click="handleChange(item.value)"
        >
          <span class="chose-button-group-item-name">{{ item.name }}</span>
          <span class="chose-button-group-item-label">{{ item.label }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.chose-button-group {
  display: flex;
  margin: 0 -10px;

  .chose-button-group-item {
    padding: 6px 24px;
    margin: 0 10px;
    text-align: center;
    cursor: pointer;
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);

    &.chose-button-group-item-active {
      color: hsl(var(--primary));
      border-color: hsl(var(--primary));

      .chose-button-group-item-name,
      .chose-button-group-item-label {
        color: hsl(var(--primary));
      }
    }

    .chose-button-group-item-name {
      display: block;
      font-weight: bold;
    }

    .chose-button-group-item-label {
      color: hsl(var(--foreground));
    }
  }
}
</style>
