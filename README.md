# 🧾 Minecraft ホワイトリスト申請Bot

このBotは、Discord上でMinecraftホワイトリスト申請を受け付け、オーナーにDMで通知するためのツールです。  
SQLiteを使った軽量な構成で、自宅サーバーでも運用可能です。

---

## 📦 機能一覧

- `/whitelist` コマンドで申請受付
- 申請情報をSQLiteに保存
- オーナーにDM通知
- ユーザーにも申請受付DMを送信

---

## 🛠️ セットアップ方法

1. このリポジトリをクローン
```bash
git clone https://github.com/yourusername/whitelist-bot.git
cd whitelist-bot

2. 必要なモジュールをインストール

npm install

.env ファイルを作成し、以下のように記入
BOT_TOKEN=
OWNER_ID=
CLIENT_ID=

Botを起動

node bot.js

🗃️ データベース
SQLiteを使用しています。/data/whitelist.db は自動生成されます。
テーブルが存在しない場合、自動で作成されます。

👤 開発者向けメモ
commands/whitelist.js … 申請コマンド処理

utils/database.js … DBアクセスラッパー

その他拡張予定：管理者用 /whitelist-list, /whitelist-update

📄 ライセンス
MIT License

❗ 注意事項
スパム対策のため、DM送信が失敗する場合があります。
招待する際は、Botに DM送信権限 と アプリコマンドの権限 を忘れずに付与してください。