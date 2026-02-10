export interface JvmSpecInfo {
  name: string;
  vendor: string;
  version: string;
}

export interface JvmInfo extends JvmSpecInfo {
  info: string;
}

export type JavaSpecInfo = JvmSpecInfo;

export interface JavaInfo {
  vendor: string;
  vendorUrl: string;
  vendorURL: string;
  version: string;
}

export interface JavaRuntimeInfo {
  classPath: string;
  classVersion: string;
  endorsedDirs: string;
  extDirs: string;
  homeDir: string;
  libraryPath: string;
  name: string;
  protocolPackages: string;
  version: string;
}

export interface OsInfo {
  arch: string;
  fileSeparator: string;
  lineSeparator: string;
  name: string;
  pathSeparator: string;
  version: string;
}

export interface UserInfo {
  country: string;
  currentDir: string;
  homeDir: string;
  language: string;
  name: string;
  tempDir: string;
}

export interface HostInfo {
  address: string;
  name: string;
}

export interface RuntimeInfo {
  // 获得JVM已分配内存中的剩余空间，已分配内存中的剩余空间
  freeMemory: number;
  // 获得JVM最大内存，最大内存
  maxMemory: number;
  // 获得JVM已分配内存，已分配内存
  totalMemory: number;
  // 获得JVM最大可用内存，最大可用内存;
  usableMemory: number;
}
