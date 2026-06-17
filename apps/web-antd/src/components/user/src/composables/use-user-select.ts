import type { SysUserVO } from '#/api';
import type { UserFilterProps } from '#/components/user/src/type';

import type { MaybeRefOrGetter } from 'vue';

import { computed, ref, unref, toValue } from 'vue';

import { useDebounceFn } from '@vueuse/shared';

import { searchApi, selectUsersByIdsApi } from '#/api';

const DEFAULT_PAGE_SIZE = 20;

export function useUserSelect(
  filterOptions: MaybeRefOrGetter<UserFilterProps>,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const loading = ref(false);
  const searchKeyword = ref('');
  const optionMap = ref(new Map<string, SysUserVO>());
  let lastFetchId = 0;

  const options = computed(() => [...optionMap.value.values()]);

  function mergeOptions(users: SysUserVO[]) {
    const nextMap = new Map(optionMap.value);
    users.forEach((user) => {
      if (user.id) {
        nextMap.set(user.id, user);
      }
    });
    optionMap.value = nextMap;
  }

  async function fetchUsers(keyword?: null | string) {
    const keywordValue = keyword ?? '';
    searchKeyword.value = keywordValue;
    lastFetchId += 1;
    const fetchId = lastFetchId;
    loading.value = true;

    try {
      const filter = toValue(filterOptions);
      const res = await searchApi(
        keywordValue,
        filter.range ?? 'all',
        filter.deptId,
        {
          current: 1,
          pageSize,
        },
        filter.roleCode,
      );
      if (fetchId !== lastFetchId) {
        return;
      }
      mergeOptions(res.records ?? []);
    } catch (error) {
      console.error('获取用户数据失败，', error);
    } finally {
      if (fetchId === lastFetchId) {
        loading.value = false;
      }
    }
  }

  const debouncedFetchUsers = useDebounceFn(fetchUsers, 300);

  async function resolveLabels(ids?: Array<string> | string) {
    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      return;
    }

    lastFetchId += 1;
    const fetchId = lastFetchId;
    loading.value = true;

    try {
      const users = await selectUsersByIdsApi(ids);
      if (fetchId !== lastFetchId) {
        return;
      }
      mergeOptions(users);
    } catch (error) {
      console.error('回显用户数据失败，', error);
    } finally {
      if (fetchId === lastFetchId) {
        loading.value = false;
      }
    }
  }

  function getUserById(id: string) {
    return unref(optionMap).get(id);
  }

  return {
    debouncedFetchUsers,
    fetchUsers,
    getUserById,
    loading,
    mergeOptions,
    options,
    resolveLabels,
    searchKeyword,
  };
}
