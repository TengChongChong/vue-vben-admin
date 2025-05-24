<script lang="ts" setup>
import type { GenerateDictEnumResponse } from '#/api/generator/model/generatorModel';

import { ref } from 'vue';
import Prism from 'vue-prism-component';

import { useVbenModal } from '@vben/common-ui';

import { useClipboard } from '@vueuse/core';
import { Alert, Button, message, Space } from 'ant-design-vue';

import { ButtonClose } from '#/components/button';
import { Divider } from '#/components/divider';
import { LucideCopy } from '#/components/icons';

import 'prismjs';
// 引入 Java 语法支持
import 'prismjs/components/prism-java.min.js';

// 暗色主题
import 'prismjs/themes/prism-tomorrow.css';

const generateDictEnumResponse = ref<GenerateDictEnumResponse>();

const { copy } = useClipboard();

function handleCopy(text) {
  copy(text);
  message.success('复制成功');
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const data = modalApi.getData<
        Record<string, any>
      >() as GenerateDictEnumResponse;
      generateDictEnumResponse.value = data;
    }
  },
});
</script>
<template>
  <Modal class="w-[1400px]" title="Enum">
    <div class="grid grid-cols-2 gap-2" v-if="generateDictEnumResponse">
      <div class="relative">
        <Divider
          :text="`Java Enum - ${generateDictEnumResponse.javaFileName}.java`"
          :show-hr="false"
        />
        <Prism language="java">{{ generateDictEnumResponse.javaCode }}</Prism>
        <div class="absolute right-2 top-8">
          <Button
            size="small"
            @click="handleCopy(generateDictEnumResponse.javaCode)"
            type="primary"
          >
            <template #icon> <LucideCopy /> </template>
            复制
          </Button>
        </div>
      </div>
      <div class="relative">
        <Divider
          :text="`JavaScript Enum - /src/enums/${generateDictEnumResponse.jsFileName}.ts`"
          :show-hr="false"
        />
        <Prism language="js">{{ generateDictEnumResponse.jsCode }}</Prism>
        <div class="absolute right-2 top-8">
          <Button
            size="small"
            @click="handleCopy(generateDictEnumResponse.jsCode)"
            type="primary"
          >
            <template #icon> <LucideCopy /> </template>
            复制
          </Button>
        </div>
      </div>
    </div>

    <template #footer>
      <Space>
        <Alert
          type="info"
          message="如字典编码使用数字，请自行调整枚举内容"
          banner
        />

        <ButtonClose @click="modalApi.close()" />
      </Space>
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.language-java,
.language-js {
  border-radius: var(--radius);
}
</style>
