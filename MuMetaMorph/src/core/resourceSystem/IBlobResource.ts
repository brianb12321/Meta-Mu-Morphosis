/**
 * Represents a file or byte-stream stored in a resource-store.
 */
export interface IBlobResource {
    fileName: string;
    blobData: Blob;
}