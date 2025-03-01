'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExpandableContent } from '@/components/ExpandableContent';
import { TestAccordion } from '@/components/TestAccordion';
import { SectionAccordion } from '@/components/SectionAccordion';
import { ArticleAccordion } from '@/components/ArticleAccordion';
import remarkBreaks from 'remark-breaks';
import { fetchData, KnowledgeItem } from '@/services/api';

export default function Home() {
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

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

  const filteredData = selectedCategory
    ? data.filter(item => item.カテゴリ === selectedCategory)
    : data;

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
      
      {categories.length > 0 && (
        <div className="tab-container mb-4">
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
      )}

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
