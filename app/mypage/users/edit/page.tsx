import { getUserId } from "@/app/api/common";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: `회원정보수정 | ${LOGO}`,
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

  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage isAuthorized={isAuthorized} />;
}
