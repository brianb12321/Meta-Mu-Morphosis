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
    constructor() {
        super();
        this.audio = document.createElement("audio");
        this.renderBody = this.audio;
        this.onRender = async () => {
            this.audio.controls = true;
            this.audio.src = this._src;
        }
    }

    shouldRender(): boolean {
        return true;
    }
}