import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const client = await clientPromise;
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");

        
        await collection.insertOne({
            ...body,
            createdAt: new Date(),
        });
        
        const data = await collection.find({}).toArray();
        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}