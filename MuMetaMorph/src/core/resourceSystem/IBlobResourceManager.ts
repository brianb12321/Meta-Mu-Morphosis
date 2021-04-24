import { IBlobResource } from "./IBlobResource";

export interface IBlobResourceManager {
    addBlobResource(blobResource: IBlobResource): Promise<void>;
    getBlobResource(blobId: number): Promise<IBlobResource>;
}