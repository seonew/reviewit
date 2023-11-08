import { Fragment, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useBoundStore as useStore } from "@/store";
import CommentTextEditor from "@/app/components/view/CommentTextEditor";
import PreferenceSection from "@/app/components/view/PreferenceSection";

type Props = {
  onSubmit?: (item: any, like: boolean) => void;
};

const CommentModal = ({ onSubmit }: Props) => {
  const { openModal, setOpenModal, currentPlace } = useStore();
  const [like, setLike] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleSubmitReview = (item: string) => {
    onSubmit?.(item, like);
    setOpenModal(false);
  };

  const handleSubmitContentLike = (item: boolean) => {
    setLike(item);
  };

  const handleClick = () => {
    setOpenModal(false);
  };

  return (
    <Transition.Root show={openModal} as={Fragment}>
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
                          onClick={handleClick}
                          ref={cancelButtonRef}
                        >
                          <XMarkIcon className="h-7 w-7 font-bold" />
                        </button>
                      </div>
                      <div className="my-6">
                        <div className="relative mb-4 w-full">
                          <div className="px-5">
                            <div className="py-8 flex items-center">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                                <MapPinIcon className="h-4 w-4" />
                              </div>
                              <div className="ml-2">
                                <h3 className="font-semibold leading-6 text-gray-900">
                                  {currentPlace?.name}
                                </h3>
                                <p className="text-sm leading-6 text-gray-700 ">
                                  {currentPlace?.roadAddress}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 pb-2">
                              <PreferenceSection
                                onClick={handleSubmitContentLike}
                              />
                              <CommentTextEditor onClick={handleSubmitReview} />
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
