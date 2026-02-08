import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@utils/cn';

const MarkdownPreview = ({ content, className }) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-xl !bg-dark-900 border border-white/10 !p-4 !my-4 shadow-lg text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                className={cn(
                  "bg-dark-800 text-neon-blue px-1.5 py-0.5 rounded font-mono text-sm",
                  className
                )} 
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-dark-200 mb-4 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-dark-200 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-dark-200 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-neon-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-neon-purple pl-4 italic text-dark-300 bg-white/5 py-2 rounded-r-lg my-4" {...props} />,
          img: ({ node, ...props }) => <img className="rounded-xl max-w-full h-auto my-6 border border-white/10 shadow-lg" loading="lazy" {...props} />,
          table: ({ node, ...props }) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-white/10 border border-white/10 rounded-lg overflow-hidden" {...props} /></div>,
          th: ({ node, ...props }) => <th className="px-4 py-3 bg-dark-800 text-left text-xs font-medium text-dark-300 uppercase tracking-wider" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3 text-sm text-dark-200 border-t border-white/5" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
