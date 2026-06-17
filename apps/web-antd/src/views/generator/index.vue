<script setup lang="ts">
import type { WizardGeneratorConfig } from '#/api';

import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Step, Steps } from 'ant-design-vue';

import {
  STEP_META,
  useGeneratorWizard,
} from './composables/use-generator-wizard';
import BasicsConfig from './components/basics-config.vue';
import Finish from './components/finish.vue';
import ImportAndExportConfig from './components/import-and-export-config.vue';
import InputConfig from './components/input-config.vue';
import ListConfig from './components/list-config.vue';

const {
  clearDraft,
  current,
  currentStepKey,
  dictTypeSelectModelArray,
  generatorConfig,
  goToStep,
  handleStepNext,
  handleStepPrev,
  updateConfig,
  visibleSteps,
} = useGeneratorWizard();

const stepItems = computed(() =>
  visibleSteps.value.map((key) => ({
    key,
    ...STEP_META[key],
  })),
);

function handleStepChange(index: number) {
  goToStep(index);
}
</script>

<template>
  <Page content-class="generator">
    <Card :bordered="false">
      <Steps :current="current" @change="handleStepChange">
        <Step
          v-for="item in stepItems"
          :key="item.key"
          :description="item.description"
          :title="item.title"
        />
      </Steps>
      <div class="step-content mt-8">
        <BasicsConfig
          v-if="currentStepKey === 'basics'"
          :generator-config="generatorConfig as WizardGeneratorConfig"
          @next="handleStepNext"
          @update-config="updateConfig"
        />

        <ListConfig
          v-if="currentStepKey === 'list'"
          :dict-type-options="dictTypeSelectModelArray"
          :generator-config="generatorConfig as WizardGeneratorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <InputConfig
          v-if="currentStepKey === 'input'"
          :dict-type-options="dictTypeSelectModelArray"
          :generator-config="generatorConfig as WizardGeneratorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <ImportAndExportConfig
          v-if="currentStepKey === 'importExport'"
          :dict-type-options="dictTypeSelectModelArray"
          :generator-config="generatorConfig as WizardGeneratorConfig"
          @next="handleStepNext"
          @prev="handleStepPrev"
          @update-config="updateConfig"
        />

        <Finish
          v-if="currentStepKey === 'finish'"
          :generator-config="generatorConfig as WizardGeneratorConfig"
          @prev="handleStepPrev"
          @success="clearDraft"
        />
      </div>
    </Card>
  </Page>
</template>

<style lang="scss">
@use './style/generator' as *;
</style>
