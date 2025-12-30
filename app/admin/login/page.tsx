
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                const data = await res.json();
                alert(data.error || "Access Denied");
            }
        } catch (err) {
            console.error(err);
            alert("Connection Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#1f2937] rounded-xl shadow-2xl border border-slate-700 p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/50">
                            <ShieldCheck className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">System Administrator</h1>
                    <p className="text-slate-400 text-sm">SECURE ACCESS ONLY</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full bg-[#374151] border border-slate-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                className="w-full bg-[#374151] border border-slate-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? "Authenticating..." : "Authorize Access"}
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-600 mt-4">
                            Unauthorized access is prohibited and monitored.
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
