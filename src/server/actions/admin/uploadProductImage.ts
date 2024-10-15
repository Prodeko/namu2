"use server";

import { v4 as uuidv4 } from "uuid";

import AzureBlobService from "@/common/azureBlobService";
import { serverEnv } from "@/env/server.mjs";

export const uploadProductImageAction = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    const serviceUrl = serverEnv.SERVER_AZURE_BLOB_SAS_URL;
    const containerName = serverEnv.AZURE_BLOB_CONTAINER_NAME;

    if (!serviceUrl) throw new Error("Missing azure blob service url");
    if (!containerName) throw new Error("Missing azure blob container name");

    const blobService = new AzureBlobService(serviceUrl, containerName);
    const blobName = generateFileName(file);
    await blobService.uploadFileToBlob(file, blobName);
    return { blobName };
  } catch (error: any) {
    return { error: error?.message };
  }
};

const generateFileName = (file: File) => {
  const fileType = file.type.split("/")[1];
  return `product-${uuidv4()}.${fileType}`;
};