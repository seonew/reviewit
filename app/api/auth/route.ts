import { NextResponse } from "next/server";
import { getUser } from "@/app/api/common";

export async function GET(request: Request) {
  try {
    let result = false;
    try {
      const user = await getUser();
      if (user) {
        result = true;
      }
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json(false);
}
