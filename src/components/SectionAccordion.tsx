import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface SectionAccordionProps {
  content: string;
  processText?: (text: string) => React.ReactNode;
}

export const SectionAccordion: React.FC<SectionAccordionProps> = ({ 
  content,
  processText = (text) => text 
}) => {
  // コンテンツを見出しごとにセクション分割する関数
  const splitContentIntoSections = (markdownContent: string) => {
    // 見出し(#で始まる行)でコンテンツを分割
    const sections = markdownContent.split(/(?=^#{1,3} )/m);
    return sections.filter(section => section.trim() !== '');
  };

  const sections = splitContentIntoSections(content);

  // 単一セクション用のコンポーネント
  const Section = ({ sectionContent }: { sectionContent: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    
    // セクションの見出しと本文を分離
    const getHeadingAndContent = () => {
      const lines = sectionContent.split('\n');
      const headingLine = lines[0];
      const contentLines = lines.slice(1).join('\n');
      
      return { heading: headingLine, content: contentLines };
    };
    
    const { heading, content } = getHeadingAndContent();
    
    return (
      <div className="section-container" style={{ marginBottom: '20px' }}>
        {/* 見出し部分 */}
        <div 
          style={{ 
            borderBottom: '1px solid #eee', 
            marginBottom: '8px', 
            paddingBottom: '5px',
            cursor: 'pointer'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => {
                return <h1 style={{ fontSize: '0.42rem' }}>{children}</h1>;
              }
            }}
          >{heading}</ReactMarkdown>
        </div>
        
        {/* 折りたたみ可能なコンテンツ */}
        <div
          ref={contentRef}
          style={{
            maxHeight: isExpanded ? 'none' : '100px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-out',
            position: 'relative'
          }}
        >
          {/* コンテンツが空でない場合のみレンダリング */}
          {content.trim() && (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({ children }) => {
                  return <h1 style={{ fontSize: '0.42rem' }}>{children}</h1>;
                },
                p: ({ children }) => {
                  const processedContent = typeof children === 'string' 
                    ? processText(children) 
                    : children;
                  return <p style={{ margin: '8px 0' }}>{processedContent}</p>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )}
          
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
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginTop: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? '閉じる' : '続きを読む'}
        </button>
      </div>
    );
  };

  return (
    <div className="sections-container">
      {sections.map((section, index) => (
        <Section key={index} sectionContent={section} />
      ))}
    </div>
  );
};
