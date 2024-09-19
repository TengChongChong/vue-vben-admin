import type { SelectModel } from '#/api/base/model/selectModel';
import type { SysDict } from '#/api/sys/model/sysDictModel';

import { isString } from '@vben/utils';

import { useDictStore } from '#/store';

const dictStore = useDictStore();

/**
 * 根据字典类别获取 SelectModel[]
 *
 * @param dictType 字典类别
 */
export function getSelectModelArray(dictType: string): SelectModel[] {
  const dictArray: SysDict[] = dictStore.selectDictArray(dictType);
  const options: SelectModel[] = [];
  dictArray.forEach((item) => {
    options.push({
      label: item.name,
      value: item.code,
    });
  });
  return options;
}

/**
 * 处理传入的value，统一转为string
 *
 * @param propValue 传入的字典编码
 */
export function convertSingleValue(
  propValue: boolean | null | number | string | undefined,
): string {
  if (propValue === null || propValue === undefined) {
    return undefined;
  }
  return isString(propValue) ? propValue : propValue.toString();
}

/**
 * 处理传入的value，统一转为string类型数组
 *
 * @param propValue 传入的字典编码数组
 */
export function convertArrayValue(
  propValue: Array<boolean> | Array<number> | Array<string>,
): Array<string> {
  const value: string[] = [];
  if (propValue === null || propValue === undefined || propValue.length === 0) {
    return value;
  }
  propValue.forEach((item) => {
    value.push(convertSingleValue(item));
  });
  return value;
}
