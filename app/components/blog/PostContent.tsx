'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface PostContentProps {
    content: string;
}

export default function PostContent({ content }: PostContentProps) {
    return (
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#181d27] prose-p:text-[#535861] prose-a:text-[#8a765e] prose-strong:text-[#181d27]">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h2: ({ node, ...props }: any) => (
                        <h2 className="text-3xl font-bold mt-12 mb-6 pb-2 border-b-2 border-[#8a765e] inline-block" {...props} />
                    ),
                    h3: ({ node, ...props }: any) => (
                        <h3 className="text-xl font-bold mt-8 mb-4 text-[#74634e] flex items-center" {...props}>
                            <span className="w-2 h-2 rounded-full bg-[#8a765e] mr-3 inline-block"></span>
                            {props.children}
                        </h3>
                    ),
                    strong: ({ node, ...props }: any) => (
                        <strong className="bg-[#fff5b1] px-1 rounded text-[#181d27] font-extrabold" {...props} />
                    ),
                    blockquote: ({ node, ...props }: any) => (
                        <blockquote className="bg-[#f9fafb] border-l-4 border-[#8a765e] p-6 my-8 rounded-r-lg shadow-sm" {...props}>
                            <div className="flex items-start">
                                <i className="fa-solid fa-quote-left text-[#8a765e] text-2xl mr-4 opacity-30"></i>
                                <div className="text-lg font-medium text-[#181d27] italic">
                                    {props.children}
                                </div>
                            </div>
                        </blockquote>
                    ),
                    ul: ({ node, ...props }: any) => (
                        <ul className="list-none space-y-2 my-6 pl-0" {...props} />
                    ),
                    li: ({ node, ...props }: any) => (
                        <li className="relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#8a765e] before:font-bold">
                            {props.children}
                        </li>
                    ),
                    table: ({ node, ...props }: any) => (
                        <div className="overflow-x-auto my-8 border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }: any) => (
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                    ),
                    td: ({ node, ...props }: any) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-t border-gray-100" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
