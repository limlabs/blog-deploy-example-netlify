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

const blobStorageProvider: MediaStorageProvider = {
  upload: async function (destinationPath: string, data: Buffer) {
    const store = getStore(process.env.BLOB_STORE_NAME ?? '');

    // Upload the image data to the S3 bucket
    await store.set(destinationPath, data);

    return {
      url: `/media/${destinationPath}`,
    };
  },
};

const defaultStorageProvider = process.env.BLOB_STORE_NAME
  ? blobStorageProvider
  : localStorageProvider;
export const media = defaultStorageProvider;
