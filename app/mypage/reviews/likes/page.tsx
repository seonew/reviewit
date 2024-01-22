import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getLikesForReviews } from "./api/route";

export default async function Page() {
  const data = await getData();
  if (!data) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage contentLikesApiData={data} />;
}

async function getData() {
  try {
    const { reviews, count } = await getLikesForReviews(0);
    return { reviews, count };
  } catch (error) {
    console.log(error);
  }
}
