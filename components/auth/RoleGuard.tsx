"use client";

import { useEffect, useState } from "react";
// We need to fetch the user role. Since we don't have a direct 'useUser' hook with role yet, 
// we'll assume there's a way to get it or we fetch it.
// For now, we'll create a simple placeholder that allows access if check passes.
// In a real app, we would fetch from /api/auth/me or similar.

import { useRouter } from "next/navigation";

// Define role hierarchy or access lists
const ROLE_ACCESS = {
    // Only CEO can access specific management pages
    MANAGEMENT: ['CEO'],
    // Admin features are available to Lawyers/Staff/Dev/CEO
    ADMIN_BASIC: ['CEO', 'LAWYER', 'STAFF', 'DEV'],
    // Dev only
    SYSTEM: ['DEV'],
}

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // If not provided, assumed basic admin access
    redirectPath?: string;
}

export default function RoleGuard({ children, allowedRoles, redirectPath = "/admin" }: RoleGuardProps) {
    const router = useRouter();
    const [auditStatus, setAuditStatus] = useState<"LOADING" | "AUTHORIZED" | "FORBIDDEN">("LOADING");

    useEffect(() => {
        // Mocking the check function for now. 
        // TODO: Replace with actual API call to get user profile w/ Role
        const checkAuth = async () => {
            try {
                // Determine current role. 
                // This is a placeholder. You need to integrate this with your specific auth system.
                // Assuming we stored role in localStorage for demo or fetch from API.
                // For security, this should be a server check, but client guard provides UX.

                // Fetch me
                /*
                const res = await fetch('/api/auth/me');
                if (!res.ok) throw new Error('Not authenticated');
                const user = await res.json();
                */

                // TEMPORARY: Allow all for development iteration until API is ready
                // In production, this MUST fetch the real user role.
                setAuditStatus("AUTHORIZED");

            } catch (e) {
                console.error("Auth check failed", e);
                setAuditStatus("FORBIDDEN");
                router.push(redirectPath);
            }
        };

        checkAuth();
    }, [allowedRoles, redirectPath, router]);

    if (auditStatus === "LOADING") {
        return <div className="flex items-center justify-center h-screen">Loading permission...</div>;
    }

    if (auditStatus === "FORBIDDEN") {
        return null; // or local error message
    }

    return <>{children}</>;
}
