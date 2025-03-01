import React, { useState, useRef, useEffect } from 'react';

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

  useEffect(() => {
    if (contentRef.current && !isExpanded) {
      contentRef.current.style.maxHeight = `${maxLines * 24}px`;
    }
  }, [isExpanded, maxLines]);

  return (
    <div className="accordion-content">
      <div
        ref={contentRef}
        className={`content ${isExpanded ? 'expanded' : ''}`}
        style={{
          maxHeight: isExpanded ? `${contentRef.current?.scrollHeight || 'none'}px` : `${maxLines * 24}px`,
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {children}
      </div>
      
      {!isExpanded && (
        <div className="gradient-overlay" />
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="accordion-button"
      >
        {isExpanded ? '閉じる' : '続きを読む'}
      </button>
    </div>
  );
};
