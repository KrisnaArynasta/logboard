import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Log from '@/models/log'; // Assuming you have a Log model

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure DB connection

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const linesContext = 3;

    // Fetch before, current, and after logs
    const before = await Log.find({ _id: { $lt: id } })
      .sort({ _id: -1 })
      .limit(linesContext)
      .lean();

    const current = await Log.findOne({ _id: id }).lean();

    const after = await Log.find({ _id: { $gt: id } })
      .sort({ _id: 1 })
      .limit(linesContext)
      .lean();

      const logs = [...(before || []), ...(current ? [current] : []), ...(after || [])];
      return NextResponse.json(logs);
      
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
