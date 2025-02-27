export interface KnowledgeItem {
  タイトル: string;
  本文: string;
  カテゴリ: string;
  ファイルID: string;
}

export const fetchData = async (category?: string, query?: string) => {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);

    const response = await fetch(`/api/knowledge?${params.toString()}`);
    if (!response.ok) {
      throw new Error('APIリクエストに失敗しました');
    }

    const result = await response.json();
    
    // レスポンスの構造を確認
    if (result.success && Array.isArray(result.data)) {
      return result.data as KnowledgeItem[];
    } else {
      console.error('Invalid API response structure:', result);
      throw new Error(result.error || 'データの形式が不正です');
    }
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    throw error;
  }
};