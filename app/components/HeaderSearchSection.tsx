import HeaderSearchBox from "@/app/components/HeaderSearchBox";
import { useBoundStore as useStore } from "@/store";
import { useRouter } from "next/navigation";

const HeaderSearchSection = () => {
  const { fetchSearchResults, query } = useStore();
  const router = useRouter();

  const handleClickSubmit = (query: string) => {
    fetchSearchResults(query, 1);
    setTimeout(() => {
      router.push(`/search?query=${query}`);
    }, 1000);
  };

  return (
    <div className="relative">
      <HeaderSearchBox onSubmit={handleClickSubmit} keyword={query} />
    </div>
  );
};

export default HeaderSearchSection;
