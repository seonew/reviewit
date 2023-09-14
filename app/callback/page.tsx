"use client";

import { AuthInfo, initCallbackPage } from "coco-people-client";
import { useCallback, useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import { useRouter } from "next/navigation";

export default function Page() {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);
  const { fetchUserInfo, setIsSignedIn, user, isSignedIn } = useStore();
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const authInfo = await initCallbackPage();
      setAuthInfo(authInfo);
      setIsSignedIn(true);

      if (authInfo?.accessToken) {
        fetchUserInfo(authInfo?.accessToken);
      }

      if (authInfo !== null) {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
      setIsSignedIn(false);
    }
  }, [fetchUserInfo, router, setIsSignedIn]);

  useEffect(() => {
    if (user.id !== "") {
      return;
    }

    initialize();
  }, [initialize, user.id]);

  return <></>;
}
