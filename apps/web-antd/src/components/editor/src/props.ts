import { BubbleMenuItem, CustomMenu, MenuGroup } from 'aieditor';

export interface EditorProps {
  class?: any;
  height?: number | string;
  width?: number | string;
  value?: string;
  showImageUpload?: boolean;
  toolbarKeys?: (CustomMenu | MenuGroup | string)[];
  draggable?: boolean;
  textSelectionBubbleMenu?: {
    elementTagName?: string;
    enable?: boolean;
    items?: (BubbleMenuItem | string)[];
  };
}
