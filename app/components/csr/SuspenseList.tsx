"use client";

import { MovieProps, VideoImageBannerProps } from "@/types";
import { lazy, Suspense } from "react";
import MainSkeleton from "./skeleton/MainSkeleton";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo?: VideoImageBannerProps | null;
};

const ListComponent = lazy(() => import("./OnlyList"));

const SuspenseList = ({ movies }: Props) => {
  return (
    <>
      <Suspense fallback={<MainSkeleton />}>
        <ListComponent movies={movies} />
      </Suspense>
    </>
  );
};

export default SuspenseList;
