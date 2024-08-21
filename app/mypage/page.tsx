import dynamic from "next/dynamic";
import { getUserId } from "../api/common";
import { Metadata } from "next";
import { LOGO } from "@/utils/constants";
import UnauthorizedErrorPage from "./components/UnauthorizedErrorPage";
import MypageSkeleton from "../components/csr/skeleton/MypageSkeleton";

export const metadata: Metadata = {
  title: `마이페이지 | ${LOGO}`,
};

export default async function Page() {
  let userId = null;
  let isAuthorized = false;
  try {
    userId = await getUserId();
    isAuthorized = true;
  } catch (error) {
    console.log(error);
  }

  if (!isAuthorized) {
    return <UnauthorizedErrorPage />;
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
    loading: () => <MypageSkeleton />,
  });

  return <DynamicListPage />;
}
