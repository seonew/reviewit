"use client";

import { MovieProps, VideoImageBannerProps } from "@/types";
import Banner from "./components/Banner";
import SuspenseList from "./components/csr/SuspenseList";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo: VideoImageBannerProps | null;
};

const App = ({ movies, imageBannerInfo }: Props) => {
  return (
    <div className="relative top-20 block h-screen min-w-1024">
      {imageBannerInfo && <Banner info={imageBannerInfo} />}
      <SuspenseList movies={movies} />
    </div>
  );
};

export default App;
