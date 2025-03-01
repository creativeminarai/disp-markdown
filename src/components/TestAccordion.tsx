import React, { useState } from 'react';

export const TestAccordion = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // テスト用のテキスト
  const longText = `
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
    これは折りたたみテスト用のテキストです。
  `;

  return (
    <div style={{ 
      border: '1px solid red', 
      padding: '10px',
      margin: '20px 0'
    }}>
      <h3>テスト用アコーディオン</h3>
      
      <div style={{ 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid blue'
      }}>
        <div style={{ 
          maxHeight: isExpanded ? 'none' : '100px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
          background: '#f0f0f0'
        }}>
          {longText}
        </div>
        
        {!isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50px',
            background: 'linear-gradient(to bottom, rgba(240,240,240,0), rgba(240,240,240,1))',
            pointerEvents: 'none'
          }} />
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginTop: '8px',
            backgroundColor: '#e0e0e0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? '閉じる' : '続きを読む'}
        </button>
      </div>
    </div>
  );
};
