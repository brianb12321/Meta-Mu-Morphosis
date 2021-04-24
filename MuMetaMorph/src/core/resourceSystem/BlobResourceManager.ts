import { IBlobResourceManager } from "./IBlobResourceManager";
import { IBlobResource } from "./IBlobResource";
import { MMMConfigurationDatabase } from "../configuration/indexDb/MMMConfigurationDatabase";
import { ILogger } from "../logging/ILogger";

export class BlobResourceManager implements IBlobResourceManager {
    constructor(private logger: ILogger, private db: MMMConfigurationDatabase) {

    }
    async addBlobResource(blobResource: IBlobResource): Promise<void> {
        await this.db.blob.add(blobResource);
    }
    async getBlobResource(blobId: number): Promise<IBlobResource> {
        return await this.db.blob.get(blobId);
    }
}