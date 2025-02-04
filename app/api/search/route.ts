import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Log from '@/models/log';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Extract query parameters using .get() method
  const query = searchParams.get('query');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const filename = searchParams.get('filename');

  // Validate the query
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  // Split query into multiple terms by space
  const searchTerms = query.split(' ').map(term => term.trim()).filter(Boolean);

  // Build the MongoDB query
  const searchCriteria: any = {};

  // If there are multiple search terms, use $text search
  if (searchTerms.length > 0) {
    searchCriteria.$text = { $search: searchTerms.join(' ') };  // Use full-text search with multiple terms
  }

  // Add date range filters if they exist
  if (startDate || endDate) {
    const dateFilter: any = {};
    if (startDate) dateFilter['$gte'] = new Date(startDate);
    if (endDate) dateFilter['$lte'] = new Date(endDate);
    searchCriteria.time = dateFilter;
  }

  // Add filename regex filter if it exists
  if (filename) {
    searchCriteria.fileName = { $regex: filename, $options: 'i' }; // Case-insensitive regex search
  }

  try {
    await connectToDatabase();

    // Perform the search query with filters
    const logs = await Log.find(searchCriteria).lean();

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
