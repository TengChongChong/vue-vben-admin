import type { SessionUser } from './user';

interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

type BasicUserInfo = SessionUser;

export type {
  BasicOption,
  BasicUserInfo,
  SelectOption,
  SessionUser,
  TabOption,
};
