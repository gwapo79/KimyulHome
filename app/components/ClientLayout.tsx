"use client";

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            <NextTopLoader color="#5e503f" showSpinner={false} />
            {!isAdmin && <Header />}
            {children}
            {!isAdmin && <Footer />}
        </>
    );
}
