import getMongoClient from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function getSafeDbErrorMessage(error) {
    const lowerMessage = error?.message?.toLowerCase?.() || "";
    const isMongoConnectionIssue =
        lowerMessage.includes("server selection timed out") ||
        lowerMessage.includes("econnrefused") ||
        lowerMessage.includes("etimedout") ||
        lowerMessage.includes("authentication failed") ||
        lowerMessage.includes("bad auth") ||
        lowerMessage.includes("ssl") ||
        lowerMessage.includes("tls") ||
        lowerMessage.includes("certificate") ||
        lowerMessage.includes("handshake");

    if (isMongoConnectionIssue) {
        return "Database connection failed. Verify MONGODB_URI in Netlify, URL-encode special characters in password, and allow deployment network access in MongoDB Atlas.";
    }

    return "Unexpected server error while saving data.";
}

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

        const client = await getMongoClient();
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
                error: getSafeDbErrorMessage(error),
            },
            { status: 500 }
        );
    }
}