import { getUserId } from "@/app/api/common";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import dbConnect from "@/utils/db/mongodb";
import { getMyReviews } from "./api/route";

export default async function Page() {
  const data = await getData();
  if (!data) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage myReiviewsApiData={data} />;
}

const getData = async () => {
  try {
    await dbConnect();
    getUserId();

    const { reviews, count } = await getMyReviews(0);
    return { reviews, count };
  } catch (error) {
    console.log(error);
  }
};
