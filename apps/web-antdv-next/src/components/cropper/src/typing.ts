import type Cropper from 'cropperjs';

export interface CropperEndResult {
  blob: Blob;
  imgBase64: string;
  imgInfo: Cropper.Data;
}

export type { Cropper };
