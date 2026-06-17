import type { FormType } from '../types/generator.data';

import type {
  BasicsConfigModel,
  GeneratorConfig,
  SelectModel,
  TableInfo,
  WizardGeneratorConfig,
} from '#/api';

import { computed, onMounted, ref, unref, watch } from 'vue';

import { message } from 'ant-design-vue';

import { selectAllSysDictTypeApi } from '#/api';
import { useDictStore } from '#/store';

import { useGeneratorDraft } from './use-generator-draft';
import { FORM_TYPE } from '../types/generator.data';
import {
  getVisibleSteps,
  pruneStaleConfigs,
  STEP_META,
  type StepKey,
} from '../util/generator-helpers';
import {
  getDefaultExport,
  getDefaultForm,
  getDefaultImport,
  getDefaultTable,
  toDictTypeArray,
} from '../util/util';

export { getVisibleSteps, STEP_META, type StepKey };

export function useGeneratorWizard() {
  const dictStore = useDictStore();
  const dictTypeSelectModelArray = ref<SelectModel[]>([]);
  const generatorConfig = ref<WizardGeneratorConfig>({
    tableInfo: undefined,
    basicsConfig: undefined,
  });
  const current = ref<number>(0);

  const visibleSteps = computed(() =>
    getVisibleSteps(generatorConfig.value.basicsConfig),
  );

  const currentStepKey = computed(
    () => visibleSteps.value[current.value] ?? 'basics',
  );

  const { clearDraft, tryRestoreDraft } = useGeneratorDraft(generatorConfig);

  function buildDictItemCountMap(): Record<string, number> {
    const map: Record<string, number> = {};
    dictTypeSelectModelArray.value.forEach((item) => {
      const dictType = item.value as string;
      map[dictType] = dictStore.selectDictArray(dictType).length;
    });
    return map;
  }

  onMounted(async () => {
    try {
      dictTypeSelectModelArray.value = await selectAllSysDictTypeApi();
    } catch {
      message.error('加载字典类型失败');
    }

    tryRestoreDraft((draft) => {
      generatorConfig.value = { ...draft };
      current.value = 0;
    });
  });

  watch(visibleSteps, (steps) => {
    const key = currentStepKey.value;
    const index = steps.indexOf(key);
    if (index === -1) {
      current.value = Math.max(0, steps.length - 1);
    } else {
      current.value = index;
    }
  });

  function updateConfig<K extends keyof GeneratorConfig>(
    property: K,
    config: GeneratorConfig[K],
  ) {
    const isChangeTable =
      property === 'tableInfo' &&
      unref(generatorConfig).tableInfo?.name !== (config as TableInfo).name;

    if (property === 'basicsConfig') {
      const basicsConfig = config as BasicsConfigModel;
      generatorConfig.value.basicsConfig = basicsConfig;
      pruneStaleConfigs(generatorConfig.value, basicsConfig);
      return;
    }

    generatorConfig.value[property] = config as WizardGeneratorConfig[K];
    if (isChangeTable) {
      setDefault();
    }
  }

  function setDefault() {
    const dictTypeArray = toDictTypeArray(unref(dictTypeSelectModelArray));
    const dictItemCountMap = buildDictItemCountMap();
    const tableInfo = unref(generatorConfig).tableInfo as TableInfo;
    generatorConfig.value.queryConfig = getDefaultForm(
      tableInfo,
      dictTypeArray,
      FORM_TYPE.QUERY as FormType,
    );
    generatorConfig.value.inputConfig = getDefaultForm(
      tableInfo,
      dictTypeArray,
      FORM_TYPE.INPUT as FormType,
      dictItemCountMap,
    );
    generatorConfig.value.tableConfig = getDefaultTable(
      tableInfo,
      dictTypeArray,
    );
    generatorConfig.value.exportConfig = getDefaultExport(
      tableInfo,
      dictTypeArray,
    );
    generatorConfig.value.importConfig = getDefaultImport(
      tableInfo,
      dictTypeArray,
    );
  }

  function handleStepPrev() {
    if (current.value > 0) {
      current.value--;
    }
  }

  function handleStepNext() {
    if (current.value < visibleSteps.value.length - 1) {
      current.value++;
    }
  }

  function goToStep(index: number) {
    if (index < 0 || index >= visibleSteps.value.length) {
      return;
    }
    if (index > current.value) {
      return;
    }
    current.value = index;
  }

  return {
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
  };
}
