import dbConnect from "@/utils/db/mongodb";
import BookmarkModel from "@/models/bookmark";
import { NextResponse } from "next/server";
import { getUserId, isBookmarked } from "@/app/api/common";
import { generateId } from "@/utils/common";
import { NotFoundContentError } from "@/utils/error";

export async function GET(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    await dbConnect();

    const { id: contentId, type: contentType } = params;
    if (!contentId) {
      throw new NotFoundContentError();
    }

    const data = await isBookmarked(contentType, contentId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error.name);
  }
  return NextResponse.json(false);
}

export async function POST(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const requestData = await request.json();
    const { id: contentId, type: contentType } = params;
    const { contentImgUrl, contentTitle } = requestData;

    if (!contentId) {
      throw new NotFoundContentError();
    }

    const userId = await getUserId();

    await dbConnect();
    const newBookmark = new BookmarkModel({
      id: generateId(),
      contentId,
      contentImgUrl,
      contentTitle,
      contentType,
      registerDate: new Date(),
      userId,
    });
    await newBookmark.save();

    return NextResponse.json({ checked: true });
  } catch (error: any) {
    console.log(error.name);
    return NextResponse.json({ error: error.name, status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { id: contentId, type: contentType } = params;
    if (!contentId) {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = await getUserId();
    await BookmarkModel.deleteOne({ contentId, contentType, userId });

    return NextResponse.json({ checked: false });
  } catch (error: any) {
    console.log(error.name);
    return NextResponse.json({ error: error.name, status: 500 });
  }
}
