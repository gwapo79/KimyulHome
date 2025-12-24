'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchAndFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'latest');

    useEffect(() => {
        setKeyword(searchParams.get('keyword') || '');
        setSort(searchParams.get('sort') || 'latest');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (keyword.trim()) {
            params.set('keyword', keyword.trim());
        } else {
            params.delete('keyword');
        }
        params.set('page', '1'); // Reset to page 1 on new search
        router.push(`/legal/success-cases?${params.toString()}`);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        setSort(newSort);
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        params.set('page', '1'); // Reset to page 1 on sort change
        router.push(`/legal/success-cases?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-grow md:flex-grow-0">
                <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"></i>
                <input
                    type="text"
                    placeholder="사례 검색"
                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-[#cfd2d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e]"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </form>
            <div className="relative">
                <select
                    className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 bg-white border border-[#cfd2d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a765e]"
                    value={sort}
                    onChange={handleSortChange}
                >
                    <option value="latest">최신순 정렬</option>
                    <option value="oldest">오래된순 정렬</option>
                    {/* Add more sort options if needed, e.g., 'popular' if we had view counts */}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"></i>
            </div>
        </div>
    );
}
