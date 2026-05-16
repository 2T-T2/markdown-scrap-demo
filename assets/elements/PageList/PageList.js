export default class PageList extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = [];

    constructor() {
        super();
    }

    get visible() { return this.getAttribute("visible").toLocaleLowerCase() !== "false"; }
    set visible(v) { this.setAttribute("visible", String(v)); }

    /**
     * 要素が文書に追加されるたびに呼び出されます。仕様では、開発者は可能な限り、カスタム要素の設定をコンストラクターではなく、このコールバックで実装することを推奨しています。
     */
    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `
            <ul>
                <slot><!-- ここに表示 --></slot>
            </ul>
            <style>
                :host([visible="false"]) {
                    display: none !important;
                }

                ul {
                    display: grid;
                    /* 画面幅に応じてカード数を自動調整 (最小250px) */
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1.5rem;
                    list-style: none;
                    padding: 0;
                    margin: 2rem 0;
                }
            </style>
        `;
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
