import type { SessionUser } from './user';

interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

type BasicUserInfo = SessionUser;

type ClassType = Array<object | string> | object | string;

export type {
  BasicOption,
  BasicUserInfo,
  ClassType,
  SelectOption,
  SessionUser,
  TabOption,
};
