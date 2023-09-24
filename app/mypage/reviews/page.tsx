import { getUserId } from "@/app/api/common";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default async function Page() {
  await checkLogin();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage />;
}

const checkLogin = async () => {
  const userId = getUserId();
  const isLogin = !userId ? false : true;

  if (!isLogin) {
    notFound();
  }
};
