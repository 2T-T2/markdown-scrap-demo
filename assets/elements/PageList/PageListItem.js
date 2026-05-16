import CSSStyleSheetCommon from "./CSSStyleSheetCommon.js"

const STYLE_TITLE = "page-list-title";
const STYLE_PREVIEW = "page-list-preview";
const STYLE_UPDATED = "page-list-updated"

/**
 * @param {string} v 
 */
function parseDate(v) {
    const a = parseInt(v);
    if (isNaN(a)) return v;
    return new Date(a).toLocaleDateString();
}

/**
 * Markdown文字列から記法を取り除き、プレーンテキストを抽出する
 * @param {string} markdown 
 * @returns {string}
 */
function stripMarkdown(markdown) {
    if (!markdown) return "";

    let text = markdown;

    // コードブロックの除去 (``` ... ```)
    text = text.replace(/```[\s\S]*?```/g, "");

    // インラインコードの除去 (`...`)
    text = text.replace(/`.*?`/g, "");

    // 画像記法の置換 (![alt](url) -> alt)
    text = text.replace(/!\[(.*?)\]\(.*?\)/g, "$1");

    // 標準リンク・Scrapbox風リンクの置換 ([text](url) または [text] -> text)
    text = text.replace(/\[(.*?)\](?:\(.*?\))?/g, "$1");

    // 見出し記号の除去 (# Title)
    text = text.replace(/^#+\s+/gm, "");

    // 強調、斜体、打ち消し線 (**, *, __, _, ~~)
    text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
    text = text.replace(/(\*|_)(.*?)\1/g, "$2");
    text = text.replace(/~~(.*?)~~/g, "$1");

    // 引用、リスト記号の除去 (>, *, -, +, 1.)
    text = text.replace(/^\s{0,3}(?:>|\*|-|\+|\d+\.)\s+/gm, "");

    // 水平線の除去 (---, ***, ___)
    text = text.replace(/^\s{0,3}(?:---|\*\*\*|___)\s*$/gm, "");

    // 余分な改行と空白の整理
    return text.trim();
}

export default class PageListItem extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = ["title", "updated", "created"];

    constructor() {
        super();
    }

    get visible() { return this.getAttribute("visible").toLocaleLowerCase() !== "false"; }
    set visible(v) { this.setAttribute("visible", String(v)); }

    get title() { return this.getAttribute("title"); }
    set title(v) { this.setAttribute("title", v); }
    set preview(v) {
        const plainText = stripMarkdown(v);
        if (!this.shadowRoot) {
            this._preview = plainText;
        } else {
            const previewEl = this.shadowRoot.querySelector(`.${STYLE_PREVIEW}`);
            if (previewEl) previewEl.textContent = plainText;
        }
    }
    get preview() {
        if (!this.shadowRoot) return this._preview || "";
        return this.shadowRoot.querySelector(`.${STYLE_PREVIEW}`)?.textContent || "";
    }
    get updated() { return this.getAttribute("updated"); }
    set updated(v) { this.setAttribute("updated", v); }
    get created() { return this.getAttribute("created"); }
    set created(v) { this.setAttribute("created", v); }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        const title = this.title;
        const updated = parseDate(this.updated);

        shadow.innerHTML = `
            <li>
                <a href="#${title}">
                    <span class="${STYLE_TITLE}">${title}</span>
                    <hr>
                    <p class="${STYLE_PREVIEW}">${this._preview || ""}</p>
                    <small class="${STYLE_UPDATED}">更新日: ${updated}</small>                
                </a>
            </li>
            <style>
                :host([visible="false"]) {
                    display: none !important;
                }

                /* タイトル */
                .${STYLE_TITLE} {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 8px;
                    display: block;
                }

                /* 区切り線 */
                li hr {
                    border: 0;
                    border-top: 1px solid #f0f0f0;
                    margin: 8px 0;
                }

                /* プレビューテキスト (CSSで省略制御) */
                .${STYLE_PREVIEW} {
                    font-size: 0.85rem;
                    color: var(--text-sub);
                    margin: 0 0 12px 0;
                    line-height: 1.5;
                    line-clamp: 4;

                    /* 4行で省略する設定 */
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* 更新日 */
                .${STYLE_UPDATED} {
                    font-size: 0.75rem;
                    color: #b2bec3;
                    margin-top: auto; /* 下寄せ配置 */
                }
            </style>
        `;
        this.shadowRoot.adoptedStyleSheets = [CSSStyleSheetCommon];
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
            this.shadowRoot.querySelector("a").href = this.title;
            this.shadowRoot.querySelector(`.${STYLE_TITLE}`).textContent = this.title;
            return;
        }

        if (name == "updated") {
            this.shadowRoot.querySelector(`.${STYLE_UPDATED}`).textContent = parseDate(this.updated);
        }

    }
}