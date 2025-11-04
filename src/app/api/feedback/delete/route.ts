import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (token !== adminToken) {
      return NextResponse.json(
        { error: 'Forbidden - Invalid token' },
        { status: 403 }
      );
    }

    // Get feedback ID from request body
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Invalid feedback ID' },
        { status: 400 }
      );
    }

    // Delete the feedback
    const result = await db.delete(feedback).where(eq(feedback.id, id));

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
      id
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
