import { PluginBase } from "../pluginSystem/PluginBase";
import { ISong } from "./ISong";

/**
 * Manages the current playing song and manages the song database.
 */
export interface ISongManager {
    //Event that gets called when a song-switch request is made. The song player should subscribe to this event.
    songSwitched: (song: ISong) => void;
    addSong(song: ISong): Promise<ISong>
    switchSong(songId: number): Promise<void>;
    getSongs(): Promise<ISong[]>;
    getSongById(songId: number): Promise<ISong>;
    deleteSongById(songId: number): Promise<void>;
    putSong(songId: number, newSong: ISong): Promise<void>;
    songToJson(songId: number): Promise<string>;
    jsonToSong(jsonText: string): Promise<ISong>;
}