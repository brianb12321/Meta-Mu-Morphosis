import { View } from "../core/render/View";
import { getAboutViewModel } from "../viewModelCollection";
import { AboutViewModel } from "./viewModels/AboutViewModel";
import { HtmlWidget } from "./widgets/HtmlWidget";

export class AboutView extends View<AboutViewModel> {

    constructor() {
        super();
        this.dataContext = getAboutViewModel();
        let bodyWidget = new HtmlWidget("main", "");
        //I am creating the html-inline this way, so I get syntax highlighting.
        bodyWidget.element.innerHTML = `
<h1>About Mu-Meta-Morph</h1>
<h2>Why is it called that?</h2>
<p>
    The name Mu-Meta-Morph is a conglomeration of many word-plays. The name Mu-Meta-Morph can be divided into three sections:
</p>
<ol>
    <li>Mu (μ) is the greek letter representing the phonetic sound of "M." Because the phonetic sound of μ is closely related to the root of muse and music, Mu is shorthand for music.</li>
    <li>
        Meta means "self-describing". The words metadata, for example, has meta as its root, because metadata describes data.
        In Mu-Meta-Morph, the music entered into the system can be self-described and self-contained. Any data you wish to store about a particular song can be stored in the database and queried later by a user or plugin.
    </li>
    <li>
        Morph means "change." An object that morphs can change its appearance dynamically. With its dynamic plugin-system, Mu-Meta-Morph is always evolving.
        Almost any component can be swapped at any time.
    </li>
</ol>
<p>In essence, Mu-Meta-Morph can be stated as "A self-contained music player and database that change and evolve."</p>
<h2>Doesn't Mu-Meta-Morph sound weird for a music player?</h2>
<p>
    Not really, I have seen projects that have pretty strange names, like HALion, Citra, Voicemeeter Potato Edition, and so on.
</p>
<h2>Isn't a server-side solution better? I mean, anybody could just edit the source-code.</h2>
<p>
    True for most cases, but Mu-Meta-Morph is suppose to emulate a desktop PWA. I am not too considered about local security, because anybody could crack local software.
    People have found ways to pirate Word, get dark-mode in Unity for free, unlock VMWare Workstation for free, and pirate Windows. My program is no exception. Besides, it is open-source.
    If you wanted to see the source-code, just go to GitHub!
</p>
<h2>Isn't a 3 MB or more download size bad for a website?</h2>
<p>
    You are downloading an entire program! Your browser will cache the javascript file anyways, so there isn't much concern for large downloads.
    Besides, CNN downloads a crap ton of pictures, and people access it every day.
</p>
<h2>Does JAWS or NVDA work with this?</h2>
<p>
    For the most part, yes. Certain semantic elements needs to be improved like the plugin list and button tabs. Aria-annotations will be coming soon.
    When you navigate pages, your screen-reader, unfortunately, will not notify you of page transitions. This will be resolved soon.
</p>
<h2>My browser is acting super weird! What browsers are supported</h2>
<p>
    If your using a "modern" browser, Mu-Meta-Morph should work! certain features will not work in Internet Explorer 8 or below.
</p>
<h2>Why aren't you using JQuery?</h2>
<p>The HTML DOM isn't terribly hard to manipulate natively. Most DOM manipulations are abstracted away anyways through the HtmlWidget.</p>
<h2>I clicked on a button, but nothing happened.</h2>
<p>First, make sure your now dreaming. Second, check the debug console and report it to the GitHub issue tracker.</p>
<h2>What is the license?</h2>
<p>GPLv3</p>
`;
        bodyWidget.element.classList.add("main");
        this.renderBody = bodyWidget.renderBody;
    }
    shouldRender(): boolean {
        return true;
    }
}