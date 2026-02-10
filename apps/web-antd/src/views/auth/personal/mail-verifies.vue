<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Result, Spin } from 'ant-design-vue';

import { verifiesEmailApi } from '#/api';

const { currentRoute } = useRouter();

const { code } = unref(currentRoute).params;
const errorMessage = ref<string>();
const result = ref<boolean>(false);
const loading = ref<boolean>(true);

onMounted(async () => {
  await verifiesEmailApi(code)
    .then(() => {
      result.value = true;
    })
    .catch((error) => {
      errorMessage.value = error.response.data.errorMessage;
    });
  loading.value = false;
});
</script>

<template>
  <Page>
    <Spin :spinning="loading">
      <Result
        :status="loading ? 'info' : result ? 'success' : 'error'"
        :sub-title="
          loading
            ? '请稍候...'
            : result
              ? '验证邮箱成功，你可以使用邮箱进行登录或找回密码'
              : errorMessage || '验证失败，请重试'
        "
        :title="loading ? '验证中...' : result ? '验证成功' : '验证失败'"
      >
        <template v-if="!loading" #extra>
          <Button href="/" type="primary"> 登录 </Button>
        </template>
      </Result>
    </Spin>
  </Page>
</template>
