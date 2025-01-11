<script setup lang="ts">
import { removeApi } from '#/api/sys/sys-dict';
import {
  ButtonAdd,
  ButtonCancel,
  ButtonEdit,
  ButtonExport,
  ButtonImport,
  ButtonInfo,
  ButtonRemove,
  ButtonReset,
  ButtonSave,
  ButtonSubmit,
} from '#/components/button';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, Divider, Row, Space } from 'ant-design-vue';
import { defineComponent } from 'vue';

defineComponent({
  name: 'SampleCompButtonIndex',
});

function handleRemoveSuccess(id: string | string[]) {
  console.log('remove success', id);
}
function handleRemoveFail(id: string | string[]) {
  console.log('remove fail', id);
}
</script>

<template>
  <Page>
    <Row :gutter="16">
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="基础按钮">
          <div class="prose mb-6">
            <h3>主按钮</h3>
            <Space :wrap="true">
              <Button type="primary"> 主按钮 </Button>
              <Button disabled type="primary"> 禁用 </Button>
              <Button danger type="primary"> 危险 </Button>
              <Button loading type="primary"> loading </Button>
              <Button type="link"> link </Button>
              <Button loading type="link"> loading link </Button>
              <Button disabled type="link"> disabled link </Button>
            </Space>
          </div>

          <div class="prose mb-6">
            <h3>默认按钮</h3>
            <Space :wrap="true">
              <Button type="default"> 默认 </Button>
              <Button disabled type="default"> 禁用 </Button>
              <Button danger type="default"> 危险 </Button>
              <Button loading type="default"> loading </Button>
              <Button type="link"> link </Button>
              <Button loading type="link"> loading link </Button>
              <Button disabled type="link"> disabled link </Button>
            </Space>
          </div>

          <div class="prose mb-6">
            <h3>虚线按钮</h3>
            <Space :wrap="true">
              <Button type="dashed"> dashed </Button>
              <Button disabled type="dashed"> 禁用 </Button>
              <Button danger type="dashed"> 危险 </Button>
              <Button loading type="dashed"> loading </Button>
            </Space>
          </div>

          <div class="prose mb-6">
            <h3>幽灵按钮</h3>
            <p>常规幽灵按钮通常用于有色背景下</p>
            <div class="bg-gray-400 px-2 py-2">
              <Space :wrap="true">
                <Button ghost type="primary"> 幽灵主要 </Button>
                <Button ghost type="default"> 幽灵默认 </Button>
                <Button ghost type="dashed"> 幽灵dashed </Button>
                <Button disabled ghost type="primary"> 禁用 </Button>
                <Button ghost loading type="primary"> loading </Button>
              </Space>
            </div>
          </div>
        </Card>
      </Col>
      <Col :xl="24" :xxl="12">
        <Card :bordered="false" class="mb-4" title="常用按钮 - 默认尺寸">
          <Space :wrap="true">
            <ButtonAdd />
            <ButtonCancel />
            <ButtonEdit />
            <ButtonExport />
            <ButtonImport import-code="xxx" />
            <ButtonInfo />
            <ButtonRemove
              :id="['xxx']"
              :api="removeApi"
              @fail="handleRemoveFail"
              @success="handleRemoveSuccess"
            />
            <ButtonReset />
            <ButtonSave />
            <ButtonSubmit />
          </Space>
        </Card>
        <Card :bordered="false" title="常用按钮 - 表格操作列">
          <Space :wrap="true">
            <ButtonAdd size="small" type="link" />
            <Divider type="vertical" />
            <ButtonCancel size="small" type="link" />
            <Divider type="vertical" />
            <ButtonEdit size="small" type="link" />
            <Divider type="vertical" />
            <ButtonExport size="small" type="link" />
            <Divider type="vertical" />
            <ButtonImport import-code="xxx" size="small" type="link" />
            <Divider type="vertical" />
            <ButtonInfo size="small" type="link" />
            <Divider type="vertical" />
            <ButtonRemove
              :id="['xxx']"
              :api="removeApi"
              size="small"
              type="link"
              @fail="handleRemoveFail"
              @success="handleRemoveSuccess"
            />
            <Divider type="vertical" />
            <ButtonReset size="small" type="link" />
            <Divider type="vertical" />
            <ButtonSave size="small" type="link" />
            <Divider type="vertical" />
            <ButtonSubmit size="small" type="link" />
          </Space>
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped></style>
