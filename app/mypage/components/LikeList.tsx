import { ReviewProps } from "@/types";
import { HeartIcon } from "@heroicons/react/24/outline";
import LinkedImage from "./list/LinkedImage";
import LinkedContent from "./list/LinkedContent";

type Props = {
  title: string;
  reviews: ReviewProps[];
  onLike: (id: string) => void;
};

const LikeList = ({ title, reviews, onLike }: Props) => {
  const handleLikeReview = (id: string) => () => {
    onLike(id);
  };

  return (
    <>
      <div className="pb-2">
        <div className="py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">{title}</h2>
        </div>
        <ul role="list" className="divide-y divide-gray-100 break-words">
          {reviews.map((review: ReviewProps) => {
            return (
              <li key={review.id} className="flex justify-between py-4">
                <div className="flex gap-x-6 w-full">
                  <LinkedImage review={review} />
                  <LinkedContent review={review} />

                  <div className="-mt-2">
                    <button
                      onClick={handleLikeReview(review.id)}
                      className="p-2"
                    >
                      <span
                        className={`content-detail-comment-text-span ${
                          review.like && "text-ozip-blue"
                        }`}
                      >
                        <HeartIcon className="w-3 h-3 mr-0.5" />
                        <span>좋아요</span>
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LikeList;
