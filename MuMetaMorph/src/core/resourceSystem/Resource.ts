import { IBlobResource } from "./IBlobResource";

export class Resource {
    resourceId?: number;
    resourceName: string;
    resourceType: ResourceType;
    resourcePurpose: ResourcePurpose;
    resourceBody: any;
    getBlob(): IBlobResource {
        return this.resourceBody as IBlobResource;
    }
}

export enum ResourceType {
    Blob, Url
}

export enum ResourcePurpose {
    Image, Song
}