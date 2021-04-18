import { Widget } from "../../core/render/Widget";

//Represents the audio widget.
export class AudioWidget extends Widget {
    private _src: string = "";
    private audio: HTMLMediaElement;
    public get src(): string {
        return this._src;
    }
    public set src(value: string) {
        this._src = value;
        this.audio.src = this._src;
    }
    async play(): Promise<void> {
        await this.audio.play();
    }
    constructor() {
        super();
        this.audio = document.createElement("audio");
        this.renderBody = this.audio;
        this.audio.controls = true;
    }

    shouldRender(): boolean {
        return true;
    }
}