"use client";

import { VideoImageBannerProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  info: VideoImageBannerProps;
};

const Banner = ({ info }: Props) => {
  return (
    <div className="banner-container">
      <Link className="initialize-absolute" href={info.link}>
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
        <div className="banner-info">
          <p className="banner-title">{info.title}</p>
          <span className="banner-description">{info.description}</span>
        </div>
        <div className="banner-background"></div>
      </Link>
    </div>
  );
};

export default Banner;
