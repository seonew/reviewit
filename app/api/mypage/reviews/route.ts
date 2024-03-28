import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import { getMyReviews } from "@/app/api/common";
import { LIMIT } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const offset = (parseInt(page) - 1) * LIMIT;

  await dbConnect();

  try {
    const { reviews, count } = await getMyReviews(offset);
    const result = {
      reviews,
      count,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
