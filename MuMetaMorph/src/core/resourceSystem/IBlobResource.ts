/**
 * Represents a file or byte-stream stored in a resource-store.
 */
export interface IBlobResource {
    blobId?: number;
    blobName: string;
    blobType: BlobType;
    blobData: Blob;
}
export enum BlobType {
    Image, Song
}