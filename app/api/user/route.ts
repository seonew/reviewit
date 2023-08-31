import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  try {
    if (!token) {
      return NextResponse.json({ error: "Empty token" }, { status: 401 });
    }

    const params = {
      token,
      loginService: process.env.NEXT_PUBLIC_SERVICE!,
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `http://localhost:3000/api/user/info?${queryString}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
