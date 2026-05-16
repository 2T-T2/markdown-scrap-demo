# Gitコミット(commit)取り消し(修正)

[git] で [コミット(Git)] した内容を修正したいときの方法。
- `--amend` オプションを使用する。
[Gitプッシュ(push)取り消し(内容)]とは別なので注意。


## コミットメッセージの修正
``` bash
git commit --amend -m <修正後のメッセージ>
```
## ファイルの追加忘れ
``` bash
git add <忘れてたファイル>
git commit --amend --no-edit
```
## 著者情報の修正(社用アカウントで個人アカウントのコミットをしてしまった)
``` bash
git commit --amend --author="<名前> <メール>" --no-edit
```
## 不要ファイルの削除(機密ファイルを誤ってコミット)
``` bash
git rm --cached <機密のファイル>
git commit --amend --no-edit
```

### `git commit --amend` を取り消したい[reflog(Git)]から復元する
``` bash
git reflog
git reset --hard HEAD@{1}
```
### `git commit --amend` の内容がプッシュできない(強制プッシュ（個人ブランチのみ）)
``` bash
git push --force-with-lease origin ブランチ名
```
