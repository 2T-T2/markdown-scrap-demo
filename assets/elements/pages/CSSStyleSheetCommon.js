export default (() => {
  const sharedSheet = new CSSStyleSheet();
  sharedSheet.replaceSync(`
h2 {
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
  margin-top: 0;
}

/* リンクのスタイル */
a {
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent-color);
}

a:hover {
  background-color: rgba(9, 132, 227, 0.1);
}

/* Prism.js のコードブロック微調整 */
pre[class*="language-"] {
  border-radius: 8px;
  margin: 1.5rem 0 !important;
}
  `);
  return sharedSheet
})();