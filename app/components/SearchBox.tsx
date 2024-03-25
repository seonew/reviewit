import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  onSubmit: (keyword: string) => void;
  keyword?: string;
};

const SearchBox = ({ onSubmit, keyword }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleChangeItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleSubmit = () => {
    const value = inputValue.trim();
    if (value.length === 0) {
      return;
    }

    onSubmit(inputValue);
  };

  useEffect(() => {
    if (keyword) {
      setInputValue(keyword);
    }
  }, [keyword]);

  return (
    <div className="relative">
      <div className="w-full h-10 border-2 border-ozip-blue rounded-md flex justify-cetner pl-3">
        <div className="inline-block grow shrink-0 basis-0">
          <input
            type="text"
            className="relative w-full h-9 outline-none"
            onChange={handleChangeItem}
            value={inputValue}
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

export default SearchBox;
