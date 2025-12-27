"use client";

import { useState } from "react";
import { Bold, Italic, Underline, Heading1, Heading2, List, Image, Link as LinkIcon } from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isActive, setIsActive] = useState(false);

    const ToolbarButton = ({ icon: Icon, label }: { icon: any; label: string }) => (
        <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors"
            title={label}
            onClick={(e) => e.preventDefault()}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className={`border rounded-md overflow-hidden ${isActive ? 'border-slate-400 ring-1 ring-slate-400' : 'border-slate-200'}`}>
            {/* Toolbar */}
            <div className="flex items-center space-x-1 p-2 bg-slate-50 border-b border-slate-200 flex-wrap">
                <ToolbarButton icon={Bold} label="Bold" />
                <ToolbarButton icon={Italic} label="Italic" />
                <ToolbarButton icon={Underline} label="Underline" />
                <div className="w-px h-4 bg-slate-300 mx-2" />
                <ToolbarButton icon={Heading1} label="Heading 1" />
                <ToolbarButton icon={Heading2} label="Heading 2" />
                <div className="w-px h-4 bg-slate-300 mx-2" />
                <ToolbarButton icon={List} label="Bullet List" />
                <div className="w-px h-4 bg-slate-300 mx-2" />
                <ToolbarButton icon={Image} label="Insert Image" />
                <ToolbarButton icon={LinkIcon} label="Insert Link" />
            </div>

            {/* Editor Area - Simulating a content editable area with a textarea for now to be functional */}
            <div className="relative min-h-[400px] bg-white">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "내용을 입력하세요..."}
                    className="w-full h-full min-h-[400px] p-4 resize-none outline-none text-slate-800 bg-transparent block"
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                />
            </div>

            {/* Mock status bar or helper text */}
            <div className="px-4 py-2 bg-slate-50 text-xs text-slate-500 border-t border-slate-100 flex justify-between">
                <span>HTML Mode (Mock)</span>
                <span>{value.length} words</span>
            </div>
        </div>
    );
}
