<script lang="ts" setup>
import type { DragVerifyActionType, MoveData } from '../typing';

import type { CaptchaVO } from '#/api/sys/model/sysCaptchaModel';

import { reactive, ref, unref, watch } from 'vue';

import { EncryptionFactory } from '@vben/utils';

import { ReloadOutlined } from '@ant-design/icons-vue';
import { Button, Spin } from 'ant-design-vue';

import { checkCaptchaApi, getCaptchaApi } from '#/api/sys/sysCaptcha';

import BaseDragVerify from './drag-verify.vue';

const emit = defineEmits(['success', 'change', 'update:value']);
// 拖动条
const basicRef = ref<DragVerifyActionType>();
// 验证码数据
const captchaVO = ref<CaptchaVO>();

// 验证码尺寸
const captchaSize = {
  width: 310,
  height: 155,
};

const state = reactive({
  loading: true,
  showTip: false,
  captcha: {},
  isPassing: false,
  text: '加载中...',
  left: 0,
  imgStyle: {},
  startTime: 0,
  endTime: 0,
  time: 0,
});

watch(
  () => state.isPassing,
  (isPassing) => {
    emit('change', isPassing);
    emit('update:value', captchaVO.value.captchaVerification);
    if (isPassing) {
      const { startTime, endTime } = state;
      state.time = (endTime - startTime) / 1000;
      emit('success', { isPassing, time: state.time });
    }
  },
);

/**
 * 请求背景图片和验证图片
 */
async function initCaptcha() {
  state.loading = true;
  state.text = '加载中...';
  try {
    captchaVO.value = await getCaptchaApi();
  } catch (error) {
    console.error('获取验证码失败：', error);
  } finally {
    state.loading = false;
    state.text = '向右拖动滑块填充拼图';
  }
}

initCaptcha();

/**
 * 刷新
 */
function handleRefresh() {
  state.showTip = false;
  const basicEl = unref(basicRef);
  if (!basicEl) {
    return;
  }
  state.imgStyle = {};
  state.left = 0;
  state.isPassing = false;
  initCaptcha();
  basicEl.resume();
}

function handleStart() {
  state.startTime = Date.now();
}

/**
 * 拖动
 *
 * @param data
 */
function handleDragBarMove(data: MoveData) {
  const moveX = Math.min(Math.max(data.moveX, 0), captchaSize.width - 40);
  state.imgStyle = {
    left: `${moveX}px`,
  };
  state.left = moveX;
}

/**
 * 拖动结束
 */
async function handleDragEnd() {
  let pointJson = JSON.stringify({ x: state.left, y: 5 });
  if (captchaVO.value.secretKey) {
    // 坐标加密
    const encryption = EncryptionFactory.createAesEncryption({
      key: captchaVO.value.secretKey,
    });
    pointJson = encryption.encrypt(pointJson);
  }

  try {
    await checkCaptchaApi(
      {
        token: captchaVO.value.token,
        pointJson,
      },
      'none',
    ).then((res) => {
      if (captchaVO.value) {
        captchaVO.value.captchaVerification = res.captchaVerification;
      }
    });

    state.endTime = Date.now();
    state.isPassing = true;
  } catch {
    state.isPassing = false;
    setTimeout(() => {
      handleRefresh();
    }, 1000);
  } finally {
    state.showTip = true;
  }
}
</script>

<template>
  <div class="verify-slide">
    <div class="verify-slide-originals">
      <Button class="btn-refresh" type="link" @click="handleRefresh">
        <template #icon>
          <ReloadOutlined />
        </template>
      </Button>

      <Spin :spinning="state.loading">
        <!-- 占位 -->
        <div
          v-if="state.loading"
          :style="{
            width: `${captchaSize.width}px`,
            height: `${captchaSize.height}px`,
          }"
        ></div>
      </Spin>

      <img
        v-if="!state.loading"
        :src="`data:image/png;base64,${captchaVO.originalImageBase64}`"
        alt="背景"
      />

      <div
        v-if="!state.loading"
        :style="state.imgStyle"
        class="verify-slide-originals-slider"
      >
        <img
          :src="`data:image/png;base64,${captchaVO.jigsawImageBase64}`"
          alt="滑块"
        />
      </div>

      <span
        v-if="state.showTip"
        :class="[state.isPassing ? 'success' : 'error']"
        class="verify-slide-originals-img__tip"
      >
        {{
          state.isPassing
            ? `验证成功，耗时${state.time.toFixed(1)}秒！`
            : '验证失败！'
        }}
      </span>
    </div>
    <BaseDragVerify
      ref="basicRef"
      v-model:value="state.isPassing"
      :is-slot="true"
      :text="state.text"
      :width="310"
      success-text=""
      @end="handleDragEnd"
      @move="handleDragBarMove"
      @start="handleStart"
    />
  </div>
</template>
<style lang="scss">
.verify-slide {
  width: 310px;

  &-originals {
    position: relative;
    margin-bottom: 10px;

    .btn-refresh {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
    }

    img {
      width: 100%;
      height: 155px;
      display: block;
    }

    > img {
      width: 310px;
    }

    &-slider {
      position: absolute;
      top: 0;
      left: 0;
    }

    &-img__tip {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      display: block;
      width: 100%;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      color: #fff;
      text-align: center;

      &.success {
        background-color: hsl(var(--success));
      }

      &.error {
        background-color: hsl(var(--warning));
      }

      &.normal {
        background-color: rgb(0 0 0 / 30%);
      }
    }
  }
}
</style>
