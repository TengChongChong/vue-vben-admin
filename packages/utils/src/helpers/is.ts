export {
  isArguments,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBuffer,
  isElement,
  isEqualWith,
  isError,
  isFinite,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNative,
  isNil,
  isNull,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isSymbol,
  isTypedArray,
  isWeakMap,
  isWeakSet,
} from 'lodash-es';
const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return val !== undefined;
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return !isDef(val) || val === null;
}

export function isBlank(str: null | string | undefined) {
  return isNullOrUnDef(str) || str === '';
}

export function isNotBlank(str: null | string | undefined) {
  return !isBlank(str);
}

// TODO 此处 isArray 存在歧义
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;
