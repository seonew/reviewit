import { ReviewProps } from "@/types";
import { useState } from "react";
import { useBoundStore as useStore } from "@/store";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/app/components/ConfirmModal";
import CommentModal from "@/app/components/CommentModal";
import LinkedImage from "./list/LinkedImage";
import LinkedContent from "./list/LinkedContent";

type Props = {
  title: string;
  reviews: ReviewProps[];
  onEdit: (modifiedReview: ReviewProps) => void;
  onDelete: (id: string) => void;
};

const ReviewList = ({ title, reviews, onEdit, onDelete }: Props) => {
  const {
    user,
    isConfirmModalOpen,
    isCommentModalOpen,
    setIsConfirmModalOpen,
    setIsCommentModalOpen,
  } = useStore();
  const [targetId, setTargetId] = useState("");
  const [targetReview, setTargetReview] = useState<ReviewProps>();

  const handleClickEdit = (review: ReviewProps) => () => {
    setIsCommentModalOpen(true);
    setTargetId(review.id);
    setTargetReview(review);
  };

  const handleClickDelete = (id: string) => () => {
    setIsConfirmModalOpen(true);
    setTargetId(id);
  };

  const handleClickConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    setTargetId("");
  };

  const handleClickConfirmModalConfirm = () => {
    setIsConfirmModalOpen(false);
    onDelete?.(targetId);
  };

  const handleClickCommentModalClose = () => {
    setIsCommentModalOpen(false);
    setTargetId("");
  };

  const handleClickSubmit = (modifiedReview: ReviewProps) => {
    onEdit?.(modifiedReview);
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

                  {user.id === review.userId && (
                    <div className="-mt-2">
                      <button className="p-2" onClick={handleClickEdit(review)}>
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2"
                        onClick={handleClickDelete(review.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <CommentModal
        open={isCommentModalOpen}
        review={targetReview}
        onSubmit={handleClickSubmit}
        onClose={handleClickCommentModalClose}
      />
      <ConfirmModal
        message={"해당 리뷰를 삭제하시겠습니까?"}
        open={isConfirmModalOpen}
        onConfirm={handleClickConfirmModalConfirm}
        onCancel={handleClickConfirmModalClose}
      />
    </>
  );
};

export default ReviewList;
