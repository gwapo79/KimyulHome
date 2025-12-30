import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-prod-7744';
const key = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: any, expiresIn: string = '24h'): Promise<string> {
    const alg = 'HS256';
    return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}
