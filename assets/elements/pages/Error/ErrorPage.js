import CSSStyleSheetCommon from "./../CSSStyleSheetCommon.js";

export default class ErrorPage extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = ["status"];

    constructor() {
        super();
    }

    get status() { return this.getAttribute("status"); }
    set status(v) { this.setAttribute("status", v); }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `
            <h2>Error: ${this.status}</h2>
            <p>ページの読み込みに失敗しました。</p>
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

        if (name == "status") {
            this.shadowRoot.querySelector("h2").textContent = `Error: ${this.status}`;
            return;
        }
    }
}
