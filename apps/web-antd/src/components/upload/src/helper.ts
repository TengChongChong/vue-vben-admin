import type { FileInfo } from '#/api/file/model/fileInfoModel';
import type { UploadFileModel } from '#/components/upload/src/type';

/**
 * 将UploadFile[]转为FileInfo[]
 *
 * @param fileList 文件[]
 */
export function convertToFileInfoArray(
  fileList: UploadFileModel[],
): FileInfo[] {
  const fileInfoList: FileInfo[] = [];
  if (fileList && fileList.length > 0) {
    fileList.forEach((file) => {
      fileInfoList.push(convertToFileInfo(file));
    });
  }
  return fileInfoList;
}

export function convertToFileInfo(uploadFileModel: UploadFileModel): FileInfo {
  return {
    ...uploadFileModel.response.data,
    status: uploadFileModel.status,
  } as FileInfo;
}

/**
 * 将FileInfo[]转为UploadFileModel[]
 *
 * @param fileList 文件[]
 */
export function convertToUploadFileModelArray(
  fileList: FileInfo[],
): UploadFileModel[] {
  const uploadFileList: UploadFileModel[] = [];
  if (fileList && fileList.length > 0) {
    fileList.forEach((file) => {
      uploadFileList.push(convertToUploadFile(file));
    });
  }
  return uploadFileList;
}

export function convertToUploadFile(fileInfo: FileInfo): UploadFileModel {
  const { id, originalFilename, filename } = fileInfo;

  return {
    uid: id,
    name: originalFilename,
    fileName: filename,
    ...fileInfo,
  } as UploadFileModel;
}
