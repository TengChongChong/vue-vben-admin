<script lang="ts" setup>
import { h, ref } from 'vue';

import { IconPicker, Page } from '@vben/common-ui';
import {
  MdiKeyboardEsc,
  SvgAvatar1Icon,
  SvgAvatar2Icon,
  SvgAvatar3Icon,
  SvgAvatar4Icon,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
  SvgGithubIcon,
  SvgGoogleIcon,
  SvgQQChatIcon,
  SvgWeChatIcon,
} from '@vben/icons';

import { Card, Input } from 'antdv-next';

const iconValue1 = ref('ph:trademark');
const iconValue2 = ref('svg:avatar-1');
const iconValue3 = ref('ph:alien');
const iconValue4 = ref('ph:books');

const inputComponent = h(Input);
const phosphorRegularExclude = [
  '-thin',
  '-light',
  '-bold',
  '-fill',
  '-duotone',
];
</script>

<template>
  <Page title="图标">
    <template #description>
      <div class="mt-2 text-foreground/80">
        图标可在
        <a
          class="text-primary"
          href="https://icon-sets.iconify.design/"
          target="_blank">
          Iconify
        </a>
        中查找。本系统菜单与业务图标统一使用
        <a
          class="text-primary"
          href="https://icon-sets.iconify.design/ph/?prefix=ph&icon=house"
          target="_blank">
          Phosphor Regular
        </a>
        （
        <code>ph:house</code>
        ）。
      </div>
    </template>

    <Card class="mb-5" title="Iconify">
      <div class="flex items-center gap-5">
        <SvgGithubIcon class="size-8" />
        <SvgGoogleIcon class="size-8" />
        <SvgQQChatIcon class="size-8" />
        <SvgWeChatIcon class="size-8" />
        <MdiKeyboardEsc class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Svg Icons">
      <div class="flex items-center gap-5">
        <SvgAvatar1Icon class="size-8" />
        <SvgAvatar2Icon class="size-8 text-red-500" />
        <SvgAvatar3Icon class="size-8 text-green-500" />
        <SvgAvatar4Icon class="size-8" />
        <SvgCakeIcon class="size-8" />
        <SvgBellIcon class="size-8" />
        <SvgCardIcon class="size-8" />
        <SvgDownloadIcon class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Tailwind CSS">
      <div class="flex items-center gap-5 text-3xl">
        <span class="icon-[ph--house]"></span>
        <span class="icon-[ph--book]"></span>
        <span class="icon-[ph--package]"></span>
        <span class="icon-[svg-spinners--wind-toy]"></span>
        <span class="icon-[svg-spinners--blocks-wave]"></span>
        <span class="icon-[ph--compass]"></span>
      </div>
    </Card>

    <Card class="mb-5" title="图标选择器">
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(Iconify):</span>
        <IconPicker
          v-model="iconValue1"
          class="w-[200px]"
          prefix="ph"
          :icon-exclude-suffixes="phosphorRegularExclude" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(svg):</span>
        <IconPicker v-model="iconValue2" class="w-[200px]" prefix="svg" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>自定义Input:</span>
        <IconPicker
          :input-component="inputComponent"
          v-model="iconValue3"
          icon-slot="addonAfter"
          model-value-prop="value"
          prefix="ph"
          :icon-exclude-suffixes="phosphorRegularExclude" />
      </div>
      <div class="flex items-center gap-5">
        <span>显示为一个Icon:</span>
        <Input
          v-model:value="iconValue4"
          allow-clear
          placeholder="点击这里选择图标"
          style="width: 300px">
          <template #addonAfter>
            <IconPicker
              v-model="iconValue4"
              prefix="ph"
              :icon-exclude-suffixes="phosphorRegularExclude"
              type="icon" />
          </template>
        </Input>
      </div>
    </Card>
  </Page>
</template>
