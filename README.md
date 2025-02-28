# ナレッジベースアプリケーション

シンプルなナレッジベース管理システムです。Google Spreadsheetと連携してナレッジを管理・表示します。

## 機能

- カテゴリ別のナレッジ表示
- Markdownコンテンツのサポート
- Google Drive連携（原本表示）
- レスポンシブデザイン

## 技術スタック

- Next.js 15.2.0
- React 19.0.0
- TypeScript
- Tailwind CSS

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

[http://localhost:3000](http://localhost:3000)にアクセスして確認できます。

## プロジェクト構成

```
src/
├── app/
│   ├── api/
│   │   └── knowledge/      # API エンドポイント
│   ├── layout.tsx         # アプリケーションレイアウト
│   ├── page.tsx          # メインページ
│   └── globals.css       # グローバルスタイル
└── services/
    └── api.ts            # API通信ロジック
```

## API

Google Apps Scriptと連携して、スプレッドシートからデータを取得します。
