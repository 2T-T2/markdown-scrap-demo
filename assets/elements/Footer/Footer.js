export default class Header extends HTMLElement {
    /** 変更を感知したい属性 */
    static observedAttributes = [];

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.shadowRoot) return;

        const shadow = this.attachShadow({mode: "open"});

        shadow.innerHTML = `<footer id="footer"></footer>`;
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
