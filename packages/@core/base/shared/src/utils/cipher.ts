import Base64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

// Define an interface for encryption
// 定义一个加密器的接口
export interface Encryption {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}
// Define an interface for Hashing
// 定义一个哈希算法的接口
export interface Hashing {
  hash(data: string): string;
}

// Define a singleton class for Base64 encryption
class Base64Encryption implements Encryption {
  private static instance: Encryption;

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption();
    }
    return Base64Encryption.instance;
  }

  decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
  }

  encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64);
  }
}

// Define a singleton class for MD5 Hashing
class MD5Hashing implements Hashing {
  private static instance: Hashing;

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): MD5Hashing {
    if (!MD5Hashing.instance) {
      MD5Hashing.instance = new MD5Hashing();
    }
    return MD5Hashing.instance;
  }

  hash(plainText: string) {
    return MD5(plainText).toString();
  }
}

// Define a singleton class for SHA256 Hashing
class SHA256Hashing implements Hashing {
  private static instance: Hashing;

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA256Hashing.instance) {
      SHA256Hashing.instance = new SHA256Hashing();
    }
    return SHA256Hashing.instance;
  }

  hash(plainText: string) {
    return SHA256(plainText).toString();
  }
}

// Define a singleton class for SHA512 Hashing
class SHA512Hashing implements Hashing {
  private static instance: Hashing;

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA512Hashing.instance) {
      SHA512Hashing.instance = new SHA512Hashing();
    }
    return SHA512Hashing.instance;
  }

  hash(plainText: string) {
    return SHA512(plainText).toString();
  }
}

class EncryptionFactory {
  public static createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance();
  }
}

class HashingFactory {
  public static createMD5Hashing(): Hashing {
    return MD5Hashing.getInstance();
  }

  public static createSHA256Hashing(): Hashing {
    return SHA256Hashing.getInstance();
  }

  public static createSHA512Hashing(): Hashing {
    return SHA512Hashing.getInstance();
  }
}

export { EncryptionFactory, HashingFactory };
