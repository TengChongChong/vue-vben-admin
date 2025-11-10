<script lang="ts" setup>
import { Slot } from 'reka-ui';

import { useFormField } from './useFormField';

const { error, formDescriptionId, formItemId, formMessageId } = useFormField();
</script>

<template>
  <div class="flex min-h-[32px] w-full items-center">
    <Slot
      :id="formItemId"
      :aria-describedby="
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      "
      :aria-invalid="!!error"
    >
      <slot></slot>
    </Slot>
  </div>
</template>
