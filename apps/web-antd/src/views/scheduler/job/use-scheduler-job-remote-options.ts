import type { SchedulerJobMethodOption, SelectModel } from '#/api';

import { ref } from 'vue';

import { message } from 'ant-design-vue';

import {
  selectSchedulerJobBeansApi,
  selectSchedulerJobMethodsApi,
} from '#/api';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL = 60 * 1000;

export function useSchedulerJobRemoteOptions() {
  const beanOptions = ref<SelectModel[]>([]);
  const methodOptions = ref<SchedulerJobMethodOption[]>([]);
  const methodRequestId = ref(0);

  const beanCache = new Map<string, CacheEntry<SelectModel[]>>();
  const methodCache = new Map<string, CacheEntry<SchedulerJobMethodOption[]>>();

  function getCachedData<T>(cache: Map<string, CacheEntry<T>>, key: string) {
    const cached = cache.get(key);
    if (!cached) {
      return null;
    }
    if (cached.expiresAt < Date.now()) {
      cache.delete(key);
      return null;
    }
    return cached.data;
  }

  function setCachedData<T>(
    cache: Map<string, CacheEntry<T>>,
    key: string,
    data: T,
  ) {
    cache.set(key, {
      data,
      expiresAt: Date.now() + CACHE_TTL,
    });
  }

  async function loadBeanOptions(keyword = '') {
    const cacheKey = keyword.trim();
    const cached = getCachedData(beanCache, cacheKey);
    if (cached) {
      beanOptions.value = cached;
      return;
    }
    try {
      const data = await selectSchedulerJobBeansApi(cacheKey);
      beanOptions.value = data;
      setCachedData(beanCache, cacheKey, data);
    } catch {
      beanOptions.value = [];
      message.error('加载Bean列表失败，请稍后重试');
    }
  }

  async function loadMethodOptions(bean: string) {
    const requestId = ++methodRequestId.value;
    const beanKey = bean?.trim() ?? '';
    if (!beanKey) {
      if (requestId === methodRequestId.value) {
        methodOptions.value = [];
      }
      return;
    }

    const cached = getCachedData(methodCache, beanKey);
    if (cached) {
      if (requestId === methodRequestId.value) {
        methodOptions.value = cached;
      }
      return;
    }

    try {
      const data = await selectSchedulerJobMethodsApi(beanKey);
      if (requestId === methodRequestId.value) {
        methodOptions.value = data;
      }
      setCachedData(methodCache, beanKey, data);
    } catch {
      if (requestId === methodRequestId.value) {
        methodOptions.value = [];
      }
      message.error('加载方法列表失败，请稍后重试');
    }
  }

  function clearMethodOptions() {
    methodOptions.value = [];
  }

  function clearAllOptions() {
    beanOptions.value = [];
    methodOptions.value = [];
  }

  return {
    beanOptions,
    clearAllOptions,
    clearMethodOptions,
    loadBeanOptions,
    loadMethodOptions,
    methodOptions,
  };
}
