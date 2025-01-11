<script lang="ts">
import { Page, VbenCountToAnimator } from '@vben/common-ui';
import { Card } from 'ant-design-vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Page,
    Card,
    CardGrid: Card.Grid,
    VbenCountToAnimator,
  },
});
</script>
<template>
  <Page title="数字动画示例">
    <Card :bordered="false" title="数字动画示例">
      <CardGrid class="count-to-demo-card">
        <VbenCountToAnimator
          :duration="8000"
          :end-val="200000"
          :start-val="1"
          color="#409EFF"
          prefix="$"
        />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <VbenCountToAnimator
          :decimals="2"
          :duration="6000"
          :end-val="300000"
          :start-val="1"
          color="red"
          suffix="$"
        />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <VbenCountToAnimator
          :duration="7000"
          :end-val="400000"
          :start-val="1"
          color="rgb(0,238,0)"
          suffix="$"
        />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <VbenCountToAnimator
          :duration="8000"
          :end-val="500000"
          :start-val="10000"
          color="rgba(138,43,226,.6)"
          separator="-"
        />
      </CardGrid>
    </Card>
  </Page>
</template>
<style lang="less" scoped>
.count-to-demo {
  &-card {
    width: 50%;
    font-size: 30px;
    text-align: center;
  }
}
</style>
