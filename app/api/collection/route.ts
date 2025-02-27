import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase(); // Ensure connection
    const collections = await db.connection?.db?.listCollections().toArray();

    const collectionNames = collections?.map((col: { name: string }) => col.name);

    return NextResponse.json({ collections: collectionNames });

  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
