import { getMyReviews } from "@/app/api/common";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `내가 작성한 리뷰 | ${LOGO}`,
};

export default async function Page() {
  let isAuthorized = false;
  let data = null;

  try {
    data = await getData();
    isAuthorized = true;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      if (error.name === "UnauthorizedError") {
        isAuthorized = false;
      } else {
        notFound();
      }
    }
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return (
    <DynamicListPage myReiviewsApiData={data} isAuthorized={isAuthorized} />
  );
}

async function getData() {
  const { reviews, count } = await getMyReviews(1);
  return { reviews, count };
}
