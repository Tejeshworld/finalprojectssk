import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: { doubtId: string } }
) {
    try {
        const { getUserFromCookie } = await import('@/lib/auth');
        const user = await getUserFromCookie();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { doubtId } = params;

        const existing = await prisma.bookmark.findFirst({
            where: {
                userId: user.userId,
                doubtId: doubtId,
            }
        });

        if (!existing) {
            await prisma.bookmark.create({
                data: {
                    userId: user.userId,
                    doubtId: doubtId,
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Bookmark added' });
    } catch (error) {
        console.error('[BOOKMARK_POST]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { doubtId: string } }
) {
    try {
        const { getUserFromCookie } = await import('@/lib/auth');
        const user = await getUserFromCookie();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { doubtId } = params;

        await prisma.bookmark.deleteMany({
            where: {
                userId: user.userId,
                doubtId: doubtId,
            }
        });

        return NextResponse.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        console.error('[BOOKMARK_DELETE]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
