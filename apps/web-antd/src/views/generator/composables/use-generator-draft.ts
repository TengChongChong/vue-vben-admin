import type { WizardGeneratorConfig } from '#/api';

import { ref, watch } from 'vue';

import { Modal } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';

const DRAFT_KEY_PREFIX = 'generator-draft:';

function getDraftKey(config: WizardGeneratorConfig): string | null {
  const dataSource = config.basicsConfig?.dataSource;
  const table = config.basicsConfig?.table;
  if (!dataSource || !table) {
    return null;
  }
  return `${DRAFT_KEY_PREFIX}${dataSource}:${table}`;
}

export function useGeneratorDraft(generatorConfig: {
  value: WizardGeneratorConfig;
}) {
  const draftRestored = ref(false);

  function saveDraft() {
    const key = getDraftKey(generatorConfig.value);
    if (!key || !generatorConfig.value.basicsConfig) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(generatorConfig.value));
    } catch {
      // ignore quota errors
    }
  }

  const debouncedSave = useDebounceFn(saveDraft, 800);

  watch(
    generatorConfig,
    () => {
      debouncedSave();
    },
    { deep: true },
  );

  function tryRestoreDraft(onRestore: (draft: WizardGeneratorConfig) => void) {
    if (draftRestored.value) {
      return;
    }
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(DRAFT_KEY_PREFIX),
    );
    if (keys.length === 0) {
      return;
    }
    const latestKey = keys[keys.length - 1];
    if (!latestKey) {
      return;
    }
    try {
      const raw = localStorage.getItem(latestKey);
      if (!raw) {
        return;
      }
      const draft = JSON.parse(raw) as WizardGeneratorConfig;
      Modal.confirm({
        title: '发现未完成的生成配置',
        content: `是否恢复表「${draft.basicsConfig?.table ?? '-'}」的配置草稿？`,
        okText: '恢复',
        cancelText: '忽略',
        onOk: () => {
          draftRestored.value = true;
          onRestore(draft);
        },
        onCancel: () => {
          draftRestored.value = true;
        },
      });
    } catch {
      // ignore invalid draft
    }
  }

  function clearDraft() {
    const key = getDraftKey(generatorConfig.value);
    if (key) {
      localStorage.removeItem(key);
    }
  }

  return {
    clearDraft,
    tryRestoreDraft,
  };
}
