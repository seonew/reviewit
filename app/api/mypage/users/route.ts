import dbConnect from "@/utils/db/mongodb";
import { getUserId } from "../../common";
import { NextResponse } from "next/server";
import UserModel from "@/models/user";

export async function PATCH(request: Request) {
  try {
    const requestData = await request.json();
    const { name } = requestData;
    if (!name) {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = await getUserId();
    const user = await UserModel.findOne({ id: userId });
    await user.updateOne({ name, updateDate: new Date() });

    return NextResponse.json({ name });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
