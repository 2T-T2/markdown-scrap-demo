import CSSStyleSheetCommon from "./../CSSStyleSheetCommon.js";

export default class NotFoundPage extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = [];

    constructor() {
        super();
    }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `
            <h2>404 Not Found</h2>
            <p>まだ未作成のページです。</p>
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
    attributeChangedCallback(name, oldValue, newValue) {}
}
