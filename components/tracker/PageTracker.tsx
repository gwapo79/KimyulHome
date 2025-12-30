
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
    const pathname = usePathname();
    const lastPathRef = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname) return;
        if (pathname === lastPathRef.current) return;

        // Skip Admin pages to avoid noise
        if (pathname.startsWith('/admin')) return;

        lastPathRef.current = pathname;

        const logView = async () => {
            try {
                // Get User ID from localStorage (simple client auth check for tracking)
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);

                // Fetch IP (optional, backend can allow this, or we rely on request headers in API)
                // For simplicity, we just send header info or let backend extract IP.
                // We'll trust backend to get IP from request headers.

                await fetch('/api/log/activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        type: 'PAGE_VIEW',
                        content: `Visited ${pathname}`,
                        device: navigator.userAgent
                    })
                });

            } catch (e) {
                // Silent fail
            }
        };

        // Debounce slightly to avoid rapid back-forth
        const timer = setTimeout(logView, 1000);
        return () => clearTimeout(timer);

    }, [pathname]);

    return null;
}
