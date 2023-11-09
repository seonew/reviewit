import dynamic from "next/dynamic";
import { getUserId } from "../api/common";
import dbConnect from "@/utils/db/mongodb";
import { getPlaceReviews } from "./api/search/review/route";

export default async function Page() {
  const reviews = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage reviews={reviews} />;
}

async function getData() {
  try {
    await dbConnect();

    const userId = getUserId();
    const isLogin = !userId ? false : true;

    if (!isLogin) {
      return null;
    }

    const result = await getPlaceReviews(0);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
