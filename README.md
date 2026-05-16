# markdown-scrap

Markdown ファイルをベースにした、シンプルかつ強力なナレッジネットワーク構築フレームワークです。**Deno** によるメタデータ抽出と **Web Components** によるフロントエンド構成を組み合わせ、Scrapbox のような双方向リンク（Backlinks）を備えた Wiki を静的にホストできます。

## 🚀 特徴

- **Markdown 駆動**: すべてのコンテンツは `pages/` ディレクトリ内の Markdown ファイルで管理されます。
- **双方向リンク（Backlinks）**: Scrapbox 風の記法 `[リンク名]` をサポートし、リンク先のページから「どこからリンクされているか（froms）」を自動的に追跡・表示します。
- **自動メタデータ生成**: Deno スクリプトが Markdown を解析し、タイトル、更新日、リンク構造を含む `metadata.json` を自動生成します。
- **Web Components アーキテクチャ**: フロントエンドは Custom Elements を使用したモジュール設計になっており、CSS 共有（Shadow DOM 活用）や高速なコンポーネント読み込みを実現しています。
- **GitHub Actions 連携**: Markdown をプッシュするだけで、メタデータの更新と GitHub Pages へのデプロイが自動的に実行されます。

## 📂 プロジェクト構造

```text
├── .github/workflows/    # 自動メタデータ更新とデプロイのワークフロー
├── assets/
│   ├── css/              # グローバルスタイル
│   ├── elements/         # Web Components (Header, PageList, Related 等)
│   └── services/         # メタデータ取得や Markdown パース (marked.js)
├── data/
│   └── metadata.json     # スクリプトによって生成されるサイトの索引データ
├── pages/                # Markdown コンテンツを配置するディレクトリ
├── scripts/
│   └── update-metadata.ts # Deno 用メタデータ抽出スクリプト
├── deno.jsonc            # Deno のインポートマップ設定
└── index.html            # エントリポイント
```

## 🛠️ クローンから公開までの手順

このリポジトリを自分の環境で動かし、GitHub Pages で公開するまでの流れです。

### 1. リポジトリの準備
まず、ソースコードを手元に取得し、自分の新しいリポジトリとして初期化します。

```bash
# リポジトリをクローン
git clone https://github.com/2T-T2/markdown-scrap.git <your_project_directory>
cd <your_project_directory>

# 自分のリモートリポジトリとして再設定
rm -rf .git
git init
git remote add origin <https://github.com/<your_user_name>/<your_repository_name>.git>
git add .
git commit -m "Initial commit"
git branch -M <your_branch>
git push -u origin <your_branch>
```

### 2. GitHub リポジトリの設定（重要）
GitHub Actions がメタデータを自動更新できるように権限を設定します。

1.  GitHub リポジトリの **Settings > Actions > General** に移動します。
2.  **Workflow permissions** で **「Read and write permissions」** を選択して保存します（スクリプトが `metadata.json` を書き換えてコミットするために必要です）。
3.  **Settings > Pages** に移動し、**Build and deployment > Source** を **「GitHub Actions」** に設定します。

### 3. コンテンツの追加と更新
`pages/` ディレクトリに新しい `.md` ファイルを追加してプッシュしてください。

```bash
# 例: 記事の追加
echo "# Hello World"    > pages/hello.md
echo "[こんにちは]"     >> pages/hello.md
echo "# こんにちは"      > pages/こんにちは.md
echo "日本語のあいさつ"  >> pages/こんにちは.md
git add pages/*
git commit -m "Add new page"
git push origin main
```
プッシュをトリガーに GitHub Actions が起動し、自動的に双方向リンクの解析とデプロイが行われます。

## 💻 ローカル開発

### 必要条件
- **Deno** (Runtime)

### メタデータのローカル更新
手動でメタデータを更新して確認したい場合は、以下のコマンドを実行します。

```bash
deno run --allow-read --allow-write scripts/update-metadata.ts <更新したいファイルのパス> data/metadata.json
```

## 📝 記法

- **Scrapbox 風リンク**: `[ページ名]` と記述することで、Wiki 内の他ページへリンクできます。
- **自動バックリンク**: リンクされた側のページには、関連ページとして自動的にリストアップされます。

---

この README は、ソース内のワークフロー設定（`update-metadate.yml`）、メタデータ抽出スクリプト（`update-metadata.ts`）、およびプロジェクトのディレクトリ構造に基づいて構成されています。