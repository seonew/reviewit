import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/utils/db/mongodb";
import UserModel from "@/models/user";

const SERVICE = process.env.NEXT_PUBLIC_SERVICE ?? "";
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  try {
    if (!token) {
      return NextResponse.json({ error: "Empty token", status: 401 });
    }

    await dbConnect();

    const params = {
      token,
      loginService: SERVICE,
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${LOGIN_URL}/api/user/info?${queryString}`);
    const data = await response.json();

    cookies().set("token", token);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { id, name, avatarUrl, loginType } = requestData;

    await dbConnect();

    const user = await UserModel.findOne({ id });
    if (user === null) {
      const newUser = new UserModel({
        id,
        name,
        avatarUrl,
        loginType,
        loginService: SERVICE,
        registerDate: new Date(),
        updateDate: new Date(),
      });
      await newUser.save();
    } else {
      await user.updateOne({ updateDate: new Date() });
    }

    const result = {
      id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      loginType,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
}
