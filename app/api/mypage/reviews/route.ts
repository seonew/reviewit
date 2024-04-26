import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import { getMyReviews } from "@/app/api/common";
import { ERROR_500_MESSAGE } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";

  await dbConnect();

  try {
    const { reviews, count } = await getMyReviews(parseInt(page));
    const result = {
      reviews,
      count,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE }, { status: 500 });
}
