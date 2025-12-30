
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
    type: 'USER' | 'CASE';
    id: string;
    label: string;
    subLabel: string;
    link: string;
}

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setOpen(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Router event to close search
    useEffect(() => {
        setOpen(false);
    }, [router]); // This might not be triggered on simple push, but Link click will re-render page shell often.

    const handleSelect = (link: string) => {
        setOpen(false);
        setQuery('');
        router.push(link);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-lg">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setOpen(true)}
                    placeholder="통합 검색 (이름, 전화번호, 사건번호, ID)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8a765e] focus:bg-white transition-all placeholder:text-slate-400"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                {loading && (
                    <div className="absolute right-10 top-2.5">
                        <Loader2 className="w-5 h-5 animate-spin text-[#8a765e]" />
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="max-h-[400px] overflow-y-auto py-2">
                        {results.map((result, idx) => (
                            <button
                                key={`${result.type}-${result.id}-${idx}`}
                                onClick={() => handleSelect(result.link)}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center border ${result.type === 'USER' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                                    }`}>
                                    {result.type === 'USER' ? <User className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#8a765e]">{result.label}</h4>
                                    <p className="text-xs text-slate-500">{result.subLabel}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {open && results.length === 0 && !loading && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-center z-50">
                    <span className="text-sm text-slate-500">검색 결과가 없습니다.</span>
                </div>
            )}
        </div>
    );
}
