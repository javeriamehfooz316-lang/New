import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const collectionName = body?.collectionName?.trim();
        const collectionImg = body?.collectionImg?.trim();
        const description = body?.description?.trim();

        if (!collectionName || !collectionImg || !description) {
            return NextResponse.json(
                {
                    success: false,
                    error: "collectionName, collectionImg, and description are required.",
                },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");

        await collection.insertOne({
            collectionName,
            collectionImg,
            description,
            createdAt: new Date(),
        });

        const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
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