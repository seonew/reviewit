import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from "react";
import { useBoundStore as useStore } from "@/store";

type Props = {
  onClick?: (keyword: string) => void;
};

const SearchSection = ({ onClick }: Props) => {
  const { setSearchKeyword, searchKeyword } = useStore();

  const handleChangeItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchKeyword(newValue);
  };

  const handleSubmit = () => {
    const value = searchKeyword.trim();
    if (value.length === 0) {
      return;
    }

    onClick?.(searchKeyword);
  };

  return (
    <div className="relative mb-3">
      <div className="w-full h-10 border-2 border-ozip-blue rounded-md flex justify-cetner pl-3">
        <div className="inline-block grow shrink-0 basis-0">
          <input
            type="text"
            className="relative w-full h-9 outline-none"
            onChange={handleChangeItem}
            value={searchKeyword}
          />
        </div>
        <div className="flex items-center bg-ozip-blue text-white">
          <button type="submit" onClick={handleSubmit} className="px-2.5 py-2">
            <MagnifyingGlassIcon className="w-6 h-6 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
