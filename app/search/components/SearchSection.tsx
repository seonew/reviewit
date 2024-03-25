import SearchBox from "@/app/components/SearchBox";
import { useBoundStore as useStore } from "@/store";

const SearchSection = () => {
  const { fetchSearchResults, query } = useStore();

  const handleClickSubmit = (query: string) => {
    fetchSearchResults(query, 1);
  };

  return (
    <div className="relative mt-10 mb-4">
      <SearchBox onSubmit={handleClickSubmit} keyword={query} />
    </div>
  );
};

export default SearchSection;
