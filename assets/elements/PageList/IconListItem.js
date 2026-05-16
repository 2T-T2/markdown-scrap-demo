import CSSStyleSheetCommon from "./CSSStyleSheetCommon.js"
import icon from "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=link_2" with {type: "css"}

const STYLE_TITLE = "page-list-icon-title";
const STYLE_ICON = "page-list-icon";

export default class IconListItem extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = ["title", "href"];

    constructor() {
        super();
    }

    get title() { return this.getAttribute("title"); }
    set title(v) { this.setAttribute("title", v); }
    get href() { return this.getAttribute("href"); }
    set href(v) { this.setAttribute("href", v); }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        const title = this.title;
        const href = this.href ? this.href : `#${this.title}`;

        shadow.innerHTML = `
            <li>
                <a href="${href}">
                    <div class="${STYLE_ICON}">
                        <span class="${STYLE_TITLE}">${title}</span>
                        <span class="material-symbols-outlined">link_2</span>
                    </div>
                </a>
            </li>
            <style>
                .${STYLE_ICON} {
                    background-color: #bbc;
                    color: #fff;
                    container-type: inline-size;
                    flex-direction: column;
                    align-items: center;
                    display: flex;
                }
                .${STYLE_ICON}:hover {
                    background-color: #aaf;
                }
                .${STYLE_ICON} .material-symbols-outlined {
                    font-variation-settings: 'opsz' 64 !important;
                    font-size: 85cqi !important;
                    color: #fff !important;
                }
            </style>
        `;
        this.shadowRoot.adoptedStyleSheets = [CSSStyleSheetCommon, icon];
    }

    /**
     * 要素が文書から削除されるたびに呼び出されます。
     */
    disconnectedCallback() {}

    /**
     * Element.moveBefore() によって DOM 内の別の場所に移動されるたびに呼び出されます。
     */
    connectedMoveCallback() {}

    /**
     * 要素が新しい文書に移動されるたびに呼び出されます。
     */
    adoptedCallback() {}

    /**
     * 属性が変更、追加、削除、置換されたときに呼び出されます。
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;   // 値の変更がない場合は、描画更新なし
        if (!this.shadowRoot) return;       // まだシャドーが生成されてない(domに未追加の)場合は、そっちで描画内容が生成されるのでスキップ

        if (name == "title") {
            this.shadowRoot.querySelector(`.${STYLE_TITLE}`).textContent = this.title;
            if (!this.href)
                this.shadowRoot.querySelector("a").href = `#${this.title}`;
            return;
        }

        if (name == "href") {
            this.shadowRoot.querySelector("a").href = `${this.href}`;
            return;
        }
    }
}