import dbConnect from "@/utils/db/mongodb";
import { NotFoundContentError } from "@/utils/error";
import { NextResponse } from "next/server";
import PlaceReviewModel from "@/models/review/place";
import LocalModel from "@/models/local";
import { getUserId } from "@/app/api/common";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id;
    const requestData = await request.json();
    const { review, like, item } = requestData;

    if (!contentId) {
      throw new NotFoundContentError();
    }

    await dbConnect();

    const {
      id,
      name,
      address,
      category,
      mapx,
      mapy,
      roadAddress,
      telephone,
      link,
    } = item;
    const local = await LocalModel.findOne({ id });
    if (!local) {
      const newLocal = new LocalModel({
        id,
        name,
        address,
        category,
        mapx,
        mapy,
        roadAddress,
        telephone,
        link,
      });
      await newLocal.save();
    }

    const userId = getUserId();
    const newReview = new PlaceReviewModel({
      id: Date.now().toString(),
      contentId: item.id,
      content: review,
      contentLike: like,
      like: false,
      updateDate: new Date(),
      userId,
    });
    await newReview.save();

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
