# MuMetaMorph
[![Firebase Web Application](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://mu-meta-morph.web.app/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

MuMetaMorph is a fully client-side music and playlist manager.
## Where did you get its name?
* Mu - A play-on-word for music.
* Meta - All your music is self-contained and self-describing. MMM is a comprehensive database for any music knowledge you so choose to store.
* Morph - MMM is an evolving program. It is fully modular with its bundling and packaging architecture. Based off the suckless methodology, MMM uses Webpack to package all core functionality and plugins into one easy-to-manage Javascript file.

# Images
> **NOTE**: All images and music are royalty free

![Song Page](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/SongPage.PNG)
![Song Playing](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/SongPlaying.PNG)
![Create Song](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/AddSong.PNG)
![Upload Song](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/UploadMusic.PNG)
![Home Page](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/HomePage.PNG)
![About Page](https://github.com/brianb12321/MuMetaMorph/raw/master/Images/AboutPage.PNG)

## Building
If you modified MMM or wish to manually build, follow the following steps:
1. Change to `package.json` directory.
2. Download all necessary packages from NPM:
```
$ npm install
```
3. Run the build-script.
```
::For Windows, run:
> npm run build
#For Linux, run:
$ npm run build-sh
```
4. Webpack will generate a `MMM-all-bundle.min.js` file in the wwwroot/dist folder. Reference the JS file in `index.html` for your webserver.
5. To run the included webserver:
```
$ dotnet build
$ dotnet run
```
## Running VSCode Live Server
If you are running VSCode live server, please update your `Settings.json` webserver root path to the `wwwroot` directory.
## Theme not loading
If the default theme is not loading, please edit the global default theme variables in `src/defaults.ts` for your specific webserver and delete the database.
## Demo Site
A demo site with default plugins can be found at https://mu-meta-morph.web.app
## Next Steps
I will be converting this project into an Angular application called Neo-MuMetaMorph
