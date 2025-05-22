import type { SelectModel } from '#/api/base/model/select-model';
import type {
  GenerateDictEnumResponse,
  GeneratorConfig,
  QueryDataTableParams,
  TableInfo,
} from '#/api/generator/model/generatorModel';

import { requestClient } from '#/api/request';
// base url
const BASE_URL = '/auth/generator';

/**
 * 获取表
 */
export function selectTableApi(params: QueryDataTableParams) {
  return requestClient.get<SelectModel[]>(`${BASE_URL}/table`, {
    params,
  });
}

/**
 * 获取表详情
 *
 * @param dataSource 数据源
 * @param tableName 表名
 */
export function getTableInfoApi(dataSource: string, tableName: string) {
  return requestClient.get<TableInfo>(`${BASE_URL}/table/info`, {
    params: {
      dataSource,
      tableName,
    },
  });
}

/**
 * 查询项目中模块
 */
export function selectModulesApi() {
  return requestClient.get<SelectModel[]>(`${BASE_URL}/modules`);
}

/**
 * 生成代码
 *
 * @param generatorConfig 生成配置
 */
export function generateApi(generatorConfig: GeneratorConfig) {
  return requestClient.post<boolean>(BASE_URL, generatorConfig);
}

/**
 * 根据字典生辰 Enum
 *
 * @param dictType 字典类型
 * @return Enum
 */
export function generateDictEnumApi(dictType: string) {
  return requestClient.get<GenerateDictEnumResponse>(
    `${BASE_URL}/generate/dict/enum`,
    {
      params: { dictType },
    },
  );
}
