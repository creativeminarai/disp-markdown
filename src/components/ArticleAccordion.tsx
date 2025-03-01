import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Image from 'next/image';

interface ArticleAccordionProps {
  title: string;
  content: string;
  fileId?: string;
  processText?: (text: string) => React.ReactNode;
}

export const ArticleAccordion: React.FC<ArticleAccordionProps> = ({
  title,
  content,
  fileId,
  processText = (text) => text
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
  };

  return (
    <div className="article-card py-2">
      {/* タイトル部分 - クリック可能 */}
      <div className="flex items-center gap-2 mb-2">
        <h2
          className="text-base font-bold text-blue-800"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {title}
        </h2>
        <button
          onClick={handleCopy}
          className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
          title={isCopied ? "コピーしました！" : "本文をコピー"}
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
        </button>
        {fileId && (
          <a
            href={`https://drive.google.com/file/d/${fileId}/view`}
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
      
      {/* コンテンツ部分 - 折りたたみ可能 */}
      <div
        style={{
          maxHeight: isExpanded ? 'none' : '100px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
          position: 'relative'
        }}
      >
        <div className="markdown-content prose prose-blue prose-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              p: ({ children }) => {
                if (typeof children === 'string') {
                  return <p className="!my-1">{processText(children)}</p>;
                }
                return <p className="!my-1">{children}</p>;
              },
              td: ({ children }) => {
                const content = children?.toString() || '';
                const isNumeric = /^[\d,.-]+$/.test(content.trim());
                return (
                  <td className={isNumeric ? 'numeric' : 'text-content'}>
                    {children}
                  </td>
                );
              },
              table: ({ children }) => (
                <div className="table-wrapper">
                  <table>{children}</table>
                </div>
              ),
              ul: ({ children, ...props }) => (
                <ul className="!my-1 !space-y-0" {...props}>{children}</ul>
              ),
              li: ({ children }) => {
                const content = typeof children === 'string' ? processText(children) : children;
                return (
                  <li className="!my-0 inline-flex items-start mr-2">
                    <span className="mr-1">•</span>
                    <span>{content}</span>
                  </li>
                );
              },
              img: ({ src, alt }) => (
                src ? (
                  <Image
                    src={src}
                    alt={alt || ''}
                    width={320}
                    height={240}
                    className="inline-block max-h-16 w-auto"
                    style={{ verticalAlign: 'middle' }}
                  />
                ) : null
              ),
              a: ({ children, ...props }) => {
                return <a {...props} className="text-sm">{children}</a>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        {/* グラデーションオーバーレイ（折りたたみ時のみ表示） */}
        {!isExpanded && (
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '50px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
      
      {/* 続きを読むボタン */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 px-4 mt-2 bg-transparent border border-slate-200 hover:border-blue-700 rounded transition-colors duration-200 cursor-pointer"
      >
        {isExpanded ? '閉じる' : '続きを読む'}
      </button>
    </div>
  );
};
