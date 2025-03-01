import React, { useState } from 'react';

interface AccordionProps {
  children: React.ReactNode;
  maxHeight?: number;
  buttonText?: {
    expand: string;
    collapse: string;
  };
}

export const ExpandableContent: React.FC<AccordionProps> = ({
  children,
  maxHeight = 150,
  buttonText = {
    expand: '続きを読む',
    collapse: '閉じる'
  }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md-accordion">
      <div
        className={`md-accordion-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={{
          maxHeight: isExpanded ? '100%' : `${maxHeight}px`
        }}
      >
        {children}
      </div>
      
      <div className="md-accordion-gradient" style={{ opacity: isExpanded ? 0 : 1 }} />
      
      <button 
        className="md-accordion-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? buttonText.collapse : buttonText.expand}
      </button>
    </div>
  );
};
