import type { RawEditorSettings } from 'tinymce';

export interface TinymceProps {
  class?: any;
  options?: RawEditorSettings;
  toolbar?: string[];
  plugins?: string[];
  height?: number | string;
  width?: number | string;
  // value
  value?: string;
  showImageUpload?: boolean;
}
