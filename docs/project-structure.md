# プロジェクト構造詳細

## コンポーネント構成

### ページ (src/app/page.tsx)
- メインのナレッジベース表示ページ
- カテゴリフィルタリング機能
- Markdownレンダリング
- ローディング/エラー状態の管理

### API (src/app/api/knowledge/route.ts)
- Google Apps Scriptエンドポイントとの通信
- エラーハンドリング
- レスポンス形式の検証

## データフロー

1. クライアント
   - ページロード時にfetchData()を呼び出し
   - カテゴリ選択によるフィルタリング
   - Markdownコンテンツのレンダリング

2. APIサービス (src/services/api.ts)
   - データフェッチのための型定義と関数
   - エラーハンドリングとレスポンス整形

3. APIルート
   - Google Apps Scriptへのプロキシ
   - パラメータの受け渡し
   - エラー時のフォールバック

## データ型定義

```typescript
interface KnowledgeItem {
  タイトル: string;
  本文: string;
  カテゴリ: string;
  ファイルID: string;
}
```

## スタイリング
- Tailwind CSSによるユーティリティファーストアプローチ
- レスポンシブデザイン対応
- Markdownコンテンツのカスタムスタイリング