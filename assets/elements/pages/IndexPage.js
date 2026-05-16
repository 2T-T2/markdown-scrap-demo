import PageListItem from "./../PageList/PageListItem.js";
import PageList from "./../PageList/PageList.js";
import CSSStyleSheetCommon from "./CSSStyleSheetCommon.js";

/**
 * @typedef {"title" | "updated" | "created"} SortBy
 */

/**
 * @typedef {import("../../../types/MetaData").MetaData} MetaData
 */

export default class IndexPage extends HTMLElement {
    /** 変更を感知したい属性 */
    static get observedAttributes() { return ["sortby"]; }

    constructor() {
        super();
        this._pages = null;
    }

    /** @returns {SortBy} */
    get sortby() { return this.getAttribute("sortby"); }
    /** @param {SortBy} v */
    set sortby(v) { this.setAttribute("sortby", v); }

    /**
     * @param {object.<string, MetaData>} metadata
     */
    init(metadata) {
        this._pages = new PageList()
        for (const key in metadata) {
            /** @type {MetaData} */
            const meta = metadata[key];
            if (meta.created < 0) continue;
            this._pages.append((() => {
                const item = new PageListItem();
                item.title = key;
                item.preview = meta.content;
                item.updated = meta.updated;
                item.created = meta.created;
                return item;
            })())
        }
        if (this.shadowRoot) this.shadowRoot.replaceChildren(this._pages);
    }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `
            <h2>記事一覧</h2>
            <div style="display: flex; justify-content: flex-end;">
                <label for="sortby-select">並び替え：</label>
                <select id="sortby-select" name="sortby">
                    <option value="created">作成日</option>
                    <option value="updated">更新日</option>
                    <option value="title">タイトル</option>
                </select>
            <div>
            <style>
                select[name="sortby"] {
                    appearance: none;
                    min-width: 200px;
                    height: 1.4em;
                    border: none;
                    border-bottom: 2px solid var(--border-color);
                    font-size: 1em;
                    cursor: pointer;
                }

                select[name="sortby"]:focus {
                    outline: none;
                }
            </style>
        `;
        if (this._pages) shadow.append(this._pages);
        this._sort = (e) => {
            this.sortby = e.target.value;
        };
        shadow.querySelector('select[name="sortby"]').addEventListener("change", this._sort);
        shadow.adoptedStyleSheets = [CSSStyleSheetCommon];
    }

    /**
     * 要素が文書から削除されるたびに呼び出されます。
     */
    disconnectedCallback() {
        this.shadowRoot.querySelector('select[name="sortby"]')?.removeEventListener("change", this._sort);
    }

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
        if (name == "sortby") {
            /** @type {[PageListItem]} */
            const fn = {
                "title"   : (a ,b) => { return a.title.localeCompare(b.title) },
                "created" : (a ,b) => { return a.created - b.created },
                "updated" : (a ,b) => { return a.updated - b.updated },
            }
            const sorted = [...this._pages.children].filter(it=>{return (it instanceof PageListItem)});
            for (const page of sorted.sort(fn[this.sortby])) {
                page.remove();
                this._pages.append(page);
            }
        }

        if (!this.shadowRoot) return;       // まだシャドーが生成されてない(domに未追加の)場合は、そっちで描画内容が生成されるのでスキップ
    }
}
