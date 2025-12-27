'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getContacts() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, contacts };
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return { success: false, error: 'Failed to fetch contacts' };
    }
}

export async function getContact(id: string) {
    try {
        const contact = await prisma.contact.findUnique({
            where: { id }
        });
        return { success: true, contact };
    } catch (error) {
        console.error('Failed to fetch contact:', error);
        return { success: false, error: 'Failed to fetch contact' };
    }
}

export async function updateContactStatus(id: string, status: string) {
    try {
        const contact = await prisma.contact.update({
            where: { id },
            data: { status }
        });

        revalidatePath('/admin/contact');
        revalidatePath(`/admin/contact/${id}`);
        return { success: true, contact };
    } catch (error) {
        console.error('Failed to update contact status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function deleteContact(id: string) {
    try {
        await prisma.contact.delete({
            where: { id }
        });

        revalidatePath('/admin/contact');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete contact:', error);
        return { success: false, error: 'Failed to delete contact' };
    }
}
