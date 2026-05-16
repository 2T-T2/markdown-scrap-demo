import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.0/+esm";

marked.use({
    renderer: {
        heading(token) {
            // h1 の見出しはメインタイトルに使用するので、1つレベルを下げて変換する
            const d = Math.min(token.depth+1, 6);
            return `<h${d}>${token.text}</h${d}>`;
        }
    },
    extensions: [
        {
            // Scrapbox風リンク記法を拡張機能として追加
            name: "scrapbox_link",
            level: "inline",
            start: (src) => {
                return src.indexOf("[");    // 該当するかもしれない位置を返す(大まかでOK)
            },
            tokenizer: (src) => {
                const match = src.match(/^\[([^\]]+)\]/);
                if (match) {
                    return {
                        type: 'scrapbox_link',
                        text: match[1],
                        raw: match[0],
                        tokens: []
                    }
                }
            },
            renderer: (token) => {
                return `<a href="#${token.text}">${token.text}</a>`
            }
        }
    ]
});

export default marked;
