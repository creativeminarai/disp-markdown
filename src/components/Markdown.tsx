import React from 'react';
import '../styles/markdown.css';

interface MarkdownProps {
  children: React.ReactNode;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <div className="markdown-content">
      {children}
    </div>
  );
};
