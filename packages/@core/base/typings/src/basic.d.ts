import type { SessionUser } from './user';

interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

type BasicUserInfo = SessionUser;

type ClassType =
  | Array<ClassType>
  | boolean
  | null
  | object
  | string
  | undefined;

export type {
  BasicOption,
  BasicUserInfo,
  ClassType,
  SelectOption,
  SessionUser,
  TabOption,
};
