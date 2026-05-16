export default class Header extends HTMLElement {
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
            <header id="header">
                <h1><a style="text-decoration: none; color: #333;" href="">
                    <slot><!-- ここに表示 --></slot>
                </a></h1>
            </header>
            <style>
                #header {
                    background: var(--card-bg);
                    padding: 1rem 2rem;
                    border-bottom: 1px solid var(--border-color);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                #header h1 {
                    margin: 0;
                    font-size: 1.25rem;
                }

                #header h1 a {
                    color: var(--text-main) !important;
                    font-weight: 800;
                    letter-spacing: -0.5px;
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
