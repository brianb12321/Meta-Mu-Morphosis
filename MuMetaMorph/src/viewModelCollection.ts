/* Add any view-model bindings here.

1. Add any symbols necessary for the IOC container to resolve the view-model.
2. Create a factory method that will resolve the symbol defined in step 1 to a view model, because
   views should not access the dependency injection system directly. We decouple the view from the container.
*/

import { container } from "tsyringe";
import { AddNewSongViewModel } from "./views/viewModels/AddNewSongViewModel";
import { MainViewModel } from "./views/viewModels/MainViewModel";
import { MusicDetailsViewModel } from "./views/viewModels/MusicDetailsViewModel";
import { MusicViewModel } from "./views/viewModels/MusicViewModel";
import { NavigationBarViewModel } from "./views/viewModels/NavigationBarViewModel";
import { PlayerViewModel } from "./views/viewModels/PlayerViewModel";

export const TMainViewModel = Symbol("MainViewModel");
export function getMainViewModel(): MainViewModel {
    let value: MainViewModel = container.resolve(TMainViewModel);
    return value;
};
export const TMusicViewModel = Symbol("MusicViewModel");
export function getMusicViewModel(): MusicViewModel {
    let value: MusicViewModel = container.resolve(TMusicViewModel);
    return value;
};
export const TNavigationBarViewModel = Symbol("NavigationBarViewModel");
export function getNavigationBarViewModel(): NavigationBarViewModel {
    let value: NavigationBarViewModel = container.resolve(TNavigationBarViewModel);
    return value;
};
export const TPlayerViewModel = Symbol("TPlayerViewModel");
export function getPlayerViewModel(): PlayerViewModel {
    let value: PlayerViewModel = container.resolve(TPlayerViewModel);
    return value;
};
export const TAddNewSongViewModel = Symbol("AddNewSongViewModel");
export function getAddNewSongViewModel(): AddNewSongViewModel {
    let value: AddNewSongViewModel = container.resolve(TAddNewSongViewModel);
    return value;
};
export const TMusicDetailsViewModel = Symbol("MusicDetailsViewModel");
export function getMusicDetailsViewModel(): MusicDetailsViewModel {
    let value: MusicDetailsViewModel = container.resolve(TMusicDetailsViewModel);
    return value;
};

export function addViewModels(): void {
    container.registerType(TMainViewModel, MainViewModel);
    container.registerType(TMusicViewModel, MusicViewModel);
    container.registerType(TNavigationBarViewModel, NavigationBarViewModel);
    container.registerType(TPlayerViewModel, PlayerViewModel);
    container.registerType(TAddNewSongViewModel, AddNewSongViewModel);
    container.registerType(TMusicDetailsViewModel, MusicDetailsViewModel);
}