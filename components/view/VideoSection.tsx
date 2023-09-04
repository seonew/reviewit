"use client";

import SectionTemplate from "./SectionTemplate";
import { ReactNode, useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/solid";
import HorizontalScrollButton from "./HorizontalScrollButton";
import { MediaVideoProps } from "@/utils/types";

const VideoSection = ({ videos: contents }: { videos: MediaVideoProps[] }) => {
  const uListElement = useRef<HTMLUListElement>(null);

  return (
    <SectionTemplate title="미디어">
      <div className="relative">
        <div className="relative z-0">
          <ul className="m-0 p-0 flex truncate list-none" ref={uListElement}>
            {contents.map((content: MediaVideoProps) => {
              return (
                <li key={content.id} className="mr-2.5 p-0 shrink-0 snap-start">
                  <div className="relative truncate w-64 h-56">
                    <a
                      className="flex flex-col"
                      href={content.link}
                      target="_blank"
                    >
                      <ImageWithFallback
                        src={content.backgroundImage}
                        fallbackSrc={`/no-image.png`}
                        title={content.title}
                      />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <HorizontalScrollButton
          contents={contents}
          limit={4}
          uListElement={uListElement}
        />
      </div>
    </SectionTemplate>
  );
};

export default VideoSection;

const PlayButton = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`flex items-center justify-center`}>
      <button
        type="button"
        aria-label={"play"}
        className="w-11 h-11 opacity-90 text-base text-center bg-black text-white flex items-center justify-center rounded-full shadow-md m-0 p-0"
      >
        <span className="inline-block text-xl opacity-100">{children}</span>
      </button>
    </div>
  );
};

const ImageWithFallback = ({
  src,
  fallbackSrc,
  title,
}: {
  src: string;
  fallbackSrc: string;
  title: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      <div className="w-250 h-180">
        <Image
          src={imgSrc}
          onError={() => {
            setImgSrc(fallbackSrc);
            setError(true);
          }}
          width={250}
          height={180}
          className="rounded h-full"
          alt={title}
        />
      </div>
      {!error && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <PlayButton>
              <PlayIcon className="w-6 h-7" />
            </PlayButton>
          </div>
          <p className="text-sm mt-1 truncate">{title}</p>
        </>
      )}
    </div>
  );
};
