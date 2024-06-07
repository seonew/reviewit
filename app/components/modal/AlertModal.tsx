"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useBoundStore as useStore } from "@/store";
import Modal from "./index";
import { useEffect } from "react";

const AlertModal = () => {
  const {
    isAlertModalOpen,
    modalMessage: message,
    alertCallback,
    initializeAlertModalData,
  } = useStore();

  const handleClickConfirm = () => {
    if (alertCallback) {
      alertCallback();
    }

    initializeAlertModalData();
  };

  useEffect(() => {
    initializeAlertModalData();
  }, [initializeAlertModalData]);

  return (
    <>
      {isAlertModalOpen && (
        <Modal open={isAlertModalOpen}>
          <div className="bg-white px-12 pb-4 pt-5">
            <div>
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center">
                <div className="mt-2">
                  <p className="text-sm text-gray-500 whitespace-pre-line">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
              onClick={handleClickConfirm}
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AlertModal;
