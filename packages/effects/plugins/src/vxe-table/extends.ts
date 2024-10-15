import type { VxeGridProps, VxeUIExport } from 'vxe-table';

import type { VxeGridApi } from './api';

import { isFunction } from '@vben/utils';

import dayjs from 'dayjs';

export function extendProxyOptions(
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Record<string, any>,
) {
  [
    'query',
    'querySuccess',
    'queryError',
    'queryAll',
    'queryAllSuccess',
    'queryAllError',
  ].forEach((key) => {
    extendProxyOption(key, api, options, getFormValues);
  });
}

function extendProxyOption(
  key: string,
  api: VxeGridApi,
  options: VxeGridProps,
  getFormValues: () => Record<string, any>,
) {
  const { proxyConfig } = options;
  const configFn = (proxyConfig?.ajax as any)?.[key];
  if (!isFunction(configFn)) {
    return options;
  }

  const wrapperFn = async (params: any, _formValues: any, ...args: any[]) => {
    const formValues = getFormValues();
    // 将page转为后端要求的结构
    const { page, sort } = params;
    params.page = {
      current: page.currentPage,
      pageSize: page.pageSize,
      sortField: sort.field,
      sortOrder: sort.order,
    };
    return await configFn(params, formValues, ...args);
  };
  api.setState({
    gridOptions: {
      proxyConfig: {
        ajax: {
          [key]: wrapperFn,
        },
      },
    },
  });
}

export function extendsDefaultFormatter(vxeUI: VxeUIExport) {
  vxeUI.formats.add('formatDate', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
  });
}
