import dynamic from "next/dynamic";

export default async function Home() {
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage />;
}
