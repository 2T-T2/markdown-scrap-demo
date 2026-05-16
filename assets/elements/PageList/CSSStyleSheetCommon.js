export default (() => {
  const sharedSheet = new CSSStyleSheet();
  sharedSheet.replaceSync(`
li {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: var(--accent-color);
}

li a {
  text-decoration: none;
  color: inherit;
}
  `);
  return sharedSheet
})();