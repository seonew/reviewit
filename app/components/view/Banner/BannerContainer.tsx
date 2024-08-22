import { ReactNode } from "react";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "../../DefaultImage";
import BookmarkButton from "../../BookmarkButton";

interface Props {
  title: string;
  backdropImage?: string;
  posterImage?: string;
  checked?: boolean;
  onClickBookmark: () => void;
  children?: ReactNode;
}
const BannerContainer = ({
  title,
  backdropImage,
  posterImage,
  checked,
  onClickBookmark,
  children,
}: Props) => {
  return (
    <div className="banner-container">
      {backdropImage && (
        <Image
          className="rounded opacity-95"
          src={backdropImage}
          alt={title}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      )}
      <div className="relative pt-24 ml-12 z-10">
        <div className="mx-7 my-3 flex items-center justify-center float-left">
          <div className="mx-1 flex justify-center z-30">
            {posterImage ? (
              <Image
                className="rounded"
                src={posterImage}
                alt={title}
                width={190}
                height={285}
              />
            ) : (
              <DefaultImage size="w-52 h-80">
                <PhotoIcon className="w-40 h-40" />
              </DefaultImage>
            )}
          </div>
          <div className="absolute">
            <div
              className={`rounded-lg w-64 h-80 shadow bg-gray-200 opacity-50 relative z-20`}
            ></div>
            <div className="relative z-30">
              <BookmarkButton onClick={onClickBookmark} checked={checked} />
            </div>
          </div>
        </div>
        {children}
      </div>
      <div className="banner-background opacity-60"></div>
    </div>
  );
};

export default BannerContainer;
