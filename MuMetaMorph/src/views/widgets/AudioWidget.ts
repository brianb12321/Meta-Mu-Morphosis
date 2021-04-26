import { Widget } from "../../core/render/Widget";

//Represents the audio widget.
export class AudioWidget extends Widget {
    private audio: HTMLMediaElement;
    public get src(): string {
        return this.audio.src;
    }
    public get srcObject(): any {
        return this.audio.srcObject;
    }
    public set src(value: string) {
        this.audio.src = value;
    }
    public set srcObject(value: any) {
        this.audio.srcObject = value;
    }
    async play(): Promise<void> {
        await this.audio.play();
    }
    load(): void {
        this.audio.load();
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