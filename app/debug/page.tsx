
import { prisma } from '@/lib/prisma';

export default async function DebugPage() {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
        select: { id: true, email: true, provider: true, password: true }
    });

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Server Debug Info</h1>

            <section className="mb-6 border p-4 rounded">
                <h2 className="text-lg font-bold mb-2">Environment</h2>
                <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL || 'UNDEFINED'}</p>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            </section>

            <section className="mb-6 border p-4 rounded">
                <h2 className="text-lg font-bold mb-2">Database Connection</h2>
                <p><strong>User Count:</strong> {userCount}</p>
                <div className="mt-2">
                    <strong>Users Found:</strong>
                    <ul className="list-disc pl-5">
                        {users.map(u => (
                            <li key={u.id}>
                                {u.email} ({u.provider}) - Password Set: {u.password ? 'YES' : 'NO'}
                                <span className="text-gray-400 text-xs ml-2">ID: {u.id}</span>
                                {u.email === 'test' && u.password && (
                                    <div className="text-blue-600 font-bold ml-2">
                                        * Try logging in with: test / 1234
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                <p>⚠️ If <strong>DATABASE_URL</strong> does not start with <code>file:c:/...</code> (Absolute Path), you MUST restart the server.</p>
                <p>⚠️ If user 'test' is missing here, run <code>npm run seed</code> or check if you are using the correct database file.</p>
            </section>
        </div>
    );
}
