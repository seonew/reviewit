import dynamic from "next/dynamic";
import { getUserId } from "../api/common";
import dbConnect from "@/utils/db/mongodb";
import { getPlaceReviews } from "./api/search/review/route";
import { notFound } from "next/navigation";

export default async function Page() {
  const data = await getData();
  if (!data) {
    notFound();
  }
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage reviews={data} />;
}

async function getData() {
  try {
    await dbConnect();
    getUserId();

    const offset = 0;
    const result = await getPlaceReviews(offset);
    return result;
  } catch (error) {
    console.log(error);
  }
}
