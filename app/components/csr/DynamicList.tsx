"use client";

import { MovieProps, VideoImageBannerProps } from "@/types";
import dynamic from "next/dynamic";
import CardListSkeleton from "../skeleton/CardListSkeleton";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo?: VideoImageBannerProps | null;
};

const array = Array.from({ length: 5 }, (_, i) => i);
const DynamicWithLoadingListPage = dynamic(() => import("./OnlyList"), {
  ssr: false,
  loading: () => (
    <>
      <CardListSkeleton arrayRows={array} />
    </>
  ),
});

const DynamicList = ({ movies }: Props) => {
  return <DynamicWithLoadingListPage movies={movies} />;
};

export default DynamicList;
