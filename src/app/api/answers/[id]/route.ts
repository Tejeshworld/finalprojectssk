import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
    request: Request,
    context: any
) {
    try {
        const { id } = await context.params;
        const { getUserFromCookie } = await import('@/lib/auth');
        const user = await getUserFromCookie();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const answer = await prisma.answer.findUnique({
            where: { id },
            include: {
                doubt: true
            }
        });

        if (!answer) {
            return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
        }

        if (
            answer.authorId !== user.userId &&
            answer.doubt.authorId !== user.userId
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.answer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Answer deleted successfully' });
    } catch (error) {
        console.error('[ANSWER_DELETE]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
