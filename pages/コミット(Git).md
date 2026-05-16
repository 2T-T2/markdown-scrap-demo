# コミット(Git)

[git] の 主要な操作の 1つ

[ステージング(Git)]に登録された変更内容を「1回分の作業履歴（スナップショット）」として[ローカルリポジトリ(Git)]に記録する操作。
[リモートリポジトリ(Git)]に記録する操作はまた別なので注意。

## コマンド
### 基本形
``` bash
git commit -m <message>
```
### `git add` を省略していきなりコミット
``` bash
git commit -a -m <message>
```
### 実際にはコミットせずに動作を確認([ドライラン])
``` bash
git commit --dry-run  -m <message>
```
