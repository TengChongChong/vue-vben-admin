import { DictTag } from '#/components/dict';
import { h } from 'vue';

export function renderDictTag(dictType: string, code: string) {
  return h(DictTag, {
    dictType,
    code,
  });
}
