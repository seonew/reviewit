import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;
  const SERVICE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

  try {
    if (!token) {
      return NextResponse.json({ error: "Empty token" }, { status: 401 });
    }

    const params = {
      token,
      loginService: SERVICE,
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${SERVICE_URL}/api/user/info?${queryString}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
