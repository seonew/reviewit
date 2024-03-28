import { NextResponse } from "next/server";
import { getUserBookmarks } from "@/app/api/common";

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const contentType = params.type;
    const result = await getUserBookmarks(contentType);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
}
