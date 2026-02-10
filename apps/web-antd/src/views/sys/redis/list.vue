<script setup lang="ts">
import { computed, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import {
  Alert,
  Button,
  Card,
  Empty,
  Menu,
  MenuItem,
  Spin,
  Tooltip,
} from 'ant-design-vue';

import { getSysRedisApi, selectByPrefixApi } from '#/api';
import { useDictStore } from '#/store';

import InfoModal from './info.vue';

const dictStore = useDictStore();
const redisPrefix = computed(() => {
  return dictStore.selectDictArray('redisPrefix');
});

const currentSelectedKeys = ref<string[]>([]);
const loading = ref(false);
const keys = ref<string[]>([]);

function handleMenuClick({ key }) {
  reload(key);
}

async function reload(key) {
  keys.value = [];
  loading.value = true;
  try {
    if (!key) {
      key = currentSelectedKeys.value[0];
    }
    await selectByPrefixApi(key).then((res) => {
      keys.value = res;
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const [BaseInfoModal, baseInfoModalApi] = useVbenModal({
  connectedComponent: InfoModal,
});

async function handleInfo(key: string) {
  await getSysRedisApi(key).then((res) => {
    baseInfoModalApi.setData(res);
    baseInfoModalApi.open();
  });
}
</script>

<template>
  <Page>
    <div class="flex flex-wrap">
      <div class="w-[460px]">
        <Card :bordered="false" title="Key前缀">
          <Menu
            v-model:selected-keys="currentSelectedKeys"
            :border="false"
            @click="handleMenuClick"
          >
            <MenuItem v-for="item in redisPrefix" :key="item.code">
              {{ item.name }}
            </MenuItem>
          </Menu>
        </Card>
      </div>
      <div class="flex-1 pl-4" style="min-width: 500px">
        <Card :bordered="false" title="Keys">
          <Alert
            v-if="currentSelectedKeys.length === 0"
            banner
            message="请选择左侧Key前缀"
            type="info"
          />

          <Empty
            v-if="
              currentSelectedKeys.length > 0 && keys.length === 0 && !loading
            "
          />

          <Spin :spinning="loading">
            <div class="flex flex-wrap">
              <div
                v-for="item in keys"
                :key="item"
                class="p-2 lg:w-1/2 xl:w-1/3"
              >
                <Tooltip :title="item">
                  <Button block type="primary" @click="handleInfo(item)">
                    {{ item }}
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Spin>
        </Card>
      </div>
    </div>

    <!--  详情  -->
    <BaseInfoModal @success="reload" />
  </Page>
</template>

<style lang="scss" scoped>
.ant-menu {
  border-inline-end: 0 !important;
}
</style>
