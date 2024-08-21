"use client";

import { VideoImageBannerProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  info: VideoImageBannerProps;
};

const NoCustomCSSBanner = ({ info }: Props) => {
  return (
    <div className="relative h-[500px] min-w-1024 my-10">
      <Link className="absolute top-0 left-0 right-0 bottom-0" href={info.link}>
        <Image
          priority={true}
          className="rounded opacity-95"
          src={info.backdropImage}
          alt={info.title}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="absolute left-0 right-0 bottom-0 flex flex-col justify-end h-[160px] w-[800px] px-10 pb-10 z-10">
          <p className="text-white text-3xl leading-10 font-bold text-ellipsis pb-4">
            {info.title}
          </p>
          <span className="text-white text-sm leading-5 text-ellipsis break-keep">
            {info.description}
          </span>
        </div>
        <div className="absolute bg-black opacity-10 w-full h-full bottom-0 rounded"></div>
      </Link>
    </div>
  );
};

export default NoCustomCSSBanner;
