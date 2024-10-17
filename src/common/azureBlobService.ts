import {
  BlobClient,
  BlobDownloadResponseParsed,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";

class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  /**
   * Create a AzureBlobService either for server-side or client-side use.
   * If you pass in client-side credential, then only read methods will be available,
   * assuming your client SAS token's permissions are configured correctly.
   */
  constructor(
    SERVER_AZURE_BLOB_SAS_URL: string,
    AZURE_BLOB_CONTAINER_NAME: string,
  ) {
    this.blobServiceClient = new BlobServiceClient(SERVER_AZURE_BLOB_SAS_URL);
    this.containerClient = this.blobServiceClient.getContainerClient(
      AZURE_BLOB_CONTAINER_NAME,
    );
  }

  public async getBlob(blobName: string): Promise<Blob | undefined> {
    const blobClient: BlobClient = this.containerClient.getBlobClient(blobName);
    const blobResult: BlobDownloadResponseParsed = await blobClient.download();
    const body = blobResult.blobBody;
    return body;
  }

  /**
   * Uploads the given file to Azure Blob Storage
   * @param file The file to be uplaoded
   * @param blobName Azure blob name
   */
  public async uploadFileToBlob(file: File, blobName: string) {
    const containerClient = this.containerClient;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const options = { blobHTTPHeaders: { blobContentType: file.type } };
    const data = await file.arrayBuffer();
    await blobClient.upload(data, file.size, options);
  }
}

export default AzureBlobService;
