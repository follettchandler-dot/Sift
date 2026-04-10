import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid API key required. Pass your key as: Authorization: Bearer sk_test_xxx" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: "ok",
    version: "v1",
    environment: auth.apiKey.environment,
    consumer: auth.consumer.name,
    timestamp: new Date().toISOString(),
  });
}
