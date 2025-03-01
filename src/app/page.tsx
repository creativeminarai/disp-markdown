'use client';

import { useState, useEffect } from 'react';
import { ArticleAccordion } from '@/components/ArticleAccordion';
import { fetchData, KnowledgeItem } from '@/services/api';

export default function Home() {
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(0.8); // 基本のフォントサイズ

  // フォントサイズの調整
  const adjustFontSize = (increment: boolean) => {
    setFontSize(prev => {
      const newSize = increment ? prev + 0.1 : prev - 0.1;
      // 0.6rem から 1.2rem の範囲に制限
      return Math.min(Math.max(newSize, 0.6), 1.2);
    });
  };

  useEffect(() => {
    // フォントサイズの変更を反映
    document.documentElement.style.setProperty('--content-font-size', `${fontSize}rem`);
  }, [fontSize]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        const uniqueCategories = Array.from(
          new Set(result.map(item => item.カテゴリ))
        ).filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        setError('データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 検索とカテゴリによるフィルタリング
  const filteredData = data.filter(item => {
    const matchesCategory = !selectedCategory || item.カテゴリ === selectedCategory;
    const matchesSearch = !searchQuery || (
      (item.タイトル?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.本文?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesCategory && matchesSearch;
  });

  // テキスト処理関数
  const processText = (text: string) => {
    return text
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n\s*\n/g, '\n')  // 連続する改行を1つに
      .replace(/^[-*+]\s*/gm, '')  // 箇条書きの記号を削除
      .replace(/^\d+\.\s*/gm, ''); // 番号付きリストの番号を削除
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-base">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-base text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-3 py-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-3 text-center">ナレッジベース</h1>
      
      {/* 検索バーとフォントサイズ調整 */}
      <div className="flex items-center mb-4 gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タイトルや本文を検索..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        <div className="font-size-controls">
          <button
            className="font-size-button"
            onClick={() => adjustFontSize(false)}
            disabled={fontSize <= 0.6}
            title="文字サイズを小さく"
          >
            -
          </button>
          <button
            className="font-size-button"
            onClick={() => adjustFontSize(true)}
            disabled={fontSize >= 1.2}
            title="文字サイズを大きく"
          >
            +
          </button>
        </div>
      </div>

      <div className="tab-container mb-4">
        <button
          className={`tab text-sm ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          すべて
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`tab text-sm ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredData.map((item, index) => (
          <ArticleAccordion 
            key={index}
            title={item.タイトル}
            content={item.本文 || ''}
            fileId={item.ファイルID}
            processText={processText}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 mt-4 text-sm">
          このカテゴリにはまだコンテンツがありません。
        </div>
      )}
    </main>
  );
}
