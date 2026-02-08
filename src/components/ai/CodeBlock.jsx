import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

const CodeBlock = ({ language, code }) => {
  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
        <span className="text-xs font-mono text-dark-300 uppercase">{language || 'text'}</span>
        <CopyButton code={code} />
      </div>
      
      <div className="text-sm font-mono leading-relaxed">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
