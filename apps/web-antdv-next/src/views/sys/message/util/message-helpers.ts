/**
 * 消毒消息 HTML 内容，移除脚本与危险属性
 */
export function sanitizeMessageHtml(html?: string) {
  if (!html) {
    return '';
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed').forEach((node) => {
    node.remove();
  });
  doc.querySelectorAll('*').forEach((node) => {
    for (const attr of [...node.attributes]) {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.trim().toLowerCase();
      if (attrName.startsWith('on')) {
        node.removeAttribute(attr.name);
      }
      if (
        ['href', 'src', 'xlink:href'].includes(attrName) &&
        attrValue.startsWith('javascript:')
      ) {
        node.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}
