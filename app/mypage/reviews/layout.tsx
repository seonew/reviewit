"use client";

import { Tab } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reviewPath = "/mypage/reviews";
  const reviewLikePath = "/mypage/reviews/likes";

  const handleClickTab = () => {
    if (pathname === reviewLikePath) {
      router.push(reviewPath);
    } else {
      router.push(reviewLikePath);
    }
  };

  return (
    <div className="contents-container">
      <Tab.Group>
        <Tab.List className="flex h-12 text-sm font-semibold text-center gap-x-6 mb-4">
          <Tab
            className={pathname === reviewPath ? "tab-active" : ""}
            onClick={handleClickTab}
          >
            내가 작성한 리뷰
          </Tab>
          <Tab
            className={pathname === reviewLikePath ? "tab-active" : ""}
            onClick={handleClickTab}
          >
            좋아요 누른 리뷰
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>{children}</Tab.Panel>
          <Tab.Panel>{children}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
