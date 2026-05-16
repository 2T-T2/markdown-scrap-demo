import PageListItem from "./../PageList/PageListItem.js";
import IconListItem from "./../PageList/IconListItem.js";
import PageList from "./../PageList/PageList.js";

/**
 * @typedef {import("../../../types/MetaData").MetaData} MetaData
 */

const FORM_NAME = "filter";
const QUERY_NAME = "query";
const MODE_NAME = "mode";
const ID_OUTBOUND = "outbound";
const ID_RELATED = "related";

export default class Related extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = [];

    constructor() {
        super();
        /** @type {PageList} */
        this._outboundPageList = null;
        /** @type {[PageList]} */
        this._relatedPageLists = null;
    }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `
            <nav>
                <form onsubmit="return false;" name="${FORM_NAME}">
                    <input type="radio" name="${MODE_NAME}" value="title" checked />タイトル検索
                    <input type="radio" name="${MODE_NAME}" value="content" />全文検索
                    <input type="text" name="${QUERY_NAME}" placeholder="Filter..." />
                </form>
                <section id="${ID_OUTBOUND}"></section>
                <section id="${ID_RELATED}"></section>
            </nav>
            <style>
                nav form[name="${FORM_NAME}"] {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    background: #eee;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                }

                nav input[type="text"] {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    outline: none;
                }

                nav input[type="text"]:focus {
                    border-color: var(--accent-color);
                }
            </style>
        `;
        // 発リンクリスト
        if (this._outboundPageList) {
            const outbound = shadow.querySelector(`#${ID_OUTBOUND}`);
            outbound.append(this._outboundPageList)
        }
        // 関連記事リスト
        if (this._relatedPageLists) {
            const related = shadow.querySelector(`#${ID_RELATED}`);
            for (const relatedPageList of this._relatedPageLists) {
                related.append(relatedPageList);
            }
        }

        /** @type {HTMLFormElement} */
        const form = shadow.querySelector(`nav form[name="${FORM_NAME}"]`);
        const query = shadow.querySelector(`nav input[type="text"]`);

        this._onFilter = this._filterList(form).bind(this);

        form.addEventListener("change", this._onFilter);
        query.addEventListener("input", this._onFilter);
    }

    /**
     * 要素が文書から削除されるたびに呼び出されます。
     */
    disconnectedCallback() {
        this.shadowRoot.querySelector(`nav form[name="${FORM_NAME}"]`)?.addEventListener("change", this._onFilter);
        this.shadowRoot.querySelector(`nav input[type="text"]`)?.removeEventListener("input", this._onFilter);
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
    attributeChangedCallback(name, oldValue, newValue) {}

    /**
     * 表示更新処理
     * 指定されたページを基準として関連記事情報を更新します。
     * js からのみ行うことが出来る。
     * 
     * @param {string} page 関連記事の基準ページ名
     * @param {object.<string, MetaData>} metadata
     */
    update(page, metadata) {
        /**
         * 発リンク表示の更新
         * @type {MetaData}
         */
        const meta = metadata[page];    // 基準ページのメタデータを取得する

        if (this.shadowRoot) {
            this.shadowRoot.querySelector(`#${ID_OUTBOUND}`).innerHTML = "";
            this.shadowRoot.querySelector(`#${ID_RELATED}`).innerHTML = "";
        }

        if (!meta) {
            return;  // 基準ページのデータが取得できなかった場合、関連記事はなしで更新
        }

        if (this.shadowRoot) {
            this.shadowRoot.querySelector(`#${ID_OUTBOUND}`).innerHTML = "Now Loading...";
            this.shadowRoot.querySelector(`#${ID_RELATED}`).innerHTML  = "Now Loading...";
        }

        // 発リンク記事の更新
        this._outboundPageList = new PageList();
        this._outboundPageList.append((() => {
            const item = new IconListItem();
            item.title = "Link!";
            item.href = "#";
            return item;
        })());
        for (const link of meta.links) {
            const m = metadata[link];
            if (m.created < 0) continue;    // ページが作成されてないリンクはリストに追加しない
            this._outboundPageList.append((() => {
                const item = new PageListItem();
                item.title = link;
                item.preview = m.content;
                item.updated = m.updated;
                item.created = m.created;
                return item;
            })());
        }

        // 関連記事の更新
        const seen = new Set(); // 表示済みアイテムの多重表示を抑制用の表示済みアイテムセット
        seen.add(page);         // 自分自身は関連記事に出さなくていいので

        // 他の記事からリンクが張られてない記事に対して共通してリンクを張っている記事を優先的に表示する
        const links = meta.links.map(link=>{
            return {
                "score": metadata[link].froms.length * -1,
                "link" : link
            };
        }).toSorted((a, b) => {
            return b.score - a.score;
        }).map(it => {
            return it.link;
        });

        this._relatedPageLists = links.map(link => {
            const list = new PageList();
            list.append((() => {
                const item = new IconListItem();
                item.title = link;
                return item;
            })())
            for (const from of metadata[link].froms) {
                if (seen.has(from)) continue;    // 表示済みアイテムは表示しない
                const m = metadata[from];

                list.append((() => {
                    const item = new PageListItem();
                    item.title = from;
                    item.preview = m.content;
                    item.updated = m.updated;
                    item.created = m.created;
                    return item;
                })())

                seen.add(from);                  // 表示済みアイテムに追加
            }
            list.visible = (list.children.length !== 1);
            return list;
        });

        // すでにドキュメントに追加されている場合はdomの操作も行う
        if (this.shadowRoot) {
            const outbound = this.shadowRoot.querySelector(`#${ID_OUTBOUND}`);
            outbound.replaceChildren(this._outboundPageList);

            const related = this.shadowRoot.querySelector(`#${ID_RELATED}`);
            related.replaceChildren(...this._relatedPageLists);
        }

    }

    /**
     * @param {HTMLFormElement} form 
     */
    _filterList(form) {
        return () => {
            // 検索入力項目の取得
            const query = form.elements[QUERY_NAME].value;
            const mode  = form.elements[MODE_NAME].value;

            const isVisible = (item) => {
                if (item instanceof IconListItem) { return true; }
                if (item instanceof PageListItem) {
                    if (!query) return true;
                    if (mode == "title"  ) return item.title.includes(query);
                    if (mode == "content") return item.preview.includes(query);
                }
                return false;
            };

            for (const list of this._relatedPageLists) {
                let c = 0;
                for (const item of list.children) {
                    if (item.visible = isVisible(item)) c++;
                }
                list.visible = (c !== 1);
            }
        }
    }
}
