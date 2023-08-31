import dynamic from "next/dynamic";
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage id={id} />;
}
