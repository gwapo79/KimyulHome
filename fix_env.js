
const fs = require('fs');
// User provided Pooler URL
const DB_URL = 'postgresql://postgres.pklzapardiddnxwmobcj:Adonis%40%402020@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

// We set Direct URL to the same for now, hoping push works, or we omit it if schema doesn't require it.
// Ideally Direct URL is needed for migrations, but if Direct is IPv6 only, we have no choice but to try Pooler or hope Pooler is IPv4.
// The user said "use this address".
const content = `DATABASE_URL="${DB_URL}"
DIRECT_URL="${DB_URL}"`;

fs.writeFileSync('.env', content, 'utf8');
console.log('.env updated with IPv4 Pooler URL');
