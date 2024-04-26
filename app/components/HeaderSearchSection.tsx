import HeaderSearchBox from "@/app/components/HeaderSearchBox";
import { useBoundStore as useStore } from "@/store";
import { useRouter } from "next/navigation";

const HeaderSearchSection = () => {
  const { fetchSearchResults, query } = useStore();
  const router = useRouter();

  const handleClickSubmit = async (query: string) => {
    await fetchSearchResults(query, 1);
    router.push(`/search?query=${query}`);
  };

  return (
    <div className="relative">
      <HeaderSearchBox onSubmit={handleClickSubmit} keyword={query} />
    </div>
  );
};

export default HeaderSearchSection;
