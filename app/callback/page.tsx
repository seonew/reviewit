"use client";

import { initCallbackPage } from "coco-people-auth";
import { useCallback, useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import { useRouter } from "next/navigation";

export default function Page() {
  const { fetchUserInfo, setIsSignedIn } = useStore();
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const authInfo = await initCallbackPage();
      setIsSignedIn(true);

      if (authInfo?.accessToken) {
        fetchUserInfo(authInfo?.accessToken);
      }

      if (authInfo !== null) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setIsSignedIn(false);
    }
  }, [fetchUserInfo, router, setIsSignedIn]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <></>;
}
