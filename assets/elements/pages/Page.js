import CSSStyleSheetCommon from "./CSSStyleSheetCommon.js";

export default class Page extends HTMLElement {
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
            <div class="content-wrapper">
                <slot></slot>
            </div>
            <style>
                /* 記事本文全体のコンテナ */
                .content-wrapper {
                    color: var(--text-main);
                    font-size: 1rem;
                    line-height: 1.85; /* 本文テキストの行間は少し広めが読みやすいため、ここだけで維持 */
                }

                /* --- h2（Markdownの「#」から変換された主見出し） --- */
                ::slotted(h2) {
                    font-size: 1.65rem;
                    font-weight: 800;
                    letter-spacing: -0.01em;
                    margin: 2.5rem 0 1.5rem 0;
                    padding-bottom: 0.6rem;
                    border-bottom: 2px solid var(--border-color); /* シンプルで美しい境界線 */
                    line-height: 1.3;
                }

                /* 最初に出現するh2（記事の冒頭）は上部の余白を詰める */
                ::slotted(h2:first-child) {
                    margin-top: 0.5rem;
                }

                /* --- h3（Markdownの「##」から変換された中見出し） --- */
                ::slotted(h3) {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 2.2rem 0 1.1rem 0;
                    padding-left: 10px;
                    border-left: 3.5px solid var(--accent-color); /* 左側のアクセントラインをここに移譲 */
                    line-height: 1.4;
                }

                /* --- h4（Markdownの「###」から変換された小見出し） --- */
                ::slotted(h4) {
                    font-size: 1.05rem;
                    font-weight: 700;
                    margin: 1.8rem 0 0.8rem 0;
                    color: var(--text-main);
                }

                /* --- 本文テキスト --- */
                ::slotted(p) {
                    margin: 0 0 1.5rem 0;
                    word-break: break-word;
                }

                /* --- リンク --- */
                ::slotted(a) {
                    color: var(--accent-color);
                    text-decoration: none;
                    font-weight: 500;
                    background-image: linear-gradient(0deg, var(--accent-color) 1px, transparent 1px);
                    background-size: 100% 1px;
                    background-repeat: no-repeat;
                    background-position: bottom;
                    transition: background-size 0.2s ease, color 0.2s ease;
                }

                ::slotted(a:hover) {
                    color: #0056b3;
                    background-size: 100% 2px;
                }

                /* --- リスト（箇条書き） --- */
                ::slotted(ul), ::slotted(ol) {
                    margin: 0 0 1.5rem 0;
                    padding-left: 1.5rem;
                }

                ::slotted(li) {
                    margin-bottom: 0.4rem;
                }

                /* リストの「・」の色をアクセントカラーにして、さりげない統一感を出す */
                ::slotted(ul li::marker) {
                    color: var(--accent-color);
                }

                /* --- 引用（Blockquote） --- */
                ::slotted(blockquote) {
                    margin: 1.5rem 0;
                    padding: 0.5rem 1.2rem;
                    border-left: 3.5px solid #b2bec3;
                    color: var(--text-sub);
                    background-color: rgba(0, 0, 0, 0.015);
                    font-style: italic;
                }

                ::slotted(blockquote p) {
                    margin: 0;
                }

                /* --- インラインコード --- */
                ::slotted(code:not([class*="language-"])) {
                    background-color: #f1f2f6;
                    color: #d63031;
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-family: var(--font-mono);
                    font-size: 0.85em;
                    letter-spacing: 0;
                }

                /* --- コードブロック --- */
                ::slotted(pre[class*="language-"]) {
                    font-family: var(--font-mono);
                    font-size: 0.9rem;
                    border-radius: 8px;
                    border: 1px solid rgba(0, 0, 0, 0.05); /* エッジを引き締める微細な境界線 */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
                    margin: 1.8rem 0 !important;
                }

                /* --- 区切り線 --- */
                ::slotted(hr) {
                    border: 0;
                    height: 1px;
                    background: var(--border-color);
                    margin: 2.5rem 0;
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
    attributeChangedCallback(name, oldValue, newValue) {}
}
