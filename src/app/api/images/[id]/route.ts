import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Immutable caching: image IDs never change content
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const image = await db.image.findUnique({
      where: { id },
      select: { mime: true, data: true },
    });
    if (!image) {
      return new NextResponse("Not found", { status: 404 });
    }
    return new NextResponse(new Uint8Array(image.data), {
      status: 200,
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
