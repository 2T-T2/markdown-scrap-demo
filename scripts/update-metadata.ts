import { basename, dirname } from "std/path";
import { existsSync } from "std/fs";

import { MetaData } from "../types/MetaData.d.ts";

// --------------------
// 引数個数チェック
// --------------------
if (Deno.args.length < 2) {
  console.error("Usage: deno run --allow-read --allow-write update-metadata.ts <pagePath> <metadataPath>");
  Deno.exit(1);  
}

const [pagePath, metadataPath] = Deno.args;

// --------------------
// 引数チェック
// --------------------
if (!(existsSync(pagePath) && pagePath.endsWith(".md"))) {
  console.error("Invalid file path.");
  Deno.exit(1);
}

// --------------------
// 主処理
// --------------------

const currentTime = Date.now();
const name = basename(pagePath, ".md");

// 既存メタデータがあれば読み込む
const allMetadata: Record<string, MetaData> = (() => {
  if (!existsSync(metadataPath)) {
    return {};
  }
  return JSON.parse(Deno.readTextFileSync(metadataPath));
})();

// 引数で指定されたページ名のメタデータを更新する
const metadata: MetaData = (() => {
  const m = allMetadata[name];
  if (!m) {
    return {
      content: "",
      links: [],
      froms: [],
      updated: 0,
      created: currentTime,
    };
  }
  return m;
})();

// 変更前の記事で貼っていたリンク先のページの froms から削除
for (const link of metadata.links) {
  if (!allMetadata[link]) continue;               // リンク先のページない場合
  const i = allMetadata[link].froms.indexOf(name);
  if (i === -1) continue;
  allMetadata[link].froms.splice(i, 1);
}

// 変更前の記事で貼ってたリンク先ページ情報をクリア
metadata.links.splice(0);

// 各情報を更新
metadata.content = Deno.readTextFileSync(pagePath);
// リンク抽出時には、コードブロック内の [0] などを除外して探す
const contentWithoutCodeBlock = metadata.content
  .replace(/```[\s\S]*?```/g, "") // 複数行コードブロック
  .replace(/`.*?`/g, "");         // 1行コードブロック
metadata.links = [...new Set(Array.from(contentWithoutCodeBlock.matchAll(/\[([^\]]+)\]/g), it => it[1]))];
metadata.updated = currentTime;
// 先にダミーページを作成していて後からページが作成された時に、作成日時を更新
if (metadata.created < 0)
  metadata.created = currentTime;

// 変更後の記事で貼っているリンク先のページの froms に追加
for (const link of metadata.links) {
  if (!allMetadata[link]) {
    // リンク先ページがない場合、ダミーページのメタデータに作成しておく
    allMetadata[link] = {
      content: "",
      froms  : [],
      links  : [],
      updated: -1,
      created: -1,
    }
  }
  if (!allMetadata[link].froms.includes(name))
    allMetadata[link].froms.push(name);
}

// メタデータ保存
allMetadata[name] = metadata;
if (!existsSync(dirname(metadataPath))) {
  Deno.mkdirSync(dirname(metadataPath));
}
Deno.writeTextFileSync(metadataPath, JSON.stringify(allMetadata, null, 2));
