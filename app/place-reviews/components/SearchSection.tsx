import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoundStore as useStore } from "@/store";
import SearchBox from "./SearchBox";

const SearchSection = () => {
  const { fetchPlaceReviewsWithKeyword } = useStore();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleChangeItem = (keyword: string) => {
    setInputValue(keyword);
  };

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (value.length === 0) {
      return;
    }

    const encodedKeyword = encodeURIComponent(inputValue);
    router.push(`/place-reviews/search?keyword=${encodedKeyword}`);
  };

  useEffect(() => {
    if (keyword) {
      setInputValue(keyword);
      fetchPlaceReviewsWithKeyword(keyword);
    }
  }, [fetchPlaceReviewsWithKeyword, keyword]);

  return (
    <SearchBox
      onChange={handleChangeItem}
      onClick={handleSubmit}
      searchKeyword={inputValue}
    />
  );
};

export default SearchSection;
