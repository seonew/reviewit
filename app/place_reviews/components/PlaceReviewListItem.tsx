import { ReviewDataProps } from "@/utils/types";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

type Props = {
  items: ReviewDataProps;
};

const PlaceReviewListItem = ({ items }: Props) => {
  const { reviews } = items;
  const iconCSS = `absolute w-5 h-5 -left-7 rounded-full p-1`;

  return (
    <>
      {reviews &&
        reviews.map((review) => {
          return (
            <li key={review.id} className="mt-4 first:mt-0">
              <div className="pl-9">
                <div className="content-detail-comment-user">
                  <div className="flex items-center justify-center">
                    <p className="content-detail-comment-user-p text-sm">
                      {review.content}
                    </p>
                    {review.contentLike ? (
                      <span className={`bg-blue-400 ${iconCSS}`}>
                        <HandThumbUpIcon className="w-3 h-3 text-white" />
                      </span>
                    ) : (
                      <span className={`bg-red-400 ${iconCSS}`}>
                        <HandThumbDownIcon className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>
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
    </>
  );
};

export default PlaceReviewListItem;
