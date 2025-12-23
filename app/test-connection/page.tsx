'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
    const [status, setStatus] = useState('Testing...');
    const [sessionInfo, setSessionInfo] = useState('');

    useEffect(() => {
        async function check() {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    setStatus('❌ Connection Failed');
                    setSessionInfo(error.message);
                } else {
                    setStatus('✅ Connection Successful!');
                    setSessionInfo('Supabase client initialized and communicating.');
                }
            } catch (err: any) {
                setStatus('❌ Connection Failed');
                setSessionInfo(err.message);
            }
        }
        check();
    }, []);

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
            <div id="status" className="text-xl font-semibold mb-2">{status}</div>
            <div id="output" className="text-gray-600">{sessionInfo}</div>
        </div>
    );
}
