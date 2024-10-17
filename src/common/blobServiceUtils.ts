import { clientEnv } from "@/env/client.mjs";

export const getBlobUrlByName = (blobName: string) => {
  const baseUrl = "https://namukilke.blob.core.windows.net";
  const storageName = clientEnv.NEXT_PUBLIC_AZURE_BLOB_CONTAINER_NAME;
  return `${baseUrl}/${storageName}/${blobName}`;
};
