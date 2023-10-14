import { PlaceReviewProps } from "@/utils/types";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";

type Props = {
  reviews: PlaceReviewProps[];
};

const PlaceReviewList = ({ reviews }: Props) => {
  return (
    <div className="pb-10">
      <ul className="list-none my-10 mr-8">
        {reviews &&
          reviews.map((review: PlaceReviewProps) => {
            return (
              <li key={review.id} className="mt-8 first:mt-0">
                <div className="pl-9">
                  <div className="content-detail-comment-user">
                    <UserCircleIcon className="content-detail-comment-user-icon" />
                    <Link href={`${review.localLink}`}>
                      <span className="text-base leading-5 font-bold mr-1.5">
                        {review.localName}
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
                  <div className="content-detail-comment-user">
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

export default PlaceReviewList;
