"use client";

import { handleClickSignIn } from "@/utils/common";
import { useBoundStore as useStore } from "@/store";
import { useEffect } from "react";

const UnauthorizedErrorPage = () => {
  const { checkTokenExpiration, signOut } = useStore();

  const handleClickSignInButton = async () => {
    const isTokenExpired = await checkTokenExpiration();
    if (!isTokenExpired) {
      handleClickSignIn();
      return;
    }
  };

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <div className="contents-container top-0">
      <main className="grid min-h-full place-items-center bg-white px-8">
        <div className="text-center">
          <h1 className="mt-4 font-bold tracking-tight text-gray-900 text-5xl">
            로그인이 필요합니다.
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            해당 페이지는 로그인이 필요한 페이지 입니다. 아래 버튼을 클릭하여
            로그인 해 주세요.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleClickSignInButton}
              className="rounded-md bg-ozip-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ozip-blue"
              aria-label="LoginButton"
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnauthorizedErrorPage;
