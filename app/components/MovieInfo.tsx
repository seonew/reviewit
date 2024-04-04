import Image from "next/image";
import Link from "next/link";
import { LikedMovie } from "@/types";
import { useBoundStore as useStore } from "@/store";
import { handleClickSignIn } from "@/utils/common";
import Card from "@/app/components/Card";
import BookmarkButton from "./BookmarkButton";

type Props = {
  movie: LikedMovie;
};

const MovieInfo = ({ movie }: Props) => {
  const { id, title, posterImage, link, releaseDate, checked } = movie;
  const { addLikedMovie, deleteLikedMovie, checkTokenExpiration } = useStore();

  const handleClickItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const isTokenExpired = await checkTokenExpiration();
    if (!isTokenExpired) {
      handleClickSignIn();
      return;
    }

    const isChecked = checked;
    if (isChecked) {
      deleteLikedMovie(id);
    } else {
      addLikedMovie(movie);
    }
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      {link && (
        <Link href={link}>
          <Card height="h-52">
            {posterImage && (
              <Image
                src={posterImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain",
                }}
              />
            )}
            <BookmarkButton onClick={handleClickItem} checked={checked} />
          </Card>
          <div className="mt-2.5 text-sm font-normal min-w-0 break-keep break-words">
            <div className="overflow-hidden ">
              <span className="text-ozip-blue font-bold">{title}</span>
              <div className="overflow-hidden block">
                <span className="text-xs">
                  <span>{releaseDate}</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default MovieInfo;
