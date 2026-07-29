import type { BasicsConfigModel, WizardGeneratorConfig } from '#/api';

import {
  needGeneratorExport,
  needGeneratorImport,
  needGeneratorImportOrExport,
  needGeneratorInput,
  needGeneratorList,
} from '../util/util';

export type StepKey = 'basics' | 'finish' | 'importExport' | 'input' | 'list';

export const STEP_META: Record<
  StepKey,
  { description: string; title: string }
> = {
  basics: { title: '基本信息', description: '基本信息设置' },
  list: { title: '列表页面', description: '查询条件与表格排序' },
  input: { title: '详情页面', description: '录入页面组件排序' },
  importExport: { title: '导入&导出', description: '导入及导出字段排序' },
  finish: { title: '完成', description: '生成文件' },
};

export function getVisibleSteps(basicsConfig?: BasicsConfigModel): StepKey[] {
  const steps: StepKey[] = ['basics'];
  if (basicsConfig && needGeneratorList(basicsConfig)) {
    steps.push('list');
  }
  if (basicsConfig && needGeneratorInput(basicsConfig)) {
    steps.push('input');
  }
  if (basicsConfig && needGeneratorImportOrExport(basicsConfig)) {
    steps.push('importExport');
  }
  steps.push('finish');
  return steps;
}

export function pruneStaleConfigs(
  config: WizardGeneratorConfig,
  basicsConfig: BasicsConfigModel,
) {
  if (!needGeneratorList(basicsConfig)) {
    config.queryConfig = undefined;
    config.tableConfig = undefined;
  }
  if (!needGeneratorInput(basicsConfig)) {
    config.inputConfig = undefined;
  }
  if (!needGeneratorImport(basicsConfig)) {
    config.importConfig = undefined;
  }
  if (!needGeneratorExport(basicsConfig)) {
    config.exportConfig = undefined;
  }
}

export function hasFieldConfigs(config?: WizardGeneratorConfig): boolean {
  if (!config) {
    return false;
  }
  return !!(
    config.queryConfig?.length ||
    config.tableConfig?.length ||
    config.inputConfig?.length ||
    config.importConfig?.length ||
    config.exportConfig?.length
  );
}

export function extractApiErrorMessage(error: unknown): string {
  const err = error as {
    message?: string;
    response?: {
      data?: { errorMessage?: string; message?: string; msg?: string };
    };
  };
  return (
    err?.response?.data?.errorMessage ||
    err?.response?.data?.message ||
    err?.response?.data?.msg ||
    err?.message ||
    '操作失败，请稍后重试'
  );
}

export interface GroupedFilePaths {
  backend: string[];
  frontendTs: string[];
  frontendVue: string[];
  other: string[];
}

export function groupGeneratorFilePaths(paths: string[]): GroupedFilePaths {
  const grouped: GroupedFilePaths = {
    backend: [],
    frontendVue: [],
    frontendTs: [],
    other: [],
  };
  paths.forEach((path) => {
    if (path.endsWith('.java') || path.endsWith('.xml')) {
      grouped.backend.push(path);
    } else if (path.endsWith('.vue')) {
      grouped.frontendVue.push(path);
    } else if (path.endsWith('.ts')) {
      grouped.frontendTs.push(path);
    } else {
      grouped.other.push(path);
    }
  });
  return grouped;
}
