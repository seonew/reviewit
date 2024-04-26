import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import { ReviewDataProps } from "@/types";
import { getLikesForReviews } from "@/app/api/common";
import { ERROR_500_MESSAGE, LIMIT } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * LIMIT;

    const { reviews, count } = await getLikesForReviews(offset);
    const result: ReviewDataProps = {
      reviews,
      count,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE }, { status: 500 });
}
