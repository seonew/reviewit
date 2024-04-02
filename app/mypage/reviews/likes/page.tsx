import { getLikesForReviews } from "@/app/api/common";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `좋아요 누른 리뷰 | ${LOGO}`,
};

export default async function Page() {
  let isAuthorized = false;
  const data = await getData();
  isAuthorized = true;

  if (data === null) {
    isAuthorized = false;
  } else if (!data) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return (
    <DynamicListPage contentLikesApiData={data} isAuthorized={isAuthorized} />
  );
}

async function getData() {
  try {
    const { reviews, count } = await getLikesForReviews(0);
    return { reviews, count };
  } catch (error: any) {
    console.log(error);
    if (error.name === "UnauthorizedError") {
      return null;
    }
  }
}
