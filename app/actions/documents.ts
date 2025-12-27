
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Update signature to accept userId and category
export async function uploadDocument(caseId: string | null, formData: FormData) {
    try {
        const session = await getSession();
        const userId = session?.userId as string | undefined;

        if (!userId) {
            return { success: false, error: 'Unauthorized: Login required' };
        }

        const file = formData.get('file') as File;
        const category = formData.get('category') as string || '기타';

        if (!file) {
            throw new Error('No file provided');
        }

        await ensureUploadDir();

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const uniqueFileName = `${randomUUID()}-${file.name}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        const fileUrl = `/uploads/${uniqueFileName}`;

        // Write file to disk (Local Storage Strategy)
        await fs.writeFile(filePath, buffer);

        // Get file size string (e.g., "DOCX 2.5 MB")
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1);
        const fileSizeString = `${fileSizeInMB} MB`;
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'unknown';

        // Save to DB
        const document = await prisma.document.create({
            data: {
                userId,
                caseId: caseId || undefined, // undefined to skip if null
                fileName: file.name,
                fileSize: fileSizeString,
                fileType: fileExtension,
                category,
                url: fileUrl,
            },
        });

        revalidatePath(`/dashboard/documents`);
        revalidatePath(`/dashboard/case_detail`);
        return { success: true, document };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload document' };
    }
}

export async function getDocuments(userId: string) {
    try {
        const documents = await prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { case: { select: { title: true } } }
        });
        return { success: true, documents };
    } catch (error) {
        console.error('Get documents error:', error);
        return { success: false, error: 'Failed to fetch documents' };
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            throw new Error('Document not found');
        }

        // Delete file from disk
        const filePath = path.join(process.cwd(), 'public', document.url);
        try {
            await fs.unlink(filePath);
        } catch (e) {
            console.warn("File could not be deleted from disk (might not exist):", filePath);
        }

        // Delete from DB
        await prisma.document.delete({
            where: { id: documentId },
        });

        revalidatePath(`/dashboard/case_detail`);
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Failed to delete document' };
    }
}
