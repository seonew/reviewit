import { getUserId } from "@/app/api/common";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getLikesForReviews } from "./api/route";
import dbConnect from "@/utils/db/mongodb";

export default async function Page() {
  const data = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage contentLikesApiData={data} />;
}

const getData = async () => {
  try {
    await dbConnect();
    await checkLogin();

    const { reviews, count } = await getLikesForReviews(0);
    return { reviews, count };
  } catch (error) {
    console.log(error);
    return { reviews: [], count: 0 };
  }
};

const checkLogin = async () => {
  const userId = getUserId();
  const isLogin = !userId ? false : true;

  if (!isLogin) {
    notFound();
  }
};
