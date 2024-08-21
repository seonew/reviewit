import { ERROR_PAGE_404_MESSAGE, LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import SearchListSkeleton from "../components/csr/skeleton/SearchListSkeleton";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { query } = searchParams;
  let title = "";

  if (!query) {
    title = `${ERROR_PAGE_404_MESSAGE}`;
  } else {
    title = `${query}의 검색 결과 | ${LOGO}`;
  }

  return { title };
}

const DynamicListPage = dynamic(() => import("./list-page"), {
  ssr: false,
  // loading: () => <SearchListSkeleton />,
});

export default function Page({ searchParams }: Props) {
  const { query } = searchParams;
  if (!query) {
    notFound();
  }

  return <DynamicListPage keyword={query} />;
}
