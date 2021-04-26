import { SongMetadata } from "./SongMetadata";

export interface ISong {
    songId?: number;
    name: string;
    artist: string;
    pluginsUsed: string[];
    listImageUrl?: string;
    bannerImageUrl?: string;
    audioStreamResourceId: number;
    dateAdded: Date;
    additionalMetadata?: SongMetadata[];
}