import { MovieProps } from "@/types";
import Image from "next/image";
import DefaultImage from "@/app/components/DefaultImage";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import HorizontalScrollButton from "./HorizontalScrollButton";

type Props = {
  contents: MovieProps[];
};

const ScrollContents = ({ contents }: Props) => {
  const uListElement = useRef<HTMLUListElement>(null);

  return (
    <>
      <div className="relative z-0">
        <ul className="m-0 p-0 flex truncate list-none" ref={uListElement}>
          {contents.map((content: MovieProps) => {
            return (
              <li key={content.id} className="mr-2.5 p-0 shrink-0 snap-start">
                <div className="relative">
                  <a className="flex flex-col" href={content.link}>
                    <div className="relative truncate w-32 h-56">
                      {content.posterImage ? (
                        <Image
                          src={content.posterImage}
                          width={130}
                          height={200}
                          alt={content.title}
                          className="rounded"
                        />
                      ) : (
                        <DefaultImage size="w-32 h-48">
                          <PhotoIcon className="w-16 h-16" />
                        </DefaultImage>
                      )}
                      <p className="text-sm mt-1 truncate">{content.title}</p>
                    </div>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <HorizontalScrollButton
        contents={contents}
        limit={8}
        uListElement={uListElement}
      />
    </>
  );
};

export default ScrollContents;
