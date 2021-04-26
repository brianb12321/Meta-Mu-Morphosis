import { MMMConfigurationDatabase } from "../configuration/indexDb/MMMConfigurationDatabase";
import { ILogger } from "../logging/ILogger";
import { IResourceManager } from "./IResourceManager";
import { Resource, ResourceType } from "./Resource";
import { injectable } from "tsyringe";

@injectable()
export class ResourceManager implements IResourceManager {
    constructor(private logger: ILogger, private db: MMMConfigurationDatabase) {

    }
    async addResource(resource: Resource): Promise<Resource> {
        let id = await this.db.resource.add(resource);
        return await this.getResource(id);
    }
    async deleteResource(resourceId: number): Promise<void> {
        await this.db.resource.delete(resourceId);
    }
    async getResource(resourceId: number): Promise<Resource> {
        this.db.resource.mapToClass(Resource);
        let resource = await this.db.resource.get(resourceId);
        if (resource == null) {
            throw Error(`Resource id ${resourceId} does not exist.`);
        }
        else return resource;
    }
    async getAllResources(): Promise<Resource[]> {
        this.db.resource.mapToClass(Resource);
        return await this.db.resource.toArray();
    }
    async getAllBlobResources(): Promise<Resource[]> {
        let resources = await this.getAllResources();
        return resources.filter(resource => resource.resourceType === ResourceType.Blob);
    }
    async getAllUrlResources(): Promise<Resource[]> {
        let resources = await this.getAllResources();
        return resources.filter(resource => resource.resourceType === ResourceType.Url);
    }
}