import fs from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs"

export interface MediaStorageProvider {
  upload: (destinationPath: string, data: Buffer) => Promise<{ url: string }>;
}

const localStoragePath = "public/media";

const localStorageProvider: MediaStorageProvider = {
  upload: async (destinationPath, data) => {
    const outputPath = path.join(localStoragePath, destinationPath);
    const dirname = path.dirname(outputPath);

    await fs.mkdir(dirname, { recursive: true });
    await fs.writeFile(outputPath, data);
    return { url: `/media/${destinationPath}` };
  },
};

export const getImageMimeType = (data: Buffer) => {
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "image/jpeg";
  } else if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) {
    return "image/png";
  } else if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) {
    return "image/gif";
  } else if (data[0] === 0x42 && data[1] === 0x4d) {
    return "image/bmp";
  } else {
    return "application/octet-stream";
  }
}

const blobStorageProvider: MediaStorageProvider = {
  upload: async function (destinationPath: string, data: Buffer) {
    const store = getStore(process.env.BLOB_STORE_NAME ?? '');

    // Upload the image data to the S3 bucket
    await store.set(destinationPath, data, {
      metadata: {
        mimeType: getImageMimeType(data),
      }
    });

    return {
      url: `/images?key=${encodeURIComponent(destinationPath)}`,
    };
  },
};

const defaultStorageProvider = process.env.BLOB_STORE_NAME
  ? blobStorageProvider
  : localStorageProvider;
export const media = defaultStorageProvider;
