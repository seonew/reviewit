import { ReviewProps } from "@/types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBoundStore as useStore } from "@/store";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import CommentModal from "@/app/components/modal/CommentModal";
import LinkedImage from "./list/LinkedImage";
import LinkedContent from "./list/LinkedContent";

type Props = {
  title: string;
  reviews: ReviewProps[];
  onEdit: (modifiedReview: ReviewProps) => void;
  onDelete: (id: string, type: string) => void;
};

const ReviewList = ({ title, reviews, onEdit, onDelete }: Props) => {
  const {
    user,
    isCommentModalOpen,
    setIsCommentModalOpen,
    setConfirmModalData,
  } = useStore();
  const [targetReview, setTargetReview] = useState<ReviewProps>();
  const [portalElement, setPortalElement] = useState<Element | null>(null);

  const handleClickEdit = (review: ReviewProps) => () => {
    setIsCommentModalOpen(true);
    setTargetReview(review);
  };

  const handleClickDelete = (id: string, type: string) => () => {
    setConfirmModalData(
      true,
      "해당 리뷰를 삭제하시겠습니까?",
      confirmFunc(id, type)
    );
  };

  const handleClickCommentModalClose = () => {
    setIsCommentModalOpen(false);
  };

  const handleClickSubmit = (modifiedReview: ReviewProps) => {
    onEdit?.(modifiedReview);
  };

  const confirmFunc = (id: string, type: string) => () => {
    onDelete?.(id, type);
  };

  useEffect(() => {
    setPortalElement(document.getElementById("portal"));
  }, [isCommentModalOpen]);

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
                      <button
                        className="p-2"
                        onClick={handleClickEdit(review)}
                        aria-label="EditButton"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2"
                        onClick={handleClickDelete(review.id, review.type)}
                        aria-label="DeleteButton"
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
      {isCommentModalOpen && portalElement
        ? createPortal(
            <CommentModal
              open={isCommentModalOpen}
              review={targetReview}
              onSubmit={handleClickSubmit}
              onClose={handleClickCommentModalClose}
            />,
            portalElement
          )
        : null}
    </>
  );
};

export default ReviewList;
