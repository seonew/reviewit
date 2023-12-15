import { PlaceReviewDataProps, PlaceReviewProps } from "@/types";
import Link from "next/link";
import {
  TagIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/solid";

type Props = {
  placeReviewData: PlaceReviewDataProps;
};

const PlaceReviewList = ({ placeReviewData }: Props) => {
  const { data } = placeReviewData;

  return (
    <div className="pb-10">
      <ul className="list-none my-10 mr-8">
        {data &&
          data.map((current: PlaceReviewProps) => {
            const { place, review } = current;

            return (
              <li key={review.id} className="mt-7">
                <div className="content-detail-comment-user">
                  <TagIcon
                    className={`w-5 h-4 m-2 ${getTagColor(place.categoryCode)}`}
                  />
                  <Link href={`${place.link}`}>
                    <span className="text-base leading-5 font-bold mr-1.5">
                      {place.name}
                    </span>
                  </Link>
                  {review.contentLike ? (
                    <span className="rounded-full bg-blue-400 p-1 w-5 h-5">
                      <HandThumbUpIcon className="w-3 h-3 text-white" />
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-400 p-1 w-5 h-5">
                      <HandThumbDownIcon className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <div className={`pl-9`}>
                  <div className={`content-detail-comment-user`}>
                    <p className="content-detail-comment-user-p">
                      {review.content}
                    </p>
                  </div>
                  <div className="content-detail-comment-user">
                    <span className="content-detail-comment-text-span">
                      {review.updateDate}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const getTagColor = (code: string): string => {
  let color: string;

  switch (code) {
    case "FD6":
      color = "text-red-600";
      break;
    case "CE7":
      color = "text-green-600";
      break;
    case "CT1":
      color = "text-amber-500";
      break;
    case "PM9":
      color = "text-slate-600";
      break;
    default:
      color = "text-slate-400";
  }

  return color;
};

export default PlaceReviewList;
