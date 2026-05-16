# Gitステージングから削除

[git] で [Gitステージングに登録]で追加されたファイルを削除する方法。
[コミット(Git)]に

## ステージングから削除するコマンド
### ファイル名を指定して削除
``` bash
git reset <filename>
```
``` bash
git reset *.html
```
### ハンク(hunk)単位でステージングから削除
``` bash
git reset -p
```
