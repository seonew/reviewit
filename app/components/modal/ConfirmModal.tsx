"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useBoundStore as useStore } from "@/store";
import Modal from "./index";
import { useEffect } from "react";

const ConfirmModal = () => {
  const {
    isConfirmModalOpen,
    modalMessage: message,
    confirmCallback,
    cancelCallback,
    initializeConfirmModalData,
  } = useStore();

  const handleClickConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }

    initializeConfirmModalData();
  };

  const handleClickCancel = () => {
    if (cancelCallback) {
      cancelCallback();
    }

    initializeConfirmModalData();
  };

  useEffect(() => {
    initializeConfirmModalData();
  }, [initializeConfirmModalData]);

  return (
    <>
      {isConfirmModalOpen && (
        <Modal open={isConfirmModalOpen}>
          <div className="bg-white px-8 pb-4 pt-6">
            <div className="flex items-center mt-1">
              <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-red-100 h-10 w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4 text-left">
                <div className="mx-0.5 my-1">
                  <p className="text-sm text-gray-500 whitespace-pre-line">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 py-3 flex flex-row-reverse px-6">
            <button
              type="button"
              className="mt-3 inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 ml-3 w-auto"
              onClick={handleClickConfirm}
            >
              확인
            </button>
            <button
              type="button"
              className="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-0 w-auto"
              onClick={handleClickCancel}
            >
              취소
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConfirmModal;
