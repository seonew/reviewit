import dynamic from "next/dynamic";

export default async function Page() {
  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage />;
}
