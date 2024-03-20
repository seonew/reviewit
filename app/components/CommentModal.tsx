import { Fragment, useRef, useState } from "react";
import { ReviewProps } from "@/types";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CommentTextEditor from "@/app/components/view/CommentTextEditor";
import PreferenceSection from "@/app/components/view/PreferenceSection";

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
    <Transition.Root show={open} as={Fragment}>
      <div className="relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
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
              </div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition.Root>
  );
};

export default CommentModal;
