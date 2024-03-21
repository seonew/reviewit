import { useRef, useState } from "react";
import { ReviewProps } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CommentTextEditor from "@/app/components/view/CommentTextEditor";
import PreferenceSection from "@/app/components/view/PreferenceSection";
import Modal from "./index";

type Props = {
  open: boolean;
  review?: ReviewProps;
  onClose: () => void;
  onSubmit?: (item: ReviewProps) => void;
};

const CommentModal = ({ open, review, onClose, onSubmit }: Props) => {
  const [like, setLike] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleSubmitReview = (item: string) => {
    if (review) {
      const modifiedReview: ReviewProps = {
        ...review,
        content: item,
        contentLike: like,
      };
      onSubmit?.(modifiedReview);
    }

    onClose();
  };

  const handleSubmitContentLike = (item: boolean) => {
    setLike(item);
  };

  const handleClickClose = () => {
    onClose();
  };

  return (
    <Modal open={open}>
      <div className="bg-white px-4 pb-4 pt-5">
        <div className="flex items-start">
          <div className="p-4 text-left">
            <div className="text-center ">
              <span className="text-lg font-semibold leading-6 text-gray-900">
                리뷰 쓰기
              </span>
              <button
                className="flex justify-center absolute top-5 right-5"
                onClick={handleClickClose}
                ref={cancelButtonRef}
              >
                <XMarkIcon className="h-7 w-7 font-bold" />
              </button>
            </div>
            <div className="my-6">
              <div className="relative mb-4 w-full">
                <div className="px-5">
                  <div className="pt-4 pb-2">
                    <PreferenceSection
                      contentLike={review?.contentLike}
                      onClick={handleSubmitContentLike}
                    />
                    <CommentTextEditor
                      content={review?.content}
                      onClick={handleSubmitReview}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
