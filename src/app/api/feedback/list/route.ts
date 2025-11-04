import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';
import { like, desc, asc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    // Parse Bearer token
    const token = authHeader.replace('Bearer ', '').trim();
    const adminToken = process.env.ADMIN_TOKEN || 'admin_secret_token';

    if (token !== adminToken) {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const sortParam = searchParams.get('sort');
    const searchQuery = searchParams.get('search');

    // Validate and parse limit
    let limit = 50;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { error: 'Invalid limit parameter', code: 'INVALID_LIMIT' },
          { status: 400 }
        );
      }
      limit = Math.min(parsedLimit, 100);
    }

    // Validate and parse offset
    let offset = 0;
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json(
          { error: 'Invalid offset parameter', code: 'INVALID_OFFSET' },
          { status: 400 }
        );
      }
      offset = parsedOffset;
    }

    // Validate sort parameter
    const sort = sortParam?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    if (sortParam && sortParam.toLowerCase() !== 'asc' && sortParam.toLowerCase() !== 'desc') {
      return NextResponse.json(
        { error: 'Invalid sort parameter. Use "asc" or "desc"', code: 'INVALID_SORT' },
        { status: 400 }
      );
    }

    // Build query with search if provided
    let query = db.select().from(feedback);
    let countQuery = db.select({ count: count() }).from(feedback);

    if (searchQuery) {
      const searchCondition = like(feedback.feedbackText, `%${searchQuery}%`);
      query = query.where(searchCondition);
      countQuery = countQuery.where(searchCondition);
    }

    // Apply sorting
    const orderBy = sort === 'asc' ? asc(feedback.createdAt) : desc(feedback.createdAt);
    query = query.orderBy(orderBy);

    // Get total count
    const totalResult = await countQuery;
    const total = totalResult[0]?.count || 0;

    // Execute query with pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(
      {
        data: results,
        total,
        limit,
        offset
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}