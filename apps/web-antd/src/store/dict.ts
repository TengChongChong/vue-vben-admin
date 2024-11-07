import type {
  TableFilterModel,
  TempSelectModel,
  TreeSelectModel,
} from '#/api/base/model/select-model';
import type { SysDict, SysDictTree } from '#/api/sys/model/sys-dict-model';

import { listToTree } from '@vben/utils';

import { defineStore } from 'pinia';

import { selectAllApi } from '#/api/sys/sys-dict';

interface DictState {
  isLoading: boolean;
  dict: {
    [key: string]: SysDict[];
  };
}

export const useDictStore = defineStore('sys-dict', {
  state: (): DictState => ({
    isLoading: false,
    dict: {},
  }),
  getters: {
    /**
     * 根据字典类型获取字典数组
     */
    selectDictArray() {
      return (dictType: string): SysDict[] => {
        if (!dictType) {
          return [];
        }
        return this.dict[dictType] || [];
      };
    },
    /**
     * 根据字典类型获取字典数组
     */
    selectDictFilters() {
      return (dictType: string): TableFilterModel[] => {
        if (!dictType) {
          return [];
        }
        const dictArray: SysDict[] = this.dict[dictType] || [];
        const dictFilters: TableFilterModel[] = [] as TableFilterModel[];
        dictArray.forEach((item) => {
          dictFilters.push({
            text: item.name,
            value: item.code,
          });
        });
        return dictFilters || [];
      };
    },
    /**
     * 根据字典类型获取字典树，用于级联
     */
    selectDictTree() {
      return (dictType: string): SysDictTree[] => {
        if (!dictType) {
          return [] as SysDictTree[];
        }

        const dict = this.selectDictArray(dictType);
        return listToTree(dict, {
          id: 'code',
          children: 'children',
          pid: 'parentCode',
        }) as SysDictTree[];
      };
    },
    /**
     * 根据字典类型获取级联需要的数据
     */
    selectTree() {
      return (dictType: string): TreeSelectModel[] => {
        if (!dictType) {
          return [] as TreeSelectModel[];
        }

        const selectArray: TempSelectModel[] = [] as TempSelectModel[];

        this.selectDictArray(dictType).forEach((item: SysDict) => {
          const { code, parentCode, name } = item;
          selectArray.push({
            value: code,
            label: name,
            parentId: parentCode as string,
          });
        });

        return listToTree(selectArray, {
          id: 'value',
          pid: 'parentId',
          children: 'children',
        }) as TreeSelectModel[];
      };
    },

    getPath() {
      return (dictType: string, code: string): string[] => {
        const getParentPath = (
          array: any[],
          path: string[],
          code: string,
        ): string[] => {
          for (let i = 0; i < array.length; i++) {
            if (array[i].code === code) {
              if (array[i].parentCode) {
                path.push(array[i].parentCode);
                return getParentPath(array, path, array[i].parentCode);
              } else {
                return path;
              }
            }
          }
          return path;
        };

        if (!dictType || !code) {
          return [];
        }
        const dictArray = this.selectDictArray(dictType);

        return getParentPath(dictArray, [code], code).reverse();
      };
    },

    /**
     * 根据字典类型&和编码获取字典对象
     */
    getDict() {
      return (dictType: string, code: string): null | SysDict => {
        if (!dictType || !code) {
          return null;
        }
        const dictArray = this.selectDictArray(dictType);
        for (const element of dictArray) {
          if (element.code === code) {
            return element;
          }
        }
        return null;
      };
    },
  },
  actions: {
    setDict(dict: SysDict[]) {
      // 清空
      this.dict = {};
      dict.forEach((item) => {
        if (this.dict[item.dictType]) {
          this.dict[item.dictType]?.push(item);
        } else {
          this.dict[item.dictType] = [item];
        }
      });
      this.isLoading = false;
    },
    /**
     * 初始化字典缓存
     *
     * @param force 是否强制更新
     * @param callback 回调
     */
    initDict(force = false, callback = () => {}) {
      if (!force && (this.isLoading || Object.keys(this.dict).length > 0)) {
        // 已加载或加载中
        return;
      }
      this.isLoading = true;
      // 初始化字典数据
      selectAllApi().then((data) => {
        this.setDict(data);
        callback();
      });
    },
  },
});
