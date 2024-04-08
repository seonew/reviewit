import Link from "next/link";
import { ReviewProps } from "@/types";
import { DETAIL_BOOK_PATH, DETAIL_MOVIE_PATH } from "@/utils/constants";
import { BookOpenIcon, FilmIcon } from "@heroicons/react/24/solid";

type Props = {
  review: ReviewProps;
};

const LinkedContent = ({ review }: Props) => {
  return (
    <div className="flex-grow shrink-0 basis-0 w-full">
      <div className="flex items-center justify-items-center py-1">
        {review.type === "movie" ? (
          <FilmIcon className="w-4 h-4 text-orange-400 mr-1" />
        ) : (
          <BookOpenIcon className="w-4 h-4 text-sky-400 mr-1" />
        )}
        {review.contentTitle && (
          <Link
            href={`${
              review.type === "book" ? DETAIL_BOOK_PATH : DETAIL_MOVIE_PATH
            }/${review.contentId}`}
          >
            <p className="text-md font-semibold leading-6 text-gray-900">
              {review.contentTitle}
            </p>
          </Link>
        )}
      </div>
      <div className="text-sm leading-6 text-gray-600 whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
        {review.content}
      </div>
      <div className="text-xs leading-5">
        {review.userName && (
          <p className="font-semibold text-gray-900">{review.userName}</p>
        )}
        <p className="text-gray-400">{review.updateDate}</p>
      </div>
    </div>
  );
};

export default LinkedContent;
