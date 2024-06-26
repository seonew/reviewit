import Link from "next/link";
import { usePathname } from "next/navigation";

function Tab() {
  const pathname = usePathname();
  const reviewPath = "/mypage/reviews";
  const reviewLikePath = "/mypage/reviews/likes";

  return (
    <div className="flex h-12 text-sm font-semibold text-center gap-x-6 mb-4">
      <Link
        className={`${
          pathname === reviewPath ? "tab-active" : ""
        } flex items-center`}
        href={reviewPath}
      >
        내가 작성한 리뷰
      </Link>
      <Link
        className={`${
          pathname === reviewLikePath ? "tab-active" : ""
        } flex items-center`}
        href={reviewLikePath}
      >
        좋아요 누른 리뷰
      </Link>
    </div>
  );
}

export default Tab;
