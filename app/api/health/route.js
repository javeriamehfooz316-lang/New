import getMongoClient from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function classifyHealthError(error) {
  const lowerMessage = error?.message?.toLowerCase?.() || "";

  if (!process.env.MONGODB_URI) {
    return "MONGODB_URI is missing in deployment environment variables.";
  }

  if (lowerMessage.includes("authentication failed") || lowerMessage.includes("bad auth")) {
    return "MongoDB authentication failed. Verify username/password in MONGODB_URI.";
  }

  if (
    lowerMessage.includes("ssl") ||
    lowerMessage.includes("tls") ||
    lowerMessage.includes("certificate") ||
    lowerMessage.includes("handshake")
  ) {
    return "TLS/SSL connection failed. Verify URI format and Atlas connectivity rules.";
  }

  if (
    lowerMessage.includes("server selection timed out") ||
    lowerMessage.includes("etimedout") ||
    lowerMessage.includes("econnrefused")
  ) {
    return "Database host unreachable. Check Atlas Network Access allowlist and internet connectivity.";
  }

  return "Database check failed. Review server logs for details.";
}

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db("TestDB");
    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      message: "Database connection is healthy.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: classifyHealthError(error),
      },
      { status: 500 }
    );
  }
}
