import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackText } = body;

    // Validate feedbackText presence
    if (!feedbackText) {
      return NextResponse.json(
        { 
          error: 'Feedback text is required',
          code: 'MISSING_FEEDBACK_TEXT' 
        },
        { status: 400 }
      );
    }

    // Validate feedbackText is a string
    if (typeof feedbackText !== 'string') {
      return NextResponse.json(
        { 
          error: 'Feedback text must be a string',
          code: 'INVALID_FEEDBACK_TEXT_TYPE' 
        },
        { status: 400 }
      );
    }

    // Trim and validate feedbackText is not empty
    const trimmedFeedbackText = feedbackText.trim();
    if (trimmedFeedbackText.length === 0) {
      return NextResponse.json(
        { 
          error: 'Feedback text cannot be empty',
          code: 'EMPTY_FEEDBACK_TEXT' 
        },
        { status: 400 }
      );
    }

    // Validate feedbackText length
    if (trimmedFeedbackText.length > 5000) {
      return NextResponse.json(
        { 
          error: 'Feedback text must not exceed 5000 characters',
          code: 'FEEDBACK_TEXT_TOO_LONG' 
        },
        { status: 400 }
      );
    }

    // Insert feedback into database
    const newFeedback = await db.insert(feedback)
      .values({
        feedbackText: trimmedFeedbackText,
        createdAt: new Date().toISOString()
      })
      .returning();

    // Return success response with minimal information
    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        id: newFeedback[0].id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST feedback error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}