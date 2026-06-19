"use client"

import React from 'react';
import { type ComponentPropsWithoutRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Helper function to preprocess markdown content
export const processMarkdownNewlines = (content: string): string => {
    if (!content) return '';

    // Replace groups of 2 or more newlines with special markers
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, match => {
            // Insert non-breaking spaces with hard line breaks to preserve spacing
            return '\n\n' + Array(match.length - 1).fill('&nbsp;  ').join('\n') + '\n\n';
        });
};

const markdownComponents = {
    pre: (props: ComponentPropsWithoutRef<'pre'>) => {
        return (
            <pre
                className="max-w-full bg-raised border border-hairline rounded-lg p-3 my-4 overflow-x-auto text-bone"
                style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere'
                }}
                {...props}
            />
        );
    },

    code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
        const isInline = !className?.includes('language-');

        if (isInline) {
            return (
                <code
                    className="bg-raised border border-hairline px-1.5 py-0.5 rounded text-[0.85em] font-mono text-bone break-all"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : 'text';
        const code = String(children);

        return (
            <div className="max-w-full">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        margin: '1rem 0',
                        background: '#1e232c',
                        border: '1px solid #2a2f3a',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap'
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                    codeTagProps={{
                        style: {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        );
    },

    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => {
        const contentString = typeof children === 'string' ? children : '';

        if (contentString.trim() === '&nbsp;') {
            return <div className="h-4" aria-hidden="true" />;
        }

        const childrenArray = React.Children.toArray(children);
        const imageNodes = childrenArray.filter(child =>
            React.isValidElement(child) &&
            typeof child.type === 'string' &&
            child.type === 'img'
        );

        const hasOnlyImages =
            imageNodes.length > 1 &&
            childrenArray.length === imageNodes.length;

        if (hasOnlyImages) {
            return (
                <p
                    className="image-group flex flex-wrap justify-center items-center gap-4 my-6"
                    {...props}
                >
                    {children}
                </p>
            );
        }

        return (
            <p
                className="max-w-full mb-4 leading-relaxed text-bone-dim"
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
                {...props}
            >
                {children}
            </p>
        );
    },

    img: (props: ComponentPropsWithoutRef<'img'>) => {
        const isInImageGroup =
            props.className &&
            typeof props.className === 'string' &&
            props.className.includes('image-group');

        return (
            <img
                {...props}
                className={`rounded-lg border border-hairline ${isInImageGroup ? 'inline-block max-w-[30%] m-2' : 'block max-w-full mx-auto my-4'} ${props.className || ''}`}
                alt={props.alt || ""}
                style={{
                    ...(props.style || {}),
                    verticalAlign: isInImageGroup ? 'middle' : undefined
                }}
            />
        );
    },

    a: (props: ComponentPropsWithoutRef<'a'>) => (
        <a
            className="text-brand hover:text-brand-strong underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),

    br: () => <div className="h-4" aria-hidden="true" />,

    text: ({ children }: { children?: React.ReactNode }) => {
        const content = typeof children === 'string' ? children : '';

        if (content.includes('&nbsp;')) {
            return <>{content.replace(/&nbsp;/g, ' ')}</>;
        }

        return <>{children}</>;
    },

    li: (props: ComponentPropsWithoutRef<'li'>) => (
        <li className="ml-6 mb-2 text-bone-dim" {...props} />
    ),

    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
        <ol className="list-decimal pl-4 mb-4 marker:text-faint" {...props} />
    ),

    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
        <ul className="list-disc pl-4 mb-4 marker:text-faint" {...props} />
    ),

    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
        <h1 className="font-display text-2xl font-semibold mt-6 mb-4 text-bone" {...props} />
    ),
    h2: (props: ComponentPropsWithoutRef<'h2'>) => (
        <h2 className="font-display text-xl font-semibold mt-5 mb-3 text-bone" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
        <h3 className="font-display text-lg font-semibold mt-4 mb-2 text-bone" {...props} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
        <h4 className="font-display text-base font-semibold mt-3 mb-2 text-bone" {...props} />
    ),
    h5: (props: ComponentPropsWithoutRef<'h5'>) => (
        <h5 className="text-sm font-semibold mt-2 mb-1 text-bone" {...props} />
    ),
    h6: (props: ComponentPropsWithoutRef<'h6'>) => (
        <h6 className="text-xs font-semibold mt-2 mb-1 text-bone" {...props} />
    ),

    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote
            className="pl-4 border-l-2 border-hairline-strong italic my-4 text-muted"
            {...props}
        />
    ),

    table: (props: ComponentPropsWithoutRef<'table'>) => (
        <div className="overflow-x-auto my-4 rounded-lg border border-hairline">
            <table className="min-w-full divide-y divide-hairline" {...props} />
        </div>
    ),
    thead: (props: ComponentPropsWithoutRef<'thead'>) => (
        <thead className="bg-raised" {...props} />
    ),
    tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
        <tbody className="divide-y divide-hairline" {...props} />
    ),
    tr: (props: ComponentPropsWithoutRef<'tr'>) => (
        <tr className="hover:bg-surface" {...props} />
    ),
    th: (props: ComponentPropsWithoutRef<'th'>) => (
        <th className="px-4 py-2.5 text-left font-mono text-[0.7rem] uppercase tracking-wider text-muted" {...props} />
    ),
    td: (props: ComponentPropsWithoutRef<'td'>) => (
        <td className="px-4 py-3 text-sm text-bone-dim" {...props} />
    ),

    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
        <hr className="my-6 border-t border-hairline" {...props} />
    ),

    div: (props: ComponentPropsWithoutRef<'div'>) => (
        <div {...props} />
    )
};

export default markdownComponents;
