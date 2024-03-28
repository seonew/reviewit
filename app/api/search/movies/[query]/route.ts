import { NextResponse } from "next/server";
import { getMovies } from "../../[query]/route";
import { NotFoundContentError } from "@/utils/error";

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  try {
    const query = params.query;
    if (!query) {
      throw new NotFoundContentError();
    }
    const { searchParams } = new URL(request.url);
    const displayCount: number = parseInt(
      searchParams.get("displayCount") ?? "20"
    );
    const pageParam = searchParams.get("page") ?? "1";

    const moviesResult = await getMovies(
      query,
      parseInt(pageParam),
      displayCount
    );

    return NextResponse.json(moviesResult);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
