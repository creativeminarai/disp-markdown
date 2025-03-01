'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExpandableContent } from '@/components/ExpandableContent';
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
          <article key={index} className="article-card py-2">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-base font-bold text-blue-500">
                {item.タイトル}
              </h2>
              {item.ファイルID && (
                <a
                  href={`https://drive.google.com/file/d/${item.ファイルID}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-500 hover:text-blue-600"
                  title="元データを表示"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" />
                  </svg>
                </a>
              )}
            </div>
            <div className="markdown-content prose prose-blue prose-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  root: ({ children }) => (
                    <ExpandableContent maxLines={5}>
                      {children}
                    </ExpandableContent>
                  ),
                  p: ({ children }) => {
                    if (typeof children === 'string') {
                      return <p className="!my-1">{processText(children)}</p>;
                    }
                    return <p className="!my-1">{children}</p>;
                  },
                  table: ({ children }) => (
                    <div className="table-wrapper">
                      <table>{children}</table>
                    </div>
                  ),
                  ul: ({ children, depth }) => (
                    <ul className={`!my-1 !space-y-0 ${depth > 0 ? 'ml-4' : ''}`}>{children}</ul>
                  ),
                  li: ({ children, ordered, index }) => {
                    const content = typeof children === 'string' ? processText(children) : children;
                    const marker = ordered ? `${index + 1}.` : '•';
                    return (
                      <li className="!my-0 inline-flex items-start mr-2">
                        <span className="mr-1">{marker}</span>
                        <span>{content}</span>
                      </li>
                    );
                  }
                }}>
                {item.本文 || ''}
              </ReactMarkdown>
            </div>
          </article>
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
