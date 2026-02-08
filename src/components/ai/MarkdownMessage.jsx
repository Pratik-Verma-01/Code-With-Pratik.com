import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const MarkdownMessage = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-p:text-dark-100 prose-headings:text-white prose-strong:text-white prose-code:text-neon-blue prose-code:bg-dark-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock 
                language={match[1]} 
                code={String(children).replace(/\n$/, '')} 
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a 
              className="text-neon-blue hover:underline break-all" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(MarkdownMessage);
