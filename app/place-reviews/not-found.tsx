"use client";

import { handleClickSignIn } from "@/utils/common";
import { useBoundStore as useStore } from "@/store";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LoginError({ error }: Props) {
  const { user } = useStore();

  const handleClickSignInButton = () => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }
  };

  return (
    <div className="contents-container">
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
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
