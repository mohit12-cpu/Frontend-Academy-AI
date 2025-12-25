
import React from 'react';

interface TextRendererProps {
  text: string;
  className?: string;
  isDark?: boolean;
}

/**
 * A robust text renderer that handles common Gemini output formats:
 * - **Bold text**
 * - Bulleted lists (lines starting with * or -)
 * - Citation markers [1], [2] etc.
 * - Proper line spacing
 */
const TextRenderer: React.FC<TextRendererProps> = ({ text, className = "", isDark = false }) => {
  if (!text) return null;

  const boldClass = isDark ? "font-black text-white" : "font-black text-blue-600";
  const citationClass = isDark ? "text-blue-300 font-bold" : "text-blue-500 font-bold";

  const renderLine = (line: string, key: number) => {
    // Check if it's a list item
    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');
    const cleanLine = isListItem ? line.trim().substring(2) : line;

    // Split by Bold marker **
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    
    const renderedParts = parts.map((part, i) => {
      // Handle Bold
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={boldClass}>{part.slice(2, -2)}</strong>;
      }
      
      // Handle Citations [1], [2]...
      const citationParts = part.split(/(\[\d+\])/g);
      return citationParts.map((cP, j) => {
        if (cP.match(/\[\d+\]/)) {
          return <span key={`${i}-${j}`} className={`text-[10px] ml-0.5 ${citationClass}`}>{cP}</span>;
        }
        return cP;
      });
    });

    if (isListItem) {
      return (
        <li key={key} className="flex gap-2 ml-2 mb-1">
          <span className={isDark ? "text-blue-400" : "text-blue-500"}>•</span>
          <span>{renderedParts}</span>
        </li>
      );
    }

    return <p key={key} className="mb-2">{renderedParts}</p>;
  };

  const lines = text.split('\n');
  const renderedContent: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');
    
    if (isListItem) {
      currentList.push(renderLine(line, i));
    } else {
      if (currentList.length > 0) {
        renderedContent.push(<ul key={`list-${i}`} className="space-y-1 my-2">{currentList}</ul>);
        currentList = [];
      }
      if (line.trim()) {
        renderedContent.push(renderLine(line, i));
      }
    }
  });

  if (currentList.length > 0) {
    renderedContent.push(<ul key="list-final" className="space-y-1 my-2">{currentList}</ul>);
  }

  return (
    <div className={`leading-relaxed ${className}`}>
      {renderedContent}
    </div>
  );
};

export default TextRenderer;
