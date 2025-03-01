import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ExpandableContentProps {
  children: React.ReactNode;
  maxLines?: number;
}

export const ExpandableContent: React.FC<ExpandableContentProps> = ({ 
  children,
  maxLines = 5
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 高さが満足しているか確認する必要があります
  const [showButton, setShowButton] = useState(true); // 常に表示する
  
  // マウント時にコンソールに出力
  useEffect(() => {
    console.log('ExpandableContent mounted');
    console.log('ReactDOM is available:', !!ReactDOM);
    
    // DOMの調査
    setTimeout(() => {
      const elements = document.querySelectorAll('.debug-marker');
      console.log('Debug markers found:', elements.length);
    }, 1000);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', border: '3px dashed green' }} className="debug-marker">
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? 'none' : '150px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out'
        }}
      >
        {children}
      </div>
      
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
      
      {showButton && (
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
      )}
    </div>
  );
};
