<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { ref } from 'vue';

import SlideVerify from './slide-verify.vue';

const emit = defineEmits(['register', 'success', 'change']);

const slideVerify = ref();

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  footer: false,
});

const captchaVerification = ref<string>();

function handleSuccess() {
  setTimeout(() => {
    modalApi.close();
  }, 500);
  // 服务端二次验证所需参数
  emit('success', captchaVerification.value);
}

function handleChange(isPassing) {
  emit('change', isPassing);
}
</script>
<template>
  <Modal class="w-[340px]" title="请完成安全验证">
    <SlideVerify
      ref="slideVerify"
      v-model:value="captchaVerification"
      @change="handleChange"
      @success="handleSuccess"
    />
  </Modal>
</template>
