# Git履歴のない新しいブランチを作成する

以下の手順を実施する。

``` bash
# 履歴のない新しいブランチを作成
git checkout --orphan new-main

# すべてのファイルをステージング
git add -A

# 新しい初期コミットを作成
git commit -m "Initial commit"

# 古いmainブランチを削除
git branch -D main

# 新しいブランチをmainにリネーム
git branch -m main

# リモートに強制プッシュ
git push -f origin main
```