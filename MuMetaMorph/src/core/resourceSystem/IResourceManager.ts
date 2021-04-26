import { Resource } from "./Resource";

export interface IResourceManager {
    addResource(resource: Resource): Promise<Resource>;
    getResource(resourceId: number): Promise<Resource>;
    deleteResource(resourceId: number): Promise<void>;
    getAllResources(): Promise<Resource[]>;
    getAllBlobResources(): Promise<Resource[]>;
    getAllUrlResources(): Promise<Resource[]>;
}