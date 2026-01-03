'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
    src?: string | null;
    alt: string;
    fallback?: string; // e.g. "K" or "Kim"
    className?: string;
    size?: number; // size in pixels, optional override
}

export default function Avatar({ src, alt, fallback, className = "w-10 h-10", size }: AvatarProps) {
    const [hasError, setHasError] = useState(false);

    // Reset error state if src changes
    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (!src || hasError) {
        return (
            <div
                className={`${className} bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden rounded-full`}
                title={alt}
                style={size ? { width: size, height: size } : undefined}
            >
                {fallback ? (
                    <span className="text-sm">{fallback[0]}</span>
                ) : (
                    <User className="w-1/2 h-1/2" />
                )}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`${className} object-cover rounded-full`}
            onError={() => setHasError(true)}
            style={size ? { width: size, height: size } : undefined}
        />
    );
}
