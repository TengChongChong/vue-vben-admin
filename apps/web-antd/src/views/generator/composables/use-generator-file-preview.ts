import type { GeneratorConfig, WizardGeneratorConfig } from '#/api';

import { computed, type Ref } from 'vue';

import { getGeneratorFilePreviewPaths } from '../util/util';

export function useGeneratorFilePreview(
  generatorConfig: Ref<GeneratorConfig | WizardGeneratorConfig>,
) {
  const generatorFileArray = computed(() => {
    const basicsConfig = generatorConfig.value?.basicsConfig;
    if (!basicsConfig) {
      return [];
    }
    return getGeneratorFilePreviewPaths(basicsConfig);
  });

  return { generatorFileArray };
}
