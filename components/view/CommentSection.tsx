"use client";

import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import CommentTextEditor from "./CommentTextEditor";
import { ReviewProps } from "@/utils/types";

type Props = {
  reviewData: {
    reviews: ReviewProps[];
    count: number;
  };
  onSubmit: (item: string) => void;
  onClickLike: (reviewId: string) => void;
};
const CommentSection = ({ reviewData, onSubmit, onClickLike }: Props) => {
  const { reviews, count } = reviewData;

  const handleSubmitReview = (item: string) => {
    onSubmit(item);
  };

  const handleLikeReview = (id: string) => () => {
    onClickLike(id);
  };

  return (
    <div className="content-detail-section">
      <section>
        <p className="content-detail-title-p">
          댓글
          <span className="content-detail-comment-p-span">{count ?? 0}</span>
        </p>
        <CommentTextEditor onClick={handleSubmitReview} />
        <ul className="list-none my-10 mr-8">
          {reviews.map((review: ReviewProps) => {
            return (
              <li key={review.id} className="mt-8 first:mt-0">
                <div className="pl-9">
                  <div className="content-detail-comment-user">
                    <UserCircleIcon className="content-detail-comment-user-icon" />
                    <span className="text-base leading-5 font-bold">
                      {review.author}
                    </span>
                  </div>
                  <div className="content-detail-comment-user w-1100">
                    <p className="content-detail-comment-user-p">
                      {review.content}
                    </p>
                  </div>
                  <div className="content-detail-comment-user">
                    <span className="content-detail-comment-text-span">
                      {review.updateDate}
                    </span>
                    <span className="divide-span">|</span>
                    <a onClick={handleLikeReview(review.id)}>
                      <span className="content-detail-comment-text-span">
                        <HeartIcon className="w-3.5 h-3.5 mr-0.5" />
                        <span>좋아요</span>
                      </span>
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default CommentSection;
