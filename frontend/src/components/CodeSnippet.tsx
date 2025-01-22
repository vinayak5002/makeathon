import React from 'react';
import { toast } from 'react-toastify';
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Snippet } from '../types/types';


interface CodeSnippetProps {
    snip: Snippet;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ snip }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(snip.code).then(() => {
            toast('Code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="bg-primary" style={{ position: 'relative', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
            <SyntaxHighlighter
                language={snip.lang}
                style={atomOneDark}
                customStyle={{ background: "transparent", flex: 1, fontWeight: 500, fontSize: 15 }}
                showLineNumbers
                wrapLines
            >
                {snip.code}
            </SyntaxHighlighter>
            <button
                onClick={handleCopy}
                style={{ marginLeft: '10px' }}
            >
                Copy
            </button>
        </div>
    );
};

export default React.memo(CodeSnippet);