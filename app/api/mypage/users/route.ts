import dbConnect from "@/utils/db/mongodb";
import { getUserId } from "../../common";
import { NextResponse } from "next/server";
import UserModel from "@/models/user";
import { ERROR_500_MESSAGE } from "@/utils/constants";

export async function PATCH(request: Request) {
  try {
    const requestData = await request.json();
    const { name, avatarUrl } = requestData;
    if (name === "" && avatarUrl === "") {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = await getUserId();
    const user = await UserModel.findOne({ id: userId });

    const params: { name?: string; avatarUrl?: string; updateDate?: Date } = {};
    if (name !== "") {
      params.name = name;
    }
    if (avatarUrl !== "") {
      params.avatarUrl = avatarUrl;
    }
    params.updateDate = new Date();

    await user.updateOne(params);
    delete params.updateDate;

    return NextResponse.json(params);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE }, { status: 500 });
}
