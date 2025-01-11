<script setup lang="ts">
import type { SmsVerificationCodeProps } from '../type';

import { SlideVerifyModal } from '#/components/verify';
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const {
  codeLength = 6,
  createText = async () => {},
  disabled = false,
  handleSendCode = async () => {},
  beforeSendCode = async () => true,
  loading = false,
  maxTime = 60,
} = defineProps<SmsVerificationCodeProps>();

const emit = defineEmits<{
  complete: [];
  sendError: [error: any];
}>();

const timer = ref<ReturnType<typeof setTimeout>>();

const modelValue = defineModel<string>();

const inputValue = ref<string[]>([]);
const countdown = ref(0);

const btnText = computed(() => {
  const countdownValue = countdown.value;
  return createText?.(countdownValue);
});

const btnLoading = computed(() => {
  return loading || countdown.value > 0;
});

watch(
  () => modelValue.value,
  () => {
    inputValue.value = modelValue.value?.split('') ?? [];
  },
);

watch(inputValue, (val) => {
  modelValue.value = val.join('');
});

// 验证码
let captchaVerification: null | string = null;

const [BaseSlideVerifyModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SlideVerifyModal,
});

function openVerifyModal() {
  baseModalApi.open();
}

function handleVerifySuccess(code: string) {
  captchaVerification = code;
  handleSend();
}

function handleComplete(e: string[]) {
  modelValue.value = e.join('');
  emit('complete');
}

/**
 * 发送短信验证码前检查
 *
 * @param e
 */
async function handleCheckSend(e: Event) {
  e?.preventDefault();
  const res = await beforeSendCode();
  res && openVerifyModal();
}

async function handleSend() {
  try {
    // 发送验证码，后端应二次验证 captchaVerification 后发送验证码
    await handleSendCode(captchaVerification);
    countdown.value = maxTime;
    startCountdown();
  } catch (error) {
    console.error('Failed to send code:', error);
    // Consider emitting an error event or showing a notification
    emit('sendError', error);
  }
}

function startCountdown() {
  if (countdown.value > 0) {
    timer.value = setTimeout(() => {
      countdown.value--;
      startCountdown();
    }, 1000);
  }
}

onBeforeUnmount(() => {
  countdown.value = 0;
  clearTimeout(timer.value);
});

const id = useId();
</script>

<template>
  <PinInput
    :id="id"
    v-model="inputValue"
    :disabled="disabled"
    class="flex w-full justify-between"
    otp
    placeholder="○"
    type="number"
    @complete="handleComplete"
  >
    <div class="relative flex w-full">
      <PinInputGroup class="mr-2">
        <PinInputInput
          v-for="(item, index) in codeLength"
          :key="item"
          :index="index"
        />
      </PinInputGroup>
      <VbenButton
        :disabled="disabled"
        :loading="btnLoading"
        class="flex-grow"
        size="lg"
        variant="outline"
        @click="handleCheckSend"
      >
        {{ btnText }}
      </VbenButton>
    </div>
  </PinInput>

  <!-- 滑块验证码 -->
  <BaseSlideVerifyModal @success="handleVerifySuccess" />
</template>
