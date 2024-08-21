"use client";

import { MovieProps, VideoImageBannerProps } from "@/types";
import dynamic from "next/dynamic";
import NoCustomCSSBanner from "./components/csr/NoCustomCSSBanner";
import Skeleton from "./components/skeleton/CardListSkeleton";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo: VideoImageBannerProps | null;
};

const array = Array.from({ length: 5 }, (_, i) => i);
const ListComponent = dynamic(() => import("./components/csr/OnlyList"), {
  ssr: false,
  loading: () => <Skeleton arrayRows={array} />,
});

const App = ({ movies, imageBannerInfo }: Props) => {
  return (
    <div className="relative top-20 block h-screen min-w-1024">
      {imageBannerInfo && <NoCustomCSSBanner info={imageBannerInfo} />}
      <ListComponent movies={movies} />
    </div>
  );
};

export default App;
